import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export const revalidate = 0

export async function GET() {
  try {
    const { data } = await getSupabaseAdmin()
      .from('press_items')
      .select('*')
      .eq('published', true)
      .order('year', { ascending: false })
    return NextResponse.json({ items: data || [] })
  } catch {
    return NextResponse.json({ items: [] })
  }
}
