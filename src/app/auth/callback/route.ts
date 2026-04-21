import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const url = request.nextUrl
  const code = url.searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(new URL('/auth/login?error=missing_code', request.url))
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(new URL('/auth/login?error=invalid_code', request.url))
  }

  return NextResponse.redirect(new URL('/app', request.url))
}
