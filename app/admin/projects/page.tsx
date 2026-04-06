'use client'
import { useState, useEffect } from 'react'

interface DbVideo {
  id: string; video_id: string; source: 'vimeo'|'youtube'
  title: string; brand: string; category: string
  duration: string; description: string; thumbnail_url: string
  is_active: boolean; sort_order: number
}
interface DbCategory { id: string; slug: string; label: string; sort_order: number }
const EMPTY: Omit<DbVideo,'id'> = { video_id:'', source:'vimeo', title:'', brand:'', category:'', duration:'', description:'', thumbnail_url:'', is_active:true, sort_order:99 }

function buildThumb(source: string, videoId: string, custom?: string) {
  if (custom) return custom
  if (source === 'youtube') return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
  return '' // Vimeo needs hash — blank until fetched
}

export default function AdminProjects() {
  const [videos, setVideos] = useState<DbVideo[]>([])
  const [cats, setCats] = useState<DbCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'list'|'edit'|'new'>('list')
  const [editing, setEditing] = useState<Partial<DbVideo>>({})
  const [saving, setSaving] = useState(false)
  const [fetchingThumb, setFetchingThumb] = useState(false)
  const [batchFetching, setBatchFetching] = useState(false)
  const [batchProgress, setBatchProgress] = useState('')
  const [error, setError] = useState('')

  const batchFetchThumbs = async () => {
    const missing = videos.filter(v => !v.thumbnail_url && v.source === 'vimeo')
    if (!missing.length) return
    setBatchFetching(true)
    let done = 0
    for (const v of missing) {
      setBatchProgress(`${done}/${missing.length}`)
      try {
        const res = await fetch(
          `https://vimeo.com/api/oembed.json?url=${encodeURIComponent('https://vimeo.com/'+v.video_id)}&width=1280`,
          { headers: { Accept: 'application/json' } }
        )
        if (res.ok) {
          const data = await res.json()
          const thumb = (data.thumbnail_url||'').replace(/_\d+$/, '_1280')
          if (thumb) {
            await fetch(`/api/admin/videos/${v.id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ thumbnail_url: thumb }) })
            setVideos(prev => prev.map(x => x.id===v.id ? {...x,thumbnail_url:thumb} : x))
          }
        }
      } catch {}
      done++
      // Small delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 300))
    }
    setBatchFetching(false); setBatchProgress('')
  }
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('all')
  const [del, setDel] = useState<string|null>(null)

  useEffect(() => { fetchAll() }, [])
  const fetchAll = async () => {
    setLoading(true)
    try {
      const [vr, cr] = await Promise.all([fetch('/api/admin/videos'), fetch('/api/admin/categories')])
      const [vd, cd] = await Promise.all([vr.json(), cr.json()])
      if (vd.videos) setVideos(vd.videos)
      if (cd.categories) setCats(cd.categories)
    } catch { setError('Failed to load') }
    finally { setLoading(false) }
  }

  const fetchVimeoThumb = async () => {
    if (!editing.video_id || editing.source !== 'vimeo') return
    setFetchingThumb(true); setError('')
    try {
      // Fetch client-side — Vimeo blocks server-side requests from Vercel IPs
      // Need the full vimeo URL including any hash params the user stored
      const vimeoUrl = `https://vimeo.com/${editing.video_id}`
      const res = await fetch(
        `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(vimeoUrl)}&width=1280`,
        { headers: { 'Accept': 'application/json' } }
      )
      if (!res.ok) { setError(`Vimeo returned ${res.status} — check the video ID`); return }
      const data = await res.json()
      const thumb = (data.thumbnail_url || '').replace(/_\d+$/, '_1280')
      if (thumb) setEditing(p => ({ ...p, thumbnail_url: thumb }))
      else setError('No thumbnail returned by Vimeo')
    } catch(e) {
      setError('Fetch failed — check browser console or paste the URL manually')
    } finally { setFetchingThumb(false) }
  }

  const save = async () => {
    if (!editing.title || !editing.video_id) { setError('Title and Video ID are required'); return }
    setSaving(true); setError('')
    try {
      const isNew = view === 'new'
      if (isNew) {
        const { id: _id, ...body } = editing as DbVideo
        const res = await fetch('/api/admin/videos', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) })
        if (!res.ok) throw new Error((await res.json()).error)
      } else {
        const { id, ...body } = editing as DbVideo
        const res = await fetch(`/api/admin/videos/${id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) })
        if (!res.ok) throw new Error((await res.json()).error)
      }
      await fetchAll(); setView('list')
    } catch(e) { setError(e instanceof Error ? e.message : 'Save failed') }
    finally { setSaving(false) }
  }

  const upd = (k: keyof DbVideo) => (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) =>
    setEditing(p => ({ ...p, [k]: e.target.value }))

  const filtered = videos.filter(v => {
    const cm = filterCat === 'all' || v.category === filterCat
    const sm = !search || v.title.toLowerCase().includes(search.toLowerCase()) || v.brand.toLowerCase().includes(search.toLowerCase())
    return cm && sm
  })

  const getDisplayThumb = (v: Partial<DbVideo>) => {
    if (v.thumbnail_url) return v.thumbnail_url
    if (v.source === 'youtube' && v.video_id) return `https://img.youtube.com/vi/${v.video_id}/maxresdefault.jpg`
    return ''
  }

  if (view !== 'list') return (
    <div>
      <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'2rem' }}>
        <button onClick={()=>setView('list')} style={backBtn}>← Back</button>
        <h1 style={h1}>{view==='new' ? 'New Project' : `Edit — ${editing.title}`}</h1>
      </div>
      {error && <div style={errBox}>{error}</div>}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:'2.5rem', alignItems:'start' }}>
        <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
            <div><label style={lbl}>Title *</label><input value={editing.title||''} onChange={upd('title')} style={inp} placeholder="Film title"/></div>
            <div><label style={lbl}>Brand / Client *</label><input value={editing.brand||''} onChange={upd('brand')} style={inp} placeholder="Nike"/></div>
            <div>
              <label style={lbl}>Category</label>
              <select value={editing.category||''} onChange={upd('category')} style={inp}>
                <option value="">— select —</option>
                {cats.map(c => <option key={c.slug} value={c.slug}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>Source</label>
              <select value={editing.source||'vimeo'} onChange={upd('source')} style={inp}>
                <option value="vimeo">Vimeo</option>
                <option value="youtube">YouTube</option>
              </select>
            </div>
            <div><label style={lbl}>Video ID *</label><input value={editing.video_id||''} onChange={upd('video_id')} style={inp} placeholder="Vimeo/YouTube ID"/></div>
            <div><label style={lbl}>Duration</label><input value={editing.duration||''} onChange={upd('duration')} style={inp} placeholder="1:23"/></div>
            <div><label style={lbl}>Sort Order</label><input type="number" value={editing.sort_order||99} onChange={e=>setEditing(p=>({...p,sort_order:+e.target.value}))} style={inp}/></div>
            <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', paddingTop:'1.5rem' }}>
              <input type="checkbox" id="active" checked={!!editing.is_active} onChange={e=>setEditing(p=>({...p,is_active:e.target.checked}))}/>
              <label htmlFor="active" style={{ fontSize:13, color:'var(--color-text-secondary)', cursor:'pointer' }}>Active (visible on site)</label>
            </div>
          </div>

          {/* Thumbnail section */}
          <div style={{ border:'0.5px solid var(--color-border)', padding:'1.25rem' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'0.75rem' }}>
              <label style={{ ...lbl, marginBottom:0 }}>Thumbnail URL</label>
              {editing.source === 'vimeo' && editing.video_id && (
                <button onClick={fetchVimeoThumb} disabled={fetchingThumb} style={{ background:'none', border:'0.5px solid var(--color-border)', color:'var(--color-accent)', padding:'0.3rem 0.75rem', fontSize:11, cursor:'pointer', fontFamily:'inherit', opacity:fetchingThumb?0.6:1 }}>
                  {fetchingThumb ? 'Fetching…' : '⟳ Auto-fetch from Vimeo'}
                </button>
              )}
            </div>
            <input value={editing.thumbnail_url||''} onChange={upd('thumbnail_url')} style={inp} placeholder="https://i.vimeocdn.com/video/... or paste any image URL"/>
            <p style={{ fontSize:11, color:'var(--color-text-tertiary)', marginTop:'0.4rem' }}>
              Paste any image URL, or use the auto-fetch button to pull directly from Vimeo. YouTube thumbnails are generated automatically.
            </p>
            {getDisplayThumb(editing) && (
              <img src={getDisplayThumb(editing)} alt="thumbnail preview" onError={e=>(e.currentTarget.style.opacity='0.2')} style={{ width:'100%', aspectRatio:'16/9', objectFit:'cover', marginTop:'0.75rem', display:'block', border:'0.5px solid var(--color-border)' }}/>
            )}
            {!getDisplayThumb(editing) && editing.source === 'vimeo' && (
              <div style={{ marginTop:'0.75rem', padding:'1.5rem', background:'var(--color-bg)', border:'0.5px dashed var(--color-border)', textAlign:'center' }}>
                <p style={{ fontSize:12, color:'var(--color-text-tertiary)' }}>No thumbnail — click "Auto-fetch from Vimeo" above</p>
              </div>
            )}
          </div>

          <div><label style={lbl}>Description</label><textarea value={editing.description||''} onChange={upd('description')} rows={3} style={{...inp,resize:'vertical' as const}} placeholder="Film description..."/></div>
          <button onClick={save} disabled={saving} className="btn-primary" style={{ alignSelf:'flex-start', opacity:saving?0.6:1 }}>
            {saving ? 'Saving…' : view==='new' ? 'Add Project' : 'Save Changes'}
          </button>
        </div>

        {/* Sidebar preview */}
        <div style={{ position:'sticky', top:'1rem', border:'0.5px solid var(--color-border)', overflow:'hidden' }}>
          <div style={{ position:'relative', aspectRatio:'16/9', background:'#111' }}>
            {getDisplayThumb(editing) ? (
              <img src={getDisplayThumb(editing)} alt="preview" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} onError={e=>(e.currentTarget.style.opacity='0.2')}/>
            ) : (
              <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <p style={{ fontSize:11, color:'var(--color-text-tertiary)', textAlign:'center', padding:'1rem' }}>
                  {editing.source==='vimeo' ? 'Use "Auto-fetch" to load thumbnail' : 'Enter a Video ID to preview'}
                </p>
              </div>
            )}
          </div>
          <div style={{ padding:'0.75rem' }}>
            <p style={{ fontSize:11, color:'var(--color-text-tertiary)', marginBottom:'0.25rem' }}>
              {editing.source === 'vimeo' ? 'Vimeo' : 'YouTube'} · {editing.category||'No category'}
            </p>
            <p style={{ fontSize:13, color:'var(--color-text-primary)' }}>{editing.title||'Untitled'}</p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'2rem', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <h1 style={h1}>Projects</h1>
          <p style={{ fontSize:14, color:'var(--color-text-secondary)' }}>
            {loading ? 'Loading…' : `${videos.length} videos — ${videos.filter(v=>!v.thumbnail_url&&v.source==='vimeo').length} missing Vimeo thumbnails`}
          </p>
        </div>
        <div style={{ display:'flex', gap:'0.75rem', flexWrap:'wrap' }}>
          {videos.filter(v=>!v.thumbnail_url&&v.source==='vimeo').length > 0 && (
            <button onClick={batchFetchThumbs} disabled={batchFetching} style={{ background:'none', border:'0.5px solid var(--color-border)', color:'rgba(255,160,50,0.9)', padding:'0.5rem 1rem', cursor:'pointer', fontSize:12, fontFamily:'inherit', opacity:batchFetching?0.6:1 }}>
              {batchFetching ? `Fetching… ${batchProgress}` : `⟳ Auto-fetch ${videos.filter(v=>!v.thumbnail_url&&v.source==='vimeo').length} missing thumbnails`}
            </button>
          )}
          <button onClick={()=>{ setEditing({...EMPTY,category:cats[0]?.slug||''}); setView('new') }} className="btn-primary">+ Add Video</button>
        </div>
      </div>
      {error && <div style={{ ...errBox, marginBottom:'1.5rem' }}>{error}</div>}

      <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'1.5rem', flexWrap:'wrap' }}>
        <div style={{ display:'flex', gap:0, borderBottom:'0.5px solid var(--color-border)', flex:1, overflowX:'auto' }}>
          <button onClick={()=>setFilterCat('all')} style={{ ...tabBtn, ...(filterCat==='all'?activeTab:{}) }}>All ({videos.length})</button>
          {cats.map(c => (
            <button key={c.slug} onClick={()=>setFilterCat(c.slug)} style={{ ...tabBtn, ...(filterCat===c.slug?activeTab:{}) }}>
              {c.label} ({videos.filter(v=>v.category===c.slug).length})
            </button>
          ))}
        </div>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search…" style={{ background:'var(--color-surface-1)', border:'0.5px solid var(--color-border)', padding:'0.5rem 0.875rem', fontSize:12, color:'var(--color-text-primary)', fontFamily:'inherit', outline:'none', width:180 }}/>
      </div>

      {loading ? <div style={{ padding:'3rem', textAlign:'center', color:'var(--color-text-tertiary)' }}>Loading…</div> : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:'0.75rem' }}>
          {filtered.map(v => {
            const thumb = getDisplayThumb(v)
            const hasMissingThumb = !v.thumbnail_url && v.source === 'vimeo'
            return (
              <div key={v.id} style={{ border:`0.5px solid ${hasMissingThumb ? 'rgba(255,160,50,0.4)' : 'var(--color-border)'}`, overflow:'hidden', background:'var(--color-surface-1)', opacity:v.is_active?1:0.5, position:'relative' }}>
                <div style={{ position:'relative', aspectRatio:'16/9', background:'#111' }}>
                  {thumb ? (
                    <img src={thumb} alt={v.title} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} onError={e=>(e.currentTarget.style.display='none')}/>
                  ) : (
                    <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'#0d0d0d' }}>
                      <span style={{ fontSize:9, color:'rgba(255,160,50,0.8)', letterSpacing:'0.06em' }}>NO THUMBNAIL</span>
                    </div>
                  )}
                  <span style={{ position:'absolute', top:5, right:5, fontSize:8, background:v.source==='youtube'?'rgba(255,0,0,0.8)':'rgba(26,183,234,0.8)', color:'#fff', padding:'1px 5px', borderRadius:1 }}>{v.source==='youtube'?'YT':'Vi'}</span>
                </div>
                <div style={{ padding:'0.75rem' }}>
                  <p style={{ fontSize:9, color:'var(--color-accent)', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'0.2rem' }}>{v.brand}</p>
                  <p style={{ fontSize:12, color:'var(--color-text-primary)', fontFamily:'var(--font-playfair,serif)', marginBottom:'0.4rem', lineHeight:1.3 }}>{v.title}</p>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <span style={{ fontSize:10, color:hasMissingThumb?'rgba(255,160,50,0.8)':'var(--color-text-tertiary)' }}>
                      {hasMissingThumb ? '⚠ No thumb' : v.duration}
                    </span>
                    <button onClick={()=>{ setEditing({...v}); setView('edit') }} style={{ background:'none', border:'none', color:'var(--color-accent)', fontSize:11, cursor:'pointer', padding:0 }}>Edit</button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {del && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:200 }}>
          <div style={{ background:'#111', border:'0.5px solid var(--color-border)', padding:'2rem', maxWidth:360, width:'90%' }}>
            <p style={{ fontSize:15, color:'var(--color-text-primary)', marginBottom:'1.5rem' }}>Delete this video from the catalog?</p>
            <div style={{ display:'flex', gap:'0.75rem' }}>
              <button onClick={async()=>{ await fetch(`/api/admin/videos/${del}`,{method:'DELETE'}); setVideos(v=>v.filter(x=>x.id!==del)); setDel(null) }} style={{ background:'rgba(255,80,80,0.15)', border:'0.5px solid rgba(255,80,80,0.4)', color:'#ff6060', padding:'0.625rem 1.25rem', cursor:'pointer', fontSize:13, fontFamily:'inherit' }}>Delete</button>
              <button onClick={()=>setDel(null)} className="btn-ghost" style={{ fontSize:13 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
const inp: React.CSSProperties = { width:'100%', background:'var(--color-surface-1)', border:'0.5px solid var(--color-border-mid)', padding:'0.625rem 0.875rem', fontSize:13, color:'var(--color-text-primary)', fontFamily:'inherit', outline:'none', boxSizing:'border-box' }
const lbl: React.CSSProperties = { display:'block', fontSize:10, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--color-text-tertiary)', marginBottom:4 }
const h1: React.CSSProperties = { fontFamily:'var(--font-playfair,serif)', fontSize:28, fontWeight:400, color:'var(--color-text-primary)', letterSpacing:'-0.02em' }
const backBtn: React.CSSProperties = { background:'none', border:'0.5px solid var(--color-border)', color:'var(--color-text-secondary)', padding:'0.5rem 1rem', cursor:'pointer', fontSize:13, fontFamily:'inherit' }
const errBox: React.CSSProperties = { padding:'0.75rem 1rem', background:'rgba(255,80,80,0.08)', border:'0.5px solid rgba(255,80,80,0.3)', color:'#ff6060', fontSize:13 }
const tabBtn: React.CSSProperties = { fontSize:11, padding:'0.625rem 0.875rem', background:'transparent', border:'none', borderBottom:'1.5px solid transparent', color:'var(--color-text-secondary)', cursor:'pointer', fontFamily:'inherit', whiteSpace:'nowrap' }
const activeTab: React.CSSProperties = { borderBottom:'1.5px solid var(--color-accent)', color:'var(--color-accent)' }
