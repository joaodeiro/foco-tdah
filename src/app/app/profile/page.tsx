'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { showError, showSuccess } from '@/lib/errors'

export default function ProfilePage() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [timerMinutes, setTimerMinutes] = useState(25)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setEmail(user.email || '')

      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()
      if (data) {
        setName(data.name || '')
        setTimerMinutes(data.preferred_timer_minutes || 25)
      }
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleSave() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    setLoading(true)

    const { error } = await supabase
      .from('profiles')
      .update({ name, preferred_timer_minutes: timerMinutes, updated_at: new Date().toISOString() })
      .eq('id', user.id)

    setLoading(false)
    if (error) { showError(error); return }
    showSuccess('Perfil atualizado.')
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const timerOptions = [15, 25, 45, 60, 90]

  return (
    <div className="min-h-screen bg-background">
      <header className="px-6 pt-14 pb-6 max-w-xl mx-auto">
        <p className="eyebrow">Conta</p>
        <h1 className="font-serif text-5xl leading-none text-ink mt-3">Perfil</h1>
      </header>

      <div className="px-6 space-y-10 pb-24 max-w-xl mx-auto">

        {/* Identidade */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl text-ink">Identidade</h2>
          <p className="text-sm text-ink-muted">{email}</p>
          <div className="space-y-2">
            <label htmlFor="name" className="eyebrow block">Como quer ser chamado</label>
            <Input
              id="name"
              name="name"
              autoComplete="given-name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Seu nome"
            />
          </div>
        </section>

        {/* Timer */}
        <section className="space-y-4">
          <div>
            <h2 className="font-serif text-xl text-ink">Duração do timer</h2>
            <p className="text-sm text-ink-muted leading-relaxed mt-1">
              Ajuste para o que funciona com a <em className="font-serif">sua</em> atenção. Não precisa ser 25min.
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {timerOptions.map(min => (
              <button
                key={min}
                onClick={() => setTimerMinutes(min)}
                className={`px-4 py-2 rounded-full text-sm transition-colors border tabular-nums ${
                  timerMinutes === min
                    ? 'bg-ink text-background border-ink'
                    : 'bg-transparent text-ink-muted border-hairline hover:border-ink/40'
                }`}
              >
                {min} min
              </button>
            ))}
          </div>
        </section>

        {/* Science note */}
        <section className="bg-surface border border-hairline rounded-2xl p-6 space-y-3">
          <p className="eyebrow">Baseado em evidências</p>
          <p className="text-[15px] text-ink-muted leading-relaxed font-serif italic">
            Este app é fundamentado em neurociência do TDAH
            &mdash; Barkley, Hallowell, Brown. Sem força de
            vontade. Com estrutura externa que funciona
            <em> com </em>o seu cérebro.
          </p>
        </section>

        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-ink text-background font-medium rounded-full py-3.5 hover:bg-terracotta transition-colors disabled:opacity-50"
        >
          {loading ? 'Salvando…' : 'Salvar preferências'}
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 text-ink-muted hover:text-destructive transition-colors text-sm"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
    </div>
  )
}
