/**
 * Tradução de erros sem depender de toast (sonner é web-only).
 * Quem consome (web ou mobile) plugaria seu próprio displayer.
 *
 * Mantém paridade com apps/web/src/lib/errors.ts.
 */

export interface TranslatedError {
  message: string
  hint?: string
}

export function translateError(err: unknown): TranslatedError {
  if (!err) {
    return { message: 'Algo deu errado.', hint: 'Tente de novo em alguns segundos.' }
  }

  const e = err as { message?: string; error_description?: string; code?: string; status?: number }
  const raw = (e.message || e.error_description || String(err)).toLowerCase()
  const status = e.status

  if (raw.includes('invalid login credentials')) {
    return { message: 'E-mail ou senha incorretos.', hint: 'Confira se digitou certo. Se esqueceu, use "Esqueci".' }
  }
  if (raw.includes('email not confirmed')) {
    return { message: 'Seu e-mail ainda não foi confirmado.', hint: 'Verifique sua caixa de entrada (e o spam) e clique no link.' }
  }
  if (raw.includes('user already registered') || raw.includes('already been registered')) {
    return { message: 'Esse e-mail já tem uma conta.', hint: 'Vá em "Entrar", ou use "Esqueci" se não lembra da senha.' }
  }
  if (raw.includes('new password should be different') || raw.includes('same as the old')) {
    return { message: 'A nova senha precisa ser diferente da atual.', hint: 'Escolha algo que você não usou antes.' }
  }
  if (raw.includes('current password required') || raw.includes('reauthentication')) {
    return { message: 'Sua sessão de recuperação expirou.', hint: 'Volte em "Esqueci minha senha" e peça um novo link.' }
  }
  if (raw.includes('password should be at least')) {
    const match = raw.match(/at least (\d+)/)
    const min = match ? match[1] : '8'
    return { message: `A senha precisa ter pelo menos ${min} caracteres.`, hint: 'Misture letras, números e um símbolo.' }
  }
  if (raw.includes('invalid email')) {
    return { message: 'E-mail inválido.', hint: 'Confira se não faltou o @ ou o domínio.' }
  }
  if (raw.includes('rate limit') || raw.includes('too many') || status === 429) {
    return { message: 'Muitas tentativas em pouco tempo.', hint: 'Aguarde uns 2 minutos e tente de novo.' }
  }
  if (raw.includes('network') || raw.includes('fetch failed') || raw.includes('failed to fetch')) {
    return { message: 'Sem conexão com o servidor.', hint: 'Verifique sua internet e tente de novo.' }
  }
  if (status === 401) return { message: 'Você precisa estar logado.', hint: 'Faça login e tente de novo.' }
  if (status === 403) return { message: 'Você não tem permissão para isso.', hint: 'Saia e entre de novo.' }
  if (status && status >= 500) return { message: 'O servidor teve um problema.', hint: 'Aguarde um minuto e tente de novo.' }

  const original = e.message || String(err)
  const looksEnglish = /\b(the|is|was|are|error|required|invalid|failed|when|setting|current|password|missing|expired|token|session)\b/i.test(original)
  if (original && original.length > 0 && original.length < 120 && !looksEnglish) {
    return { message: original, hint: 'Se continuar, saia e entre de novo.' }
  }
  return { message: 'Algo deu errado.', hint: 'Tente de novo. Se persistir, saia e entre de novo.' }
}
