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
  } catch (err) {
    console.error('Admin contacts GET:', err)
    return NextResponse.json(
      { error: 'Failed to fetch contacts. Check Supabase configuration.' },
      { status: 500 }
    )
  }
}
