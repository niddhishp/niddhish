import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  try {
    const { type, name, email, brief } = await req.json()

    if (!type || !name || !email || !brief) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    // Basic email validation
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRe.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    // Save to Supabase if credentials are configured
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (url && key) {
      const supabase = createClient(url, key)
      const { error } = await supabase.from('contacts').insert([{
        project_type: type,
        name,
        email,
        brief,
        created_at: new Date().toISOString(),
        status: 'new',
      }])
      if (error) {
        console.error('Supabase error:', error)
        // Still return success to user — don't expose DB errors
      }
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact API error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
