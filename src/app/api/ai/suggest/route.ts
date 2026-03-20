import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAIProvider } from '@/lib/ai'
import type { Task } from '@/types'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const body = await request.json() as { tasks: Task[]; energyLevel: number }

  const ai = await getAIProvider()
  const ids = await ai.suggestTopThree(body.tasks, body.energyLevel)

  return NextResponse.json({ ids })
}
