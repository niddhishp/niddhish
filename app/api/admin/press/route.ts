import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const sb = getSupabaseAdmin()
    const { data, error } = await sb.from('press_items').select('*').order('year', { ascending: false })
    if (error) throw error
    return NextResponse.json({ items: data })
  } catch (err: unknown) {
    return NextResponse.json({ error: typeof err === "object" && err !== null && "message" in err ? (err as {message:string}).message : String(err) }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const sb = getSupabaseAdmin()
    const { data, error } = await sb.from('press_items').insert([body]).select().single()
    if (error) throw error
    return NextResponse.json({ item: data })
  } catch (err: unknown) {
    return NextResponse.json({ error: typeof err === "object" && err !== null && "message" in err ? (err as {message:string}).message : String(err) }, { status: 500 })
  }
}
