'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { ArrowLeft } from 'lucide-react'
import { showError, showValidation } from '@/lib/errors'

function LoginErrorToasts() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const err = searchParams.get('error')
    if (err === 'invalid_code') {
      showValidation('Seu link expirou ou já foi usado.', 'Peça um novo em "Esqueci minha senha".')
    } else if (err === 'missing_code') {
      showValidation('Não consegui validar esse link.', 'Peça um novo link e tente de novo.')
    }
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
        showError(error)
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
            <p className="eyebrow">Kairos</p>
            <h1 className="font-serif text-4xl leading-tight text-ink">
              Bem-vindo de volta.
            </h1>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">
              καιρός · momento certo
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="eyebrow block">E-mail</label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="você@email.com"
                required
                autoFocus
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
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
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

      <footer className="px-6 pb-8 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">
        Estrutura externa · para seu cérebro
      </footer>
    </div>
  )
}
