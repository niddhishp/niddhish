'use client'
import { useState, useEffect } from 'react'
import ImageUpload from '@/components/ImageUpload'

export default function AdminHeroPage() {
  const [settings, setSettings] = useState({
    hero_video_url: '',
    hero_tagline: 'Creativity.',
    hero_tagline_accent: 'Applied.',
    hero_subtitle: 'Behavioral filmmaking. Creative strategy. Technology built to think.',
    hero_sub_italic: 'Where psychology meets cinema.',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r=>r.json())
      .then(d => {
        if (d.settings) setSettings(s => ({ ...s, ...d.settings }))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const save = async () => {
    setSaving(true); setError('')
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Failed')
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch(e) { setError(e instanceof Error ? e.message : 'Save failed') }
    finally { setSaving(false) }
  }

  const thumbFromUrl = (u: string) => {
    const vimeo = u.match(/vimeo\.com\/(\d+)/)
    const yt = u.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)
    if (yt) return `https://i.ytimg.com/vi/${yt[1]}/maxresdefault.jpg`
    return null
  }
  const thumb = thumbFromUrl(settings.hero_video_url)

  if (loading) return <div style={{ padding:'3rem', color:'var(--color-text-tertiary)', fontSize:14 }}>Loading…</div>

  return (
    <div>
      <div style={{ marginBottom:'2.5rem' }}>
        <h1 style={{ fontFamily:'var(--font-playfair,serif)', fontSize:28, fontWeight:400, color:'var(--color-text-primary)', marginBottom:'0.35rem', letterSpacing:'-0.02em' }}>Hero Section</h1>
        <p style={{ fontSize:14, color:'var(--color-text-secondary)' }}>Controls the full-screen background and text on the homepage.</p>
      </div>

      {error && <div style={{ padding:'0.75rem 1rem', background:'rgba(255,80,80,0.08)', border:'0.5px solid rgba(255,80,80,0.3)', color:'#ff6060', fontSize:13, marginBottom:'1.5rem' }}>{error}</div>}

      <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:'3rem', alignItems:'start' }}>
        <div style={{ display:'flex', flexDirection:'column', gap:'2rem' }}>
          <div style={{ border:'0.5px solid var(--color-border)', padding:'1.75rem' }}>
            <h2 style={sh}>Background Video</h2>
            <div style={{ marginBottom:'1rem' }}>
              <label style={lbl}>YouTube or Vimeo URL</label>
              <input
                value={settings.hero_video_url}
                onChange={e=>setSettings(s=>({...s,hero_video_url:e.target.value}))}
                placeholder="https://vimeo.com/123456789 or https://youtube.com/watch?v=..."
                style={inp}
              />
              <p style={{ fontSize:11, color:'var(--color-text-tertiary)', marginTop:'0.4rem' }}>Paste a Vimeo or YouTube link. The video plays muted and looped as the hero background.</p>
            </div>
            {thumb && (
              <div style={{ position:'relative', aspectRatio:'16/9', overflow:'hidden', background:'#111', marginTop:'1rem' }}>
                <img src={thumb} alt="Video thumbnail" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <span style={{ fontSize:11, letterSpacing:'0.1em', color:'rgba(255,255,255,0.7)' }}>AUTO-FETCHED THUMBNAIL ✓</span>
                </div>
              </div>
            )}
          </div>

          <div style={{ border:'0.5px solid var(--color-border)', padding:'1.75rem' }}>
            <h2 style={sh}>Hero Text</h2>
            <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
              <div>
                <label style={lbl}>Main Title</label>
                <input value={settings.hero_tagline} onChange={e=>setSettings(s=>({...s,hero_tagline:e.target.value}))} style={inp} placeholder="Creativity."/>
              </div>
              <div>
                <label style={lbl}>Accent Title (italic, coral color)</label>
                <input value={settings.hero_tagline_accent} onChange={e=>setSettings(s=>({...s,hero_tagline_accent:e.target.value}))} style={inp} placeholder="Applied."/>
              </div>
              <div>
                <label style={lbl}>Subtitle</label>
                <textarea value={settings.hero_subtitle} onChange={e=>setSettings(s=>({...s,hero_subtitle:e.target.value}))} rows={2} style={{...inp,resize:'vertical' as const}}/>
              </div>
              <div>
                <label style={lbl}>Small Italic Line</label>
                <input value={settings.hero_sub_italic} onChange={e=>setSettings(s=>({...s,hero_sub_italic:e.target.value}))} style={inp} placeholder="Where psychology meets cinema."/>
              </div>
            </div>
          </div>

          <button onClick={save} disabled={saving} className="btn-primary" style={{ alignSelf:'flex-start', opacity:saving?0.6:1 }}>
            {saved ? '✓ Saved — Changes live on site' : saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>

        <div style={{ border:'0.5px solid var(--color-border)', padding:'1.5rem', position:'sticky', top:'1rem' }}>
          <p style={{ fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--color-text-tertiary)', marginBottom:'1rem' }}>Preview</p>
          <div style={{ background:'#0a0a0a', aspectRatio:'16/9', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'1.25rem', textAlign:'center', position:'relative', overflow:'hidden' }}>
            {thumb && <img src={thumb} alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', opacity:0.35 }}/>}
            <div style={{ position:'relative', zIndex:1 }}>
              <p style={{ fontSize:8, letterSpacing:'0.2em', color:'rgba(232,104,58,0.6)', marginBottom:'0.5rem' }}>FADE IN.</p>
              <p style={{ fontFamily:'var(--font-playfair,serif)', fontSize:16, color:'#fff', lineHeight:1, marginBottom:'0.25rem' }}>
                {settings.hero_tagline}{' '}
                <em style={{ color:'#e8683a' }}>{settings.hero_tagline_accent}</em>
              </p>
              <p style={{ fontSize:9, color:'rgba(240,237,232,0.5)', lineHeight:1.5, maxWidth:180 }}>{settings.hero_subtitle}</p>
            </div>
          </div>
          <p style={{ fontSize:11, color:'var(--color-text-tertiary)', marginTop:'0.75rem', lineHeight:1.5 }}>
            Saves directly to Supabase. Changes appear on the live site within 60 seconds.
          </p>
        </div>
      </div>
    </div>
  )
}
const inp: React.CSSProperties = { width:'100%', background:'var(--color-surface-1)', border:'0.5px solid var(--color-border-mid)', padding:'0.625rem 0.875rem', fontSize:14, color:'var(--color-text-primary)', fontFamily:'inherit', outline:'none', boxSizing:'border-box' }
const lbl: React.CSSProperties = { display:'block', fontSize:11, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--color-text-tertiary)', marginBottom:'0.4rem' }
const sh: React.CSSProperties = { fontSize:11, fontWeight:500, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--color-text-tertiary)', marginBottom:'1.25rem' }
