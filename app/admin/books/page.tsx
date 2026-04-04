'use client'
import ImageUpload from '@/components/ImageUpload'
import { useState } from 'react'

const INITIAL_BOOKS = [
  { id:'1', title:'Dare to Create', year:'2021', language:'English', genre:'Psychology · Creativity', status:'published', isbn:'', synopsis:'The psychology of the creative mind. A deep dive into how creativity works, what blocks it, and how to engineer breakthroughs.', coverUrl:'', amazonUrl:'https://amzn.in/d/07JjynNK' },
  { id:'2', title:'99 Lies They Sold Us', year:'2022', language:'English', genre:'Brand Strategy · Psychology', status:'published', isbn:'', synopsis:'Applied creativity for brand communication. A myth-busting guide to how brands really connect with people.', coverUrl:'', amazonUrl:'https://amzn.in/d/0bUmlxHD' },
  { id:'3', title:'Spark Your Creativity', year:'2023', language:'English', genre:'Creativity · AI', status:'published', isbn:'', synopsis:'Creative intelligence in the age of AI. How to stay powerfully creative when machines can generate anything.', coverUrl:'', amazonUrl:'https://amzn.in/d/00yQrwuZ' },
]
type Book = typeof INITIAL_BOOKS[number]
const EMPTY: Omit<Book,'id'> = { title:'', year:'', language:'English', genre:'', status:'published', isbn:'', synopsis:'', coverUrl:'', amazonUrl:'' }

export default function AdminBooks() {
  const [books, setBooks] = useState(INITIAL_BOOKS)
  const [view, setView] = useState<'list'|'edit'|'new'>('list')
  const [editing, setEditing] = useState<Partial<Book>>({})
  const [del, setDel] = useState<string|null>(null)

  const save = () => {
    if (view === 'new') setBooks(b => [...b, { ...editing as Book, id: String(Date.now()) }])
    else setBooks(b => b.map(x => x.id === editing.id ? { ...x, ...editing } as Book : x))
    setView('list')
  }

  if (view !== 'list') return (
    <div>
      <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'2rem' }}>
        <button onClick={()=>setView('list')} style={backBtn}>← Back</button>
        <h1 style={h1}>{view==='new' ? 'New Book' : 'Edit Book'}</h1>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 260px', gap:'2.5rem', alignItems:'start' }}>
        <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
            <div><label style={lbl}>Title *</label><input value={editing.title||''} onChange={e=>setEditing(p=>({...p,title:e.target.value}))} style={inp} placeholder="Book title"/></div>
            <div><label style={lbl}>Language</label><input value={editing.language||''} onChange={e=>setEditing(p=>({...p,language:e.target.value}))} style={inp} placeholder="English"/></div>
            <div><label style={lbl}>Genre / Category</label><input value={editing.genre||''} onChange={e=>setEditing(p=>({...p,genre:e.target.value}))} style={inp} placeholder="Psychology · Creativity"/></div>
            <div>
              <label style={lbl}>Publication Status</label>
              <select value={editing.status||'published'} onChange={e=>setEditing(p=>({...p,status:e.target.value}))} style={inp}>
                <option value="published">Published</option>
                <option value="upcoming">To Be Published</option>
              </select>
            </div>
            <div><label style={lbl}>Year Published</label><input value={editing.year||''} onChange={e=>setEditing(p=>({...p,year:e.target.value}))} style={inp} placeholder="2023"/></div>
            <div><label style={lbl}>ISBN</label><input value={editing.isbn||''} onChange={e=>setEditing(p=>({...p,isbn:e.target.value}))} style={inp} placeholder="978-..."/></div>
          </div>
          <div><label style={lbl}>Synopsis</label><textarea value={editing.synopsis||''} onChange={e=>setEditing(p=>({...p,synopsis:e.target.value}))} rows={5} style={{...inp,resize:'vertical' as const,lineHeight:1.7}} placeholder="Book description..."/></div>
          <div>
            <ImageUpload
              value={editing.coverUrl||''}
              onChange={v=>setEditing(p=>({...p,coverUrl:v}))}
              label="Book Cover"
              hint="Upload from your computer or paste a URL. Portrait aspect ratio (2:3) works best."
              aspect="2/3"
              bucket="books"
            />
          </div>
          <div><label style={lbl}>Amazon / Buy Link</label><input value={editing.amazonUrl||''} onChange={e=>setEditing(p=>({...p,amazonUrl:e.target.value}))} style={inp} placeholder="https://amzn.in/..."/></div>
          <button onClick={save} className="btn-primary" style={{ alignSelf:'flex-start' }}>{view==='new' ? 'Add Book' : 'Save Changes'}</button>
        </div>
        {editing.coverUrl ? (
          <div style={{ border:'0.5px solid var(--color-border)', overflow:'hidden', position:'sticky', top:'1rem' }}>
            <img src={editing.coverUrl} alt="cover preview" style={{ width:'100%', aspectRatio:'2/3', objectFit:'cover', display:'block' }}/>
          </div>
        ) : (
          <div style={{ border:'0.5px dashed var(--color-border)', aspectRatio:'2/3', display:'flex', alignItems:'center', justifyContent:'center', position:'sticky', top:'1rem' }}>
            <p style={{ fontSize:12, color:'var(--color-text-tertiary)', textAlign:'center', padding:'1rem' }}>Cover preview</p>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'2.5rem', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <h1 style={h1}>Books</h1>
          <p style={{ fontSize:14, color:'var(--color-text-secondary)' }}>{books.length} published books</p>
        </div>
        <button onClick={()=>{setEditing(EMPTY as Partial<Book>); setView('new')}} className="btn-primary">+ Add Book</button>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'1.5rem' }}>
        {books.map(book => (
          <div key={book.id} style={{ border:'0.5px solid var(--color-border)', overflow:'hidden', background:'var(--color-surface-1)' }}>
            <div style={{ display:'flex', height:160, background:'#111' }}>
              {book.coverUrl ? (
                <img src={book.coverUrl} alt={book.title} style={{ width:'auto', height:'100%', objectFit:'cover' }}/>
              ) : (
                <div style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'center', background:'#1a1a1a' }}>
                  <span style={{ fontFamily:'var(--font-playfair,serif)', fontSize:20, color:'rgba(255,255,255,0.1)' }}>{book.title}</span>
                </div>
              )}
            </div>
            <div style={{ padding:'1rem' }}>
              <span style={{ fontSize:9, letterSpacing:'0.08em', textTransform:'uppercase', color: book.status==='published' ? 'rgba(80,200,120,0.9)' : 'var(--color-accent)', marginBottom:'0.25rem', display:'block' }}>{book.status==='published' ? 'Published' : 'Upcoming'} · {book.year}</span>
              <p style={{ fontSize:15, color:'var(--color-text-primary)', fontFamily:'var(--font-playfair,serif)', marginBottom:'0.3rem' }}>{book.title}</p>
              <p style={{ fontSize:12, color:'var(--color-text-tertiary)', marginBottom:'0.875rem', lineHeight:1.4 }}>{book.genre}</p>
              <div style={{ display:'flex', gap:'0.5rem' }}>
                <button onClick={()=>{setEditing(book); setView('edit')}} style={{ flex:1, background:'none', border:'0.5px solid var(--color-border)', color:'var(--color-accent)', padding:'0.4rem', fontSize:11, cursor:'pointer', fontFamily:'inherit' }}>Edit</button>
                {book.amazonUrl && <a href={book.amazonUrl} target="_blank" rel="noopener noreferrer" style={{ flex:1, background:'none', border:'0.5px solid var(--color-border)', color:'var(--color-text-secondary)', padding:'0.4rem', fontSize:11, cursor:'pointer', textDecoration:'none', textAlign:'center', display:'block' }}>Amazon ↗</a>}
                <button onClick={()=>setDel(book.id)} style={{ background:'none', border:'none', color:'rgba(255,80,80,0.6)', fontSize:11, cursor:'pointer', padding:'0 0.25rem' }}>Del</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {del && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:200 }}>
          <div style={{ background:'#111', border:'0.5px solid var(--color-border)', padding:'2rem', maxWidth:360, width:'90%' }}>
            <p style={{ fontSize:15, color:'var(--color-text-primary)', marginBottom:'1.5rem' }}>Delete this book?</p>
            <div style={{ display:'flex', gap:'0.75rem' }}>
              <button onClick={()=>{setBooks(b=>b.filter(x=>x.id!==del)); setDel(null)}} style={{ background:'rgba(255,80,80,0.15)', border:'0.5px solid rgba(255,80,80,0.4)', color:'#ff6060', padding:'0.625rem 1.25rem', cursor:'pointer', fontSize:13, fontFamily:'inherit' }}>Delete</button>
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
