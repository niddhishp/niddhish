import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
const e = (err: unknown) => typeof err==='object'&&err!==null&&'message' in err?(err as {message:string}).message:String(err)
export async function GET() {
  try { const {data,error}=await getSupabaseAdmin().from('testimonials').select('*').order('sort_order'); if(error)throw error; return NextResponse.json({testimonials:data}) }
  catch(err){return NextResponse.json({error:e(err)},{status:500})}
}
export async function POST(req: Request) {
  try { const body=await req.json(); const {data,error}=await getSupabaseAdmin().from('testimonials').insert([body]).select().single(); if(error)throw error; return NextResponse.json({testimonial:data}) }
  catch(err){return NextResponse.json({error:e(err)},{status:500})}
}
