import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export const revalidate = 0

export async function GET() {
  try {
    const { data, error } = await getSupabaseAdmin()
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
    if (error) throw error
    return NextResponse.json({ posts: data || [] })
  } catch {
    return NextResponse.json({ posts: [] })
  }
}
