import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await getSupabaseAdmin()
      .from('thumbnail_overrides').select('*')
    if (error) throw error
    // Return as {videoId: thumbUrl} map
    const map: Record<string,string> = {}
    data?.forEach(r => { map[r.video_id] = r.thumb_url })
    return NextResponse.json({ overrides: map })
  } catch(e) { return NextResponse.json({ overrides: {} }) }
}

export async function POST(req: Request) {
  try {
    const { video_id, thumb_url } = await req.json()
    if (!video_id || !thumb_url) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    const { error } = await getSupabaseAdmin()
      .from('thumbnail_overrides')
      .upsert({ video_id, thumb_url, updated_at: new Date().toISOString() }, { onConflict: 'video_id' })
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch(e) { return NextResponse.json({ error: String(e) }, { status: 500 }) }
}
