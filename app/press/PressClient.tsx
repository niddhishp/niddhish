'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

export interface PressItem {
  outlet: string
  title: string
  type: string
  year: string
  url: string
  summary: string
}

export interface PodcastItem {
  show: string
  episode: string
  host: string
  year: string
  url: string
  summary: string
}

interface ActiveItem {
  kind: 'press' | 'podcast'
  title: string
  subtitle: string
  meta: string
  summary: string
  url: string
}

export default function PressClient({
  press,
  podcasts,
}: {
  press: PressItem[]
  podcasts: PodcastItem[]
}) {
  const [active, setActive] = useState<ActiveItem | null>(null)

  const openPress = (item: PressItem) => {
    setActive({
      kind: 'press',
      title: item.title,
      subtitle: item.outlet,
      meta: `${item.type} · ${item.year}`,
      summary: item.summary,
      url: item.url,
    })
  }

  const openPodcast = (pod: PodcastItem) => {
    setActive({
      kind: 'podcast',
      title: pod.episode,
      subtitle: pod.show,
      meta: `Hosted by ${pod.host} · ${pod.year}`,
      summary: pod.summary,
      url: pod.url,
    })
  }

  const hasRealUrl = active?.url && active.url !== '#'

  return (
    <>
      {/* Press articles */}
      <div style={{ padding: '0 clamp(1.25rem,5vw,3.5rem)', marginBottom: '5rem' }}>
        <span className="text-label" style={{ display: 'block', marginBottom: '2rem' }}>Articles & Features</span>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: 1,
          background: 'var(--color-border)',
        }}>
          {press.map(item => (
            <button
              key={item.title}
              onClick={() => openPress(item)}
              style={{
                display: 'block', padding: '2rem',
                background: 'var(--color-bg)',
                border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-surface-1)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-bg)')}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-accent)' }}>
                  {item.outlet}
                </span>
                <span style={{ fontSize: 10, color: 'var(--color-text-tertiary)', letterSpacing: '0.06em' }}>
                  {item.type} · {item.year}
                </span>
              </div>
              <h3 style={{
                fontFamily: 'var(--font-playfair,serif)',
                fontSize: 16, fontWeight: 400, lineHeight: 1.4,
                color: 'var(--color-text-primary)',
                marginBottom: '0.75rem',
              }}>
                {item.title}
              </h3>
              <span style={{
                fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
                color: 'var(--color-accent)', display: 'flex', alignItems: 'center', gap: 5,
              }}>
                Read more
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path d="M1 4h6M4 1l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Podcasts */}
      <div style={{ padding: '0 clamp(1.25rem,5vw,3.5rem)', marginBottom: '5rem' }}>
        <span className="text-label" style={{ display: 'block', marginBottom: '2rem' }}>Podcast Appearances</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, borderTop: '0.5px solid var(--color-border)' }}>
          {podcasts.map(pod => (
            <button
              key={pod.episode}
              onClick={() => openPodcast(pod)}
              style={{
                display: 'grid', gridTemplateColumns: '1fr auto',
                alignItems: 'center', gap: '2rem',
                padding: '2rem 0',
                borderBottom: '0.5px solid var(--color-border)',
                background: 'none', border: 'none',
                borderBottom: '0.5px solid var(--color-border)',
                cursor: 'pointer', textAlign: 'left', width: '100%',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              <div>
                <p style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: '0.4rem' }}>
                  {pod.show} · hosted by {pod.host}
                </p>
                <h3 style={{
                  fontFamily: 'var(--font-playfair,serif)',
                  fontSize: 17, fontWeight: 400, lineHeight: 1.3,
                  color: 'var(--color-text-primary)',
                }}>
                  {pod.episode}
                </h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                <span style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>{pod.year}</span>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  border: '0.5px solid var(--color-border-mid)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(232,104,58,0.08)',
                  transition: 'background 0.2s',
                }}>
                  <svg width="10" height="12" viewBox="0 0 10 12" fill="var(--color-accent)">
                    <path d="M1 1l8 5-8 5V1z"/>
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Detail drawer overlay */}
      <AnimatePresence>
        {active && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setActive(null)}
              style={{
                position: 'fixed', inset: 0,
                background: 'rgba(0,0,0,0.72)',
                backdropFilter: 'blur(6px)',
                zIndex: 100,
                cursor: 'pointer',
              }}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
              style={{
                position: 'fixed', top: 0, right: 0, bottom: 0,
                width: 'min(520px, 94vw)',
                background: '#0e0e0e',
                borderLeft: '0.5px solid var(--color-border-mid)',
                zIndex: 101,
                display: 'flex', flexDirection: 'column',
                overflowY: 'auto',
              }}
            >
              {/* Panel header */}
              <div style={{
                padding: '2rem 2rem 1.5rem',
                borderBottom: '0.5px solid var(--color-border)',
                display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem',
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase',
                      color: 'var(--color-accent)',
                    }}>
                      {active.subtitle}
                    </span>
                    <span style={{ fontSize: 9, color: 'var(--color-text-tertiary)' }}>·</span>
                    <span style={{ fontSize: 9, letterSpacing: '0.08em', color: 'var(--color-text-tertiary)', textTransform: 'uppercase' }}>
                      {active.meta}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setActive(null)}
                  style={{
                    background: 'none', border: '0.5px solid var(--color-border)',
                    color: 'var(--color-text-tertiary)',
                    width: 32, height: 32, borderRadius: 2,
                    cursor: 'pointer', fontSize: 16, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, transition: 'border-color 0.2s',
                  }}
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              {/* Panel body */}
              <div style={{ padding: '2rem', flex: 1 }}>
                {/* Kind label */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '4px 12px',
                    border: '0.5px solid var(--color-border-mid)',
                    borderRadius: 1,
                    fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: active.kind === 'podcast' ? 'var(--color-accent)' : 'var(--color-text-tertiary)',
                  }}>
                    {active.kind === 'podcast' ? (
                      <>
                        <svg width="9" height="11" viewBox="0 0 9 11" fill="var(--color-accent)">
                          <path d="M1 1l7 4.5-7 4.5V1z"/>
                        </svg>
                        Podcast
                      </>
                    ) : (
                      <>
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M1 5h8M5 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Press
                      </>
                    )}
                  </div>
                </div>

                <h2 style={{
                  fontFamily: 'var(--font-playfair,serif)',
                  fontSize: 'clamp(20px,2.8vw,26px)',
                  fontWeight: 400, lineHeight: 1.25, letterSpacing: '-0.01em',
                  color: 'var(--color-text-primary)',
                  marginBottom: '1.5rem',
                }}>
                  {active.title}
                </h2>

                {/* Aperture divider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ height: '0.5px', flex: 1, background: 'var(--color-border)' }} />
                  <svg viewBox="0 0 20 20" width="16" height="16" style={{ opacity: 0.3 }}>
                    <circle cx="10" cy="10" r="9" stroke="var(--color-accent)" strokeWidth="0.8" fill="none"/>
                    <circle cx="10" cy="10" r="3" stroke="var(--color-accent)" strokeWidth="1" fill="none"/>
                    {[0,60,120,180,240,300].map(d => (
                      <line key={d}
                        x1={10+4*Math.cos(d*Math.PI/180)} y1={10+4*Math.sin(d*Math.PI/180)}
                        x2={10+8.5*Math.cos(d*Math.PI/180)} y2={10+8.5*Math.sin(d*Math.PI/180)}
                        stroke="var(--color-accent)" strokeWidth="0.8"/>
                    ))}
                  </svg>
                  <div style={{ height: '0.5px', flex: 1, background: 'var(--color-border)' }} />
                </div>

                <p style={{
                  fontSize: 15, lineHeight: 1.8,
                  color: 'var(--color-text-secondary)',
                  marginBottom: '2.5rem',
                }}>
                  {active.summary}
                </p>

                {/* Action */}
                {hasRealUrl ? (
                  <a
                    href={active.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    {active.kind === 'podcast' ? 'Listen to Episode' : 'Read Full Article'}
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                      <path d="M1 6.5h11M6.5 1l5.5 5.5-5.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                ) : (
                  <div style={{
                    padding: '1rem 1.25rem',
                    border: '0.5px solid var(--color-border)',
                    background: 'var(--color-surface-1)',
                    borderRadius: 2,
                  }}>
                    <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', lineHeight: 1.6 }}>
                      External link will be added once published.
                      Contact <a href="mailto:niddhish@lightseekermedia.com" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>niddhish@lightseekermedia.com</a> for media enquiries.
                    </p>
                  </div>
                )}
              </div>

              {/* Letterbox bottom bar */}
              <div style={{ height: 4, background: 'linear-gradient(90deg, var(--color-accent) 0%, rgba(232,104,58,0.3) 100%)' }} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
