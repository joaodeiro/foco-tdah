'use client'

import { useState, useEffect } from 'react'
import { useJournal } from '@/hooks/useJournal'
import { useTasks } from '@/hooks/useTasks'
import { Button } from '@/components/ui/button'
import { BookOpen, Flame, Trophy, Plus, X } from 'lucide-react'
import { formatDisplayDate, todayDate } from '@/lib/utils'
import type { MoodLevel } from '@/types'

const moodEmojis: Record<number, string> = {
  1: '😞', 2: '😕', 3: '😐', 4: '😊', 5: '🤩',
}
const moodLabels: Record<number, string> = {
  1: 'Péssimo', 2: 'Ruim', 3: 'Ok', 4: 'Bem', 5: 'Ótimo',
}

export default function JournalPage() {
  const { entry, streak, loading, saveEntry } = useJournal()
  const { tasks } = useTasks()
  const [moodEnd, setMoodEnd] = useState<MoodLevel | null>(null)
  const [reflection, setReflection] = useState('')
  const [newWin, setNewWin] = useState('')
  const [wins, setWins] = useState<string[]>([])

  const completedToday = tasks.filter(t => t.status === 'completed')

  useEffect(() => {
    if (entry) {
      setMoodEnd(entry.mood_end as MoodLevel | null)
      setReflection(entry.reflection || '')
      setWins(entry.wins || [])
    }
  }, [entry])

  // Auto-populate wins from completed tasks
  useEffect(() => {
    if (completedToday.length > 0 && wins.length === 0) {
      setWins(completedToday.map(t => t.title))
    }
  }, [completedToday.length])

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
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* Header */}
      <div className="px-4 pt-12 pb-4 space-y-1">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-violet-400" />
          <span className="text-xs text-zinc-500 capitalize">{formatDisplayDate(todayDate())}</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Diário</h1>
      </div>

      <div className="px-4 space-y-5 pb-8">

        {/* Streak */}
        <div className="flex gap-3">
          <div className="flex-1 bg-zinc-900 rounded-2xl p-4 border border-zinc-800 flex items-center gap-3">
            <Flame className="w-5 h-5 text-orange-400" />
            <div>
              <p className="text-xl font-bold text-white">{streak.current}</p>
              <p className="text-xs text-zinc-500">dias seguidos</p>
            </div>
          </div>
          <div className="flex-1 bg-zinc-900 rounded-2xl p-4 border border-zinc-800 flex items-center gap-3">
            <Trophy className="w-5 h-5 text-amber-400" />
            <div>
              <p className="text-xl font-bold text-white">{streak.longest}</p>
              <p className="text-xs text-zinc-500">recorde</p>
            </div>
          </div>
          <div className="flex-1 bg-zinc-900 rounded-2xl p-4 border border-zinc-800 flex items-center gap-3">
            <span className="text-xl">✅</span>
            <div>
              <p className="text-xl font-bold text-white">{completedToday.length}</p>
              <p className="text-xs text-zinc-500">hoje</p>
            </div>
          </div>
        </div>

        {/* Wins */}
        <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800 space-y-3">
          <h2 className="text-sm font-semibold text-zinc-200">
            🏆 O que você conquistou hoje?
          </h2>
          <p className="text-xs text-zinc-600">
            Foco no que foi feito, não no que faltou.
          </p>

          <div className="space-y-2">
            {wins.map((win, i) => (
              <div key={i} className="flex items-center gap-2 bg-zinc-800 rounded-lg px-3 py-2">
                <span className="text-green-400 text-sm">✓</span>
                <span className="flex-1 text-sm text-zinc-200">{win}</span>
                <button onClick={() => removeWin(i)} className="text-zinc-600 hover:text-zinc-400">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              value={newWin}
              onChange={e => setNewWin(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addWin()}
              placeholder="Adicionar conquista..."
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-violet-500"
            />
            <button
              onClick={addWin}
              className="w-8 h-8 bg-violet-600/20 border border-violet-500/30 rounded-lg flex items-center justify-center text-violet-400"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mood end */}
        <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800 space-y-3">
          <h2 className="text-sm font-semibold text-zinc-200">Como você está agora?</h2>
          <div className="flex gap-2">
            {([1, 2, 3, 4, 5] as MoodLevel[]).map(m => (
              <button
                key={m}
                onClick={() => setMoodEnd(m)}
                className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl transition-all ${
                  moodEnd === m
                    ? 'bg-violet-600/30 border border-violet-500/50 scale-105'
                    : 'bg-zinc-800 border border-transparent'
                }`}
              >
                <span className="text-xl">{moodEmojis[m]}</span>
                <span className="text-[9px] text-zinc-500">{moodLabels[m]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Reflection */}
        <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800 space-y-3">
          <h2 className="text-sm font-semibold text-zinc-200">Reflexão (opcional)</h2>
          <textarea
            value={reflection}
            onChange={e => setReflection(e.target.value)}
            placeholder="O que funcionou hoje? O que poderia ser diferente?"
            rows={4}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-violet-500 resize-none"
          />
        </div>

        <Button
          onClick={handleSave}
          className="w-full bg-violet-600 hover:bg-violet-500 text-white rounded-xl py-3 font-semibold"
        >
          Salvar diário ✨
        </Button>
      </div>
    </div>
  )
}
