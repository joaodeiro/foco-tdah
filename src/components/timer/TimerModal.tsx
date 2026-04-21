'use client'

import { useEffect } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useTimer } from '@/hooks/useTimer'
import { Play, Pause, RotateCcw, X, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Task } from '@/types'

interface Props {
  task: Task | null
  durationMinutes?: number
  onClose: () => void
  onComplete: (taskId: string) => void
}

const CIRCUMFERENCE = 2 * Math.PI * 52 // radius 52

async function ensureNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) return false
  if (Notification.permission === 'granted') return true
  if (Notification.permission === 'denied') return false
  const result = await Notification.requestPermission()
  return result === 'granted'
}

export default function TimerModal({ task, durationMinutes = 25, onClose, onComplete }: Props) {
  const timer = useTimer(durationMinutes)

  // Auto-start when task is set
  useEffect(() => {
    if (!task) return
    timer.reset()
    ensureNotificationPermission()
    const id = setTimeout(() => timer.start(), 100)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task?.id])

  // Notify when finished
  useEffect(() => {
    if (timer.state === 'finished' && typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('Foco! ⏱️', { body: `Sessão encerrada: ${task?.title ?? ''}` })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer.state])

  if (!task) return null

  const strokeDash = CIRCUMFERENCE - (timer.progress / 100) * CIRCUMFERENCE

  return (
    <Dialog open={!!task} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-950 border-zinc-800 rounded-3xl max-w-sm mx-auto p-0 overflow-hidden">
        <div className="p-6 space-y-6">
          {/* Close */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-600 uppercase tracking-widest font-medium">
              {timer.state === 'finished' ? 'Sessão concluída!' : 'Modo foco'}
            </span>
            <button
              onClick={onClose}
              className="text-zinc-600 hover:text-zinc-400 transition-colors"
              aria-label="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Task title */}
          <p className="text-sm text-zinc-300 text-center leading-snug px-2">
            {task.title}
          </p>

          {/* Circular Timer */}
          <div className="flex items-center justify-center">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                {/* Background ring */}
                <circle
                  cx="60" cy="60" r="52"
                  fill="none"
                  stroke="#27272a"
                  strokeWidth="8"
                />
                {/* Progress ring */}
                <circle
                  cx="60" cy="60" r="52"
                  fill="none"
                  stroke={timer.state === 'finished' ? '#22c55e' : '#7c3aed'}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={strokeDash}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={cn(
                  'text-3xl font-mono font-bold tabular-nums',
                  timer.state === 'finished' ? 'text-green-400' : 'text-white',
                )}>
                  {timer.display}
                </span>
                <span className="text-xs text-zinc-600 mt-1">
                  {timer.state === 'running' ? 'focando...' :
                   timer.state === 'paused' ? 'pausado' :
                   timer.state === 'finished' ? 'pronto!' : 'pronto'}
                </span>
              </div>
            </div>
          </div>

          {/* Controls */}
          {timer.state !== 'finished' ? (
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={timer.reset}
                className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-zinc-300 transition-colors"
                aria-label="Reiniciar timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={timer.state === 'running' ? timer.pause : timer.resume}
                className="w-16 h-16 rounded-full bg-violet-600 hover:bg-violet-500 flex items-center justify-center text-white transition-colors shadow-lg shadow-violet-500/25"
                aria-label={timer.state === 'running' ? 'Pausar' : 'Iniciar'}
              >
                {timer.state === 'running'
                  ? <Pause className="w-6 h-6" fill="currentColor" />
                  : <Play className="w-6 h-6" fill="currentColor" />
                }
              </button>

              <button
                onClick={() => onComplete(task.id)}
                className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-green-400 transition-colors"
                aria-label="Marcar como concluída"
              >
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <button
                onClick={() => onComplete(task.id)}
                className="w-full py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                Marcar como concluída 🎉
              </button>
              <button
                onClick={onClose}
                className="w-full py-2 text-zinc-500 text-sm hover:text-zinc-300 transition-colors"
              >
                Continuar depois
              </button>
            </div>
          )}

          {/* Steps quick view */}
          {task.steps.length > 0 && timer.state !== 'finished' && (
            <div className="bg-zinc-900 rounded-xl p-3 space-y-1.5">
              <p className="text-[10px] text-zinc-600 uppercase tracking-widest">Próximos passos</p>
              {task.steps.filter(s => !s.completed).slice(0, 3).map(step => (
                <p key={step.id} className="text-xs text-zinc-400 flex items-start gap-2">
                  <span className="text-violet-500 mt-0.5">›</span>
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
