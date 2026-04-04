'use client'
import { useState, useEffect } from 'react'
import ImageUpload from '@/components/ImageUpload'

export default function AdminSettings() {
  const [form, setForm] = useState({
    site_title: 'Niddhish Puuzhakkal',
    site_desc: 'Filmmaker. Psychologist. Author. Strategist.',
    contact_email: 'niddhish@lightseekermedia.com',
    contact_phone: '+91 99204 62666',
    contact_address: 'Mumbai, India',
    social_linkedin: 'https://linkedin.com/in/niddhish',
    social_twitter: 'https://twitter.com/niddhishp',
    social_instagram: 'https://instagram.com/niddhishp',
    social_vimeo: 'https://vimeo.com/niddhish',
    social_youtube: 'https://youtube.com/@niddhishp',
    site_logo_url: '',
    site_favicon_url: '',
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
      if (!res.ok) throw new Error((await res.json()).error || 'Failed')
      setSaved(true); setTimeout(()=>setSaved(false), 3000)
    } catch(e) { setError(e instanceof Error ? e.message : 'Save failed') }
    finally { setSaving(false) }
  }

  const upd = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) =>
    setForm(f => ({...f,[k]:e.target.value}))

  if (loading) return <div style={{ padding:'3rem', color:'var(--color-text-tertiary)', fontSize:14 }}>Loading…</div>

  return (
    <div>
      <div style={{ marginBottom:'2.5rem' }}>
        <h1 style={{ fontFamily:'var(--font-playfair,serif)', fontSize:28, fontWeight:400, color:'var(--color-text-primary)', marginBottom:'0.35rem', letterSpacing:'-0.02em' }}>Settings</h1>
        <p style={{ fontSize:14, color:'var(--color-text-secondary)' }}>Global site configuration. Saves directly to Supabase.</p>
      </div>

      {error && <div style={{ padding:'0.75rem 1rem', background:'rgba(255,80,80,0.08)', border:'0.5px solid rgba(255,80,80,0.3)', color:'#ff6060', fontSize:13, marginBottom:'1.5rem' }}>{error}</div>}

      <div style={{ display:'flex', flexDirection:'column', gap:'2rem', maxWidth:780 }}>

        {/* Logo */}
        <div style={{ border:'0.5px solid var(--color-border)', padding:'1.75rem' }}>
          <h2 style={sh}>Site Logo</h2>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'2rem' }}>
            <div>
              <ImageUpload
                value={form.site_logo_url}
                onChange={v=>setForm(f=>({...f,site_logo_url:v}))}
                label="Logo Image"
                hint="Shown in nav and footer. SVG or PNG with transparency. If blank, the Aperture Neural mark is used."
                aspect="3/1"
                bucket="branding"
              />
            </div>
            <div>
              <ImageUpload
                value={form.site_favicon_url}
                onChange={v=>setForm(f=>({...f,site_favicon_url:v}))}
                label="Favicon"
                hint="32×32px or 64×64px PNG/ICO shown in browser tabs."
                aspect="1/1"
                bucket="branding"
              />
            </div>
          </div>
          <div style={{ marginTop:'1.25rem' }}>
            <label style={lbl}>Site Title (shown in nav)</label>
            <input value={form.site_title} onChange={upd('site_title')} style={inp}/>
          </div>
        </div>

        {/* Identity */}
        <div style={{ border:'0.5px solid var(--color-border)', padding:'1.75rem' }}>
          <h2 style={sh}>Site Description</h2>
          <textarea value={form.site_desc} onChange={upd('site_desc')} rows={2} style={{...inp,resize:'vertical' as const}}/>
        </div>

        {/* Contact */}
        <div style={{ border:'0.5px solid var(--color-border)', padding:'1.75rem' }}>
          <h2 style={sh}>Contact Information</h2>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
            <div><label style={lbl}>Email</label><input value={form.contact_email} onChange={upd('contact_email')} style={inp}/></div>
            <div><label style={lbl}>Phone</label><input value={form.contact_phone} onChange={upd('contact_phone')} style={inp}/></div>
            <div style={{ gridColumn:'1/-1' }}><label style={lbl}>Address</label><input value={form.contact_address} onChange={upd('contact_address')} style={inp}/></div>
          </div>
        </div>

        {/* Social */}
        <div style={{ border:'0.5px solid var(--color-border)', padding:'1.75rem' }}>
          <h2 style={sh}>Social Links</h2>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
            {[
              ['social_linkedin','LinkedIn'],
              ['social_twitter','Twitter / X'],
              ['social_instagram','Instagram'],
              ['social_vimeo','Vimeo'],
              ['social_youtube','YouTube'],
            ].map(([k,label]) => (
              <div key={k}>
                <label style={lbl}>{label}</label>
                <input value={form[k as keyof typeof form]} onChange={upd(k as keyof typeof form)} style={inp}/>
              </div>
            ))}
          </div>
        </div>

        <button onClick={save} disabled={saving} className="btn-primary" style={{ alignSelf:'flex-start', opacity:saving?0.6:1 }}>
          {saved ? '✓ Saved — Live on site' : saving ? 'Saving…' : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}
const inp: React.CSSProperties = { width:'100%', background:'var(--color-surface-1)', border:'0.5px solid var(--color-border-mid)', padding:'0.625rem 0.875rem', fontSize:13, color:'var(--color-text-primary)', fontFamily:'inherit', outline:'none', boxSizing:'border-box' }
const lbl: React.CSSProperties = { display:'block', fontSize:10, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--color-text-tertiary)', marginBottom:'0.35rem' }
const sh: React.CSSProperties = { fontSize:11, fontWeight:500, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--color-text-tertiary)', marginBottom:'1.25rem' }
