import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/chat'

  if (code) {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)

      if (!error && data?.session?.user) {
        const user = data.session.user

        // Ensure profile exists for OAuth users
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .single()

        if (!existingProfile) {
          const rawUsername =
            user.user_metadata?.username ||
            user.user_metadata?.full_name?.replace(/\s+/g, '_').toLowerCase() ||
            user.email?.split('@')[0] ||
            `user_${user.id.slice(0, 6)}`

          const cleanUsername = rawUsername.replace(/[^a-zA-Z0-9_]/g, '_').slice(0, 25)

          await supabase.from('profiles').upsert({
            id: user.id,
            username: cleanUsername,
            full_name:
              user.user_metadata?.full_name ||
              user.user_metadata?.name ||
              cleanUsername,
            avatar_url:
              user.user_metadata?.avatar_url ||
              user.user_metadata?.picture ||
              null,
          })
        }

        return NextResponse.redirect(new URL(next, requestUrl.origin))
      }
    } catch (err) {
      console.error('OAuth callback error:', err)
    }
  }

  // If error or no code, redirect to login with error parameter
  return NextResponse.redirect(new URL('/login?error=auth-callback-failed', requestUrl.origin))
}
