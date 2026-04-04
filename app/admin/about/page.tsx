'use client'
import { useState, useEffect } from 'react'
import ImageUpload from '@/components/ImageUpload'

export default function AdminAbout() {
  const [settings, setSettings] = useState({
    about_photo_url: '',
    about_name: 'Niddhish Puuzhakkal',
    about_title: 'Filmmaker · Psychologist · Author · Strategist',
    about_quote: 'Creativity is not a talent. It is a skill that can be engineered.',
    about_bio: 'With over 20 years across advertising, cinema, and behavioral science, Niddhish Puuzhakkal sits at the intersection of storytelling and strategy. He has directed 200+ TVCs for 80+ brands and written three books on the science of creativity.\n\nHis debut feature EGO is preparing for release. His second film Palkon Pe is in post-production, and his third — Kabirinte Canvas — is in production.',
    about_stat1_num: '200', about_stat1_suffix: '+', about_stat1_label: 'Commercials',
    about_stat2_num: '3',   about_stat2_suffix: '',  about_stat2_label: 'Feature Films',
    about_stat3_num: '80',  about_stat3_suffix: '+', about_stat3_label: 'Brands',
    about_stat4_num: '20',  about_stat4_suffix: '+', about_stat4_label: 'Years',
    social_linkedin: 'https://linkedin.com/in/niddhish',
    social_twitter: 'https://twitter.com/niddhishp',
    social_vimeo: 'https://vimeo.com/niddhish',
    social_instagram: 'https://instagram.com/niddhishp',
    social_youtube: 'https://youtube.com/@niddhishp',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/settings').then(r=>r.json()).then(d => {
      if (d.settings) setSettings(s => ({ ...s, ...d.settings }))
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const save = async () => {
    setSaving(true); setError('')
    try {
      const res = await fetch('/api/admin/settings', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(settings) })
      if (!res.ok) throw new Error((await res.json()).error || 'Failed')
      setSaved(true); setTimeout(()=>setSaved(false), 3000)
    } catch(e) { setError(e instanceof Error ? e.message : 'Save failed') }
    finally { setSaving(false) }
  }

  const upd = (k: keyof typeof settings) => (v: string) => setSettings(s=>({...s,[k]:v}))
  const updE = (k: keyof typeof settings) => (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => setSettings(s=>({...s,[k]:e.target.value}))

  if (loading) return <div style={{ padding:'3rem', color:'var(--color-text-tertiary)', fontSize:14 }}>Loading…</div>

  const STATS = [
    { num:'about_stat1_num', suf:'about_stat1_suffix', lbl:'about_stat1_label' },
    { num:'about_stat2_num', suf:'about_stat2_suffix', lbl:'about_stat2_label' },
    { num:'about_stat3_num', suf:'about_stat3_suffix', lbl:'about_stat3_label' },
    { num:'about_stat4_num', suf:'about_stat4_suffix', lbl:'about_stat4_label' },
  ] as const

  return (
    <div>
      <div style={{ marginBottom:'2.5rem' }}>
        <h1 style={{ fontFamily:'var(--font-playfair,serif)', fontSize:28, fontWeight:400, color:'var(--color-text-primary)', marginBottom:'0.35rem', letterSpacing:'-0.02em' }}>About Page</h1>
        <p style={{ fontSize:14, color:'var(--color-text-secondary)' }}>Director portrait, bio, and stats. Saves directly to Supabase.</p>
      </div>
      {error && <div style={{ padding:'0.75rem 1rem', background:'rgba(255,80,80,0.08)', border:'0.5px solid rgba(255,80,80,0.3)', color:'#ff6060', fontSize:13, marginBottom:'1.5rem' }}>{error}</div>}

      <div style={{ display:'grid', gridTemplateColumns:'1fr 280px', gap:'3rem', alignItems:'start' }}>
        <div style={{ display:'flex', flexDirection:'column', gap:'2rem' }}>
          <div style={{ border:'0.5px solid var(--color-border)', padding:'1.75rem' }}>
            <h2 style={sh}>Director Portrait</h2>
            <ImageUpload
              value={settings.about_photo_url}
              onChange={upd('about_photo_url')}
              label="Portrait Photo"
              hint="Square or portrait crop. Shown on the About page. Upload from your computer or paste a URL."
              aspect="3/4"
              bucket="about"
            />
          </div>

          <div style={{ border:'0.5px solid var(--color-border)', padding:'1.75rem' }}>
            <h2 style={sh}>Text</h2>
            <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
              <div><label style={lbl}>Name</label><input value={settings.about_name} onChange={updE('about_name')} style={inp}/></div>
              <div><label style={lbl}>Title / Role</label><input value={settings.about_title} onChange={updE('about_title')} style={inp}/></div>
              <div><label style={lbl}>One-line Quote (italic serif)</label><input value={settings.about_quote} onChange={updE('about_quote')} style={inp}/></div>
              <div><label style={lbl}>Biography</label><textarea value={settings.about_bio} onChange={updE('about_bio')} rows={8} style={{...inp,resize:'vertical' as const,lineHeight:1.7}}/></div>
            </div>
          </div>

          <div style={{ border:'0.5px solid var(--color-border)', padding:'1.75rem' }}>
            <h2 style={sh}>Stats</h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'1rem' }}>
              {STATS.map((s,i) => (
                <div key={i} style={{ border:'0.5px solid var(--color-border)', padding:'1rem' }}>
                  <label style={{ ...lbl, marginBottom:'0.75rem' }}>Stat {i+1}</label>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr auto 1fr', gap:'0.5rem' }}>
                    <div><label style={lbl}>Number</label><input value={settings[s.num]} onChange={updE(s.num)} style={inp} placeholder="200"/></div>
                    <div><label style={lbl}>Suffix</label><input value={settings[s.suf]} onChange={updE(s.suf)} style={{...inp,width:44}} placeholder="+"/></div>
                    <div><label style={lbl}>Label</label><input value={settings[s.lbl]} onChange={updE(s.lbl)} style={inp} placeholder="Brands"/></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ border:'0.5px solid var(--color-border)', padding:'1.75rem' }}>
            <h2 style={sh}>Social Links</h2>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
              {([['social_linkedin','LinkedIn'],['social_twitter','Twitter / X'],['social_vimeo','Vimeo'],['social_instagram','Instagram'],['social_youtube','YouTube']] as const).map(([k,label]) => (
                <div key={k}><label style={lbl}>{label}</label><input value={settings[k]} onChange={updE(k)} style={inp}/></div>
              ))}
            </div>
          </div>

          <button onClick={save} disabled={saving} className="btn-primary" style={{ alignSelf:'flex-start', opacity:saving?0.6:1 }}>
            {saved ? '✓ Saved — Live on site' : saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>

        <div style={{ border:'0.5px solid var(--color-border)', padding:'1.5rem', position:'sticky', top:'1rem' }}>
          <p style={{ fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--color-text-tertiary)', marginBottom:'1rem' }}>Preview</p>
          <div style={{ textAlign:'center' }}>
            {settings.about_photo_url ? (
              <div style={{ width:90, height:110, margin:'0 auto 1rem', overflow:'hidden', border:'0.5px solid var(--color-border)' }}>
                <img src={settings.about_photo_url} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'top' }}/>
              </div>
            ) : (
              <div style={{ width:90, height:110, background:'var(--color-surface-1)', margin:'0 auto 1rem', border:'0.5px dashed var(--color-border)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <span style={{ fontSize:9, color:'var(--color-text-tertiary)', textAlign:'center' }}>No photo</span>
              </div>
            )}
            <p style={{ fontFamily:'var(--font-playfair,serif)', fontSize:16, color:'var(--color-text-primary)', marginBottom:'0.2rem' }}>{settings.about_name}</p>
            <p style={{ fontSize:10, color:'var(--color-text-tertiary)', letterSpacing:'0.06em', marginBottom:'0.875rem' }}>{settings.about_title}</p>
            <p style={{ fontFamily:'var(--font-playfair,serif)', fontStyle:'italic', fontSize:11, color:'var(--color-text-secondary)', lineHeight:1.6 }}>&ldquo;{settings.about_quote}&rdquo;</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'0.5rem', marginTop:'1.25rem' }}>
            {STATS.map((s,i) => (
              <div key={i} style={{ textAlign:'center', padding:'0.5rem', border:'0.5px solid var(--color-border)' }}>
                <p style={{ fontSize:18, color:'var(--color-text-primary)', fontFamily:'var(--font-playfair,serif)', lineHeight:1 }}>{settings[s.num]}{settings[s.suf]}</p>
                <p style={{ fontSize:9, color:'var(--color-text-tertiary)', textTransform:'uppercase', letterSpacing:'0.08em' }}>{settings[s.lbl]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
const inp: React.CSSProperties = { width:'100%', background:'var(--color-surface-1)', border:'0.5px solid var(--color-border-mid)', padding:'0.625rem 0.875rem', fontSize:13, color:'var(--color-text-primary)', fontFamily:'inherit', outline:'none', boxSizing:'border-box' }
const lbl: React.CSSProperties = { display:'block', fontSize:10, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--color-text-tertiary)', marginBottom:'0.3rem' }
const sh: React.CSSProperties = { fontSize:11, fontWeight:500, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--color-text-tertiary)', marginBottom:'1.25rem' }
