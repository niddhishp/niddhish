'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useScrollReveal } from '@/lib/useScrollReveal'

const FILMS = [
  { id: 1, title: 'Nike — The Charge Within',             brand: 'Nike',          type: 'Sport / Anthem',   thumb: 'https://i.vimeocdn.com/video/2064044054-4a15d127aa3e80666290989c01ce2e9c1d63050a381bc4a418cf021c972d360f-d_1280x720' },
  { id: 2, title: 'Harley Davidson — Ride Back to Yourself', brand: 'Harley Davidson', type: 'Brand Film',    thumb: 'https://i.vimeocdn.com/video/2060441350-1aa7a69e323287db504b13d2a967e811154bede781fabe8a20f2d97b04cebf51-d_1280x720' },
  { id: 3, title: 'Maruti Suzuki Victoris',               brand: 'Maruti Suzuki', type: 'Automobile',       thumb: 'https://i.vimeocdn.com/video/2062686862-0d984015a604269c1cc290e54fba3352c005c7fda50f17ac811ee2fc57989c17-d_1280x720' },
  { id: 4, title: 'Adidas Y-3 — The Serve',               brand: 'Adidas Y-3',   type: 'Fashion / Sport',  thumb: 'https://i.vimeocdn.com/video/2061570309-e596c4888403ddb9a724086defb2698376ef2872d817ff07da6329935bd98ace-d_1280x720' },
  { id: 5, title: 'Uber — Move Forward',                   brand: 'Uber',          type: 'Narrative',        thumb: 'https://i.vimeocdn.com/video/2058460834-12bf50e95a610e37b78ed0b28f877a1c9701104322054a12c2d618feb3b7c996-d_1280x720' },
  { id: 6, title: 'Kinetic Green — The Befikr Ride',      brand: 'Kinetic Green', type: 'EV / Lifestyle',   thumb: 'https://i.vimeocdn.com/video/2062690757-46acbf86caea63bf0bc407d034ebe8ef6e53955d1fe5fd6b0c0eb1e6507a4eae-d_1280x720' },
]

const CLIENTS = ['Nike','Harley Davidson','Adidas','Uber','Maruti Suzuki','LG','Tata Motors','L\'Oréal','Mastercard','Zomato','Times of India','Westside','HP','Paytm','Big Basket','Housing.com','Vivo','Abbott','Cipla','Bandhan']

export default function WorkReel() {
  useScrollReveal()
  return (
    <section style={{ background: 'var(--color-bg)', paddingTop: '5rem' }}>
      {/* Header */}
      <div style={{
        padding: '0 clamp(1.25rem, 5vw, 3.5rem)',
        marginBottom: '2.5rem',
        display: 'flex', alignItems: 'flex-end',
        justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem',
      }} data-reveal>
        <div>
          <span className="text-label" style={{ display: 'block', marginBottom: '0.75rem' }}>Selected Work</span>
          <h2 className="text-display-md" style={{ color: 'var(--color-text-primary)' }}>
            200+ films.{' '}
            <span style={{ color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>Every one a brief.</span>
          </h2>
        </div>
        <Link href="/work" className="btn-ghost" data-reveal data-reveal-delay="2">Full Filmography</Link>
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 2,
      }}>
        {FILMS.map((film, i) => (
          <a
            key={film.id}
            href="https://vimeo.com/niddhish"
            target="_blank"
            rel="noopener noreferrer"
            data-reveal
            data-reveal-delay={String((i % 3) + 1) as '1'|'2'|'3'}
            style={{
              position: 'relative', display: 'block',
              aspectRatio: '16/9', overflow: 'hidden',
              background: 'var(--color-surface-1)',
              textDecoration: 'none',
            }}
            className="film-card"
          >
            <Image
              src={film.thumb}
              alt={film.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              style={{ objectFit: 'cover', filter: 'brightness(0.65)', transition: 'transform 0.65s cubic-bezier(0.16,1,0.3,1), filter 0.4s' }}
              className="film-img"
            />
            {/* Play button */}
            <div className="film-play" style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%,-50%)',
              width: 44, height: 44, borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: 0, transition: 'opacity 0.3s',
            }}>
              <svg width="11" height="13" viewBox="0 0 11 13" fill="white"><path d="M1 1l9 5.5L1 12V1z"/></svg>
            </div>
            {/* Caption */}
            <div className="film-caption" style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              padding: '2.5rem 1.25rem 1.25rem',
              background: 'linear-gradient(transparent, rgba(0,0,0,0.88))',
              transform: 'translateY(100%)',
              transition: 'transform 0.42s cubic-bezier(0.16,1,0.3,1)',
            }}>
              <span style={{
                display: 'block', fontSize: 10, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: 4,
              }}>{film.brand} · {film.type}</span>
              <span style={{
                display: 'block',
                fontFamily: 'var(--font-playfair, serif)',
                fontSize: 15, fontWeight: 400, color: '#fff', lineHeight: 1.3,
              }}>{film.title}</span>
            </div>
          </a>
        ))}
      </div>

      {/* Clients */}
      <div style={{
        padding: '3.5rem clamp(1.25rem, 5vw, 3.5rem)',
        borderTop: '0.5px solid var(--color-border)',
      }} data-reveal>
        <span className="text-label" style={{ display: 'block', marginBottom: '1.5rem' }}>Brands</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem 2rem' }}>
          {CLIENTS.map(c => (
            <span key={c} style={{
              fontSize: 12, letterSpacing: '0.07em',
              color: 'var(--color-text-tertiary)',
              textTransform: 'uppercase', transition: 'color 0.2s', cursor: 'default',
            }}
              onMouseEnter={e => ((e.target as HTMLElement).style.color='var(--color-text-secondary)')}
              onMouseLeave={e => ((e.target as HTMLElement).style.color='var(--color-text-tertiary)')}>
              {c}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        .film-card:hover .film-img { transform: scale(1.04) !important; filter: brightness(0.82) !important; }
        .film-card:hover .film-caption { transform: translateY(0) !important; }
        .film-card:hover .film-play { opacity: 1 !important; }
        @media(max-width:768px){
          .film-card .film-caption { transform: translateY(0) !important; }
          section > div:nth-child(3) { grid-template-columns: 1fr !important; }
        }
        @media(min-width:769px) and (max-width:1024px){
          section > div:nth-child(3) { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>
    </section>
  )
}
