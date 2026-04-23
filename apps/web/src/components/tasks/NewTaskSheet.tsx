'use client'

import { useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
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

  const priorities: { value: Task['priority']; label: string }[] = [
    { value: 'high', label: 'Alta' },
    { value: 'medium', label: 'Média' },
    { value: 'low', label: 'Baixa' },
  ]

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="bg-background border-hairline rounded-t-3xl">
        <SheetHeader className="mb-5">
          <SheetTitle className="text-ink font-serif text-2xl text-left">Nova tarefa</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-5 px-4 pb-6">
          <Input
            name="title"
            autoFocus
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="O que precisa ser feito?"
          />

          <div className="space-y-2">
            <p className="serial">Prioridade</p>
            <div className="flex gap-2">
              {priorities.map(p => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPriority(p.value)}
                  className={`flex-1 py-2 rounded-full text-sm transition-colors border ${
                    priority === p.value
                      ? 'bg-ink text-background border-ink'
                      : 'bg-transparent text-ink-muted border-hairline hover:border-ink/40'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!title.trim()}
            className="w-full bg-ink text-background font-medium rounded-full py-3.5 hover:bg-terracotta transition-colors disabled:opacity-50"
          >
            Criar tarefa
          </button>
        </form>
      </SheetContent>
    </Sheet>
  )
}
