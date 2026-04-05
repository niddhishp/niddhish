'use client'
import { useState, useEffect } from 'react'

export default function AdminSEO() {
  const [form, setForm] = useState({
    seo_title: 'Niddhish Puuzhakkal — Creativity. Applied.',
    seo_description: 'Filmmaker. Psychologist. Author. Strategist. Technologist. 200+ commercials, 3 films, 3 books, 80+ brands. Creative intelligence applied to every problem.',
    seo_keywords: 'Niddhish Puuzhakkal, film director India, TVC director Mumbai, brand strategy, creative director, filmmaker psychologist, Light Seeker Films',
    seo_og_image: 'https://niddhish.com/og-image.jpg',
    seo_twitter_handle: '@niddhishp',
    seo_robots: 'index, follow',
    seo_canonical: 'https://niddhish.com',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/settings').then(r=>r.json()).then(d => {
      if (d.settings) setForm(f => ({ ...f, ...d.settings }))
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const save = async () => {
    setSaving(true); setError('')
    try {
      const res = await fetch('/api/admin/settings', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form) })
      if (!res.ok) throw new Error((await res.json()).error)
      setSaved(true); setTimeout(()=>setSaved(false), 3000)
    } catch(e) { setError(e instanceof Error ? e.message : 'Save failed') }
    finally { setSaving(false) }
  }

  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) =>
    setForm(p => ({...p,[k]:e.target.value}))

  const titleLen = form.seo_title.length
  const descLen = form.seo_description.length

  if (loading) return <div style={{ padding:'3rem', color:'var(--color-text-tertiary)', fontSize:14 }}>Loading…</div>

  return (
    <div>
      <div style={{ marginBottom:'2.5rem' }}>
        <h1 style={{ fontFamily:'var(--font-playfair,serif)', fontSize:28, fontWeight:400, color:'var(--color-text-primary)', marginBottom:'0.35rem', letterSpacing:'-0.02em' }}>SEO Settings</h1>
        <p style={{ fontSize:14, color:'var(--color-text-secondary)' }}>Saves directly to Supabase. Changes reflect in metadata on next deploy.</p>
      </div>

      {error && <div style={{ padding:'0.75rem 1rem', background:'rgba(255,80,80,0.08)', border:'0.5px solid rgba(255,80,80,0.3)', color:'#ff6060', fontSize:13, marginBottom:'1.5rem' }}>{error}</div>}

      <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:'3rem', alignItems:'start' }}>
        <div style={{ display:'flex', flexDirection:'column', gap:'2rem' }}>
          <div style={{ border:'0.5px solid var(--color-border)', padding:'1.75rem' }}>
            <h2 style={sh}>Basic SEO</h2>
            <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
              <div>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.4rem' }}>
                  <label style={lbl}>Site Title</label>
                  <span style={{ fontSize:10, color: titleLen>60 ? '#ff6060' : 'var(--color-text-tertiary)' }}>{titleLen}/60</span>
                </div>
                <input value={form.seo_title} onChange={f('seo_title')} style={inp}/>
              </div>
              <div>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.4rem' }}>
                  <label style={lbl}>Meta Description</label>
                  <span style={{ fontSize:10, color: descLen>160 ? '#ff6060' : 'var(--color-text-tertiary)' }}>{descLen}/160</span>
                </div>
                <textarea value={form.seo_description} onChange={f('seo_description')} rows={3} style={{...inp,resize:'vertical' as const}}/>
              </div>
              <div><label style={lbl}>Keywords</label><textarea value={form.seo_keywords} onChange={f('seo_keywords')} rows={2} style={{...inp,resize:'vertical' as const}}/></div>
            </div>
          </div>

          <div style={{ border:'0.5px solid var(--color-border)', padding:'1.75rem' }}>
            <h2 style={sh}>Social Sharing</h2>
            <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
              <div>
                <label style={lbl}>OG Image URL <span style={{ fontSize:10, color:'var(--color-text-tertiary)', textTransform:'none', letterSpacing:'0.04em', fontWeight:400 }}>— 1200×630px recommended</span></label>
                <input value={form.seo_og_image} onChange={f('seo_og_image')} style={inp}/>
                {form.seo_og_image && <img src={form.seo_og_image} alt="OG preview" style={{ marginTop:'0.75rem', width:'100%', aspectRatio:'1200/630', objectFit:'cover', display:'block', border:'0.5px solid var(--color-border)' }} onError={e=>(e.currentTarget.style.display='none')}/>}
              </div>
              <div><label style={lbl}>Twitter Handle</label><input value={form.seo_twitter_handle} onChange={f('seo_twitter_handle')} style={inp} placeholder="@niddhishp"/></div>
            </div>
          </div>

          <div style={{ border:'0.5px solid var(--color-border)', padding:'1.75rem' }}>
            <h2 style={sh}>Technical</h2>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
              <div>
                <label style={lbl}>Robots</label>
                <select value={form.seo_robots} onChange={f('seo_robots')} style={inp}>
                  <option value="index, follow">index, follow</option>
                  <option value="noindex, nofollow">noindex, nofollow</option>
                </select>
              </div>
              <div><label style={lbl}>Canonical URL</label><input value={form.seo_canonical} onChange={f('seo_canonical')} style={inp}/></div>
            </div>
          </div>

          <button onClick={save} disabled={saving} className="btn-primary" style={{ alignSelf:'flex-start', opacity:saving?0.6:1 }}>
            {saved ? '✓ Saved' : saving ? 'Saving…' : 'Save SEO Settings'}
          </button>
        </div>

        <div style={{ border:'0.5px solid var(--color-border)', padding:'1.5rem', position:'sticky', top:'1rem' }}>
          <p style={{ fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--color-text-tertiary)', marginBottom:'1rem' }}>Google Preview</p>
          <p style={{ fontSize:14, color:'#1a73e8', marginBottom:'0.25rem', lineHeight:1.3 }}>{form.seo_title}</p>
          <p style={{ fontSize:11, color:'#202124', marginBottom:'0.25rem' }}>{form.seo_canonical}</p>
          <p style={{ fontSize:12, color:'#4d5156', lineHeight:1.5 }}>{form.seo_description}</p>
        </div>
      </div>
    </div>
  )
}
const inp: React.CSSProperties = { width:'100%', background:'var(--color-surface-1)', border:'0.5px solid var(--color-border-mid)', padding:'0.625rem 0.875rem', fontSize:13, color:'var(--color-text-primary)', fontFamily:'inherit', outline:'none', boxSizing:'border-box' }
const lbl: React.CSSProperties = { display:'block', fontSize:10, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--color-text-tertiary)' }
const sh: React.CSSProperties = { fontSize:11, fontWeight:500, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--color-text-tertiary)', marginBottom:'1.25rem' }
