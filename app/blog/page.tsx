import type { Metadata } from 'next'
import Link from 'next/link'
import ApertureMark from '@/components/ApertureMark'

export const metadata: Metadata = {
  title: 'The Creativity Applied — Blog',
  description: 'Writing on film, psychology, brand strategy, creative technology and the intersections between them.',
}

const CATEGORIES = ['All', 'Film & Direction', 'Psychology', 'Brand Strategy', 'Creative Technology', 'Creative Process']

const POSTS = [
  {
    slug: 'emotion-is-not-the-goal',
    category: 'Film & Direction',
    title: 'Emotion is not the goal. It\'s the mechanism.',
    excerpt: 'Most brand films try to make people feel good about a product. That\'s the wrong brief. The right brief is: what specific behavior do you need to engineer, and what emotional state produces that behavior?',
    date: 'March 2025',
    readTime: '6 min',
  },
  {
    slug: 'behavioral-architecture-of-a-tvc',
    category: 'Psychology',
    title: 'The behavioral architecture of a 60-second commercial',
    excerpt: 'A commercial is not a film. It is an intervention. Every second is a decision about what stimulus to fire in the viewer\'s brain and what behavioral response to provoke.',
    date: 'January 2025',
    readTime: '8 min',
  },
  {
    slug: 'why-beautiful-films-dont-sell',
    category: 'Brand Strategy',
    title: 'Why beautiful films don\'t sell',
    excerpt: 'We spend crores on award-winning work that doesn\'t move product. The reason is almost always the same: the director optimised for craft, not for the behavioral outcome in the brief.',
    date: 'November 2024',
    readTime: '5 min',
  },
  {
    slug: 'six-sigma-filmmaking',
    category: 'Creative Process',
    title: 'Six Sigma filmmaking: precision in creative chaos',
    excerpt: 'What happens when you apply a Six Sigma Black Belt\'s mindset to a film set? You stop losing money on reshoots. You stop delivering films that miss the brief. You start treating creativity as an engineering problem.',
    date: 'September 2024',
    readTime: '7 min',
  },
  {
    slug: 'ai-and-the-creative-director',
    category: 'Creative Technology',
    title: 'AI and the creative director: co-pilot, not replacement',
    excerpt: 'The tools I use to build faster, think deeper, and prototype at speed — and why none of them replace the core of what a creative director actually does.',
    date: 'July 2024',
    readTime: '6 min',
  },
  {
    slug: 'the-psychology-of-brand-loyalty',
    category: 'Psychology',
    title: 'The neuroscience of brand loyalty',
    excerpt: 'Why people are loyal to brands has nothing to do with the brand. It has to do with identity consolidation — the mechanism by which humans use consumption to signal tribal membership.',
    date: 'May 2024',
    readTime: '9 min',
  },
]

export default function BlogPage() {
  return (
    <div style={{ minHeight: '100dvh', background: 'var(--color-bg)', paddingTop: '8rem' }}>
      {/* Header */}
      <div style={{ padding: '0 clamp(1.25rem,5vw,3.5rem)', marginBottom: '4rem' }}>
        <div style={{
          fontFamily: '"JetBrains Mono","Courier New",monospace',
          fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase',
          color: 'rgba(232,104,58,0.5)', marginBottom: '1rem',
        }}>
          SCENE 06 — THE WRITING
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
        <p style={{
          fontSize: 15, lineHeight: 1.72, color: 'var(--color-text-secondary)',
          maxWidth: 580,
        }}>
          On film, psychology, brand strategy, and what happens at the intersections.
          Written for practitioners — not observers.
        </p>
      </div>

      {/* Categories */}
      <div style={{
        padding: '0 clamp(1.25rem,5vw,3.5rem)',
        borderBottom: '0.5px solid var(--color-border)',
        marginBottom: '3rem',
        display: 'flex', gap: '0', overflowX: 'auto',
      }}>
        {CATEGORIES.map((cat, i) => (
          <button key={cat} style={{
            fontSize: 12, padding: '1rem 1.5rem',
            background: i === 0 ? 'transparent' : 'transparent',
            border: 'none', borderBottom: i === 0 ? '1.5px solid var(--color-accent)' : '1.5px solid transparent',
            color: i === 0 ? 'var(--color-accent)' : 'var(--color-text-secondary)',
            cursor: 'pointer', letterSpacing: '0.04em', fontFamily: 'inherit',
            whiteSpace: 'nowrap', transition: 'all 0.2s',
          }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Posts grid */}
      <div style={{
        padding: '0 clamp(1.25rem,5vw,3.5rem)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: '0',
      }}>
        {POSTS.map((post, i) => (
          <article
            key={post.slug}
            style={{
              padding: '2.5rem',
              borderBottom: '0.5px solid var(--color-border)',
              borderRight: i % 2 === 0 ? '0.5px solid var(--color-border)' : 'none',
              transition: 'background 0.25s',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <span style={{
                fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
                color: 'var(--color-accent)',
              }}>{post.category}</span>
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
          </article>
        ))}
      </div>

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
