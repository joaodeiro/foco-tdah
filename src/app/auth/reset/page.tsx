'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { showError, showSuccess, showValidation } from '@/lib/errors'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function check() {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        showValidation('Link de recuperação expirado.', 'Peça um novo em "Esqueci minha senha".')
        router.push('/auth/forgot')
        return
      }
      setReady(true)
    }
    check()
  }, [router])

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

  if (!ready) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-sm text-ink-muted italic font-serif">Validando…</p>
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
