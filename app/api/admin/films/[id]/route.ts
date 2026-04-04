import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const sb = getSupabaseAdmin()
    const { error } = await sb.from('films').update(body).eq('id', id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const msg = typeof err === 'object' && err !== null && 'message' in err
      ? (err as { message: string }).message : String(err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const sb = getSupabaseAdmin()
    const { error } = await sb.from('films').delete().eq('id', id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const msg = typeof err === 'object' && err !== null && 'message' in err
      ? (err as { message: string }).message : String(err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
