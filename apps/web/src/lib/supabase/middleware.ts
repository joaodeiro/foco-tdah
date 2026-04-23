import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()
  const isAuthPage = url.pathname.startsWith('/auth')
  const isPublic = url.pathname === '/'
  // /auth/reset needs an active session (password recovery flow),
  // so logged-in users must stay there instead of being bounced to /app.
  const isResetPage = url.pathname === '/auth/reset'

  if (!user && !isAuthPage && !isPublic) {
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  if (user && isAuthPage && !isResetPage) {
    url.pathname = '/app'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
