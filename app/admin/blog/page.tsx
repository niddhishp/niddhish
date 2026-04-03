'use client'

import { useState } from 'react'
import Link from 'next/link'
import { POSTS } from '@/lib/posts'

export default function AdminBlogPage() {
  const [posts] = useState(POSTS)

  return (
    <div>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'2rem', gap:'1rem', flexWrap:'wrap' }}>
        <div>
          <h1 style={{ fontFamily:'var(--font-playfair,serif)', fontSize:28, fontWeight:400, color:'var(--color-text-primary)', marginBottom:'0.5rem', letterSpacing:'-0.02em' }}>
            Blog Posts
          </h1>
          <p style={{ fontSize:14, color:'var(--color-text-secondary)' }}>
            {posts.length} articles — currently using static data from <code style={{ fontSize:12, background:'rgba(255,255,255,0.06)', padding:'1px 6px', borderRadius:2 }}>lib/posts.ts</code>
          </p>
        </div>
        <div style={{ display:'flex', gap:'0.75rem', flexWrap:'wrap' }}>
          <Link href="/blog" target="_blank" className="btn-ghost" style={{ fontSize:12, padding:'0.625rem 1.25rem' }}>
            View blog ↗
          </Link>
        </div>
      </div>

      {/* Migration note */}
      <div style={{
        padding:'1.25rem 1.5rem',
        border:'0.5px solid rgba(232,104,58,0.3)',
        background:'rgba(232,104,58,0.05)',
        marginBottom:'2rem',
        borderRadius:2,
      }}>
        <p style={{ fontSize:13, color:'rgba(232,104,58,0.85)', fontWeight:500, marginBottom:'0.25rem' }}>
          Static mode active
        </p>
        <p style={{ fontSize:12, color:'var(--color-text-secondary)', lineHeight:1.6 }}>
          Posts are currently stored in <code style={{ fontSize:11, background:'rgba(255,255,255,0.06)', padding:'1px 5px' }}>lib/posts.ts</code>.
          To enable create/edit/delete, connect the Supabase <code style={{ fontSize:11, background:'rgba(255,255,255,0.06)', padding:'1px 5px' }}>blog_posts</code> table
          (schema in <code style={{ fontSize:11, background:'rgba(255,255,255,0.06)', padding:'1px 5px' }}>lib/supabase.ts</code>)
          and the blog engine will migrate to dynamic mode automatically.
        </p>
      </div>

      {/* Posts table */}
      <div style={{ border:'0.5px solid var(--color-border)' }}>
        {/* Header */}
        <div style={{
          display:'grid', gridTemplateColumns:'1fr 160px 100px 120px',
          padding:'0.75rem 1.25rem', borderBottom:'0.5px solid var(--color-border)',
          background:'var(--color-surface-1)',
        }}>
          {['Title', 'Category', 'Read time', 'Status'].map(h => (
            <span key={h} style={{ fontSize:10, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--color-text-tertiary)', fontWeight:500 }}>{h}</span>
          ))}
        </div>

        {posts.map((post, i) => (
          <div key={post.slug} style={{
            display:'grid', gridTemplateColumns:'1fr 160px 100px 120px',
            alignItems:'center', gap:'1rem',
            padding:'1rem 1.25rem',
            borderBottom: i < posts.length - 1 ? '0.5px solid var(--color-border)' : 'none',
            transition:'background 0.15s',
          }}
            onMouseEnter={e=>(e.currentTarget.style.background='var(--color-surface-1)')}
            onMouseLeave={e=>(e.currentTarget.style.background='transparent')}
          >
            <div>
              <p style={{ fontSize:14, fontWeight:400, color:'var(--color-text-primary)', marginBottom:'0.2rem', fontFamily:'var(--font-playfair,serif)' }}>
                {post.title}
              </p>
              <p style={{ fontSize:11, color:'var(--color-text-tertiary)' }}>
                /blog/{post.slug}
              </p>
            </div>
            <span style={{ fontSize:12, color:'var(--color-text-secondary)' }}>{post.category}</span>
            <span style={{ fontSize:12, color:'var(--color-text-secondary)' }}>{post.readTime}</span>
            <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
              <span style={{
                fontSize:10, letterSpacing:'0.08em', textTransform:'uppercase',
                color:'rgba(80,200,120,0.9)',
                background:'rgba(80,200,120,0.1)',
                border:'0.5px solid rgba(80,200,120,0.3)',
                padding:'2px 8px', borderRadius:1,
              }}>Published</span>
              <Link href={`/blog/${post.slug}`} target="_blank" style={{ fontSize:11, color:'var(--color-text-tertiary)', textDecoration:'none' }}>
                ↗
              </Link>
            </div>
          </div>
        ))}
      </div>

      <p style={{ fontSize:12, color:'var(--color-text-tertiary)', marginTop:'1.5rem', lineHeight:1.6 }}>
        To add a new post: edit <code style={{ fontSize:11, background:'rgba(255,255,255,0.06)', padding:'1px 5px' }}>lib/posts.ts</code> and add an entry to the POSTS array.
        The slug, category, title, excerpt, date, readTime, and content fields are all required.
        After saving, the blog index and post page update automatically.
      </p>
    </div>
  )
}
