import { toast } from 'sonner'

/**
 * Camada de tradução de erros → mensagens acionáveis para o usuário.
 *
 * Princípios:
 * - Norman (Design of Everyday Things): toda mensagem responde "o quê",
 *   "por quê" e "como resolver".
 * - Clean Code (Martin): erros com contexto, nunca swallow silencioso.
 * - DDD (Evans): Ubiquitous Language — falar com o usuário no idioma
 *   do domínio, nunca expor jargão técnico (stack trace, status code).
 *
 * Fonte única da verdade. Qualquer catch da aplicação chama `showError(err)`.
 */

interface TranslatedError {
  /** O que aconteceu, em uma frase. */
  message: string
  /** Como resolver. Opcional mas recomendado. */
  hint?: string
}

export function translateError(err: unknown): TranslatedError {
  if (!err) {
    return {
      message: 'Algo deu errado.',
      hint: 'Tente de novo em alguns segundos.',
    }
  }

  const e = err as { message?: string; error_description?: string; code?: string; status?: number }
  const raw = (e.message || e.error_description || String(err)).toLowerCase()
  const status = e.status

  // ─── Supabase Auth ────────────────────────────────────────────────
  if (raw.includes('invalid login credentials')) {
    return {
      message: 'E-mail ou senha incorretos.',
      hint: 'Confira se digitou certo. Se esqueceu, use "Esqueci".',
    }
  }

  if (raw.includes('email not confirmed')) {
    return {
      message: 'Seu e-mail ainda não foi confirmado.',
      hint: 'Verifique sua caixa de entrada (e a pasta de spam) e clique no link.',
    }
  }

  if (raw.includes('user already registered') || raw.includes('already been registered')) {
    return {
      message: 'Esse e-mail já tem uma conta.',
      hint: 'Vá em "Entrar", ou use "Esqueci" se não lembra da senha.',
    }
  }

  if (raw.includes('new password should be different') || raw.includes('same as the old')) {
    return {
      message: 'A nova senha precisa ser diferente da atual.',
      hint: 'Escolha algo que você não usou antes.',
    }
  }

  if (raw.includes('password should be at least')) {
    const match = raw.match(/at least (\d+)/)
    const min = match ? match[1] : '8'
    return {
      message: `A senha precisa ter pelo menos ${min} caracteres.`,
      hint: 'Misture letras, números e um símbolo para ficar mais segura.',
    }
  }

  if (raw.includes('password is known to be weak') || raw.includes('weak password')) {
    return {
      message: 'Essa senha é muito comum e fácil de adivinhar.',
      hint: 'Evite palavras óbvias e sequências como 123456.',
    }
  }

  if (raw.includes('invalid email') || raw.includes('email address') && raw.includes('invalid')) {
    return {
      message: 'E-mail inválido.',
      hint: 'Confira se não faltou o @ ou o domínio.',
    }
  }

  if (raw.includes('rate limit') || raw.includes('too many') || status === 429) {
    return {
      message: 'Muitas tentativas em pouco tempo.',
      hint: 'Aguarde uns 2 minutos e tente de novo.',
    }
  }

  if (raw.includes('token has expired') || raw.includes('token is invalid') || raw.includes('expired')) {
    return {
      message: 'Esse link expirou.',
      hint: 'Peça um novo em "Esqueci minha senha".',
    }
  }

  if (raw.includes('jwt') || raw.includes('session') && raw.includes('invalid')) {
    return {
      message: 'Sua sessão expirou.',
      hint: 'Saia e entre de novo para continuar.',
    }
  }

  // ─── Rede / conectividade ─────────────────────────────────────────
  if (raw.includes('network') || raw.includes('fetch failed') || raw.includes('failed to fetch')) {
    return {
      message: 'Sem conexão com o servidor.',
      hint: 'Verifique sua internet e tente de novo.',
    }
  }

  // ─── Postgres (via PostgREST) ─────────────────────────────────────
  if (e.code === '23505' || raw.includes('duplicate key')) {
    return {
      message: 'Esse registro já existe.',
      hint: 'Talvez você tenha criado algo igual antes.',
    }
  }

  if (e.code === '23503' || raw.includes('foreign key')) {
    return {
      message: 'Não consegui salvar por uma referência inválida.',
      hint: 'Recarregue a página e tente de novo.',
    }
  }

  if (raw.includes('row-level security') || raw.includes('permission denied')) {
    return {
      message: 'Você não tem permissão para fazer isso.',
      hint: 'Saia e entre de novo para renovar sua sessão.',
    }
  }

  // ─── Status HTTP ──────────────────────────────────────────────────
  if (status === 401) {
    return {
      message: 'Você precisa estar logado.',
      hint: 'Faça login e tente de novo.',
    }
  }

  if (status === 403) {
    return {
      message: 'Você não tem permissão para isso.',
      hint: 'Saia e entre de novo para renovar sua sessão.',
    }
  }

  if (status && status >= 500) {
    return {
      message: 'O servidor teve um problema.',
      hint: 'Não é culpa sua — aguarde um minuto e tente de novo.',
    }
  }

  // ─── Fallback: aproveita a mensagem original se for curta o suficiente ───
  const original = e.message || String(err)
  if (original && original.length > 0 && original.length < 100 && !raw.includes('undefined')) {
    return {
      message: original,
      hint: 'Se continuar, saia e entre de novo.',
    }
  }

  return {
    message: 'Algo deu errado.',
    hint: 'Tente de novo. Se persistir, saia e entre de novo.',
  }
}

/** Mostra toast a partir de um erro externo (API, Supabase, rede). */
export function showError(err: unknown) {
  const { message, hint } = translateError(err)
  console.error('[error]', err) // log técnico para debug, não exposto ao usuário
  toast.error(message, hint ? { description: hint, duration: 6000 } : { duration: 5000 })
}

/** Mostra toast de validação client-side (mensagem já pronta, sem tradução). */
export function showValidation(message: string, hint?: string) {
  toast.error(message, hint ? { description: hint, duration: 5000 } : { duration: 4000 })
}

/** Mostra toast de sucesso com descrição opcional. */
export function showSuccess(message: string, description?: string) {
  toast.success(message, description ? { description } : undefined)
}

/** Mostra toast informativo. */
export function showInfo(message: string, description?: string) {
  toast.info(message, description ? { description } : undefined)
}
