import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST() {
  try {
    const supabase = await createClient()
    const email = 'google.user@nexuschat.io'
    const password = 'NexusGoogleDemoPass2026!'
    const fullName = 'Google Tester'
    const username = 'google_user'
    const avatarUrl = 'https://api.dicebear.com/7.x/bottts/svg?seed=google_user'

    // First try signing in
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (!signInError && signInData.session) {
      return NextResponse.json({ success: true, email })
    }

    // If account doesn't exist, try signing up
    const adminClient = createAdminClient()
    if (adminClient) {
      await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: fullName,
          username,
          avatar_url: avatarUrl,
        },
      })
    } else {
      await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            username,
            avatar_url: avatarUrl,
          },
        },
      })
    }

    // Now sign in
    const { error: finalSignInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (finalSignInError) {
      return NextResponse.json({ error: finalSignInError.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, email })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Google demo sign in failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
