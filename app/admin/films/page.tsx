'use client'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import ImageUpload from '@/components/ImageUpload'

interface DbFilm {
  id: string
  title: string
  year: string
  genre: string
  tagline: string
  synopsis: string
  cast_members: string
  status: 'release' | 'post' | 'production'
  status_label: string
  poster_url: string | null
  sort_order: number
  bts_images?: string[]
}

// Small inline upload button for BTS images
function BtsUpload({ onUpload }: { onUpload: (url: string) => void }) {
  const [uploading, setUploading] = useState(false)
  const ref = useRef<HTMLInputElement>(null)
  const handle = async (file: File) => {
    setUploading(true)
    try {
      const fd = new FormData(); fd.append('file', file); fd.append('bucket', 'bts')
      const res = await fetch('/api/admin/upload', { method:'POST', body:fd })
      const d = await res.json()
      if (d.url) onUpload(d.url)
    } finally { setUploading(false) }
  }
  return (
    <div
      onClick={()=>ref.current?.click()}
      style={{ aspectRatio:'16/9', border:'0.5px dashed var(--color-border)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', background:'var(--color-surface-1)', flexDirection:'column', gap:4 }}
    >
      <span style={{ fontSize:20, opacity:0.3 }}>+</span>
      <span style={{ fontSize:10, color:'var(--color-text-tertiary)', textTransform:'uppercase', letterSpacing:'0.08em' }}>{uploading ? 'Uploading…' : 'Add BTS'}</span>
      <input ref={ref} type="file" accept="image/*" style={{ display:'none' }} onChange={e=>{ const f=e.target.files?.[0]; if(f) handle(f) }}/>
    </div>
  )
}

type View = 'list' | 'edit' | 'new'
const EMPTY: Omit<DbFilm, 'id'> = {
  title: '', year: '', genre: '', tagline: '', synopsis: '', cast_members: '',
  status: 'production', status_label: 'In Production',
  poster_url: null, sort_order: 99, bts_images: [],
}

const STATUS_COLOR = {
  release: '#e8683a',
  post: '#84a8e8',
  production: '#c8c870',
}

export default function AdminFilmsPage() {
  const [films, setFilms] = useState<DbFilm[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<View>('list')
  const [editing, setEditing] = useState<Partial<DbFilm>>({})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [del, setDel] = useState<string | null>(null)

  useEffect(() => { fetchFilms() }, [])

  const fetchFilms = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/films')
      const d = await res.json()
      if (!res.ok) throw new Error(d.error || 'Failed to load')
      setFilms(d.films || [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load films')
    } finally {
      setLoading(false)
    }
  }

  const save = async () => {
    if (!editing.title) return
    setSaving(true); setError('')
    try {
      const isNew = view === 'new'
      const prepBody = (body: Partial<DbFilm>) => ({
        ...body,
        bts_images: body.bts_images || [],
      })
      if (isNew) {
        const { id: _id, ...body } = editing as DbFilm
        const res = await fetch('/api/admin/films', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(prepBody(body)) })
        const d = await res.json()
        if (!res.ok) throw new Error(d.error || 'Failed to create')
      } else {
        const { id, ...body } = editing as DbFilm
        const res = await fetch(`/api/admin/films/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(prepBody(body)) })
        const d = await res.json()
        if (!res.ok) throw new Error(d.error || 'Failed to save')
      }
      await fetchFilms()
      setView('list')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const deleteFilm = async (id: string) => {
    await fetch(`/api/admin/films/${id}`, { method: 'DELETE' })
    setFilms(f => f.filter(x => x.id !== id))
    setDel(null)
  }

  const upd = (k: keyof DbFilm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setEditing(p => ({ ...p, [k]: e.target.value }))

  if (view !== 'list') {
    const isNew = view === 'new'
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <button onClick={() => setView('list')} style={backBtn}>← Back</button>
          <h1 style={h1}>{isNew ? 'New Film' : `Edit — ${editing.title}`}</h1>
        </div>
        {error && <div style={errBox}>{error}</div>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '2.5rem', alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div><label style={lbl}>Title *</label><input value={editing.title || ''} onChange={upd('title')} style={inp} placeholder="EGO" /></div>
              <div><label style={lbl}>Year</label><input value={editing.year || ''} onChange={upd('year')} style={inp} placeholder="2024" /></div>
              <div>
                <label style={lbl}>Language · Genre</label>
                <input value={editing.genre || ''} onChange={upd('genre')} style={inp} placeholder="Feature Film · Hindi · Drama-Comedy" />
              </div>
              <div>
                <label style={lbl}>Status</label>
                <select value={editing.status || 'production'} onChange={upd('status')} style={inp}>
                  <option value="release">Coming Soon / Release</option>
                  <option value="post">Post Production</option>
                  <option value="production">In Production</option>
                </select>
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={lbl}>Status Label</label>
                <input value={editing.status_label || ''} onChange={upd('status_label')} style={inp} placeholder="Coming Soon" />
              </div>
            </div>
            <div><label style={lbl}>Tagline</label><input value={editing.tagline || ''} onChange={upd('tagline')} style={inp} placeholder="One line about the film..." /></div>
            <div><label style={lbl}>Synopsis</label><textarea value={editing.synopsis||''} onChange={e=>setEditing(p=>({...p,synopsis:e.target.value}))} rows={4} style={{ ...inp, resize: 'vertical' as const, lineHeight: 1.7 }} placeholder="Film synopsis..." /></div>
            {/* BTS Images */}
            <div>
              <label style={lbl}>Behind The Scenes Images</label>
              <p style={{ fontSize:11, color:'var(--color-text-tertiary)', marginBottom:'0.75rem', lineHeight:1.5 }}>
                Upload BTS photos — shown on the film detail page. Each uploads to Supabase Storage.
              </p>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0.75rem', marginBottom:'0.75rem' }}>
                {(editing.bts_images||[]).map((url:string, i:number) => (
                  <div key={i} style={{ position:'relative', aspectRatio:'16/9', overflow:'hidden', background:'#111' }}>
                    <img src={url} alt={`BTS ${i+1}`} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                    <button
                      onClick={()=>setEditing(p=>({...p,btsImages:(p.bts_images||[]).filter((_:string,j:number)=>j!==i)}))}
                      style={{ position:'absolute', top:4, right:4, background:'rgba(0,0,0,0.7)', border:'none', color:'#fff', width:20, height:20, cursor:'pointer', fontSize:12, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:2 }}
                    >×</button>
                  </div>
                ))}
                <BtsUpload onUpload={(url:string)=>setEditing(p=>({...p,btsImages:[...(p.bts_images||[]),url]}))} />
              </div>
            </div>
            <div><label style={lbl}>Cast (comma separated)</label><input value={editing.cast_members || ''} onChange={upd('cast_members')} style={inp} placeholder="Arshad Warsi, Juhi Chawla..." /></div>
            <ImageUpload
              value={editing.poster_url || ''}
              onChange={v => setEditing(p => ({ ...p, poster_url: v || null }))}
              label="Film Poster"
              hint="Upload from your computer or paste a URL. Portrait (2:3) aspect ratio works best."
              aspect="2/3"
              bucket="posters"
            />
            <button onClick={save} disabled={saving} className="btn-primary" style={{ alignSelf: 'flex-start', opacity: saving ? 0.6 : 1 }}>
              {saving ? 'Saving…' : isNew ? 'Add Film' : 'Save Changes'}
            </button>
          </div>
          <div style={{ position: 'sticky', top: '1rem' }}>
            <p style={{ fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: '0.75rem' }}>Poster Preview</p>
            {editing.poster_url ? (
              <div style={{ border: '0.5px solid var(--color-border)', overflow: 'hidden' }}>
                <img src={editing.poster_url} alt="poster" style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover', objectPosition: 'top', display: 'block' }} />
              </div>
            ) : (
              <div style={{ aspectRatio: '2/3', border: '0.5px dashed var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ fontSize: 11, color: 'var(--color-text-tertiary)', textAlign: 'center', padding: '1rem' }}>Poster appears here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={h1}>Feature Films</h1>
          <p style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
            {loading ? 'Loading…' : `${films.length} films · Saves directly to Supabase`}
          </p>
        </div>
        <button onClick={() => { setEditing({ ...EMPTY }); setView('new') }} className="btn-primary">+ Add Film</button>
      </div>

      {error && <div style={{ ...errBox, marginBottom: '1.5rem' }}>{error}</div>}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-tertiary)' }}>Loading…</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
          {films.map(film => (
            <div key={film.id} style={{ border: '0.5px solid var(--color-border)', overflow: 'hidden', background: 'var(--color-surface-1)' }}>
              {film.poster_url ? (
                <div style={{ position: 'relative', aspectRatio: '2/3', background: '#111' }}>
                  <Image src={film.poster_url} alt={film.title} fill unoptimized style={{ objectFit: 'cover', objectPosition: 'top' }} />
                </div>
              ) : (
                <div style={{ aspectRatio: '2/3', background: '#181818', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '0.5rem' }}>
                  <span style={{ fontFamily: 'var(--font-playfair,serif)', fontSize: 20, color: 'rgba(255,255,255,0.1)' }}>{film.title}</span>
                  <span style={{ fontSize: 10, color: 'rgba(232,104,58,0.6)', letterSpacing: '0.08em' }}>NO POSTER YET</span>
                </div>
              )}
              <div style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'var(--font-playfair,serif)', fontSize: 15, color: 'var(--color-text-primary)' }}>{film.title}</span>
                  <span style={{
                    fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '1px 6px', borderRadius: 1,
                    color: STATUS_COLOR[film.status],
                    border: `0.5px solid ${STATUS_COLOR[film.status]}66`,
                  }}>{film.status_label}</span>
                </div>
                <p style={{ fontSize: 11, color: 'var(--color-text-tertiary)', marginBottom: '0.875rem' }}>{film.genre} · {film.year}</p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => { setEditing({ ...film }); setView('edit') }}
                    style={{ flex: 1, background: 'none', border: '0.5px solid var(--color-border)', color: 'var(--color-accent)', padding: '0.4rem', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}
                  >Edit</button>
                  <button onClick={() => setDel(film.id)} style={{ background: 'none', border: 'none', color: 'rgba(255,80,80,0.6)', fontSize: 11, cursor: 'pointer' }}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {del && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div style={{ background: '#111', border: '0.5px solid var(--color-border)', padding: '2rem', maxWidth: 360, width: '90%' }}>
            <p style={{ fontSize: 15, color: 'var(--color-text-primary)', marginBottom: '1.5rem' }}>Delete this film from Supabase?</p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => deleteFilm(del)} style={{ background: 'rgba(255,80,80,0.15)', border: '0.5px solid rgba(255,80,80,0.4)', color: '#ff6060', padding: '0.625rem 1.25rem', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>Delete</button>
              <button onClick={() => setDel(null)} className="btn-ghost" style={{ fontSize: 13 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const inp: React.CSSProperties = { width: '100%', background: 'var(--color-surface-1)', border: '0.5px solid var(--color-border-mid)', padding: '0.625rem 0.875rem', fontSize: 13, color: 'var(--color-text-primary)', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }
const lbl: React.CSSProperties = { display: 'block', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: '0.35rem' }
const h1: React.CSSProperties = { fontFamily: 'var(--font-playfair,serif)', fontSize: 28, fontWeight: 400, color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }
const backBtn: React.CSSProperties = { background: 'none', border: '0.5px solid var(--color-border)', color: 'var(--color-text-secondary)', padding: '0.5rem 1rem', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }
const errBox: React.CSSProperties = { padding: '0.75rem 1rem', background: 'rgba(255,80,80,0.08)', border: '0.5px solid rgba(255,80,80,0.3)', color: '#ff6060', fontSize: 13 }
