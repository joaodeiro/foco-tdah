'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft } from 'lucide-react'
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
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        if (error.message.toLowerCase().includes('invalid')) {
          toast.error('E-mail ou senha incorretos.')
        } else {
          toast.error('Não consegui fazer login. Tente de novo.')
        }
        return
      }

      router.push('/app')
      router.refresh()
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
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="eyebrow block">E-mail</label>
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

            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <label htmlFor="password" className="eyebrow block">Senha</label>
                <Link
                  href="/auth/forgot"
                  className="text-[11px] text-ink-muted hover:text-ink transition-colors underline decoration-hairline underline-offset-4"
                >
                  Esqueci
                </Link>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-surface border border-hairline rounded-xl px-4 py-3.5 text-base text-ink placeholder:text-ink-faint focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/15 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full bg-ink text-background font-medium rounded-full py-3.5 transition-all hover:bg-terracotta disabled:opacity-50 disabled:hover:bg-ink"
            >
              {loading ? 'Entrando…' : 'Entrar'}
            </button>

            <p className="text-center text-sm text-ink-muted pt-2">
              Não tem conta?{' '}
              <Link href="/auth/signup" className="text-ink hover:text-terracotta transition-colors underline decoration-hairline underline-offset-4">
                Criar conta
              </Link>
            </p>
          </form>
        </div>
      </main>

      <footer className="px-6 pb-8 text-center text-xs text-ink-faint italic font-serif">
        Estrutura externa que funciona com seu cérebro.
      </footer>
    </div>
  )
}
