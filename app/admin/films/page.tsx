'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { VIDEOS, getThumbnail, CATEGORY_LABELS, FEATURE_FILMS, type VideoCategory } from '@/lib/videos'

const TABS = ['All', ...Object.values(CATEGORY_LABELS)]
const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS) as VideoCategory[]

export default function AdminFilmsPage() {
  const [tab, setTab] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = VIDEOS.filter(v => {
    const catMatch = tab === 'All' || CATEGORY_LABELS[v.category] === tab
    const searchMatch = !search || v.title.toLowerCase().includes(search.toLowerCase()) || v.brand.toLowerCase().includes(search.toLowerCase())
    return catMatch && searchMatch
  })

  return (
    <div>
      <div style={{ marginBottom:'2.5rem' }}>
        <h1 style={{ fontFamily:'var(--font-playfair,serif)', fontSize:28, fontWeight:400, color:'var(--color-text-primary)', marginBottom:'0.5rem', letterSpacing:'-0.02em' }}>
          Films & Portfolio
        </h1>
        <p style={{ fontSize:14, color:'var(--color-text-secondary)' }}>
          {VIDEOS.length} videos across {ALL_CATEGORIES.length} categories — scraped from niddhish.com
        </p>
      </div>

      {/* Feature Films */}
      <h2 style={{ fontSize:12, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--color-text-tertiary)', marginBottom:'1.25rem', fontWeight:500 }}>
        Feature Films
      </h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem', marginBottom:'3rem' }}>
        {FEATURE_FILMS.map(film => (
          <div key={film.title} style={{
            border:'0.5px solid var(--color-border)',
            background:'var(--color-surface-1)',
            overflow:'hidden',
          }}>
            {film.posterUrl ? (
              <div style={{ position:'relative', aspectRatio:'9/13', background:'#111' }}>
                <Image
                  src={film.posterUrl} alt={film.title} fill
                  style={{ objectFit:'cover' }} unoptimized
                />
              </div>
            ) : (
              <div style={{
                aspectRatio:'9/13',
                background:`linear-gradient(160deg, ${film.palette[1]} 0%, ${film.palette[0]} 100%)`,
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                <span style={{ fontSize:32, fontFamily:'var(--font-playfair,serif)', color:'rgba(255,255,255,0.3)' }}>
                  {film.title}
                </span>
              </div>
            )}
            <div style={{ padding:'1rem' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.4rem', flexWrap:'wrap' }}>
                <span style={{ fontFamily:'var(--font-playfair,serif)', fontSize:16, color:'var(--color-text-primary)' }}>
                  {film.title}
                </span>
                <span style={{
                  fontSize:9, letterSpacing:'0.08em', textTransform:'uppercase',
                  color: film.status==='release'?'#e8683a': film.status==='post'?'#84a8e8':'#c8c870',
                  border:`0.5px solid ${film.status==='release'?'rgba(232,104,58,0.5)': film.status==='post'?'rgba(100,140,220,0.4)':'rgba(180,180,100,0.4)'}`,
                  padding:'1px 6px', borderRadius:1,
                }}>{film.statusLabel}</span>
              </div>
              <p style={{ fontSize:12, color:'var(--color-text-tertiary)' }}>{film.genre} · {film.year}</p>
              {!film.posterUrl && (
                <p style={{ fontSize:11, color:'rgba(232,104,58,0.7)', marginTop:'0.5rem' }}>
                  ⚠ No poster yet — upload to niddhish.com or supply URL
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Brand Films */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.25rem', flexWrap:'wrap', gap:'1rem' }}>
        <h2 style={{ fontSize:12, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--color-text-tertiary)', fontWeight:500 }}>
          Brand Films ({VIDEOS.length})
        </h2>
        <input
          type="text"
          placeholder="Search brand or title..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            background:'var(--color-surface-1)',
            border:'0.5px solid var(--color-border)',
            padding:'0.5rem 1rem', fontSize:13,
            color:'var(--color-text-primary)',
            fontFamily:'inherit', outline:'none', width:220,
          }}
        />
      </div>

      {/* Category tabs */}
      <div style={{ display:'flex', gap:0, borderBottom:'0.5px solid var(--color-border)', marginBottom:'1.5rem', overflowX:'auto' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            fontSize:11, padding:'0.75rem 1rem',
            background:'transparent', border:'none',
            borderBottom: tab===t ? '1.5px solid var(--color-accent)' : '1.5px solid transparent',
            color: tab===t ? 'var(--color-accent)' : 'var(--color-text-secondary)',
            cursor:'pointer', fontFamily:'inherit', letterSpacing:'0.04em', whiteSpace:'nowrap',
          }}>{t}</button>
        ))}
      </div>

      {/* Video grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))', gap:'1rem' }}>
        {filtered.map(video => (
          <div key={video.id} style={{ border:'0.5px solid var(--color-border)', overflow:'hidden', background:'var(--color-surface-1)' }}>
            <div style={{ position:'relative', aspectRatio:'16/9', background:'#111' }}>
              <Image
                src={getThumbnail(video)} alt={video.title}
                fill style={{ objectFit:'cover' }} unoptimized
              />
              <div style={{
                position:'absolute', top:8, right:8,
                fontSize:9, letterSpacing:'0.08em', textTransform:'uppercase',
                background: video.source==='youtube' ? 'rgba(255,0,0,0.8)' : 'rgba(26,183,234,0.8)',
                color:'#fff', padding:'2px 7px', borderRadius:1,
              }}>
                {video.source === 'youtube' ? 'YT' : 'Vimeo'}
              </div>
              <a
                href={video.source==='youtube' ? `https://youtube.com/watch?v=${video.id}` : `https://vimeo.com/${video.id}`}
                target="_blank" rel="noopener noreferrer"
                style={{
                  position:'absolute', inset:0,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  background:'rgba(0,0,0,0)',
                  transition:'background 0.2s',
                }}
                onMouseEnter={e=>((e.currentTarget as HTMLElement).style.background='rgba(0,0,0,0.4)')}
                onMouseLeave={e=>((e.currentTarget as HTMLElement).style.background='rgba(0,0,0,0)')}
              >
                <div style={{
                  width:36, height:36, borderRadius:'50%',
                  background:'rgba(232,104,58,0.9)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  opacity:0, transition:'opacity 0.2s',
                }} className="play-circle">
                  <svg width="12" height="14" viewBox="0 0 12 14" fill="white">
                    <path d="M1 1l10 6-10 6V1z"/>
                  </svg>
                </div>
              </a>
            </div>
            <div style={{ padding:'0.875rem' }}>
              <p style={{ fontSize:10, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--color-accent)', marginBottom:'0.25rem' }}>
                {video.brand}
              </p>
              <p style={{ fontSize:13, color:'var(--color-text-primary)', lineHeight:1.35, fontFamily:'var(--font-playfair,serif)', marginBottom:'0.4rem' }}>
                {video.title}
              </p>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <span style={{ fontSize:11, color:'var(--color-text-tertiary)' }}>
                  {video.duration} · {CATEGORY_LABELS[video.category]}
                </span>
                <code style={{ fontSize:10, color:'rgba(232,104,58,0.6)', background:'rgba(232,104,58,0.08)', padding:'1px 5px', borderRadius:2 }}>
                  {video.id}
                </code>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ padding:'3rem', textAlign:'center', color:'var(--color-text-tertiary)', fontSize:14 }}>
          No videos match your search.
        </div>
      )}

      <style>{`a:hover .play-circle { opacity: 1 !important; }`}</style>
    </div>
  )
}
