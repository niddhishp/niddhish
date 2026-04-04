'use client'
import { useState } from 'react'

export default function AdminHeroPage() {
  const [url, setUrl] = useState('')
  const [tagline, setTagline] = useState('Creativity. Applied.')
  const [subtitle, setSubtitle] = useState('Behavioral filmmaking. Creative strategy. Technology built to think.')
  const [saved, setSaved] = useState(false)

  const thumbFromUrl = (u: string) => {
    const vimeoM = u.match(/vimeo\.com\/(\d+)/)
    const ytM = u.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)
    if (vimeoM) return `https://vimeocdn.com/video/${vimeoM[1]}_640.jpg`
    if (ytM) return `https://i.ytimg.com/vi/${ytM[1]}/maxresdefault.jpg`
    return null
  }
  const thumb = thumbFromUrl(url)

  return (
    <div>
      <div style={{ marginBottom:'2.5rem' }}>
        <h1 style={{ fontFamily:'var(--font-playfair,serif)', fontSize:28, fontWeight:400, color:'var(--color-text-primary)', marginBottom:'0.35rem', letterSpacing:'-0.02em' }}>Hero Video</h1>
        <p style={{ fontSize:14, color:'var(--color-text-secondary)' }}>Controls the full-screen background video and text on the homepage.</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:'3rem', alignItems:'start' }}>
        <div style={{ display:'flex', flexDirection:'column', gap:'2rem' }}>
          {/* Video URL */}
          <div style={{ border:'0.5px solid var(--color-border)', padding:'1.75rem' }}>
            <h2 style={{ fontSize:12, fontWeight:500, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--color-text-tertiary)', marginBottom:'1.5rem' }}>Background Video</h2>
            <label style={labelStyle}>YouTube or Vimeo URL</label>
            <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://vimeo.com/123456789" style={inputStyle} />
            <p style={{ fontSize:11, color:'var(--color-text-tertiary)', marginTop:'0.5rem' }}>Paste any YouTube or Vimeo link — the video plays muted and looped as background.</p>
            {thumb && (
              <div style={{ marginTop:'1rem', position:'relative', aspectRatio:'16/9', background:'#111', overflow:'hidden' }}>
                <img src={thumb} alt="preview" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <span style={{ fontSize:11, color:'rgba(255,255,255,0.7)', letterSpacing:'0.08em' }}>AUTO-FETCHED THUMBNAIL</span>
                </div>
              </div>
            )}
          </div>

          {/* Hero text */}
          <div style={{ border:'0.5px solid var(--color-border)', padding:'1.75rem' }}>
            <h2 style={{ fontSize:12, fontWeight:500, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--color-text-tertiary)', marginBottom:'1.5rem' }}>Text</h2>
            <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
              <div>
                <label style={labelStyle}>Tagline <span style={{ color:'var(--color-accent)' }}>*</span></label>
                <input value={tagline} onChange={e=>setTagline(e.target.value)} placeholder="Creativity. Applied." style={inputStyle} />
                <p style={{ fontSize:11, color:'var(--color-text-tertiary)', marginTop:'0.35rem' }}>The large italic serif headline. Second word shows in accent color.</p>
              </div>
              <div>
                <label style={labelStyle}>Subtitle</label>
                <textarea value={subtitle} onChange={e=>setSubtitle(e.target.value)} rows={3} style={{...inputStyle, resize:'vertical' as const}} placeholder="Behavioral filmmaking. Creative strategy..." />
              </div>
            </div>
          </div>

          <button onClick={()=>setSaved(true)} className="btn-primary" style={{ alignSelf:'flex-start' }}>
            {saved ? 'Saved ✓' : 'Save Changes'}
          </button>
        </div>

        {/* Preview */}
        <div style={{ border:'0.5px solid var(--color-border)', padding:'1.5rem', position:'sticky', top:'1rem' }}>
          <p style={{ fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--color-text-tertiary)', marginBottom:'1rem' }}>Preview</p>
          <div style={{ background:'#0a0a0a', aspectRatio:'16/9', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'1.5rem', textAlign:'center', position:'relative', overflow:'hidden' }}>
            {thumb && <img src={thumb} alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', opacity:0.4 }} />}
            <div style={{ position:'relative', zIndex:1 }}>
              <p style={{ fontSize:9, letterSpacing:'0.2em', color:'rgba(232,104,58,0.6)', marginBottom:'0.5rem' }}>FADE IN.</p>
              <p style={{ fontFamily:'var(--font-playfair,serif)', fontSize:18, color:'#fff', lineHeight:1, marginBottom:'0.5rem' }}>
                {tagline.split(' ').map((w,i) => i===1 ? <em key={i} style={{ color:'#e8683a' }}>{w}</em> : <span key={i}>{w} </span>)}
              </p>
              <p style={{ fontSize:9, color:'rgba(240,237,232,0.5)', lineHeight:1.5, maxWidth:200 }}>{subtitle}</p>
            </div>
          </div>
          <p style={{ fontSize:11, color:'var(--color-text-tertiary)', marginTop:'0.75rem', lineHeight:1.5 }}>
            Changes take effect after adding env vars and redeploying. The video plays on desktop; mobile shows a fallback image.
          </p>
        </div>
      </div>
    </div>
  )
}
const inputStyle: React.CSSProperties = { width:'100%', background:'var(--color-surface-1)', border:'0.5px solid var(--color-border-mid)', padding:'0.625rem 0.875rem', fontSize:14, color:'var(--color-text-primary)', fontFamily:'inherit', outline:'none', boxSizing:'border-box' }
const labelStyle: React.CSSProperties = { display:'block', fontSize:11, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--color-text-tertiary)', marginBottom:'0.4rem' }
