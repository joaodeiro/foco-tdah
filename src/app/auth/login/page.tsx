'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Brain, Zap } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8">

        {/* Logo / Brand */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" fill="currentColor" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">Foco</span>
          </div>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Produtividade construída para o cérebro TDAH.
            <br />
            <span className="text-violet-400">Sem força de vontade. Com estrutura.</span>
          </p>
        </div>

        {!sent ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm text-zinc-300 font-medium">
                Seu e-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="você@email.com"
                required
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
              />
            </div>

            <Button
              type="submit"
              disabled={loading || !email}
              className="w-full bg-violet-600 hover:bg-violet-500 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? 'Enviando...' : 'Entrar com link mágico ✨'}
            </Button>

            <p className="text-center text-xs text-zinc-600">
              Sem senha. Sem fricção. Só um link no seu e-mail.
            </p>
          </form>
        ) : (
          <div className="text-center space-y-4 bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
            <div className="text-3xl">📬</div>
            <div className="space-y-1">
              <p className="text-white font-semibold">Link enviado!</p>
              <p className="text-zinc-400 text-sm">
                Verifique <span className="text-violet-400">{email}</span>
                <br />e clique no link para entrar.
              </p>
            </div>
            <button
              onClick={() => setSent(false)}
              className="text-zinc-500 text-xs underline hover:text-zinc-300 transition-colors"
            >
              Usar outro e-mail
            </button>
          </div>
        )}

        {/* Neuroscience note */}
        <div className="flex items-start gap-2 bg-zinc-900/50 rounded-xl p-3 border border-zinc-800/50">
          <Brain className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" />
          <p className="text-xs text-zinc-500 leading-relaxed">
            Senhas geram fricção cognitiva. Cérebro TDAH prefere caminhos sem obstáculos.
          </p>
        </div>
      </div>
    </div>
  )
}
