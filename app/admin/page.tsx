import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Dashboard' }

const QUICK_LINKS = [
  { label: 'View all contacts',  href: '/admin/contacts', desc: 'Project brief submissions' },
  { label: 'Manage blog posts',  href: '/admin/blog',     desc: 'Create and publish articles' },
  { label: 'Manage films',       href: '/admin/films',    desc: 'Portfolio and film data' },
  { label: 'View live site',     href: '/',               desc: 'niddhish.vercel.app' },
]

const SETUP_STEPS = [
  { step: '01', title: 'Add Supabase env vars to Vercel', detail: 'NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY', done: false },
  { step: '02', title: 'Run schema SQL in Supabase', detail: 'Create contacts and blog_posts tables — schema available in lib/supabase.ts', done: false },
  { step: '03', title: 'Add your photo', detail: 'Upload niddhish-photo.jpg to /public — replace placeholder in About page', done: false },
  { step: '04', title: 'Point niddhish.com DNS to Vercel', detail: 'Add CNAME record pointing to niddhish.vercel.app in your registrar', done: false },
  { step: '05', title: 'Set Vimeo videos to public + embeddable', detail: 'Allow embedding in Vimeo settings so inline player works on site', done: false },
  { step: '06', title: 'Update Vimeo video IDs', detail: 'Replace placeholder IDs in sections/WorkReel.tsx with real public video IDs', done: false },
]

export default function AdminDashboard() {
  return (
    <div>
      <div style={{ marginBottom: '3rem' }}>
        <div style={{
          fontFamily: '"JetBrains Mono","Courier New",monospace',
          fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase',
          color: 'rgba(232,104,58,0.5)', marginBottom: '0.75rem',
        }}>
          ADMIN CONSOLE
        </div>
        <h1 style={{
          fontFamily: 'var(--font-playfair,serif)',
          fontSize: 32, fontWeight: 400, color: 'var(--color-text-primary)',
          letterSpacing: '-0.02em', marginBottom: '0.5rem',
        }}>
          Dashboard
        </h1>
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
          niddhish.com — Light Seeker Films
        </p>
      </div>

      {/* Quick links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '3rem' }}>
        {QUICK_LINKS.map(link => (
          <Link key={link.href} href={link.href} style={{
            display: 'block', padding: '1.5rem',
            border: '0.5px solid var(--color-border)',
            background: 'var(--color-surface-1)',
            textDecoration: 'none',
            transition: 'border-color 0.2s',
            borderRadius: 2,
          }}>
            <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>
              {link.label} →
            </p>
            <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>{link.desc}</p>
          </Link>
        ))}
      </div>

      {/* Setup checklist */}
      <div>
        <h2 style={{ fontSize: 14, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: '1.5rem' }}>
          Setup Checklist
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {SETUP_STEPS.map(step => (
            <div key={step.step} style={{
              display: 'grid', gridTemplateColumns: '48px 1fr 32px',
              alignItems: 'start', gap: '1rem',
              padding: '1.25rem 0',
              borderBottom: '0.5px solid var(--color-border)',
            }}>
              <span style={{
                fontFamily: '"JetBrains Mono","Courier New",monospace',
                fontSize: 11, color: 'var(--color-text-tertiary)', paddingTop: '2px',
              }}>{step.step}</span>
              <div>
                <p style={{ fontSize: 14, color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>{step.title}</p>
                <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', lineHeight: 1.5 }}>{step.detail}</p>
              </div>
              <div style={{
                width: 20, height: 20,
                border: step.done ? 'none' : '1.5px solid var(--color-border-mid)',
                background: step.done ? 'var(--color-accent)' : 'transparent',
                borderRadius: 2,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, marginTop: 2,
              }}>
                {step.done && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
