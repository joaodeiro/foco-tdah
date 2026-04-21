'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Mail } from 'lucide-react'
import { showError, showValidation } from '@/lib/errors'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const router = useRouter()

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()

    if (password.length < 8) {
      showValidation('Senha muito curta.', 'Precisa ter pelo menos 8 caracteres.')
      return
    }
    if (password !== confirm) {
      showValidation('As senhas não coincidem.', 'Digite a mesma senha nos dois campos.')
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        showError(error)
        return
      }

      if (data.session) {
        router.push('/app')
        router.refresh()
        return
      }

      setSent(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="px-6 pt-8">
        <Link
          href="/auth/login"
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
              Crie sua conta.
            </h1>
          </div>

          {!sent ? (
            <form onSubmit={handleSignup} className="space-y-4">
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
                <label htmlFor="password" className="eyebrow block">Senha</label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  minLength={8}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="confirm" className="eyebrow block">Confirmar senha</label>
                <Input
                  id="confirm"
                  name="confirm"
                  type="password"
                  autoComplete="new-password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="Digite de novo"
                  minLength={8}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || !email || !password || !confirm}
                className="w-full bg-ink text-background font-medium rounded-full py-3.5 transition-all hover:bg-terracotta disabled:opacity-50 disabled:hover:bg-ink"
              >
                {loading ? 'Criando…' : 'Criar conta'}
              </button>

              <p className="text-center text-sm text-ink-muted pt-2">
                Já tem conta?{' '}
                <Link href="/auth/login" className="text-ink hover:text-terracotta transition-colors underline decoration-hairline underline-offset-4">
                  Entrar
                </Link>
              </p>
            </form>
          ) : (
            <div className="text-center space-y-5 bg-surface border border-hairline rounded-2xl p-8">
              <Mail className="w-6 h-6 mx-auto text-terracotta" strokeWidth={1.6} />
              <div className="space-y-2">
                <p className="font-serif text-2xl text-ink">Confirme seu e-mail</p>
                <p className="text-sm text-ink-muted leading-relaxed">
                  Enviamos um link para <span className="text-ink font-medium">{email}</span>.
                  <br />
                  Clique nele para ativar sua conta.
                </p>
              </div>
              <Link
                href="/auth/login"
                className="inline-block text-sm text-ink-muted underline decoration-hairline underline-offset-4 hover:text-ink transition-colors"
              >
                Voltar para login
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
