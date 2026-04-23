'use client'

import { useState } from 'react'
import { Plus, X, Check } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useCommitment } from '@/hooks/useCommitment'
import { cn } from '@/lib/utils'

const SUGGESTIONS = ['Instagram', 'YouTube', 'TikTok', 'X', 'Netflix', 'Reddit']

interface Props {
  variant: 'declare' | 'checkin'
}

/**
 * variant="declare" → C-01: usuário declara os apps a evitar hoje.
 *                     Usado na tela Hoje.
 *
 * variant="checkin"  → C-02: usuário marca quais declarados abriu.
 *                     Usado no Diário. Sem vermelho, sem punição.
 */
export default function CommitmentSection({ variant }: Props) {
  const { commitment, setAvoidApps, markBreach } = useCommitment()
  const [customInput, setCustomInput] = useState('')
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<string[]>([])

  function beginEdit() {
    setDraft(commitment.avoid_apps.length ? commitment.avoid_apps : [])
    setEditing(true)
  }

  function toggleSuggestion(app: string) {
    setDraft(prev =>
      prev.includes(app) ? prev.filter(a => a !== app) : [...prev, app]
    )
  }

  function addCustom() {
    const trimmed = customInput.trim()
    if (!trimmed) return
    setDraft(prev => Array.from(new Set([...prev, trimmed])))
    setCustomInput('')
  }

  function removeFromDraft(app: string) {
    setDraft(prev => prev.filter(a => a !== app))
  }

  async function save() {
    await setAvoidApps(draft)
    setEditing(false)
  }

  // ── CHECK-IN (C-02) ─────────────────────────────────────────────
  if (variant === 'checkin') {
    if (commitment.avoid_apps.length === 0) {
      return (
        <section className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="serial">05</span>
            <span className="flex-1 h-px bg-hairline" />
            <span className="serial">Compromisso</span>
          </div>
          <p className="text-sm text-ink-faint italic font-serif">
            Nenhum compromisso declarado hoje.
          </p>
        </section>
      )
    }

    return (
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="serial">05</span>
          <span className="flex-1 h-px bg-hairline" />
          <span className="serial">Compromisso</span>
        </div>
        <div>
          <h2 className="font-serif text-xl text-ink">Respeitou hoje?</h2>
          <p className="text-sm text-ink-muted leading-relaxed mt-1">
            Registro honesto. Sem cobrança. Só dado pra você.
          </p>
        </div>
        <ul className="space-y-2">
          {commitment.avoid_apps.map(app => {
            const breached = commitment.avoided_apps_breached.includes(app)
            return (
              <li key={app}>
                <button
                  onClick={() => markBreach(app, !breached)}
                  className={cn(
                    'w-full flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors text-left',
                    breached
                      ? 'bg-surface border-hairline text-ink-muted'
                      : 'bg-surface border-hairline text-ink hover:border-ink/30'
                  )}
                >
                  {breached
                    ? <X className="w-4 h-4 text-ink-faint" strokeWidth={1.6} />
                    : <Check className="w-4 h-4 text-sage" strokeWidth={1.8} />
                  }
                  <span className="flex-1 text-[15px]">{app}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink-faint">
                    {breached ? 'abri' : 'evitei'}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </section>
    )
  }

  // ── DECLARE (C-01) ─────────────────────────────────────────────
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="serial">04</span>
        <span className="flex-1 h-px bg-hairline" />
        <span className="serial">Compromisso do dia</span>
      </div>

      <div>
        <h2 className="font-serif text-xl text-ink">Apps que você quer evitar hoje</h2>
        <p className="text-sm text-ink-muted leading-relaxed mt-1">
          Declaração simples. Sem bloqueio. A intenção escrita já reduz a automação do toque.
        </p>
      </div>

      {!editing && commitment.avoid_apps.length > 0 && (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {commitment.avoid_apps.map(app => (
              <span
                key={app}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-hairline text-sm text-ink bg-surface"
              >
                {app}
              </span>
            ))}
          </div>
          <button
            onClick={beginEdit}
            className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink-muted hover:text-ink transition-colors"
          >
            Editar
          </button>
        </div>
      )}

      {!editing && commitment.avoid_apps.length === 0 && (
        <button
          onClick={beginEdit}
          className="w-full border border-dashed border-hairline rounded-2xl p-6 text-center text-sm text-ink-muted hover:text-ink hover:border-ink/30 transition-colors"
        >
          Declarar compromisso
        </button>
      )}

      {editing && (
        <div className="space-y-4 bg-surface border border-hairline rounded-2xl p-5">
          <div className="space-y-2">
            <p className="serial">Sugestões</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map(s => {
                const picked = draft.includes(s)
                return (
                  <button
                    key={s}
                    onClick={() => toggleSuggestion(s)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-sm border transition-colors',
                      picked
                        ? 'bg-ink text-background border-ink'
                        : 'bg-transparent text-ink-muted border-hairline hover:border-ink/40'
                    )}
                  >
                    {s}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex gap-2">
            <Input
              name="customApp"
              value={customInput}
              onChange={e => setCustomInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addCustom()}
              placeholder="Outro app…"
              className="flex-1"
            />
            <button
              onClick={addCustom}
              aria-label="Adicionar"
              className="w-11 h-11 bg-ink text-background rounded-xl flex items-center justify-center hover:bg-ink/80 transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {draft.length > 0 && (
            <div className="space-y-2">
              <p className="serial">Declarados</p>
              <div className="flex flex-wrap gap-2">
                {draft.map(app => (
                  <span
                    key={app}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-hairline text-sm text-ink bg-background"
                  >
                    {app}
                    <button
                      onClick={() => removeFromDraft(app)}
                      aria-label="Remover"
                      className="text-ink-faint hover:text-ink"
                    >
                      <X className="w-3 h-3" strokeWidth={1.6} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button
              onClick={save}
              disabled={draft.length === 0}
              className="flex-1 bg-ink text-background rounded-full py-2.5 text-sm hover:bg-ink/80 transition-colors disabled:opacity-40"
            >
              Salvar
            </button>
            <button
              onClick={() => setEditing(false)}
              className="px-5 py-2.5 text-ink-muted text-sm hover:text-ink transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
