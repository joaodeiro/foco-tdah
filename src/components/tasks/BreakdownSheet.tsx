'use client'

import { useState, useEffect } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
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
      <SheetContent side="bottom" className="bg-zinc-950 border-zinc-800 rounded-t-3xl max-h-[85vh] overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-white text-left text-sm leading-snug">
            {task.title}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-4">
          {/* Generate button */}
          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 rounded-xl py-3"
            variant="outline"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Gerando com IA...</>
            ) : (
              <><Sparkles className="w-4 h-4 mr-2" /> Quebrar com IA (Gemini)</>
            )}
          </Button>

          {/* Steps list */}
          {steps.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-zinc-500">Micro-passos</p>
              {steps.map((step, i) => (
                <div key={`step-${i}`} className="flex items-start gap-2">
                  <span className="text-violet-500 text-xs mt-2.5 shrink-0">{i + 1}.</span>
                  <input
                    value={step}
                    onChange={e => setSteps(prev => prev.map((s, j) => j === i ? e.target.value : s))}
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-violet-500"
                  />
                </div>
              ))}

              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs text-zinc-500">Tempo estimado:</span>
                <input
                  type="number"
                  min={1}
                  value={estimatedMinutes}
                  onChange={e => {
                    const n = Number(e.target.value)
                    setEstimatedMinutes(Number.isFinite(n) && n > 0 ? n : 1)
                  }}
                  className="w-16 bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1 text-sm text-white text-center focus:outline-none focus:border-violet-500"
                />
                <span className="text-xs text-zinc-500">min</span>
              </div>

              <Button
                onClick={handleSave}
                className="w-full bg-violet-600 hover:bg-violet-500 text-white rounded-xl py-3 font-semibold mt-2"
              >
                Salvar passos
              </Button>
            </div>
          )}

          {steps.length === 0 && !loading && (
            <p className="text-center text-xs text-zinc-600 py-4">
              Clique em &quot;Quebrar com IA&quot; para gerar micro-passos automaticamente.
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
