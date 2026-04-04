'use client'
import { useState } from 'react'

export default function AdminAbout() {
  const [form, setForm] = useState({
    name: 'Niddhish Puuzhakkal',
    title: 'Filmmaker · Psychologist · Author · Strategist',
    quote: 'Creativity is not a talent. It is a skill that can be engineered.',
    bio: 'With over 20 years across advertising, cinema, and behavioral science, Niddhish Puuzhakkal sits at the intersection of storytelling and strategy. He has directed 200+ TVCs for 80+ brands — from Nike and Harley Davidson to Tata and L\'Oréal — and written three books on the science of creativity.\n\nHis debut feature EGO (starring Arshad Warsi, Juhi Chawla, Divya Dutta and Gauhar Khan) is preparing for release. His second film Palkon Pe is in post-production, and his third — the Malayalam film Kabirinte Canvas — is in production.\n\nHe holds an MSc in Psychology and is a Six Sigma Black Belt and PMP, bringing a systems-thinking rigor to every creative challenge.',
    linkedin: 'https://linkedin.com/in/niddhish',
    twitter: 'https://twitter.com/niddhishp',
    vimeo: 'https://vimeo.com/niddhish',
    instagram: 'https://instagram.com/niddhishp',
    stats: [
      { number:'200', suffix:'+', label:'Commercials' },
      { number:'3', suffix:'', label:'Feature Films' },
      { number:'80', suffix:'+', label:'Brands' },
      { number:'20', suffix:'+', label:'Years' },
    ]
  })

  return (
    <div>
      <div style={{ marginBottom:'2.5rem' }}>
        <h1 style={{ fontFamily:'var(--font-playfair,serif)', fontSize:28, fontWeight:400, color:'var(--color-text-primary)', marginBottom:'0.35rem', letterSpacing:'-0.02em' }}>About Page</h1>
        <p style={{ fontSize:14, color:'var(--color-text-secondary)' }}>Controls the director portrait, bio, and stats.</p>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 280px', gap:'3rem', alignItems:'start' }}>
        <div style={{ display:'flex', flexDirection:'column', gap:'2rem' }}>
          {/* Portrait */}
          <div style={{ border:'0.5px solid var(--color-border)', padding:'1.75rem' }}>
            <h2 style={sectionHead}>Portrait Photo</h2>
            <div style={{ display:'flex', gap:'1.5rem', alignItems:'flex-start' }}>
              <div style={{ width:100, height:120, background:'var(--color-surface-1)', border:'0.5px dashed var(--color-border)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <span style={{ fontSize:11, color:'var(--color-text-tertiary)', textAlign:'center', padding:'0.5rem' }}>Director<br/>portrait</span>
              </div>
              <div style={{ flex:1 }}>
                <label style={lbl}>Image URL</label>
                <input placeholder="https://... or upload to /public/niddhish-photo.jpg" style={inp} />
                <p style={{ fontSize:11, color:'var(--color-text-tertiary)', marginTop:'0.5rem' }}>Or upload niddhish-photo.jpg to the /public folder in GitHub.</p>
              </div>
            </div>
          </div>

          {/* Text */}
          <div style={{ border:'0.5px solid var(--color-border)', padding:'1.75rem' }}>
            <h2 style={sectionHead}>Text</h2>
            <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
              <div><label style={lbl}>Name</label><input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} style={inp}/></div>
              <div><label style={lbl}>Title / Role</label><input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} style={inp}/></div>
              <div><label style={lbl}>One-line Quote (italic serif)</label><input value={form.quote} onChange={e=>setForm(f=>({...f,quote:e.target.value}))} style={inp}/></div>
              <div><label style={lbl}>Biography</label><textarea value={form.bio} onChange={e=>setForm(f=>({...f,bio:e.target.value}))} rows={8} style={{...inp, resize:'vertical' as const, lineHeight:1.7}}/></div>
            </div>
          </div>

          {/* Stats */}
          <div style={{ border:'0.5px solid var(--color-border)', padding:'1.75rem' }}>
            <h2 style={sectionHead}>Stats</h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1rem' }}>
              {form.stats.map((s,i) => (
                <div key={i}>
                  <label style={lbl}>Stat {i+1}</label>
                  <div style={{ display:'flex', gap:'0.25rem', marginBottom:'0.25rem' }}>
                    <input value={s.number} onChange={e=>{const st=[...form.stats]; st[i]={...st[i],number:e.target.value}; setForm(f=>({...f,stats:st}))}} style={{...inp, width:60}} placeholder="200"/>
                    <input value={s.suffix} onChange={e=>{const st=[...form.stats]; st[i]={...st[i],suffix:e.target.value}; setForm(f=>({...f,stats:st}))}} style={{...inp, width:40}} placeholder="+"/>
                  </div>
                  <input value={s.label} onChange={e=>{const st=[...form.stats]; st[i]={...st[i],label:e.target.value}; setForm(f=>({...f,stats:st}))}} style={inp} placeholder="Commercials"/>
                </div>
              ))}
            </div>
          </div>

          {/* Social */}
          <div style={{ border:'0.5px solid var(--color-border)', padding:'1.75rem' }}>
            <h2 style={sectionHead}>Social Links</h2>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
              {(['linkedin','twitter','vimeo','instagram'] as const).map(k => (
                <div key={k}>
                  <label style={lbl}>{k.charAt(0).toUpperCase()+k.slice(1)}</label>
                  <input value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} style={inp}/>
                </div>
              ))}
            </div>
          </div>

          <button className="btn-primary" style={{ alignSelf:'flex-start' }}>Save Changes</button>
        </div>

        {/* Preview sidebar */}
        <div style={{ border:'0.5px solid var(--color-border)', padding:'1.5rem', position:'sticky', top:'1rem' }}>
          <p style={{ fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--color-text-tertiary)', marginBottom:'1rem' }}>Preview</p>
          <div style={{ textAlign:'center' }}>
            <div style={{ width:80, height:96, background:'var(--color-surface-1)', margin:'0 auto 1rem', border:'0.5px solid var(--color-border)' }}/>
            <p style={{ fontFamily:'var(--font-playfair,serif)', fontSize:18, color:'var(--color-text-primary)', marginBottom:'0.25rem' }}>{form.name}</p>
            <p style={{ fontSize:11, color:'var(--color-text-tertiary)', letterSpacing:'0.06em', marginBottom:'1rem' }}>{form.title}</p>
            <p style={{ fontFamily:'var(--font-playfair,serif)', fontStyle:'italic', fontSize:13, color:'var(--color-text-secondary)', lineHeight:1.6 }}>&ldquo;{form.quote}&rdquo;</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'0.5rem', marginTop:'1.5rem' }}>
            {form.stats.map((s,i) => (
              <div key={i} style={{ textAlign:'center' }}>
                <p style={{ fontSize:18, color:'var(--color-text-primary)', fontFamily:'var(--font-playfair,serif)' }}>{s.number}{s.suffix}</p>
                <p style={{ fontSize:9, color:'var(--color-text-tertiary)', textTransform:'uppercase', letterSpacing:'0.08em' }}>{s.label}</p>
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
const sectionHead: React.CSSProperties = { fontSize:11, fontWeight:500, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--color-text-tertiary)', marginBottom:'1.25rem' }
