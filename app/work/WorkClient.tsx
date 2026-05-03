'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import VideoModal from '@/components/VideoModal'
import { VIDEOS, getThumbnail, CATEGORY_LABELS, FEATURE_FILMS } from '@/lib/videos'
import { parseVideoUrl } from '@/lib/videoUtils'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]
const RAILWAY_API = 'https://lightseeker-films-production.up.railway.app'

interface RailwayVideo {
  id: string
  title: string
  client: string
  category: string
  duration: string
  thumbnail: string
  video_url: string
}

export default function WorkClient() {
  const [activeTab, setActiveTab] = useState('All')
  const [search, setSearch] = useState('')
  const [active, setActive] = useState<{ videoUrl: string; title: string; brand: string } | null>(null)
  const [railwayVideos, setRailwayVideos] = useState<RailwayVideo[]|null>(null)
  const [cats, setCats] = useState<string[]>([])
  // Thumbnail overrides from Supabase (keyed by video_id)
  const [thumbOverrides, setThumbOverrides] = useState<Record<string, string>>({})

  useEffect(() => {
    // Fetch Railway videos (source of truth for video data)
    fetch(`${RAILWAY_API}/api/projects?is_active=true`)
      .then(r => r.json())
      .then((data: RailwayVideo[]) => {
        if (!data?.length) return
        setRailwayVideos(data)
        const seen = new Set<string>()
        const catList: string[] = []
        data.forEach(v => { if (v.category && !seen.has(v.category)) { seen.add(v.category); catList.push(v.category) } })
        setCats(catList.sort())
      })
      .catch(() => {})

    // Fetch Supabase thumbnail overrides (saved by admin → thumbnail_overrides table)
    fetch('/api/admin/thumbnails')
      .then(r => r.json())
      .then(d => {
        if (d.overrides) setThumbOverrides(d.overrides)
      })
      .catch(() => {})
  }, [])

  // Placeholder URL used in lightseeker admin when video URL wasn't set
  const PLACEHOLDER_IDS = ['EQV7jlmU72Q']
  const isPlaceholder = (url: string) => PLACEHOLDER_IDS.some(id => url?.includes(id))

  const allVideos = railwayVideos
    ? railwayVideos
        .filter(v => v.video_url && !isPlaceholder(v.video_url))
        .map(v => {
          const info = parseVideoUrl(v.video_url)
          const vimeoId = info?.provider === 'vimeo' ? info.id : ''
          // Priority: Supabase override > Railway thumbnail > YouTube auto
          const thumb = (vimeoId && thumbOverrides[vimeoId])
            || thumbOverrides[info?.id || '']
            || v.thumbnail
            || (info?.provider === 'youtube' ? `https://img.youtube.com/vi/${info.id}/maxresdefault.jpg` : '')
          return {
            videoUrl: v.video_url,
            id: info?.id || '',
            source: info?.provider === 'youtube' ? 'youtube' as const : 'vimeo' as const,
            title: v.title,
            brand: v.client,
            category: v.category,
            duration: v.duration,
            thumbnail: thumb,
          }
        })
    : VIDEOS.map(v => ({
        videoUrl: v.source === 'youtube' ? `https://www.youtube.com/watch?v=${v.id}` : `https://vimeo.com/${v.id}`,
        id: v.id, source: v.source, title: v.title, brand: v.brand,
        category: v.category as string, duration: v.duration,
        thumbnail: getThumbnail(v),
      }))

  const filtered = allVideos.filter(v => {
    const catMatch = activeTab === 'All' || v.category === activeTab
    const q = search.toLowerCase()
    return catMatch && (!q || v.title.toLowerCase().includes(q) || v.brand.toLowerCase().includes(q))
  })

  const tabList = railwayVideos ? ['All', ...cats] : ['All', ...Object.values(CATEGORY_LABELS)]

  return (
    <main style={{ background: 'var(--color-bg)', minHeight: '100dvh' }}>
      {/* Header */}
      <div style={{
        padding: 'clamp(8rem,14vh,12rem) clamp(1.5rem,5vw,4rem) 0',
        borderBottom: '0.5px solid var(--color-border)',
        marginBottom: 0,
      }}>
        <div style={{ maxWidth: 720, marginBottom: '3rem' }}>
          <span style={{
            display: 'block', fontFamily: '"JetBrains Mono","Courier New",monospace',
            fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase',
            color: 'rgba(232,104,58,0.5)', marginBottom: '1rem',
          }}>Filmography</span>
          <h1 style={{
            fontFamily: 'var(--font-playfair,"Playfair Display",Georgia,serif)',
            fontSize: 'clamp(40px,6vw,80px)', fontWeight: 400, lineHeight: 1,
            letterSpacing: '-0.04em', color: 'var(--color-text-primary)',
            marginBottom: '1.5rem',
          }}>200+ Films. <em style={{ color: 'var(--color-accent)' }}>One Vision.</em></h1>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--color-text-secondary)', maxWidth: 520 }}>
            Two decades directing brand films, TVCs, and feature cinema across 80+ brands and categories.
          </p>
        </div>

        {/* Feature films row */}
        <div style={{ marginBottom: '3rem' }}>
          <p style={{ fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: '1.25rem' }}>
            Feature Films
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {FEATURE_FILMS.map(film => (
              <Link key={film.slug} href={`/films/${film.slug}`} style={{
                display: 'flex', alignItems: 'center', gap: '0.875rem',
                padding: '0.75rem 1.25rem', border: '0.5px solid var(--color-border)',
                textDecoration: 'none', transition: 'border-color 0.2s',
                flex: '0 1 auto',
              }}>
                {film.posterUrl ? (
                  <div style={{ position: 'relative', width: 28, height: 40, flexShrink: 0, overflow: 'hidden' }}>
                    <Image src={film.posterUrl} alt={film.title} fill unoptimized style={{ objectFit: 'cover' }} />
                  </div>
                ) : (
                  <div style={{ width: 28, height: 40, background: `linear-gradient(160deg,${film.palette[1]},${film.palette[0]})`, flexShrink: 0 }} />
                )}
                <div>
                  <p style={{ fontSize: 13, color: 'var(--color-text-primary)', fontFamily: 'var(--font-playfair,serif)' }}>{film.title}</p>
                  <p style={{ fontSize: 10, color: 'var(--color-text-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{film.statusLabel}</p>
                </div>
                <span style={{ fontSize: 11, color: 'var(--color-accent)', marginLeft: 'auto', paddingLeft: '0.5rem' }}>→</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Filter tabs + search */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: 0, overflowX: 'auto' }}>
            {tabList.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                fontSize: 11, padding: '0.875rem 1.1rem',
                background: 'transparent', border: 'none',
                borderBottom: activeTab === tab ? '1.5px solid var(--color-accent)' : '1.5px solid transparent',
                color: activeTab === tab ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.04em', whiteSpace: 'nowrap',
              }}>{tab}</button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Search brand or title..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              background: 'var(--color-surface-1)', border: '0.5px solid var(--color-border)',
              padding: '0.5rem 1rem', fontSize: 13, color: 'var(--color-text-primary)',
              fontFamily: 'inherit', outline: 'none', width: 200,
            }}
          />
        </div>
      </div>

      {/* Video grid */}
      <div style={{ padding: '2px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
          {filtered.map((video, i) => (
            <motion.button
              key={`${video.videoUrl}-${i}`}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, ease: EASE, delay: (i % 8) * 0.04 }}
              onClick={() => setActive({ videoUrl: video.videoUrl, title: video.title, brand: video.brand })}
              style={{ position: 'relative', aspectRatio: '16/9', background: '#111', overflow: 'hidden', border: 'none', cursor: 'pointer', padding: 0 }}
              data-film-card
            >
              <Image
                src={video.thumbnail || `https://i.vimeocdn.com/video/${video.id}_640.jpg`}
                alt={video.title}
                fill
                sizes="(max-width:640px) 50vw, 25vw"
                style={{ objectFit: 'cover', transition: 'transform 0.55s ease' }}
                unoptimized
              />
              <div className="wk-overlay" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)', opacity: 0, transition: 'opacity 0.3s', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0.875rem' }}>
                <span style={{ fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '0.2rem' }}>{video.brand}</span>
                <span style={{ fontSize: 12, color: '#fff', lineHeight: 1.3, fontFamily: 'var(--font-playfair,serif)', textAlign: 'left' }}>{video.title}</span>
                <span style={{ fontSize: 9, color: 'rgba(240,237,232,0.45)', marginTop: '0.25rem', letterSpacing: '0.06em' }}>{video.duration}</span>
              </div>
              <div className="wk-play" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%) scale(0.6)', width: 36, height: 36, borderRadius: '50%', background: 'rgba(232,104,58,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.25s, transform 0.25s' }}>
                <svg width="11" height="13" viewBox="0 0 11 13" fill="white"><path d="M1 1l9 5.5-9 5.5V1z"/></svg>
              </div>
              <div style={{ position: 'absolute', top: 6, right: 6, fontSize: 8, letterSpacing: '0.06em', textTransform: 'uppercase', background: video.source === 'youtube' ? 'rgba(255,0,0,0.75)' : 'rgba(26,183,234,0.75)', color: '#fff', padding: '1px 5px', borderRadius: 1 }}>{video.source === 'youtube' ? 'YT' : 'Vi'}</div>
            </motion.button>
          ))}
        </div>
        {filtered.length === 0 && (
          <div style={{ padding: '5rem', textAlign: 'center', color: 'var(--color-text-tertiary)', fontSize: 14 }}>No videos match your search.</div>
        )}
      </div>

      <p style={{ padding: '1.5rem clamp(1.5rem,5vw,4rem)', fontSize: 12, color: 'var(--color-text-tertiary)' }}>
        Showing {filtered.length} of {allVideos.length} films
      </p>

      {active && (
        <VideoModal
          videoUrl={active.videoUrl}
          title={active.title}
          brand={active.brand}
          onClose={() => setActive(null)}
        />
      )}

      <style>{`
        [data-film-card]:hover .wk-overlay { opacity: 1 !important; }
        [data-film-card]:hover .wk-play { opacity: 1 !important; transform: translate(-50%,-50%) scale(1) !important; }
        [data-film-card]:hover img { transform: scale(1.06) !important; }
        @media(max-width:640px){ div[style*="repeat(4"] { grid-template-columns: repeat(2,1fr) !important; } }
        @media(min-width:641px) and (max-width:1000px){ div[style*="repeat(4"] { grid-template-columns: repeat(3,1fr) !important; } }
      `}</style>
    </main>
  )
}
