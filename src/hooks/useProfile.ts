'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Profile {
  id: string
  name: string | null
  preferred_timer_minutes: number
  energy_baseline: number
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    async function load() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data } = await supabase
          .from('profiles')
          .select('id, name, preferred_timer_minutes, energy_baseline')
          .eq('id', user.id)
          .maybeSingle()

        if (data) setProfile(data as Profile)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return { profile, loading, preferredMinutes: profile?.preferred_timer_minutes ?? 25 }
}

/**
 * Dado o nivel de energia e a preferencia salva, escolhe a duracao da sessao.
 * Energia baixa (<=2) encurta a sessao pra baixar custo de entrada.
 */
export function resolveSessionDuration(
  preferredMinutes: number,
  energyLevel: number | null | undefined,
): number {
  if (energyLevel && energyLevel <= 2) {
    return Math.min(preferredMinutes, 15)
  }
  return preferredMinutes
}
