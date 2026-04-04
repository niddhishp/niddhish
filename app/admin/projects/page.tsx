'use client'
import { useState } from 'react'
import Image from 'next/image'
import { VIDEOS, getThumbnail, CATEGORY_LABELS, type VideoCategory } from '@/lib/videos'

type Video = typeof VIDEOS[number]
type View = 'list' | 'edit' | 'new'

const CATS = Object.keys(CATEGORY_LABELS) as VideoCategory[]
const EMPTY: Partial<Video> = { title: '', brand: '', category: 'ai', duration: '', description: '', source: 'vimeo', id: '' }

export default function AdminProjects() {
  const [view, setView] = useState<View>('list')
  const [editing, setEditing] = useState<Partial<Video>>(EMPTY)
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('All')
  const [saved, setSaved] = useState(false)

  const filtered = VIDEOS.filter(v => {
    const c = filterCat === 'All' || CATEGORY_LABELS[v.category] === filterCat
    const s = !search || v.title.toLowerCase().includes(search.toLowerCase()) || v.brand.toLowerCase().includes(search.toLowerCase())
    return c && s
  })

  if (view !== 'list') {
    const isNew = view === 'new'
    return (
      <div>
        <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'2rem' }}>
          <button onClick={()=>{setView('list'); setSaved(false)}} style={{ background:'none', border:'0.5px solid var(--color-border)', color:'var(--color-text-secondary)', padding:'0.5rem 1rem', cursor:'pointer', fontSize:13, fontFamily:'inherit' }}>← Back</button>
          <h1 style={{ fontFamily:'var(--font-playfair,serif)', fontSize:24, fontWeight:400, color:'var(--color-text-primary)' }}>{isNew ? 'New Project' : 'Edit Project'}</h1>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:'2.5rem', alignItems:'start' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
              <div><label style={lbl}>Title *</label><input value={editing.title||''} onChange={e=>setEditing(p=>({...p,title:e.target.value}))} style={inp} placeholder="Ride Back to Yourself"/></div>
              <div><label style={lbl}>Brand / Client *</label><input value={editing.brand||''} onChange={e=>setEditing(p=>({...p,brand:e.target.value}))} style={inp} placeholder="Harley Davidson"/></div>
              <div>
                <label style={lbl}>Category</label>
                <select value={editing.category} onChange={e=>setEditing(p=>({...p,category:e.target.value as VideoCategory}))} style={inp}>
                  {CATS.map(c => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>Source</label>
                <select value={editing.source} onChange={e=>setEditing(p=>({...p,source:e.target.value as 'vimeo'|'youtube'}))} style={inp}>
                  <option value="vimeo">Vimeo</option>
                  <option value="youtube">YouTube</option>
                </select>
              </div>
              <div><label style={lbl}>Video ID</label><input value={editing.id||''} onChange={e=>setEditing(p=>({...p,id:e.target.value}))} style={inp} placeholder="Vimeo or YouTube ID"/></div>
              <div><label style={lbl}>Duration</label><input value={editing.duration||''} onChange={e=>setEditing(p=>({...p,duration:e.target.value}))} style={inp} placeholder="1:23"/></div>
            </div>
            <div><label style={lbl}>Description</label><textarea value={editing.description||''} onChange={e=>setEditing(p=>({...p,description:e.target.value}))} rows={4} style={{...inp,resize:'vertical' as const}} placeholder="Film description..." /></div>
            <div style={{ display:'flex', gap:'1rem', alignItems:'center' }}>
              <button onClick={()=>setSaved(true)} className="btn-primary">{saved ? 'Saved ✓' : isNew ? 'Add Project' : 'Save Changes'}</button>
              <p style={{ fontSize:11, color:'var(--color-text-tertiary)' }}>Projects currently stored in lib/videos.ts — connect Supabase to enable live editing</p>
            </div>
          </div>
          {editing.id && (
            <div style={{ border:'0.5px solid var(--color-border)', overflow:'hidden', position:'sticky', top:'1rem' }}>
              <div style={{ position:'relative', aspectRatio:'16/9', background:'#111' }}>
                {editing.source === 'vimeo' ? (
                  <img src={`https://vimeocdn.com/video/${editing.id}_640.jpg`} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                ) : (
                  <img src={`https://i.ytimg.com/vi/${editing.id}/maxresdefault.jpg`} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                )}
              </div>
              <div style={{ padding:'0.875rem' }}>
                <p style={{ fontSize:11, color:'var(--color-text-tertiary)' }}>Thumbnail auto-fetched from video ID</p>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'2rem', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <h1 style={{ fontFamily:'var(--font-playfair,serif)', fontSize:28, fontWeight:400, color:'var(--color-text-primary)', marginBottom:'0.35rem', letterSpacing:'-0.02em' }}>Projects</h1>
          <p style={{ fontSize:14, color:'var(--color-text-secondary)' }}>{VIDEOS.length} videos across 6 categories</p>
        </div>
        <button onClick={()=>{setEditing(EMPTY); setView('new')}} className="btn-primary">+ Add Project</button>
      </div>

      <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'1.5rem', flexWrap:'wrap' }}>
        <div style={{ display:'flex', gap:0, borderBottom:'0.5px solid var(--color-border)', flex:1, minWidth:280, overflowX:'auto' }}>
          {['All', ...Object.values(CATEGORY_LABELS)].map(c => (
            <button key={c} onClick={()=>setFilterCat(c)} style={{ fontSize:11, padding:'0.625rem 0.875rem', background:'transparent', border:'none', borderBottom: filterCat===c ? '1.5px solid var(--color-accent)' : '1.5px solid transparent', color: filterCat===c ? 'var(--color-accent)' : 'var(--color-text-secondary)', cursor:'pointer', fontFamily:'inherit', whiteSpace:'nowrap' }}>{c}</button>
          ))}
        </div>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." style={{ background:'var(--color-surface-1)', border:'0.5px solid var(--color-border)', padding:'0.5rem 0.875rem', fontSize:12, color:'var(--color-text-primary)', fontFamily:'inherit', outline:'none', width:180 }} />
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:'0.75rem' }}>
        {filtered.map(v => (
          <div key={v.id} style={{ border:'0.5px solid var(--color-border)', overflow:'hidden', background:'var(--color-surface-1)' }}>
            <div style={{ position:'relative', aspectRatio:'16/9', background:'#111' }}>
              <Image src={getThumbnail(v)} alt={v.title} fill style={{ objectFit:'cover' }} unoptimized />
              <span style={{ position:'absolute', top:5, right:5, fontSize:8, background: v.source==='youtube' ? 'rgba(255,0,0,0.8)' : 'rgba(26,183,234,0.8)', color:'#fff', padding:'1px 5px', letterSpacing:'0.06em', borderRadius:1 }}>{v.source==='youtube' ? 'YT' : 'Vi'}</span>
            </div>
            <div style={{ padding:'0.75rem' }}>
              <p style={{ fontSize:9, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--color-accent)', marginBottom:'0.2rem' }}>{v.brand}</p>
              <p style={{ fontSize:12, color:'var(--color-text-primary)', lineHeight:1.3, fontFamily:'var(--font-playfair,serif)', marginBottom:'0.4rem' }}>{v.title}</p>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:10, color:'var(--color-text-tertiary)' }}>{v.duration} · {CATEGORY_LABELS[v.category]}</span>
                <button onClick={()=>{setEditing(v); setView('edit')}} style={{ background:'none', border:'none', color:'var(--color-accent)', fontSize:11, cursor:'pointer', padding:0 }}>Edit</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
const inp: React.CSSProperties = { width:'100%', background:'var(--color-surface-1)', border:'0.5px solid var(--color-border-mid)', padding:'0.625rem 0.875rem', fontSize:14, color:'var(--color-text-primary)', fontFamily:'inherit', outline:'none', boxSizing:'border-box' }
const lbl: React.CSSProperties = { display:'block', fontSize:11, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--color-text-tertiary)', marginBottom:'0.4rem' }
