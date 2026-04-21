'use client'

import { useEffect } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useTimer } from '@/hooks/useTimer'
import { Play, Pause, RotateCcw, X, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Task } from '@/types'

interface Props {
  task: Task | null
  durationMinutes?: number
  onClose: () => void
  onComplete: (taskId: string) => void
}

const CIRCUMFERENCE = 2 * Math.PI * 52

async function ensureNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) return false
  if (Notification.permission === 'granted') return true
  if (Notification.permission === 'denied') return false
  const result = await Notification.requestPermission()
  return result === 'granted'
}

export default function TimerModal({ task, durationMinutes = 25, onClose, onComplete }: Props) {
  const timer = useTimer(durationMinutes)

  useEffect(() => {
    if (!task) return
    timer.reset()
    ensureNotificationPermission()
    const id = setTimeout(() => timer.start(), 100)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task?.id])

  useEffect(() => {
    if (timer.state === 'finished' && typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('Foco', { body: `Sessão encerrada: ${task?.title ?? ''}` })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer.state])

  if (!task) return null

  const strokeDash = CIRCUMFERENCE - (timer.progress / 100) * CIRCUMFERENCE
  const progressColor = 'var(--terracotta)'
  const finishedColor = 'var(--sage)'

  return (
    <Dialog open={!!task} onOpenChange={onClose}>
      <DialogContent className="bg-background border-hairline rounded-3xl max-w-sm mx-auto p-0 overflow-hidden">
        <div className="p-8 space-y-7">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">
              {timer.state === 'finished' ? 'Sessão concluída' : `Sessão · ${durationMinutes} min`}
            </p>
            <button
              onClick={onClose}
              className="text-ink-faint hover:text-ink transition-colors"
              aria-label="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="font-serif text-xl text-ink text-center leading-snug px-4">
            {task.title}
          </p>

          {/* Circular Timer */}
          <div className="flex items-center justify-center">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60" cy="60" r="52"
                  fill="none"
                  stroke="var(--hairline)"
                  strokeWidth="2"
                />
                <circle
                  cx="60" cy="60" r="52"
                  fill="none"
                  stroke={timer.state === 'finished' ? finishedColor : progressColor}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={strokeDash}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={cn(
                  'font-mono text-[42px] md:text-5xl tabular-nums leading-none font-medium',
                  timer.state === 'finished' ? 'text-sage' : 'text-ink',
                )}>
                  {timer.display}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint mt-3">
                  {timer.state === 'running' ? '● focando'
                    : timer.state === 'paused' ? '‖ pausado'
                    : timer.state === 'finished' ? '✓ pronto'
                    : '○ pronto'}
                </span>
              </div>
            </div>
          </div>

          {/* Controls */}
          {timer.state !== 'finished' ? (
            <div className="flex items-center justify-center gap-5">
              <button
                onClick={timer.reset}
                className="w-10 h-10 rounded-full border border-hairline flex items-center justify-center text-ink-muted hover:text-ink hover:border-ink/30 transition-colors"
                aria-label="Reiniciar"
              >
                <RotateCcw className="w-4 h-4" strokeWidth={1.6} />
              </button>

              <button
                onClick={timer.state === 'running' ? timer.pause : timer.resume}
                className="w-16 h-16 rounded-full bg-ink hover:bg-terracotta text-background flex items-center justify-center transition-colors"
                aria-label={timer.state === 'running' ? 'Pausar' : 'Iniciar'}
              >
                {timer.state === 'running'
                  ? <Pause className="w-5 h-5" fill="currentColor" strokeWidth={0} />
                  : <Play className="w-5 h-5" fill="currentColor" strokeWidth={0} />
                }
              </button>

              <button
                onClick={() => onComplete(task.id)}
                className="w-10 h-10 rounded-full border border-hairline flex items-center justify-center text-ink-muted hover:text-sage hover:border-sage/40 transition-colors"
                aria-label="Concluir"
              >
                <Check className="w-4 h-4" strokeWidth={1.8} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <button
                onClick={() => onComplete(task.id)}
                className="w-full py-3.5 bg-ink hover:bg-sage text-background rounded-full font-medium inline-flex items-center justify-center gap-2 transition-colors"
              >
                <Check className="w-4 h-4" strokeWidth={2} />
                Marcar como concluída
              </button>
              <button
                onClick={onClose}
                className="w-full py-2 text-ink-muted text-sm hover:text-ink transition-colors"
              >
                Continuar depois
              </button>
            </div>
          )}

          {task.steps.length > 0 && timer.state !== 'finished' && (
            <div className="border-t border-hairline pt-5 space-y-2">
              <p className="serial">Próximos passos</p>
              {task.steps.filter(s => !s.completed).slice(0, 3).map((step, i) => (
                <p key={step.id} className="text-sm text-ink-muted leading-relaxed flex items-start gap-3">
                  <span className="font-mono text-[10px] text-ink-faint tabular-nums mt-1 shrink-0 w-5">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {step.content}
                </p>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
