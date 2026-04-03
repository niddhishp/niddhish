'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useScrollReveal } from '@/lib/useScrollReveal'

const FILMS = [
  { id:1, title:'Nike — The Charge Within',              brand:'Nike',           type:'Sport / Anthem',    year:'2024', thumb:'https://i.vimeocdn.com/video/2064044054-4a15d127aa3e80666290989c01ce2e9c1d63050a381bc4a418cf021c972d360f-d_1280x720' },
  { id:2, title:'Harley Davidson — Ride Back to Yourself',brand:'Harley Davidson',type:'Brand Film',        year:'2024', thumb:'https://i.vimeocdn.com/video/2060441350-1aa7a69e323287db504b13d2a967e811154bede781fabe8a20f2d97b04cebf51-d_1280x720' },
  { id:3, title:'Maruti Suzuki Victoris',                brand:'Maruti Suzuki', type:'Automobile',          year:'2024', thumb:'https://i.vimeocdn.com/video/2062686862-0d984015a604269c1cc290e54fba3352c005c7fda50f17ac811ee2fc57989c17-d_1280x720' },
  { id:4, title:'Adidas Y-3 — The Serve',                brand:'Adidas Y-3',    type:'Fashion / Sport',    year:'2024', thumb:'https://i.vimeocdn.com/video/2061570309-e596c4888403ddb9a724086defb2698376ef2872d817ff07da6329935bd98ace-d_1280x720' },
  { id:5, title:'Uber — Move Forward',                   brand:'Uber',          type:'Narrative',           year:'2023', thumb:'https://i.vimeocdn.com/video/2058460834-12bf50e95a610e37b78ed0b28f877a1c9701104322054a12c2d618feb3b7c996-d_1280x720' },
  { id:6, title:'Kinetic Green — The Befikr Ride',       brand:'Kinetic Green', type:'EV / Lifestyle',      year:'2024', thumb:'https://i.vimeocdn.com/video/2062690757-46acbf86caea63bf0bc407d034ebe8ef6e53955d1fe5fd6b0c0eb1e6507a4eae-d_1280x720' },
]

const CLIENTS = ['Nike','Harley Davidson','Adidas','Uber','Maruti Suzuki','LG','Tata Motors','L\'Oréal','Mastercard','Zomato','Times of India','Westside','HP','Paytm','Big Basket','Housing.com','Vivo','Abbott','Cipla','Bandhan','Skoda','Honda','Toyota','Levis','ONE Card','Optimum Nutrition']

export default function WorkReel() {
  useScrollReveal()

  const doubledClients = [...CLIENTS, ...CLIENTS]

  return (
    <section style={{ background:'var(--color-bg)', paddingTop:'5rem' }}>
      {/* Section header */}
      <div
        style={{ padding:'0 clamp(1.25rem,5vw,3.5rem)', marginBottom:'2.5rem', display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:'1.5rem' }}
        data-reveal
      >
        <div>
          <span className="text-label" style={{ display:'block', marginBottom:'0.75rem' }}>
            Selected Work
          </span>
          <h2
            className="text-display-md"
            style={{ color:'var(--color-text-primary)', letterSpacing:'-0.025em' }}
          >
            200+ films.{' '}
            <em style={{ color:'var(--color-text-secondary)', fontStyle:'italic' }}>Every one a brief.</em>
          </h2>
        </div>
        <Link href="/work" className="btn-ghost" data-reveal data-reveal-delay="2">
          Full Filmography
        </Link>
      </div>

      {/* Film grid — 3 col, edge-to-edge */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:2 }}>
        {FILMS.map((film, i) => (
          <a
            key={film.id}
            href="https://vimeo.com/niddhish"
            target="_blank"
            rel="noopener noreferrer"
            data-reveal
            data-reveal-delay={String((i%3)+1) as '1'|'2'|'3'}
            className="film-card"
            style={{
              position:'relative', display:'block',
              aspectRatio:'16/9', overflow:'hidden',
              background:'var(--color-surface-2)',
              textDecoration:'none',
            }}
          >
            <Image
              src={film.thumb}
              alt={film.title}
              fill
              sizes="(max-width:768px) 100vw, 33vw"
              className="film-img"
              style={{
                objectFit:'cover',
                filter:'brightness(0.58) saturate(0.9)',
                transition:'transform 0.7s cubic-bezier(0.16,1,0.3,1), filter 0.4s',
              }}
            />
            {/* Year tag */}
            <span style={{
              position:'absolute', top:'1rem', right:'1rem',
              fontSize:10, letterSpacing:'0.1em', color:'rgba(240,237,232,0.45)',
              fontFamily:'var(--font-dm-sans,sans-serif)',
              zIndex:2,
            }}>
              {film.year}
            </span>
            {/* Play */}
            <div className="film-play" style={{
              position:'absolute', top:'50%', left:'50%',
              transform:'translate(-50%,-50%) scale(0.8)',
              width:48, height:48, borderRadius:'50%',
              border:'1px solid rgba(255,255,255,0.3)',
              display:'flex', alignItems:'center', justifyContent:'center',
              opacity:0,
              transition:'opacity 0.35s, transform 0.35s cubic-bezier(0.34,1.56,0.64,1)',
              zIndex:2,
            }}>
              <svg width="11" height="13" viewBox="0 0 11 13" fill="white"><path d="M1 1l9 5.5L1 12V1z"/></svg>
            </div>
            {/* Caption */}
            <div className="film-caption" style={{
              position:'absolute', bottom:0, left:0, right:0,
              padding:'3rem 1.25rem 1.25rem',
              background:'linear-gradient(transparent, rgba(0,0,0,0.92))',
              transform:'translateY(100%)',
              transition:'transform 0.45s cubic-bezier(0.16,1,0.3,1)',
              zIndex:2,
            }}>
              <span style={{ display:'block', fontSize:10, letterSpacing:'0.1em', textTransform:'uppercase' as const, color:'var(--color-accent)', marginBottom:5 }}>
                {film.brand} &nbsp;·&nbsp; {film.type}
              </span>
              <span style={{
                display:'block',
                fontFamily:'var(--font-playfair,serif)',
                fontSize:15, fontWeight:400, color:'#fff', lineHeight:1.3,
              }}>
                {film.title}
              </span>
            </div>
          </a>
        ))}
      </div>

      {/* Marquee brand strip */}
      <div
        style={{
          borderTop:'0.5px solid var(--color-border)',
          padding:'2.5rem 0',
        }}
        data-reveal
      >
        <div style={{ padding:'0 clamp(1.25rem,5vw,3.5rem)', marginBottom:'1.25rem' }}>
          <span className="text-label">Brands</span>
        </div>
        <div className="marquee-outer">
          <div className="marquee-track">
            {doubledClients.map((c, i) => (
              <span key={`${c}-${i}`} style={{
                fontSize:12, letterSpacing:'0.1em', textTransform:'uppercase' as const,
                color:'var(--color-text-tertiary)',
                padding:'0 2.5rem',
                whiteSpace:'nowrap',
                flexShrink:0,
                transition:'color 0.2s',
              }}>
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .film-card:hover .film-img { transform:scale(1.06)!important; filter:brightness(0.75) saturate(1)!important; }
        .film-card:hover .film-caption { transform:translateY(0)!important; }
        .film-card:hover .film-play { opacity:1!important; transform:translate(-50%,-50%) scale(1)!important; }
        @media(max-width:768px){
          section > div:nth-child(3){ grid-template-columns:1fr!important; }
          .film-card .film-caption{ transform:translateY(0)!important; }
        }
        @media(min-width:769px) and (max-width:1100px){
          section > div:nth-child(3){ grid-template-columns:repeat(2,1fr)!important; }
        }
      `}</style>
    </section>
  )
}
