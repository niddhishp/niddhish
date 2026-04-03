'use client'

import { useState } from 'react'
import Link from 'next/link'
import { POSTS, CATEGORIES } from '@/lib/posts'

export default function BlogClient() {
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = activeCategory === 'All'
    ? POSTS
    : POSTS.filter(p => p.category === activeCategory)

  return (
    <div>
      {/* Category tabs */}
      <div style={{
        padding: '0 clamp(1.25rem,5vw,3.5rem)',
        borderBottom: '0.5px solid var(--color-border)',
        marginBottom: '3rem',
        display: 'flex', gap: 0, overflowX: 'auto',
      }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              fontSize: 12, padding: '1rem 1.5rem',
              background: 'transparent',
              border: 'none',
              borderBottom: activeCategory === cat ? '1.5px solid var(--color-accent)' : '1.5px solid transparent',
              color: activeCategory === cat ? 'var(--color-accent)' : 'var(--color-text-secondary)',
              cursor: 'pointer', letterSpacing: '0.04em', fontFamily: 'inherit',
              whiteSpace: 'nowrap', transition: 'all 0.2s',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Posts grid */}
      <div style={{
        padding: '0 clamp(1.25rem,5vw,3.5rem)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: 0,
      }}>
        {filtered.map((post, i) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            style={{
              display: 'block', padding: '2.5rem',
              borderBottom: '0.5px solid var(--color-border)',
              borderRight: i % 2 === 0 ? '0.5px solid var(--color-border)' : 'none',
              textDecoration: 'none',
              background: 'transparent',
              transition: 'background 0.25s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-surface-1)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-accent)' }}>
                {post.category}
              </span>
              <span style={{ color: 'var(--color-border-mid)', fontSize: 10 }}>·</span>
              <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)', letterSpacing: '0.04em' }}>
                {post.date} · {post.readTime}
              </span>
            </div>
            <h2 style={{
              fontFamily: 'var(--font-playfair,serif)',
              fontSize: 'clamp(17px,1.6vw,21px)',
              fontWeight: 400, lineHeight: 1.3, letterSpacing: '-0.01em',
              color: 'var(--color-text-primary)', marginBottom: '0.75rem',
            }}>
              {post.title}
            </h2>
            <p style={{
              fontSize: 14, lineHeight: 1.7,
              color: 'var(--color-text-secondary)', marginBottom: '1.5rem',
            }}>
              {post.excerpt}
            </p>
            <span style={{
              fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'var(--color-accent)', display: 'flex', alignItems: 'center', gap: 6,
            }}>
              Read
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1 5h8M5 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ padding: '4rem clamp(1.25rem,5vw,3.5rem)', textAlign: 'center', color: 'var(--color-text-tertiary)' }}>
          No posts in this category yet.
        </div>
      )}

      <style>{`@media(max-width:640px){ .blog-grid a { border-right: none !important; } }`}</style>
    </div>
  )
}
