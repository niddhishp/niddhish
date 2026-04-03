import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id }    = await params
    const { status } = await request.json()

    if (!['new', 'read', 'replied'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()
    const { error } = await supabase
      .from('contacts')
      .update({ status })
      .eq('id', id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Admin contacts PATCH:', err)
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 })
  }
}
