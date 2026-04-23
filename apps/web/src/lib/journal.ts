import { createClient } from '@/lib/supabase/client'
import { todayDate } from '@/lib/utils'

/**
 * Anexa uma conquista ao diário do dia atual.
 *
 * Idempotente: se o texto já estiver nas wins, não duplica.
 * Silencioso: não exibe toast — função é usada em automação (F-03).
 *
 * Falhas aqui não devem quebrar o fluxo principal (completar tarefa),
 * por isso não propaga erro — apenas registra.
 */
export async function appendWin(text: string): Promise<void> {
  if (!text?.trim()) return

  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const today = todayDate()
  const clean = text.trim()

  const { data: existing } = await supabase
    .from('journal_entries')
    .select('id, wins')
    .eq('user_id', user.id)
    .eq('date', today)
    .maybeSingle()

  const currentWins: string[] = existing?.wins || []
  if (currentWins.includes(clean)) return

  const newWins = [...currentWins, clean]

  const { error } = await supabase
    .from('journal_entries')
    .upsert(
      {
        user_id: user.id,
        date: today,
        wins: newWins,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,date' },
    )

  if (error) {
    console.error('[journal] appendWin failed:', error.message)
  }
}
