import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
const err = (e: unknown) => typeof e==='object'&&e!==null&&'message' in e ? (e as {message:string}).message : String(e)
export async function GET() {
  try {
    const { data, error } = await getSupabaseAdmin().from('videos').select('*').order('sort_order')
    if (error) throw error
    return NextResponse.json({ videos: data })
  } catch(e) { return NextResponse.json({ error: err(e) }, { status: 500 }) }
}
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { data, error } = await getSupabaseAdmin().from('videos').insert([body]).select().single()
    if (error) throw error
    return NextResponse.json({ video: data })
  } catch(e) { return NextResponse.json({ error: err(e) }, { status: 500 }) }
}
