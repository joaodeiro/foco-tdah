import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAIProvider } from '@/lib/ai'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const body = await request.json() as { title: string; description?: string }

    if (!body.title?.trim()) {
      return NextResponse.json({ error: 'Título obrigatório' }, { status: 400 })
    }

    const ai = await getAIProvider()
    const result = await ai.breakdownTask(body.title, body.description)

    return NextResponse.json(result)
  } catch (err) {
    console.error('breakdown error', err)
    return NextResponse.json({ error: 'Falha ao processar com IA' }, { status: 502 })
  }
}
