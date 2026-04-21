'use client'

import { useState } from 'react'
import { Plus, Sparkles, Zap } from 'lucide-react'
import { useTasks } from '@/hooks/useTasks'
import { useDayPlan } from '@/hooks/useDayPlan'
import TaskCard from '@/components/tasks/TaskCard'
import NewTaskSheet from '@/components/tasks/NewTaskSheet'
import BreakdownSheet from '@/components/tasks/BreakdownSheet'
import BookmarkSheet from '@/components/tasks/BookmarkSheet'
import TimerModal from '@/components/timer/TimerModal'
import { Card } from '@/components/ui/card'
import { formatDisplayDate, todayDate } from '@/lib/utils'
import type { Task } from '@/types'
import { toast } from 'sonner'

const energyLabels = ['', '😴 Muito baixa', '😕 Baixa', '😐 Média', '😊 Boa', '⚡ Ótima']
const energyEmojis = ['', '😴', '😕', '😐', '😊', '⚡']

export default function TodayPage() {
  const { tasks, loading, createTask, completeTask, deleteTask, saveSteps, toggleStep, saveContextBookmark } = useTasks()
  const { plan, setEnergyLevel, suggestTopThree } = useDayPlan()

  const [newTaskOpen, setNewTaskOpen] = useState(false)
  const [breakdownTask, setBreakdownTask] = useState<Task | null>(null)
  const [bookmarkTask, setBookmarkTask] = useState<Task | null>(null)
  const [timerTask, setTimerTask] = useState<Task | null>(null)
  const [suggestingTopThree, setSuggestingTopThree] = useState(false)

  const today = todayDate()
  const topThreeIds = plan?.top_three_ids || []
  const pendingTasks = tasks.filter(t => t.status !== 'completed')
  const completedTasks = tasks.filter(t => t.status === 'completed')
  const topThree = tasks.filter(t => topThreeIds.includes(t.id))
  const otherTasks = pendingTasks.filter(t => !topThreeIds.includes(t.id))

  async function handleCreate(title: string, priority: Task['priority']) {
    await createTask(title, priority)
  }

  async function handleSuggestTopThree() {
    if (!plan?.energy_level) {
      toast.info('Primeiro defina seu nível de energia hoje.')
      return
    }
    setSuggestingTopThree(true)
    await suggestTopThree(pendingTasks)
    setSuggestingTopThree(false)
    toast.success('Top 3 sugerido pela IA!')
  }

  async function handleCompleteTask(id: string) {
    await completeTask(id)
    setTimerTask(null)
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      {/* Header */}
      <div className="px-5 pt-14 pb-5 space-y-1.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-violet-600 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" fill="currentColor" />
          </div>
          <span className="text-sm text-zinc-500 capitalize">{formatDisplayDate(today)}</span>
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Hoje</h1>
      </div>

      <div className="px-5 space-y-6 pb-32">

        {/* Energy Level */}
        <Card className="bg-zinc-900 border-zinc-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-base font-semibold text-zinc-100">Como está sua energia?</p>
            {plan?.energy_level && (
              <span className="text-sm text-zinc-400">{energyLabels[plan.energy_level]}</span>
            )}
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(level => (
              <button
                key={level}
                onClick={() => setEnergyLevel(level)}
                className={`flex-1 h-11 rounded-xl text-lg font-bold transition-all active:scale-95 ${
                  plan?.energy_level === level
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-500/30 scale-105'
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                }`}
              >
                {energyEmojis[level]}
              </button>
            ))}
          </div>
        </Card>

        {/* Top 3 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-zinc-100 flex items-center gap-2">
              <span className="text-violet-400">⚡</span> Top 3 de hoje
            </h2>
            <button
              onClick={handleSuggestTopThree}
              disabled={suggestingTopThree}
              className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-violet-400 transition-colors disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {suggestingTopThree ? 'Sugerindo...' : 'Sugerir IA'}
            </button>
          </div>

          {topThree.length === 0 ? (
            <Card className="bg-zinc-900/40 border-dashed border-zinc-800 rounded-2xl p-6 text-center">
              <p className="text-sm text-zinc-600">
                Adicione tarefas e use &quot;Sugerir IA&quot; para definir seu foco.
              </p>
            </Card>
          ) : (
            <div className="space-y-2.5">
              {topThree.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  isTopThree
                  onComplete={handleCompleteTask}
                  onToggleStep={toggleStep}
                  onBreakdown={setBreakdownTask}
                  onBookmark={setBookmarkTask}
                  onDelete={deleteTask}
                  onStartTimer={setTimerTask}
                />
              ))}
            </div>
          )}
        </div>

        {/* Other tasks */}
        {otherTasks.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Outras tarefas</h2>
            <div className="space-y-2.5">
              {otherTasks.map(task => (
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
        )}

        {/* Completed */}
        {completedTasks.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-zinc-600 flex items-center gap-2">
              ✅ Concluídas
              <span className="bg-zinc-800 text-zinc-500 text-xs px-2 py-0.5 rounded-full">
                {completedTasks.length}
              </span>
            </h2>
            <div className="space-y-2.5">
              {completedTasks.map(task => (
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
        )}

        {/* Empty state */}
        {!loading && tasks.length === 0 && (
          <div className="text-center py-16 space-y-4">
            <div className="text-6xl">🧠</div>
            <p className="text-zinc-300 font-semibold text-lg">Tela em branco? Ótimo.</p>
            <p className="text-zinc-600 text-sm leading-relaxed">
              Adicione uma tarefa e deixe a IA<br />quebrar em micro-passos.
            </p>
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => setNewTaskOpen(true)}
        aria-label="Nova tarefa"
        className="fixed bottom-24 right-5 w-[60px] h-[60px] bg-violet-600 hover:bg-violet-500 rounded-full shadow-xl shadow-violet-500/30 flex items-center justify-center transition-all active:scale-90"
      >
        <Plus className="w-7 h-7 text-white" strokeWidth={2.5} />
      </button>

      {/* Sheets & Modals */}
      <NewTaskSheet
        open={newTaskOpen}
        onClose={() => setNewTaskOpen(false)}
        onCreate={handleCreate}
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
        durationMinutes={plan?.energy_level && plan.energy_level <= 2 ? 15 : 25}
        onClose={() => setTimerTask(null)}
        onComplete={handleCompleteTask}
      />
    </div>
  )
}
