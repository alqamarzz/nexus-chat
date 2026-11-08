import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import fs from 'fs'
import path from 'path'

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

    const timestamp = Date.now()
    const rawClean = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const fileName = `${timestamp}-${rawClean}`
    const storagePath = `${fallbackUserId}/${fileName}`

    const detectedMime =
      file.type ||
      (file.name.match(/\.(png|jpe?g|gif|webp|svg)$/i)
        ? `image/${file.name.split('.').pop()?.toLowerCase() === 'jpg' ? 'jpeg' : file.name.split('.').pop()?.toLowerCase()}`
        : file.name.match(/\.(mp4|webm|mov|mkv)$/i)
        ? 'video/mp4'
        : 'application/octet-stream')

    const fileBuffer = Buffer.from(await file.arrayBuffer())

    // 1. Try Supabase Storage first if admin or client is available
    const adminClient = createAdminClient()
    const clientToUse = adminClient || supabase

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
        // Bucket creation check failed, proceed
      }
    }

    try {
      const { data: storageData, error: storageError } = await clientToUse.storage
        .from('attachments')
        .upload(storagePath, fileBuffer, {
          cacheControl: '3600',
          upsert: true,
          contentType: detectedMime,
        })

      if (!storageError && storageData?.path) {
        const { data: publicUrlData } = clientToUse.storage
          .from('attachments')
          .getPublicUrl(storageData.path)

        if (publicUrlData?.publicUrl) {
          return NextResponse.json({
            url: publicUrlData.publicUrl,
            name: file.name,
            size: file.size,
            mime_type: detectedMime,
          })
        }
      }
    } catch {
      // Supabase Storage upload failed, fallback to local storage
    }

    // 2. Reliable Local Storage Fallback: Save file to public/uploads
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
    }

    const localFilePath = path.join(uploadsDir, fileName)
    await fs.promises.writeFile(localFilePath, fileBuffer)

    // Return the clean, lightweight URL
    const fileUrl = `/api/uploads/${fileName}`

    return NextResponse.json({
      url: fileUrl,
      name: file.name,
      size: file.size,
      mime_type: detectedMime,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Upload failed'
    console.error('Upload handler error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
