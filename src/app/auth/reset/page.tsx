'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { showError, showSuccess, showValidation } from '@/lib/errors'

type Status = 'verifying' | 'ready' | 'invalid'

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ValidatingScreen />}>
      <ResetPasswordInner />
    </Suspense>
  )
}

function ValidatingScreen() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-sm text-ink-muted italic font-serif">Validando link…</p>
    </div>
  )
}

function ResetPasswordInner() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<Status>('verifying')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const supabase = createClient()

    async function boot() {
      const code = searchParams.get('code')

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) {
          showError(error)
          setStatus('invalid')
          return
        }
        setStatus('ready')
        return
      }

      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setStatus('ready')
      } else {
        setStatus('invalid')
      }
    }

    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setStatus('ready')
    })

    boot()
    return () => sub.subscription.unsubscribe()
  }, [searchParams])

  useEffect(() => {
    if (status === 'invalid') {
      showValidation(
        'Link de recuperação inválido ou expirado.',
        'Peça um novo em "Esqueci minha senha".',
      )
      const t = setTimeout(() => router.push('/auth/forgot'), 100)
      return () => clearTimeout(t)
    }
  }, [status, router])

  async function handleSubmit(e: React.FormEvent) {
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
      const { error } = await supabase.auth.updateUser({ password })

      if (error) {
        showError(error)
        return
      }

      showSuccess('Senha atualizada.', 'Já pode entrar com ela.')
      router.push('/app')
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  if (status === 'verifying') return <ValidatingScreen />

  if (status === 'invalid') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center space-y-4 max-w-sm">
          <p className="font-serif text-2xl text-ink">Link inválido.</p>
          <p className="text-sm text-ink-muted">Redirecionando para pedir um novo…</p>
          <Link
            href="/auth/forgot"
            className="inline-block text-sm text-ink underline decoration-hairline underline-offset-4 hover:text-terracotta transition-colors"
          >
            Ir agora
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <main className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-sm space-y-10">

          <div className="text-center space-y-3">
            <p className="eyebrow">Nova senha</p>
            <h1 className="font-serif text-4xl leading-tight text-ink">
              Defina uma senha.
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="password" className="eyebrow block">Nova senha</label>
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
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirm" className="eyebrow block">Confirmar</label>
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
              disabled={loading || !password || !confirm}
              className="w-full bg-ink text-background font-medium rounded-full py-3.5 transition-all hover:bg-terracotta disabled:opacity-50 disabled:hover:bg-ink"
            >
              {loading ? 'Salvando…' : 'Atualizar senha'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
