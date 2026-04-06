import type { Metadata } from 'next'
import ApertureMark from '@/components/ApertureMark'
import Link from 'next/link'
import BlogClient from './BlogClient'
import { getSupabaseAdmin } from '@/lib/supabase'

export const metadata: Metadata = {
  title: 'The Creativity Applied — Blog',
  description: 'Writing on film, psychology, brand strategy, creative technology and the intersections between them. By Niddhish Puuzhakkal.',
}

export const revalidate = 0 // always fresh — admin changes show immediately

export default async function BlogPage() {
  const { data: posts } = await getSupabaseAdmin()
    .from('blog_posts')
    .select('id, slug, title, excerpt, category, read_time, created_at, published')
    .eq('published', true)
    .order('created_at', { ascending: false })

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--color-bg)', paddingTop: '8rem' }}>
      {/* Header */}
      <div style={{ padding: '0 clamp(1.25rem,5vw,3.5rem)', marginBottom: '3rem' }}>
        <div style={{ fontFamily: '"JetBrains Mono","Courier New",monospace', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(232,104,58,0.5)', marginBottom: '1rem' }}>
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
      </div>

      <BlogClient initialPosts={posts || []} />
    </div>
  )
}
