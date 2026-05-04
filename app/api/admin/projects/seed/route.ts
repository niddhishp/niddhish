import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

const RAILWAY = 'https://lightseeker-films-production.up.railway.app'
const PLACEHOLDER = 'EQV7jlmU72Q'

export async function POST() {
  try {
    // Check if already seeded
    const { count } = await getSupabaseAdmin()
      .from('projects').select('*', { count: 'exact', head: true })
    if ((count || 0) > 0) return NextResponse.json({ skipped: true, existing: count })

    // Fetch from Railway
    const res = await fetch(`${RAILWAY}/api/projects?is_active=true`)
    const data = await res.json()
    if (!Array.isArray(data)) return NextResponse.json({ error: 'Railway data invalid' }, { status: 500 })

    // Also fetch URL overrides from Supabase
    const { data: urlOvr } = await getSupabaseAdmin().from('video_url_overrides').select('railway_id, video_url')
    const urlMap: Record<string, string> = {}
    urlOvr?.forEach(r => { urlMap[r.railway_id] = r.video_url })

    const rows = data.map((v: { id: string; title: string; client: string; category: string; duration: string; thumbnail: string; video_url: string; is_featured: boolean; sort_order: number }) => ({
      title: v.title || '',
      client: v.client || '',
      category: v.category || '',
      video_url: urlMap[v.id] || (v.video_url?.includes(PLACEHOLDER) ? '' : (v.video_url || '')),
      duration: v.duration || '',
      thumbnail: v.thumbnail || '',
      is_featured: !!v.is_featured,
      is_active: true,
      sort_order: v.sort_order ?? 99,
    }))

    const { error } = await getSupabaseAdmin().from('projects').insert(rows)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ seeded: rows.length })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
