'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import ApertureMark from '@/components/ApertureMark'

const CREDS = [
  { num: '200+', label: 'Commercials' },
  { num: '3',    label: 'Films' },
  { num: '3',    label: 'Books' },
  { num: '80+',  label: 'Brands' },
  { num: '20+',  label: 'Years' },
]

const ROLES = ['Filmmaker', 'Psychologist', 'Author', 'Strategist', 'Technologist']

export default function Hero() {
  const [roleIdx, setRoleIdx] = useState(0)
  const [mounted, setMounted] = useState(false)
  const bgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const id = setInterval(() => setRoleIdx(i => (i + 1) % ROLES.length), 2400)
    return () => clearInterval(id)
  }, [])

  // Mouse parallax on background
  useEffect(() => {
    const bg = bgRef.current
    if (!bg) return
    let raf: number
    let mx = 0.5, my = 0.5
    let cx = 0.5, cy = 0.5

    const onMove = (e: MouseEvent) => {
      mx = e.clientX / window.innerWidth
      my = e.clientY / window.innerHeight
    }
    const tick = () => {
      cx += (mx - cx) * 0.06
      cy += (my - cy) * 0.06
      bg.style.transform = `translate(${(cx - 0.5) * -20}px, ${(cy - 0.5) * -14}px) scale(1.05)`
      raf = requestAnimationFrame(tick)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    raf = requestAnimationFrame(tick)
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf) }
  }, [])

  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: 'var(--color-bg)',
      }}
    >
      {/* Atmospheric background layer */}
      <div
        ref={bgRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '-5%',
          pointerEvents: 'none',
          transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {/* Warm radial glow */}
        <div style={{
          position: 'absolute', inset: 0,
          background: [
            'radial-gradient(ellipse 70% 55% at 50% 45%, rgba(216,90,48,0.07) 0%, transparent 55%)',
            'radial-gradient(ellipse 40% 50% at 15% 85%, rgba(216,90,48,0.04) 0%, transparent 45%)',
            'radial-gradient(ellipse 40% 50% at 85% 15%, rgba(216,90,48,0.03) 0%, transparent 45%)',
          ].join(','),
        }} />
        {/* Subtle grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: [
            'linear-gradient(rgba(240,237,232,0.025) 1px, transparent 1px)',
            'linear-gradient(90deg, rgba(240,237,232,0.025) 1px, transparent 1px)',
          ].join(','),
          backgroundSize: '88px 88px',
          maskImage: 'radial-gradient(ellipse 75% 75% at 50% 50%, black 15%, transparent 75%)',
        }} />
        {/* Vignette */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 25%, rgba(0,0,0,0.7) 100%)',
        }} />
      </div>

      {/* Corner brackets */}
      {['tl','br'].map(pos => (
        <div key={pos} aria-hidden="true" style={{
          position: 'absolute',
          width: 36, height: 36,
          pointerEvents: 'none',
          opacity: 0.2,
          ...(pos === 'tl'
            ? { top: '2rem', left: '2rem', borderTop: '0.5px solid var(--color-text-secondary)', borderLeft: '0.5px solid var(--color-text-secondary)' }
            : { bottom: '2rem', right: '2rem', borderBottom: '0.5px solid var(--color-text-secondary)', borderRight: '0.5px solid var(--color-text-secondary)' }
          ),
        }} />
      ))}

      {/* Main content */}
      <div style={{
        position: 'relative', zIndex: 1,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', textAlign: 'center',
        padding: 'clamp(9rem, 18vh, 13rem) clamp(1rem, 5vw, 4rem) clamp(5rem, 10vh, 8rem)',
        width: '100%', maxWidth: 1440,
      }}>

        {/* Aperture mark + label */}
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 14, marginBottom: '3rem',
            opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(20px)',
            transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s',
          }}
        >
          <ApertureMark size={32} animate />
          <span style={{
            fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase',
            color: 'var(--color-text-tertiary)',
          }}>
            Light Seeker Films &nbsp;·&nbsp; Mumbai, India
          </span>
        </div>

        {/* THE Headline — massive, dramatic */}
        <div style={{ marginBottom: '2rem', overflow: 'hidden' }}>
          <div style={{ overflow: 'hidden', lineHeight: 0.9 }}>
            <h1
              style={{
                fontFamily: 'var(--font-playfair, "Playfair Display", serif)',
                fontSize: 'clamp(68px, 16vw, 210px)',
                fontWeight: 400,
                lineHeight: 0.9,
                letterSpacing: '-0.04em',
                color: 'var(--color-text-primary)',
                margin: 0,
                display: 'block',
                transform: mounted ? 'translateY(0)' : 'translateY(105%)',
                opacity: mounted ? 1 : 0,
                transition: 'transform 0.95s cubic-bezier(0.16,1,0.3,1) 0.3s, opacity 0.95s cubic-bezier(0.16,1,0.3,1) 0.3s',
              }}
            >
              Creativity.
            </h1>
          </div>
          <div style={{ overflow: 'hidden', lineHeight: 0.9 }}>
            <h2
              style={{
                fontFamily: 'var(--font-playfair, "Playfair Display", serif)',
                fontSize: 'clamp(68px, 16vw, 210px)',
                fontWeight: 400,
                fontStyle: 'italic',
                lineHeight: 0.9,
                letterSpacing: '-0.04em',
                color: 'var(--color-accent)',
                margin: 0,
                display: 'block',
                transform: mounted ? 'translateY(0)' : 'translateY(105%)',
                opacity: mounted ? 1 : 0,
                transition: 'transform 0.95s cubic-bezier(0.16,1,0.3,1) 0.48s, opacity 0.95s cubic-bezier(0.16,1,0.3,1) 0.48s',
              }}
            >
              Applied.
            </h2>
          </div>
        </div>

        {/* Cycling role */}
        <div style={{
          height: 22, overflow: 'hidden', marginBottom: '3rem', position: 'relative', width: '100%',
          opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(16px)',
          transition: 'all 0.7s cubic-bezier(0.16,1,0.3,1) 0.65s',
        }}>
          {ROLES.map((role, i) => (
            <span key={role} style={{
              position: 'absolute', left: '50%',
              fontSize: 12, fontWeight: 400, letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'var(--color-text-secondary)',
              transform: i === roleIdx
                ? 'translateX(-50%) translateY(0)'
                : 'translateX(-50%) translateY(28px)',
              opacity: i === roleIdx ? 1 : 0,
              transition: 'all 0.55s cubic-bezier(0.16,1,0.3,1)',
              whiteSpace: 'nowrap',
            }}>
              {role}
            </span>
          ))}
        </div>

        {/* Credential strip */}
        <div style={{
          marginBottom: '3rem',
          opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(16px)',
          transition: 'all 0.7s cubic-bezier(0.16,1,0.3,1) 0.78s',
        }}>
          <div className="cred-strip">
            {CREDS.map(c => (
              <div key={c.label} className="cred-item">
                <span className="cred-num">{c.num}</span>
                <span className="cred-label">{c.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div style={{
          display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center',
          opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(16px)',
          transition: 'all 0.7s cubic-bezier(0.16,1,0.3,1) 0.9s',
        }}>
          <Link href="/work" className="btn-primary">
            View Work
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M1 6.5h11M6.5 1l5.5 5.5-5.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <Link href="/collaborate" className="btn-ghost">Start a Brief</Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute', bottom: '2.5rem', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        opacity: mounted ? 0.6 : 0, transition: 'opacity 0.7s 1.2s',
      }} aria-hidden="true">
        <div style={{
          width: '0.5px', height: 44,
          background: 'var(--color-border-mid)',
          animation: 'scrollPulse 2.2s ease-in-out infinite',
        }} />
        <span style={{
          fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase',
          color: 'var(--color-text-tertiary)',
        }}>Scroll</span>
      </div>

      <style>{`
        @keyframes scrollPulse {
          0%,100%{transform:scaleY(1);opacity:.4}
          50%{transform:scaleY(.45);opacity:.9}
        }
      `}</style>
    </section>
  )
}
