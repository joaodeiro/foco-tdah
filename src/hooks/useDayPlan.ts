'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { todayDate } from '@/lib/utils'
import type { DayPlan, Task } from '@/types'

export function useDayPlan() {
  const [plan, setPlan] = useState<DayPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const today = todayDate()

  useEffect(() => {
    async function fetch() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('day_plans')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single()

      setPlan(data)
      setLoading(false)
    }
    fetch()
  }, [today])

  async function setEnergyLevel(level: number) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('day_plans')
      .upsert({
        user_id: user.id,
        date: today,
        energy_level: level,
        top_three_ids: plan?.top_three_ids || [],
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,date' })
      .select()
      .single()

    if (!error) setPlan(data)
  }

  async function suggestTopThree(tasks: Task[]) {
    if (!plan?.energy_level) return

    const res = await fetch('/api/ai/suggest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tasks, energyLevel: plan.energy_level }),
    })

    const { ids } = await res.json()
    await setTopThree(ids)
  }

  async function setTopThree(ids: string[]) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('day_plans')
      .upsert({
        user_id: user.id,
        date: today,
        energy_level: plan?.energy_level || 3,
        top_three_ids: ids,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,date' })
      .select()
      .single()

    if (!error) setPlan(data)
  }

  return { plan, loading, setEnergyLevel, suggestTopThree, setTopThree }
}
