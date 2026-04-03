'use client'
import { useState } from 'react'
import { useScrollReveal } from '@/lib/useScrollReveal'
import ApertureMark from '@/components/ApertureMark'

const TYPES = ['TVC / Commercial','Brand Film','Feature Film','Brand Strategy','Digital Campaign','Creative Technology','Reputation / PR','Workshop / Talk','Something Else']

export default function Invite() {
  useScrollReveal()
  const [type, setType]     = useState('')
  const [name, setName]     = useState('')
  const [email, setEmail]   = useState('')
  const [brief, setBrief]   = useState('')
  const [status, setStatus] = useState<'idle'|'sending'|'done'|'error'>('idle')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!type) return
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, name, email, brief }),
      })
      setStatus(res.ok ? 'done' : 'error')
    } catch {
      setStatus('error')
    }
  }

  const inputStyle: React.CSSProperties = {
    width:'100%', padding:'0.875rem 1rem',
    background:'var(--color-surface-1)',
    border:'0.5px solid var(--color-border)',
    borderRadius:2, color:'var(--color-text-primary)',
    fontSize:14, fontFamily:'inherit', outline:'none',
    transition:'border-color 0.2s',
  }
  const focus = (e: React.FocusEvent<HTMLInputElement|HTMLTextAreaElement>) =>
    (e.target.style.borderColor = 'var(--color-border-mid)')
  const blur  = (e: React.FocusEvent<HTMLInputElement|HTMLTextAreaElement>) =>
    (e.target.style.borderColor = 'var(--color-border)')

  return (
    <section style={{ background:'#080808', padding:'6rem clamp(1.25rem,5vw,3.5rem)', borderTop:'0.5px solid var(--color-border)' }}>
      <div style={{ maxWidth:680 }}>
        <div data-reveal style={{ marginBottom:'2rem' }}>
          <ApertureMark size={38}/>
        </div>

        <div data-reveal>
          <span className="text-label" style={{ display:'block', marginBottom:'1rem', color:'var(--color-text-tertiary)' }}>Start a Project</span>
          <h2 className="text-display-sm" style={{ color:'var(--color-text-primary)', marginBottom:'1rem' }}>
            What problem needs a{' '}
            <em style={{ color:'var(--color-accent)' }}>creative intelligence</em>{' '}
            solution?
          </h2>
          <p style={{ fontSize:15, lineHeight:1.72, color:'var(--color-text-secondary)', marginBottom:'2.5rem' }}>
            Every great collaboration starts with clarity. Tell me what you&apos;re building.
          </p>
        </div>

        {status === 'done' ? (
          <div data-reveal style={{ padding:'3rem', border:'0.5px solid var(--color-border-accent)', background:'var(--color-accent-dim)', borderRadius:2, textAlign:'center' as const }}>
            <ApertureMark size={34}/>
            <p style={{ fontFamily:'var(--font-playfair,serif)', fontSize:22, fontStyle:'italic', color:'var(--color-text-primary)', margin:'1.5rem 0 0.75rem' }}>Brief received.</p>
            <p style={{ fontSize:14, color:'var(--color-text-secondary)' }}>I&apos;ll be in touch within 48 hours.</p>
          </div>
        ) : (
          <form onSubmit={submit} data-reveal>
            {/* Type pills */}
            <fieldset style={{ border:'none', padding:0, marginBottom:'2rem' }}>
              <legend className="text-label" style={{ display:'block', marginBottom:'1rem' }}>Project type</legend>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem' }}>
                {TYPES.map(t => (
                  <button key={t} type="button" onClick={() => setType(t)} style={{
                    fontSize:13, padding:'0.45rem 0.9rem',
                    border: type===t ? '0.5px solid var(--color-accent)' : '0.5px solid var(--color-border-mid)',
                    background: type===t ? 'var(--color-accent-dim)' : 'transparent',
                    color: type===t ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                    borderRadius:2, cursor:'pointer', transition:'all 0.2s', fontFamily:'inherit',
                  }}>{t}</button>
                ))}
              </div>
            </fieldset>

            {/* Name + email */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1rem' }}>
              {[
                { id:'brief-name',  label:'Name',  type:'text',  val:name,  set:setName,  ph:'Your name',        ac:'name' },
                { id:'brief-email', label:'Email', type:'email', val:email, set:setEmail, ph:'your@email.com',   ac:'email' },
              ].map(f => (
                <div key={f.id}>
                  <label htmlFor={f.id} className="text-label" style={{ display:'block', marginBottom:'0.5rem' }}>{f.label}</label>
                  <input id={f.id} type={f.type} required value={f.val}
                    onChange={e => f.set(e.target.value)}
                    placeholder={f.ph} autoComplete={f.ac}
                    style={inputStyle} onFocus={focus} onBlur={blur}/>
                </div>
              ))}
            </div>

            {/* Brief */}
            <div style={{ marginBottom:'1.5rem' }}>
              <label htmlFor="brief-text" className="text-label" style={{ display:'block', marginBottom:'0.5rem' }}>The Brief</label>
              <textarea id="brief-text" required rows={5} value={brief}
                onChange={e => setBrief(e.target.value)}
                placeholder="Tell me about the project — the brand, the objective, the audience, and what success looks like."
                style={{ ...inputStyle, resize:'vertical', lineHeight:1.65 }}
                onFocus={focus as unknown as React.FocusEventHandler<HTMLTextAreaElement>}
                onBlur={blur   as unknown as React.FocusEventHandler<HTMLTextAreaElement>}/>
            </div>

            {status === 'error' && (
              <p style={{ fontSize:13, color:'#e24b4a', marginBottom:'1rem' }}>
                Something went wrong. Email me directly at niddhish@lightseekermedia.com
              </p>
            )}

            <button type="submit" disabled={status==='sending'||!type} className="btn-primary"
              style={{ opacity: !type ? 0.5 : 1 }}>
              {status==='sending' ? 'Sending...' : 'Start the Brief'}
              {status!=='sending' && (
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M1 6.5h11M6.5 1l5.5 5.5-5.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          </form>
        )}

        {/* Contact */}
        <div data-reveal style={{ marginTop:'3.5rem', paddingTop:'2rem', borderTop:'0.5px solid var(--color-border)', display:'flex', gap:'2.5rem', flexWrap:'wrap' }}>
          {[
            { label:'Email', val:'niddhish@lightseekermedia.com', href:'mailto:niddhish@lightseekermedia.com' },
            { label:'Phone', val:'+91 99204 62666',               href:'tel:+919920462666' },
          ].map(c => (
            <div key={c.label}>
              <span className="text-label" style={{ display:'block', marginBottom:'0.4rem' }}>{c.label}</span>
              <a href={c.href} style={{ fontSize:14, color:'var(--color-text-secondary)', textDecoration:'none', transition:'color 0.2s' }}
                onMouseEnter={e=>((e.target as HTMLElement).style.color='var(--color-accent)')}
                onMouseLeave={e=>((e.target as HTMLElement).style.color='var(--color-text-secondary)')}>
                {c.val}
              </a>
            </div>
          ))}
        </div>
      </div>

      <style>{`@media(max-width:560px){form > div:first-of-type + div{grid-template-columns:1fr!important;}}`}</style>
    </section>
  )
}
