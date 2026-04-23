'use client'

import { useEffect, useRef, useState } from 'react'
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { Send, X, Loader2 } from 'lucide-react'
import { useChat } from '@/hooks/useChat'
import { cn } from '@/lib/utils'

interface Props {
  open: boolean
  onClose: () => void
}

const quickActions: Array<{ label: string; prompt: string }> = [
  { label: 'Nova tarefa', prompt: 'Criar tarefa: ' },
  { label: 'Top 3 de hoje', prompt: 'O que eu devo focar hoje?' },
  { label: 'Quebrar tarefa', prompt: 'Quebra em passos a tarefa: ' },
  { label: 'Como foi meu dia', prompt: 'Faça um balanço do meu dia.' },
]

export default function ChatSheet({ open, onClose }: Props) {
  const { messages, loading, send } = useChat()
  const [input, setInput] = useState('')
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages, loading])

  async function handleSend(e?: React.FormEvent) {
    e?.preventDefault()
    const text = input
    setInput('')
    await send(text)
  }

  function applyQuickAction(prompt: string) {
    setInput(prompt)
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-ink/15 backdrop-blur-sm transition-opacity data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <DialogPrimitive.Popup
          className={cn(
            'fixed z-50 flex flex-col bg-background border-hairline shadow-xl shadow-ink/10',
            'inset-x-0 bottom-0 h-[88vh] rounded-t-3xl border-t',
            'md:inset-y-0 md:right-0 md:left-auto md:h-full md:w-full md:max-w-md md:rounded-t-none md:border-l md:border-t-0',
            'transition-transform duration-300',
            'data-[starting-style]:translate-y-[100%] md:data-[starting-style]:translate-y-0 md:data-[starting-style]:translate-x-[100%]',
            'data-[ending-style]:translate-y-[100%] md:data-[ending-style]:translate-y-0 md:data-[ending-style]:translate-x-[100%]',
          )}
        >
          {/* Header */}
          <header className="flex items-center justify-between px-5 py-4 border-b border-hairline">
            <div>
              <DialogPrimitive.Title className="font-serif italic text-xl text-ink leading-none">
                Kairos
              </DialogPrimitive.Title>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint mt-1">
                καιρός · converse
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-ink-faint hover:text-ink transition-colors"
              aria-label="Fechar chat"
            >
              <X className="w-5 h-5" strokeWidth={1.6} />
            </button>
          </header>

          {/* Messages */}
          <div ref={listRef} className="flex-1 overflow-y-auto px-5 py-6 space-y-4">
            {messages.length === 0 && (
              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <p className="font-serif text-2xl text-ink leading-snug">
                    Me diga o que você quer fazer.
                  </p>
                  <p className="text-sm text-ink-muted leading-relaxed">
                    Descreva em linguagem natural. Eu crio, quebro, priorizo
                    ou pauso. Exemplos abaixo.
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="serial">Sugestões</p>
                  <div className="flex flex-wrap gap-2">
                    {quickActions.map(a => (
                      <button
                        key={a.label}
                        onClick={() => applyQuickAction(a.prompt)}
                        className="px-3 py-1.5 rounded-full border border-hairline text-[13px] text-ink-muted hover:text-ink hover:border-ink/40 transition-colors"
                      >
                        {a.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {messages.map(m => (
              <div
                key={m.id}
                className={cn(
                  'max-w-[85%] rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed',
                  m.role === 'user'
                    ? 'ml-auto bg-ink text-background'
                    : 'mr-auto bg-surface border border-hairline text-ink',
                )}
              >
                {m.content}
                {m.role === 'assistant' && m.actions && m.actions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {m.actions.map((a, i) => (
                      <span
                        key={i}
                        className="font-mono text-[10px] uppercase tracking-[0.12em] text-terracotta"
                      >
                        ✓ {labelFor(a.type)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="mr-auto bg-surface border border-hairline rounded-2xl px-4 py-2.5 inline-flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-ink-faint" />
                <span className="text-sm text-ink-muted">pensando</span>
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSend}
            className="border-t border-hairline px-4 py-3 flex items-end gap-2 bg-background"
          >
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              placeholder="Fale com Kairos…"
              rows={1}
              autoComplete="off"
              className="flex-1 resize-none bg-surface border border-hairline rounded-2xl px-4 py-2.5 text-[15px] text-ink placeholder:text-ink-faint focus:outline-none focus:border-terracotta/50 max-h-32 leading-relaxed"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              aria-label="Enviar"
              className="w-10 h-10 rounded-full bg-ink hover:bg-terracotta text-background flex items-center justify-center transition-colors disabled:opacity-40 disabled:hover:bg-ink shrink-0"
            >
              <Send className="w-4 h-4" strokeWidth={1.8} />
            </button>
          </form>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

function labelFor(type: string): string {
  switch (type) {
    case 'create_task': return 'tarefa criada'
    case 'complete_task': return 'tarefa concluída'
    case 'breakdown_task': return 'tarefa quebrada'
    case 'suggest_top_three': return 'top 3 atualizado'
    case 'save_context': return 'contexto salvo'
    case 'set_energy': return 'energia atualizada'
    default: return ''
  }
}
