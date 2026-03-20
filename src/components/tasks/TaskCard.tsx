'use client'

import { useState } from 'react'
import { CheckCircle2, Circle, ChevronDown, ChevronUp, Sparkles, Bookmark, Trash2, Play } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
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
  high: 'bg-red-500/15 text-red-400 border-red-500/25',
  medium: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  low: 'bg-zinc-700/40 text-zinc-400 border-zinc-700/60',
}

const priorityLabels = {
  high: '🔴 Alta',
  medium: '🟡 Média',
  low: '⚪ Baixa',
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
    <Card className={cn(
      'rounded-2xl border transition-all duration-200 overflow-hidden',
      completed
        ? 'bg-zinc-900/20 border-zinc-800/40 opacity-55'
        : isTopThree
          ? 'bg-zinc-900 border-violet-500/25 shadow-lg shadow-violet-500/8'
          : 'bg-zinc-900 border-zinc-800/80',
    )}>
      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start gap-3.5">
          <button
            onClick={() => !completed && onComplete(task.id)}
            className="mt-0.5 shrink-0 transition-transform active:scale-90"
            aria-label={completed ? 'Concluída' : 'Marcar como concluída'}
          >
            {completed
              ? <CheckCircle2 className="w-6 h-6 text-violet-400" />
              : <Circle className="w-6 h-6 text-zinc-600 hover:text-zinc-300 transition-colors" />
            }
          </button>

          <div className="flex-1 min-w-0">
            <p className={cn(
              'text-base font-medium leading-snug',
              completed ? 'line-through text-zinc-600' : 'text-zinc-100',
            )}>
              {task.title}
              {task.context_bookmark && (
                <span className="ml-2 text-xs text-amber-400 font-normal">● contexto salvo</span>
              )}
            </p>

            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Badge
                variant="outline"
                className={cn('text-xs h-6 px-2', priorityColors[task.priority])}
              >
                {priorityLabels[task.priority]}
              </Badge>
              {isTopThree && (
                <Badge variant="outline" className="text-xs h-6 px-2 bg-violet-500/15 text-violet-300 border-violet-500/25">
                  ⚡ Top 3
                </Badge>
              )}
              {task.estimated_minutes && (
                <span className="text-xs text-zinc-600">
                  ~{task.estimated_minutes}min
                </span>
              )}
            </div>
          </div>

          {hasSteps && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-zinc-600 hover:text-zinc-300 transition-colors p-1"
              aria-label={expanded ? 'Recolher passos' : 'Expandir passos'}
            >
              {expanded
                ? <ChevronUp className="w-5 h-5" />
                : <ChevronDown className="w-5 h-5" />
              }
            </button>
          )}
        </div>

        {/* Steps progress bar */}
        {hasSteps && !completed && (
          <div className="space-y-1.5">
            <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-violet-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-zinc-600">
              {stepsCompleted} de {task.steps.length} passos concluídos
            </p>
          </div>
        )}

        {/* Context bookmark preview */}
        {task.context_bookmark && !expanded && (
          <div className="text-sm text-amber-400/90 bg-amber-500/8 rounded-xl px-3.5 py-3 border border-amber-500/15">
            💡 {task.context_bookmark}
          </div>
        )}

        {/* Steps list */}
        {expanded && hasSteps && (
          <div className="space-y-2.5 pt-1 border-t border-zinc-800/60">
            <p className="text-xs text-zinc-600 uppercase tracking-wider font-medium pt-1">Micro-passos</p>
            {task.steps.map((step, i) => (
              <button
                key={step.id}
                onClick={() => onToggleStep(task.id, step.id, !step.completed)}
                className="w-full flex items-start gap-3 text-left group"
              >
                <div className="flex items-center justify-center w-5 h-5 shrink-0 mt-0.5">
                  {step.completed
                    ? <CheckCircle2 className="w-5 h-5 text-violet-400" />
                    : <Circle className="w-5 h-5 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                  }
                </div>
                <span className={cn(
                  'text-sm leading-relaxed',
                  step.completed ? 'line-through text-zinc-600' : 'text-zinc-300',
                )}>
                  <span className="text-zinc-600 mr-1">{i + 1}.</span>
                  {step.content}
                </span>
              </button>
            ))}

            {task.context_bookmark && (
              <div className="text-sm text-amber-400/90 bg-amber-500/8 rounded-xl px-3.5 py-3 border border-amber-500/15 mt-3">
                <p className="text-amber-400 font-medium text-xs mb-1">📌 Onde parei:</p>
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
              className="flex items-center gap-2 bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 text-sm px-4 py-2.5 rounded-xl transition-colors border border-violet-500/20 font-medium"
            >
              <Play className="w-3.5 h-3.5" />
              Focar
            </button>
            <button
              onClick={() => onBreakdown(task)}
              className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm px-4 py-2.5 rounded-xl transition-colors font-medium"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {hasSteps ? 'Refazer' : 'Quebrar IA'}
            </button>
            <button
              onClick={() => onBookmark(task)}
              className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm px-4 py-2.5 rounded-xl transition-colors font-medium"
            >
              <Bookmark className="w-3.5 h-3.5" />
              Pausar
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="ml-auto text-zinc-700 hover:text-red-400 transition-colors p-2 rounded-xl hover:bg-red-500/10"
              aria-label="Deletar tarefa"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </Card>
  )
}
