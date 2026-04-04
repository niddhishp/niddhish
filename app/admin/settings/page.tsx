'use client'
import { useState } from 'react'

export default function AdminSettings() {
  const [form, setForm] = useState({
    siteTitle: 'Niddhish Puuzhakkal',
    siteDesc: 'Filmmaker. Psychologist. Author. Strategist.',
    contactEmail: 'niddhish@lightseekermedia.com',
    contactPhone: '+91 99204 62666',
    linkedIn: 'https://linkedin.com/in/niddhish',
    twitter: 'https://twitter.com/niddhishp',
    instagram: 'https://instagram.com/niddhishp',
    vimeo: 'https://vimeo.com/niddhish',
    youtube: 'https://youtube.com/@niddhishp',
    address: 'Mumbai, India',
  })
  const [saved, setSaved] = useState(false)
  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => { setSaved(false); setForm(p => ({...p,[k]:e.target.value})) }

  return (
    <div>
      <div style={{ marginBottom:'2.5rem' }}>
        <h1 style={{ fontFamily:'var(--font-playfair,serif)', fontSize:28, fontWeight:400, color:'var(--color-text-primary)', marginBottom:'0.35rem', letterSpacing:'-0.02em' }}>Settings</h1>
        <p style={{ fontSize:14, color:'var(--color-text-secondary)' }}>Global site configuration.</p>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:'2rem', maxWidth:700 }}>
        <div style={{ border:'0.5px solid var(--color-border)', padding:'1.75rem' }}>
          <h2 style={sh}>Site Identity</h2>
          <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
            <div><label style={lbl}>Site Title</label><input value={form.siteTitle} onChange={f('siteTitle')} style={inp}/></div>
            <div><label style={lbl}>Site Description</label><textarea value={form.siteDesc} onChange={f('siteDesc')} rows={2} style={{...inp,resize:'vertical' as const}}/></div>
          </div>
        </div>

        <div style={{ border:'0.5px solid var(--color-border)', padding:'1.75rem' }}>
          <h2 style={sh}>Contact Information</h2>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
            <div><label style={lbl}>Email</label><input value={form.contactEmail} onChange={f('contactEmail')} style={inp}/></div>
            <div><label style={lbl}>Phone</label><input value={form.contactPhone} onChange={f('contactPhone')} style={inp}/></div>
            <div style={{ gridColumn:'1/-1' }}><label style={lbl}>Address / Location</label><input value={form.address} onChange={f('address')} style={inp}/></div>
          </div>
        </div>

        <div style={{ border:'0.5px solid var(--color-border)', padding:'1.75rem' }}>
          <h2 style={sh}>Social Links</h2>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
            {['linkedIn','twitter','instagram','vimeo','youtube'].map(k => (
              <div key={k}><label style={lbl}>{k}</label><input value={form[k as keyof typeof form]} onChange={f(k as keyof typeof form)} style={inp}/></div>
            ))}
          </div>
        </div>

        <button onClick={()=>setSaved(true)} className="btn-primary" style={{ alignSelf:'flex-start' }}>{saved ? 'Saved ✓' : 'Save Settings'}</button>
      </div>
    </div>
  )
}
const inp: React.CSSProperties = { width:'100%', background:'var(--color-surface-1)', border:'0.5px solid var(--color-border-mid)', padding:'0.625rem 0.875rem', fontSize:13, color:'var(--color-text-primary)', fontFamily:'inherit', outline:'none', boxSizing:'border-box' }
const lbl: React.CSSProperties = { display:'block', fontSize:10, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--color-text-tertiary)', marginBottom:'0.35rem' }
const sh: React.CSSProperties = { fontSize:11, fontWeight:500, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--color-text-tertiary)', marginBottom:'1.25rem' }
