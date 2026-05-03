import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export const revalidate = 0

export async function GET() {
  try {
    const { data } = await getSupabaseAdmin()
      .from('video_url_overrides')
      .select('railway_id, video_url')
    const map: Record<string, string> = {}
    data?.forEach(r => { map[r.railway_id] = r.video_url })
    return NextResponse.json({ overrides: map })
  } catch {
    return NextResponse.json({ overrides: {} })
  }
}
