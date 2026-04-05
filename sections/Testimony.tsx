'use client'
import { useScrollReveal } from '@/lib/useScrollReveal'
import { useState, useEffect } from 'react'

interface Testimonial { id:string; quote:string; name:string; title:string; company:string; sort_order:number }
interface Award { id:string; name:string; festival:string; year:string; logo_url:string; sort_order:number; abbr?:string }

const STATIC_QUOTES = [
  { q:'In a world where people talk a lot and do very little, Niddhish is a breath of fresh air. He does things. And gets things done. It is an extremely rare quality and something we benefited greatly from.', name:'Russell Barrett', title:'CCEO — TBWA\\India' },
  { q:'A good director should not just translate a script to a video but also bring the story alive with nuances and flavours. Niddhish almost co-wrote the script with us and delivered a memorable, fun piece.', name:'Tanuja Bhat', title:'ECD — Ogilvy Mumbai' },
  { q:'Without a doubt one of the most talented directors I have come across. He strikes the right balance between passion, quality, and business needs — without going overboard. A rare combination.', name:'Prashant Awasthi', title:'AVP & Marketing Head — Siyaram Silk Mills' },
]
const STATIC_AWARDS = [
  { id:'1', name:'Cannes Lions', festival:'Cannes', year:'', logo_url:'', sort_order:1, abbr:'CL' },
  { id:'2', name:'Kyoorius',     festival:'Kyoorius', year:'', logo_url:'', sort_order:2, abbr:'KY' },
  { id:'3', name:'Foxglove',     festival:'Foxglove', year:'', logo_url:'', sort_order:3, abbr:'FG' },
  { id:'4', name:'AFAQS',        festival:'AFAQS', year:'', logo_url:'', sort_order:4, abbr:'AF' },
]

export default function Testimony() {
  useScrollReveal()
  const [quotes, setQuotes] = useState(STATIC_QUOTES)
  const [awards, setAwards] = useState<Award[]>(STATIC_AWARDS)
  const [sceneLabel, setSceneLabel] = useState('SCENE 05 — THE CRITICS')

  useEffect(() => {
    fetch('/api/admin/testimonials').then(r=>r.json()).then(d=>{
      if(d.testimonials?.length) {
        setQuotes(d.testimonials.map((t:Testimonial) => ({
          q: t.quote, name: t.name, title: [t.title, t.company].filter(Boolean).join(' · ')
        })))
      }
    }).catch(()=>{})
    fetch('/api/admin/awards').then(r=>r.json()).then(d=>{
      if(d.awards?.length) setAwards(d.awards)
    }).catch(()=>{})
    fetch('/api/content').then(r=>r.json()).then(d=>{
      if(d.critics_label) setSceneLabel(d.critics_label)
    }).catch(()=>{})
  }, [])

  const main = quotes[0]
  const rest = quotes.slice(1)

  return (
    <section style={{ background:'var(--color-bg)', padding:'6rem clamp(1.25rem,5vw,3.5rem)', borderTop:'0.5px solid var(--color-border)', position:'relative', overflow:'hidden' }}>
      {/* Aperture watermark */}
      <svg aria-hidden viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"
        style={{ position:'absolute',top:'5%',right:'-8%',width:'40vw',maxWidth:500,height:'auto',opacity:0.025,pointerEvents:'none',zIndex:0 }}>
        <circle cx="50" cy="50" r="46" stroke="#d85a30" strokeWidth="0.6" fill="none"/>
        <circle cx="50" cy="50" r="12" stroke="#d85a30" strokeWidth="0.8" fill="none"/>
        {[0,60,120,180,240,300].map(deg=>(
          <g key={deg}>
            <line x1={50+14*Math.cos(deg*Math.PI/180)} y1={50+14*Math.sin(deg*Math.PI/180)}
              x2={50+44*Math.cos(deg*Math.PI/180)} y2={50+44*Math.sin(deg*Math.PI/180)}
              stroke="#d85a30" strokeWidth="0.8"/>
            <circle cx={50+47*Math.cos(deg*Math.PI/180)} cy={50+47*Math.sin(deg*Math.PI/180)} r="1.5" fill="#d85a30"/>
          </g>
        ))}
      </svg>

      {/* Feature quote */}
      <div data-reveal style={{ marginBottom:'5rem', maxWidth:860, position:'relative', zIndex:1 }}>
        <div style={{ fontFamily:'"JetBrains Mono","Courier New",monospace', fontSize:9, letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(216,90,48,0.35)', marginBottom:'2rem' }}>
          {sceneLabel}
        </div>
        <span className="accent-line" style={{ marginBottom:'2rem' }}/>
        <blockquote style={{ fontFamily:'var(--font-playfair,serif)', fontSize:'clamp(20px,3vw,38px)', fontWeight:400, fontStyle:'italic', color:'var(--color-text-primary)', lineHeight:1.38, letterSpacing:'-0.01em' }}>
          &ldquo;{main.q}&rdquo;
        </blockquote>
        <cite style={{ display:'block', marginTop:'1.5rem', fontFamily:'var(--font-dm-sans,sans-serif)', fontStyle:'normal', fontSize:13, color:'var(--color-text-tertiary)', letterSpacing:'0.04em' }}>
          {main.name} &nbsp;·&nbsp; {main.title}
        </cite>
      </div>

      {/* Additional quotes */}
      {rest.length > 0 && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'3rem', marginBottom:'5rem' }}>
          {rest.map((t,i) => (
            <div key={i} data-reveal>
              <blockquote style={{ fontFamily:'var(--font-dm-sans,sans-serif)', fontSize:15, lineHeight:1.75, color:'var(--color-text-secondary)', borderLeft:'1px solid var(--color-border-accent)', paddingLeft:'1.5rem', fontStyle:'italic' }}>
                &ldquo;{t.q}&rdquo;
              </blockquote>
              <cite style={{ display:'block', marginTop:'1rem', paddingLeft:'1.5rem', fontStyle:'normal', fontSize:12, color:'var(--color-text-tertiary)', letterSpacing:'0.04em' }}>
                {t.name} &nbsp;·&nbsp; {t.title}
              </cite>
            </div>
          ))}
        </div>
      )}

      {/* Awards */}
      <div data-reveal style={{ paddingTop:'3rem', borderTop:'0.5px solid var(--color-border)', display:'flex', alignItems:'center', gap:'3rem', flexWrap:'wrap' }}>
        <span className="text-label">Award Recognition</span>
        {awards.map(a => (
          <div key={a.id} style={{ display:'flex', alignItems:'center', gap:8 }}>
            {a.logo_url ? (
              <img src={a.logo_url} alt={a.name} style={{ width:32, height:32, objectFit:'contain', opacity:0.7 }}/>
            ) : (
              <div style={{ width:32, height:32, borderRadius:'50%', border:'0.5px solid var(--color-border-mid)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:500, letterSpacing:'0.08em', color:'var(--color-text-tertiary)' }}>
                {a.abbr || a.name.slice(0,2).toUpperCase()}
              </div>
            )}
            <span style={{ fontSize:13, color:'var(--color-text-secondary)' }}>{a.name}</span>
          </div>
        ))}
      </div>

      <style>{`@media(max-width:700px){section > div:nth-child(3){grid-template-columns:1fr!important;}}`}</style>
    </section>
  )
}
