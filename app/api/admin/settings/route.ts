import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const sb = getSupabaseAdmin()
    const { data, error } = await sb.from('site_settings').select('*')
    if (error) throw error
    const settings: Record<string, string> = {}
    data?.forEach(row => { settings[row.key] = row.value })
    return NextResponse.json({ settings })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as Record<string, string>
    const sb = getSupabaseAdmin()
    const upserts = Object.entries(body).map(([key, value]) => ({ key, value, updated_at: new Date().toISOString() }))
    const { error } = await sb.from('site_settings').upsert(upserts, { onConflict: 'key' })
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 })
  }
}
