'use client'

import { useState } from 'react'
import { CheckCircle2, Circle, ChevronDown, ChevronUp, Sparkles, Bookmark, Trash2, Play } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Task } from '@/types'

interface Props {
  task: Task
  onComplete: (id: string) => void
  onToggleStep: (taskId: string, stepId: string, completed: boolean) => void
  onBreakdown: (task: Task) => void
  onBookmark: (task: Task) => void
  onDelete: (id: string) => void
  onStartTimer: (task: Task) => void
  isTopThree?: boolean
}

const priorityColors = {
  high: 'bg-red-500/20 text-red-400 border-red-500/30',
  medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  low: 'bg-zinc-700/50 text-zinc-400 border-zinc-700',
}

const priorityLabels = {
  high: 'Alta',
  medium: 'Média',
  low: 'Baixa',
}

export default function TaskCard({
  task,
  onComplete,
  onToggleStep,
  onBreakdown,
  onBookmark,
  onDelete,
  onStartTimer,
  isTopThree,
}: Props) {
  const [expanded, setExpanded] = useState(false)
  const completed = task.status === 'completed'
  const hasSteps = task.steps.length > 0
  const stepsCompleted = task.steps.filter(s => s.completed).length
  const progress = hasSteps ? Math.round((stepsCompleted / task.steps.length) * 100) : 0

  return (
    <div className={cn(
      'rounded-2xl border transition-all duration-200',
      completed
        ? 'bg-zinc-900/30 border-zinc-800/50 opacity-60'
        : isTopThree
          ? 'bg-zinc-900 border-violet-500/30 shadow-lg shadow-violet-500/5'
          : 'bg-zinc-900 border-zinc-800',
    )}>
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start gap-3">
          <button
            onClick={() => !completed && onComplete(task.id)}
            className="mt-0.5 shrink-0 transition-transform active:scale-90"
          >
            {completed
              ? <CheckCircle2 className="w-5 h-5 text-violet-400" />
              : <Circle className="w-5 h-5 text-zinc-600 hover:text-zinc-400" />
            }
          </button>

          <div className="flex-1 min-w-0">
            <p className={cn(
              'text-sm font-medium leading-snug',
              completed ? 'line-through text-zinc-600' : 'text-zinc-100',
            )}>
              {task.title}
              {task.context_bookmark && (
                <span className="ml-2 text-xs text-amber-400">● contexto salvo</span>
              )}
            </p>

            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <Badge
                variant="outline"
                className={cn('text-[10px] h-5 px-1.5', priorityColors[task.priority])}
              >
                {priorityLabels[task.priority]}
              </Badge>
              {isTopThree && (
                <Badge variant="outline" className="text-[10px] h-5 px-1.5 bg-violet-500/20 text-violet-300 border-violet-500/30">
                  ⚡ Top 3
                </Badge>
              )}
              {task.estimated_minutes && (
                <span className="text-[10px] text-zinc-600">
                  ~{task.estimated_minutes}min
                </span>
              )}
            </div>
          </div>

          {hasSteps && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Steps progress bar */}
        {hasSteps && !completed && (
          <div className="space-y-1">
            <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-violet-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[10px] text-zinc-600">
              {stepsCompleted}/{task.steps.length} passos
            </p>
          </div>
        )}

        {/* Context bookmark preview */}
        {task.context_bookmark && !expanded && (
          <div className="text-xs text-amber-400/80 bg-amber-500/10 rounded-lg px-3 py-2 border border-amber-500/20">
            💡 {task.context_bookmark}
          </div>
        )}

        {/* Steps list */}
        {expanded && hasSteps && (
          <div className="space-y-2 pt-1">
            {task.steps.map(step => (
              <button
                key={step.id}
                onClick={() => onToggleStep(task.id, step.id, !step.completed)}
                className="w-full flex items-start gap-2.5 text-left group"
              >
                {step.completed
                  ? <CheckCircle2 className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" />
                  : <Circle className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 mt-0.5 shrink-0 transition-colors" />
                }
                <span className={cn(
                  'text-xs leading-relaxed',
                  step.completed ? 'line-through text-zinc-600' : 'text-zinc-300',
                )}>
                  {step.content}
                </span>
              </button>
            ))}

            {task.context_bookmark && (
              <div className="text-xs text-amber-400/80 bg-amber-500/10 rounded-lg px-3 py-2 border border-amber-500/20 mt-2">
                <p className="text-amber-400 font-medium text-[10px] mb-1">Onde parei:</p>
                {task.context_bookmark}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        {!completed && (
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => onStartTimer(task)}
              className="flex items-center gap-1.5 bg-violet-600/20 hover:bg-violet-600/30 text-violet-400 text-xs px-3 py-1.5 rounded-lg transition-colors border border-violet-500/20"
            >
              <Play className="w-3 h-3" />
              Focar
            </button>
            <button
              onClick={() => onBreakdown(task)}
              className="flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-xs px-3 py-1.5 rounded-lg transition-colors"
            >
              <Sparkles className="w-3 h-3" />
              {hasSteps ? 'Refazer' : 'Quebrar IA'}
            </button>
            <button
              onClick={() => onBookmark(task)}
              className="flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-xs px-3 py-1.5 rounded-lg transition-colors"
            >
              <Bookmark className="w-3 h-3" />
              Pausar
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="ml-auto text-zinc-700 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-500/10"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
