'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FEATURE_FILMS } from '@/lib/videos'

// Merge static film data with live poster_url from Supabase
type FilmWithLivePoster = typeof FEATURE_FILMS[number] & { livePosterUrl?: string | null }

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

const STATUS_STYLE = {
  release:    { color: '#e8683a', border: 'rgba(232,104,58,0.6)', bg: 'rgba(232,104,58,0.15)' },
  post:       { color: '#84a8e8', border: 'rgba(100,140,220,0.4)', bg: 'rgba(100,140,220,0.1)' },
  production: { color: '#c8c870', border: 'rgba(180,180,100,0.4)', bg: 'rgba(180,180,100,0.1)' },
}

function PosterCard({ film, index }: { film: FilmWithLivePoster; index: number }) {
  // Live poster takes priority over static URL
  const poster = film.livePosterUrl !== undefined ? film.livePosterUrl : film.posterUrl
  const sc = STATUS_STYLE[film.status]

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.75, ease: EASE, delay: index * 0.1 }}
      style={{ position: 'relative' }}
    >
      <Link href={`/films/${film.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
        {/* Poster — natural portrait aspect ratio */}
        <div style={{
          position: 'relative',
          aspectRatio: '2/3',
          overflow: 'hidden',
          background: '#0a0a0a',
          marginBottom: '1.25rem',
        }}>
          {poster ? (
            <>
              <Image
                src={poster}
                alt={`${film.title} official poster`}
                fill
                unoptimized
                sizes="(max-width: 768px) 100vw, 33vw"
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center top',
                  transition: 'transform 0.7s cubic-bezier(0.16,1,0.3,1)',
                }}
                className="poster-img"
              />
              {/* Subtle footer gradient for status badge */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%',
                background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)',
              }} />
            </>
          ) : (
            // No poster — atmospheric gradient
            <>
              <div style={{
                position: 'absolute', inset: 0,
                background: `radial-gradient(ellipse 80% 70% at 40% 30%, ${film.palette[2]}33 0%, transparent 60%), linear-gradient(160deg, ${film.palette[1]} 0%, ${film.palette[0]} 100%)`,
              }} />
              {/* Film title as watermark when no poster */}
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{
                  fontFamily: 'var(--font-playfair,"Playfair Display",serif)',
                  fontSize: 'clamp(24px,3vw,40px)', color: 'rgba(255,255,255,0.15)',
                  letterSpacing: '-0.02em', textAlign: 'center', padding: '0 1rem',
                }}>{film.title}</span>
              </div>
            </>
          )}

          {/* Status badge — bottom left of poster */}
          <div style={{
            position: 'absolute', bottom: '0.875rem', left: '0.875rem',
            fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase',
            color: sc.color, background: sc.bg,
            border: `0.5px solid ${sc.border}`,
            padding: '3px 9px', borderRadius: 1,
          }}>{film.statusLabel}</div>

          {/* Hover overlay */}
          <div className="poster-hover" style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,0,0,0)',
            transition: 'background 0.3s',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span className="poster-cta" style={{
              fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase',
              color: '#fff', background: 'var(--color-accent)',
              padding: '0.6rem 1.25rem',
              opacity: 0, transform: 'translateY(8px)',
              transition: 'opacity 0.3s, transform 0.3s',
              display: 'inline-block',
            }}>Explore Film</span>
          </div>
        </div>

        {/* Film info below poster */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: '"JetBrains Mono","Courier New",monospace', fontSize: 9, color: 'var(--color-text-tertiary)', letterSpacing: '0.08em' }}>
              {film.year}
            </span>
            <span style={{ fontSize: 9, color: 'var(--color-border-mid)' }}>·</span>
            <span style={{ fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>
              {film.language} · {film.genre}
            </span>
          </div>
          <h3 style={{
            fontFamily: 'var(--font-playfair,"Playfair Display",Georgia,serif)',
            fontSize: 'clamp(22px,2.5vw,28px)', fontWeight: 400, lineHeight: 1,
            letterSpacing: '-0.02em', color: 'var(--color-text-primary)',
            marginBottom: '0.5rem',
          }}>{film.title}</h3>
          <p style={{
            fontSize: 13, color: 'var(--color-text-tertiary)',
            fontStyle: 'italic', fontFamily: 'var(--font-playfair,serif)', lineHeight: 1.4,
          }}>&ldquo;{film.tagline}&rdquo;</p>
        </div>
      </Link>
    </motion.div>
  )
}

export default function FilmsReel() {
  const [films, setFilms] = useState<FilmWithLivePoster[]>(FEATURE_FILMS)

  useEffect(() => {
    // Fetch live poster URLs from Supabase to override static data
    fetch('/api/admin/films')
      .then(r => r.json())
      .then(d => {
        if (!d.films) return
        setFilms(FEATURE_FILMS.map(f => {
          const live = d.films.find((lf: { title: string; poster_url: string | null }) =>
            lf.title.toLowerCase() === f.title.toLowerCase()
          )
          return live ? { ...f, livePosterUrl: live.poster_url } : f
        }))
      })
      .catch(() => {}) // silently fall back to static data
  }, [])
  return (
    <section style={{
      background: '#060606',
      padding: '5rem 0 6rem',
      borderTop: '0.5px solid var(--color-border)',
      borderBottom: '0.5px solid var(--color-border)',
    }}>
      {/* Header */}
      <div style={{
        padding: '0 clamp(1.25rem,5vw,3.5rem)',
        marginBottom: '3.5rem',
        display: 'flex', alignItems: 'flex-end',
        justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem',
      }}>
        <div>
          <div style={{
            fontFamily: '"JetBrains Mono","Courier New",monospace',
            fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase',
            color: 'rgba(232,104,58,0.45)', marginBottom: '0.75rem',
          }}>SCENE 03 — THE FEATURES</div>
          <span className="text-label" style={{ display: 'block', marginBottom: '0.75rem' }}>Feature Films</span>
          <h2 className="text-display-md" style={{ color: 'var(--color-text-primary)' }}>
            Three films.{' '}
            <em style={{ color: 'var(--color-accent)', fontStyle: 'italic' }}>Story. Engineered.</em>
          </h2>
        </div>
        <Link href="/work" className="btn-ghost" style={{ fontSize: 12 }}>Full Filmography</Link>
      </div>

      {/* Poster grid — 3 equal portrait cards */}
      <div style={{
        padding: '0 clamp(1.25rem,5vw,3.5rem)',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 'clamp(1.5rem,3vw,2.5rem)',
      }}>
        {films.map((film, i) => (
          <PosterCard key={film.slug} film={film} index={i} />
        ))}
      </div>

      <style>{`
        a:hover .poster-img { transform: scale(1.04) !important; }
        a:hover .poster-hover { background: rgba(0,0,0,0.35) !important; }
        a:hover .poster-cta { opacity: 1 !important; transform: translateY(0) !important; }
        @media(max-width: 640px) {
          div[style*="repeat(3, 1fr)"] { grid-template-columns: 1fr !important; }
        }
        @media(min-width: 641px) and (max-width: 900px) {
          div[style*="repeat(3, 1fr)"] { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>
    </section>
  )
}
