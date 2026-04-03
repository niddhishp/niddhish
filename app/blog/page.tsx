import type { Metadata } from 'next'
import ApertureMark from '@/components/ApertureMark'
import Link from 'next/link'
import BlogClient from './BlogClient'

export const metadata: Metadata = {
  title: 'The Creativity Applied — Blog',
  description: 'Writing on film, psychology, brand strategy, creative technology and the intersections between them. By Niddhish Puuzhakkal.',
}

export default function BlogPage() {
  return (
    <div style={{ minHeight: '100dvh', background: 'var(--color-bg)', paddingTop: '8rem' }}>
      {/* Header */}
      <div style={{ padding: '0 clamp(1.25rem,5vw,3.5rem)', marginBottom: '3rem' }}>
        <div style={{
          fontFamily: '"JetBrains Mono","Courier New",monospace',
          fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase',
          color: 'rgba(232,104,58,0.5)', marginBottom: '1rem',
        }}>
          SCENE 07 — THE WRITING
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <ApertureMark size={40} />
          <div>
            <span className="text-label" style={{ display: 'block', marginBottom: '0.75rem' }}>Writing</span>
            <h1 className="text-display-md" style={{ color: 'var(--color-text-primary)', maxWidth: 680 }}>
              The Creativity Applied.{' '}
              <em style={{ color: 'var(--color-accent)' }}>Ideas, methods, observations.</em>
            </h1>
          </div>
        </div>
        <p style={{ fontSize: 15, lineHeight: 1.72, color: 'var(--color-text-secondary)', maxWidth: 580 }}>
          On film, psychology, brand strategy, and what happens at the intersections. Written for practitioners — not observers.
        </p>
      </div>

      <BlogClient />

      {/* Newsletter CTA */}
      <div style={{
        margin: '4rem clamp(1.25rem,5vw,3.5rem)',
        padding: '3rem',
        border: '0.5px solid var(--color-border-mid)',
        background: 'var(--color-surface-1)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem',
      }}>
        <div>
          <span className="text-label" style={{ display: 'block', marginBottom: '0.75rem' }}>Stay Sharp</span>
          <p style={{ fontSize: 16, fontFamily: 'var(--font-playfair,serif)', fontWeight: 400, color: 'var(--color-text-primary)' }}>
            New pieces on creativity, cinema, and strategy — in your inbox.
          </p>
        </div>
        <Link href="/collaborate" className="btn-primary">Subscribe</Link>
      </div>
    </div>
  )
}
