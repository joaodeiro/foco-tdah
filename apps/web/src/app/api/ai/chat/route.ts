import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAIProvider } from '@/lib/ai'
import type { ChatContext } from '@/types'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const body = await request.json() as { message: string; context: ChatContext }

    if (!body.message?.trim()) {
      return NextResponse.json({ error: 'Mensagem vazia' }, { status: 400 })
    }

    const ai = await getAIProvider()
    const response = await ai.chat(body.message, body.context)

    return NextResponse.json(response)
  } catch (err: unknown) {
    const e = err as Error
    console.error('[chat] erro:', e.message, e)
    return NextResponse.json(
      { error: e.message || 'Falha ao processar chat' },
      { status: 502 },
    )
  }
}
