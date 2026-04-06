import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ApertureMark from '@/components/ApertureMark'
import { getSupabaseAdmin } from '@/lib/supabase'

interface Post {
  id: string; slug: string; title: string; excerpt: string; content: string
  category: string; published: boolean; read_time: string; created_at: string
}

async function getPost(slug: string): Promise<Post | null> {
  const { data } = await getSupabaseAdmin()
    .from('blog_posts').select('*').eq('slug', slug).eq('published', true).single()
  return data ?? null
}

async function getOtherPosts(slug: string): Promise<Pick<Post,'id'|'slug'|'title'|'category'|'created_at'>[]> {
  const { data } = await getSupabaseAdmin()
    .from('blog_posts').select('id,slug,title,category,created_at')
    .eq('published', true).neq('slug', slug).order('created_at', { ascending: false }).limit(3)
  return data ?? []
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return { title: 'Not Found' }
  return {
    title: `${post.title} — Niddhish Puuzhakkal`,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: 'article' },
  }
}

// Render markdown-like content
function renderContent(content: string) {
  if (!content) return null
  return content.split('\n\n').map((block, i) => {
    if (block.startsWith('## ')) return (
      <h2 key={i} style={{ fontFamily:'var(--font-playfair,serif)', fontSize:'clamp(20px,2.5vw,28px)', fontWeight:400, lineHeight:1.2, color:'var(--color-text-primary)', letterSpacing:'-0.015em', marginTop:'3rem', marginBottom:'1rem' }}>
        {block.replace('## ', '')}
      </h2>
    )
    if (block.startsWith('### ')) return (
      <h3 key={i} style={{ fontFamily:'var(--font-playfair,serif)', fontSize:'clamp(17px,2vw,22px)', fontWeight:400, color:'var(--color-text-primary)', marginTop:'2rem', marginBottom:'0.75rem' }}>
        {block.replace('### ', '')}
      </h3>
    )
    const parts = block.split(/(\*\*[^*]+\*\*)/)
    return (
      <p key={i} style={{ fontSize:16, lineHeight:1.85, color:'var(--color-text-secondary)', marginBottom:'1.5rem' }}>
        {parts.map((part, j) =>
          part.startsWith('**') && part.endsWith('**')
            ? <strong key={j} style={{ color:'var(--color-text-primary)', fontWeight:500 }}>{part.replace(/\*\*/g,'')}</strong>
            : part
        )}
      </p>
    )
  })
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [post, otherPosts] = await Promise.all([getPost(slug), getOtherPosts(slug)])
  if (!post) notFound()

  const fmt = (iso: string) => {
    try { return new Date(iso).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }) }
    catch { return '' }
  }

  return (
    <div style={{ minHeight:'100dvh', background:'var(--color-bg)', paddingTop:'8rem' }}>
      {/* Header */}
      <div style={{ padding:'0 clamp(1.25rem,5vw,3.5rem)', marginBottom:'4rem', maxWidth:780 }}>
        <Link href="/blog" style={{ display:'inline-flex', alignItems:'center', gap:8, fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--color-text-tertiary)', textDecoration:'none', marginBottom:'2rem', transition:'color 0.2s' }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M9 5H1M5 9L1 5l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          The Creativity Applied
        </Link>

        <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'1.5rem', flexWrap:'wrap' }}>
          <span style={{ fontSize:10, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--color-accent)' }}>{post.category}</span>
          <span style={{ color:'var(--color-border-mid)', fontSize:10 }}>·</span>
          <span style={{ fontSize:11, color:'var(--color-text-tertiary)' }}>{fmt(post.created_at)} · {post.read_time} read</span>
        </div>

        <h1 style={{ fontFamily:'var(--font-playfair,serif)', fontSize:'clamp(28px,4vw,52px)', fontWeight:400, lineHeight:1.15, letterSpacing:'-0.025em', color:'var(--color-text-primary)', marginBottom:'1.5rem' }}>
          {post.title}
        </h1>

        {post.excerpt && (
          <p style={{ fontSize:18, lineHeight:1.7, color:'var(--color-text-secondary)', fontStyle:'italic', borderLeft:'2px solid var(--color-accent)', paddingLeft:'1.25rem', marginBottom:'1rem' }}>
            {post.excerpt}
          </p>
        )}

        <div style={{ display:'flex', alignItems:'center', gap:12, paddingTop:'1.5rem', borderTop:'0.5px solid var(--color-border)' }}>
          <ApertureMark size={22} />
          <div>
            <p style={{ fontSize:13, color:'var(--color-text-primary)', fontWeight:500 }}>Niddhish Puuzhakkal</p>
            <p style={{ fontSize:11, color:'var(--color-text-tertiary)' }}>Filmmaker · Psychologist · Author</p>
          </div>
        </div>
      </div>

      {/* Article body */}
      <div style={{ padding:'0 clamp(1.25rem,5vw,3.5rem)', maxWidth:720, marginBottom:'6rem' }}>
        {renderContent(post.content)}
      </div>

      {/* More articles */}
      {otherPosts.length > 0 && (
        <div style={{ borderTop:'0.5px solid var(--color-border)', padding:'4rem clamp(1.25rem,5vw,3.5rem)' }}>
          <span className="text-label" style={{ display:'block', marginBottom:'2rem' }}>More Writing</span>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'2rem' }}>
            {otherPosts.map(p => (
              <Link key={p.slug} href={`/blog/${p.slug}`} style={{ textDecoration:'none', padding:'1.5rem', border:'0.5px solid var(--color-border)', display:'block', transition:'border-color 0.2s' }}>
                <span style={{ fontSize:10, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--color-accent)', display:'block', marginBottom:'0.5rem' }}>{p.category}</span>
                <h3 style={{ fontFamily:'var(--font-playfair,serif)', fontSize:16, fontWeight:400, color:'var(--color-text-primary)', lineHeight:1.35 }}>{p.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
