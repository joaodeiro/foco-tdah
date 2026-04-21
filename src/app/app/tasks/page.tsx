'use client'

import { useState } from 'react'
import { useTasks } from '@/hooks/useTasks'
import TaskCard from '@/components/tasks/TaskCard'
import NewTaskSheet from '@/components/tasks/NewTaskSheet'
import BreakdownSheet from '@/components/tasks/BreakdownSheet'
import BookmarkSheet from '@/components/tasks/BookmarkSheet'
import TimerModal from '@/components/timer/TimerModal'
import { Plus } from 'lucide-react'
import type { Task } from '@/types'

export default function TasksPage() {
  const { tasks, loading, createTask, completeTask, deleteTask, saveSteps, toggleStep, saveContextBookmark } = useTasks()
  const [newTaskOpen, setNewTaskOpen] = useState(false)
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
      <header className="px-6 md:px-12 pt-14 md:pt-20 pb-8 max-w-xl md:max-w-2xl mx-auto">
        <p className="eyebrow">Coleção</p>
        <h1 className="font-serif text-5xl md:text-6xl leading-none text-ink mt-3">Tarefas</h1>
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

      <button
        onClick={() => setNewTaskOpen(true)}
        aria-label="Nova tarefa"
        className="fixed bottom-24 right-6 md:bottom-10 md:right-10 w-14 h-14 bg-ink hover:bg-terracotta text-background rounded-full shadow-lg shadow-ink/10 flex items-center justify-center transition-all active:scale-90"
      >
        <Plus className="w-6 h-6" strokeWidth={2} />
      </button>

      <NewTaskSheet open={newTaskOpen} onClose={() => setNewTaskOpen(false)} onCreate={(t, p) => createTask(t, p)} />
      <BreakdownSheet task={breakdownTask} onClose={() => setBreakdownTask(null)} onSave={saveSteps} />
      <BookmarkSheet task={bookmarkTask} onClose={() => setBookmarkTask(null)} onSave={saveContextBookmark} />
      <TimerModal task={timerTask} onClose={() => setTimerTask(null)} onComplete={handleCompleteTask} />
    </div>
  )
}
