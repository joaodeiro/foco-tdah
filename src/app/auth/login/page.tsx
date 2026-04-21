'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Mail } from 'lucide-react'
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
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Suspense fallback={null}>
        <LoginErrorToasts />
      </Suspense>

      <header className="px-6 pt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-sm space-y-10">

          <div className="text-center space-y-3">
            <p className="eyebrow">Foco</p>
            <h1 className="font-serif text-4xl leading-tight text-ink">
              Bem-vindo de volta.
            </h1>
            <p className="text-[15px] text-ink-muted leading-relaxed">
              Te mandamos um link. Sem senha.
            </p>
          </div>

          {!sent ? (
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="eyebrow block">
                  E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="você@email.com"
                  required
                  autoFocus
                  className="w-full bg-surface border border-hairline rounded-xl px-4 py-3.5 text-base text-ink placeholder:text-ink-faint focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/15 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full bg-ink text-background font-medium rounded-full py-3.5 transition-all hover:bg-terracotta disabled:opacity-50 disabled:hover:bg-ink"
              >
                {loading ? 'Enviando…' : 'Enviar link mágico'}
              </button>

              <p className="text-center text-xs text-ink-faint leading-relaxed">
                Sem senha. Sem fricção. Só um link no seu e-mail.
              </p>
            </form>
          ) : (
            <div className="text-center space-y-5 bg-surface border border-hairline rounded-2xl p-8">
              <Mail className="w-6 h-6 mx-auto text-terracotta" strokeWidth={1.6} />
              <div className="space-y-2">
                <p className="font-serif text-2xl text-ink">Link enviado</p>
                <p className="text-sm text-ink-muted leading-relaxed">
                  Verifique <span className="text-ink font-medium">{email}</span>
                  <br />e clique no link para entrar.
                </p>
              </div>
              <button
                onClick={() => setSent(false)}
                className="text-sm text-ink-muted underline decoration-hairline underline-offset-4 hover:text-ink transition-colors"
              >
                Usar outro e-mail
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="px-6 pb-8 text-center text-xs text-ink-faint italic font-serif">
        Senhas geram fricção cognitiva.
      </footer>
    </div>
  )
}
