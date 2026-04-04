'use client'

import { useState, useEffect } from 'react'

interface Post {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  published: boolean
  read_time: string
  created_at: string
}

const CATEGORIES = ['Film & Direction', 'Psychology', 'Brand Strategy', 'Creative Technology', 'Creative Process']
const EMPTY: Omit<Post, 'id' | 'created_at'> = { slug: '', title: '', excerpt: '', content: '', category: 'Film & Direction', published: false, read_time: '5 min' }

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [view, setView] = useState<'list' | 'edit' | 'new'>('list')
  const [editing, setEditing] = useState<Partial<Post>>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => { fetchPosts() }, [])

  const fetchPosts = async () => {
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/admin/blog')
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setPosts(data.posts || [])
    } catch { setError('Could not load posts. Check Supabase env vars are set in Vercel.') }
    finally { setLoading(false) }
  }

  const save = async () => {
    if (!editing.title || !editing.slug) return
    setSaving(true)
    try {
      const method = view === 'new' ? 'POST' : 'PATCH'
      const url = view === 'new' ? '/api/admin/blog' : `/api/admin/blog/${editing.id}`
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      })
      if (!res.ok) throw new Error()
      await fetchPosts()
      setView('list')
    } catch { setError('Could not save post.') }
    finally { setSaving(false) }
  }

  const deletePost = async (id: string) => {
    try {
      await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' })
      setPosts(p => p.filter(x => x.id !== id))
      setDeleteId(null)
    } catch { setError('Could not delete post.') }
  }

  const slugify = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  if (view !== 'list') {
    return (
      <div>
        <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'2rem' }}>
          <button onClick={() => setView('list')} style={{
            background:'none', border:'0.5px solid var(--color-border)', color:'var(--color-text-secondary)',
            padding:'0.5rem 1rem', cursor:'pointer', fontSize:13, fontFamily:'inherit',
          }}>← Back</button>
          <h1 style={{ fontFamily:'var(--font-playfair,serif)', fontSize:24, fontWeight:400, color:'var(--color-text-primary)' }}>
            {view === 'new' ? 'New Post' : 'Edit Post'}
          </h1>
        </div>

        {error && <div style={{ padding:'0.75rem 1rem', background:'rgba(255,80,80,0.08)', border:'0.5px solid rgba(255,80,80,0.3)', color:'#ff6060', fontSize:13, marginBottom:'1.5rem' }}>{error}</div>}

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem', marginBottom:'1.5rem' }}>
          <div>
            <label style={{ display:'block', fontSize:11, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--color-text-tertiary)', marginBottom:'0.4rem' }}>Title *</label>
            <input
              value={editing.title || ''} onChange={e => {
                const t = e.target.value
                setEditing(p => ({ ...p, title: t, slug: view === 'new' ? slugify(t) : p.slug }))
              }}
              style={inputStyle} placeholder="Post title"
            />
          </div>
          <div>
            <label style={{ display:'block', fontSize:11, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--color-text-tertiary)', marginBottom:'0.4rem' }}>Slug *</label>
            <input value={editing.slug || ''} onChange={e => setEditing(p => ({ ...p, slug: e.target.value }))} style={inputStyle} placeholder="post-slug" />
          </div>
          <div>
            <label style={{ display:'block', fontSize:11, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--color-text-tertiary)', marginBottom:'0.4rem' }}>Category</label>
            <select value={editing.category || 'Film & Direction'} onChange={e => setEditing(p => ({ ...p, category: e.target.value }))} style={inputStyle}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display:'block', fontSize:11, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--color-text-tertiary)', marginBottom:'0.4rem' }}>Read Time</label>
            <input value={editing.read_time || ''} onChange={e => setEditing(p => ({ ...p, read_time: e.target.value }))} style={inputStyle} placeholder="5 min" />
          </div>
        </div>

        <div style={{ marginBottom:'1.5rem' }}>
          <label style={{ display:'block', fontSize:11, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--color-text-tertiary)', marginBottom:'0.4rem' }}>Excerpt</label>
          <textarea value={editing.excerpt || ''} onChange={e => setEditing(p => ({ ...p, excerpt: e.target.value }))} style={{ ...inputStyle, height:80, resize:'vertical' as const }} placeholder="Short description shown on blog index..." />
        </div>

        <div style={{ marginBottom:'2rem' }}>
          <label style={{ display:'block', fontSize:11, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--color-text-tertiary)', marginBottom:'0.4rem' }}>Content (Markdown)</label>
          <textarea value={editing.content || ''} onChange={e => setEditing(p => ({ ...p, content: e.target.value }))} style={{ ...inputStyle, height:360, resize:'vertical' as const, fontFamily:'"JetBrains Mono","Courier New",monospace', fontSize:13 }} placeholder="Write your post in markdown...&#10;&#10;## Heading&#10;**Bold text**&#10;Regular paragraph..." />
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:'1.5rem' }}>
          <label style={{ display:'flex', alignItems:'center', gap:'0.5rem', cursor:'pointer', fontSize:14, color:'var(--color-text-secondary)' }}>
            <input type="checkbox" checked={!!editing.published} onChange={e => setEditing(p => ({ ...p, published: e.target.checked }))} />
            Published (visible on site)
          </label>
          <button onClick={save} disabled={saving} className="btn-primary" style={{ opacity: saving ? 0.6 : 1 }}>
            {saving ? 'Saving…' : view === 'new' ? 'Create Post' : 'Save Changes'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'2rem', gap:'1rem', flexWrap:'wrap' }}>
        <div>
          <h1 style={{ fontFamily:'var(--font-playfair,serif)', fontSize:28, fontWeight:400, color:'var(--color-text-primary)', marginBottom:'0.35rem', letterSpacing:'-0.02em' }}>
            Blog Posts
          </h1>
          <p style={{ fontSize:14, color:'var(--color-text-secondary)' }}>{posts.length} posts in Supabase</p>
        </div>
        <button onClick={() => { setEditing(EMPTY); setView('new') }} className="btn-primary">
          + New Post
        </button>
      </div>

      {error && <div style={{ padding:'0.75rem 1rem', background:'rgba(255,80,80,0.08)', border:'0.5px solid rgba(255,80,80,0.3)', color:'#ff6060', fontSize:13, marginBottom:'1.5rem' }}>{error}<br/><small style={{ opacity:0.7 }}>Add NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY in Vercel → Project Settings → Environment Variables, then redeploy.</small></div>}

      {loading ? (
        <div style={{ fontSize:14, color:'var(--color-text-tertiary)', padding:'3rem 0', textAlign:'center' }}>Loading posts…</div>
      ) : posts.length === 0 ? (
        <div style={{ padding:'3rem', border:'0.5px solid var(--color-border)', textAlign:'center' }}>
          <p style={{ fontSize:14, color:'var(--color-text-tertiary)', marginBottom:'1.5rem' }}>No posts yet. Create your first one.</p>
          <button onClick={() => { setEditing(EMPTY); setView('new') }} className="btn-primary">Create Post</button>
        </div>
      ) : (
        <div style={{ border:'0.5px solid var(--color-border)' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 140px 80px 120px', padding:'0.75rem 1.25rem', borderBottom:'0.5px solid var(--color-border)', background:'var(--color-surface-1)' }}>
            {['Title', 'Category', 'Read', 'Status'].map(h => (
              <span key={h} style={{ fontSize:10, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--color-text-tertiary)' }}>{h}</span>
            ))}
          </div>
          {posts.map((post, i) => (
            <div key={post.id} style={{
              display:'grid', gridTemplateColumns:'1fr 140px 80px 120px',
              alignItems:'center', gap:'1rem', padding:'1rem 1.25rem',
              borderBottom: i < posts.length-1 ? '0.5px solid var(--color-border)' : 'none',
            }}>
              <div>
                <p style={{ fontSize:14, color:'var(--color-text-primary)', marginBottom:'0.2rem', fontFamily:'var(--font-playfair,serif)' }}>{post.title}</p>
                <p style={{ fontSize:11, color:'var(--color-text-tertiary)' }}>/blog/{post.slug}</p>
              </div>
              <span style={{ fontSize:12, color:'var(--color-text-secondary)' }}>{post.category}</span>
              <span style={{ fontSize:12, color:'var(--color-text-secondary)' }}>{post.read_time}</span>
              <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
                <span style={{
                  fontSize:9, letterSpacing:'0.08em', textTransform:'uppercase',
                  color: post.published ? 'rgba(80,200,120,0.9)' : 'var(--color-text-tertiary)',
                  background: post.published ? 'rgba(80,200,120,0.1)' : 'transparent',
                  border: `0.5px solid ${post.published ? 'rgba(80,200,120,0.3)' : 'var(--color-border)'}`,
                  padding:'2px 8px', borderRadius:1, flexShrink:0,
                }}>{post.published ? 'Live' : 'Draft'}</span>
                <button onClick={() => { setEditing(post); setView('edit') }} style={{ background:'none', border:'none', color:'var(--color-accent)', cursor:'pointer', fontSize:11, padding:'0 2px' }}>Edit</button>
                <button onClick={() => setDeleteId(post.id)} style={{ background:'none', border:'none', color:'rgba(255,80,80,0.7)', cursor:'pointer', fontSize:11, padding:'0 2px' }}>Del</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div style={{
          position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:200,
        }}>
          <div style={{ background:'#111', border:'0.5px solid var(--color-border)', padding:'2rem', maxWidth:380, width:'90%' }}>
            <p style={{ fontSize:15, color:'var(--color-text-primary)', marginBottom:'1.5rem' }}>Delete this post permanently?</p>
            <div style={{ display:'flex', gap:'0.75rem' }}>
              <button onClick={() => deletePost(deleteId)} style={{ background:'rgba(255,80,80,0.15)', border:'0.5px solid rgba(255,80,80,0.4)', color:'#ff6060', padding:'0.625rem 1.25rem', cursor:'pointer', fontSize:13, fontFamily:'inherit' }}>Delete</button>
              <button onClick={() => setDeleteId(null)} className="btn-ghost" style={{ fontSize:13 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width:'100%', background:'var(--color-surface-1)', border:'0.5px solid var(--color-border-mid)',
  padding:'0.625rem 0.875rem', fontSize:14, color:'var(--color-text-primary)',
  fontFamily:'inherit', outline:'none', boxSizing:'border-box' as const,
}
