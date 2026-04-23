'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { todayDate } from '@/lib/utils'
import { showError, showSuccess } from '@/lib/errors'

interface Commitment {
  avoid_apps: string[]
  avoided_apps_breached: string[]
}

/**
 * Hook de "compromisso diário" — persiste em journal_entries:
 *   avoid_apps: apps que o usuário declara evitar hoje (C-01)
 *   avoided_apps_breached: apps que ele reconheceu ter aberto (C-02)
 *
 * Abordagem: sem punição. Registro honesto. Vai pro diário como dado.
 */
export function useCommitment() {
  const [commitment, setCommitment] = useState<Commitment>({
    avoid_apps: [],
    avoided_apps_breached: [],
  })
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    const supabase = createClient()
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const today = todayDate()
      const { data } = await supabase
        .from('journal_entries')
        .select('avoid_apps, avoided_apps_breached')
        .eq('user_id', user.id)
        .eq('date', today)
        .maybeSingle()

      if (data) {
        setCommitment({
          avoid_apps: (data as { avoid_apps?: string[] }).avoid_apps || [],
          avoided_apps_breached: (data as { avoided_apps_breached?: string[] }).avoided_apps_breached || [],
        })
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function setAvoidApps(apps: string[]) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const today = todayDate()
    const { error } = await supabase
      .from('journal_entries')
      .upsert({
        user_id: user.id,
        date: today,
        avoid_apps: apps,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,date' })

    if (error) { showError(error); return }
    setCommitment(prev => ({ ...prev, avoid_apps: apps }))
    showSuccess('Compromisso salvo.', 'Fica registrado sem cobrança.')
  }

  async function markBreach(app: string, breached: boolean) {
    const next = breached
      ? Array.from(new Set([...commitment.avoided_apps_breached, app]))
      : commitment.avoided_apps_breached.filter(a => a !== app)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const today = todayDate()
    const { error } = await supabase
      .from('journal_entries')
      .upsert({
        user_id: user.id,
        date: today,
        avoided_apps_breached: next,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,date' })

    if (error) { showError(error); return }
    setCommitment(prev => ({ ...prev, avoided_apps_breached: next }))
  }

  return { commitment, loading, setAvoidApps, markBreach, reload: load }
}
