'use client'
import { useState, useEffect } from 'react'

interface Category { id: string; slug: string; label: string; sort_order: number }

export default function AdminCategories() {
  const [cats, setCats] = useState<Category[]>([])
  const [videos, setVideos] = useState<{category:string}[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string|null>(null)
  const [error, setError] = useState('')
  const [newLabel, setNewLabel] = useState('')
  const [newSlug, setNewSlug] = useState('')
  const [editingId, setEditingId] = useState<string|null>(null)
  const [editLabel, setEditLabel] = useState('')

  useEffect(() => { fetchAll() }, [])
  const fetchAll = async () => {
    setLoading(true)
    try {
      const [cr, vr] = await Promise.all([fetch('/api/admin/categories'), fetch('/api/admin/videos')])
      const [cd, vd] = await Promise.all([cr.json(), vr.json()])
      if (cd.categories) setCats(cd.categories)
      if (vd.videos) setVideos(vd.videos)
    } finally { setLoading(false) }
  }

  const addCat = async () => {
    if (!newLabel.trim()) return
    const slug = newSlug.trim() || newLabel.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'')
    setSaving('new')
    try {
      const res = await fetch('/api/admin/categories', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ slug, label: newLabel.trim(), sort_order: cats.length+1 }) })
      if (!res.ok) throw new Error((await res.json()).error)
      setNewLabel(''); setNewSlug('')
      await fetchAll()
    } catch(e) { setError(e instanceof Error ? e.message : 'Failed') }
    finally { setSaving(null) }
  }

  const updateLabel = async (id: string) => {
    setSaving(id)
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ label: editLabel }) })
      if (!res.ok) throw new Error((await res.json()).error)
      setEditingId(null)
      await fetchAll()
    } catch(e) { setError(e instanceof Error ? e.message : 'Failed') }
    finally { setSaving(null) }
  }

  const deleteCat = async (id: string, slug: string) => {
    const count = videos.filter(v => v.category === slug).length
    if (count > 0 && !confirm(`This category has ${count} videos. Delete anyway?`)) return
    try {
      await fetch(`/api/admin/categories/${id}`, { method:'DELETE' })
      await fetchAll()
    } catch(e) { setError('Delete failed') }
  }

  return (
    <div>
      <div style={{ marginBottom:'2.5rem' }}>
        <h1 style={{ fontFamily:'var(--font-playfair,serif)', fontSize:28, fontWeight:400, color:'var(--color-text-primary)', marginBottom:'0.35rem', letterSpacing:'-0.02em' }}>Categories</h1>
        <p style={{ fontSize:14, color:'var(--color-text-secondary)' }}>{loading ? 'Loading…' : `${cats.length} categories · Saves directly to Supabase`}</p>
      </div>

      {error && <div style={{ padding:'0.75rem 1rem', background:'rgba(255,80,80,0.08)', border:'0.5px solid rgba(255,80,80,0.3)', color:'#ff6060', fontSize:13, marginBottom:'1.5rem' }}>{error}</div>}

      {/* Add new */}
      <div style={{ border:'0.5px solid var(--color-border)', padding:'1.5rem', marginBottom:'2rem' }}>
        <h2 style={{ fontSize:11, fontWeight:500, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--color-text-tertiary)', marginBottom:'1rem' }}>Add New Category</h2>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr auto', gap:'1rem', alignItems:'flex-end' }}>
          <div>
            <label style={lbl}>Display Name *</label>
            <input value={newLabel} onChange={e=>{ setNewLabel(e.target.value); setNewSlug(e.target.value.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'')) }} placeholder="Fashion & Beauty" style={inp}/>
          </div>
          <div>
            <label style={lbl}>Slug (auto-generated)</label>
            <input value={newSlug} onChange={e=>setNewSlug(e.target.value)} placeholder="fashion-beauty" style={inp}/>
          </div>
          <button onClick={addCat} disabled={saving==='new' || !newLabel.trim()} className="btn-primary" style={{ opacity:!newLabel.trim()?0.5:1 }}>
            {saving==='new' ? 'Adding…' : 'Add'}
          </button>
        </div>
        <p style={{ fontSize:11, color:'var(--color-text-tertiary)', marginTop:'0.5rem' }}>The slug is used as the filter key — keep it lowercase with hyphens.</p>
      </div>

      {/* Category list */}
      {loading ? <div style={{ padding:'2rem', textAlign:'center', color:'var(--color-text-tertiary)' }}>Loading…</div> : (
        <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
          {cats.map(cat => {
            const count = videos.filter(v => v.category === cat.slug).length
            return (
              <div key={cat.id} style={{ display:'grid', gridTemplateColumns:'1fr auto auto', alignItems:'center', gap:'1.5rem', padding:'1.25rem 1.5rem', border:'0.5px solid var(--color-border)', background:'var(--color-surface-1)' }}>
                <div>
                  {editingId === cat.id ? (
                    <div style={{ display:'flex', gap:'0.5rem', alignItems:'center' }}>
                      <input value={editLabel} onChange={e=>setEditLabel(e.target.value)} style={{...inp, maxWidth:240}} autoFocus onKeyDown={e=>{ if(e.key==='Enter') updateLabel(cat.id); if(e.key==='Escape') setEditingId(null) }}/>
                      <button onClick={()=>updateLabel(cat.id)} disabled={saving===cat.id} className="btn-primary" style={{ fontSize:12, padding:'0.4rem 0.75rem' }}>Save</button>
                      <button onClick={()=>setEditingId(null)} style={{ background:'none', border:'none', color:'var(--color-text-tertiary)', cursor:'pointer', fontSize:12, fontFamily:'inherit' }}>Cancel</button>
                    </div>
                  ) : (
                    <>
                      <p style={{ fontSize:15, color:'var(--color-text-primary)', fontFamily:'var(--font-playfair,serif)', marginBottom:'0.2rem' }}>{cat.label}</p>
                      <p style={{ fontSize:11, color:'var(--color-text-tertiary)', letterSpacing:'0.06em' }}>slug: <code style={{ fontFamily:'"JetBrains Mono",monospace', background:'rgba(255,255,255,0.05)', padding:'0 4px' }}>{cat.slug}</code> · {count} videos</p>
                    </>
                  )}
                </div>
                <div style={{ display:'flex', gap:'0.5rem', flexShrink:0 }}>
                  <button onClick={()=>{ setEditingId(cat.id); setEditLabel(cat.label) }} style={{ background:'none', border:'0.5px solid var(--color-border)', color:'var(--color-accent)', padding:'0.3rem 0.75rem', fontSize:11, cursor:'pointer', fontFamily:'inherit' }}>Edit</button>
                  <button onClick={()=>deleteCat(cat.id, cat.slug)} style={{ background:'none', border:'none', color:'rgba(255,80,80,0.6)', fontSize:11, cursor:'pointer' }}>Delete</button>
                </div>
                <div style={{ fontSize:18, color:'var(--color-text-tertiary)', fontFamily:'var(--font-playfair,serif)', textAlign:'right', minWidth:32 }}>{count}</div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
const inp: React.CSSProperties = { width:'100%', background:'var(--color-surface-1)', border:'0.5px solid var(--color-border-mid)', padding:'0.625rem 0.875rem', fontSize:13, color:'var(--color-text-primary)', fontFamily:'inherit', outline:'none', boxSizing:'border-box' }
const lbl: React.CSSProperties = { display:'block', fontSize:10, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--color-text-tertiary)', marginBottom:4 }
