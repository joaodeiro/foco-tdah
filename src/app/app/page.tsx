'use client'

import { useState } from 'react'
import { Plus, Sparkles } from 'lucide-react'
import { useTasks } from '@/hooks/useTasks'
import { useDayPlan } from '@/hooks/useDayPlan'
import TaskCard from '@/components/tasks/TaskCard'
import NewTaskSheet from '@/components/tasks/NewTaskSheet'
import BreakdownSheet from '@/components/tasks/BreakdownSheet'
import BookmarkSheet from '@/components/tasks/BookmarkSheet'
import TimerModal from '@/components/timer/TimerModal'
import { formatDisplayDate, todayDate } from '@/lib/utils'
import type { Task } from '@/types'
import { showInfo, showSuccess } from '@/lib/errors'

const energyLabels = ['', 'Muito baixa', 'Baixa', 'Média', 'Boa', 'Ótima']
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
      showInfo('Defina sua energia primeiro.', 'A IA usa ela para escolher tarefas do seu tamanho agora.')
      return
    }
    setSuggestingTopThree(true)
    await suggestTopThree(pendingTasks)
    setSuggestingTopThree(false)
    showSuccess('Top 3 sugerido.', 'Começar por uma delas já vale o dia.')
  }

  async function handleCompleteTask(id: string) {
    await completeTask(id)
    setTimerTask(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="px-6 md:px-12 pt-14 md:pt-20 pb-8 max-w-xl md:max-w-2xl mx-auto">
        <p className="eyebrow capitalize">{formatDisplayDate(today)}</p>
        <h1 className="font-serif text-5xl md:text-6xl leading-none text-ink mt-3">Hoje</h1>
      </header>

      <div className="px-6 md:px-12 space-y-10 md:space-y-14 pb-32 md:pb-20 max-w-xl md:max-w-2xl mx-auto">

        {/* Energy */}
        <section className="space-y-4">
          <div className="flex items-baseline justify-between">
            <h2 className="font-serif text-xl text-ink">Como está sua energia?</h2>
            {plan?.energy_level && (
              <span className="text-sm text-ink-muted italic font-serif">
                {energyLabels[plan.energy_level]}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(level => (
              <button
                key={level}
                onClick={() => setEnergyLevel(level)}
                className={`flex-1 h-12 rounded-xl text-lg transition-all active:scale-95 border ${
                  plan?.energy_level === level
                    ? 'bg-ink text-background border-ink'
                    : 'bg-surface text-ink border-hairline hover:border-ink/30'
                }`}
              >
                {energyEmojis[level]}
              </button>
            ))}
          </div>
        </section>

        {/* Top 3 */}
        <section className="space-y-4">
          <div className="flex items-baseline justify-between">
            <h2 className="font-serif text-xl text-ink">Top 3 de hoje</h2>
            <button
              onClick={handleSuggestTopThree}
              disabled={suggestingTopThree}
              className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-terracotta transition-colors disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" strokeWidth={1.6} />
              {suggestingTopThree ? 'Sugerindo…' : 'Sugerir IA'}
            </button>
          </div>

          {topThree.length === 0 ? (
            <div className="border border-dashed border-hairline rounded-2xl p-8 text-center">
              <p className="text-sm text-ink-faint leading-relaxed">
                Adicione tarefas e use <em className="font-serif">Sugerir IA</em>
                <br />
                para definir seu foco.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
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
        </section>

        {/* Outras */}
        {otherTasks.length > 0 && (
          <section className="space-y-4">
            <h2 className="eyebrow">Outras tarefas</h2>
            <div className="space-y-3">
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
          </section>
        )}

        {/* Concluídas */}
        {completedTasks.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-baseline justify-between">
              <h2 className="eyebrow">Concluídas</h2>
              <span className="text-xs text-ink-faint tabular-nums">{completedTasks.length}</span>
            </div>
            <div className="space-y-3">
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
          </section>
        )}

        {/* Empty */}
        {!loading && tasks.length === 0 && (
          <div className="text-center py-16 space-y-4">
            <p className="font-serif text-2xl italic text-ink">Tela em branco?</p>
            <p className="text-sm text-ink-muted leading-relaxed">
              Ótimo. Adicione uma tarefa e deixe a IA
              <br />quebrar em micro-passos.
            </p>
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => setNewTaskOpen(true)}
        aria-label="Nova tarefa"
        className="fixed bottom-24 right-6 md:bottom-10 md:right-10 w-14 h-14 bg-ink hover:bg-terracotta text-background rounded-full shadow-lg shadow-ink/10 flex items-center justify-center transition-all active:scale-90"
      >
        <Plus className="w-6 h-6" strokeWidth={2} />
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
