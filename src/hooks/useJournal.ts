'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { todayDate } from '@/lib/utils'
import type { JournalEntry, Streak } from '@/types'
import { toast } from 'sonner'

export function useJournal() {
  const [entry, setEntry] = useState<JournalEntry | null>(null)
  const [streak, setStreak] = useState<Streak>({ current: 0, longest: 0, last_active_date: null })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const today = todayDate()

  useEffect(() => {
    async function fetch() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const [{ data: entryData }, { data: streakData }] = await Promise.all([
          supabase.from('journal_entries').select('*').eq('user_id', user.id).eq('date', today).maybeSingle(),
          supabase.from('streaks').select('*').eq('user_id', user.id).maybeSingle(),
        ])

        setEntry(entryData)
        if (streakData) {
          setStreak({
            current: streakData.current_streak,
            longest: streakData.longest_streak,
            last_active_date: streakData.last_active_date,
          })
        }
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [today])

  async function saveEntry(updates: Partial<JournalEntry>) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('journal_entries')
      .upsert({
        user_id: user.id,
        date: today,
        ...entry,
        ...updates,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,date' })
      .select()
      .single()

    if (error) { toast.error('Erro ao salvar'); return }
    setEntry(data)

    await updateStreak(user.id)
    toast.success('Diário salvo! ✨')
  }

  async function updateStreak(userId: string) {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]

    const isConsecutive = streak.last_active_date === yesterdayStr
    const alreadyToday = streak.last_active_date === today

    if (alreadyToday) return

    const newCurrent = isConsecutive ? streak.current + 1 : 1
    const newLongest = Math.max(newCurrent, streak.longest)

    const { error } = await supabase
      .from('streaks')
      .upsert({
        user_id: userId,
        current_streak: newCurrent,
        longest_streak: newLongest,
        last_active_date: today,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' })

    if (!error) {
      setStreak({ current: newCurrent, longest: newLongest, last_active_date: today })
      if (newCurrent > 1) {
        toast.success(`🔥 ${newCurrent} dias seguidos!`)
      }
    }
  }

  return { entry, streak, loading, saveEntry }
}
