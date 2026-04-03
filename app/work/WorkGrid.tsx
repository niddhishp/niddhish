'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useScrollReveal } from '@/lib/useScrollReveal'

const FILTERS = ['All', 'Automobile', 'Fashion & Beauty', 'Narrative', 'Humour', 'Sport', 'Feature Film']

const ALL_FILMS = [
  { title:'Nike — The Charge Within',              brand:'Nike',          cat:'Sport',         year:'2024', thumb:'https://i.vimeocdn.com/video/2064044054-4a15d127aa3e80666290989c01ce2e9c1d63050a381bc4a418cf021c972d360f-d_1280x720' },
  { title:'Harley Davidson — Ride Back to Yourself',brand:'Harley Davidson',cat:'Narrative',    year:'2024', thumb:'https://i.vimeocdn.com/video/2060441350-1aa7a69e323287db504b13d2a967e811154bede781fabe8a20f2d97b04cebf51-d_1280x720' },
  { title:'Maruti Suzuki Victoris',                 brand:'Maruti Suzuki',  cat:'Automobile',  year:'2024', thumb:'https://i.vimeocdn.com/video/2062686862-0d984015a604269c1cc290e54fba3352c005c7fda50f17ac811ee2fc57989c17-d_1280x720' },
  { title:'Adidas Y-3 — The Serve',                brand:'Adidas',         cat:'Fashion & Beauty',year:'2024',thumb:'https://i.vimeocdn.com/video/2061570309-e596c4888403ddb9a724086defb2698376ef2872d817ff07da6329935bd98ace-d_1280x720' },
  { title:'Kinetic Green — The Befikr Ride',        brand:'Kinetic Green',  cat:'Automobile',  year:'2024', thumb:'https://i.vimeocdn.com/video/2062690757-46acbf86caea63bf0bc407d034ebe8ef6e53955d1fe5fd6b0c0eb1e6507a4eae-d_1280x720' },
  { title:'Vinsmera — The Adorned',                 brand:'Vinsmera',       cat:'Fashion & Beauty',year:'2024',thumb:'https://i.vimeocdn.com/video/2059633325-7366e6e83916e50818a5846939a662a6a5d0e53649f1a355313c6d3ddeda5638-d_1280x720' },
  { title:'Adidas Y-3 — The Drop',                  brand:'Adidas',         cat:'Fashion & Beauty',year:'2024',thumb:'https://i.vimeocdn.com/video/2059433654-8ef7cca65dcd2ab49d6be73c6b6c4c60e5bf186edec470fb8d4767c73cf666cc-d_1280x720' },
  { title:'Beardo — Bear Taming',                   brand:'Beardo',         cat:'Humour',       year:'2024', thumb:'https://i.vimeocdn.com/video/2058460834-12bf50e95a610e37b78ed0b28f877a1c9701104322054a12c2d618feb3b7c996-d_1280x720' },
  { title:'Uber — Move Forward',                    brand:'Uber',           cat:'Narrative',    year:'2023', thumb:'https://i.vimeocdn.com/video/2058462867-d19664ed4c9e02e9123148ffa93f0aa2f642125b972f320933f19140cdc8271d-d_1280x720' },
  { title:'Housing.com — Find Joy',                 brand:'Housing.com',    cat:'Narrative',    year:'2023', thumb:'https://i.vimeocdn.com/video/2062686862-0d984015a604269c1cc290e54fba3352c005c7fda50f17ac811ee2fc57989c17-d_1280x720' },
  { title:'Bandhan Mutual Fund',                    brand:'Bandhan',        cat:'Narrative',    year:'2023', thumb:'https://i.vimeocdn.com/video/2060441350-1aa7a69e323287db504b13d2a967e811154bede781fabe8a20f2d97b04cebf51-d_1280x720' },
  { title:'Vivo — Capture Life',                    brand:'Vivo',           cat:'Fashion & Beauty',year:'2022',thumb:'https://i.vimeocdn.com/video/2061570309-e596c4888403ddb9a724086defb2698376ef2872d817ff07da6329935bd98ace-d_1280x720' },
  { title:'EGO — Feature Film',                     brand:'Bollywood',      cat:'Feature Film', year:'2024', thumb:'https://i.vimeocdn.com/video/2064044054-4a15d127aa3e80666290989c01ce2e9c1d63050a381bc4a418cf021c972d360f-d_1280x720' },
]

export default function WorkGrid() {
  useScrollReveal()
  const [active, setActive] = useState('All')
  const films = active === 'All' ? ALL_FILMS : ALL_FILMS.filter(f => f.cat === active)

  return (
    <div style={{ minHeight:'100dvh', background:'var(--color-bg)', paddingTop:'8rem' }}>
      {/* Header */}
      <div style={{ padding:'0 clamp(1.25rem,5vw,3.5rem)', marginBottom:'3rem' }} data-reveal>
        <span className="text-label" style={{ display:'block', marginBottom:'0.75rem' }}>Filmography</span>
        <h1 className="text-display-md" style={{ color:'var(--color-text-primary)', marginBottom:'1rem' }}>
          200+ films.
          <span style={{ color:'var(--color-text-secondary)', fontStyle:'italic' }}> Story. Engineered.</span>
        </h1>
      </div>

      {/* Filters */}
      <div style={{
        padding:'0 clamp(1.25rem,5vw,3.5rem)',
        marginBottom:'3rem',
        display:'flex', gap:'0.5rem', flexWrap:'wrap',
      }} data-reveal data-reveal-delay="2">
        {FILTERS.map(f => (
          <button key={f} onClick={() => setActive(f)} style={{
            fontSize:12, padding:'0.45rem 1rem',
            border: active===f ? '0.5px solid var(--color-accent)' : '0.5px solid var(--color-border-mid)',
            background: active===f ? 'var(--color-accent-dim)' : 'transparent',
            color: active===f ? 'var(--color-accent)' : 'var(--color-text-secondary)',
            borderRadius:2, cursor:'pointer', transition:'all 0.2s', fontFamily:'inherit',
            letterSpacing:'0.04em',
          }}>{f}</button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:2 }}>
        {films.map((film, i) => (
          <a key={film.title} href="https://vimeo.com/niddhish" target="_blank" rel="noopener noreferrer"
            data-reveal data-reveal-delay={String((i%4)+1) as '1'|'2'|'3'|'4'}
            style={{ position:'relative', display:'block', aspectRatio:'16/9', overflow:'hidden', background:'var(--color-surface-1)', textDecoration:'none' }}
            className="film-card">
            <Image src={film.thumb} alt={film.title} fill sizes="25vw"
              style={{ objectFit:'cover', filter:'brightness(0.6)', transition:'transform 0.65s cubic-bezier(0.16,1,0.3,1), filter 0.4s' }}
              className="film-img"/>
            <div className="film-caption" style={{
              position:'absolute', bottom:0, left:0, right:0,
              padding:'1.5rem 1rem 1rem',
              background:'linear-gradient(transparent, rgba(0,0,0,0.9))',
              transform:'translateY(100%)',
              transition:'transform 0.42s cubic-bezier(0.16,1,0.3,1)',
            }}>
              <span style={{ display:'block', fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase' as const, color:'var(--color-accent)', marginBottom:3 }}>
                {film.brand} · {film.year}
              </span>
              <span style={{ display:'block', fontFamily:'var(--font-playfair,serif)', fontSize:13, color:'#fff', lineHeight:1.3 }}>{film.title}</span>
            </div>
          </a>
        ))}
      </div>

      <style>{`
        .film-card:hover .film-img{transform:scale(1.04)!important;filter:brightness(0.8)!important;}
        .film-card:hover .film-caption{transform:translateY(0)!important;}
        @media(max-width:1024px){div > div:last-of-type{grid-template-columns:repeat(3,1fr)!important;}}
        @media(max-width:768px){div > div:last-of-type{grid-template-columns:repeat(2,1fr)!important;}}
        @media(max-width:480px){div > div:last-of-type{grid-template-columns:1fr!important;}.film-card .film-caption{transform:translateY(0)!important;}}
      `}</style>
    </div>
  )
}
