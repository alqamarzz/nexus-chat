import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const urlEnv = process.env.NEXT_PUBLIC_SUPABASE_URL
  const keyEnv = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const validUrl = urlEnv && urlEnv.startsWith('http')
    ? urlEnv.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '')
    : 'https://placeholder-project.supabase.co'
  const validKey = keyEnv && keyEnv.length > 10 ? keyEnv : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholderKey'

  const supabase = createServerClient(
    validUrl,
    validKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Do not write any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()
  const authPaths = ['/login', '/register', '/signin', '/sign-in', '/signup', '/sign-up', '/forgot-password']
  const isAuthPage = authPaths.some((p) => url.pathname.startsWith(p))
  const isAppPage =
    url.pathname.startsWith('/chat') ||
    url.pathname.startsWith('/settings') ||
    url.pathname.startsWith('/groups')

  if (!user && isAppPage) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user && isAuthPage) {
    url.pathname = '/chat'
    return NextResponse.redirect(url)
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  return supabaseResponse
}
