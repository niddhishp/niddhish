import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
const err = (e: unknown) => typeof e==='object'&&e!==null&&'message' in e ? (e as {message:string}).message : String(e)
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params; const body = await req.json()
    const { error } = await getSupabaseAdmin().from('categories').update(body).eq('id', id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch(e) { return NextResponse.json({ error: err(e) }, { status: 500 }) }
}
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { error } = await getSupabaseAdmin().from('categories').delete().eq('id', id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch(e) { return NextResponse.json({ error: err(e) }, { status: 500 }) }
}
