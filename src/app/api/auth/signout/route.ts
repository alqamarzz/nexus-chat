import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.signOut()
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ success: true, message: 'Signed out successfully' })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Sign out failed'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.redirect(new URL('/login', req.url))
}
