import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const ALLOWED_NEXT_PATHS = ['/app', '/auth/reset']

export async function GET(request: NextRequest) {
  const url = request.nextUrl
  const code = url.searchParams.get('code')
  const next = url.searchParams.get('next') || '/app'

  const target = ALLOWED_NEXT_PATHS.includes(next) ? next : '/app'

  if (!code) {
    return NextResponse.redirect(new URL('/auth/login?error=missing_code', request.url))
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(new URL('/auth/login?error=invalid_code', request.url))
  }

  return NextResponse.redirect(new URL(target, request.url))
}
