'use client'

import { useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Bookmark } from 'lucide-react'
import type { Task } from '@/types'

interface Props {
  task: Task | null
  onClose: () => void
  onSave: (taskId: string, bookmark: string) => void
}

export default function BookmarkSheet({ task, onClose, onSave }: Props) {
  const [text, setText] = useState(task?.context_bookmark || '')

  if (!task) return null

  function handleSave() {
    if (!task) return
    onSave(task.id, text.trim())
    onClose()
  }

  return (
    <Sheet open={!!task} onOpenChange={onClose}>
      <SheetContent side="bottom" className="bg-background border-hairline rounded-t-3xl">
        <SheetHeader className="mb-5">
          <SheetTitle className="text-ink font-serif text-2xl text-left flex items-center gap-2 px-4">
            <Bookmark className="w-4 h-4 text-ochre" strokeWidth={1.6} />
            Salvar contexto
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-4 px-4 pb-6">
          <p className="text-sm text-ink-muted leading-relaxed">
            Anote onde você parou para retomar sem custo cognitivo.
            O que estava fazendo? O que vem depois?
          </p>

          <textarea
            autoFocus
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Ex: Fiz o outline, próximo é escrever a intro. Arquivo em /docs"
            rows={5}
            className="w-full bg-surface border border-hairline rounded-xl px-4 py-3 text-[15px] text-ink placeholder:text-ink-faint focus:outline-none focus:border-ochre/50 resize-none leading-relaxed"
          />

          <button
            onClick={handleSave}
            className="w-full bg-ink text-background font-medium rounded-full py-3.5 hover:bg-ochre transition-colors"
          >
            Salvar e pausar
          </button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
