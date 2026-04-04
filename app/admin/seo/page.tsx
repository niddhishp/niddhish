'use client'
import { useState } from 'react'

export default function AdminSEO() {
  const [form, setForm] = useState({
    siteTitle: 'Niddhish Puuzhakkal — Creativity. Applied.',
    metaDesc: 'Filmmaker. Psychologist. Author. Strategist. Technologist. 200+ commercials, 3 films, 3 books, 80+ brands. Creative intelligence applied to every problem.',
    keywords: 'Niddhish Puuzhakkal, film director India, TVC director Mumbai, brand strategy, creative director, filmmaker psychologist, Light Seeker Films',
    ogImage: 'https://niddhish.com/og-image.jpg',
    twitterHandle: '@niddhishp',
    robots: 'index, follow',
    canonical: 'https://niddhish.com',
    sitemap: '/sitemap.xml',
  })
  const [saved, setSaved] = useState(false)
  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
    setSaved(false); setForm(p => ({...p,[k]:e.target.value}))
  }
  const titleLen = form.siteTitle.length
  const descLen = form.metaDesc.length

  return (
    <div>
      <div style={{ marginBottom:'2.5rem' }}>
        <h1 style={{ fontFamily:'var(--font-playfair,serif)', fontSize:28, fontWeight:400, color:'var(--color-text-primary)', marginBottom:'0.35rem', letterSpacing:'-0.02em' }}>SEO Settings</h1>
        <p style={{ fontSize:14, color:'var(--color-text-secondary)' }}>Optimize your site for search engines and social sharing.</p>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:'3rem', alignItems:'start' }}>
        <div style={{ display:'flex', flexDirection:'column', gap:'2rem' }}>
          {/* Basic SEO */}
          <div style={{ border:'0.5px solid var(--color-border)', padding:'1.75rem' }}>
            <h2 style={sh}>Basic SEO</h2>
            <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
              <div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.4rem' }}>
                  <label style={lbl}>Site Title</label>
                  <span style={{ fontSize:10, color: titleLen>60 ? '#ff6060' : 'var(--color-text-tertiary)' }}>{titleLen}/60</span>
                </div>
                <input value={form.siteTitle} onChange={f('siteTitle')} style={inp}/>
              </div>
              <div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.4rem' }}>
                  <label style={lbl}>Meta Description</label>
                  <span style={{ fontSize:10, color: descLen>160 ? '#ff6060' : 'var(--color-text-tertiary)' }}>{descLen}/160</span>
                </div>
                <textarea value={form.metaDesc} onChange={f('metaDesc')} rows={3} style={{...inp,resize:'vertical' as const}}/>
              </div>
              <div>
                <label style={lbl}>Keywords (comma separated)</label>
                <textarea value={form.keywords} onChange={f('keywords')} rows={2} style={{...inp,resize:'vertical' as const}}/>
              </div>
            </div>
          </div>

          {/* Social */}
          <div style={{ border:'0.5px solid var(--color-border)', padding:'1.75rem' }}>
            <h2 style={sh}>Social Sharing · Open Graph & Twitter Cards</h2>
            <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
              <div>
                <label style={lbl}>OG Image URL <span style={{ color:'var(--color-text-tertiary)', fontWeight:400, textTransform:'none', letterSpacing:'0.04em' }}>— Recommended: 1200×630px</span></label>
                <input value={form.ogImage} onChange={f('ogImage')} style={inp} placeholder="https://niddhish.com/og-image.jpg"/>
                {form.ogImage && (
                  <div style={{ marginTop:'0.75rem', border:'0.5px solid var(--color-border)', overflow:'hidden' }}>
                    <img src={form.ogImage} alt="OG preview" style={{ width:'100%', aspectRatio:'1200/630', objectFit:'cover', display:'block' }} onError={(e)=>(e.currentTarget.style.display='none')}/>
                  </div>
                )}
              </div>
              <div>
                <label style={lbl}>Twitter Handle</label>
                <input value={form.twitterHandle} onChange={f('twitterHandle')} style={inp} placeholder="@niddhishp"/>
              </div>
            </div>
          </div>

          {/* Technical */}
          <div style={{ border:'0.5px solid var(--color-border)', padding:'1.75rem' }}>
            <h2 style={sh}>Technical SEO</h2>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
              <div>
                <label style={lbl}>Robots.txt Directive</label>
                <select value={form.robots} onChange={f('robots')} style={inp}>
                  <option value="index, follow">index, follow (default)</option>
                  <option value="noindex, nofollow">noindex, nofollow</option>
                  <option value="index, nofollow">index, nofollow</option>
                </select>
              </div>
              <div>
                <label style={lbl}>Canonical URL</label>
                <input value={form.canonical} onChange={f('canonical')} style={inp}/>
              </div>
              <div>
                <label style={lbl}>Sitemap URL</label>
                <input value={form.sitemap} onChange={f('sitemap')} style={inp}/>
              </div>
              <div style={{ display:'flex', flexDirection:'column', justifyContent:'flex-end' }}>
                <div style={{ padding:'0.75rem', background:'rgba(80,200,120,0.08)', border:'0.5px solid rgba(80,200,120,0.3)', borderRadius:2 }}>
                  <p style={{ fontSize:12, color:'rgba(80,200,120,0.9)' }}>● Index Status: Indexable</p>
                </div>
              </div>
            </div>
          </div>
          <button onClick={()=>setSaved(true)} className="btn-primary" style={{ alignSelf:'flex-start' }}>{saved ? 'Saved ✓' : 'Save SEO Settings'}</button>
        </div>

        {/* Google Preview */}
        <div style={{ position:'sticky', top:'1rem' }}>
          <div style={{ border:'0.5px solid var(--color-border)', padding:'1.5rem', marginBottom:'1rem' }}>
            <p style={{ fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--color-text-tertiary)', marginBottom:'1rem' }}>Google Preview</p>
            <p style={{ fontSize:14, color:'#1a73e8', marginBottom:'0.25rem', lineHeight:1.3 }}>{form.siteTitle}</p>
            <p style={{ fontSize:11, color:'#202124', marginBottom:'0.25rem' }}>{form.canonical}</p>
            <p style={{ fontSize:12, color:'#4d5156', lineHeight:1.5 }}>{form.metaDesc}</p>
          </div>
          <div style={{ border:'0.5px solid var(--color-border)', padding:'1.5rem' }}>
            <p style={{ fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--color-text-tertiary)', marginBottom:'1rem' }}>Social Card Preview</p>
            {form.ogImage && <img src={form.ogImage} alt="" style={{ width:'100%', aspectRatio:'1200/630', objectFit:'cover', marginBottom:'0.75rem', display:'block' }} onError={(e)=>(e.currentTarget.style.display='none')}/>}
            <p style={{ fontSize:13, color:'var(--color-text-primary)', fontWeight:500, lineHeight:1.3, marginBottom:'0.2rem' }}>{form.siteTitle}</p>
            <p style={{ fontSize:11, color:'var(--color-text-tertiary)', lineHeight:1.4 }}>{form.metaDesc.substring(0,100)}...</p>
          </div>
        </div>
      </div>
    </div>
  )
}
const inp: React.CSSProperties = { width:'100%', background:'var(--color-surface-1)', border:'0.5px solid var(--color-border-mid)', padding:'0.625rem 0.875rem', fontSize:13, color:'var(--color-text-primary)', fontFamily:'inherit', outline:'none', boxSizing:'border-box' }
const lbl: React.CSSProperties = { display:'block', fontSize:10, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--color-text-tertiary)' }
const sh: React.CSSProperties = { fontSize:11, fontWeight:500, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--color-text-tertiary)', marginBottom:'1.25rem' }
