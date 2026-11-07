import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

async function parseBody(req: NextRequest) {
  const contentType = req.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    try {
      return await req.json()
    } catch {
      return {}
    }
  }
  if (contentType.includes('form') || contentType.includes('urlencoded')) {
    try {
      const formData = await req.formData()
      const entries: Record<string, any> = {}
      formData.forEach((val, key) => {
        entries[key] = val
      })
      return entries
    } catch {
      return {}
    }
  }
  try {
    return await req.json()
  } catch {
    return {}
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await parseBody(req)
    const email = body.email
    const password = body.password
    const fullName = body.fullName || body.full_name || body.name || ''
    const fallbackUsername = (email ? email.split('@')[0] : 'user')
      .toLowerCase()
      .replace(/[^a-zA-Z0-9_]/g, '_')
      .slice(0, 20)
    const username = (body.username || fallbackUsername)
      .toLowerCase()
      .replace(/[^a-zA-Z0-9_]/g, '_')
      .slice(0, 20)
    const avatarUrl =
      body.avatarUrl ||
      body.avatar_url ||
      'https://api.dicebear.com/7.x/bottts/svg?seed=nexus1'

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { data, error } = await supabase.auth.signUp({
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

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Upsert into public.profiles
    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        full_name: fullName,
        username,
        avatar_url: avatarUrl,
        is_online: true,
        last_seen: new Date().toISOString(),
      })
    }

    const needsEmailConfirmation = !data.session

    return NextResponse.json({
      success: true,
      message: needsEmailConfirmation
        ? 'Account created! Please check your email inbox to verify your account.'
        : 'Account created successfully',
      user: data.user,
      session: data.session,
      needsEmailConfirmation,
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Sign up failed'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.redirect(new URL('/register', req.url))
}
