'use client'

import { useEffect, useState } from 'react'
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
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

const CIRCUMFERENCE = 2 * Math.PI * 82 // radius 82 for a larger circle

async function ensureNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) return false
  if (Notification.permission === 'granted') return true
  if (Notification.permission === 'denied') return false
  const result = await Notification.requestPermission()
  return result === 'granted'
}

export default function TimerModal({ task, durationMinutes = 25, onClose, onComplete }: Props) {
  const timer = useTimer(durationMinutes)
  const [confirmExit, setConfirmExit] = useState(false)

  // Auto-start on task open
  useEffect(() => {
    if (!task) return
    timer.reset()
    ensureNotificationPermission()
    const id = setTimeout(() => timer.start(), 100)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task?.id])

  // Notify on finish
  useEffect(() => {
    if (timer.state === 'finished' && typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('Kairos', { body: `Sessão encerrada: ${task?.title ?? ''}` })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer.state])

  // Two-tap exit: reset confirmation after 3s
  useEffect(() => {
    if (!confirmExit) return
    const t = setTimeout(() => setConfirmExit(false), 3000)
    return () => clearTimeout(t)
  }, [confirmExit])

  // Reset exit state when task changes
  useEffect(() => {
    setConfirmExit(false)
  }, [task?.id])

  if (!task) return null

  const strokeDash = CIRCUMFERENCE - (timer.progress / 100) * CIRCUMFERENCE

  function handleCloseAttempt() {
    if (timer.state === 'finished' || confirmExit) {
      onClose()
      return
    }
    setConfirmExit(true)
  }

  return (
    <DialogPrimitive.Root open={!!task} onOpenChange={(o) => !o && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop
          className="fixed inset-0 z-50 bg-background transition-opacity duration-300 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0"
        />
        <DialogPrimitive.Popup
          className={cn(
            'fixed inset-0 z-50 flex flex-col bg-background outline-none',
            'transition-opacity duration-500',
            'data-[starting-style]:opacity-0 data-[ending-style]:opacity-0',
          )}
          // grayscale filter applied aqui — marca visual do modo foco
          style={{ filter: 'grayscale(1) contrast(0.96)' }}
        >
          <DialogPrimitive.Title className="sr-only">
            Sessão de foco: {task.title}
          </DialogPrimitive.Title>

          {/* Top bar */}
          <header className="flex items-start justify-between px-6 pt-6 md:px-10 md:pt-10">
            <div className="space-y-1">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">
                {timer.state === 'finished' ? 'Sessão concluída' : `Sessão · ${durationMinutes} min`}
              </p>
            </div>
            <button
              onClick={handleCloseAttempt}
              className={cn(
                'inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors',
                confirmExit
                  ? 'text-ink'
                  : 'text-ink-faint hover:text-ink'
              )}
              aria-label={confirmExit ? 'Confirmar saída' : 'Sair da sessão'}
            >
              {confirmExit && <span>sair mesmo?</span>}
              <X className="w-4 h-4" strokeWidth={1.6} />
            </button>
          </header>

          {/* Center stage */}
          <main className="flex-1 flex flex-col items-center justify-center px-6 gap-12">
            <p className="font-serif text-2xl md:text-3xl text-ink text-center leading-snug max-w-xl">
              {task.title}
            </p>

            {/* Timer ring */}
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 192 192">
                <circle
                  cx="96" cy="96" r="82"
                  fill="none"
                  stroke="var(--hairline)"
                  strokeWidth="1.5"
                />
                <circle
                  cx="96" cy="96" r="82"
                  fill="none"
                  stroke="var(--ink)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={strokeDash}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-mono text-6xl md:text-7xl tabular-nums leading-none font-medium text-ink">
                  {timer.display}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-faint mt-5">
                  {timer.state === 'running' ? 'focando'
                    : timer.state === 'paused' ? 'pausado'
                    : timer.state === 'finished' ? 'pronto'
                    : 'pronto'}
                </span>
              </div>
            </div>

            {/* Controls */}
            {timer.state !== 'finished' ? (
              <div className="flex items-center justify-center gap-8">
                <button
                  onClick={timer.reset}
                  className="w-11 h-11 rounded-full border border-hairline flex items-center justify-center text-ink-muted hover:text-ink hover:border-ink/30 transition-colors"
                  aria-label="Reiniciar"
                >
                  <RotateCcw className="w-4 h-4" strokeWidth={1.6} />
                </button>

                <button
                  onClick={timer.state === 'running' ? timer.pause : timer.resume}
                  className="w-20 h-20 rounded-full bg-ink hover:bg-ink/80 text-background flex items-center justify-center transition-colors"
                  aria-label={timer.state === 'running' ? 'Pausar' : 'Iniciar'}
                >
                  {timer.state === 'running'
                    ? <Pause className="w-6 h-6" fill="currentColor" strokeWidth={0} />
                    : <Play className="w-6 h-6" fill="currentColor" strokeWidth={0} />
                  }
                </button>

                <button
                  onClick={() => onComplete(task.id)}
                  className="w-11 h-11 rounded-full border border-hairline flex items-center justify-center text-ink-muted hover:text-ink hover:border-ink/40 transition-colors"
                  aria-label="Concluir"
                >
                  <Check className="w-4 h-4" strokeWidth={1.8} />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 w-full max-w-xs">
                <button
                  onClick={() => onComplete(task.id)}
                  className="w-full py-3.5 bg-ink hover:bg-ink/80 text-background rounded-full font-medium inline-flex items-center justify-center gap-2 transition-colors"
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
          </main>

          {/* Footer — próximos passos */}
          {task.steps.length > 0 && timer.state !== 'finished' && (
            <footer className="px-6 md:px-10 pb-10 pt-6 max-w-xl mx-auto w-full">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint mb-3">
                Próximos passos
              </p>
              <div className="space-y-1.5">
                {task.steps.filter(s => !s.completed).slice(0, 3).map((step, i) => (
                  <p key={step.id} className="text-sm text-ink-muted leading-relaxed flex items-start gap-3">
                    <span className="font-mono text-[10px] text-ink-faint tabular-nums mt-1 shrink-0 w-5">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {step.content}
                  </p>
                ))}
              </div>
            </footer>
          )}
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
