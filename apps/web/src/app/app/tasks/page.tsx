'use client'

import { useState } from 'react'
import { useTasks } from '@/hooks/useTasks'
import { useProfile } from '@/hooks/useProfile'
import TaskCard from '@/components/tasks/TaskCard'
import BreakdownSheet from '@/components/tasks/BreakdownSheet'
import BookmarkSheet from '@/components/tasks/BookmarkSheet'
import TimerModal from '@/components/timer/TimerModal'
import type { Task } from '@/types'

export default function TasksPage() {
  const { tasks, loading, completeTask, deleteTask, saveSteps, toggleStep, saveContextBookmark } = useTasks()
  const { preferredMinutes } = useProfile()
  const [breakdownTask, setBreakdownTask] = useState<Task | null>(null)
  const [bookmarkTask, setBookmarkTask] = useState<Task | null>(null)
  const [timerTask, setTimerTask] = useState<Task | null>(null)
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('pending')

  const filtered = tasks.filter(t => {
    if (filter === 'pending') return t.status !== 'completed'
    if (filter === 'completed') return t.status === 'completed'
    return true
  })

  async function handleCompleteTask(id: string) {
    await completeTask(id)
    setTimerTask(null)
  }

  const filters: { value: typeof filter; label: string }[] = [
    { value: 'pending', label: 'Pendentes' },
    { value: 'completed', label: 'Concluídas' },
    { value: 'all', label: 'Todas' },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="px-6 md:px-12 pt-14 md:pt-20 pb-10 max-w-xl md:max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-3">
          <span className="font-mono text-[11px] tracking-[0.1em] text-ink-faint tabular-nums">II</span>
          <span className="h-px flex-1 bg-hairline" />
          <span className="eyebrow">Coleção · N = {tasks.length}</span>
        </div>
        <h1 className="font-serif text-5xl md:text-6xl leading-none text-ink">Tarefas</h1>
      </header>

      <div className="px-6 md:px-12 space-y-8 pb-24 md:pb-20 max-w-xl md:max-w-2xl mx-auto">

        {/* Filter pills */}
        <div className="flex gap-1.5">
          {filters.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-1.5 rounded-full text-[13px] transition-colors border ${
                filter === f.value
                  ? 'bg-ink text-background border-ink'
                  : 'bg-transparent text-ink-muted border-hairline hover:border-ink/40'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {!loading && filtered.length === 0 && (
            <p className="text-center text-sm text-ink-faint py-12 italic font-serif">
              {filter === 'completed' ? 'Nenhuma concluída ainda.' : 'Nada pendente por aqui.'}
            </p>
          )}
          {filtered.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onComplete={handleCompleteTask}
              onToggleStep={toggleStep}
              onBreakdown={setBreakdownTask}
              onBookmark={setBookmarkTask}
              onDelete={deleteTask}
              onStartTimer={setTimerTask}
            />
          ))}
        </div>
      </div>

      <BreakdownSheet task={breakdownTask} onClose={() => setBreakdownTask(null)} onSave={saveSteps} />
      <BookmarkSheet task={bookmarkTask} onClose={() => setBookmarkTask(null)} onSave={saveContextBookmark} />
      <TimerModal task={timerTask} durationMinutes={preferredMinutes} onClose={() => setTimerTask(null)} onComplete={handleCompleteTask} />
    </div>
  )
}
