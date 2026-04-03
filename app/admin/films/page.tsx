'use client'

import Link from 'next/link'

const FILMS = [
  {
    title: 'EGO',
    type: 'Bollywood Feature Film',
    cast: 'Arshad Warsi, Juhi Chawla, Divya Dutta, Gauhar Khan',
    status: 'Preparing for Release',
    statusType: 'release',
    year: '2024',
  },
  {
    title: 'Palkon Pe',
    type: 'Feature Film · Hindi',
    cast: 'TBA',
    status: 'In Post-Production',
    statusType: 'post',
    year: '2024',
  },
  {
    title: 'Canvas',
    type: 'Feature Film',
    cast: 'In Development',
    status: 'In Production',
    statusType: 'production',
    year: '2025',
  },
]

const STATUS_COLORS = {
  release:    { bg:'rgba(232,104,58,0.12)',   text:'#e8683a', border:'rgba(232,104,58,0.4)' },
  post:       { bg:'rgba(100,140,220,0.1)',   text:'#84a8e8', border:'rgba(100,140,220,0.3)' },
  production: { bg:'rgba(180,180,100,0.12)',  text:'#c8c870', border:'rgba(180,180,100,0.4)' },
} as const

type StatusType = keyof typeof STATUS_COLORS

const TVCS = [
  { brand:'Nike', vimeoId:'2064044054', year:'2024' },
  { brand:'Harley Davidson', vimeoId:'2060441350', year:'2024' },
  { brand:'Maruti Suzuki', vimeoId:'2062686862', year:'2024' },
  { brand:'Adidas Y-3', vimeoId:'2061570309', year:'2023' },
  { brand:'Uber', vimeoId:'2058460834', year:'2023' },
  { brand:'Kinetic Green', vimeoId:'2062690757', year:'2023' },
]

export default function AdminFilmsPage() {
  return (
    <div>
      <h1 style={{ fontFamily:'var(--font-playfair,serif)', fontSize:28, fontWeight:400, color:'var(--color-text-primary)', marginBottom:'0.5rem', letterSpacing:'-0.02em' }}>
        Films & Portfolio
      </h1>
      <p style={{ fontSize:14, color:'var(--color-text-secondary)', marginBottom:'2.5rem' }}>
        Feature films and commercial reel management
      </p>

      {/* Feature films */}
      <h2 style={{ fontSize:12, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--color-text-tertiary)', marginBottom:'1.25rem', fontWeight:500 }}>
        Feature Films
      </h2>
      <div style={{ display:'flex', flexDirection:'column', gap:'1rem', marginBottom:'3rem' }}>
        {FILMS.map(film => {
          const sc = STATUS_COLORS[film.statusType as StatusType]
          return (
            <div key={film.title} style={{
              display:'grid', gridTemplateColumns:'1fr auto',
              alignItems:'center', gap:'2rem',
              padding:'1.5rem',
              border:'0.5px solid var(--color-border)',
              background:'var(--color-surface-1)',
            }}>
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'0.5rem', flexWrap:'wrap' }}>
                  <span style={{ fontFamily:'var(--font-playfair,serif)', fontSize:20, color:'var(--color-text-primary)' }}>
                    {film.title}
                  </span>
                  <span style={{
                    fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase',
                    color:sc.text, background:sc.bg, border:`0.5px solid ${sc.border}`,
                    padding:'2px 8px', borderRadius:1,
                  }}>{film.status}</span>
                </div>
                <p style={{ fontSize:13, color:'var(--color-text-tertiary)', marginBottom:'0.25rem' }}>{film.type} · {film.year}</p>
                <p style={{ fontSize:13, color:'var(--color-text-secondary)' }}>{film.cast}</p>
              </div>
              <div style={{ display:'flex', gap:'0.5rem', flexShrink:0 }}>
                <span style={{ fontSize:11, color:'var(--color-text-tertiary)', padding:'0.5rem 0.75rem', border:'0.5px solid var(--color-border)', borderRadius:2 }}>
                  Edit in sections/FilmsReel.tsx
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* TVCs */}
      <h2 style={{ fontSize:12, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--color-text-tertiary)', marginBottom:'1.25rem', fontWeight:500 }}>
        Commercial Reel — Vimeo IDs
      </h2>
      <div style={{ display:'flex', flexDirection:'column', gap:0, border:'0.5px solid var(--color-border)', marginBottom:'1.5rem' }}>
        <div style={{
          display:'grid', gridTemplateColumns:'1fr 1fr 80px',
          padding:'0.75rem 1.25rem', borderBottom:'0.5px solid var(--color-border)',
          background:'var(--color-surface-1)',
        }}>
          {['Brand', 'Vimeo ID', 'Year'].map(h => (
            <span key={h} style={{ fontSize:10, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--color-text-tertiary)' }}>{h}</span>
          ))}
        </div>
        {TVCS.map((tvc, i) => (
          <div key={tvc.brand} style={{
            display:'grid', gridTemplateColumns:'1fr 1fr 80px',
            alignItems:'center', padding:'0.875rem 1.25rem',
            borderBottom: i < TVCS.length-1 ? '0.5px solid var(--color-border)' : 'none',
          }}>
            <span style={{ fontSize:14, color:'var(--color-text-primary)' }}>{tvc.brand}</span>
            <code style={{ fontSize:12, color:'var(--color-accent)', background:'rgba(232,104,58,0.08)', padding:'2px 8px', borderRadius:2 }}>
              {tvc.vimeoId}
            </code>
            <span style={{ fontSize:12, color:'var(--color-text-tertiary)' }}>{tvc.year}</span>
          </div>
        ))}
      </div>
      <p style={{ fontSize:12, color:'var(--color-text-tertiary)', lineHeight:1.6 }}>
        Update Vimeo IDs in <code style={{ fontSize:11, background:'rgba(255,255,255,0.06)', padding:'1px 5px' }}>sections/WorkReel.tsx</code>.
        Make sure each video is set to <strong style={{ color:'var(--color-text-secondary)' }}>public</strong> and <strong style={{ color:'var(--color-text-secondary)' }}>embeddable</strong> in your Vimeo settings.
      </p>

      <div style={{ marginTop:'2.5rem', paddingTop:'2rem', borderTop:'0.5px solid var(--color-border)' }}>
        <Link href="/work" target="_blank" className="btn-ghost" style={{ fontSize:12, padding:'0.625rem 1.25rem' }}>
          View work page ↗
        </Link>
      </div>
    </div>
  )
}
