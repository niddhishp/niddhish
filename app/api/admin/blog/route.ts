import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const sb = getSupabaseAdmin()
    const { data, error } = await sb.from('blog_posts').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return NextResponse.json({ posts: data })
  } catch (err: unknown) {
    return NextResponse.json({ error: typeof err === "object" && err !== null && "message" in err ? (err as {message:string}).message : String(err) }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const sb = getSupabaseAdmin()
    const { data, error } = await sb.from('blog_posts').insert([body]).select().single()
    if (error) throw error
    return NextResponse.json({ post: data })
  } catch (err: unknown) {
    return NextResponse.json({ error: typeof err === "object" && err !== null && "message" in err ? (err as {message:string}).message : String(err) }, { status: 500 })
  }
}
