'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { FEATURE_FILMS } from '@/lib/videos'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

const STATUS_COLORS = {
  release:    { bg: 'rgba(232,104,58,0.18)', border: 'rgba(232,104,58,0.7)', text: '#e8683a' },
  post:       { bg: 'rgba(100,140,220,0.15)', border: 'rgba(100,140,220,0.5)', text: '#84a8e8' },
  production: { bg: 'rgba(180,180,100,0.12)', border: 'rgba(180,180,100,0.4)', text: '#c8c870' },
}

type Film = typeof FEATURE_FILMS[number]

function FilmCard({ film, index }: { film: Film; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [20, -20])
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
        position: 'relative', overflow: 'hidden',
        aspectRatio: isHero ? '16/9' : '9/13',
        background: '#0a0a0a',
      }}
    >
      {/* Actual poster image or atmospheric gradient fallback */}
      {film.posterUrl ? (
        <>
          <motion.div style={{ position: 'absolute', inset: '-5%', y }}>
            <Image
              src={film.posterUrl}
              alt={`${film.title} poster`}
              fill
              sizes={isHero ? '100vw' : '50vw'}
              style={{
                objectFit: 'cover',
                objectPosition: isHero ? 'center 20%' : 'center top',
              }}
              priority={index === 0}
              unoptimized
            />
          </motion.div>
          {/* Gradient overlay for text readability */}
          <div style={{
            position: 'absolute', inset: 0,
            background: isHero
              ? 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.2) 100%)'
              : 'linear-gradient(to top, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.15) 100%)',
          }} />
        </>
      ) : (
        /* No poster — atmospheric gradient */
        <motion.div style={{ position: 'absolute', inset: '-5%', y }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: `
              radial-gradient(ellipse 80% 70% at 30% 40%, ${film.palette[2]}44 0%, transparent 60%),
              radial-gradient(ellipse 60% 80% at 80% 70%, ${film.palette[1]}33 0%, transparent 55%),
              linear-gradient(160deg, ${film.palette[1]} 0%, ${film.palette[0]} 100%)
            `,
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.65) 100%)',
          }} />
        </motion.div>
      )}

      {/* Aperture watermark */}
      <svg aria-hidden viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"
        style={{
          position: 'absolute', bottom: isHero ? '-5%' : '-8%', right: '-3%',
          width: isHero ? '28%' : '55%', height: 'auto',
          opacity: 0.05, pointerEvents: 'none',
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

      {/* Status + year badge */}
      <div style={{
        position: 'absolute', top: isHero ? '2rem' : '1.25rem',
        left: isHero ? '3rem' : '1.5rem',
        display: 'flex', alignItems: 'center', gap: '0.75rem',
      }}>
        <span style={{
          fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase',
          color: sc.text, background: sc.bg,
          border: `0.5px solid ${sc.border}`,
          padding: '3px 10px', borderRadius: 1,
        }}>{film.statusLabel}</span>
        <span style={{
          fontFamily: '"JetBrains Mono","Courier New",monospace',
          fontSize: 9, color: 'rgba(240,237,232,0.35)', letterSpacing: '0.08em',
        }}>{film.year}</span>
      </div>

      {/* Film info */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        padding: isHero ? '3rem' : '1.5rem',
      }}>
        <p style={{
          fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
          color: 'rgba(240,237,232,0.5)', marginBottom: isHero ? '0.75rem' : '0.5rem',
        }}>{film.genre}</p>

        <h3 style={{
          fontFamily: 'var(--font-playfair,"Playfair Display",Georgia,serif)',
          fontSize: isHero ? 'clamp(48px,6vw,88px)' : 'clamp(32px,3vw,48px)',
          fontWeight: 400, lineHeight: 0.9, letterSpacing: '-0.03em',
          color: '#fff', marginBottom: isHero ? '1rem' : '0.75rem',
        }}>{film.title}</h3>

        <p style={{
          fontSize: isHero ? 15 : 13,
          color: 'rgba(240,237,232,0.6)',
          fontStyle: 'italic',
          fontFamily: 'var(--font-playfair,"Playfair Display",serif)',
          lineHeight: 1.4, marginBottom: isHero ? '1.25rem' : '0.75rem',
          maxWidth: isHero ? 480 : '100%',
        }}>&ldquo;{film.tagline}&rdquo;</p>

        <p style={{
          fontSize: 12, letterSpacing: '0.04em',
          color: 'rgba(240,237,232,0.4)', lineHeight: 1.5,
        }}>{film.cast}</p>

        {isHero && film.status === 'release' && (
          <div style={{ marginTop: '2rem' }}>
            <Link href="/work" className="btn-primary">
              Discover EGO
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M1 6.5h11M6.5 1l5.5 5.5-5.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        )}
      </div>
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
          }}>SCENE 03 — THE FEATURES</div>
          <span className="text-label" style={{ display: 'block', marginBottom: '0.75rem' }}>Feature Films</span>
          <h2 className="text-display-md" style={{ color: 'var(--color-text-primary)' }}>
            Three films.{' '}
            <em style={{ color: 'var(--color-accent)', fontStyle: 'italic' }}>Story. Engineered.</em>
          </h2>
        </div>
        <Link href="/work" className="btn-ghost">Full Filmography</Link>
      </div>

      <div style={{ padding: '0 clamp(1.25rem,5vw,3.5rem)', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FilmCard film={FEATURE_FILMS[0]} index={0} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <FilmCard film={FEATURE_FILMS[1]} index={1} />
          <FilmCard film={FEATURE_FILMS[2]} index={2} />
        </div>
      </div>

      <style>{`@media(max-width:768px){ section > div:last-of-type > div:last-of-type { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  )
}
