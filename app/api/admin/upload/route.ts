import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const bucket = (formData.get('bucket') as string) || 'uploads'

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    const ext = file.name.split('.').pop()
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const sb = getSupabaseAdmin()

    // Ensure bucket exists (upsert-style)
    await sb.storage.createBucket(bucket, { public: true }).catch(() => {})

    const { data, error } = await sb.storage
      .from(bucket)
      .upload(filename, file, { contentType: file.type, upsert: false })

    if (error) throw error

    const { data: { publicUrl } } = sb.storage.from(bucket).getPublicUrl(data.path)

    return NextResponse.json({ url: publicUrl, path: data.path })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 })
  }
}
