'use client'
import { useState } from 'react'
import Image from 'next/image'
import { FEATURE_FILMS } from '@/lib/videos'

type Status = 'release' | 'post' | 'production'
interface AdminFilm {
  slug: string; title: string; year: string; genre: string; language: string
  tagline: string; synopsis: string; cast: string; statusLabel: string
  status: Status; posterUrl: string | null
}

const toAdmin = (f: typeof FEATURE_FILMS[number]): AdminFilm => ({
  slug: f.slug, title: f.title, year: f.year, genre: f.genre,
  language: f.language, tagline: f.tagline, synopsis: f.synopsis,
  cast: f.cast, status: f.status, statusLabel: f.statusLabel,
  posterUrl: f.posterUrl ?? null,
})

type View = 'list' | 'edit' | 'new'
const EMPTY: AdminFilm = { slug:'', title:'', year:'', genre:'', language:'Hindi', tagline:'', synopsis:'', cast:'', status:'production', statusLabel:'In Production', posterUrl:null }

export default function AdminFilmsPage() {
  const [view, setView] = useState<View>('list')
  const [editing, setEditing] = useState<AdminFilm>(EMPTY)
  const [del, setDel] = useState<string|null>(null)
  const [films, setFilms] = useState<AdminFilm[]>(FEATURE_FILMS.map(toAdmin))
  const upd = (k: keyof AdminFilm) => (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) =>
    setEditing(p => ({ ...p, [k]: e.target.value }))

  if (view !== 'list') {
    const isNew = view === 'new'
    return (
      <div>
        <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'2rem' }}>
          <button onClick={()=>setView('list')} style={backBtn}>← Back</button>
          <h1 style={h1}>{isNew ? 'New Feature Film' : `Edit — ${editing.title}`}</h1>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 260px', gap:'2.5rem', alignItems:'start' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
              <div><label style={lbl}>Title *</label><input value={editing.title} onChange={upd('title')} style={inp} placeholder="EGO"/></div>
              <div><label style={lbl}>Year</label><input value={editing.year} onChange={upd('year')} style={inp} placeholder="2024"/></div>
              <div>
                <label style={lbl}>Language</label>
                <select value={editing.language} onChange={upd('language')} style={inp}>
                  {['Hindi','Malayalam','Tamil','Telugu','English'].map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div><label style={lbl}>Genre</label><input value={editing.genre} onChange={upd('genre')} style={inp} placeholder="Drama-Comedy"/></div>
              <div>
                <label style={lbl}>Status</label>
                <select value={editing.status} onChange={upd('status')} style={inp}>
                  <option value="release">Coming Soon / Release</option>
                  <option value="post">Post Production</option>
                  <option value="production">In Production</option>
                </select>
              </div>
              <div><label style={lbl}>Status Label</label><input value={editing.statusLabel} onChange={upd('statusLabel')} style={inp} placeholder="Coming Soon"/></div>
            </div>
            <div><label style={lbl}>Tagline</label><input value={editing.tagline} onChange={upd('tagline')} style={inp} placeholder="One line about the film..."/></div>
            <div><label style={lbl}>Synopsis</label><textarea value={editing.synopsis} onChange={upd('synopsis')} rows={5} style={{...inp,resize:'vertical' as const,lineHeight:1.7}} placeholder="Film synopsis..."/></div>
            <div><label style={lbl}>Cast (comma separated)</label><input value={editing.cast} onChange={upd('cast')} style={inp} placeholder="Arshad Warsi, Juhi Chawla..."/></div>
            <div><label style={lbl}>Film Poster URL</label><input value={editing.posterUrl||''} onChange={e=>setEditing(p=>({...p,posterUrl:e.target.value||null}))} style={inp} placeholder="https://... (leave blank if no poster yet)"/></div>
            <button onClick={()=>{ isNew ? setFilms(f=>[...f,{...editing,slug:editing.title.toLowerCase().replace(/\s+/g,'-')}]) : setFilms(f=>f.map(x=>x.slug===editing.slug?{...editing}:x)); setView('list') }} className="btn-primary" style={{ alignSelf:'flex-start' }}>{isNew ? 'Add Film' : 'Save Changes'}</button>
          </div>
          <div style={{ position:'sticky', top:'1rem' }}>
            {editing.posterUrl ? (
              <div style={{ border:'0.5px solid var(--color-border)', overflow:'hidden' }}>
                <Image src={editing.posterUrl} alt="poster" width={260} height={390} style={{ objectFit:'cover', display:'block', width:'100%', height:'auto' }} unoptimized/>
              </div>
            ) : (
              <div style={{ border:'0.5px dashed var(--color-border)', aspectRatio:'2/3', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <p style={{ fontSize:11, color:'var(--color-text-tertiary)', textAlign:'center', padding:'1rem' }}>Poster appears here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'2.5rem', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <h1 style={h1}>Feature Films</h1>
          <p style={{ fontSize:14, color:'var(--color-text-secondary)' }}>{films.length} films</p>
        </div>
        <button onClick={()=>{setEditing(EMPTY); setView('new')}} className="btn-primary">+ Add Film</button>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:'1.5rem' }}>
        {films.map(film => (
          <div key={film.slug} style={{ border:'0.5px solid var(--color-border)', overflow:'hidden', background:'var(--color-surface-1)' }}>
            {film.posterUrl ? (
              <div style={{ position:'relative', aspectRatio:'2/3', background:'#111' }}>
                <Image src={film.posterUrl} alt={film.title} fill style={{ objectFit:'cover', objectPosition:'top' }} unoptimized/>
              </div>
            ) : (
              <div style={{ aspectRatio:'2/3', background:'#181818', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <span style={{ fontFamily:'var(--font-playfair,serif)', fontSize:20, color:'rgba(255,255,255,0.12)' }}>{film.title}</span>
              </div>
            )}
            <div style={{ padding:'1rem' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.4rem', marginBottom:'0.3rem', flexWrap:'wrap' }}>
                <span style={{ fontFamily:'var(--font-playfair,serif)', fontSize:15, color:'var(--color-text-primary)' }}>{film.title}</span>
                <span style={{ fontSize:9, letterSpacing:'0.08em', textTransform:'uppercase', padding:'1px 6px', borderRadius:1,
                  color: film.status==='release'?'#e8683a': film.status==='post'?'#84a8e8':'#c8c870',
                  border:`0.5px solid ${film.status==='release'?'rgba(232,104,58,0.4)': film.status==='post'?'rgba(100,140,220,0.35)':'rgba(180,180,100,0.35)'}`,
                }}>{film.statusLabel}</span>
              </div>
              <p style={{ fontSize:11, color:'var(--color-text-tertiary)', marginBottom:'0.875rem' }}>{film.language} · {film.genre} · {film.year}</p>
              <div style={{ display:'flex', gap:'0.5rem' }}>
                <button onClick={()=>{setEditing({...film}); setView('edit')}} style={{ flex:1, background:'none', border:'0.5px solid var(--color-border)', color:'var(--color-accent)', padding:'0.4rem', fontSize:11, cursor:'pointer', fontFamily:'inherit' }}>Edit</button>
                <button onClick={()=>setDel(film.slug)} style={{ background:'none', border:'none', color:'rgba(255,80,80,0.6)', fontSize:11, cursor:'pointer' }}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {del && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:200 }}>
          <div style={{ background:'#111', border:'0.5px solid var(--color-border)', padding:'2rem', maxWidth:360, width:'90%' }}>
            <p style={{ fontSize:15, color:'var(--color-text-primary)', marginBottom:'1.5rem' }}>Delete this film?</p>
            <div style={{ display:'flex', gap:'0.75rem' }}>
              <button onClick={()=>{setFilms(f=>f.filter(x=>x.slug!==del)); setDel(null)}} style={{ background:'rgba(255,80,80,0.15)', border:'0.5px solid rgba(255,80,80,0.4)', color:'#ff6060', padding:'0.625rem 1.25rem', cursor:'pointer', fontSize:13, fontFamily:'inherit' }}>Delete</button>
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
