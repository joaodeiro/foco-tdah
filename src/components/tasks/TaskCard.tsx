'use client'

import { useState } from 'react'
import { Check, Circle, ChevronDown, ChevronUp, Sparkles, Bookmark, Trash2, Play } from 'lucide-react'
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

const priorityStyles = {
  high: 'text-terracotta',
  medium: 'text-ochre',
  low: 'text-ink-faint',
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
    <article className={cn(
      'rounded-2xl border transition-all overflow-hidden',
      completed
        ? 'bg-transparent border-hairline/60 opacity-55'
        : isTopThree
          ? 'bg-card border-terracotta/30 shadow-sm shadow-terracotta/5'
          : 'bg-card border-hairline',
    )}>
      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start gap-4">
          <button
            onClick={() => !completed && onComplete(task.id)}
            className="mt-0.5 shrink-0 transition-transform active:scale-90"
            aria-label={completed ? 'Concluída' : 'Marcar como concluída'}
          >
            {completed
              ? (
                <div className="w-5 h-5 rounded-full bg-ink flex items-center justify-center">
                  <Check className="w-3 h-3 text-background" strokeWidth={3} />
                </div>
              )
              : <Circle className="w-5 h-5 text-ink-faint hover:text-ink transition-colors" strokeWidth={1.6} />
            }
          </button>

          <div className="flex-1 min-w-0">
            <p className={cn(
              'text-[16px] leading-snug font-serif',
              completed ? 'line-through text-ink-faint' : 'text-ink',
            )}>
              {task.title}
            </p>

            <div className="flex items-center gap-3 mt-2.5 font-mono text-[10px] uppercase tracking-[0.12em] flex-wrap">
              <span className={cn('inline-flex items-center gap-1.5', priorityStyles[task.priority])}>
                <span className="w-1 h-1 rounded-full bg-current" />
                {priorityLabels[task.priority]}
              </span>
              {isTopThree && (
                <span className="text-terracotta">⁂ top 3</span>
              )}
              {task.estimated_minutes && (
                <span className="text-ink-faint tabular-nums">~{task.estimated_minutes} min</span>
              )}
              {task.context_bookmark && (
                <span className="text-ochre inline-flex items-center gap-1">
                  <Bookmark className="w-3 h-3" strokeWidth={1.6} />
                  contexto salvo
                </span>
              )}
            </div>
          </div>

          {hasSteps && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-ink-faint hover:text-ink transition-colors p-1 -mr-1"
              aria-label={expanded ? 'Recolher passos' : 'Expandir passos'}
            >
              {expanded
                ? <ChevronUp className="w-4 h-4" />
                : <ChevronDown className="w-4 h-4" />
              }
            </button>
          )}
        </div>

        {/* Steps progress */}
        {hasSteps && !completed && (
          <div className="space-y-2">
            <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.15em] text-ink-faint tabular-nums">
              <span>{String(stepsCompleted).padStart(2, '0')} / {String(task.steps.length).padStart(2, '0')}</span>
              <span className="flex-1 h-[2px] bg-surface-2 rounded-full overflow-hidden">
                <span
                  className="block h-full bg-terracotta rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </span>
              <span>{progress}%</span>
            </div>
          </div>
        )}

        {/* Context bookmark preview */}
        {task.context_bookmark && !expanded && (
          <div className="text-sm text-ink-muted bg-surface rounded-xl px-4 py-3 border border-hairline italic font-serif leading-relaxed">
            {task.context_bookmark}
          </div>
        )}

        {/* Steps list */}
        {expanded && hasSteps && (
          <div className="space-y-3 pt-3 border-t border-hairline">
            <p className="serial">Micro-passos</p>
            {task.steps.map((step, i) => (
              <button
                key={step.id}
                onClick={() => onToggleStep(task.id, step.id, !step.completed)}
                className="w-full flex items-start gap-3 text-left group"
              >
                <span className="font-mono text-[10px] text-ink-faint tabular-nums mt-1.5 w-5 shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="flex items-center justify-center w-4 h-4 shrink-0 mt-1">
                  {step.completed
                    ? (
                      <div className="w-4 h-4 rounded-full bg-ink flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-background" strokeWidth={3} />
                      </div>
                    )
                    : <Circle className="w-4 h-4 text-ink-faint group-hover:text-ink transition-colors" strokeWidth={1.6} />
                  }
                </div>
                <span className={cn(
                  'text-[14px] leading-relaxed flex-1',
                  step.completed ? 'line-through text-ink-faint' : 'text-ink-muted',
                )}>
                  {step.content}
                </span>
              </button>
            ))}

            {task.context_bookmark && (
              <div className="text-sm text-ink-muted bg-surface rounded-xl px-4 py-3 border border-hairline mt-3 space-y-1">
                <p className="eyebrow">Onde parei</p>
                <p className="italic font-serif leading-relaxed">{task.context_bookmark}</p>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        {!completed && (
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => onStartTimer(task)}
              className="inline-flex items-center gap-1.5 bg-ink hover:bg-terracotta text-background text-[13px] px-4 py-2 rounded-full transition-colors"
            >
              <Play className="w-3 h-3" fill="currentColor" strokeWidth={0} />
              Focar
            </button>
            <button
              onClick={() => onBreakdown(task)}
              className="inline-flex items-center gap-1.5 bg-transparent hover:bg-surface text-ink-muted hover:text-ink text-[13px] px-4 py-2 rounded-full transition-colors border border-hairline"
            >
              <Sparkles className="w-3 h-3" strokeWidth={1.6} />
              {hasSteps ? 'Refazer' : 'Quebrar'}
            </button>
            <button
              onClick={() => onBookmark(task)}
              className="inline-flex items-center gap-1.5 bg-transparent hover:bg-surface text-ink-muted hover:text-ink text-[13px] px-3 py-2 rounded-full transition-colors border border-hairline"
              aria-label="Salvar contexto"
            >
              <Bookmark className="w-3 h-3" strokeWidth={1.6} />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="ml-auto text-ink-faint hover:text-destructive transition-colors p-2"
              aria-label="Deletar tarefa"
            >
              <Trash2 className="w-4 h-4" strokeWidth={1.6} />
            </button>
          </div>
        )}
      </div>
    </article>
  )
}
