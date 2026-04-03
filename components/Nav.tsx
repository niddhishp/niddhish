'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ApertureMark from './ApertureMark'

const navItems = [
  { label: 'Work',        href: '/work' },
  { label: 'Blog',        href: '/blog' },
  { label: 'Press',       href: '/press' },
  { label: 'About',       href: '/about' },
  { label: 'Collaborate', href: '/collaborate' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)
  const pathname                = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [pathname])

  const navStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0, left: 0, right: 0,
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.1rem clamp(1.25rem, 5vw, 3.5rem)',
    background: scrolled ? 'rgba(10,10,10,0.92)' : 'transparent',
    backdropFilter: scrolled ? 'blur(14px)' : 'none',
    WebkitBackdropFilter: scrolled ? 'blur(14px)' : 'none',
    borderBottom: scrolled ? '0.5px solid rgba(240,237,232,0.07)' : 'none',
    transition: 'background 0.45s, backdrop-filter 0.45s, border-bottom 0.45s',
  }

  return (
    <>
      <nav style={navStyle} aria-label="Main navigation">
        {/* Logo */}
        <Link
          href="/"
          style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}
          aria-label="Niddhish — Home"
        >
          <ApertureMark size={28} />
          <span style={{
            fontSize: 11, fontWeight: 500, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: 'var(--color-text-primary)',
          }}>
            Niddhish
          </span>
        </Link>

        {/* Desktop links */}
        <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }} className="hidden sm:flex">
          {navItems.map(({ label, href }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                style={{
                  fontSize: 13, fontWeight: 400, letterSpacing: '0.04em',
                  color: active ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                  position: 'relative',
                }}
                onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.color = 'var(--color-text-primary)' }}
                onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.color = 'var(--color-text-secondary)' }}
              >
                {label}
              </Link>
            )
          })}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle navigation"
          aria-expanded={open}
          className="flex sm:hidden"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--color-text-primary)' }}
        >
          {open ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
              <line x1="0" y1="1" x2="22" y2="1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="0" y1="8" x2="22" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="0" y1="15" x2="22" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile overlay */}
      {open && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 99,
            background: 'rgba(10,10,10,0.97)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: '2.5rem',
          }}
        >
          {navItems.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              style={{
                fontFamily: 'var(--font-playfair, serif)',
                fontSize: 'clamp(2rem, 8vw, 3rem)',
                fontWeight: 400,
                color: pathname === href ? 'var(--color-accent)' : 'var(--color-text-primary)',
                textDecoration: 'none',
                letterSpacing: '-0.02em',
              }}
            >
              {label}
            </Link>
          ))}
          <div style={{ marginTop: '1rem' }}>
            <Link href="/collaborate" className="btn-primary">Start a Brief</Link>
          </div>
        </div>
      )}
    </>
  )
}
