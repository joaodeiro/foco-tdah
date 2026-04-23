'use client'

import { useState, useEffect } from 'react'
import { useJournal } from '@/hooks/useJournal'
import { useTasks } from '@/hooks/useTasks'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Flame, Trophy, Plus, X, Check } from 'lucide-react'
import CommitmentSection from '@/components/focus/CommitmentSection'
import { formatDisplayDate, todayDate } from '@/lib/utils'
import type { MoodLevel } from '@/types'

const moodEmojis: Record<number, string> = {
  1: '😞', 2: '😕', 3: '😐', 4: '😊', 5: '🤩',
}
const moodLabels: Record<number, string> = {
  1: 'Péssimo', 2: 'Ruim', 3: 'Ok', 4: 'Bem', 5: 'Ótimo',
}

export default function JournalPage() {
  const { entry, streak, saveEntry } = useJournal()
  const { tasks } = useTasks()
  const [moodEnd, setMoodEnd] = useState<MoodLevel | null>(null)
  const [reflection, setReflection] = useState('')
  const [newWin, setNewWin] = useState('')
  const [wins, setWins] = useState<string[]>([])
  const [winsInitialized, setWinsInitialized] = useState(false)

  const completedToday = tasks.filter(t => t.status === 'completed')

  useEffect(() => {
    if (entry) {
      setMoodEnd(entry.mood_end as MoodLevel | null)
      setReflection(entry.reflection || '')
      setWins(entry.wins || [])
      setWinsInitialized(true)
    }
  }, [entry])

  useEffect(() => {
    if (!winsInitialized && !entry && completedToday.length > 0) {
      setWins(completedToday.map(t => t.title))
      setWinsInitialized(true)
    }
  }, [completedToday.length, entry, winsInitialized])

  function addWin() {
    if (!newWin.trim()) return
    setWins(prev => [...prev, newWin.trim()])
    setNewWin('')
  }

  function removeWin(i: number) {
    setWins(prev => prev.filter((_, j) => j !== i))
  }

  async function handleSave() {
    await saveEntry({
      mood_end: moodEnd,
      reflection,
      wins,
      tasks_completed: completedToday.length,
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="px-6 md:px-12 pt-14 md:pt-20 pb-10 max-w-xl md:max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-3">
          <span className="font-mono text-[11px] tracking-[0.1em] text-ink-faint tabular-nums">III</span>
          <span className="h-px flex-1 bg-hairline" />
          <span className="eyebrow capitalize">{formatDisplayDate(todayDate())}</span>
        </div>
        <h1 className="font-serif text-5xl md:text-6xl leading-none text-ink">Diário</h1>
      </header>

      <div className="px-6 md:px-12 space-y-10 md:space-y-14 pb-24 md:pb-20 max-w-xl md:max-w-2xl mx-auto">

        {/* Stats */}
        <section className="grid grid-cols-3 gap-3">
          <Stat icon={<Flame className="w-4 h-4 text-terracotta" strokeWidth={1.6} />} value={streak.current} label="dias seguidos" />
          <Stat icon={<Trophy className="w-4 h-4 text-ochre" strokeWidth={1.6} />} value={streak.longest} label="recorde" />
          <Stat icon={<Check className="w-4 h-4 text-sage" strokeWidth={1.6} />} value={completedToday.length} label="hoje" />
        </section>

        {/* Wins */}
        <section className="space-y-4">
          <div>
            <h2 className="font-serif text-xl text-ink">Conquistas de hoje</h2>
            <p className="text-sm text-ink-muted leading-relaxed mt-1">
              Foco no que foi feito, não no que faltou.
            </p>
          </div>

          <div className="space-y-2">
            {wins.map((win, i) => (
              <div key={`${i}-${win}`} className="flex items-center gap-3 bg-surface border border-hairline rounded-xl px-4 py-3">
                <Check className="w-4 h-4 text-sage shrink-0" strokeWidth={1.8} />
                <span className="flex-1 text-[15px] text-ink">{win}</span>
                <button
                  onClick={() => removeWin(i)}
                  className="text-ink-faint hover:text-destructive transition-colors"
                  aria-label="Remover conquista"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              name="newWin"
              value={newWin}
              onChange={e => setNewWin(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addWin()}
              placeholder="Adicionar conquista…"
              className="flex-1"
            />
            <button
              onClick={addWin}
              aria-label="Adicionar"
              className="w-11 h-11 bg-ink text-background rounded-xl flex items-center justify-center hover:bg-terracotta transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* Mood */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl text-ink">Como você está agora?</h2>
          <div className="flex gap-2">
            {([1, 2, 3, 4, 5] as MoodLevel[]).map(m => (
              <button
                key={m}
                onClick={() => setMoodEnd(m)}
                className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl transition-all border ${
                  moodEnd === m
                    ? 'bg-ink text-background border-ink'
                    : 'bg-surface text-ink border-hairline hover:border-ink/30'
                }`}
              >
                <span className="text-xl">{moodEmojis[m]}</span>
                <span className="text-[10px] opacity-70">{moodLabels[m]}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Reflection */}
        <section className="space-y-3">
          <h2 className="font-serif text-xl text-ink">Reflexão</h2>
          <Textarea
            name="reflection"
            value={reflection}
            onChange={e => setReflection(e.target.value)}
            placeholder="O que funcionou hoje? O que poderia ser diferente?"
            rows={5}
          />
        </section>

        {/* C-02: check-in dos compromissos */}
        <CommitmentSection variant="checkin" />

        <button
          onClick={handleSave}
          className="w-full bg-ink text-background font-medium rounded-full py-3.5 hover:bg-terracotta transition-colors"
        >
          Salvar diário
        </button>
      </div>
    </div>
  )
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div className="bg-surface border border-hairline rounded-2xl p-5 space-y-3">
      {icon}
      <div>
        <p className="font-mono text-4xl md:text-5xl text-ink tabular-nums leading-none font-medium">{String(value).padStart(2, '0')}</p>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint mt-2">{label}</p>
      </div>
    </div>
  )
}
