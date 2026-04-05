'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ApertureMark from '@/components/ApertureMark'

const DEFAULT_TYPES = [
  'TVC / Commercial', 'Brand Film', 'Feature Film', 'Brand Strategy',
  'Digital Campaign', 'Creative Technology', 'Reputation / PR', 'Workshop / Talk', 'Something Else',
]

export default function Invite() {
  const [type, setType]     = useState('')
  const [name, setName]     = useState('')
  const [email, setEmail]   = useState('')
  const [brief, setBrief]   = useState('')
  const [status, setStatus] = useState<'idle'|'sending'|'done'|'error'>('idle')

  // Editable copy from Supabase
  const [sceneLabel,  setSceneLabel]  = useState('SCENE 06 — THE BRIEF')
  const [heading,     setHeading]     = useState('Start a Project')
  const [sub,         setSub]         = useState('What problem needs a creative intelligence solution?')
  const [body,        setBody]        = useState('Every great collaboration starts with a clear brief. Tell me what you\'re building — and why it matters.')
  const [projectTypes,setProjectTypes]= useState(DEFAULT_TYPES)

  useEffect(() => {
    fetch('/api/content').then(r=>r.json()).then(d=>{
      if(d.contact_label)         setSceneLabel(d.contact_label)
      if(d.contact_heading)       setHeading(d.contact_heading)
      if(d.contact_sub)           setSub(d.contact_sub)
      if(d.contact_body)          setBody(d.contact_body)
      if(d.contact_project_types) setProjectTypes(d.contact_project_types.split(',').map((s:string)=>s.trim()).filter(Boolean))
    }).catch(()=>{})
  }, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!type) return
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ type, name, email, brief }) })
      setStatus(res.ok ? 'done' : 'error')
    } catch { setStatus('error') }
  }

  const inputStyle: React.CSSProperties = {
    width:'100%', padding:'0.875rem 1rem',
    background:'rgba(255,255,255,0.03)', border:'0.5px solid var(--color-border)',
    borderRadius:2, color:'var(--color-text-primary)', fontSize:14, fontFamily:'inherit', outline:'none', transition:'border-color 0.2s, background 0.2s',
  }
  const onFocus = (e: React.FocusEvent<HTMLInputElement|HTMLTextAreaElement>) => { e.target.style.borderColor='rgba(216,90,48,0.4)'; e.target.style.background='rgba(216,90,48,0.04)' }
  const onBlur  = (e: React.FocusEvent<HTMLInputElement|HTMLTextAreaElement>) => { e.target.style.borderColor='var(--color-border)'; e.target.style.background='rgba(255,255,255,0.03)' }

  return (
    <section style={{ background:'#060606', borderTop:'0.5px solid var(--color-border)', padding:'7rem clamp(1.25rem,5vw,3.5rem)' }}>
      <div style={{ maxWidth:860, margin:'0 auto', textAlign:'center' }}>

        <motion.div initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}} transition={{duration:0.5}}
          style={{ fontFamily:'"JetBrains Mono","Courier New",monospace', fontSize:9, letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(216,90,48,0.4)', marginBottom:'2.5rem' }}>
          {sceneLabel}
        </motion.div>

        <motion.div initial={{opacity:0,scale:0.7}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={{duration:0.8,ease:[0.16,1,0.3,1]}} style={{display:'flex',justifyContent:'center',marginBottom:'2rem'}}>
          <ApertureMark size={40} />
        </motion.div>

        <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.8,ease:[0.16,1,0.3,1],delay:0.1}}>
          <span className="text-label" style={{display:'block',marginBottom:'1rem',color:'var(--color-text-tertiary)'}}>{heading}</span>
          <h2 className="text-display-sm" style={{color:'var(--color-text-primary)',marginBottom:'1rem',lineHeight:1.15}}>
            {sub.includes('creative intelligence') ? (
              <>{sub.split('creative intelligence')[0]}<em style={{color:'var(--color-accent)'}}>creative intelligence</em>{sub.split('creative intelligence')[1]}</>
            ) : sub}
          </h2>
          <p style={{fontSize:15,lineHeight:1.72,color:'var(--color-text-secondary)',marginBottom:'3rem',maxWidth:540,margin:'0 auto 3rem'}}>
            {body}
          </p>
        </motion.div>

        {status === 'done' ? (
          <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} style={{padding:'3.5rem 2.5rem',border:'0.5px solid var(--color-border-accent)',background:'rgba(216,90,48,0.06)',borderRadius:2,textAlign:'center'}}>
            <ApertureMark size={36} />
            <p style={{fontFamily:'var(--font-playfair,serif)',fontSize:22,fontStyle:'italic',color:'var(--color-text-primary)',margin:'1.5rem 0 0.75rem'}}>Brief received.</p>
            <p style={{fontSize:14,color:'var(--color-text-secondary)'}}>I&apos;ll be in touch within 48 hours.</p>
          </motion.div>
        ) : (
          <motion.form onSubmit={submit} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.8,ease:[0.16,1,0.3,1],delay:0.2}} style={{textAlign:'left'}}>
            <fieldset style={{border:'none',padding:0,marginBottom:'2rem'}}>
              <legend className="text-label" style={{display:'block',marginBottom:'1rem',textAlign:'left'}}>Project type</legend>
              <div style={{display:'flex',flexWrap:'wrap',gap:'0.5rem',justifyContent:'flex-start'}}>
                {projectTypes.map(t => (
                  <button key={t} type="button" onClick={()=>setType(t)} style={{
                    fontSize:12, padding:'0.45rem 0.9rem',
                    border: type===t ? '0.5px solid var(--color-accent)' : '0.5px solid var(--color-border-mid)',
                    background: type===t ? 'rgba(216,90,48,0.12)' : 'transparent',
                    color: type===t ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                    borderRadius:2, cursor:'pointer', transition:'all 0.2s', fontFamily:'inherit',
                  }}>{t}</button>
                ))}
              </div>
            </fieldset>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',marginBottom:'1rem'}}>
              {[
                {id:'n',label:'Name', type:'text', val:name, set:setName, ph:'Your name', ac:'name'},
                {id:'e',label:'Email',type:'email',val:email,set:setEmail,ph:'your@email.com',ac:'email'},
              ].map(f=>(
                <div key={f.id}>
                  <label htmlFor={`invite-${f.id}`} className="text-label" style={{display:'block',marginBottom:'0.5rem'}}>{f.label}</label>
                  <input id={`invite-${f.id}`} type={f.type} required value={f.val} onChange={e=>f.set(e.target.value)} placeholder={f.ph} autoComplete={f.ac} style={inputStyle} onFocus={onFocus} onBlur={onBlur}/>
                </div>
              ))}
            </div>

            <div style={{marginBottom:'1.75rem'}}>
              <label htmlFor="invite-brief" className="text-label" style={{display:'block',marginBottom:'0.5rem'}}>The Brief</label>
              <textarea id="invite-brief" required rows={5} value={brief} onChange={e=>setBrief(e.target.value)} placeholder="Tell me about the project — the brand, the objective, the audience, and what success looks like to you." style={{...inputStyle,resize:'vertical',lineHeight:1.65}} onFocus={onFocus as unknown as React.FocusEventHandler<HTMLTextAreaElement>} onBlur={onBlur as unknown as React.FocusEventHandler<HTMLTextAreaElement>}/>
            </div>

            {status === 'error' && <p style={{fontSize:13,color:'#e05555',marginBottom:'1rem'}}>Something went wrong. Email directly: niddhish@lightseekermedia.com</p>}

            <div style={{display:'flex',alignItems:'center',gap:'1.5rem',flexWrap:'wrap'}}>
              <button type="submit" disabled={status==='sending'||!type} className="btn-primary" style={{opacity:!type?0.5:1}}>
                {status==='sending'?'Sending...':'Start the Brief'}
                {status!=='sending'&&<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1 6.5h11M6.5 1l5.5 5.5-5.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </button>
              <span style={{fontSize:12,color:'var(--color-text-tertiary)'}}>Response within 48 hours.</span>
            </div>
          </motion.form>
        )}

        <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.7,delay:0.3}} style={{marginTop:'4rem',paddingTop:'2.5rem',borderTop:'0.5px solid var(--color-border)',display:'flex',gap:'3rem',flexWrap:'wrap',justifyContent:'center'}}>
          {[
            {label:'Email',val:'niddhish@lightseekermedia.com',href:'mailto:niddhish@lightseekermedia.com'},
            {label:'Phone',val:'+91 99204 62666',href:'tel:+919920462666'},
            {label:'Vimeo',val:'vimeo.com/niddhish',href:'https://vimeo.com/niddhish'},
          ].map(c=>(
            <div key={c.label} style={{textAlign:'center'}}>
              <span className="text-label" style={{display:'block',marginBottom:'0.4rem'}}>{c.label}</span>
              <a href={c.href} target={c.href.startsWith('http')?'_blank':undefined} rel="noopener noreferrer" style={{fontSize:13,color:'var(--color-text-secondary)',textDecoration:'none',transition:'color 0.2s'}} onMouseEnter={e=>((e.target as HTMLElement).style.color='var(--color-accent)')} onMouseLeave={e=>((e.target as HTMLElement).style.color='var(--color-text-secondary)')}>{c.val}</a>
            </div>
          ))}
        </motion.div>
      </div>
      <style>{`@media(max-width:560px){ form > div:first-of-type + div { grid-template-columns:1fr!important; } }`}</style>
    </section>
  )
}
