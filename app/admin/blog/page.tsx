'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'

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

        {/* Video embed — YouTube or Vimeo */}
        <div style={{ marginBottom:'1.5rem' }}>
          <label style={{ display:'block', fontSize:11, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--color-text-tertiary)', marginBottom:'0.4rem' }}>
            Video Embed URL <span style={{ fontSize:10, color:'var(--color-text-tertiary)', textTransform:'none', letterSpacing:'0.03em', fontWeight:400 }}>— optional, YouTube or Vimeo</span>
          </label>
          <input
            value={(editing as {video_url?: string}).video_url || ''}
            onChange={e => setEditing(p => ({ ...p, video_url: e.target.value }))}
            style={inputStyle}
            placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
          />
          {(editing as {video_url?: string}).video_url && (() => {
            const url = (editing as {video_url?: string}).video_url || ''
            const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)
            const vi = url.match(/vimeo\.com\/(\d+)/)
            const embedSrc = yt
              ? `https://www.youtube.com/embed/${yt[1]}`
              : vi ? `https://player.vimeo.com/video/${vi[1]}?dnt=1` : null
            return embedSrc ? (
              <div style={{ position:'relative', aspectRatio:'16/9', background:'#111', marginTop:'0.75rem' }}>
                <iframe src={embedSrc} style={{ position:'absolute', inset:0, width:'100%', height:'100%', border:'none' }} allow="autoplay; fullscreen" allowFullScreen title="Video preview"/>
              </div>
            ) : null
          })()}
          <p style={{ fontSize:11, color:'var(--color-text-tertiary)', marginTop:'0.4rem', lineHeight:1.5 }}>
            If provided, the video will be embedded at the top of the post. The content field below is optional for video posts.
          </p>
        </div>

        <div style={{ marginBottom:'2rem' }}>
          <label style={{ display:'block', fontSize:11, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--color-text-tertiary)', marginBottom:'0.4rem' }}>Content <span style={{ fontSize:10, color:'var(--color-text-tertiary)', textTransform:'none', letterSpacing:'0.03em', fontWeight:400 }}>— optional if video provided</span></label>
          <RichEditor value={editing.content || ''} onChange={v => setEditing(p => ({ ...p, content: v }))} />
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

// ── Rich text editor with markdown toolbar ────────────────────────────────────
function RichEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const ref = useRef<HTMLTextAreaElement>(null)
  const [tab, setTab] = useState<'write'|'preview'>('write')

  const wrap = useCallback((before: string, after: string, placeholder = '') => {
    const el = ref.current
    if (!el) return
    const start = el.selectionStart
    const end = el.selectionEnd
    const sel = value.slice(start, end) || placeholder
    const next = value.slice(0, start) + before + sel + after + value.slice(end)
    onChange(next)
    setTimeout(() => {
      el.focus()
      el.setSelectionRange(start + before.length, start + before.length + sel.length)
    }, 0)
  }, [value, onChange])

  const prefix = useCallback((mark: string) => {
    const el = ref.current
    if (!el) return
    const start = el.selectionStart
    const lineStart = value.lastIndexOf('\n', start - 1) + 1
    const already = value.slice(lineStart).startsWith(mark)
    const next = already
      ? value.slice(0, lineStart) + value.slice(lineStart + mark.length)
      : value.slice(0, lineStart) + mark + value.slice(lineStart)
    onChange(next)
    setTimeout(() => { el.focus() }, 0)
  }, [value, onChange])

  const tools: { label: string; title: string; action: () => void }[] = [
    { label: 'B',       title: 'Bold (Ctrl+B)',        action: () => wrap('**','**','bold text') },
    { label: 'I',       title: 'Italic (Ctrl+I)',       action: () => wrap('*','*','italic text') },
    { label: 'B+I',     title: 'Bold & Italic',         action: () => wrap('***','***','bold italic') },
    { label: 'H2',      title: 'Heading 2',             action: () => prefix('## ') },
    { label: 'H3',      title: 'Heading 3',             action: () => prefix('### ') },
    { label: '❝',       title: 'Blockquote',            action: () => prefix('> ') },
    { label: '• List',  title: 'Bullet list',           action: () => prefix('- ') },
    { label: '1. List', title: 'Numbered list',         action: () => prefix('1. ') },
    { label: '—',       title: 'Divider',               action: () => { const el = ref.current; if(!el) return; const p = el.selectionStart; const n = value.slice(0,p) + '\n---\n' + value.slice(p); onChange(n) } },
    { label: 'Link',    title: 'Insert link',           action: () => wrap('[','](https://)','link text') },
  ]

  // Keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const mod = e.metaKey || e.ctrlKey
    if (mod && e.key === 'b') { e.preventDefault(); wrap('**','**','bold text') }
    if (mod && e.key === 'i') { e.preventDefault(); wrap('*','*','italic text') }
  }

  // Preview renderer (simplified)
  const preview = value
    .replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/^## (.+)$/gm, '<h2 style="font-size:20px;font-family:serif;margin:1.5rem 0 0.5rem;color:#f0ede8">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 style="font-size:17px;font-family:serif;margin:1.2rem 0 0.4rem;color:#f0ede8">$1</h3>')
    .replace(/^> (.+)$/gm, '<blockquote style="border-left:2px solid #e8683a;padding-left:1rem;margin:0 0 1rem;font-style:italic;color:#aaa">$1</blockquote>')
    .replace(/^[-*] (.+)$/gm, '<li style="margin-left:1.5rem;color:#aaa;list-style:disc">$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li style="margin-left:1.5rem;color:#aaa;list-style:decimal">$1</li>')
    .replace(/^---$/gm, '<hr style="border:none;border-top:0.5px solid #333;margin:1.5rem 0"/>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:#e8683a" target="_blank">$1</a>')
    .split('\n\n').map(b => b.startsWith('<h') || b.startsWith('<blockquote') || b.startsWith('<li') || b.startsWith('<hr') ? b : `<p style="color:#888;line-height:1.8;margin-bottom:1rem">${b}</p>`).join('')

  return (
    <div style={{ border:'0.5px solid var(--color-border-mid)' }}>
      {/* Tab bar + toolbar */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'0.5px solid var(--color-border)', background:'var(--color-bg)', padding:'0 0.5rem' }}>
        <div style={{ display:'flex' }}>
          {(['write','preview'] as const).map(t => (
            <button key={t} onClick={()=>setTab(t)} style={{ fontSize:11, padding:'0.5rem 0.875rem', background:'transparent', border:'none', borderBottom: tab===t ? '1.5px solid var(--color-accent)' : '1.5px solid transparent', color: tab===t ? 'var(--color-accent)' : 'var(--color-text-tertiary)', cursor:'pointer', fontFamily:'inherit', letterSpacing:'0.04em', textTransform:'uppercase' }}>
              {t}
            </button>
          ))}
        </div>
        {tab === 'write' && (
          <div style={{ display:'flex', gap:'2px', flexWrap:'wrap', padding:'4px 0' }}>
            {tools.map(t => (
              <button key={t.label} onClick={t.action} title={t.title} style={{ background:'none', border:'0.5px solid var(--color-border)', color:'var(--color-text-secondary)', padding:'3px 7px', fontSize:11, cursor:'pointer', fontFamily:t.label==='B'?'serif':'inherit', fontWeight:t.label==='B'||t.label==='B+I'?700:400, fontStyle:t.label==='I'||t.label==='B+I'?'italic':'normal', borderRadius:1, transition:'background 0.1s' }}
                onMouseEnter={e=>(e.currentTarget.style.background='var(--color-surface-1)')}
                onMouseLeave={e=>(e.currentTarget.style.background='none')}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}
      </div>
      {/* Editor / Preview */}
      {tab === 'write' ? (
        <textarea
          ref={ref}
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ width:'100%', minHeight:360, background:'var(--color-surface-1)', border:'none', padding:'1rem', fontSize:14, color:'var(--color-text-primary)', fontFamily:'"JetBrains Mono","Courier New",monospace', outline:'none', boxSizing:'border-box', resize:'vertical', lineHeight:1.7 }}
          placeholder={"Write your post...\n\n## Use headings\n**Bold** and *italic* text\n- Bullet lists\n> Blockquotes"}
          spellCheck
        />
      ) : (
        <div style={{ minHeight:360, padding:'1.25rem', background:'var(--color-surface-1)', fontSize:15, lineHeight:1.8 }}
          dangerouslySetInnerHTML={{ __html: preview || '<p style="color:#555;font-style:italic">Nothing to preview yet.</p>' }}
        />
      )}
      <div style={{ padding:'0.4rem 0.875rem', background:'var(--color-bg)', borderTop:'0.5px solid var(--color-border)', fontSize:10, color:'var(--color-text-tertiary)', letterSpacing:'0.06em' }}>
        MARKDOWN · **bold** · *italic* · ## heading · &gt; quote · - list · [link](url) · Ctrl+B/I
      </div>
    </div>
  )
}
