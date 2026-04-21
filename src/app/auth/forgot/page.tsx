'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Mail } from 'lucide-react'
import { showError } from '@/lib/errors'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset`,
      })

      if (error) {
        showError(error)
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
            <p className="eyebrow">Recuperar acesso</p>
            <h1 className="font-serif text-4xl leading-tight text-ink">
              Esqueceu a senha?
            </h1>
            <p className="text-[15px] text-ink-muted leading-relaxed">
              Te mandamos um link para criar uma nova.
            </p>
          </div>

          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
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

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full bg-ink text-background font-medium rounded-full py-3.5 transition-all hover:bg-terracotta disabled:opacity-50 disabled:hover:bg-ink"
              >
                {loading ? 'Enviando…' : 'Enviar link'}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-5 bg-surface border border-hairline rounded-2xl p-8">
              <Mail className="w-6 h-6 mx-auto text-terracotta" strokeWidth={1.6} />
              <div className="space-y-2">
                <p className="font-serif text-2xl text-ink">Link enviado</p>
                <p className="text-sm text-ink-muted leading-relaxed">
                  Verifique <span className="text-ink font-medium">{email}</span>
                  <br />e clique no link para criar uma nova senha.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
