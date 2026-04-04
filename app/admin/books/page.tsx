'use client'
import { useState, useEffect } from 'react'
import ImageUpload from '@/components/ImageUpload'

interface Book {
  id: string
  title: string
  year: string
  language: string
  genre: string
  status: 'published' | 'upcoming'
  isbn: string
  synopsis: string
  cover_url: string
  amazon_url: string
  sort_order: number
}

const EMPTY: Omit<Book, 'id'> = {
  title: '', year: '', language: 'English', genre: '', status: 'published',
  isbn: '', synopsis: '', cover_url: '', amazon_url: '', sort_order: 99,
}

export default function AdminBooks() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'list' | 'edit' | 'new'>('list')
  const [editing, setEditing] = useState<Partial<Book>>({})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [del, setDel] = useState<string | null>(null)

  useEffect(() => { fetchBooks() }, [])

  const fetchBooks = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/books')
      const d = await res.json()
      if (!res.ok) throw new Error(d.error || 'Failed')
      setBooks(d.books || [])
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed to load') }
    finally { setLoading(false) }
  }

  const save = async () => {
    if (!editing.title) return
    setSaving(true); setError('')
    try {
      const isNew = view === 'new'
      if (isNew) {
        const { id: _id, ...body } = editing as Book
        const res = await fetch('/api/admin/books', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
        if (!res.ok) throw new Error((await res.json()).error)
      } else {
        const { id, ...body } = editing as Book
        const res = await fetch(`/api/admin/books/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
        if (!res.ok) throw new Error((await res.json()).error)
      }
      await fetchBooks()
      setView('list')
    } catch (e) { setError(e instanceof Error ? e.message : 'Save failed') }
    finally { setSaving(false) }
  }

  const upd = (k: keyof Book) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setEditing(p => ({ ...p, [k]: e.target.value }))

  if (view !== 'list') {
    const isNew = view === 'new'
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <button onClick={() => setView('list')} style={backBtn}>← Back</button>
          <h1 style={h1}>{isNew ? 'New Book' : `Edit — ${editing.title}`}</h1>
        </div>
        {error && <div style={errBox}>{error}</div>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: '2.5rem', alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div><label style={lbl}>Title *</label><input value={editing.title || ''} onChange={upd('title')} style={inp} placeholder="Book title" /></div>
              <div><label style={lbl}>Year</label><input value={editing.year || ''} onChange={upd('year')} style={inp} placeholder="2023" /></div>
              <div><label style={lbl}>Language</label><input value={editing.language || 'English'} onChange={upd('language')} style={inp} /></div>
              <div><label style={lbl}>Genre</label><input value={editing.genre || ''} onChange={upd('genre')} style={inp} placeholder="Psychology · Creativity" /></div>
              <div>
                <label style={lbl}>Status</label>
                <select value={editing.status || 'published'} onChange={upd('status')} style={inp}>
                  <option value="published">Published</option>
                  <option value="upcoming">Upcoming</option>
                </select>
              </div>
              <div><label style={lbl}>ISBN</label><input value={editing.isbn || ''} onChange={upd('isbn')} style={inp} placeholder="978-..." /></div>
            </div>
            <div><label style={lbl}>Synopsis</label><textarea value={editing.synopsis || ''} onChange={upd('synopsis')} rows={5} style={{ ...inp, resize: 'vertical' as const, lineHeight: 1.7 }} placeholder="Book description..." /></div>
            <div><label style={lbl}>Amazon / Buy Link</label><input value={editing.amazon_url || ''} onChange={upd('amazon_url')} style={inp} placeholder="https://amzn.in/..." /></div>
            <ImageUpload
              value={editing.cover_url || ''}
              onChange={v => setEditing(p => ({ ...p, cover_url: v }))}
              label="Book Cover"
              hint="Upload from your computer or paste a URL. Portrait (2:3) ratio works best."
              aspect="2/3"
              bucket="books"
            />
            <button onClick={save} disabled={saving} className="btn-primary" style={{ alignSelf: 'flex-start', opacity: saving ? 0.6 : 1 }}>
              {saving ? 'Saving…' : isNew ? 'Add Book' : 'Save Changes'}
            </button>
          </div>
          <div style={{ position: 'sticky', top: '1rem' }}>
            <p style={{ fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: '0.75rem' }}>Cover Preview</p>
            {editing.cover_url ? (
              <img src={editing.cover_url} alt="cover" style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover', display: 'block', border: '0.5px solid var(--color-border)' }} />
            ) : (
              <div style={{ aspectRatio: '2/3', border: '0.5px dashed var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ fontSize: 11, color: 'var(--color-text-tertiary)', textAlign: 'center' }}>Cover preview</p>
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
          <h1 style={h1}>Books</h1>
          <p style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
            {loading ? 'Loading…' : `${books.length} books · Saves directly to Supabase`}
          </p>
        </div>
        <button onClick={() => { setEditing({ ...EMPTY }); setView('new') }} className="btn-primary">+ Add Book</button>
      </div>
      {error && <div style={{ ...errBox, marginBottom: '1.5rem' }}>{error}</div>}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-tertiary)' }}>Loading…</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
          {books.map(book => (
            <div key={book.id} style={{ border: '0.5px solid var(--color-border)', overflow: 'hidden', background: 'var(--color-surface-1)' }}>
              {book.cover_url ? (
                <img src={book.cover_url} alt={book.title} style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover', display: 'block' }} />
              ) : (
                <div style={{ aspectRatio: '2/3', background: '#181818', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '0.5rem' }}>
                  <span style={{ fontFamily: 'var(--font-playfair,serif)', fontSize: 16, color: 'rgba(255,255,255,0.1)', padding: '0 1rem', textAlign: 'center' }}>{book.title}</span>
                  <span style={{ fontSize: 9, color: 'rgba(232,104,58,0.5)', letterSpacing: '0.08em' }}>NO COVER YET</span>
                </div>
              )}
              <div style={{ padding: '1rem' }}>
                <p style={{ fontSize: 9, color: book.status === 'published' ? 'rgba(80,200,120,0.9)' : 'var(--color-accent)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                  {book.status === 'published' ? 'Published' : 'Upcoming'} · {book.year}
                </p>
                <p style={{ fontFamily: 'var(--font-playfair,serif)', fontSize: 15, color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>{book.title}</p>
                <p style={{ fontSize: 11, color: 'var(--color-text-tertiary)', marginBottom: '0.875rem' }}>{book.genre}</p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => { setEditing({ ...book }); setView('edit') }} style={{ flex: 1, background: 'none', border: '0.5px solid var(--color-border)', color: 'var(--color-accent)', padding: '0.4rem', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}>Edit</button>
                  {book.amazon_url && <a href={book.amazon_url} target="_blank" rel="noopener noreferrer" style={{ flex: 1, background: 'none', border: '0.5px solid var(--color-border)', color: 'var(--color-text-secondary)', padding: '0.4rem', fontSize: 11, textDecoration: 'none', textAlign: 'center', display: 'block' }}>Amazon ↗</a>}
                  <button onClick={() => setDel(book.id)} style={{ background: 'none', border: 'none', color: 'rgba(255,80,80,0.6)', fontSize: 11, cursor: 'pointer' }}>Del</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {del && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div style={{ background: '#111', border: '0.5px solid var(--color-border)', padding: '2rem', maxWidth: 360, width: '90%' }}>
            <p style={{ fontSize: 15, color: 'var(--color-text-primary)', marginBottom: '1.5rem' }}>Delete this book from Supabase?</p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={async () => { await fetch(`/api/admin/books/${del}`, { method: 'DELETE' }); setBooks(b => b.filter(x => x.id !== del)); setDel(null) }} style={{ background: 'rgba(255,80,80,0.15)', border: '0.5px solid rgba(255,80,80,0.4)', color: '#ff6060', padding: '0.625rem 1.25rem', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>Delete</button>
              <button onClick={() => setDel(null)} className="btn-ghost" style={{ fontSize: 13 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
const inp: React.CSSProperties = { width: '100%', background: 'var(--color-surface-1)', border: '0.5px solid var(--color-border-mid)', padding: '0.625rem 0.875rem', fontSize: 13, color: 'var(--color-text-primary)', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }
const lbl: React.CSSProperties = { display: 'block', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 4 }
const h1: React.CSSProperties = { fontFamily: 'var(--font-playfair,serif)', fontSize: 28, fontWeight: 400, color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }
const backBtn: React.CSSProperties = { background: 'none', border: '0.5px solid var(--color-border)', color: 'var(--color-text-secondary)', padding: '0.5rem 1rem', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }
const errBox: React.CSSProperties = { padding: '0.75rem 1rem', background: 'rgba(255,80,80,0.08)', border: '0.5px solid rgba(255,80,80,0.3)', color: '#ff6060', fontSize: 13 }
