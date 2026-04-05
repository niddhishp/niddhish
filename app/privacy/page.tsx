import { Metadata } from 'next'
import { getSiteContent } from '@/lib/site-content'
export const revalidate = 60
export const metadata: Metadata = { title: 'Privacy Policy — Niddhish Puuzhakkal' }
export default async function PrivacyPage() {
  const content = await getSiteContent() as Record<string, string>
  const md = content.privacy_content || '# Privacy Policy\n\nUpdated April 2026.\n\nLight Seeker Films does not sell or share your data. Contact forms are used only to respond to inquiries.'
  const lines = md.split('\n')
  return (
    <main style={{ background:'var(--color-bg)', minHeight:'100dvh', padding:'clamp(8rem,14vh,12rem) clamp(1.5rem,5vw,4rem) 5rem', maxWidth:'720px', margin:'0 auto' }}>
      {lines.map((line: string, i: number) => {
        if (line.startsWith('## ')) return <h2 key={i} style={{ fontFamily:'var(--font-playfair,serif)', fontSize:'clamp(20px,3vw,28px)', fontWeight:400, color:'var(--color-text-primary)', marginTop:'2.5rem', marginBottom:'1rem', letterSpacing:'-0.02em' }}>{line.slice(3)}</h2>
        if (line.startsWith('# '))  return <h1 key={i} style={{ fontFamily:'var(--font-playfair,serif)', fontSize:'clamp(30px,5vw,48px)', fontWeight:400, color:'var(--color-text-primary)', marginBottom:'2rem', letterSpacing:'-0.03em' }}>{line.slice(2)}</h1>
        if (line.trim() === '')     return <br key={i}/>
        return <p key={i} style={{ fontSize:15, lineHeight:1.75, color:'var(--color-text-secondary)', marginBottom:'0.75rem' }}>{line}</p>
      })}
    </main>
  )
}
