import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const validUrl = url && url.startsWith('http')
    ? url.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '')
    : 'https://placeholder-project.supabase.co'
  const validKey = key && key.length > 10 ? key : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholderKey'

  return createBrowserClient(validUrl, validKey)
}
