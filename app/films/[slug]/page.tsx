import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { FEATURE_FILMS } from '@/lib/videos'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return FEATURE_FILMS.map(f => ({ slug: f.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const film = FEATURE_FILMS.find(f => f.slug === slug)
  if (!film) return {}
  return {
    title: `${film.title} — Niddhish Puuzhakkal`,
    description: film.synopsis,
  }
}

const STATUS_STYLE = {
  release:    { color: '#e8683a', border: 'rgba(232,104,58,0.5)', bg: 'rgba(232,104,58,0.1)' },
  post:       { color: '#84a8e8', border: 'rgba(100,140,220,0.4)', bg: 'rgba(100,140,220,0.1)' },
  production: { color: '#c8c870', border: 'rgba(180,180,100,0.4)', bg: 'rgba(180,180,100,0.1)' },
}

export default async function FilmPage({ params }: Props) {
  const { slug } = await params
  const film = FEATURE_FILMS.find(f => f.slug === slug)
  if (!film) notFound()

  const sc = STATUS_STYLE[film.status]

  return (
    <main style={{ background: 'var(--color-bg)', minHeight: '100dvh' }}>

      {/* Poster hero — full bleed */}
      <div style={{ position: 'relative', width: '100%', minHeight: '100dvh', display: 'flex', alignItems: 'flex-end' }}>
        {/* Poster / backdrop */}
        {film.posterUrl ? (
          <>
            <Image
              src={film.posterUrl}
              alt={`${film.title} poster`}
              fill
              priority
              unoptimized
              style={{ objectFit: 'cover', objectPosition: 'center top' }}
            />
            {/* gradient scrim so text is readable */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.85) 75%, rgba(0,0,0,0.97) 100%)',
            }} />
          </>
        ) : (
          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(160deg, ${film.palette[1]} 0%, ${film.palette[0]} 100%)`,
          }} />
        )}

        {/* Back nav */}
        <Link href="/work" style={{
          position: 'absolute', top: '2rem', left: 'clamp(1.5rem,5vw,4rem)',
          fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
          color: 'rgba(240,237,232,0.55)', textDecoration: 'none',
          display: 'flex', alignItems: 'center', gap: '0.5rem', zIndex: 10,
        }}>
          ← Filmography
        </Link>

        {/* Film info overlay */}
        <div style={{
          position: 'relative', zIndex: 5,
          padding: 'clamp(2rem,5vw,5rem) clamp(1.5rem,5vw,4rem)',
          width: '100%', maxWidth: 860,
        }}>
          {/* Status + year */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase',
              color: sc.color, background: sc.bg, border: `0.5px solid ${sc.border}`,
              padding: '3px 12px', borderRadius: 1,
            }}>{film.statusLabel}</span>
            <span style={{ fontFamily: '"JetBrains Mono","Courier New",monospace', fontSize: 10, color: 'rgba(240,237,232,0.4)', letterSpacing: '0.08em' }}>
              {film.year} · {film.language}
            </span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-playfair,"Playfair Display",Georgia,serif)',
            fontSize: 'clamp(52px,8vw,110px)', fontWeight: 400, lineHeight: 0.9,
            letterSpacing: '-0.04em', color: '#fff',
            marginBottom: '1rem',
          }}>{film.title}</h1>

          <p style={{
            fontSize: 'clamp(14px,1.5vw,18px)',
            fontFamily: 'var(--font-playfair,serif)', fontStyle: 'italic',
            color: 'rgba(240,237,232,0.7)', lineHeight: 1.5,
            maxWidth: 560, marginBottom: '1.5rem',
          }}>&ldquo;{film.tagline}&rdquo;</p>

          <p style={{ fontSize: 12, letterSpacing: '0.08em', color: 'rgba(240,237,232,0.45)', textTransform: 'uppercase' }}>
            {film.genre} · Directed by Niddhish Puuzhakkal
          </p>
        </div>
      </div>

      {/* Film body */}
      <div style={{ padding: 'clamp(3rem,6vw,6rem) clamp(1.5rem,5vw,4rem)', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '4rem', alignItems: 'start' }}>

          {/* Left: synopsis + cast */}
          <div>
            {/* Synopsis */}
            <div style={{ marginBottom: '4rem' }}>
              <span style={{ display: 'block', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(232,104,58,0.5)', marginBottom: '1.5rem' }}>
                Synopsis
              </span>
              <p style={{ fontSize: 17, lineHeight: 1.85, color: 'var(--color-text-secondary)', fontFamily: 'var(--font-playfair,serif)', fontWeight: 400 }}>
                {film.synopsis}
              </p>
            </div>

            {/* Cast */}
            {film.castList.length > 0 && (
              <div style={{ marginBottom: '4rem' }}>
                <span style={{ display: 'block', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(232,104,58,0.5)', marginBottom: '1.5rem' }}>
                  Cast
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem 2.5rem' }}>
                  {film.castList.map(c => (
                    <div key={c.name}>
                      <p style={{ fontSize: 16, color: 'var(--color-text-primary)', marginBottom: '0.2rem', fontFamily: 'var(--font-playfair,serif)' }}>{c.name}</p>
                      {c.role && <p style={{ fontSize: 11, color: 'var(--color-text-tertiary)', letterSpacing: '0.06em' }}>{c.role}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* BTS placeholder — note for future */}
            <div style={{ border: '0.5px dashed var(--color-border)', padding: '2rem', marginBottom: '3rem' }}>
              <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', letterSpacing: '0.06em', textAlign: 'center' }}>
                Behind-the-scenes images · Coming soon
              </p>
            </div>
          </div>

          {/* Right: poster card + crew */}
          <div>
            {/* Poster */}
            {film.posterUrl && (
              <div style={{ position: 'relative', aspectRatio: '2/3', marginBottom: '2.5rem', overflow: 'hidden' }}>
                <Image
                  src={film.posterUrl} alt={`${film.title} — Official Poster`}
                  fill unoptimized
                  style={{ objectFit: 'cover', objectPosition: 'top' }}
                />
              </div>
            )}

            {/* Crew */}
            <div>
              <span style={{ display: 'block', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(232,104,58,0.5)', marginBottom: '1.25rem' }}>
                Crew
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {film.crew.map(c => (
                  <div key={c.role} style={{ borderBottom: '0.5px solid var(--color-border)', paddingBottom: '0.875rem' }}>
                    <p style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: '0.25rem' }}>{c.role}</p>
                    <p style={{ fontSize: 14, color: 'var(--color-text-primary)' }}>{c.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Other films */}
      <div style={{ borderTop: '0.5px solid var(--color-border)', padding: 'clamp(3rem,5vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
        <p style={{ fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(232,104,58,0.5)', marginBottom: '2rem' }}>
          Other Projects
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {FEATURE_FILMS.filter(f => f.slug !== film.slug).map(f => (
            <Link key={f.slug} href={`/films/${f.slug}`} style={{
              display: 'flex', alignItems: 'center', gap: '1rem',
              padding: '1rem 1.5rem', border: '0.5px solid var(--color-border)',
              textDecoration: 'none', transition: 'border-color 0.2s',
              flex: '1 1 240px', maxWidth: 320,
            }}>
              {f.posterUrl ? (
                <div style={{ position: 'relative', width: 40, height: 60, flexShrink: 0, overflow: 'hidden' }}>
                  <Image src={f.posterUrl} alt={f.title} fill unoptimized style={{ objectFit: 'cover' }} />
                </div>
              ) : (
                <div style={{ width: 40, height: 60, background: `linear-gradient(160deg, ${f.palette[1]},${f.palette[0]})`, flexShrink: 0 }} />
              )}
              <div>
                <p style={{ fontSize: 14, color: 'var(--color-text-primary)', fontFamily: 'var(--font-playfair,serif)', marginBottom: '0.25rem' }}>{f.title}</p>
                <p style={{ fontSize: 10, color: 'var(--color-text-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{f.statusLabel}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        @media(max-width: 768px) {
          div[style*="grid-template-columns: 1fr 340px"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  )
}
