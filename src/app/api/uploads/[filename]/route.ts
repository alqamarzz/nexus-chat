import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Map common extensions to MIME types
const MIME_TYPES: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  svg: 'image/svg+xml',
  mp4: 'video/mp4',
  webm: 'video/webm',
  mov: 'video/quicktime',
  mkv: 'video/x-matroska',
  pdf: 'application/pdf',
  txt: 'text/plain',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  zip: 'application/zip',
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params
    const safeFilename = path.basename(filename)

    // Check in public/uploads first, then in uploads
    const publicPath = path.join(process.cwd(), 'public', 'uploads', safeFilename)
    const fallbackPath = path.join(process.cwd(), 'uploads', safeFilename)

    const filePath = fs.existsSync(publicPath)
      ? publicPath
      : fs.existsSync(fallbackPath)
      ? fallbackPath
      : null

    if (!filePath) {
      return new NextResponse('File not found', { status: 404 })
    }

    const fileBuffer = await fs.promises.readFile(filePath)
    const ext = safeFilename.split('.').pop()?.toLowerCase() || ''
    const contentType = MIME_TYPES[ext] || 'application/octet-stream'

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
