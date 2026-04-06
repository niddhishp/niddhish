'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

export interface PressItem {
  id: string; outlet: string; title: string; type: string; year: string
  url: string; summary: string; kind: string; podcast_show?: string
  podcast_host?: string; embed_url?: string; media_url?: string
  duration?: string; image_url?: string
}

interface ActiveItem extends PressItem {
  subtitle: string; meta: string
}

function getEmbedSrc(url: string): string | null {
  if (!url) return null
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}?rel=0`
  const vi = url.match(/vimeo\.com\/(\d+)/)
  if (vi) return `https://player.vimeo.com/video/${vi[1]}?dnt=1&title=0&byline=0`
  const sp = url.match(/open\.spotify\.com\/episode\/([^?]+)/)
  if (sp) return `https://open.spotify.com/embed/episode/${sp[1]}`
  return null
}

export default function PressClient({ press, podcasts }: { press: PressItem[]; podcasts: PressItem[] }) {
  const [active, setActive] = useState<ActiveItem | null>(null)

  const openItem = (item: PressItem) => {
    const isPodcast = item.kind === 'podcast'
    setActive({
      ...item,
      subtitle: isPodcast ? (item.podcast_show || item.outlet) : item.outlet,
      meta: isPodcast
        ? `${item.podcast_host ? `Hosted by ${item.podcast_host} · ` : ''}${item.year}${item.duration ? ` · ${item.duration}` : ''}`
        : `${item.type} · ${item.year}`,
    })
  }

  const hasRealUrl = active?.url && active.url !== '#'
  const embedSrc = active?.embed_url ? getEmbedSrc(active.embed_url) : null
  const isSpotify = embedSrc?.includes('spotify')

  const allItems = [...press, ...podcasts]
  const hasPodcasts = podcasts.length > 0

  return (
    <>
      {/* All press items in a card grid with thumbnails */}
      <div style={{ padding:'0 clamp(1.25rem,5vw,3.5rem)', marginBottom:'5rem' }}>
        {press.length > 0 && (
          <>
            <span className="text-label" style={{ display:'block', marginBottom:'2rem' }}>Articles & Features</span>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(320px, 1fr))', gap:'1px', background:'var(--color-border)', border:'0.5px solid var(--color-border)' }}>
              {press.map((item, i) => (
                <PressCard key={item.id} item={item} index={i} onClick={() => openItem(item)} />
              ))}
            </div>
          </>
        )}

        {hasPodcasts && (
          <>
            <span className="text-label" style={{ display:'block', marginBottom:'2rem', marginTop:'4rem' }}>Podcasts & Interviews</span>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(320px, 1fr))', gap:'1px', background:'var(--color-border)', border:'0.5px solid var(--color-border)' }}>
              {podcasts.map((item, i) => (
                <PressCard key={item.id} item={item} index={i} onClick={() => openItem(item)} isPodcast />
              ))}
            </div>
          </>
        )}

        {allItems.length === 0 && (
          <div style={{ padding:'4rem', textAlign:'center', border:'0.5px dashed var(--color-border)', color:'var(--color-text-tertiary)', fontSize:14 }}>
            No press items yet. Add them in Admin → Press.
          </div>
        )}
      </div>

      {/* Detail panel */}
      <AnimatePresence>
        {active && (
          <motion.div
            key="press-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position:'fixed', inset:0, zIndex:200, background:'rgba(6,6,6,0.92)', backdropFilter:'blur(16px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'1.5rem' }}
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:16 }}
              transition={{ duration:0.35, ease:EASE }}
              onClick={e => e.stopPropagation()}
              style={{ width:'100%', maxWidth:720, background:'var(--color-surface-1)', border:'0.5px solid var(--color-border)', maxHeight:'90vh', overflowY:'auto' }}
            >
              {/* Thumbnail or embed */}
              {embedSrc ? (
                <div style={{ position:'relative', aspectRatio: isSpotify ? '16/3.5' : '16/9', background:'#000' }}>
                  <iframe src={embedSrc} style={{ position:'absolute', inset:0, width:'100%', height:'100%', border:'none' }} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen title={active.title}/>
                </div>
              ) : active.image_url ? (
                <div style={{ position:'relative', aspectRatio:'16/7', overflow:'hidden' }}>
                  <img src={active.image_url} alt={active.title} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}/>
                  <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(18,18,18,0.9) 0%, transparent 60%)' }}/>
                </div>
              ) : null}

              {/* Content */}
              <div style={{ padding:'2rem' }}>
                <button onClick={() => setActive(null)} style={{ position:'absolute', top:'1rem', right:'1rem', background:'none', border:'none', color:'var(--color-text-tertiary)', cursor:'pointer', fontSize:20, lineHeight:1 }} aria-label="Close">×</button>

                <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'1rem', flexWrap:'wrap' }}>
                  <span style={{ fontSize:10, letterSpacing:'0.1em', textTransform:'uppercase', color: active.kind==='podcast' ? 'var(--color-accent)' : 'var(--color-text-tertiary)' }}>
                    {active.kind === 'podcast' ? '🎙 Podcast' : '📰 Press'}
                  </span>
                  <span style={{ fontSize:10, color:'var(--color-border-mid)' }}>·</span>
                  <span style={{ fontSize:11, color:'var(--color-text-tertiary)' }}>{active.meta}</span>
                </div>

                <h2 style={{ fontFamily:'var(--font-playfair,serif)', fontSize:'clamp(18px,2.5vw,26px)', fontWeight:400, lineHeight:1.25, color:'var(--color-text-primary)', marginBottom:'0.5rem', letterSpacing:'-0.01em' }}>
                  {active.title}
                </h2>
                <p style={{ fontSize:13, color:'var(--color-accent)', marginBottom:'1.5rem', letterSpacing:'0.04em' }}>{active.subtitle}</p>

                {active.summary && (
                  <p style={{ fontSize:15, lineHeight:1.8, color:'var(--color-text-secondary)', marginBottom:'1.5rem' }}>{active.summary}</p>
                )}

                {/* Audio player for direct files */}
                {active.media_url && (active.media_url.endsWith('.mp3') || active.media_url.endsWith('.m4a') || active.media_url.includes('audio')) && (
                  <audio controls style={{ width:'100%', marginBottom:'1.5rem', accentColor:'var(--color-accent)' }}>
                    <source src={active.media_url}/>
                  </audio>
                )}

                {hasRealUrl && (
                  <a href={active.url} target="_blank" rel="noopener noreferrer" style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:12, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--color-accent)', textDecoration:'none', border:'0.5px solid var(--color-accent)', padding:'0.625rem 1.25rem', transition:'background 0.2s' }}
                    onMouseEnter={e=>(e.currentTarget.style.background='rgba(232,104,58,0.08)')}
                    onMouseLeave={e=>(e.currentTarget.style.background='transparent')}
                  >
                    {active.kind === 'podcast' ? 'Listen / Watch' : 'Read Article'}
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1 9L9 1M9 1H3M9 1v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function PressCard({ item, index, onClick, isPodcast = false }: { item: PressItem; index: number; onClick: () => void; isPodcast?: boolean }) {
  const hasThumb = !!item.image_url
  const hasEmbed = !!(item.embed_url && getEmbedSrc(item.embed_url))

  return (
    <motion.button
      initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true, margin:'-40px' }}
      transition={{ duration:0.5, ease:EASE, delay: (index % 4) * 0.05 }}
      onClick={onClick}
      style={{ textAlign:'left', background:'var(--color-bg)', border:'none', cursor:'pointer', padding:0, display:'flex', flexDirection:'column' }}
      data-press-card
    >
      {/* Thumbnail */}
      {hasThumb ? (
        <div style={{ position:'relative', aspectRatio:'16/9', overflow:'hidden', background:'#111' }}>
          <img src={item.image_url!} alt={item.title} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', transition:'transform 0.5s ease' }}
            className="press-thumb"
            onError={e=>(e.currentTarget.style.display='none')}
          />
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)', opacity:0, transition:'opacity 0.3s' }} className="press-overlay"/>
          {(hasEmbed || item.media_url) && (
            <div style={{ position:'absolute', bottom:10, right:10, background:'rgba(232,104,58,0.9)', borderRadius:'50%', width:32, height:32, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg width="10" height="12" viewBox="0 0 10 12" fill="white"><path d="M1 1l8 5-8 5V1z"/></svg>
            </div>
          )}
        </div>
      ) : (
        <div style={{ aspectRatio:'16/9', background:'var(--color-surface-1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:32 }}>
          {isPodcast ? '🎙' : '📰'}
        </div>
      )}

      {/* Meta */}
      <div style={{ padding:'1.25rem', flex:1 }}>
        <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.5rem', flexWrap:'wrap' }}>
          <span style={{ fontSize:10, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--color-accent)' }}>{item.outlet}</span>
          <span style={{ fontSize:10, color:'var(--color-border-mid)' }}>·</span>
          <span style={{ fontSize:10, color:'var(--color-text-tertiary)', letterSpacing:'0.04em' }}>{item.type} · {item.year}</span>
          {item.url && item.url !== '#' && (
            <svg width="8" height="8" viewBox="0 0 10 10" fill="none" style={{ marginLeft:'auto', color:'var(--color-text-tertiary)' }}><path d="M1 9L9 1M9 1H3M9 1v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          )}
        </div>
        <p style={{ fontSize:14, fontFamily:'var(--font-playfair,serif)', color:'var(--color-text-primary)', lineHeight:1.4, margin:0 }}>{item.title}</p>
        {item.duration && <p style={{ fontSize:11, color:'var(--color-text-tertiary)', marginTop:'0.4rem' }}>{item.duration}</p>}
      </div>

      <style>{`
        [data-press-card]:hover .press-thumb { transform: scale(1.04) !important; }
        [data-press-card]:hover .press-overlay { opacity: 1 !important; }
      `}</style>
    </motion.button>
  )
}
