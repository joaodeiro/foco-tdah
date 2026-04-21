'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Brain, Zap } from 'lucide-react'
import { toast } from 'sonner'

function LoginErrorToasts() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const err = searchParams.get('error')
    if (err === 'invalid_code') toast.error('Link expirado ou inválido. Tente de novo.')
    else if (err === 'missing_code') toast.error('Falhou ao validar seu link.')
  }, [searchParams])

  return null
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        toast.error('Não consegui enviar o link. Confira o e-mail e tente de novo.')
        return
      }

      setSent(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex flex-col items-center justify-center p-6">
      <Suspense fallback={null}>
        <LoginErrorToasts />
      </Suspense>
      <div className="w-full max-w-md space-y-8">

        {/* Brand */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Zap className="w-7 h-7 text-white" fill="currentColor" />
            </div>
            <span className="text-3xl font-bold text-white tracking-tight">Foco</span>
          </div>
          <p className="text-zinc-400 text-base leading-relaxed">
            Produtividade construída para o cérebro TDAH.
            <br />
            <span className="text-violet-400 font-medium">Sem força de vontade. Com estrutura.</span>
          </p>
        </div>

        {!sent ? (
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm text-zinc-300 font-medium block">
                Seu e-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="você@email.com"
                required
                autoFocus
                className="w-full h-13 bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-4 text-base text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 transition-all"
              />
            </div>

            <Button
              type="submit"
              disabled={loading || !email}
              className="w-full h-13 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-2xl transition-all text-base disabled:opacity-50 shadow-lg shadow-violet-500/25"
            >
              {loading ? 'Enviando...' : 'Entrar com link mágico ✨'}
            </Button>

            <p className="text-center text-sm text-zinc-600">
              Sem senha. Sem fricção. Só um link no seu e-mail.
            </p>
          </form>
        ) : (
          <Card className="text-center space-y-5 bg-zinc-900 border-zinc-800 rounded-2xl p-8">
            <div className="text-5xl">📬</div>
            <div className="space-y-2">
              <p className="text-white font-semibold text-lg">Link enviado!</p>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Verifique <span className="text-violet-400 font-medium">{email}</span>
                <br />e clique no link para entrar.
              </p>
            </div>
            <button
              onClick={() => setSent(false)}
              className="text-zinc-500 text-sm underline hover:text-zinc-300 transition-colors"
            >
              Usar outro e-mail
            </button>
          </Card>
        )}

        {/* Science note */}
        <div className="flex items-start gap-3 bg-zinc-900/60 border border-zinc-800/60 rounded-2xl p-4">
          <div className="w-8 h-8 rounded-xl bg-violet-500/15 flex items-center justify-center shrink-0">
            <Brain className="w-4 h-4 text-violet-400" />
          </div>
          <p className="text-sm text-zinc-500 leading-relaxed">
            Senhas geram fricção cognitiva. Cérebro TDAH prefere caminhos sem obstáculos.
          </p>
        </div>

      </div>
    </div>
  )
}
