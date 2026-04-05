'use client'
import { useState, useEffect } from 'react'

interface DbVideo {
  id: string; video_id: string; source: 'vimeo'|'youtube'
  title: string; brand: string; category: string
  duration: string; description: string; is_active: boolean; sort_order: number
}
interface DbCategory { id: string; slug: string; label: string; sort_order: number }
const EMPTY: Omit<DbVideo,'id'> = { video_id:'', source:'vimeo', title:'', brand:'', category:'ai', duration:'', description:'', is_active:true, sort_order:99 }

export default function AdminProjects() {
  const [videos, setVideos] = useState<DbVideo[]>([])
  const [cats, setCats] = useState<DbCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'list'|'edit'|'new'>('list')
  const [editing, setEditing] = useState<Partial<DbVideo>>({})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
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
    } catch(e) { setError('Failed to load') }
    finally { setLoading(false) }
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

  const thumb = (v: Partial<DbVideo>) => v.source === 'youtube'
    ? `https://i.ytimg.com/vi/${v.video_id}/maxresdefault.jpg`
    : `https://i.vimeocdn.com/video/${v.video_id}_640.jpg`

  const upd = (k: keyof DbVideo) => (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) =>
    setEditing(p => ({ ...p, [k]: e.target.value }))

  const filtered = videos.filter(v => {
    const cm = filterCat === 'all' || v.category === filterCat
    const sm = !search || v.title.toLowerCase().includes(search.toLowerCase()) || v.brand.toLowerCase().includes(search.toLowerCase())
    return cm && sm
  })

  if (view !== 'list') return (
    <div>
      <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'2rem' }}>
        <button onClick={()=>setView('list')} style={backBtn}>← Back</button>
        <h1 style={h1}>{view==='new' ? 'New Project' : `Edit — ${editing.title}`}</h1>
      </div>
      {error && <div style={errBox}>{error}</div>}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 280px', gap:'2.5rem', alignItems:'start' }}>
        <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
            <div><label style={lbl}>Title *</label><input value={editing.title||''} onChange={upd('title')} style={inp} placeholder="Film title"/></div>
            <div><label style={lbl}>Brand / Client *</label><input value={editing.brand||''} onChange={upd('brand')} style={inp} placeholder="Nike"/></div>
            <div>
              <label style={lbl}>Category</label>
              <select value={editing.category||'ai'} onChange={upd('category')} style={inp}>
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
          <div><label style={lbl}>Description</label><textarea value={editing.description||''} onChange={upd('description')} rows={3} style={{...inp,resize:'vertical' as const}} placeholder="Film description..."/></div>
          <button onClick={save} disabled={saving} className="btn-primary" style={{ alignSelf:'flex-start', opacity:saving?0.6:1 }}>
            {saving ? 'Saving…' : view==='new' ? 'Add Project' : 'Save Changes'}
          </button>
        </div>
        {editing.video_id ? (
          <div style={{ border:'0.5px solid var(--color-border)', overflow:'hidden', position:'sticky', top:'1rem' }}>
            <div style={{ position:'relative', aspectRatio:'16/9', background:'#111' }}>
              <img src={thumb(editing)} alt="thumbnail" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}/>
            </div>
            <div style={{ padding:'0.75rem' }}>
              <p style={{ fontSize:11, color:'var(--color-text-tertiary)' }}>Auto-fetched thumbnail</p>
            </div>
          </div>
        ) : (
          <div style={{ border:'0.5px dashed var(--color-border)', aspectRatio:'16/9', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <p style={{ fontSize:11, color:'var(--color-text-tertiary)', textAlign:'center' }}>Enter a Video ID to preview</p>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'2rem', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <h1 style={h1}>Projects</h1>
          <p style={{ fontSize:14, color:'var(--color-text-secondary)' }}>{loading ? 'Loading…' : `${videos.length} videos · ${cats.length} categories · Connected to Supabase`}</p>
        </div>
        <button onClick={()=>{ setEditing({...EMPTY,category:cats[0]?.slug||'ai'}); setView('new') }} className="btn-primary">+ Add Commercial</button>
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
          {filtered.map(v => (
            <div key={v.id} style={{ border:'0.5px solid var(--color-border)', overflow:'hidden', background:'var(--color-surface-1)', opacity: v.is_active ? 1 : 0.5 }}>
              <div style={{ position:'relative', aspectRatio:'16/9', background:'#111' }}>
                <img src={thumb(v)} alt={v.title} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}/>
                <span style={{ position:'absolute', top:5, right:5, fontSize:8, background:v.source==='youtube'?'rgba(255,0,0,0.8)':'rgba(26,183,234,0.8)', color:'#fff', padding:'1px 5px', borderRadius:1 }}>{v.source==='youtube'?'YT':'Vi'}</span>
              </div>
              <div style={{ padding:'0.75rem' }}>
                <p style={{ fontSize:9, color:'var(--color-accent)', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'0.2rem' }}>{v.brand}</p>
                <p style={{ fontSize:12, color:'var(--color-text-primary)', fontFamily:'var(--font-playfair,serif)', marginBottom:'0.4rem', lineHeight:1.3 }}>{v.title}</p>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ fontSize:10, color:'var(--color-text-tertiary)' }}>{v.duration}</span>
                  <button onClick={()=>{ setEditing({...v}); setView('edit') }} style={{ background:'none', border:'none', color:'var(--color-accent)', fontSize:11, cursor:'pointer', padding:0 }}>Edit</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {del && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:200 }}>
          <div style={{ background:'#111', border:'0.5px solid var(--color-border)', padding:'2rem', maxWidth:360, width:'90%' }}>
            <p style={{ fontSize:15, color:'var(--color-text-primary)', marginBottom:'1.5rem' }}>Delete this video from Supabase?</p>
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
