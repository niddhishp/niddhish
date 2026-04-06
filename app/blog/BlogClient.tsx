'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Post {
  id: string; slug: string; title: string; excerpt: string
  category: string; published: boolean; read_time: string; created_at: string
}

export default function BlogClient() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => {
    fetch('/api/blog')
      .then(r => r.json())
      .then(d => { if (d.posts) setPosts(d.posts) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const cats = ['All', ...Array.from(new Set(posts.map(p => p.category).filter(Boolean))).sort()]
  const filtered = activeCategory === 'All' ? posts : posts.filter(p => p.category === activeCategory)

  const fmt = (iso: string) => {
    try { return new Date(iso).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }) }
    catch { return '' }
  }

  return (
    <div>
      {/* Category tabs */}
      <div style={{ padding:'0 clamp(1.25rem,5vw,3.5rem)', borderBottom:'0.5px solid var(--color-border)', marginBottom:'3rem', display:'flex', gap:0, overflowX:'auto' }}>
        {cats.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} style={{
            fontSize:12, padding:'1rem 1.5rem', background:'transparent', border:'none',
            borderBottom: activeCategory===cat ? '1.5px solid var(--color-accent)' : '1.5px solid transparent',
            color: activeCategory===cat ? 'var(--color-accent)' : 'var(--color-text-secondary)',
            cursor:'pointer', letterSpacing:'0.04em', fontFamily:'inherit', whiteSpace:'nowrap',
          }}>{cat}</button>
        ))}
      </div>

      {/* Posts grid */}
      <div style={{ padding:'0 clamp(1.25rem,5vw,3.5rem)', display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(340px, 1fr))', gap:0 }}>
        {loading && [0,1,2].map(i => (
          <div key={i} style={{ padding:'2.5rem', borderBottom:'0.5px solid var(--color-border)', borderRight: i%2===0?'0.5px solid var(--color-border)':'none' }}>
            <div style={{ height:10, background:'var(--color-surface-1)', borderRadius:2, width:'30%', marginBottom:'1rem' }}/>
            <div style={{ height:22, background:'var(--color-surface-1)', borderRadius:2, marginBottom:'0.5rem' }}/>
            <div style={{ height:22, background:'var(--color-surface-1)', borderRadius:2, width:'70%', marginBottom:'1rem' }}/>
            <div style={{ height:14, background:'var(--color-surface-1)', borderRadius:2, marginBottom:'0.4rem' }}/>
            <div style={{ height:14, background:'var(--color-surface-1)', borderRadius:2, width:'80%' }}/>
          </div>
        ))}
        {!loading && filtered.map((post, i) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} style={{
            display:'block', padding:'2.5rem', borderBottom:'0.5px solid var(--color-border)',
            borderRight: i%2===0?'0.5px solid var(--color-border)':'none',
            textDecoration:'none', background:'transparent', transition:'background 0.25s',
          }}
            onMouseEnter={e=>(e.currentTarget.style.background='var(--color-surface-1)')}
            onMouseLeave={e=>(e.currentTarget.style.background='transparent')}
          >
            <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'1rem', flexWrap:'wrap' }}>
              <span style={{ fontSize:10, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--color-accent)' }}>{post.category}</span>
              <span style={{ color:'var(--color-border-mid)', fontSize:10 }}>·</span>
              <span style={{ fontSize:11, color:'var(--color-text-tertiary)', letterSpacing:'0.04em' }}>
                {fmt(post.created_at)} · {post.read_time}
              </span>
            </div>
            <h2 style={{ fontFamily:'var(--font-playfair,serif)', fontSize:'clamp(17px,1.6vw,21px)', fontWeight:400, lineHeight:1.3, letterSpacing:'-0.01em', color:'var(--color-text-primary)', marginBottom:'0.75rem' }}>
              {post.title}
            </h2>
            <p style={{ fontSize:14, lineHeight:1.7, color:'var(--color-text-secondary)', marginBottom:'1.5rem' }}>
              {post.excerpt}
            </p>
            <span style={{ fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--color-accent)', display:'flex', alignItems:'center', gap:6 }}>
              Read
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1 5h8M5 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
          </Link>
        ))}
      </div>

      {!loading && filtered.length === 0 && (
        <div style={{ padding:'4rem clamp(1.25rem,5vw,3.5rem)', textAlign:'center', color:'var(--color-text-tertiary)' }}>
          {posts.length === 0 ? 'No posts published yet.' : 'No posts in this category.'}
        </div>
      )}
    </div>
  )
}
