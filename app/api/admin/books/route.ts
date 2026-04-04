import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const sb = getSupabaseAdmin()
    const { data, error } = await sb.from('books').select('*').order('sort_order')
    if (error) throw error
    return NextResponse.json({ books: data })
  } catch (err: unknown) {
    const msg = typeof err === 'object' && err !== null && 'message' in err
      ? (err as { message: string }).message : String(err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const sb = getSupabaseAdmin()
    const { data, error } = await sb.from('books').insert([body]).select().single()
    if (error) throw error
    return NextResponse.json({ book: data })
  } catch (err: unknown) {
    const msg = typeof err === 'object' && err !== null && 'message' in err
      ? (err as { message: string }).message : String(err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
