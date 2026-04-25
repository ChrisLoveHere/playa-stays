// ============================================================
// /api/admin/media — Upload images to WordPress media library
//
// POST: accepts multipart/form-data with one or more "file" fields.
// Returns array of { id, url, alt, width, height } for each uploaded file.
//
// Optional form fields:
//   post_id — attach media to a specific property post
//   alt     — alt text for all uploaded images
// ============================================================

import { NextResponse, type NextRequest } from 'next/server'
import { getWordPressApiBaseUrl } from '@/lib/wp-api-base'

const WP_API = getWordPressApiBaseUrl()
const WP_AUTH = process.env.WP_APP_PASSWORD

interface MediaResult {
  id: number
  url: string
  alt: string
  width: number
  height: number
  filename: string
}

export async function POST(request: NextRequest) {
  if (!WP_API || !WP_AUTH) {
    return NextResponse.json(
      { error: 'WordPress API credentials not configured. Set WP_API_URL and WP_APP_PASSWORD in .env.local.' },
      { status: 503 }
    )
  }

  try {
    const formData = await request.formData()
    const files = formData.getAll('file') as File[]
    const postId = formData.get('post_id') as string | null
    const altText = formData.get('alt') as string | null

    if (files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 })
    }

    const results: MediaResult[] = []

    for (const file of files) {
      if (!(file instanceof File)) continue

      const buffer = Buffer.from(await file.arrayBuffer())

      const wpFormData = new FormData()
      wpFormData.append('file', new Blob([buffer], { type: file.type }), file.name)

      if (altText) {
        wpFormData.append('alt_text', altText)
      }
      if (postId) {
        wpFormData.append('post', postId)
      }

      const authHeader = `Basic ${Buffer.from(WP_AUTH).toString('base64')}`

      const res = await fetch(`${WP_API}/media`, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
        },
        body: wpFormData,
      })

      if (!res.ok) {
        const text = await res.text()
        console.error(`WP media upload failed for ${file.name}:`, res.status, text)
        return NextResponse.json(
          { error: `Upload failed for ${file.name}: ${res.status}`, detail: text },
          { status: res.status }
        )
      }

      const media = await res.json()
      results.push({
        id: media.id,
        url: media.source_url || media.guid?.rendered || '',
        alt: media.alt_text || '',
        width: media.media_details?.width || 0,
        height: media.media_details?.height || 0,
        filename: file.name,
      })
    }

    return NextResponse.json({ success: true, media: results })
  } catch (err) {
    console.error('Media upload error:', err)
    return NextResponse.json({ error: 'Failed to upload media' }, { status: 500 })
  }
}
