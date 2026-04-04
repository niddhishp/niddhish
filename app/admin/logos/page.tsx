'use client'
import { useState } from 'react'

const DEFAULT_LOGOS = [
  'Nike', 'Harley Davidson', 'Adidas', 'Maruti Suzuki', 'Uber', 'Toyota', 'Ford',
  'Levis', 'Tanishq', 'Bandhan', 'Pfizer', 'LG', 'Zomato', 'Mastercard',
  'Big Basket', 'Skoda', 'Times of India', 'One Card', 'Housing.com', 'Kinetic Green',
  'Beardo', 'Vinsmera', 'Just Younger', 'HP', 'Tata', 'Honda', 'Cipla',
  'Aditya Birla', 'Mother Dairy', 'Paytm', 'Tata Sky', 'L\'Oréal',
]

export default function AdminLogos() {
  const [logos, setLogos] = useState(DEFAULT_LOGOS)
  const [newLogo, setNewLogo] = useState('')
  const [newLogoUrl, setNewLogoUrl] = useState('')

  return (
    <div>
      <div style={{ marginBottom:'2.5rem' }}>
        <h1 style={{ fontFamily:'var(--font-playfair,serif)', fontSize:28, fontWeight:400, color:'var(--color-text-primary)', marginBottom:'0.35rem', letterSpacing:'-0.02em' }}>Client Logos</h1>
        <p style={{ fontSize:14, color:'var(--color-text-secondary)' }}>Logos shown in the scrolling marquee on the homepage. {logos.length} clients.</p>
      </div>

      {/* Add new */}
      <div style={{ border:'0.5px solid var(--color-border)', padding:'1.5rem', marginBottom:'2rem' }}>
        <h2 style={{ fontSize:12, fontWeight:500, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--color-text-tertiary)', marginBottom:'1.25rem' }}>Add Logo</h2>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr auto', gap:'1rem', alignItems:'flex-end' }}>
          <div>
            <label style={lbl}>Client Name *</label>
            <input value={newLogo} onChange={e=>setNewLogo(e.target.value)} placeholder="Brand name" style={inp} />
          </div>
          <div>
            <label style={lbl}>Logo URL (optional)</label>
            <input value={newLogoUrl} onChange={e=>setNewLogoUrl(e.target.value)} placeholder="https://... or leave blank for text" style={inp} />
          </div>
          <button onClick={()=>{if(newLogo.trim()){setLogos(l=>[...l,newLogo.trim()]); setNewLogo(''); setNewLogoUrl('')}}} className="btn-primary">Add</button>
        </div>
        <p style={{ fontSize:11, color:'var(--color-text-tertiary)', marginTop:'0.75rem' }}>All logos are automatically sized to the same height in the marquee.</p>
      </div>

      {/* Logos grid */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem', marginBottom:'2rem' }}>
        {logos.map((logo, i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:'0.5rem', padding:'0.4rem 0.875rem', border:'0.5px solid var(--color-border)', background:'var(--color-surface-1)' }}>
            <span style={{ fontSize:13, color:'var(--color-text-primary)', letterSpacing:'0.04em' }}>{logo}</span>
            <button onClick={()=>setLogos(l=>l.filter((_,j)=>j!==i))} style={{ background:'none', border:'none', color:'rgba(255,80,80,0.5)', cursor:'pointer', fontSize:14, lineHeight:1, padding:0 }}>×</button>
          </div>
        ))}
      </div>

      {/* Marquee preview */}
      <div style={{ border:'0.5px solid var(--color-border)', padding:'1.5rem', overflow:'hidden' }}>
        <p style={{ fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--color-text-tertiary)', marginBottom:'1rem' }}>Marquee Preview</p>
        <div style={{ overflow:'hidden', whiteSpace:'nowrap' }}>
          {[...logos, ...logos].map((l,i) => (
            <span key={i} style={{ fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--color-text-tertiary)', padding:'0 1.5rem' }}>{l} ·</span>
          ))}
        </div>
      </div>
      <button className="btn-primary" style={{ marginTop:'1.5rem' }}>Save Changes</button>
    </div>
  )
}
const inp: React.CSSProperties = { width:'100%', background:'var(--color-surface-1)', border:'0.5px solid var(--color-border-mid)', padding:'0.625rem 0.875rem', fontSize:14, color:'var(--color-text-primary)', fontFamily:'inherit', outline:'none', boxSizing:'border-box' }
const lbl: React.CSSProperties = { display:'block', fontSize:11, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--color-text-tertiary)', marginBottom:'0.4rem' }
