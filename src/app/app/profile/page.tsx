'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { User, LogOut, Brain, Timer } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

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
    if (error) { toast.error('Erro ao salvar'); return }
    toast.success('Perfil atualizado!')
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const timerOptions = [15, 25, 45, 60, 90]

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <div className="px-4 pt-12 pb-4 space-y-1">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-violet-400" />
        </div>
        <h1 className="text-2xl font-bold text-white">Perfil</h1>
      </div>

      <div className="px-4 space-y-4 pb-8">

        {/* User info */}
        <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800 space-y-3">
          <p className="text-xs text-zinc-500">{email}</p>
          <div>
            <label className="text-xs text-zinc-400 block mb-1">Como quer ser chamado?</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Seu nome"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>

        {/* Timer preference */}
        <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800 space-y-3">
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4 text-violet-400" />
            <h2 className="text-sm font-semibold text-zinc-200">Duração do timer</h2>
          </div>
          <p className="text-xs text-zinc-600">
            Ajuste para o que funciona com sua atenção. Não precisa ser 25min.
          </p>
          <div className="flex gap-2">
            {timerOptions.map(min => (
              <button
                key={min}
                onClick={() => setTimerMinutes(min)}
                className={`flex-1 py-2 rounded-xl text-xs font-medium transition-colors border ${
                  timerMinutes === min
                    ? 'bg-violet-600/30 border-violet-500/50 text-violet-300'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-500'
                }`}
              >
                {min}min
              </button>
            ))}
          </div>
        </div>

        {/* Science note */}
        <div className="bg-zinc-900/50 rounded-2xl p-4 border border-zinc-800/50 space-y-2">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-violet-400" />
            <h3 className="text-xs font-semibold text-zinc-400">Baseado em evidências</h3>
          </div>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Este app é fundamentado em neurociência do TDAH (Barkley, Hallowell, Brown).
            Sem força de vontade. Com estrutura externa que funciona <em>com</em> o seu cérebro.
          </p>
        </div>

        <Button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-violet-600 hover:bg-violet-500 text-white rounded-xl py-3 font-semibold"
        >
          {loading ? 'Salvando...' : 'Salvar preferências'}
        </Button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 text-zinc-500 hover:text-red-400 transition-colors text-sm"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
    </div>
  )
}
