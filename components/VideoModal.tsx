'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { parseVideoUrl } from '@/lib/videoUtils'

interface VideoModalProps {
  videoUrl: string        // Full URL e.g. https://vimeo.com/1141351129?fl=tl&fe=ec
  title: string
  brand?: string
  onClose: () => void
  // Legacy compat
  videoId?: string | null
  source?: 'vimeo' | 'youtube'
}

export default function VideoModal({ videoUrl, videoId, source = 'vimeo', title, brand, onClose }: VideoModalProps) {
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  // Prefer full videoUrl, fall back to legacy videoId + source
  const resolvedUrl = videoUrl || (videoId
    ? (source === 'youtube' ? `https://www.youtube.com/watch?v=${videoId}` : `https://vimeo.com/${videoId}`)
    : '')

  const videoInfo = parseVideoUrl(resolvedUrl)
  const embedUrl = videoInfo?.embedUrl || ''
  const externalUrl = resolvedUrl

  const EASE = [0.16, 1, 0.3, 1] as const

  return (
    <AnimatePresence>
      <motion.div
        key="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(6,6,6,0.96)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem',
        }}
      >
        <motion.div
          key="modal-content"
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.4, ease: EASE }}
          onClick={e => e.stopPropagation()}
          style={{ width: '100%', maxWidth: 1100, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          {/* Close */}
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              alignSelf: 'flex-end', marginBottom: '0.75rem',
              background: 'none', border: 'none', color: 'rgba(240,237,232,0.4)',
              cursor: 'pointer', fontSize: 12, letterSpacing: '0.14em',
              textTransform: 'uppercase', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', gap: 6,
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(240,237,232,0.4)')}
          >
            ESC
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>

          {/* Video wrapper */}
          <div style={{ width: '100%', aspectRatio: '16/9', background: '#000', position: 'relative' }}>
            {embedUrl ? (
              <iframe
                src={embedUrl}
                style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title={title}
              />
            ) : (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: 'rgba(240,237,232,0.3)', fontSize: 13, fontFamily: 'inherit' }}>No video URL</p>
              </div>
            )}
            {/* Film corners */}
            {(['tl','tr','bl','br'] as const).map(c => (
              <div key={c} aria-hidden style={{
                position: 'absolute', width: 12, height: 12,
                ...(c.startsWith('t') ? { top: -1 } : { bottom: -1 }),
                ...(c.endsWith('l') ? { left: -1 } : { right: -1 }),
                borderTop: c.startsWith('t') ? '1px solid rgba(232,104,58,0.35)' : 'none',
                borderBottom: c.startsWith('b') ? '1px solid rgba(232,104,58,0.35)' : 'none',
                borderLeft: c.endsWith('l') ? '1px solid rgba(232,104,58,0.35)' : 'none',
                borderRight: c.endsWith('r') ? '1px solid rgba(232,104,58,0.35)' : 'none',
              }}/>
            ))}
          </div>

          {/* Meta + external link */}
          <div style={{ width: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginTop: '0.875rem', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              {brand && <p style={{ fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '0.25rem' }}>{brand}</p>}
              <p style={{ fontFamily: 'var(--font-playfair,serif)', fontSize: 18, color: 'var(--color-text-primary)', letterSpacing: '-0.01em' }}>{title}</p>
            </div>
            {externalUrl && (
              <a
                href={externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(240,237,232,0.35)', textDecoration: 'none', whiteSpace: 'nowrap', marginTop: '0.25rem', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(240,237,232,0.7)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(240,237,232,0.35)')}
              >
                Open on {videoInfo?.provider === 'youtube' ? 'YouTube' : 'Vimeo'} ↗
              </a>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
