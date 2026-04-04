import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return NextResponse.json({ contacts: data })
  } catch (err: unknown) {
    const msg = typeof err === "object" && err !== null && "message" in err ? (err as {message:string}).message : String(err)
    console.error('Admin contacts GET:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
