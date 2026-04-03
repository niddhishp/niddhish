'use client'

import Link from 'next/link'
import ApertureMark from './ApertureMark'

const socials = [
  { label: 'Vimeo',     href: 'https://vimeo.com/niddhish' },
  { label: 'LinkedIn',  href: 'https://linkedin.com/in/niddhish' },
  { label: 'Instagram', href: 'https://instagram.com/niddhishp' },
  { label: 'YouTube',   href: 'https://youtube.com/@niddhishp' },
]

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--color-bg)',
      borderTop: '0.5px solid var(--color-border)',
      padding: '2.5rem clamp(1.25rem, 5vw, 3.5rem)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '1.5rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <ApertureMark size={20} />
        <span style={{
          fontSize: 11, letterSpacing: '0.1em',
          textTransform: 'uppercase', color: 'var(--color-text-tertiary)',
        }}>
          © {new Date().getFullYear()} Light Seeker Films
        </span>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        {socials.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: 12, letterSpacing: '0.06em',
              color: 'var(--color-text-tertiary)',
              textDecoration: 'none',
              textTransform: 'uppercase',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = 'var(--color-text-secondary)')}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'var(--color-text-tertiary)')}
          >
            {label}
          </a>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        {(['Privacy', 'Terms'] as const).map((label) => (
          <Link
            key={label}
            href={`/${label.toLowerCase()}`}
            style={{
              fontSize: 11, color: 'var(--color-text-tertiary)',
              textDecoration: 'none', letterSpacing: '0.04em',
            }}
          >
            {label}
          </Link>
        ))}
      </div>
    </footer>
  )
}
