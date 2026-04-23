'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { todayDate } from '@/lib/utils'
import type { Task, TaskStep } from '@/types'
import { showError, showSuccess } from '@/lib/errors'
import { appendWin } from '@/lib/journal'

export function useTasks(date?: string) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const targetDate = date || todayDate()

  const fetchTasks = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('tasks')
        .select(`*, task_steps(*)`)
        .eq('user_id', user.id)
        .eq('date', targetDate)
        .order('created_at', { ascending: true })

      if (error) { console.error(error); return }

      const mapped = (data || []).map(t => ({
        ...t,
        steps: (t.task_steps || []).sort((a: TaskStep, b: TaskStep) => a.order - b.order),
      }))
      setTasks(mapped)
    } finally {
      setLoading(false)
    }
  }, [targetDate])

  useEffect(() => { fetchTasks() }, [fetchTasks])

  async function createTask(title: string, priority: Task['priority'] = 'medium') {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('tasks')
      .insert({ title, priority, user_id: user.id, date: targetDate })
      .select()
      .single()

    if (error) { showError(error); return null }

    const task: Task = { ...data, steps: [] }
    setTasks(prev => [...prev, task])
    return task
  }

  async function updateTask(id: string, updates: Partial<Task>): Promise<boolean> {
    const { error } = await supabase
      .from('tasks')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) { showError(error); return false }

    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
    return true
  }

  async function completeTask(id: string) {
    const task = tasks.find(t => t.id === id)
    const ok = await updateTask(id, {
      status: 'completed',
      completed_at: new Date().toISOString(),
    })
    if (ok) {
      showSuccess('Tarefa concluída.', 'Registrei no diário de hoje.')
      // F-03: registro automático pós-sessão no diário
      if (task) {
        appendWin(task.title).catch(() => {/* não propaga */})
      }
    }
  }

  async function deleteTask(id: string) {
    const { error } = await supabase.from('tasks').delete().eq('id', id)
    if (error) { showError(error); return }
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  async function saveSteps(taskId: string, stepContents: string[], estimatedMinutes: number) {
    const newSteps = stepContents.map((content, i) => ({
      task_id: taskId,
      content,
      order: i,
      completed: false,
    }))

    const { data: inserted, error: insertError } = await supabase
      .from('task_steps')
      .insert(newSteps)
      .select()

    if (insertError) { showError(insertError); return }

    const newIds = (inserted || []).map(s => s.id)
    const { error: deleteError } = await supabase
      .from('task_steps')
      .delete()
      .eq('task_id', taskId)
      .not('id', 'in', `(${newIds.join(',')})`)

    if (deleteError) console.error('Falha ao limpar passos antigos', deleteError)

    await updateTask(taskId, { estimated_minutes: estimatedMinutes })

    setTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, steps: inserted || [], estimated_minutes: estimatedMinutes } : t
    ))
  }

  async function toggleStep(taskId: string, stepId: string, completed: boolean) {
    const { error } = await supabase
      .from('task_steps')
      .update({ completed })
      .eq('id', stepId)

    if (error) return

    setTasks(prev => prev.map(t =>
      t.id === taskId
        ? { ...t, steps: t.steps.map(s => s.id === stepId ? { ...s, completed } : s) }
        : t
    ))
  }

  async function saveContextBookmark(taskId: string, bookmark: string) {
    const ok = await updateTask(taskId, { context_bookmark: bookmark, status: 'paused' })
    if (ok) showSuccess('Contexto salvo.', 'Pode pausar sem perder de onde parou.')
  }

  return {
    tasks,
    loading,
    refresh: fetchTasks,
    createTask,
    updateTask,
    completeTask,
    deleteTask,
    saveSteps,
    toggleStep,
    saveContextBookmark,
  }
}
