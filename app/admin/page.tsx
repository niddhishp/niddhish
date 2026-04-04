import type { Metadata } from 'next'
import Link from 'next/link'
import { VIDEOS, FEATURE_FILMS } from '@/lib/videos'

export const metadata: Metadata = { title: 'Dashboard' }

const STATS = [
  { label: 'Brand Films',   value: VIDEOS.length,        href: '/admin/projects' },
  { label: 'Feature Films', value: FEATURE_FILMS.length, href: '/admin/films' },
  { label: 'Categories',    value: 6,                    href: '/admin/categories' },
]
const QUICK = [
  { label: '+ Add Commercial',  href: '/admin/projects', sub: 'TVC, brand film, or ad' },
  { label: '+ Add Feature Film',href: '/admin/films',    sub: 'EGO, Palkon Pe, Canvas…' },
  { label: '+ Write Blog Post', href: '/admin/blog',     sub: 'Publish to /blog' },
  { label: '+ Add Press Item',  href: '/admin/press',    sub: 'Article or podcast' },
  { label: 'View Inquiries',    href: '/admin/contacts', sub: 'Contact form submissions' },
  { label: 'Edit About Page',   href: '/admin/about',    sub: 'Portrait, bio, stats' },
  { label: 'Hero Video',        href: '/admin/hero',     sub: 'Change homepage video' },
  { label: 'SEO Settings',      href: '/admin/seo',      sub: 'Meta, OG, sitemap' },
]

export default function AdminDashboard() {
  const hasUrl  = !!process.env.NEXT_PUBLIC_SUPABASE_URL
  const hasAnon = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const hasSvc  = !!process.env.SUPABASE_SERVICE_ROLE_KEY
  const connected = hasUrl && hasAnon && hasSvc

  return (
    <div>
      <div style={{ marginBottom:'2.5rem' }}>
        <div style={{ fontFamily:'"JetBrains Mono","Courier New",monospace', fontSize:9, letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(232,104,58,0.5)', marginBottom:'0.75rem' }}>CMS</div>
        <h1 style={{ fontFamily:'var(--font-playfair,serif)', fontSize:32, fontWeight:400, color:'var(--color-text-primary)', letterSpacing:'-0.02em', marginBottom:'0.4rem' }}>Dashboard</h1>
        <p style={{ fontSize:14, color:'var(--color-text-secondary)' }}>niddhish.com · Light Seeker Films</p>
      </div>

      {!connected ? (
        <div style={{ padding:'1rem 1.5rem', border:'0.5px solid rgba(232,104,58,0.4)', background:'rgba(232,104,58,0.05)', marginBottom:'2rem', borderRadius:2 }}>
          <p style={{ fontSize:13, color:'#e8683a', fontWeight:500, marginBottom:'0.4rem' }}>⚠ Supabase not fully connected</p>
          <p style={{ fontSize:12, color:'var(--color-text-secondary)', lineHeight:1.7 }}>
            Add the 3 env vars in <strong style={{ color:'var(--color-text-primary)' }}>Vercel → reactic → niddhish → Settings → Environment Variables</strong>, then redeploy.<br/>
            <code style={{ fontSize:11, background:'rgba(255,255,255,0.05)', padding:'0 4px' }}>NEXT_PUBLIC_SUPABASE_URL</code>{' '}
            <code style={{ fontSize:11, background:'rgba(255,255,255,0.05)', padding:'0 4px' }}>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>{' '}
            <code style={{ fontSize:11, background:'rgba(255,255,255,0.05)', padding:'0 4px' }}>SUPABASE_SERVICE_ROLE_KEY</code>
          </p>
        </div>
      ) : (
        <div style={{ padding:'0.875rem 1.25rem', border:'0.5px solid rgba(80,200,120,0.3)', background:'rgba(80,200,120,0.05)', marginBottom:'2rem', borderRadius:2 }}>
          <p style={{ fontSize:13, color:'rgba(80,200,120,0.9)' }}>● Supabase connected — all admin sections write to your database and appear on the live site</p>
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem', marginBottom:'2.5rem' }}>
        {STATS.map(s => (
          <Link key={s.href} href={s.href} style={{ padding:'1.5rem', border:'0.5px solid var(--color-border)', background:'var(--color-surface-1)', textDecoration:'none', display:'block' }}>
            <p style={{ fontFamily:'var(--font-playfair,serif)', fontSize:36, color:'var(--color-text-primary)', marginBottom:'0.25rem', lineHeight:1 }}>{s.value}</p>
            <p style={{ fontSize:11, color:'var(--color-text-tertiary)', letterSpacing:'0.06em', textTransform:'uppercase' }}>{s.label}</p>
          </Link>
        ))}
      </div>

      <h2 style={{ fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--color-text-tertiary)', marginBottom:'1.25rem', fontWeight:500 }}>Quick Actions</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'0.75rem', marginBottom:'3rem' }}>
        {QUICK.map(q => (
          <Link key={q.href+q.label} href={q.href} style={{ padding:'1.1rem', border:'0.5px solid var(--color-border)', background:'var(--color-surface-1)', textDecoration:'none', borderRadius:2 }}>
            <p style={{ fontSize:13, color:'var(--color-accent)', marginBottom:'0.2rem', fontWeight:500 }}>{q.label}</p>
            <p style={{ fontSize:11, color:'var(--color-text-tertiary)' }}>{q.sub}</p>
          </Link>
        ))}
      </div>

      <h2 style={{ fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--color-text-tertiary)', marginBottom:'1.25rem', fontWeight:500 }}>Setup Checklist</h2>
      {[
        { done: hasUrl,  title:'NEXT_PUBLIC_SUPABASE_URL', detail:'https://hvgxjpeqqedluxofnrgb.supabase.co' },
        { done: hasAnon, title:'NEXT_PUBLIC_SUPABASE_ANON_KEY', detail:'sb_publishable_FzSJuCYCrIsXyfB7h6NQsw_RBuezRrf' },
        { done: hasSvc,  title:'SUPABASE_SERVICE_ROLE_KEY', detail:'Supabase → Project Settings → API → service_role key' },
        { done: true,    title:'Run supabase-schema.sql', detail:'Done ✓ (you just ran it)' },
        { done: false,   title:'Create Supabase Storage bucket "uploads"', detail:'Supabase Dashboard → Storage → New Bucket → Name: uploads → Public: ON' },
        { done: false,   title:'Upload niddhish-photo.jpg', detail:'Admin → About Page → Portrait Photo → Upload from computer' },
        { done: false,   title:'Point niddhish.com DNS to Vercel', detail:'CNAME record → niddhish.vercel.app in your domain registrar' },
      ].map((step, i) => (
        <div key={step.title} style={{ display:'grid', gridTemplateColumns:'20px 1fr 20px', gap:'1rem', padding:'1rem 0', borderBottom:'0.5px solid var(--color-border)', alignItems:'start' }}>
          <span style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:10, color:'var(--color-text-tertiary)', paddingTop:2 }}>{String(i+1).padStart(2,'0')}</span>
          <div>
            <p style={{ fontSize:13, color:'var(--color-text-primary)', marginBottom:'0.2rem' }}>{step.title}</p>
            <p style={{ fontSize:11, color:'var(--color-text-tertiary)', lineHeight:1.5 }}>{step.detail}</p>
          </div>
          <div style={{ width:18, height:18, border: step.done ? 'none' : '1.5px solid var(--color-border-mid)', background: step.done ? 'var(--color-accent)' : 'transparent', borderRadius:2, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:2 }}>
            {step.done && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5l2.5 2.5 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          </div>
        </div>
      ))}
    </div>
  )
}
