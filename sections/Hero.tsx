'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import ApertureMark from '@/components/ApertureMark'

const CREDS = [
  { num: '200+', label: 'Commercials' },
  { num: '3',    label: 'Films' },
  { num: '3',    label: 'Books' },
  { num: '80+',  label: 'Brands' },
  { num: '20+',  label: 'Years' },
]

export default function Hero() {
  const markRef  = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const h1Ref    = useRef<HTMLDivElement>(null)
  const h2Ref    = useRef<HTMLDivElement>(null)
  const subRef   = useRef<HTMLParagraphElement>(null)
  const credRef  = useRef<HTMLDivElement>(null)
  const ctaRef   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    import('gsap').then(({ default: gsap }) => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.fromTo(markRef.current,  { opacity: 0, scale: 0.55 }, { opacity: 1, scale: 1, duration: 1.2 })
        .fromTo(labelRef.current, { opacity: 0, y: 14 },       { opacity: 1, y: 0, duration: 0.65 }, '-=0.55')
        .fromTo(h1Ref.current,    { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.95 }, '-=0.3')
        .fromTo(h2Ref.current,    { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.95 }, '-=0.65')
        .fromTo(subRef.current,   { opacity: 0, y: 16 },       { opacity: 1, y: 0, duration: 0.6 }, '-=0.35')
        .fromTo(credRef.current,  { opacity: 0, y: 12 },       { opacity: 1, y: 0, duration: 0.55 }, '-=0.2')
        .fromTo(ctaRef.current,   { opacity: 0, y: 12 },       { opacity: 1, y: 0, duration: 0.5 }, '-=0.15')
    })
  }, [])

  return (
    <section style={{
      minHeight: '100dvh',
      background: 'var(--color-bg)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: 'clamp(7rem, 14vh, 11rem) clamp(1.25rem, 5vw, 3.5rem) clamp(4rem, 8vh, 7rem)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Vignette */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.6) 100%)',
      }} />

      {/* Scroll indicator */}
      <div aria-hidden style={{
        position: 'absolute', bottom: '2.5rem',
        left: 'clamp(1.25rem, 5vw, 3.5rem)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
      }}>
        <style>{`@keyframes scrollPulse{0%,100%{opacity:.35;transform:scaleY(1)}50%{opacity:.8;transform:scaleY(.5)}}`}</style>
        <span style={{
          fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase',
          color: 'var(--color-text-tertiary)', writingMode: 'vertical-rl',
        }}>Scroll</span>
        <div style={{
          width: '0.5px', height: 44,
          background: 'var(--color-border-mid)',
          animation: 'scrollPulse 2.2s ease-in-out infinite',
        }} />
      </div>

      <div style={{ position: 'relative', maxWidth: 1280 }}>
        {/* Mark */}
        <div ref={markRef} style={{ marginBottom: '2.5rem', opacity: 0 }}>
          <ApertureMark size={52} animate />
        </div>

        {/* Label */}
        <div ref={labelRef} style={{ marginBottom: '1.25rem', opacity: 0 }}>
          <span className="text-label">Niddhish Puuzhakkal &nbsp;·&nbsp; Mumbai, India</span>
        </div>

        {/* Display headline */}
        <div style={{ marginBottom: '2rem', overflow: 'hidden' }}>
          <div ref={h1Ref} className="text-display" style={{ clipPath: 'inset(0 100% 0 0)' }}>
            Creativity.
          </div>
          <div ref={h2Ref} className="text-display" style={{
            clipPath: 'inset(0 100% 0 0)',
            color: 'var(--color-accent)',
            fontStyle: 'italic',
          }}>
            Applied.
          </div>
        </div>

        {/* Subtitle */}
        <p ref={subRef} style={{
          opacity: 0,
          fontSize: 16, lineHeight: 1.72,
          color: 'var(--color-text-secondary)',
          maxWidth: 520, marginBottom: '3rem',
        }}>
          Filmmaker. Psychologist. Author. Strategist. Technologist.{' '}
          <span style={{ color: 'var(--color-text-tertiary)', fontSize: 14 }}>
            One discipline applied across every surface.
          </span>
        </p>

        {/* Cred strip */}
        <div ref={credRef} style={{ opacity: 0, marginBottom: '3rem' }}>
          <div className="cred-strip">
            {CREDS.map((c) => (
              <div key={c.label} className="cred-item">
                <span className="cred-num">{c.num}</span>
                <span className="cred-label">{c.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div ref={ctaRef} style={{ opacity: 0, display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/work" className="btn-primary">
            View Work
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M1 6.5h11M6.5 1l5.5 5.5-5.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <Link href="/collaborate" className="btn-ghost">
            Start a Brief
          </Link>
        </div>
      </div>
    </section>
  )
}
