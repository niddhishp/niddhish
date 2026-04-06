import type { Metadata } from 'next'
import PressClient from './PressClient'

export const metadata: Metadata = {
  title: 'Press & Media — Niddhish Puuzhakkal',
  description: 'Media coverage, podcast appearances, and thought leadership by Niddhish Puuzhakkal — film director and brand strategist, Mumbai.',
}

export const revalidate = 60

async function getPressItems() {
  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://niddhish.com'
    const res = await fetch(`${base}/api/press`, { next: { revalidate: 60 } })
    const data = await res.json()
    return data.items || []
  } catch { return [] }
}

export default async function PressPage() {
  const items = await getPressItems()
  const press = items.filter((i: {kind?: string}) => i.kind !== 'podcast')
  const podcasts = items.filter((i: {kind?: string}) => i.kind === 'podcast')

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--color-bg)', paddingTop: '8rem' }}>
      <div style={{ padding: '0 clamp(1.25rem,5vw,3.5rem)', marginBottom: '4rem' }}>
        <div style={{ fontFamily:'"JetBrains Mono","Courier New",monospace', fontSize:9, letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(232,104,58,0.5)', marginBottom:'1rem' }}>SCENE 07 — THE RECORD</div>
        <span className="text-label" style={{ display:'block', marginBottom:'0.75rem' }}>Press & Media</span>
        <h1 className="text-display-md" style={{ color:'var(--color-text-primary)', maxWidth:640 }}>
          On the record.{' '}<em style={{ color:'var(--color-accent)' }}>Coverage, conversations, appearances.</em>
        </h1>
      </div>
      <PressClient press={press} podcasts={podcasts} />
      <div style={{ padding:'4rem clamp(1.25rem,5vw,3.5rem)', borderTop:'0.5px solid var(--color-border)', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'2rem' }}>
        <div>
          <span className="text-label" style={{ display:'block', marginBottom:'0.75rem' }}>Press Inquiries</span>
          <p style={{ fontSize:15, color:'var(--color-text-secondary)' }}>For interviews, features, and media requests</p>
        </div>
        <a href="mailto:niddhish@lightseekermedia.com" className="btn-ghost">niddhish@lightseekermedia.com</a>
      </div>
    </div>
  )
}
