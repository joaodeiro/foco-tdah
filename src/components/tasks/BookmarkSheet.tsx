'use client'

import { useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
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
      <SheetContent side="bottom" className="bg-zinc-950 border-zinc-800 rounded-t-3xl">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-white text-left flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-amber-400" />
            Salvar contexto
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-4">
          <p className="text-xs text-zinc-500 leading-relaxed">
            Anote onde você parou para retomar sem custo cognitivo.
            O que você estava fazendo? O que vem depois?
          </p>

          <textarea
            autoFocus
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Ex: Fiz o outline, próximo é escrever o intro. Arquivo na pasta /docs"
            rows={4}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 text-sm resize-none"
          />

          <Button
            onClick={handleSave}
            className="w-full bg-amber-600 hover:bg-amber-500 text-white rounded-xl py-3 font-semibold"
          >
            Salvar e pausar ✋
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
