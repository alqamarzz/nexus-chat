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
    const email = body.email || body.usernameOrEmail
    const password = body.password

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    // Fetch user profile if it exists
    let profile = null
    if (data.user) {
      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()
      profile = prof
    }

    return NextResponse.json({
      success: true,
      message: 'Signed in successfully',
      user: data.user,
      session: data.session,
      profile,
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Sign in failed'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.redirect(new URL('/login', req.url))
}
