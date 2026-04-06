import { NextResponse } from 'next/server'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const res = await fetch(
      `https://vimeo.com/api/oembed.json?url=https://vimeo.com/${id}&width=1280`,
      { headers: { 'User-Agent': 'Mozilla/5.0' }, next: { revalidate: 86400 } }
    )
    if (!res.ok) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const data = await res.json()
    const thumb = (data.thumbnail_url || '').replace(/_\d+$/, '_1280')
    return NextResponse.json({ thumbnail: thumb, title: data.title })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
