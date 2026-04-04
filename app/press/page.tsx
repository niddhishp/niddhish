import type { Metadata } from 'next'
import Link from 'next/link'
import PressClient from './PressClient'
import type { PressItem, PodcastItem } from './PressClient'

export const metadata: Metadata = {
  title: 'Press',
  description: 'Media coverage, podcast appearances, and thought leadership by Niddhish Puuzhakkal.',
}

const PRESS: PressItem[] = [
  {
    outlet: 'Campaign India',
    title: 'How behavioral science is reshaping Indian advertising',
    type: 'Feature Interview',
    year: '2024',
    url: '#',
    summary: 'A deep conversation on how behavioral psychology is entering the brief room — changing the way strategists, directors, and brand managers think about what a commercial is actually supposed to do. Niddhish discusses the shift from "emotional storytelling" to behavioral architecture, and why the best campaigns now start with a psychological objective rather than a creative concept.',
  },
  {
    outlet: 'The Economic Times',
    title: 'Niddhish Puuzhakkal: The director who approaches films like a scientist',
    type: 'Profile',
    year: '2024',
    url: '#',
    summary: 'A profile piece on Niddhish\'s dual identity as filmmaker and psychologist — how an MSc in psychology became the methodology behind 200+ commercials and three feature films. The piece covers his Six Sigma Black Belt, the "behavioral brief" framework he uses on every production, and the philosophy behind Light Seeker Films.',
  },
  {
    outlet: 'Adgully',
    title: '200 commercials and counting — the method behind the work',
    type: 'Interview',
    year: '2023',
    url: '#',
    summary: 'An interview tracing the creative journey from early advertising work to a full production company. Niddhish talks about the brands that shaped his thinking (Nike, Harley Davidson, Uber), what he looks for in a brief, and why he believes most creative failures happen in pre-production — not on the floor.',
  },
  {
    outlet: 'Brand Equity',
    title: 'Creative intelligence in the age of AI-generated content',
    type: 'Op-Ed',
    year: '2023',
    url: '#',
    summary: 'An op-ed arguing that AI is not the threat to creative professionals that the industry fears — it is, instead, the most powerful amplifier of creative intelligence that has ever existed. The piece draws on Niddhish\'s own use of generative tools in the filmmaking process and makes the case for "creative intelligence" as the irreplaceable human variable.',
  },
  {
    outlet: 'Mid-Day',
    title: 'EGO: Arshad Warsi and the director behind the lens',
    type: 'Film Feature',
    year: '2024',
    url: '#',
    summary: 'A feature on EGO — Niddhish\'s Bollywood debut starring Arshad Warsi, Juhi Chawla, Divya Dutta, and Gauhar Khan. The piece covers the film\'s journey from concept to production, the psychological themes at the core of the story, and what it means to bring a decade of commercial filmmaking discipline to a feature narrative.',
  },
  {
    outlet: 'AFAQS',
    title: 'Why the best brand films fail at the box office of behaviour',
    type: 'Op-Ed',
    year: '2022',
    url: '#',
    summary: 'A contrarian piece on the awards industry — arguing that the criteria by which advertising celebrates creative work are systematically disconnected from business outcomes. The piece calls for a new evaluation framework built around behavioral change metrics, not craft judgments, and proposes a "behavioral ROI" model for measuring creative effectiveness.',
  },
]

const PODCASTS: PodcastItem[] = [
  {
    show: 'The Planner\'s Manifesto',
    episode: 'Behavioral Filmmaking: Engineering Emotion at Scale',
    host: 'Rahul Singh',
    year: '2024',
    url: '#',
    summary: 'A two-hour conversation on the intersection of strategic planning and film direction. Niddhish and host Rahul Singh explore what happens when you treat a commercial as a behavioral intervention rather than a storytelling exercise — covering the "behavioral brief" framework, the psychology of purchase intent, and why creative strategy needs to start from neuroscience.',
  },
  {
    show: 'Creative Disruption Podcast',
    episode: 'When Psychology Meets Cinema',
    host: 'Priya Mehta',
    year: '2024',
    url: '#',
    summary: 'An exploration of Niddhish\'s dual formation as filmmaker and psychologist — how his MSc in psychology became the lens through which he reads every script and evaluates every edit. The conversation covers identity theory and brand loyalty, the behavioral architecture of a 60-second commercial, and the cognitive science behind why certain films create lasting behavioral change.',
  },
  {
    show: 'Brand Matters',
    episode: 'The 60-Second Behavioral Intervention',
    host: 'Vikram Sood',
    year: '2023',
    url: '#',
    summary: 'A focused discussion on the structural mechanics of high-performing TVCs — the six-act architecture Niddhish uses in every production, the specific psychological triggers that drive purchase intent, and why most commercials fail in the final eight seconds. Includes a real-time analysis of two well-known campaigns through the behavioral filmmaking lens.',
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
        }}>SCENE 07 — THE RECORD</div>
        <span className="text-label" style={{ display: 'block', marginBottom: '0.75rem' }}>Press & Media</span>
        <h1 className="text-display-md" style={{ color: 'var(--color-text-primary)', maxWidth: 640 }}>
          On the record.{' '}
          <em style={{ color: 'var(--color-accent)' }}>Coverage, conversations, appearances.</em>
        </h1>
      </div>

      {/* Interactive press + podcasts — client component */}
      <PressClient press={PRESS} podcasts={PODCASTS} />

      {/* Speaking — static, no interactivity needed */}
      <div style={{ background: 'var(--color-surface-1)', padding: '4rem clamp(1.25rem,5vw,3.5rem)' }}>
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
