import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ApertureMark from '@/components/ApertureMark'
import { getSupabaseAdmin } from '@/lib/supabase'

export const revalidate = 0 // always fresh

interface Post {
  id: string; slug: string; title: string; excerpt: string; content: string
  category: string; published: boolean; read_time: string; created_at: string
  video_url?: string
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

function getEmbedUrl(url: string): string | null {
  if (!url) return null
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}?rel=0&modestbranding=1`
  const vi = url.match(/vimeo\.com\/(\d+)/)
  if (vi) return `https://player.vimeo.com/video/${vi[1]}?dnt=1&title=0&byline=0`
  return null
}

function renderContent(content: string) {
  if (!content) return null
  return content.split('\n\n').map((block, i) => {
    // h2
    if (block.startsWith('## ')) return (
      <h2 key={i} style={{ fontFamily:'var(--font-playfair,serif)', fontSize:'clamp(20px,2.5vw,28px)', fontWeight:400, lineHeight:1.2, color:'var(--color-text-primary)', letterSpacing:'-0.015em', marginTop:'3rem', marginBottom:'1rem' }}>
        {block.replace('## ','')}
      </h2>
    )
    // h3
    if (block.startsWith('### ')) return (
      <h3 key={i} style={{ fontFamily:'var(--font-playfair,serif)', fontSize:'clamp(17px,2vw,22px)', fontWeight:400, color:'var(--color-text-primary)', marginTop:'2rem', marginBottom:'0.75rem' }}>
        {block.replace('### ','')}
      </h3>
    )
    // blockquote
    if (block.startsWith('> ')) return (
      <blockquote key={i} style={{ borderLeft:'2px solid var(--color-accent)', paddingLeft:'1.25rem', marginLeft:0, marginBottom:'1.5rem' }}>
        <p style={{ fontSize:17, lineHeight:1.8, color:'var(--color-text-secondary)', fontStyle:'italic', margin:0 }}>
          {renderInline(block.replace(/^> /gm,''))}
        </p>
      </blockquote>
    )
    // unordered list
    if (block.match(/^[-*] /m)) {
      const items = block.split('\n').filter(l => l.match(/^[-*] /))
      return (
        <ul key={i} style={{ paddingLeft:'1.5rem', marginBottom:'1.5rem', display:'flex', flexDirection:'column', gap:'0.4rem' }}>
          {items.map((item, j) => (
            <li key={j} style={{ fontSize:16, lineHeight:1.8, color:'var(--color-text-secondary)' }}>
              {renderInline(item.replace(/^[-*] /,''))}
            </li>
          ))}
        </ul>
      )
    }
    // ordered list
    if (block.match(/^\d+\. /m)) {
      const items = block.split('\n').filter(l => l.match(/^\d+\. /))
      return (
        <ol key={i} style={{ paddingLeft:'1.5rem', marginBottom:'1.5rem', display:'flex', flexDirection:'column', gap:'0.4rem' }}>
          {items.map((item, j) => (
            <li key={j} style={{ fontSize:16, lineHeight:1.8, color:'var(--color-text-secondary)' }}>
              {renderInline(item.replace(/^\d+\. /,''))}
            </li>
          ))}
        </ol>
      )
    }
    // horizontal rule
    if (block.trim() === '---' || block.trim() === '***') return (
      <hr key={i} style={{ border:'none', borderTop:'0.5px solid var(--color-border)', margin:'2.5rem 0' }}/>
    )
    // regular paragraph
    return (
      <p key={i} style={{ fontSize:16, lineHeight:1.85, color:'var(--color-text-secondary)', marginBottom:'1.5rem' }}>
        {renderInline(block)}
      </p>
    )
  })
}

function renderInline(text: string): React.ReactNode {
  // Split on bold, italic, bold+italic, and links
  const parts = text.split(/(\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|\*[^*]+\*|_[^_]+_|\[([^\]]+)\]\(([^)]+)\))/)
  return parts.map((part, i) => {
    if (part.startsWith('***') && part.endsWith('***')) return <strong key={i} style={{ fontStyle:'italic', color:'var(--color-text-primary)', fontWeight:600 }}>{part.slice(3,-3)}</strong>
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={i} style={{ color:'var(--color-text-primary)', fontWeight:600 }}>{part.slice(2,-2)}</strong>
    if ((part.startsWith('*') && part.endsWith('*')) || (part.startsWith('_') && part.endsWith('_'))) return <em key={i} style={{ color:'var(--color-text-secondary)', fontStyle:'italic' }}>{part.slice(1,-1)}</em>
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (linkMatch) return <a key={i} href={linkMatch[2]} target="_blank" rel="noopener noreferrer" style={{ color:'var(--color-accent)', textDecoration:'none' }}>{linkMatch[1]}</a>
    return part
  })
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return { title: 'Not Found' }
  return {
    title: post.title,
    description: post.excerpt || `${post.title} — written by Niddhish Puuzhakkal, film director and behavioral strategist based in Mumbai.`,
    authors: [{ name: 'Niddhish Puuzhakkal', url: 'https://niddhish.com' }],
    alternates: { canonical: `https://niddhish.com/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.created_at,
      authors: ['Niddhish Puuzhakkal'],
      tags: [post.category, 'film director', 'brand strategy', 'Mumbai'],
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [post, otherPosts] = await Promise.all([getPost(slug), getOtherPosts(slug)])
  if (!post) notFound()

  const embedUrl = post.video_url ? getEmbedUrl(post.video_url) : null
  const fmt = (iso: string) => {
    try { return new Date(iso).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }) }
    catch { return '' }
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    author: {
      '@type': 'Person',
      name: 'Niddhish Puuzhakkal',
      url: 'https://niddhish.com',
      jobTitle: 'Film Director & Brand Strategist',
    },
    publisher: {
      '@type': 'Person',
      name: 'Niddhish Puuzhakkal',
      url: 'https://niddhish.com',
    },
    datePublished: post.created_at,
    dateModified: post.created_at,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://niddhish.com/blog/${post.slug}` },
    keywords: [post.category, 'film director Mumbai', 'brand strategy', 'behavioral filmmaking'],
  }

  return (
    <div style={{ minHeight:'100dvh', background:'var(--color-bg)', paddingTop:'8rem' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
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

      {/* Video embed */}
      {embedUrl && (
        <div style={{ padding:'0 clamp(1.25rem,5vw,3.5rem)', maxWidth:780, marginBottom:'3rem' }}>
          <div style={{ position:'relative', aspectRatio:'16/9', background:'#000', overflow:'hidden' }}>
            <iframe
              src={embedUrl}
              style={{ position:'absolute', inset:0, width:'100%', height:'100%', border:'none' }}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title={post.title}
            />
          </div>
        </div>
      )}

      {/* Article body */}
      <div style={{ padding:'0 clamp(1.25rem,5vw,3.5rem)', maxWidth:720, marginBottom:'6rem' }}>
        {renderContent(post.content)}
      </div>

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
