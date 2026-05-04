'use client'
import { useState, useEffect, useCallback } from 'react'
import { parseVideoUrl } from '@/lib/videoUtils'

const CATEGORIES = ['Automotive','Fashion & Beauty','Narrative','Humour','Offbeat','Sports','Animation','FMCG','Finance','Technology','Healthcare','Other']
const PLACEHOLDER = 'EQV7jlmU72Q'

interface Project {
  id: string; title: string; client: string; category: string
  video_url: string; duration: string; thumbnail: string
  is_featured: boolean; is_active: boolean; sort_order: number
}
const EMPTY: Omit<Project,'id'> = {
  title:'', client:'', category:'', video_url:'', duration:'',
  thumbnail:'', is_featured:false, is_active:true, sort_order:99
}

function isPlaceholder(url: string) { return !url || url.includes(PLACEHOLDER) }

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [seeding, setSeeding] = useState(false)
  const [view, setView] = useState<'list'|'edit'|'new'>('list')
  const [editing, setEditing] = useState<Partial<Project>>({...EMPTY})
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string|null>(null)
  const [fetchingThumb, setFetchingThumb] = useState(false)
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('All')
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const r = await fetch('/api/admin/projects')
      const d = await r.json()
      if (d.projects) setProjects(d.projects)
      else if (d.error) setError(d.error)
    } catch { setError('Failed to load') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const seed = async () => {
    setSeeding(true)
    const r = await fetch('/api/admin/projects/seed', { method: 'POST' })
    const d = await r.json()
    if (d.skipped) showToast(`Already seeded (${d.existing} projects)`)
    else if (d.seeded) { showToast(`Imported ${d.seeded} projects from Railway`); await load() }
    else setError(d.error || 'Seed failed')
    setSeeding(false)
  }

  const save = async () => {
    if (!editing.title?.trim() || !editing.client?.trim()) { setError('Title and Client are required'); return }
    setSaving(true); setError('')
    try {
      const isNew = view === 'new'
      const { id: _id, ...body } = editing as Project
      const url = isNew ? '/api/admin/projects' : `/api/admin/projects/${_id}`
      const method = isNew ? 'POST' : 'PATCH'
      const r = await fetch(url, { method, headers: {'Content-Type':'application/json'}, body: JSON.stringify(isNew ? body : editing) })
      const d = await r.json()
      if (d.error) throw new Error(d.error)
      showToast(isNew ? 'Project added' : 'Changes saved')
      await load(); setView('list')
    } catch(e) { setError(e instanceof Error ? e.message : 'Save failed') }
    finally { setSaving(false) }
  }

  const del = async (id: string) => {
    const r = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' })
    const d = await r.json()
    if (d.error) { setError(d.error); return }
    setProjects(p => p.filter(x => x.id !== id))
    setDeleting(null); showToast('Project deleted')
  }

  const fetchThumb = async () => {
    if (!editing.video_url) return
    setFetchingThumb(true); setError('')
    try {
      const info = parseVideoUrl(editing.video_url)
      if (!info) { setError('Invalid video URL'); return }
      if (info.provider === 'youtube') {
        setEditing(p => ({...p, thumbnail: `https://img.youtube.com/vi/${info.id}/maxresdefault.jpg`}))
        return
      }
      const res = await fetch(
        `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(editing.video_url)}&width=1280`,
        { headers: { Accept: 'application/json' } }
      )
      if (!res.ok) { setError(`Vimeo returned ${res.status}`); return }
      const data = await res.json()
      const thumb = (data.thumbnail_url||'').replace(/_\d+$/, '_1280')
      if (thumb) setEditing(p => ({...p, thumbnail: thumb}))
      else setError('No thumbnail returned')
    } catch { setError('Fetch failed') }
    finally { setFetchingThumb(false) }
  }

  const upd = (k: keyof Project) => (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) =>
    setEditing(p => ({...p, [k]: e.target.value}))

  const cats = ['All', ...CATEGORIES]
  const filtered = projects.filter(v => {
    const cm = filterCat === 'All' || v.category === filterCat
    const sm = !search || v.title.toLowerCase().includes(search.toLowerCase()) || v.client.toLowerCase().includes(search.toLowerCase())
    return cm && sm
  })

  const videoInfo = editing.video_url ? parseVideoUrl(editing.video_url) : null
  const previewEmbed = videoInfo ? (
    videoInfo.provider === 'vimeo'
      ? `https://player.vimeo.com/video/${videoInfo.id}?autoplay=0&title=0&byline=0&portrait=0`
      : `https://www.youtube-nocookie.com/embed/${videoInfo.id}`
  ) : null

  // ── EDIT / NEW FORM ───────────────────────────────────────────────
  if (view !== 'list') return (
    <div>
      <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'2rem' }}>
        <button onClick={() => setView('list')} style={backBtn}>← Back</button>
        <h1 style={h1}>{view === 'new' ? 'New Project' : `Edit — ${editing.title}`}</h1>
      </div>
      {error && <div style={errBox}>{error}</div>}

      <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:'2rem', alignItems:'start' }}>
        {/* Form */}
        <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
            <div>
              <label style={lbl}>Title *</label>
              <input value={editing.title||''} onChange={upd('title')} style={inp} placeholder="Film title"/>
            </div>
            <div>
              <label style={lbl}>Client / Brand *</label>
              <input value={editing.client||''} onChange={upd('client')} style={inp} placeholder="Nike"/>
            </div>
            <div>
              <label style={lbl}>Category</label>
              <select value={editing.category||''} onChange={upd('category')} style={inp}>
                <option value="">— select —</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>Duration</label>
              <input value={editing.duration||''} onChange={upd('duration')} style={inp} placeholder="1:23"/>
            </div>
            <div>
              <label style={lbl}>Sort Order</label>
              <input type="number" value={editing.sort_order??99} onChange={e=>setEditing(p=>({...p,sort_order:+e.target.value}))} style={inp}/>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem', paddingTop:'1.25rem' }}>
              <label style={{ display:'flex', alignItems:'center', gap:'0.5rem', fontSize:13, color:'var(--color-text-secondary)', cursor:'pointer' }}>
                <input type="checkbox" checked={!!editing.is_active} onChange={e=>setEditing(p=>({...p,is_active:e.target.checked}))}/> Active (visible on site)
              </label>
              <label style={{ display:'flex', alignItems:'center', gap:'0.5rem', fontSize:13, color:'var(--color-text-secondary)', cursor:'pointer' }}>
                <input type="checkbox" checked={!!editing.is_featured} onChange={e=>setEditing(p=>({...p,is_featured:e.target.checked}))}/> Featured (show on homepage reel)
              </label>
            </div>
          </div>

          {/* Video URL */}
          <div style={{ border:'0.5px solid var(--color-border)', padding:'1.25rem' }}>
            <label style={lbl}>Video URL *</label>
            <input
              value={editing.video_url||''} onChange={upd('video_url')} style={{...inp,marginTop:'0.3rem'}}
              placeholder="https://vimeo.com/1234567890?fl=tl&fe=ec or YouTube URL"
            />
            <p style={{ fontSize:11, color:'var(--color-text-tertiary)', marginTop:'0.35rem' }}>
              Paste the full Vimeo URL including ?fl= access tokens for unlisted videos, or a YouTube URL.
            </p>
            {/* Live embed preview */}
            {previewEmbed && (
              <div style={{ marginTop:'0.75rem', aspectRatio:'16/9', background:'#000', position:'relative' }}>
                <iframe src={previewEmbed} style={{ position:'absolute', inset:0, width:'100%', height:'100%', border:'none' }}
                  allow="autoplay; fullscreen; picture-in-picture" allowFullScreen title="preview"/>
              </div>
            )}
          </div>

          {/* Thumbnail */}
          <div style={{ border:'0.5px solid var(--color-border)', padding:'1.25rem' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'0.5rem' }}>
              <label style={{ ...lbl, marginBottom:0 }}>Thumbnail URL</label>
              {editing.video_url && !isPlaceholder(editing.video_url) && (
                <button onClick={fetchThumb} disabled={fetchingThumb} style={{ background:'none', border:'0.5px solid var(--color-border)', color:'var(--color-accent)', padding:'0.25rem 0.75rem', fontSize:11, cursor:'pointer', fontFamily:'inherit', opacity:fetchingThumb?0.6:1 }}>
                  {fetchingThumb ? 'Fetching…' : '⟳ Auto-fetch'}
                </button>
              )}
            </div>
            <input value={editing.thumbnail||''} onChange={upd('thumbnail')} style={inp} placeholder="https://i.vimeocdn.com/... or any image URL"/>
            {editing.thumbnail && (
              <img src={editing.thumbnail} alt="thumb" onError={e=>(e.currentTarget.style.opacity='0.2')}
                style={{ width:'100%', aspectRatio:'16/9', objectFit:'cover', marginTop:'0.75rem', display:'block', border:'0.5px solid var(--color-border)' }}/>
            )}
          </div>

          <div style={{ display:'flex', gap:'0.75rem' }}>
            <button onClick={save} disabled={saving} className="btn-primary" style={{ opacity:saving?0.6:1 }}>
              {saving ? 'Saving…' : view==='new' ? 'Add Project' : 'Save Changes'}
            </button>
            <button onClick={() => setView('list')} className="btn-ghost">Cancel</button>
          </div>
        </div>

        {/* Sidebar preview card */}
        <div style={{ position:'sticky', top:'1rem' }}>
          <div style={{ border:'0.5px solid var(--color-border)', overflow:'hidden' }}>
            <div style={{ aspectRatio:'16/9', background:'#111', position:'relative' }}>
              {editing.thumbnail ? (
                <img src={editing.thumbnail} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} onError={e=>(e.currentTarget.style.opacity='0.2')}/>
              ) : (
                <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <p style={{ fontSize:11, color:'var(--color-text-tertiary)' }}>No thumbnail yet</p>
                </div>
              )}
              {editing.is_featured && (
                <span style={{ position:'absolute', top:6, left:6, fontSize:8, background:'rgba(232,104,58,0.9)', color:'#fff', padding:'2px 6px' }}>★ Featured</span>
              )}
              {videoInfo && (
                <span style={{ position:'absolute', top:6, right:6, fontSize:8, background:videoInfo.provider==='youtube'?'rgba(255,0,0,0.8)':'rgba(26,183,234,0.8)', color:'#fff', padding:'2px 6px' }}>
                  {videoInfo.provider==='youtube'?'YT':'Vi'}
                </span>
              )}
            </div>
            <div style={{ padding:'0.875rem' }}>
              <p style={{ fontSize:9, color:'var(--color-accent)', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'0.2rem' }}>{editing.client||'Client'}</p>
              <p style={{ fontSize:13, fontFamily:'var(--font-playfair,serif)', color:'var(--color-text-primary)', lineHeight:1.35 }}>{editing.title||'Title'}</p>
              <p style={{ fontSize:10, color:'var(--color-text-tertiary)', marginTop:'0.3rem' }}>{editing.category||'Category'} {editing.duration ? `· ${editing.duration}` : ''}</p>
            </div>
          </div>
          {view === 'edit' && editing.id && (
            <button
              onClick={() => setDeleting(editing.id!)}
              style={{ width:'100%', marginTop:'0.5rem', background:'none', border:'0.5px solid rgba(255,80,80,0.3)', color:'rgba(255,80,80,0.7)', padding:'0.5rem', cursor:'pointer', fontSize:12, fontFamily:'inherit' }}
            >
              Delete Project
            </button>
          )}
        </div>
      </div>

      {/* Delete confirm */}
      {deleting && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:300 }}>
          <div style={{ background:'#111', border:'0.5px solid var(--color-border)', padding:'2rem', maxWidth:360, width:'90%' }}>
            <p style={{ fontSize:15, color:'var(--color-text-primary)', marginBottom:'1.5rem' }}>Delete <strong>{editing.title}</strong>? This cannot be undone.</p>
            <div style={{ display:'flex', gap:'0.75rem' }}>
              <button onClick={() => del(deleting)} style={{ background:'rgba(255,80,80,0.15)', border:'0.5px solid rgba(255,80,80,0.4)', color:'#ff6060', padding:'0.625rem 1.25rem', cursor:'pointer', fontSize:13, fontFamily:'inherit' }}>Delete</button>
              <button onClick={() => setDeleting(null)} className="btn-ghost" style={{ fontSize:13 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  // ── LIST VIEW ─────────────────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'2rem', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <h1 style={h1}>Projects</h1>
          <p style={{ fontSize:14, color:'var(--color-text-secondary)' }}>
            {loading ? 'Loading…' : `${projects.length} projects · ${projects.filter(p=>p.is_featured).length} featured on homepage`}
          </p>
        </div>
        <div style={{ display:'flex', gap:'0.75rem', flexWrap:'wrap' }}>
          {projects.length === 0 && !loading && (
            <button onClick={seed} disabled={seeding} style={{ background:'none', border:'0.5px solid rgba(255,160,50,0.5)', color:'rgba(255,160,50,0.9)', padding:'0.5rem 1rem', cursor:'pointer', fontSize:12, fontFamily:'inherit', opacity:seeding?0.6:1 }}>
              {seeding ? 'Importing…' : '⟳ Import from Railway'}
            </button>
          )}
          <button onClick={() => { setEditing({...EMPTY}); setError(''); setView('new') }} className="btn-primary">
            + Add Project
          </button>
        </div>
      </div>

      {error && <div style={{...errBox, marginBottom:'1.5rem'}}>{error}<button onClick={()=>setError('')} style={{ marginLeft:'0.75rem', background:'none', border:'none', color:'inherit', cursor:'pointer' }}>×</button></div>}
      {toast && <div style={{ padding:'0.75rem 1rem', background:'rgba(80,200,120,0.1)', border:'0.5px solid rgba(80,200,120,0.3)', color:'rgba(80,200,120,0.9)', fontSize:13, marginBottom:'1.5rem' }}>{toast}</div>}

      {/* Filters */}
      <div style={{ display:'flex', gap:'1rem', marginBottom:'1.5rem', flexWrap:'wrap', alignItems:'center' }}>
        <div style={{ display:'flex', gap:0, borderBottom:'0.5px solid var(--color-border)', overflowX:'auto' }}>
          {cats.map(c => (
            <button key={c} onClick={() => setFilterCat(c)} style={{ fontSize:11, padding:'0.5rem 0.875rem', background:'transparent', border:'none', borderBottom:filterCat===c?'1.5px solid var(--color-accent)':'1.5px solid transparent', color:filterCat===c?'var(--color-accent)':'var(--color-text-secondary)', cursor:'pointer', fontFamily:'inherit', whiteSpace:'nowrap' }}>
              {c} {c!=='All'?`(${projects.filter(p=>p.category===c).length})` : `(${projects.length})`}
            </button>
          ))}
        </div>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search title or client…" style={{ background:'var(--color-surface-1)', border:'0.5px solid var(--color-border)', padding:'0.4rem 0.75rem', fontSize:12, color:'var(--color-text-primary)', fontFamily:'inherit', outline:'none', width:200 }}/>
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ padding:'3rem', textAlign:'center', color:'var(--color-text-tertiary)' }}>Loading…</div>
      ) : filtered.length === 0 ? (
        <div style={{ padding:'4rem', textAlign:'center', border:'0.5px dashed var(--color-border)' }}>
          <p style={{ color:'var(--color-text-tertiary)', fontSize:14, marginBottom:'1rem' }}>
            {projects.length === 0 ? 'No projects yet — import from Railway or add manually.' : 'No projects match your search.'}
          </p>
          {projects.length === 0 && (
            <button onClick={seed} disabled={seeding} style={{ background:'none', border:'0.5px solid var(--color-border)', color:'var(--color-accent)', padding:'0.5rem 1.25rem', cursor:'pointer', fontSize:13, fontFamily:'inherit' }}>
              {seeding ? 'Importing…' : '⟳ Import from Railway DB'}
            </button>
          )}
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:'0.75rem' }}>
          {filtered.map(v => {
            const thumb = v.thumbnail
            const bad = isPlaceholder(v.video_url)
            const info = v.video_url ? parseVideoUrl(v.video_url) : null
            return (
              <div key={v.id} style={{ border:`0.5px solid ${bad?'rgba(255,80,80,0.35)':!v.is_active?'rgba(255,255,255,0.08)':'var(--color-border)'}`, overflow:'hidden', background:'var(--color-surface-1)', opacity:v.is_active?1:0.5 }}>
                {/* Thumbnail */}
                <div style={{ position:'relative', aspectRatio:'16/9', background:'#111' }}>
                  {thumb ? (
                    <img src={thumb} alt={v.title} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} onError={e=>(e.currentTarget.style.opacity='0.15')}/>
                  ) : (
                    <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <span style={{ fontSize:9, color:'rgba(255,255,255,0.2)', letterSpacing:'0.06em' }}>NO THUMB</span>
                    </div>
                  )}
                  <div style={{ position:'absolute', top:4, right:4, display:'flex', gap:3 }}>
                    {info && <span style={{ fontSize:8, background:info.provider==='youtube'?'rgba(255,0,0,0.8)':'rgba(26,183,234,0.8)', color:'#fff', padding:'1px 5px', borderRadius:1 }}>{info.provider==='youtube'?'YT':'Vi'}</span>}
                    {v.is_featured && <span style={{ fontSize:8, background:'rgba(232,104,58,0.85)', color:'#fff', padding:'1px 5px', borderRadius:1 }}>★</span>}
                  </div>
                  {bad && <span style={{ position:'absolute', bottom:4, left:4, fontSize:8, background:'rgba(255,80,80,0.85)', color:'#fff', padding:'1px 5px', borderRadius:1 }}>⚠ No URL</span>}
                  {!v.is_active && <span style={{ position:'absolute', bottom:4, right:4, fontSize:8, background:'rgba(0,0,0,0.7)', color:'#888', padding:'1px 5px', borderRadius:1 }}>Inactive</span>}
                </div>
                {/* Meta */}
                <div style={{ padding:'0.75rem' }}>
                  <p style={{ fontSize:9, color:'var(--color-accent)', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'0.2rem' }}>{v.client}</p>
                  <p style={{ fontSize:12, color:'var(--color-text-primary)', fontFamily:'var(--font-playfair,serif)', lineHeight:1.3, marginBottom:'0.5rem' }}>{v.title}</p>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <span style={{ fontSize:10, color:'var(--color-text-tertiary)' }}>{v.category}{v.duration?` · ${v.duration}`:''}</span>
                    <button onClick={() => { setEditing({...v}); setError(''); setView('edit') }} style={{ background:'none', border:'none', color:'var(--color-accent)', fontSize:11, cursor:'pointer', padding:0, fontFamily:'inherit' }}>Edit →</button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

const inp: React.CSSProperties = { width:'100%', background:'var(--color-surface-1)', border:'0.5px solid var(--color-border-mid)', padding:'0.625rem 0.875rem', fontSize:13, color:'var(--color-text-primary)', fontFamily:'inherit', outline:'none', boxSizing:'border-box' }
const lbl: React.CSSProperties = { display:'block', fontSize:10, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--color-text-tertiary)', marginBottom:'0.3rem' }
const h1: React.CSSProperties = { fontFamily:'var(--font-playfair,serif)', fontSize:28, fontWeight:400, color:'var(--color-text-primary)', letterSpacing:'-0.02em', marginBottom:'0.35rem' }
const errBox: React.CSSProperties = { padding:'0.75rem 1rem', background:'rgba(255,80,80,0.08)', border:'0.5px solid rgba(255,80,80,0.3)', color:'#ff6060', fontSize:13 }
const backBtn: React.CSSProperties = { background:'none', border:'0.5px solid var(--color-border)', color:'var(--color-text-secondary)', padding:'0.5rem 1rem', cursor:'pointer', fontSize:13, fontFamily:'inherit' }
