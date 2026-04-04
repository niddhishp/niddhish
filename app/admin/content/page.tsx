'use client'
import { useState } from 'react'

const SECTIONS = [
  { key:'hero', label:'Hero Section', fields:[
    { k:'title', label:'Title', val:'Creativity.' },
    { k:'titleItalic', label:'Title (italic / accent word)', val:'Applied.' },
    { k:'tagline', label:'Sub-tagline', val:'Behavioral filmmaking. Creative strategy. Technology built to think.' },
    { k:'subtitle', label:'Small italic line', val:'Where psychology meets cinema.' },
  ]},
  { key:'reel', label:'Work Reel Section', fields:[
    { k:'label', label:'Scene label', val:'SCENE 02 — THE REEL' },
    { k:'heading', label:'Heading', val:'200+ commercials.' },
    { k:'headingAccent', label:'Heading accent part', val:'A selection.' },
  ]},
  { key:'films', label:'Feature Films Section', fields:[
    { k:'label', label:'Scene label', val:'SCENE 03 — THE FEATURES' },
    { k:'heading', label:'Heading', val:'Three films.' },
    { k:'headingAccent', label:'Heading accent', val:'Story. Engineered.' },
  ]},
  { key:'contact', label:'Contact Section', fields:[
    { k:'heading', label:'Heading', val:'What problem needs a creative intelligence solution?' },
    { k:'subheading', label:'Subheading', val:'Every great collaboration starts with a clear brief.' },
    { k:'email', label:'Contact Email', val:'niddhish@lightseekermedia.com' },
    { k:'phone', label:'Contact Phone', val:'+91 99204 62666' },
    { k:'responseTime', label:'Response time note', val:'Response within 48 hours.' },
  ]},
]

export default function AdminContent() {
  const [active, setActive] = useState('hero')
  const [saved, setSaved] = useState(false)
  const section = SECTIONS.find(s => s.key === active)!

  return (
    <div>
      <div style={{ marginBottom:'2.5rem' }}>
        <h1 style={{ fontFamily:'var(--font-playfair,serif)', fontSize:28, fontWeight:400, color:'var(--color-text-primary)', marginBottom:'0.35rem', letterSpacing:'-0.02em' }}>Site Content</h1>
        <p style={{ fontSize:14, color:'var(--color-text-secondary)' }}>Edit text content across all homepage sections.</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'200px 1fr', gap:'2rem' }}>
        <div style={{ display:'flex', flexDirection:'column', gap:'0.25rem' }}>
          {SECTIONS.map(s => (
            <button key={s.key} onClick={()=>{ setActive(s.key); setSaved(false) }} style={{
              textAlign:'left', padding:'0.625rem 0.875rem', background: active===s.key ? 'rgba(232,104,58,0.08)' : 'transparent',
              border:'none', borderLeft: active===s.key ? '1.5px solid var(--color-accent)' : '1.5px solid transparent',
              color: active===s.key ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
              cursor:'pointer', fontSize:13, fontFamily:'inherit',
            }}>{s.label}</button>
          ))}
        </div>

        <div style={{ border:'0.5px solid var(--color-border)', padding:'2rem' }}>
          <h2 style={{ fontSize:14, color:'var(--color-text-primary)', marginBottom:'2rem', fontFamily:'var(--font-playfair,serif)' }}>{section.label}</h2>
          <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
            {section.fields.map(field => (
              <div key={field.k}>
                <label style={{ display:'block', fontSize:10, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--color-text-tertiary)', marginBottom:'0.35rem' }}>{field.label}</label>
                <input defaultValue={field.val} style={{ width:'100%', background:'var(--color-surface-1)', border:'0.5px solid var(--color-border-mid)', padding:'0.625rem 0.875rem', fontSize:13, color:'var(--color-text-primary)', fontFamily:'inherit', outline:'none', boxSizing:'border-box' as const }} onChange={()=>setSaved(false)}/>
              </div>
            ))}
          </div>
          <button onClick={()=>setSaved(true)} className="btn-primary" style={{ marginTop:'2rem' }}>{saved ? 'Saved ✓' : 'Save Section'}</button>
        </div>
      </div>
    </div>
  )
}
