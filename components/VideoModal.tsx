'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface VideoModalProps {
  videoId: string | null
  source?: 'vimeo' | 'youtube'
  title: string
  brand?: string
  type?: string
  onClose: () => void
}

export default function VideoModal({ videoId, source = 'vimeo', title, brand, type, onClose }: VideoModalProps) {
  // Lock scroll
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  // Escape key
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  const embedUrl = !videoId ? '' : source === 'youtube'
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`
    : `https://player.vimeo.com/video/${videoId}?autoplay=1&title=0&byline=0&portrait=0&color=e8683a&dnt=1&app_id=122963`

  const externalUrl = !videoId ? '' : source === 'youtube'
    ? `https://www.youtube.com/watch?v=${videoId}`
    : `https://vimeo.com/${videoId}`

  return (
    <AnimatePresence>
      <motion.div
        key="video-modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 9500,
          background: 'rgba(0,0,0,0.97)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        {/* Cinematic letterbox bars */}
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: 'clamp(40px, 6vh, 72px)' }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            background: '#000', zIndex: 1,
          }}
        />
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: 'clamp(40px, 6vh, 72px)' }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: '#000', zIndex: 1,
          }}
        />

        {/* Header info row */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          style={{
            position: 'absolute', top: 'clamp(12px, 2vh, 24px)', left: '2rem',
            display: 'flex', alignItems: 'center', gap: 16, zIndex: 2,
          }}
        >
          <span style={{
            fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
            color: 'var(--color-accent)',
          }}>
            {brand}
          </span>
          <span style={{ color: 'rgba(240,237,232,0.2)', fontSize: 10 }}>·</span>
          <span style={{
            fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'rgba(240,237,232,0.4)',
          }}>
            {type}
          </span>
        </motion.div>

        {/* Close button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          onClick={onClose}
          style={{
            position: 'absolute', top: 'clamp(12px, 2vh, 24px)', right: '2rem',
            background: 'none', border: '0.5px solid rgba(240,237,232,0.15)',
            borderRadius: 2, cursor: 'pointer',
            color: 'rgba(240,237,232,0.55)',
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '6px 12px',
            fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase',
            transition: 'border-color 0.2s, color 0.2s',
            zIndex: 2,
          }}
          onMouseEnter={e => {
            const el = e.currentTarget
            el.style.borderColor = 'rgba(240,237,232,0.4)'
            el.style.color = 'rgba(240,237,232,0.9)'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget
            el.style.borderColor = 'rgba(240,237,232,0.15)'
            el.style.color = 'rgba(240,237,232,0.55)'
          }}
        >
          Close
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </motion.button>

        {/* Video frame */}
        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          onClick={e => e.stopPropagation()}
          style={{
            width: 'min(90vw, 1200px)',
            aspectRatio: '16/9',
            background: '#000',
            position: 'relative',
            cursor: 'default',
            zIndex: 0,
          }}
        >
          <iframe
            src={embedUrl}
            style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            title={title}
          />
          {/* Frame corners */}
          {['tl','tr','bl','br'].map(c => (
            <div key={c} aria-hidden style={{
              position: 'absolute',
              width: 12, height: 12,
              ...(c.startsWith('t') ? { top: -1 } : { bottom: -1 }),
              ...(c.endsWith('l') ? { left: -1 } : { right: -1 }),
              borderTop: c.startsWith('t') ? '1px solid rgba(216,90,48,0.4)' : 'none',
              borderBottom: c.startsWith('b') ? '1px solid rgba(216,90,48,0.4)' : 'none',
              borderLeft: c.endsWith('l') ? '1px solid rgba(216,90,48,0.4)' : 'none',
              borderRight: c.endsWith('r') ? '1px solid rgba(216,90,48,0.4)' : 'none',
            }} />
          ))}
        </motion.div>

        {/* Open external fallback — if video doesn't play due to Vimeo embed settings */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '1rem' }}
        >
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(240,237,232,0.45)', textDecoration: 'none', transition: 'color 0.2s' }}
          >
            Open on {source === 'youtube' ? 'YouTube' : 'Vimeo'} ↗
          </a>
          {source === 'vimeo' && (
            <span style={{ fontSize: 10, color: 'rgba(240,237,232,0.25)', letterSpacing: '0.04em' }}>
              If video doesn&apos;t load: Vimeo → Settings → Embed → Anywhere
            </span>
          )}
        </motion.div>

        {/* Film title below */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          style={{
            position: 'absolute', bottom: 'clamp(12px, 2vh, 24px)',
            left: '50%', transform: 'translateX(-50%)',
            fontFamily: 'var(--font-playfair, serif)',
            fontSize: 14, fontWeight: 400,
            color: 'rgba(240,237,232,0.7)',
            letterSpacing: '0.01em',
            textAlign: 'center', whiteSpace: 'nowrap',
            zIndex: 2,
          }}
        >
          {title}
        </motion.p>

        {/* Fallback link in case video is private */}
        <motion.a
          href={videoId ? (source === 'youtube' ? `https://youtube.com/watch?v=${videoId}` : `https://vimeo.com/${videoId}`) : '#'}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 3 }}
          onClick={e => e.stopPropagation()}
          style={{
            position: 'absolute', bottom: 'clamp(12px, 2vh, 24px)', right: '2rem',
            fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'rgba(240,237,232,0.4)', textDecoration: 'none',
            transition: 'opacity 0.2s', zIndex: 2,
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '0.4')}
        >
          Open on Vimeo ↗
        </motion.a>
      </motion.div>
    </AnimatePresence>
  )
}
