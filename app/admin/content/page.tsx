'use client'
import { useState, useEffect } from 'react'

const SECTION_FIELDS = [
  { section: 'Hero Section',          keys: [
    { k:'hero_tagline',        label:'Main Title',             placeholder:'Creativity.' },
    { k:'hero_tagline_accent', label:'Accent Title (coral italic)', placeholder:'Applied.' },
    { k:'hero_subtitle',       label:'Subtitle',               placeholder:'Behavioral filmmaking…' },
    { k:'hero_sub_italic',     label:'Small italic line',      placeholder:'Where psychology meets cinema.' },
  ]},
  { section: 'Work Reel Section',     keys: [
    { k:'section_reel_label',   label:'Scene label',  placeholder:'SCENE 02 — THE REEL' },
    { k:'section_reel_heading', label:'Heading',      placeholder:'200+ commercials.' },
    { k:'section_reel_accent',  label:'Heading accent (coral italic)', placeholder:'A selection.' },
  ]},
  { section: 'Feature Films Section', keys: [
    { k:'section_films_label',   label:'Scene label',  placeholder:'SCENE 03 — THE FEATURES' },
    { k:'section_films_heading', label:'Heading',      placeholder:'Three films.' },
    { k:'section_films_accent',  label:'Heading accent (coral italic)', placeholder:'Story. Engineered.' },
  ]},
  { section: 'Contact Section',       keys: [
    { k:'contact_email',   label:'Email',   placeholder:'niddhish@lightseekermedia.com' },
    { k:'contact_phone',   label:'Phone',   placeholder:'+91 99204 62666' },
    { k:'contact_address', label:'Address', placeholder:'Mumbai, India' },
  ]},
]

export default function AdminContent() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [active, setActive] = useState('Hero Section')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/settings').then(r => r.json()).then(d => {
      if (d.settings) setValues(d.settings)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const save = async () => {
    setSaving(true); setError('')
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Failed')
      setSaved(true); setTimeout(() => setSaved(false), 3000)
    } catch(e) { setError(e instanceof Error ? e.message : 'Save failed') }
    finally { setSaving(false) }
  }

  const section = SECTION_FIELDS.find(s => s.section === active)!

  if (loading) return <div style={{ padding:'3rem', color:'var(--color-text-tertiary)', fontSize:14 }}>Loading…</div>

  return (
    <div>
      <div style={{ marginBottom:'2.5rem' }}>
        <h1 style={{ fontFamily:'var(--font-playfair,serif)', fontSize:28, fontWeight:400, color:'var(--color-text-primary)', marginBottom:'0.35rem', letterSpacing:'-0.02em' }}>Site Content</h1>
        <p style={{ fontSize:14, color:'var(--color-text-secondary)' }}>Edit text across all homepage sections. Changes appear live within 60 seconds.</p>
      </div>
      {error && <div style={{ padding:'0.75rem 1rem', background:'rgba(255,80,80,0.08)', border:'0.5px solid rgba(255,80,80,0.3)', color:'#ff6060', fontSize:13, marginBottom:'1.5rem' }}>{error}</div>}

      <div style={{ display:'grid', gridTemplateColumns:'200px 1fr', gap:'2rem' }}>
        <div style={{ display:'flex', flexDirection:'column', gap:'0.25rem' }}>
          {SECTION_FIELDS.map(s => (
            <button key={s.section} onClick={() => { setActive(s.section); setSaved(false) }} style={{
              textAlign:'left', padding:'0.625rem 0.875rem', background: active===s.section ? 'rgba(232,104,58,0.08)' : 'transparent',
              border:'none', borderLeft: active===s.section ? '1.5px solid var(--color-accent)' : '1.5px solid transparent',
              color: active===s.section ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
              cursor:'pointer', fontSize:13, fontFamily:'inherit',
            }}>{s.section}</button>
          ))}
        </div>

        <div style={{ border:'0.5px solid var(--color-border)', padding:'2rem' }}>
          <h2 style={{ fontSize:14, color:'var(--color-text-primary)', marginBottom:'2rem', fontFamily:'var(--font-playfair,serif)' }}>{section.section}</h2>
          <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
            {section.keys.map(field => (
              <div key={field.k}>
                <label style={{ display:'block', fontSize:10, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--color-text-tertiary)', marginBottom:'0.35rem' }}>{field.label}</label>
                <input
                  value={values[field.k] || ''}
                  onChange={e => setValues(v => ({ ...v, [field.k]: e.target.value }))}
                  placeholder={field.placeholder}
                  style={{ width:'100%', background:'var(--color-surface-1)', border:'0.5px solid var(--color-border-mid)', padding:'0.625rem 0.875rem', fontSize:13, color:'var(--color-text-primary)', fontFamily:'inherit', outline:'none', boxSizing:'border-box' as const }}
                />
              </div>
            ))}
          </div>
          <button onClick={save} disabled={saving} className="btn-primary" style={{ marginTop:'2rem', opacity:saving?0.6:1 }}>
            {saved ? '✓ Saved — Live on site' : saving ? 'Saving…' : 'Save Section'}
          </button>
        </div>
      </div>
    </div>
  )
}
