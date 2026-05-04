import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export const revalidate = 0

export async function GET() {
  const { data, error } = await getSupabaseAdmin()
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ projects: data || [] })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { data, error } = await getSupabaseAdmin()
      .from('projects')
      .insert([{ ...body, updated_at: new Date().toISOString() }])
      .select()
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ project: data })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
