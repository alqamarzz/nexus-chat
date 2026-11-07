import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const fallbackUserId = (formData.get('userId') as string) || user?.id || 'anonymous'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Maximum 50MB for photos and videos
    const MAX_SIZE = 50 * 1024 * 1024
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File size exceeds 50MB limit' }, { status: 400 })
    }

    const fileExt = file.name.split('.').pop() || 'bin'
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const storagePath = `${fallbackUserId}/${Date.now()}-${cleanFileName}`

    const adminClient = createAdminClient()
    const clientToUse = adminClient || supabase

    // If admin client is available, make sure attachments bucket exists
    if (adminClient) {
      try {
        const { data: bucket } = await adminClient.storage.getBucket('attachments')
        if (!bucket) {
          await adminClient.storage.createBucket('attachments', {
            public: true,
            fileSizeLimit: MAX_SIZE,
          })
        }
      } catch {
        // Continue if check fails
      }
    }

    // Attempt Supabase Storage upload
    const { data, error } = await clientToUse.storage
      .from('attachments')
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type || 'application/octet-stream',
      })

    if (!error && data?.path) {
      const { data: publicUrlData } = clientToUse.storage
        .from('attachments')
        .getPublicUrl(data.path)

      return NextResponse.json({
        url: publicUrlData.publicUrl,
        name: file.name,
        size: file.size,
        mime_type: file.type || (file.name.match(/\.(mp4|webm|mov|mkv)$/i) ? 'video/mp4' : 'image/jpeg'),
      })
    }

    // If Supabase Storage failed (e.g. bucket doesn't exist yet in user's project),
    // fallback gracefully to base64 Data URL for files up to 10MB so chat never breaks:
    if (file.size <= 10 * 1024 * 1024) {
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const mimeType = file.type || (file.name.match(/\.(mp4|webm|mov|mkv)$/i) ? 'video/mp4' : 'image/jpeg')
      const base64 = buffer.toString('base64')
      const dataUrl = `data:${mimeType};base64,${base64}`

      return NextResponse.json({
        url: dataUrl,
        name: file.name,
        size: file.size,
        mime_type: mimeType,
        isFallback: true,
      })
    }

    return NextResponse.json(
      {
        error: error?.message || 'Storage bucket not available. Please create the attachments bucket in Supabase.',
      },
      { status: 500 }
    )
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Upload failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
