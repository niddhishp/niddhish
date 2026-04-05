import { NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase'
export const revalidate = 60
export async function GET() {
  try {
    const sb = getSupabaseClient()
    const { data, error } = await sb.from('videos').select('*').eq('is_active', true).order('sort_order')
    if (error) throw error
    return NextResponse.json({ videos: data })
  } catch { return NextResponse.json({ videos: [] }) }
}
