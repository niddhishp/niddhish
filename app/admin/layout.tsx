import type { Metadata } from 'next'
import Link from 'next/link'
import ApertureMark from '@/components/ApertureMark'

export const metadata: Metadata = {
  title: { default: 'Admin', template: '%s — Admin' },
  robots: { index: false, follow: false },
}

const NAV_ITEMS = [
  { label: 'Dashboard',  href: '/admin',          icon: '⊞' },
  { label: 'Contacts',   href: '/admin/contacts',  icon: '✉' },
  { label: 'Blog Posts', href: '/admin/blog',       icon: '✎' },
  { label: 'Films',      href: '/admin/films',      icon: '▶' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: '100dvh',
      background: '#070707',
      display: 'grid',
      gridTemplateColumns: '240px 1fr',
    }}>
      {/* Sidebar */}
      <aside style={{
        borderRight: '0.5px solid var(--color-border)',
        padding: '2rem 1.5rem',
        position: 'sticky', top: 0, height: '100dvh',
        display: 'flex', flexDirection: 'column',
        gap: '0.5rem',
        overflowY: 'auto',
      }}>
        <Link href="/" style={{
          display: 'flex', alignItems: 'center', gap: 10,
          textDecoration: 'none', marginBottom: '2.5rem',
        }}>
          <ApertureMark size={24} />
          <div>
            <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-primary)', display: 'block' }}>
              Niddhish
            </span>
            <span style={{ fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>
              Admin
            </span>
          </div>
        </Link>

        {NAV_ITEMS.map(item => (
          <Link key={item.href} href={item.href} style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '0.625rem 0.875rem',
            borderRadius: 2,
            fontSize: 13, letterSpacing: '0.02em',
            color: 'var(--color-text-secondary)',
            textDecoration: 'none',
            transition: 'background 0.15s, color 0.15s',
          }}>
            <span style={{ opacity: 0.5, fontSize: 12 }}>{item.icon}</span>
            {item.label}
          </Link>
        ))}

        <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '0.5px solid var(--color-border)' }}>
          <Link href="/" style={{
            fontSize: 12, color: 'var(--color-text-tertiary)', textDecoration: 'none',
            letterSpacing: '0.04em',
          }}>
            ← Back to site
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ padding: '3rem', overflowY: 'auto' }}>
        {children}
      </main>

      <style>{`
        @media(max-width:768px) {
          div[style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
          aside { display: none !important; }
        }
      `}</style>
    </div>
  )
}
