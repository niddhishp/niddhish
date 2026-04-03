import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Press',
  description: 'Media coverage, podcast appearances, and thought leadership by Niddhish Puuzhakkal.',
}

const PRESS = [
  {
    outlet: 'Campaign India',
    title: 'How behavioral science is reshaping Indian advertising',
    type: 'Feature Interview',
    year: '2024',
    url: '#',
  },
  {
    outlet: 'The Economic Times',
    title: 'Niddhish Puuzhakkal: The director who approaches films like a scientist',
    type: 'Profile',
    year: '2024',
    url: '#',
  },
  {
    outlet: 'Adgully',
    title: '200 commercials and counting — the method behind the work',
    type: 'Interview',
    year: '2023',
    url: '#',
  },
  {
    outlet: 'Brand Equity',
    title: 'Creative intelligence in the age of AI-generated content',
    type: 'Op-Ed',
    year: '2023',
    url: '#',
  },
  {
    outlet: 'Mid-Day',
    title: 'EGO: Arshad Warsi and the director behind the lens',
    type: 'Film Feature',
    year: '2024',
    url: '#',
  },
  {
    outlet: 'AFAQS',
    title: 'Why the best brand films fail at the box office of behaviour',
    type: 'Op-Ed',
    year: '2022',
    url: '#',
  },
]

const PODCASTS = [
  {
    show: 'The Planner\'s Manifesto',
    episode: 'Behavioral Filmmaking: Engineering Emotion at Scale',
    host: 'Rahul Singh',
    year: '2024',
    url: '#',
  },
  {
    show: 'Creative Disruption Podcast',
    episode: 'When Psychology Meets Cinema',
    host: 'Priya Mehta',
    year: '2024',
    url: '#',
  },
  {
    show: 'Brand Matters',
    episode: 'The 60-Second Behavioral Intervention',
    host: 'Vikram Sood',
    year: '2023',
    url: '#',
  },
]

const SPEAKING = [
  { event: 'FICCI Frames', topic: 'Behavioral Architecture in Film', year: '2024' },
  { event: 'Goafest', topic: 'The Psychology of Great Advertising', year: '2023' },
  { event: 'EMDI School of Broadcasting', topic: 'Masterclass: Directing for Behaviour', year: '2022' },
  { event: 'Kyoorius Designyatra', topic: 'Creative Intelligence in Practice', year: '2022' },
]

export default function PressPage() {
  return (
    <div style={{ minHeight: '100dvh', background: 'var(--color-bg)', paddingTop: '8rem' }}>
      {/* Header */}
      <div style={{ padding: '0 clamp(1.25rem,5vw,3.5rem)', marginBottom: '4rem' }}>
        <div style={{
          fontFamily: '"JetBrains Mono","Courier New",monospace',
          fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase',
          color: 'rgba(232,104,58,0.5)', marginBottom: '1rem',
        }}>
          SCENE 07 — THE RECORD
        </div>
        <span className="text-label" style={{ display: 'block', marginBottom: '0.75rem' }}>Press & Media</span>
        <h1 className="text-display-md" style={{ color: 'var(--color-text-primary)', maxWidth: 640 }}>
          On the record.{' '}
          <em style={{ color: 'var(--color-accent)' }}>Coverage, conversations, appearances.</em>
        </h1>
      </div>

      {/* Press articles */}
      <div style={{ padding: '0 clamp(1.25rem,5vw,3.5rem)', marginBottom: '5rem' }}>
        <span className="text-label" style={{ display: 'block', marginBottom: '2rem' }}>Articles & Features</span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 1, background: 'var(--color-border)' }}>
          {PRESS.map(item => (
            <a
              key={item.title}
              href={item.url}
              style={{
                display: 'block', padding: '2rem',
                background: 'var(--color-bg)',
                textDecoration: 'none',
                transition: 'background 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-accent)' }}>
                  {item.outlet}
                </span>
                <span style={{ fontSize: 10, color: 'var(--color-text-tertiary)', letterSpacing: '0.06em' }}>
                  {item.type} · {item.year}
                </span>
              </div>
              <h3 style={{
                fontFamily: 'var(--font-playfair,serif)',
                fontSize: 16, fontWeight: 400, lineHeight: 1.4,
                color: 'var(--color-text-primary)',
              }}>
                {item.title}
              </h3>
            </a>
          ))}
        </div>
      </div>

      {/* Podcasts */}
      <div style={{ padding: '0 clamp(1.25rem,5vw,3.5rem)', marginBottom: '5rem' }}>
        <span className="text-label" style={{ display: 'block', marginBottom: '2rem' }}>Podcast Appearances</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, borderTop: '0.5px solid var(--color-border)' }}>
          {PODCASTS.map((pod, i) => (
            <a
              key={pod.episode}
              href={pod.url}
              style={{
                display: 'grid', gridTemplateColumns: '1fr auto',
                alignItems: 'center', gap: '2rem',
                padding: '2rem 0',
                borderBottom: '0.5px solid var(--color-border)',
                textDecoration: 'none',
                transition: 'padding-left 0.3s',
              }}
            >
              <div>
                <p style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: '0.4rem' }}>
                  {pod.show} · hosted by {pod.host}
                </p>
                <h3 style={{
                  fontFamily: 'var(--font-playfair,serif)',
                  fontSize: 17, fontWeight: 400, lineHeight: 1.3,
                  color: 'var(--color-text-primary)',
                }}>
                  {pod.episode}
                </h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                <span style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>{pod.year}</span>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  border: '0.5px solid var(--color-border-mid)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="10" height="12" viewBox="0 0 10 12" fill="var(--color-accent)">
                    <path d="M1 1l8 5-8 5V1z"/>
                  </svg>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Speaking */}
      <div style={{ background: 'var(--color-surface-1)', padding: '4rem clamp(1.25rem,5vw,3.5rem)', marginBottom: 0 }}>
        <span className="text-label" style={{ display: 'block', marginBottom: '2rem' }}>Speaking & Events</span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {SPEAKING.map(s => (
            <div key={s.event} style={{
              padding: '1.5rem',
              border: '0.5px solid var(--color-border)',
              borderLeft: '2px solid var(--color-accent)',
            }}>
              <p style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '0.5rem' }}>
                {s.event} · {s.year}
              </p>
              <p style={{ fontSize: 15, fontFamily: 'var(--font-playfair,serif)', color: 'var(--color-text-primary)', lineHeight: 1.35 }}>
                {s.topic}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Press contact */}
      <div style={{
        padding: '4rem clamp(1.25rem,5vw,3.5rem)',
        borderTop: '0.5px solid var(--color-border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem',
      }}>
        <div>
          <span className="text-label" style={{ display: 'block', marginBottom: '0.75rem' }}>Press Inquiries</span>
          <p style={{ fontSize: 15, color: 'var(--color-text-secondary)' }}>
            For interviews, features, and media requests
          </p>
        </div>
        <a href="mailto:niddhish@lightseekermedia.com" className="btn-ghost">
          niddhish@lightseekermedia.com
        </a>
      </div>
    </div>
  )
}
