'use client'

import { useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import type { Task } from '@/types'

interface Props {
  open: boolean
  onClose: () => void
  onCreate: (title: string, priority: Task['priority']) => void
}

export default function NewTaskSheet({ open, onClose, onCreate }: Props) {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<Task['priority']>('medium')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    onCreate(title.trim(), priority)
    setTitle('')
    setPriority('medium')
    onClose()
  }

  const priorities: { value: Task['priority']; label: string; emoji: string }[] = [
    { value: 'high', label: 'Alta', emoji: '🔴' },
    { value: 'medium', label: 'Média', emoji: '🟡' },
    { value: 'low', label: 'Baixa', emoji: '⚪' },
  ]

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="bg-zinc-950 border-zinc-800 rounded-t-3xl">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-white text-left">Nova tarefa</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            autoFocus
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="O que precisa ser feito?"
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500 text-sm"
          />

          <div className="space-y-2">
            <p className="text-xs text-zinc-500">Prioridade</p>
            <div className="flex gap-2">
              {priorities.map(p => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPriority(p.value)}
                  className={`flex-1 py-2 rounded-xl text-xs font-medium transition-colors border ${
                    priority === p.value
                      ? 'bg-violet-600/30 border-violet-500/50 text-violet-300'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                  }`}
                >
                  {p.emoji} {p.label}
                </button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            disabled={!title.trim()}
            className="w-full bg-violet-600 hover:bg-violet-500 text-white rounded-xl py-3 font-semibold"
          >
            Criar tarefa
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}
