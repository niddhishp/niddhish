'use client'
import { useState, useEffect } from 'react'
import { parseVideoUrl } from '@/lib/videoUtils'

const RAILWAY = 'https://lightseeker-films-production.up.railway.app'

interface RailwayVideo {
  id: string; title: string; client: string; category: string
  duration: string; thumbnail: string; video_url: string
  is_featured: boolean; sort_order: number; is_active: boolean
}

export default function AdminProjects() {
  const [videos, setVideos] = useState<RailwayVideo[]>([])
  const [overrides, setOverrides] = useState<Record<string,string>>({})
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<RailwayVideo|null>(null)
  const [thumbInput, setThumbInput] = useState('')
  const [fetchingThumb, setFetchingThumb] = useState(false)
  const [batchFetching, setBatchFetching] = useState(false)
  const [batchProgress, setBatchProgress] = useState('')
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('All')
  const [error, setError] = useState('')
  const [saved, setSaved] = useState<string|null>(null)

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [rv, rt] = await Promise.all([
        fetch(`${RAILWAY}/api/projects?is_active=true`).then(r=>r.json()),
        fetch('/api/admin/thumbnails').then(r=>r.json())
      ])
      if (Array.isArray(rv)) setVideos(rv)
      if (rt.overrides) setOverrides(rt.overrides)
    } catch { setError('Failed to load') }
    finally { setLoading(false) }
  }

  const getVideoId = (videoUrl: string) => parseVideoUrl(videoUrl)?.id || ''

  const getThumb = (v: RailwayVideo) => {
    const id = getVideoId(v.video_url)
    if (overrides[id]) return overrides[id]
    if (v.thumbnail) return v.thumbnail
    const info = parseVideoUrl(v.video_url)
    if (info?.provider === 'youtube') return `https://img.youtube.com/vi/${info.id}/maxresdefault.jpg`
    return ''
  }

  const fetchThumb = async (videoUrl: string) => {
    const info = parseVideoUrl(videoUrl)
    if (!info) return null
    if (info.provider === 'youtube') {
      return `https://img.youtube.com/vi/${info.id}/maxresdefault.jpg`
    }
    // Vimeo — client-side oEmbed
    const res = await fetch(
      `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(videoUrl)}&width=1280`,
      { headers: { Accept: 'application/json' } }
    )
    if (!res.ok) return null
    const data = await res.json()
    return (data.thumbnail_url||'').replace(/_\d+$/, '_1280') || null
  }

  const saveThumb = async (videoUrl: string, thumbUrl: string) => {
    const id = getVideoId(videoUrl)
    if (!id || !thumbUrl) return
    await fetch('/api/admin/thumbnails', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ video_id: id, thumb_url: thumbUrl })
    })
    setOverrides(p => ({...p, [id]: thumbUrl}))
  }

  const handleFetchThumb = async () => {
    if (!editing) return
    setFetchingThumb(true); setError('')
    try {
      const url = await fetchThumb(editing.video_url)
      if (url) { setThumbInput(url); setSaved(null) }
      else setError('404 — Vimeo could not find this video. Paste the thumbnail URL manually.')
    } catch { setError('Fetch failed') }
    finally { setFetchingThumb(false) }
  }

  const handleSaveThumb = async () => {
    if (!editing || !thumbInput.trim()) return
    setSaving(true)
    await saveThumb(editing.video_url, thumbInput.trim())
    setSaving(false); setSaved(editing.id)
    setTimeout(() => setSaved(null), 2000)
  }

  const batchFetchMissing = async () => {
    const missing = videos.filter(v => {
      const id = getVideoId(v.video_url)
      const info = parseVideoUrl(v.video_url)
      return info?.provider === 'vimeo' && !overrides[id] && !v.thumbnail
    })
    if (!missing.length) return
    setBatchFetching(true)
    let done = 0
    for (const v of missing) {
      setBatchProgress(`${done+1}/${missing.length}: ${v.title.slice(0,30)}`)
      const url = await fetchThumb(v.video_url)
      if (url) await saveThumb(v.video_url, url)
      done++
      await new Promise(r => setTimeout(r, 350))
    }
    setBatchFetching(false); setBatchProgress('')
  }

  const cats = ['All', ...Array.from(new Set(videos.map(v=>v.category).filter(Boolean))).sort()]
  const missingCount = videos.filter(v => {
    const id = getVideoId(v.video_url)
    const info = parseVideoUrl(v.video_url)
    return info?.provider === 'vimeo' && !overrides[id] && !v.thumbnail
  }).length

  const filtered = videos.filter(v => {
    const catMatch = filterCat==='All' || v.category===filterCat
    const q = search.toLowerCase()
    return catMatch && (!q || v.title.toLowerCase().includes(q) || v.client.toLowerCase().includes(q))
  })

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'2rem', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <h1 style={h1}>Projects</h1>
          <p style={{ fontSize:14, color:'var(--color-text-secondary)' }}>
            {loading ? 'Loading from Railway…' : `${videos.length} videos from lightseeker DB · ${missingCount} missing Vimeo thumbnails`}
          </p>
        </div>
        {missingCount > 0 && (
          <button onClick={batchFetchMissing} disabled={batchFetching} style={{ background:'none', border:'0.5px solid rgba(255,160,50,0.5)', color:'rgba(255,160,50,0.9)', padding:'0.5rem 1rem', cursor:'pointer', fontSize:12, fontFamily:'inherit', opacity:batchFetching?0.6:1 }}>
            {batchFetching ? `⟳ ${batchProgress}` : `⟳ Auto-fetch ${missingCount} missing thumbnails`}
          </button>
        )}
      </div>

      {error && <div style={errBox}>{error}<button onClick={()=>setError('')} style={{ marginLeft:'0.75rem', background:'none', border:'none', color:'inherit', cursor:'pointer' }}>×</button></div>}

      <div style={{ display:'flex', gap:'1rem', marginBottom:'1.5rem', flexWrap:'wrap', alignItems:'center' }}>
        <div style={{ display:'flex', gap:0, overflowX:'auto', borderBottom:'0.5px solid var(--color-border)' }}>
          {cats.map(c=>(
            <button key={c} onClick={()=>setFilterCat(c)} style={{ fontSize:11, padding:'0.5rem 0.875rem', background:'transparent', border:'none', borderBottom: filterCat===c ? '1.5px solid var(--color-accent)' : '1.5px solid transparent', color: filterCat===c ? 'var(--color-accent)' : 'var(--color-text-secondary)', cursor:'pointer', fontFamily:'inherit', whiteSpace:'nowrap' }}>{c}</button>
          ))}
        </div>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search…" style={{ background:'var(--color-surface-1)', border:'0.5px solid var(--color-border)', padding:'0.4rem 0.75rem', fontSize:12, color:'var(--color-text-primary)', fontFamily:'inherit', outline:'none', width:160 }}/>
      </div>

      {loading ? <div style={{ padding:'3rem', textAlign:'center', color:'var(--color-text-tertiary)' }}>Loading…</div> : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:'0.75rem' }}>
          {filtered.map(v => {
            const thumb = getThumb(v)
            const id = getVideoId(v.video_url)
            const info = parseVideoUrl(v.video_url)
            const isMissing = info?.provider==='vimeo' && !overrides[id] && !v.thumbnail
            const hasOverride = !!overrides[id]
            return (
              <div key={v.id} style={{ border:`0.5px solid ${isMissing?'rgba(255,160,50,0.35)':'var(--color-border)'}`, overflow:'hidden', background:'var(--color-surface-1)' }}>
                <div style={{ position:'relative', aspectRatio:'16/9', background:'#111' }}>
                  {thumb ? (
                    <img src={thumb} alt={v.title} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} onError={e=>(e.currentTarget.style.opacity='0.15')}/>
                  ) : (
                    <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <span style={{ fontSize:9, color:'rgba(255,160,50,0.7)', letterSpacing:'0.06em' }}>NO THUMBNAIL</span>
                    </div>
                  )}
                  <span style={{ position:'absolute', top:4, right:4, fontSize:8, background:info?.provider==='youtube'?'rgba(255,0,0,0.8)':'rgba(26,183,234,0.8)', color:'#fff', padding:'1px 5px', borderRadius:1 }}>{info?.provider==='youtube'?'YT':'Vi'}</span>
                  {hasOverride && <span style={{ position:'absolute', bottom:4, left:4, fontSize:8, background:'rgba(232,104,58,0.8)', color:'#fff', padding:'1px 5px', borderRadius:1 }}>✓ Custom</span>}
                </div>
                <div style={{ padding:'0.625rem' }}>
                  <p style={{ fontSize:9, color:'var(--color-accent)', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'0.15rem' }}>{v.client}</p>
                  <p style={{ fontSize:11, color:'var(--color-text-primary)', lineHeight:1.3, marginBottom:'0.4rem', fontFamily:'var(--font-playfair,serif)' }}>{v.title}</p>
                  <button
                    onClick={() => { setEditing(v); setThumbInput(overrides[id]||v.thumbnail||''); setError('') }}
                    style={{ background:'none', border:'none', color: isMissing?'rgba(255,160,50,0.9)':'var(--color-accent)', fontSize:11, cursor:'pointer', padding:0, fontFamily:'inherit' }}
                  >
                    {isMissing ? '⚠ Set thumbnail' : 'Edit thumbnail'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Thumbnail edit drawer */}
      {editing && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:200, padding:'1rem' }} onClick={()=>setEditing(null)}>
          <div style={{ background:'#111', border:'0.5px solid var(--color-border)', width:'100%', maxWidth:560, padding:'2rem' }} onClick={e=>e.stopPropagation()}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'1.25rem' }}>
              <div>
                <p style={{ fontSize:9, color:'var(--color-accent)', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'0.25rem' }}>{editing.client}</p>
                <h2 style={{ fontFamily:'var(--font-playfair,serif)', fontSize:18, fontWeight:400, color:'var(--color-text-primary)' }}>{editing.title}</h2>
                <p style={{ fontSize:11, color:'var(--color-text-tertiary)', marginTop:'0.2rem' }}>ID: {getVideoId(editing.video_url)} · {editing.video_url}</p>
              </div>
              <button onClick={()=>setEditing(null)} style={{ background:'none', border:'none', color:'var(--color-text-tertiary)', cursor:'pointer', fontSize:18, padding:0, lineHeight:1 }}>×</button>
            </div>

            {/* Current thumbnail preview */}
            {(thumbInput || getThumb(editing)) && (
              <div style={{ marginBottom:'1.25rem', aspectRatio:'16/9', background:'#0a0a0a', overflow:'hidden' }}>
                <img src={thumbInput || getThumb(editing)} alt="preview" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} onError={e=>(e.currentTarget.style.opacity='0.1')}/>
              </div>
            )}

            <div style={{ marginBottom:'1rem' }}>
              <label style={lbl}>Thumbnail URL</label>
              <input
                value={thumbInput}
                onChange={e=>setThumbInput(e.target.value)}
                style={{...inp, marginTop:'0.3rem'}}
                placeholder="Paste thumbnail URL from inspect or anywhere"
              />
              <p style={{ fontSize:11, color:'var(--color-text-tertiary)', marginTop:'0.35rem' }}>
                Tip: right-click any image on lightseeker.com → "Copy image address"
              </p>
            </div>

            <div style={{ display:'flex', gap:'0.75rem', flexWrap:'wrap' }}>
              {parseVideoUrl(editing.video_url)?.provider === 'vimeo' && (
                <button onClick={handleFetchThumb} disabled={fetchingThumb} style={{ background:'none', border:'0.5px solid var(--color-border)', color:'var(--color-accent)', padding:'0.5rem 1rem', cursor:'pointer', fontSize:12, fontFamily:'inherit', opacity:fetchingThumb?0.6:1 }}>
                  {fetchingThumb ? 'Fetching…' : '⟳ Auto-fetch from Vimeo'}
                </button>
              )}
              <button onClick={handleSaveThumb} disabled={saving||!thumbInput.trim()} className="btn-primary" style={{ opacity:(!thumbInput.trim()||saving)?0.5:1 }}>
                {saved===editing.id ? '✓ Saved' : saving ? 'Saving…' : 'Save Thumbnail'}
              </button>
            </div>

            {error && <div style={{...errBox, marginTop:'1rem'}}>{error}</div>}
          </div>
        </div>
      )}
    </div>
  )
}
const inp: React.CSSProperties = { width:'100%', background:'var(--color-surface-1)', border:'0.5px solid var(--color-border-mid)', padding:'0.625rem 0.875rem', fontSize:13, color:'var(--color-text-primary)', fontFamily:'inherit', outline:'none', boxSizing:'border-box' }
const lbl: React.CSSProperties = { display:'block', fontSize:10, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--color-text-tertiary)' }
const h1: React.CSSProperties = { fontFamily:'var(--font-playfair,serif)', fontSize:28, fontWeight:400, color:'var(--color-text-primary)', letterSpacing:'-0.02em' }
const errBox: React.CSSProperties = { padding:'0.75rem 1rem', background:'rgba(255,80,80,0.08)', border:'0.5px solid rgba(255,80,80,0.3)', color:'#ff6060', fontSize:13, marginBottom:'1rem' }
