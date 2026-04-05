'use client'
import { useState, useEffect } from 'react'

const SECTION_FIELDS = [
  { section: 'Hero',              keys: [
    { k:'hero_tagline',        label:'Main Title',          placeholder:'Creativity.' },
    { k:'hero_tagline_accent', label:'Accent Word (coral)', placeholder:'Applied.' },
    { k:'hero_subtitle',       label:'Subtitle',            placeholder:'Behavioral filmmaking…' },
    { k:'hero_sub_italic',     label:'Small italic line',   placeholder:'Where psychology meets cinema.' },
  ]},
  { section: 'Work Reel',         keys: [
    { k:'section_reel_label',   label:'Scene label',  placeholder:'SCENE 02 — THE REEL' },
    { k:'section_reel_heading', label:'Heading',      placeholder:'200+ commercials.' },
    { k:'section_reel_accent',  label:'Accent (coral italic)', placeholder:'A selection.' },
  ]},
  { section: 'Feature Films',     keys: [
    { k:'section_films_label',   label:'Scene label',  placeholder:'SCENE 03 — THE FEATURES' },
    { k:'section_films_heading', label:'Heading',      placeholder:'Three films.' },
    { k:'section_films_accent',  label:'Accent',       placeholder:'Story. Engineered.' },
  ]},
  { section: 'Method (SCENE 04)', keys: [
    { k:'method_label',    label:'Scene label',   placeholder:'SCENE 04 — THE METHOD' },
    { k:'method_tagline',  label:'Main tagline',  placeholder:'One discipline. Six surfaces.' },
    { k:'method_subtitle', label:'Subtitle',      placeholder:'Creativity applied across every problem domain.' },
  ]},
  { section: 'Method Surfaces',   keys: [
    { k:'method_surfaces', label:'Six Surfaces (JSON array)', placeholder:'[{"n":"01","label":"Film & Direction","slogan":"Story. Engineered.","proof":"200+ TVCs"}]', textarea: true },
  ]},
  { section: 'Books Section',     keys: [
    { k:'books_label',   label:'Section label',  placeholder:'Published Work' },
    { k:'books_heading', label:'Heading',        placeholder:'Three books on creativity.' },
    { k:'books_accent',  label:'Accent (coral)', placeholder:'The methodology, written down.' },
  ]},
  { section: 'Testimonials',      keys: [
    { k:'critics_label',   label:'Scene label',  placeholder:'SCENE 05 — THE CRITICS' },
    { k:'critics_heading', label:'Heading',      placeholder:'What they say.' },
    { k:'critics_accent',  label:'Accent',       placeholder:'On record.' },
  ]},
  { section: 'Contact (SCENE 06)',keys: [
    { k:'contact_label',         label:'Scene label',      placeholder:'SCENE 06 — THE BRIEF' },
    { k:'contact_heading',       label:'Main heading',     placeholder:'Start a Project' },
    { k:'contact_sub',           label:'Sub-heading',      placeholder:'What problem needs…' },
    { k:'contact_body',          label:'Body text',        placeholder:'Every great collaboration…' },
    { k:'contact_project_types', label:'Project Types (comma-separated)', placeholder:'TVC / Commercial,Brand Film…' },
  ]},
  { section: 'Privacy Policy',    keys: [
    { k:'privacy_content', label:'Privacy Policy (Markdown)', placeholder:'# Privacy Policy\n\n…', textarea: true },
  ]},
  { section: 'Terms of Use',      keys: [
    { k:'terms_content', label:'Terms of Use (Markdown)', placeholder:'# Terms of Use\n\n…', textarea: true },
  ]},
]

export default function AdminContent() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [active, setActive] = useState('Hero')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/settings').then(r=>r.json()).then(d=>{
      if(d.settings) setValues(d.settings)
      setLoading(false)
    }).catch(()=>setLoading(false))
  }, [])

  const save = async () => {
    setSaving(true); setError('')
    try {
      const res = await fetch('/api/admin/settings', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(values) })
      if(!res.ok) throw new Error((await res.json()).error||'Failed')
      setSaved(true); setTimeout(()=>setSaved(false), 3000)
    } catch(e){setError(e instanceof Error?e.message:'Save failed')}
    finally{setSaving(false)}
  }

  const section = SECTION_FIELDS.find(s=>s.section===active)!

  if(loading) return <div style={{padding:'3rem',color:'var(--color-text-tertiary)',fontSize:14}}>Loading…</div>

  return (
    <div>
      <div style={{marginBottom:'2.5rem'}}>
        <h1 style={{fontFamily:'var(--font-playfair,serif)',fontSize:28,fontWeight:400,color:'var(--color-text-primary)',marginBottom:'0.35rem',letterSpacing:'-0.02em'}}>Site Content</h1>
        <p style={{fontSize:14,color:'var(--color-text-secondary)'}}>Edit text for all homepage sections, legal pages, and more. Changes appear live within 60 seconds.</p>
      </div>
      {error&&<div style={{padding:'0.75rem 1rem',background:'rgba(255,80,80,0.08)',border:'0.5px solid rgba(255,80,80,0.3)',color:'#ff6060',fontSize:13,marginBottom:'1.5rem'}}>{error}</div>}
      <div style={{display:'grid',gridTemplateColumns:'200px 1fr',gap:'2rem'}}>
        <div style={{display:'flex',flexDirection:'column',gap:'0.25rem'}}>
          {SECTION_FIELDS.map(s=>(
            <button key={s.section} onClick={()=>{setActive(s.section);setSaved(false)}} style={{
              textAlign:'left',padding:'0.5rem 0.75rem',background:active===s.section?'rgba(232,104,58,0.08)':'transparent',
              border:'none',borderLeft:active===s.section?'1.5px solid var(--color-accent)':'1.5px solid transparent',
              color:active===s.section?'var(--color-text-primary)':'var(--color-text-secondary)',cursor:'pointer',fontSize:12,fontFamily:'inherit',lineHeight:1.4,
            }}>{s.section}</button>
          ))}
        </div>
        <div style={{border:'0.5px solid var(--color-border)',padding:'2rem'}}>
          <h2 style={{fontSize:14,color:'var(--color-text-primary)',marginBottom:'2rem',fontFamily:'var(--font-playfair,serif)'}}>{section.section}</h2>
          <div style={{display:'flex',flexDirection:'column',gap:'1.25rem'}}>
            {section.keys.map(field=>(
              <div key={field.k}>
                <label style={{display:'block',fontSize:10,letterSpacing:'0.08em',textTransform:'uppercase',color:'var(--color-text-tertiary)',marginBottom:'0.35rem'}}>{field.label}</label>
                {(field as {textarea?:boolean}).textarea ? (
                  <textarea
                    value={values[field.k]||''}
                    onChange={e=>setValues(v=>({...v,[field.k]:e.target.value}))}
                    placeholder={field.placeholder}
                    rows={12}
                    style={{width:'100%',background:'var(--color-surface-1)',border:'0.5px solid var(--color-border-mid)',padding:'0.625rem 0.875rem',fontSize:12,color:'var(--color-text-primary)',fontFamily:'"JetBrains Mono","Courier New",monospace',outline:'none',boxSizing:'border-box' as const,resize:'vertical' as const,lineHeight:1.6}}
                  />
                ) : (
                  <input
                    value={values[field.k]||''}
                    onChange={e=>setValues(v=>({...v,[field.k]:e.target.value}))}
                    placeholder={field.placeholder}
                    style={{width:'100%',background:'var(--color-surface-1)',border:'0.5px solid var(--color-border-mid)',padding:'0.625rem 0.875rem',fontSize:13,color:'var(--color-text-primary)',fontFamily:'inherit',outline:'none',boxSizing:'border-box' as const}}
                  />
                )}
              </div>
            ))}
          </div>
          <button onClick={save} disabled={saving} className="btn-primary" style={{marginTop:'2rem',opacity:saving?0.6:1}}>
            {saved?'✓ Saved — Live on site':saving?'Saving…':'Save Section'}
          </button>
        </div>
      </div>
    </div>
  )
}
