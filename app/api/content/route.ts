import { NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase'

export const revalidate = 60 // Cache 60 seconds

export async function GET() {
  try {
    const sb = getSupabaseClient()
    const { data, error } = await sb.from('site_settings').select('key,value')
    if (error) throw error
    const settings: Record<string, string> = {}
    data?.forEach(row => { settings[row.key] = row.value })
    return NextResponse.json(settings)
  } catch {
    return NextResponse.json({})
  }
}
