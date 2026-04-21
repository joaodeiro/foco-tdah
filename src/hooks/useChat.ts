'use client'

import { useState } from 'react'
import { useTasks } from '@/hooks/useTasks'
import { useDayPlan } from '@/hooks/useDayPlan'
import type { ChatAction, ChatContext, ChatMessage, Task } from '@/types'
import { showError } from '@/lib/errors'
import { todayDate } from '@/lib/utils'

/**
 * Hook que gerencia o chat com Kairos.
 *
 * Envia mensagem → API retorna texto + ações estruturadas → ações
 * são executadas via hooks existentes (useTasks, useDayPlan).
 *
 * A camada conversacional não duplica lógica: delega tudo para os mesmos
 * hooks que o resto da app usa. Chat é uma camada de entrada.
 */
export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)

  const { tasks, createTask, completeTask, saveContextBookmark, saveSteps } = useTasks()
  const { plan, setEnergyLevel, suggestTopThree } = useDayPlan()

  function findTask(titleOrId: string): Task | undefined {
    const exact = tasks.find(t => t.id === titleOrId)
    if (exact) return exact
    const lower = titleOrId.toLowerCase().trim()
    return tasks.find(t => {
      const title = t.title.toLowerCase()
      return title.includes(lower) || lower.includes(title)
    })
  }

  async function executeAction(action: ChatAction): Promise<void> {
    switch (action.type) {
      case 'create_task': {
        await createTask(action.payload.title, action.payload.priority || 'medium')
        return
      }
      case 'complete_task': {
        const task = findTask(action.payload.title_or_id)
        if (task) await completeTask(task.id)
        return
      }
      case 'save_context': {
        const task = findTask(action.payload.title_or_id)
        if (task) await saveContextBookmark(task.id, action.payload.bookmark)
        return
      }
      case 'set_energy': {
        await setEnergyLevel(action.payload.level)
        return
      }
      case 'suggest_top_three': {
        const pending = tasks.filter(t => t.status !== 'completed')
        await suggestTopThree(pending)
        return
      }
      case 'breakdown_task': {
        const task = findTask(action.payload.title_or_id)
        if (!task) return
        const res = await fetch('/api/ai/breakdown', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: task.title, description: task.description }),
        })
        if (!res.ok) return
        const data = await res.json() as { steps?: string[]; estimated_minutes?: number }
        await saveSteps(task.id, data.steps || [], data.estimated_minutes || 25)
        return
      }
      case 'reply_only':
      default:
        return
    }
  }

  async function send(userText: string) {
    const trimmed = userText.trim()
    if (!trimmed || loading) return

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
      createdAt: new Date().toISOString(),
    }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      const context: ChatContext = {
        pendingTasks: tasks
          .filter(t => t.status !== 'completed')
          .map(t => ({ id: t.id, title: t.title, priority: t.priority, status: t.status })),
        energyLevel: plan?.energy_level ?? null,
        todayDate: todayDate(),
      }

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, context }),
      })

      if (!res.ok) {
        showError(new Error('Não consegui conversar com Kairos agora.'))
        return
      }

      const data = await res.json() as { reply: string; actions: ChatAction[] }

      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.reply || 'Feito.',
        actions: data.actions,
        createdAt: new Date().toISOString(),
      }
      setMessages(prev => [...prev, assistantMsg])

      for (const action of data.actions || []) {
        await executeAction(action)
      }
    } catch (err) {
      showError(err)
    } finally {
      setLoading(false)
    }
  }

  function clear() {
    setMessages([])
  }

  return { messages, loading, send, clear }
}
