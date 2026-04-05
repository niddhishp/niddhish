'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ApertureMark from '@/components/ApertureMark'

const NAV = [
  { group: 'Overview', items: [
    { label: 'Dashboard',     href: '/admin',           icon: '⊞' },
  ]},
  { group: 'Content', items: [
    { label: 'Hero Video',    href: '/admin/hero',       icon: '▶' },
    { label: 'Site Content',  href: '/admin/content',    icon: '≡' },
    { label: 'About Page',    href: '/admin/about',      icon: '◎' },
  ]},
  { group: 'Portfolio', items: [
    { label: 'Projects',      href: '/admin/projects',    icon: '◼' },
    { label: 'Categories',    href: '/admin/categories',  icon: '⊕' },
    { label: 'Feature Films', href: '/admin/films',       icon: '🎬' },
    { label: 'Books',         href: '/admin/books',       icon: '📖' },
    { label: 'Client Logos',  href: '/admin/logos',       icon: '◈' },
    { label: 'Testimonials',  href: '/admin/testimonials',icon: '✦' },
    { label: 'Awards',        href: '/admin/awards',      icon: '🏆' },
    { label: 'Press',         href: '/admin/press',       icon: '📰' },
  ]},
  { group: 'Engage', items: [
    { label: 'Blog Posts',    href: '/admin/blog',       icon: '✎' },
    { label: 'Inquiries',     href: '/admin/contacts',   icon: '✉' },
  ]},
  { group: 'Technical', items: [
    { label: 'SEO',           href: '/admin/seo',        icon: '⚙' },
    { label: 'Settings',      href: '/admin/settings',   icon: '⚙' },
  ]},
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div style={{ minHeight: '100dvh', background: '#070707', display: 'grid', gridTemplateColumns: '220px 1fr' }}>
      {/* Sidebar */}
      <aside style={{
        borderRight: '0.5px solid var(--color-border)',
        padding: '1.75rem 1.25rem',
        position: 'sticky', top: 0, height: '100dvh',
        display: 'flex', flexDirection: 'column',
        overflowY: 'auto',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: '2rem' }}>
          <ApertureMark size={22} />
          <div>
            <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-primary)', display: 'block' }}>Niddhish</span>
            <span style={{ fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>CMS</span>
          </div>
        </Link>

        {NAV.map(group => (
          <div key={group.group} style={{ marginBottom: '1.5rem' }}>
            <p style={{ fontSize: 8, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', padding: '0 0.75rem', marginBottom: '0.4rem' }}>
              {group.group}
            </p>
            {group.items.map(item => {
              const isActive = item.href === '/admin' ? pathname === '/admin' : pathname?.startsWith(item.href)
              return (
                <Link key={item.href} href={item.href} style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '0.5rem 0.75rem', borderRadius: 2,
                  fontSize: 12, letterSpacing: '0.02em',
                  color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                  background: isActive ? 'rgba(232,104,58,0.08)' : 'transparent',
                  textDecoration: 'none',
                  borderLeft: isActive ? '1.5px solid var(--color-accent)' : '1.5px solid transparent',
                }}>
                  <span style={{ fontSize: 10, opacity: 0.5 }}>{item.icon}</span>
                  {item.label}
                </Link>
              )
            })}
          </div>
        ))}

        <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '0.5px solid var(--color-border)' }}>
          <Link href="/" style={{ fontSize: 11, color: 'var(--color-text-tertiary)', textDecoration: 'none', letterSpacing: '0.04em' }}>
            ← View Site
          </Link>
        </div>
      </aside>

      {/* Content */}
      <main style={{ padding: '2.5rem 3rem', overflowY: 'auto' }}>
        {children}
      </main>

      <style>{`
        @media(max-width:768px){
          div[style*="220px 1fr"]{grid-template-columns:1fr!important;}
          aside{display:none!important;}
        }
        body { cursor: auto !important; }
        a, button { cursor: pointer !important; }
      `}</style>
    </div>
  )
}
