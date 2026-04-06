'use client'
import { useState, useEffect } from 'react'

interface PressItem {
  id: string
  outlet: string
  title: string
  summary: string
  type: string
  year: string
  url: string
  kind: 'press' | 'podcast'
  podcast_show?: string
  podcast_host?: string
  published: boolean
  embed_url?: string
  media_url?: string
  media_type?: string
  duration?: string
  image_url?: string
}

const TYPES = ['Feature Interview','Profile','Cover Story','Review','Mention','Award Coverage','Op-Ed']
const EMPTY: Omit<PressItem,'id'> = { outlet:'', title:'', summary:'', type:'Feature Interview', year: new Date().getFullYear().toString(), url:'', kind:'press', podcast_show:'', podcast_host:'', published:true, embed_url:'', media_url:'', duration:'', image_url:'' }

export default function AdminPressPage() {
  const [items, setItems] = useState<PressItem[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'list'|'edit'|'new'>('list')
  const [editing, setEditing] = useState<Partial<PressItem>>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [del, setDel] = useState<string|null>(null)
  const [tab, setTab] = useState<'all'|'press'|'podcast'>('all')

  useEffect(() => { fetchItems() }, [])

  const fetchItems = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/press')
      if (!res.ok) throw new Error((await res.json()).error || 'Failed')
      const d = await res.json()
      setItems(d.items || [])
    } catch(e) { setError(e instanceof Error ? e.message : 'Could not load press items') }
    finally { setLoading(false) }
  }

  const save = async () => {
    if (!editing.outlet || !editing.title) return
    setSaving(true)
    try {
      const method = view==='new' ? 'POST' : 'PATCH'
      const url = view==='new' ? '/api/admin/press' : `/api/admin/press/${editing.id}`
      const res = await fetch(url, { method, headers:{'Content-Type':'application/json'}, body: JSON.stringify(editing) })
      if (!res.ok) throw new Error((await res.json()).error || 'Failed')
      await fetchItems()
      setView('list')
    } catch(e) { setError(e instanceof Error ? e.message : 'Could not save') }
    finally { setSaving(false) }
  }

  const deleteItem = async (id: string) => {
    await fetch(`/api/admin/press/${id}`, { method:'DELETE' })
    setItems(i=>i.filter(x=>x.id!==id)); setDel(null)
  }

  const upd = (k: keyof PressItem) => (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) =>
    setEditing(p=>({...p,[k]:e.target.value}))

  const filtered = items.filter(i => tab==='all' || i.kind===tab)

  if (view !== 'list') return (
    <div>
      <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'2rem' }}>
        <button onClick={()=>setView('list')} style={backBtn}>← Back</button>
        <h1 style={h1}>{view==='new' ? 'New Press Item' : 'Edit Press Item'}</h1>
      </div>
      {error && <div style={errStyle}>{error}</div>}
      <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem', maxWidth:680 }}>
        <div>
          <label style={lbl}>Type</label>
          <div style={{ display:'flex', gap:'0.5rem' }}>
            <button onClick={()=>setEditing(p=>({...p,kind:'press'}))} style={{ ...toggleBtn, ...(editing.kind==='press' ? activeTgl : {}) }}>📰 Press / Article</button>
            <button onClick={()=>setEditing(p=>({...p,kind:'podcast'}))} style={{ ...toggleBtn, ...(editing.kind==='podcast' ? activeTgl : {}) }}>🎙 Podcast</button>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
          <div><label style={lbl}>Outlet / Publication *</label><input value={editing.outlet||''} onChange={upd('outlet')} style={inp} placeholder="Forbes India, Behance..."/></div>
          <div><label style={lbl}>Year</label><input value={editing.year||''} onChange={upd('year')} style={inp} placeholder="2025"/></div>
          {editing.kind==='podcast' && (
            <>
              <div><label style={lbl}>Show Name</label><input value={(editing as {podcast_show?:string}).podcast_show||''} onChange={upd('podcast_show')} style={inp} placeholder="The Creative Brief"/></div>
              <div><label style={lbl}>Host</label><input value={(editing as {podcast_host?:string}).podcast_host||''} onChange={upd('podcast_host')} style={inp} placeholder="John Smith"/></div>
            </>
          )}
          {editing.kind==='press' && (
            <div>
              <label style={lbl}>Article Type</label>
              <select value={editing.type||'Feature Interview'} onChange={upd('type')} style={inp}>
                {TYPES.map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
          )}
          <div style={{ gridColumn:'1/-1' }}><label style={lbl}>Title *</label><input value={editing.title||''} onChange={upd('title')} style={inp} placeholder="Article or episode title"/></div>
          <div style={{ gridColumn:'1/-1' }}><label style={lbl}>Summary</label><textarea value={editing.summary||''} onChange={upd('summary')} rows={3} style={{...inp,resize:'vertical' as const}} placeholder="Brief description..."/></div>
          <div style={{ gridColumn:'1/-1' }}><label style={lbl}>URL (link to article / episode page)</label><input value={editing.url||''} onChange={upd('url')} style={inp} placeholder="https://..."/></div>
          <div style={{ gridColumn:'1/-1' }}>
            <label style={lbl}>Thumbnail Image URL</label>
            <input value={editing.image_url||''} onChange={upd('image_url')} style={inp} placeholder="https://... paste any image URL — article cover, podcast art, screenshot"/>
            {editing.image_url && (
              <img src={editing.image_url} alt="preview" onError={e=>(e.currentTarget.style.display='none')} style={{ width:120, height:80, objectFit:'cover', marginTop:'0.5rem', display:'block', border:'0.5px solid var(--color-border)' }}/>
            )}
            <p style={{ fontSize:11, color:'var(--color-text-tertiary)', marginTop:'0.3rem' }}>Shown as card thumbnail on the press page. Use article hero image, podcast cover art, or a screenshot.</p>
          </div>
        </div>

        {/* Media embed — video or audio */}
        <div style={{ border:'0.5px solid var(--color-border)', padding:'1.25rem' }}>
          <h3 style={{ fontSize:11, fontWeight:500, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--color-text-tertiary)', marginBottom:'1rem' }}>
            {editing.kind==='podcast' ? 'Podcast Media' : 'Article Media'}
          </h3>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.875rem' }}>
            <div>
              <label style={lbl}>Embed URL — YouTube, Vimeo, Spotify, Apple Podcasts, SoundCloud</label>
              <input value={(editing as {embed_url?:string}).embed_url||''} onChange={upd('embed_url')} style={inp} placeholder="https://youtube.com/watch?v=... or https://open.spotify.com/episode/..."/>
              <p style={{ fontSize:11, color:'var(--color-text-tertiary)', marginTop:'0.3rem' }}>
                Paste a YouTube/Vimeo URL for video episodes, or a Spotify/Apple Podcasts episode URL for audio. Renders as an embedded player on the press page.
              </p>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.875rem' }}>
              <div>
                <label style={lbl}>Direct Audio/Video File URL (optional)</label>
                <input value={(editing as {media_url?:string}).media_url||''} onChange={upd('media_url')} style={inp} placeholder="https://... .mp3 or .mp4"/>
                <p style={{ fontSize:11, color:'var(--color-text-tertiary)', marginTop:'0.3rem' }}>
                  For self-hosted files. Upload to Supabase Storage and paste the public URL here.
                </p>
              </div>
              <div>
                <label style={lbl}>Duration</label>
                <input value={(editing as {duration?:string}).duration||''} onChange={upd('duration')} style={inp} placeholder="1h 24m"/>
              </div>
            </div>
            {/* Preview embed if URL is present */}
            {(() => {
              const embedUrl = (editing as {embed_url?:string}).embed_url || ''
              if (!embedUrl) return null
              const ytMatch = embedUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
              const viMatch = embedUrl.match(/vimeo\.com\/(\d+)/)
              const spMatch = embedUrl.match(/open\.spotify\.com\/episode\/([^?]+)/)
              let src = ''
              if (ytMatch) src = `https://www.youtube-nocookie.com/embed/${ytMatch[1]}`
              else if (viMatch) src = `https://player.vimeo.com/video/${viMatch[1]}?dnt=1`
              else if (spMatch) src = `https://open.spotify.com/embed/episode/${spMatch[1]}`
              if (!src) return <p style={{ fontSize:11, color:'rgba(255,160,50,0.8)', marginTop:'0.5rem' }}>Paste a YouTube, Vimeo or Spotify URL to preview</p>
              return (
                <div style={{ marginTop:'0.75rem', position:'relative', aspectRatio: spMatch ? '16/3' : '16/9', background:'#000' }}>
                  <iframe src={src} style={{ position:'absolute', inset:0, width:'100%', height:'100%', border:'none' }} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen title="Preview"/>
                </div>
              )
            })()}
          </div>
        </div>

        <label style={{ display:'flex', alignItems:'center', gap:'0.5rem', fontSize:14, color:'var(--color-text-secondary)', cursor:'pointer' }}>
          <input type="checkbox" checked={!!editing.published} onChange={e=>setEditing(p=>({...p,published:e.target.checked}))}/>
          Visible on site
        </label>
        <button onClick={save} disabled={saving} className="btn-primary" style={{ alignSelf:'flex-start', opacity:saving?0.6:1 }}>
          {saving ? 'Saving…' : view==='new' ? 'Add Press Item' : 'Save Changes'}
        </button>
      </div>
    </div>
  )

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'2rem', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <h1 style={h1}>Press & Media</h1>
          <p style={{ fontSize:14, color:'var(--color-text-secondary)' }}>Articles, interviews, and podcast appearances.</p>
        </div>
        <button onClick={()=>{setEditing(EMPTY);setView('new')}} className="btn-primary">+ Add Press Item</button>
      </div>

      {error && <div style={{ ...errStyle, marginBottom:'1.5rem' }}>{error}<br/><small style={{ opacity:0.7 }}>Check Supabase env vars + run supabase-schema.sql</small></div>}

      <div style={{ display:'flex', gap:0, borderBottom:'0.5px solid var(--color-border)', marginBottom:'1.5rem' }}>
        {(['all','press','podcast'] as const).map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{
            fontSize:11, padding:'0.75rem 1rem', background:'transparent', border:'none',
            borderBottom: tab===t ? '1.5px solid var(--color-accent)' : '1.5px solid transparent',
            color: tab===t ? 'var(--color-accent)' : 'var(--color-text-secondary)',
            cursor:'pointer', fontFamily:'inherit', textTransform:'capitalize', letterSpacing:'0.04em',
          }}>{t} ({t==='all'?items.length:items.filter(i=>i.kind===t).length})</button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign:'center', padding:'3rem', color:'var(--color-text-tertiary)', fontSize:14 }}>Loading…</div>
      ) : filtered.length === 0 ? (
        <div style={{ padding:'3rem', border:'0.5px solid var(--color-border)', textAlign:'center' }}>
          <p style={{ fontSize:14, color:'var(--color-text-tertiary)', marginBottom:'1rem' }}>
            {items.length===0 ? 'No press items yet. Add your first one.' : 'No items in this category.'}
          </p>
          {items.length===0 && <button onClick={()=>{setEditing(EMPTY);setView('new')}} className="btn-primary">Add Press Item</button>}
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column' }}>
          {filtered.map((item,i) => (
            <div key={item.id} style={{
              display:'grid', gridTemplateColumns:'auto 1fr auto', gap:'1.5rem',
              alignItems:'center', padding:'1.1rem 0',
              borderBottom: i<filtered.length-1 ? '0.5px solid var(--color-border)' : 'none',
            }}>
              <div style={{ fontSize:20, opacity:0.7 }}>{item.kind==='podcast' ? '🎙' : '📰'}</div>
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'0.2rem', flexWrap:'wrap' }}>
                  <span style={{ fontSize:14, color:'var(--color-text-primary)', fontFamily:'var(--font-playfair,serif)' }}>{item.title}</span>
                  {!item.published && <span style={{ fontSize:9, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--color-text-tertiary)', border:'0.5px solid var(--color-border)', padding:'1px 6px', borderRadius:1 }}>Hidden</span>}
                </div>
                <p style={{ fontSize:12, color:'var(--color-text-tertiary)' }}>
                  {item.outlet} · {item.type} · {item.year}
                  {item.url && <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ color:'var(--color-accent)', marginLeft:'0.5rem', textDecoration:'none' }}>↗</a>}
                </p>
              </div>
              <div style={{ display:'flex', gap:'0.75rem' }}>
                <button onClick={()=>{setEditing(item);setView('edit')}} style={{ background:'none', border:'none', color:'var(--color-accent)', cursor:'pointer', fontSize:12 }}>Edit</button>
                <button onClick={()=>setDel(item.id)} style={{ background:'none', border:'none', color:'rgba(255,80,80,0.6)', cursor:'pointer', fontSize:12 }}>Del</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {del && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:200 }}>
          <div style={{ background:'#111', border:'0.5px solid var(--color-border)', padding:'2rem', maxWidth:360, width:'90%' }}>
            <p style={{ fontSize:15, color:'var(--color-text-primary)', marginBottom:'1.5rem' }}>Delete this press item?</p>
            <div style={{ display:'flex', gap:'0.75rem' }}>
              <button onClick={()=>deleteItem(del)} style={{ background:'rgba(255,80,80,0.15)', border:'0.5px solid rgba(255,80,80,0.4)', color:'#ff6060', padding:'0.625rem 1.25rem', cursor:'pointer', fontSize:13, fontFamily:'inherit' }}>Delete</button>
              <button onClick={()=>setDel(null)} className="btn-ghost" style={{ fontSize:13 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
const inp: React.CSSProperties = { width:'100%', background:'var(--color-surface-1)', border:'0.5px solid var(--color-border-mid)', padding:'0.625rem 0.875rem', fontSize:13, color:'var(--color-text-primary)', fontFamily:'inherit', outline:'none', boxSizing:'border-box' }
const lbl: React.CSSProperties = { display:'block', fontSize:10, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--color-text-tertiary)', marginBottom:'0.35rem' }
const h1: React.CSSProperties = { fontFamily:'var(--font-playfair,serif)', fontSize:28, fontWeight:400, color:'var(--color-text-primary)', letterSpacing:'-0.02em' }
const backBtn: React.CSSProperties = { background:'none', border:'0.5px solid var(--color-border)', color:'var(--color-text-secondary)', padding:'0.5rem 1rem', cursor:'pointer', fontSize:13, fontFamily:'inherit' }
const errStyle: React.CSSProperties = { padding:'0.75rem 1rem', background:'rgba(255,80,80,0.08)', border:'0.5px solid rgba(255,80,80,0.3)', color:'#ff6060', fontSize:13 }
const toggleBtn: React.CSSProperties = { padding:'0.5rem 1rem', background:'var(--color-surface-1)', border:'0.5px solid var(--color-border)', color:'var(--color-text-secondary)', cursor:'pointer', fontSize:13, fontFamily:'inherit' }
const activeTgl: React.CSSProperties = { borderColor:'var(--color-accent)', color:'var(--color-accent)', background:'rgba(232,104,58,0.08)' }
