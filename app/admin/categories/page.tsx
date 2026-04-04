'use client'
import { useState } from 'react'
import { VIDEOS, CATEGORY_LABELS, type VideoCategory } from '@/lib/videos'

export default function AdminCategories() {
  const [newCat, setNewCat] = useState('')
  const cats = Object.entries(CATEGORY_LABELS) as [VideoCategory, string][]

  return (
    <div>
      <div style={{ marginBottom:'2.5rem', display:'flex', justifyContent:'space-between', alignItems:'flex-end', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <h1 style={{ fontFamily:'var(--font-playfair,serif)', fontSize:28, fontWeight:400, color:'var(--color-text-primary)', marginBottom:'0.35rem', letterSpacing:'-0.02em' }}>Categories</h1>
          <p style={{ fontSize:14, color:'var(--color-text-secondary)' }}>{cats.length} categories · Manage categories and assign projects</p>
        </div>
      </div>

      {/* Add new */}
      <div style={{ border:'0.5px solid var(--color-border)', padding:'1.5rem', marginBottom:'2rem', display:'flex', gap:'1rem', alignItems:'flex-end' }}>
        <div style={{ flex:1 }}>
          <label style={{ display:'block', fontSize:11, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--color-text-tertiary)', marginBottom:'0.4rem' }}>New Category Name</label>
          <input value={newCat} onChange={e=>setNewCat(e.target.value)} placeholder="e.g. Sports" style={{ width:'100%', background:'var(--color-surface-1)', border:'0.5px solid var(--color-border-mid)', padding:'0.625rem 0.875rem', fontSize:14, color:'var(--color-text-primary)', fontFamily:'inherit', outline:'none', boxSizing:'border-box' as const }} />
        </div>
        <button onClick={()=>setNewCat('')} className="btn-primary">Add Category</button>
      </div>

      {/* Category list */}
      <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
        {cats.map(([slug, label]) => {
          const count = VIDEOS.filter(v => v.category === slug).length
          return (
            <div key={slug} style={{ display:'grid', gridTemplateColumns:'1fr auto auto', alignItems:'center', gap:'1.5rem', padding:'1.25rem 1.5rem', border:'0.5px solid var(--color-border)', background:'var(--color-surface-1)' }}>
              <div>
                <p style={{ fontSize:15, color:'var(--color-text-primary)', fontFamily:'var(--font-playfair,serif)', marginBottom:'0.2rem' }}>{label}</p>
                <p style={{ fontSize:11, color:'var(--color-text-tertiary)', letterSpacing:'0.06em' }}>{count} projects</p>
              </div>
              <div style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap' }}>
                {VIDEOS.filter(v=>v.category===slug).slice(0,4).map(v => (
                  <span key={v.id} style={{ fontSize:10, padding:'2px 7px', background:'rgba(232,104,58,0.08)', color:'var(--color-accent)', border:'0.5px solid rgba(232,104,58,0.2)', borderRadius:1 }}>{v.brand}</span>
                ))}
                {count > 4 && <span style={{ fontSize:10, color:'var(--color-text-tertiary)', padding:'2px 4px' }}>+{count-4}</span>}
              </div>
              <div style={{ display:'flex', gap:'0.5rem' }}>
                <button style={{ background:'none', border:'0.5px solid var(--color-border)', color:'var(--color-text-secondary)', padding:'0.3rem 0.75rem', fontSize:11, cursor:'pointer', fontFamily:'inherit' }}>Edit</button>
                <button style={{ background:'none', border:'none', color:'rgba(255,80,80,0.6)', fontSize:11, cursor:'pointer' }}>Delete</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
