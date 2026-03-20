'use client'

import { useState } from 'react'
import { useTasks } from '@/hooks/useTasks'
import TaskCard from '@/components/tasks/TaskCard'
import NewTaskSheet from '@/components/tasks/NewTaskSheet'
import BreakdownSheet from '@/components/tasks/BreakdownSheet'
import BookmarkSheet from '@/components/tasks/BookmarkSheet'
import TimerModal from '@/components/timer/TimerModal'
import { Plus, CheckSquare } from 'lucide-react'
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

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <div className="px-4 pt-12 pb-4 space-y-1">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-4 h-4 text-violet-400" />
        </div>
        <h1 className="text-2xl font-bold text-white">Tarefas</h1>
      </div>

      <div className="px-4 space-y-4 pb-8">
        {/* Filter tabs */}
        <div className="flex bg-zinc-900 rounded-xl p-1 gap-1">
          {(['pending', 'completed', 'all'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === f ? 'bg-zinc-700 text-white' : 'text-zinc-500'
              }`}
            >
              {f === 'pending' ? 'Pendentes' : f === 'completed' ? 'Concluídas' : 'Todas'}
            </button>
          ))}
        </div>

        {/* Tasks list */}
        <div className="space-y-2">
          {!loading && filtered.length === 0 && (
            <p className="text-center text-zinc-600 text-sm py-8">
              {filter === 'completed' ? 'Nenhuma tarefa concluída ainda.' : 'Nenhuma tarefa pendente. 🎉'}
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

      {/* FAB */}
      <button
        onClick={() => setNewTaskOpen(true)}
        className="fixed bottom-24 right-4 w-14 h-14 bg-violet-600 hover:bg-violet-500 rounded-full shadow-lg shadow-violet-500/25 flex items-center justify-center transition-all active:scale-95"
      >
        <Plus className="w-6 h-6 text-white" strokeWidth={2.5} />
      </button>

      <NewTaskSheet
        open={newTaskOpen}
        onClose={() => setNewTaskOpen(false)}
        onCreate={(title, priority) => createTask(title, priority)}
      />
      <BreakdownSheet
        task={breakdownTask}
        onClose={() => setBreakdownTask(null)}
        onSave={saveSteps}
      />
      <BookmarkSheet
        task={bookmarkTask}
        onClose={() => setBookmarkTask(null)}
        onSave={saveContextBookmark}
      />
      <TimerModal
        task={timerTask}
        onClose={() => setTimerTask(null)}
        onComplete={handleCompleteTask}
      />
    </div>
  )
}
