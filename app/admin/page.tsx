import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Dashboard' }

const QUICK_LINKS = [
  { label:'View all contacts',  href:'/admin/contacts', desc:'Project brief submissions' },
  { label:'Manage blog posts',  href:'/admin/blog',     desc:'Create and publish articles' },
  { label:'Manage films',       href:'/admin/films',    desc:'Portfolio and film data' },
  { label:'View live site →',   href:'/',               desc:'niddhish.vercel.app' },
]

export default function AdminDashboard() {
  const hasSupabaseUrl  = !!process.env.NEXT_PUBLIC_SUPABASE_URL
  const hasAnonKey      = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const hasServiceKey   = !!process.env.SUPABASE_SERVICE_ROLE_KEY

  const SETUP = [
    {
      title: 'NEXT_PUBLIC_SUPABASE_URL',
      detail: 'https://hvgxjpeqqedluxofnrgb.supabase.co',
      done: hasSupabaseUrl,
    },
    {
      title: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      detail: 'sb_publishable_FzSJuCY… (from Supabase → Settings → API)',
      done: hasAnonKey,
    },
    {
      title: 'SUPABASE_SERVICE_ROLE_KEY',
      detail: 'Get from Supabase → Project Settings → API → service_role (secret)',
      done: hasServiceKey,
    },
    {
      title: 'Run supabase-schema.sql in Supabase SQL editor',
      detail: 'Open supabase-schema.sql from the repo and paste into Supabase → SQL Editor → New Query',
      done: false,
    },
    {
      title: 'Add your photo',
      detail: 'Upload niddhish-photo.jpg to /public in the repo → replaces placeholder in About page',
      done: false,
    },
    {
      title: 'Point niddhish.com DNS to Vercel',
      detail: 'Add CNAME record pointing to niddhish.vercel.app in your registrar',
      done: false,
    },
    {
      title: 'Set Vimeo videos to public + embeddable',
      detail: 'In Vimeo settings → Privacy → Anyone with the link + Allow embedding',
      done: false,
    },
  ]

  return (
    <div>
      <div style={{ marginBottom:'2.5rem' }}>
        <div style={{ fontFamily:'"JetBrains Mono","Courier New",monospace', fontSize:9, letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(232,104,58,0.5)', marginBottom:'0.75rem' }}>ADMIN CONSOLE</div>
        <h1 style={{ fontFamily:'var(--font-playfair,serif)', fontSize:32, fontWeight:400, color:'var(--color-text-primary)', letterSpacing:'-0.02em', marginBottom:'0.5rem' }}>Dashboard</h1>
        <p style={{ fontSize:14, color:'var(--color-text-secondary)' }}>niddhish.com — Light Seeker Films</p>
      </div>

      {/* Supabase status banner */}
      {(!hasSupabaseUrl || !hasAnonKey || !hasServiceKey) && (
        <div style={{ padding:'1rem 1.5rem', border:'0.5px solid rgba(232,104,58,0.4)', background:'rgba(232,104,58,0.06)', marginBottom:'2rem', borderRadius:2 }}>
          <p style={{ fontSize:13, color:'#e8683a', fontWeight:500, marginBottom:'0.5rem' }}>⚠ Supabase not connected</p>
          <p style={{ fontSize:12, color:'var(--color-text-secondary)', lineHeight:1.6 }}>
            Contacts, blog posts, and dynamic data won&apos;t work until you add the three env vars in<br/>
            <strong style={{ color:'var(--color-text-primary)' }}>Vercel → reactic → niddhish → Settings → Environment Variables</strong>
          </p>
        </div>
      )}

      {/* Quick links */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'1rem', marginBottom:'3rem' }}>
        {QUICK_LINKS.map(l => (
          <Link key={l.href} href={l.href} style={{ display:'block', padding:'1.5rem', border:'0.5px solid var(--color-border)', background:'var(--color-surface-1)', textDecoration:'none', transition:'border-color 0.2s', borderRadius:2 }}>
            <p style={{ fontSize:14, fontWeight:500, color:'var(--color-text-primary)', marginBottom:'0.25rem' }}>{l.label}</p>
            <p style={{ fontSize:12, color:'var(--color-text-tertiary)' }}>{l.desc}</p>
          </Link>
        ))}
      </div>

      {/* Setup checklist */}
      <h2 style={{ fontSize:12, fontWeight:500, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--color-text-tertiary)', marginBottom:'1.5rem' }}>Setup Checklist</h2>
      <div style={{ display:'flex', flexDirection:'column' }}>
        {SETUP.map((step, i) => (
          <div key={step.title} style={{
            display:'grid', gridTemplateColumns:'24px 1fr 24px',
            alignItems:'start', gap:'1rem', padding:'1.25rem 0',
            borderBottom: i < SETUP.length - 1 ? '0.5px solid var(--color-border)' : 'none',
          }}>
            <span style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:10, color:'var(--color-text-tertiary)', paddingTop:2 }}>
              {String(i+1).padStart(2,'0')}
            </span>
            <div>
              <p style={{ fontSize:14, color:'var(--color-text-primary)', marginBottom:'0.25rem' }}>{step.title}</p>
              <p style={{ fontSize:12, color:'var(--color-text-tertiary)', lineHeight:1.5 }}>{step.detail}</p>
            </div>
            <div style={{
              width:20, height:20,
              border: step.done ? 'none' : '1.5px solid var(--color-border-mid)',
              background: step.done ? 'var(--color-accent)' : 'transparent',
              borderRadius:2, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:2,
            }}>
              {step.done && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
