'use client'

import { useState, useEffect } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Sparkles, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import type { Task } from '@/types'

interface Props {
  task: Task | null
  onClose: () => void
  onSave: (taskId: string, steps: string[], estimatedMinutes: number) => void
}

export default function BreakdownSheet({ task, onClose, onSave }: Props) {
  const [steps, setSteps] = useState<string[]>([])
  const [estimatedMinutes, setEstimatedMinutes] = useState(25)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (task) {
      setSteps(task.steps.map(s => s.content))
      setEstimatedMinutes(task.estimated_minutes || 25)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task?.id])

  async function handleGenerate() {
    if (!task) return
    setLoading(true)

    try {
      const res = await fetch('/api/ai/breakdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: task.title, description: task.description }),
      })

      if (!res.ok) {
        toast.error('Não consegui quebrar a tarefa agora. Tente de novo.')
        return
      }

      const data = await res.json()
      setSteps(Array.isArray(data.steps) ? data.steps : [])
      const minutes = Number(data.estimated_minutes)
      setEstimatedMinutes(Number.isFinite(minutes) && minutes > 0 ? minutes : 25)
    } finally {
      setLoading(false)
    }
  }

  function handleSave() {
    if (!task) return
    onSave(task.id, steps.filter(Boolean), estimatedMinutes)
    onClose()
  }

  if (!task) return null

  return (
    <Sheet open={!!task} onOpenChange={onClose}>
      <SheetContent side="bottom" className="bg-background border-hairline rounded-t-3xl max-h-[85vh] overflow-y-auto">
        <SheetHeader className="mb-5">
          <p className="eyebrow px-4">Tarefa</p>
          <SheetTitle className="text-ink font-serif text-xl text-left px-4 leading-snug mt-1">
            {task.title}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-4 px-4 pb-6">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-surface border border-hairline hover:border-terracotta/40 text-ink rounded-xl py-3.5 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Gerando com IA…</>
            ) : (
              <><Sparkles className="w-4 h-4 text-terracotta" strokeWidth={1.6} /> Quebrar com IA</>
            )}
          </button>

          {steps.length > 0 && (
            <div className="space-y-3">
              <p className="eyebrow">Micro-passos</p>
              {steps.map((step, i) => (
                <div key={`step-${i}`} className="flex items-start gap-3">
                  <span className="text-ink-faint text-xs mt-3 tabular-nums shrink-0">{String(i + 1).padStart(2, '0')}</span>
                  <input
                    name={`step-${i}`}
                    type="text"
                    autoComplete="off"
                    autoCorrect="off"
                    value={step}
                    onChange={e => setSteps(prev => prev.map((s, j) => j === i ? e.target.value : s))}
                    className="flex-1 bg-surface border border-hairline rounded-xl px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-terracotta/50"
                  />
                </div>
              ))}

              <div className="flex items-center gap-2 pt-2">
                <span className="eyebrow">Tempo estimado</span>
                <input
                  name="estimated_minutes"
                  type="number"
                  inputMode="numeric"
                  autoComplete="off"
                  min={1}
                  value={estimatedMinutes}
                  onChange={e => {
                    const n = Number(e.target.value)
                    setEstimatedMinutes(Number.isFinite(n) && n > 0 ? n : 1)
                  }}
                  className="w-16 bg-surface border border-hairline rounded-lg px-2 py-1 text-sm text-ink text-center focus:outline-none focus:border-terracotta/50 tabular-nums"
                />
                <span className="text-xs text-ink-faint">min</span>
              </div>

              <button
                onClick={handleSave}
                className="w-full bg-ink text-background font-medium rounded-full py-3.5 hover:bg-terracotta transition-colors mt-2"
              >
                Salvar passos
              </button>
            </div>
          )}

          {steps.length === 0 && !loading && (
            <p className="text-center text-sm text-ink-faint py-4 italic font-serif">
              Clique em &ldquo;Quebrar com IA&rdquo; para gerar micro-passos.
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
