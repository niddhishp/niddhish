import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
const e = (err: unknown) => typeof err==='object'&&err!==null&&'message' in err?(err as {message:string}).message:String(err)
export async function PATCH(req: Request, {params}:{params:Promise<{id:string}>}) {
  try { const {id}=await params; const body=await req.json(); const {error}=await getSupabaseAdmin().from('awards').update(body).eq('id',id); if(error)throw error; return NextResponse.json({success:true}) }
  catch(err){return NextResponse.json({error:e(err)},{status:500})}
}
export async function DELETE(_:Request, {params}:{params:Promise<{id:string}>}) {
  try { const {id}=await params; const {error}=await getSupabaseAdmin().from('awards').delete().eq('id',id); if(error)throw error; return NextResponse.json({success:true}) }
  catch(err){return NextResponse.json({error:e(err)},{status:500})}
}
