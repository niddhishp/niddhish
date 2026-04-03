'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

interface Film {
  title: string
  year: string
  genre: string
  tagline: string
  cast: string
  status: 'release' | 'post' | 'production'
  statusLabel: string
  // Atmospheric gradient palette — no real poster images needed
  palette: [string, string, string]
  vimeoId?: string
}

const FILMS: Film[] = [
  {
    title: 'EGO',
    year: '2024',
    genre: 'Feature Film · Hindi · Drama-Comedy',
    tagline: 'Some fights are with the world. Some are with yourself.',
    cast: 'Arshad Warsi · Juhi Chawla · Divya Dutta · Gauhar Khan',
    status: 'release',
    statusLabel: 'Preparing for Release',
    palette: ['#1a0a05', '#3d1408', '#c44a1e'],
  },
  {
    title: 'Palkon Pe',
    year: '2024',
    genre: 'Feature Film · Hindi',
    tagline: 'A story carried on the edges of sight.',
    cast: 'Completing Post-Production',
    status: 'post',
    statusLabel: 'In Post-Production',
    palette: ['#050a1a', '#0a1a35', '#1a3a6e'],
  },
  {
    title: 'Canvas',
    year: '2025',
    genre: 'Feature Film',
    tagline: 'Every life is a work in progress.',
    cast: 'In Development',
    status: 'production',
    statusLabel: 'In Production',
    palette: ['#0a0a08', '#1a1a10', '#4a4a2a'],
  },
]

const STATUS_COLORS = {
  release:    { bg: 'rgba(232,104,58,0.18)', border: 'rgba(232,104,58,0.7)', text: '#e8683a' },
  post:       { bg: 'rgba(100,140,220,0.15)', border: 'rgba(100,140,220,0.5)', text: '#84a8e8' },
  production: { bg: 'rgba(180,180,100,0.12)', border: 'rgba(180,180,100,0.4)', text: '#c8c870' },
}

function FilmCard({ film, index }: { film: Film; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [30, -30])
  const sc = STATUS_COLORS[film.status]
  const isHero = index === 0

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.85, ease: EASE, delay: index * 0.12 }}
      style={{
        position: 'relative',
        overflow: 'hidden',
        aspectRatio: isHero ? '16/9' : '9/13',
        background: '#0a0a0a',
        cursor: 'default',
      }}
    >
      {/* Atmospheric gradient background */}
      <motion.div style={{ position: 'absolute', inset: 0, y }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: `
            radial-gradient(ellipse 80% 70% at 30% 40%, ${film.palette[2]}44 0%, transparent 60%),
            radial-gradient(ellipse 60% 80% at 80% 70%, ${film.palette[1]}33 0%, transparent 55%),
            linear-gradient(160deg, ${film.palette[1]} 0%, ${film.palette[0]} 100%)
          `,
        }} />
        {/* Film grain texture overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: '128px 128px',
          opacity: 0.04, mixBlendMode: 'overlay',
        }} />
        {/* Vignette */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.65) 100%)',
        }} />
      </motion.div>

      {/* Aperture mark watermark */}
      <svg aria-hidden viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"
        style={{
          position: 'absolute', bottom: isHero ? '-5%' : '-10%', right: '-5%',
          width: isHero ? '35%' : '60%', height: 'auto',
          opacity: 0.04, pointerEvents: 'none',
        }}>
        <circle cx="50" cy="50" r="46" stroke="#fff" strokeWidth="0.6" fill="none"/>
        <circle cx="50" cy="50" r="12" stroke="#fff" strokeWidth="0.8" fill="none"/>
        {[0, 60, 120, 180, 240, 300].map(deg => (
          <line key={deg}
            x1={50 + 14 * Math.cos(deg * Math.PI / 180)} y1={50 + 14 * Math.sin(deg * Math.PI / 180)}
            x2={50 + 44 * Math.cos(deg * Math.PI / 180)} y2={50 + 44 * Math.sin(deg * Math.PI / 180)}
            stroke="#fff" strokeWidth="0.8"/>
        ))}
      </svg>

      {/* Content */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        justifyContent: isHero ? 'flex-end' : 'flex-end',
        padding: isHero ? '3rem' : '2rem',
      }}>
        {/* Top: status + year */}
        <div style={{
          position: 'absolute', top: isHero ? '2rem' : '1.5rem',
          left: isHero ? '3rem' : '2rem',
          display: 'flex', alignItems: 'center', gap: '1rem',
        }}>
          <span style={{
            fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase',
            color: sc.text, background: sc.bg,
            border: `0.5px solid ${sc.border}`,
            padding: '3px 10px', borderRadius: 1,
          }}>{film.statusLabel}</span>
          <span style={{
            fontFamily: '"JetBrains Mono","Courier New",monospace',
            fontSize: 9, color: 'rgba(240,237,232,0.3)', letterSpacing: '0.08em',
          }}>{film.year}</span>
        </div>

        {/* Bottom: film info */}
        <div>
          <p style={{
            fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'rgba(240,237,232,0.45)', marginBottom: isHero ? '0.75rem' : '0.5rem',
          }}>{film.genre}</p>

          <h3 style={{
            fontFamily: 'var(--font-playfair,"Playfair Display",Georgia,serif)',
            fontSize: isHero ? 'clamp(48px,6vw,88px)' : 'clamp(36px,3.5vw,52px)',
            fontWeight: 400, lineHeight: 0.9, letterSpacing: '-0.03em',
            color: '#fff', marginBottom: isHero ? '1rem' : '0.75rem',
          }}>{film.title}</h3>

          <p style={{
            fontSize: isHero ? 15 : 13,
            color: 'rgba(240,237,232,0.55)',
            fontStyle: 'italic',
            fontFamily: 'var(--font-playfair,"Playfair Display",serif)',
            lineHeight: 1.4,
            marginBottom: isHero ? '1.25rem' : '1rem',
            maxWidth: isHero ? 480 : '100%',
          }}>&ldquo;{film.tagline}&rdquo;</p>

          <p style={{
            fontSize: 12, letterSpacing: '0.04em',
            color: 'rgba(240,237,232,0.35)',
            lineHeight: 1.5,
          }}>{film.cast}</p>

          {isHero && film.status === 'release' && (
            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
              <Link href="/work" className="btn-primary">
                Discover EGO
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M1 6.5h11M6.5 1l5.5 5.5-5.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Hover shimmer */}
      <div className="film-card-shimmer" style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.03) 50%, transparent 70%)',
        opacity: 0, transition: 'opacity 0.4s',
        pointerEvents: 'none',
      }} />

      <style>{`.film-card-shimmer:hover { opacity: 1 !important; }`}</style>
    </motion.div>
  )
}

export default function FilmsReel() {
  return (
    <section style={{
      background: '#060606',
      padding: '5rem 0',
      borderTop: '0.5px solid var(--color-border)',
      borderBottom: '0.5px solid var(--color-border)',
    }}>
      {/* Section header */}
      <div style={{
        padding: '0 clamp(1.25rem,5vw,3.5rem)',
        marginBottom: '2.5rem',
        display: 'flex', alignItems: 'flex-end',
        justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem',
      }}>
        <div>
          <div style={{
            fontFamily: '"JetBrains Mono","Courier New",monospace',
            fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase',
            color: 'rgba(232,104,58,0.45)', marginBottom: '0.75rem',
          }}>
            SCENE 03 — THE FEATURES
          </div>
          <span className="text-label" style={{ display: 'block', marginBottom: '0.75rem' }}>
            Feature Films
          </span>
          <h2 className="text-display-md" style={{ color: 'var(--color-text-primary)' }}>
            Three films.{' '}
            <em style={{ color: 'var(--color-accent)', fontStyle: 'italic' }}>Story. Engineered.</em>
          </h2>
        </div>
        <Link href="/work" className="btn-ghost">
          Full Filmography
        </Link>
      </div>

      {/* Films layout: hero (EGO) full width top, then Palkon Pe + Canvas side by side */}
      <div style={{ padding: '0 clamp(1.25rem,5vw,3.5rem)', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* EGO — full width hero card */}
        <FilmCard film={FILMS[0]} index={0} />

        {/* Palkon Pe + Canvas — side by side */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <FilmCard film={FILMS[1]} index={1} />
          <FilmCard film={FILMS[2]} index={2} />
        </div>
      </div>

      <style>{`
        @media(max-width:768px){
          section > div:last-of-type > div:last-of-type {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}
