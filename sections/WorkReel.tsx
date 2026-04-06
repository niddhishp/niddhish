'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Variants } from 'framer-motion'
import { motion } from 'framer-motion'
import VideoModal from '@/components/VideoModal'
import { parseVideoUrl } from '@/lib/videoUtils'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]
const RAILWAY_API = 'https://lightseeker-films-production.up.railway.app'

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  show:   (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.75, ease: EASE as [number, number, number, number], delay: i * 0.06 },
  }),
}

const BRANDS = [
  'Nike', 'Harley Davidson', 'Maruti Suzuki', 'Adidas', 'Uber', 'Toyota', 'Ford',
  'Levis', 'Tanishq', 'Bandhan', 'Pfizer', 'LG', 'Zomato', 'Mastercard',
  'Big Basket', 'Skoda', 'Times of India', 'One Card', 'Housing.com', 'Kinetic Green',
  'Beardo', 'Vinsmera', 'Just Younger',
]

interface RailwayVideo {
  id: string; title: string; client: string; category: string
  duration: string; thumbnail: string; video_url: string; is_featured: boolean; sort_order: number
}

function getThumb(v: RailwayVideo, overrides: Record<string, string>): string {
  const info = parseVideoUrl(v.video_url)
  const id = info?.id || ''
  // Priority: Supabase override > Railway thumbnail > YouTube auto
  if (overrides[id]) return overrides[id]
  if (v.thumbnail) return v.thumbnail
  if (info?.provider === 'youtube') return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`
  return '' // Vimeo — needs override
}

export default function WorkReel() {
  const [active, setActive] = useState<{ videoUrl: string; title: string; brand: string } | null>(null)
  const [sectionLabel, setSectionLabel] = useState('SCENE 02 — THE REEL')
  const [heading, setHeading] = useState('200+ commercials.')
  const [accent, setAccent] = useState('A selection.')
  const [featured, setFeatured] = useState<RailwayVideo[]>([])
  const [thumbOverrides, setThumbOverrides] = useState<Record<string, string>>({})

  useEffect(() => {
    fetch('/api/content').then(r => r.json()).then(d => {
      if (d.section_reel_label)   setSectionLabel(d.section_reel_label)
      if (d.section_reel_heading) setHeading(d.section_reel_heading)
      if (d.section_reel_accent)  setAccent(d.section_reel_accent)
    }).catch(() => {})

    fetch(`${RAILWAY_API}/api/projects?is_active=true`)
      .then(r => r.json())
      .then((data: RailwayVideo[]) => {
        if (!data?.length) return
        const feat = data
          .filter(v => v.is_featured)
          .sort((a, b) => (a.sort_order ?? 99) - (b.sort_order ?? 99))
          .slice(0, 12)
        if (feat.length < 12) {
          const nonFeat = data.filter(v => !v.is_featured).slice(0, 12 - feat.length)
          setFeatured([...feat, ...nonFeat])
        } else {
          setFeatured(feat)
        }
      })
      .catch(() => {})

    // Supabase thumbnail overrides
    fetch('/api/admin/videos')
      .then(r => r.json())
      .then(d => {
        if (!d.videos?.length) return
        const overrides: Record<string, string> = {}
        d.videos.forEach((v: { video_id: string; thumbnail_url?: string }) => {
          if (v.thumbnail_url) overrides[v.video_id] = v.thumbnail_url
        })
        setThumbOverrides(overrides)
      })
      .catch(() => {})
  }, [])

  return (
    <section style={{ background: 'var(--color-bg)', borderTop: '0.5px solid var(--color-border)' }}>
      {/* Section header */}
      <div style={{ padding: '4rem clamp(1.25rem,5vw,3.5rem) 2rem', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <div style={{
            fontFamily: '"JetBrains Mono","Courier New",monospace',
            fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase',
            color: 'rgba(232,104,58,0.45)', marginBottom: '0.75rem',
          }}>{ sectionLabel }</div>
          <span className="text-label" style={{ display: 'block', marginBottom: '0.75rem' }}>Brand Films</span>
          <h2 className="text-display-md" style={{ color: 'var(--color-text-primary)' }}>
            { heading }{' '}
            <em style={{ color: 'var(--color-accent)' }}>{ accent }</em>
          </h2>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginBottom: '0.5rem' }}>
            Automobile · Fashion · Narrative · Humour · Offbeat · AI
          </p>
        </div>
      </div>

      {/* Film grid */}
      <div style={{ padding: '0 clamp(1.25rem,5vw,3.5rem)', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
        {featured.map((video, i) => (
          <motion.button
            key={video.id}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            onClick={() => setActive({ videoUrl: video.video_url, title: video.title, brand: video.client })}
            style={{
              position: 'relative', aspectRatio: '16/9',
              background: '#111', overflow: 'hidden',
              border: 'none', cursor: 'pointer', padding: 0,
              display: 'block',
            }}
            data-film-card
          >
            <Image
              src={getThumb(video, thumbOverrides)}
              alt={video.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              style={{ objectFit: 'cover', transition: 'transform 0.6s ease' }}
              unoptimized
            />
            {/* Hover overlay */}
            <div className="film-overlay" style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.2) 55%, transparent 100%)',
              opacity: 0, transition: 'opacity 0.35s',
              display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
              padding: '1.25rem',
            }}>
              <span style={{ fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '0.3rem' }}>
                {video.client}
              </span>
              <span style={{ fontSize: 13, color: '#fff', lineHeight: 1.3, fontFamily: 'var(--font-playfair,serif)', fontWeight: 400, textAlign: 'left' }}>
                {video.title}
              </span>
              <span style={{ fontSize: 10, color: 'rgba(240,237,232,0.5)', marginTop: '0.3rem', letterSpacing: '0.06em' }}>
                {video.duration} · {video.category}
              </span>
            </div>
            {/* Play button */}
            <div className="play-btn" style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%,-50%) scale(0.7)',
              width: 44, height: 44, borderRadius: '50%',
              background: 'rgba(232,104,58,0.9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: 0, transition: 'opacity 0.3s, transform 0.3s',
            }}>
              <svg width="14" height="16" viewBox="0 0 14 16" fill="white">
                <path d="M1 1l12 7-12 7V1z"/>
              </svg>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Brand marquee */}
      <div style={{ padding: '3rem 0', overflow: 'hidden', borderTop: '0.5px solid var(--color-border)', marginTop: '2rem' }}>
        <div className="marquee-track" aria-hidden>
          {[...BRANDS, ...BRANDS].map((b, i) => (
            <span key={i} style={{
              fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'var(--color-text-tertiary)', flexShrink: 0,
              padding: '0 2rem',
            }}>
              {b} <span style={{ color: 'var(--color-border-mid)', marginLeft: '2rem' }}>·</span>
            </span>
          ))}
        </div>
      </div>

      {active && (
        <VideoModal
          videoUrl={active.videoUrl}
          title={active.title}
          brand={active.brand}
          onClose={() => setActive(null)}
        />
      )}

      {/* See All Work */}
      <div style={{ padding:'2.5rem clamp(1.25rem,5vw,3.5rem)', display:'flex', justifyContent:'center', borderTop:'0.5px solid var(--color-border)' }}>
        <Link href="/work" className="btn-primary" style={{ fontSize:13, padding:'0.875rem 2.5rem', display:'inline-flex', alignItems:'center', gap:8, textDecoration:'none' }}>
          See All Films
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M1 6.5h11M6.5 1l5.5 5.5-5.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>

      <style>{`
        [data-film-card]:hover .film-overlay { opacity: 1 !important; }
        [data-film-card]:hover .play-btn { opacity: 1 !important; transform: translate(-50%,-50%) scale(1) !important; }
        [data-film-card]:hover img { transform: scale(1.04); }
        .marquee-track { display: flex; animation: marquee 28s linear infinite; width: max-content; }
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @media(max-width:900px){ section > div:nth-child(2) { grid-template-columns: repeat(2,1fr) !important; } }
        @media(max-width:560px){ section > div:nth-child(2) { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}
