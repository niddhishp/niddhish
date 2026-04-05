import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getSiteContent } from '@/lib/site-content'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'About',
  description: 'Filmmaker, psychologist, author, and creative strategist. 20+ years applying creative intelligence across film, brand, technology, and writing.',
}

const TIMELINE = [
  { year:'2024', event:'Bollywood debut — EGO (Arshad Warsi, Juhi Chawla, Divya Dutta, Gauhar Khan)' },
  { year:'2023', event:'Published Book on Creativity Vol. III — Creative Intelligence in the Age of AI' },
  { year:'2022', event:'Founded Light Seeker Films · Built AI-based reputation tech for brands' },
  { year:'2020', event:'Published Books on Creativity Vol. I & II · Launched brand strategy consultancy' },
  { year:'2018', event:'Creative Director & Strategy Lead — 360° campaigns across 60+ brands' },
  { year:'2015', event:'BBH India, VML Y&R — Senior creative leadership roles' },
  { year:'2012', event:'Taught filmmaking at EMDI School of Broadcasting' },
  { year:'2008', event:'Executive Producer, Star Plus — Set up in-house production for major agencies' },
  { year:'2004', event:'First TVC directed · MSc Psychology & Personnel Management completed' },
]

const CREDS = [
  { label:'MSc Psychology & Personnel Management', sub:'Applied behavioral science to storytelling' },
  { label:'Six Sigma Black Belt', sub:'Process engineering meets creative practice' },
  { label:'Project Management Professional (PMP)', sub:'Agile production systems for film' },
  { label:'NYFA · ZIMA · Washington Film Institute', sub:'Formal filmmaking training' },
]

export default async function AboutPage() {
  const content = await getSiteContent()
  return (
    <div style={{ minHeight:'100dvh', background:'var(--color-bg)', paddingTop:'8rem' }}>
      {/* Hero — photo + intro side by side */}
      <div style={{
        padding:'0 clamp(1.25rem,5vw,3.5rem)',
        marginBottom:'5rem',
        display:'grid',
        gridTemplateColumns:'340px 1fr',
        gap:'5rem',
        alignItems:'start',
        maxWidth:1280,
      }}>
        {/* Photo */}
        <div style={{ position:'sticky', top:'7rem' }}>
          <div style={{
            aspectRatio:'3/4',
            background:'var(--color-surface-2)',
            border:'0.5px solid var(--color-border)',
            position:'relative',
            overflow:'hidden',
          }}>
            {/* Director portrait — loaded from Supabase site_settings */}
            {content.about_photo_url ? (
              <Image
                src={content.about_photo_url}
                alt={content.about_name}
                fill
                sizes="340px"
                style={{ objectFit: 'cover', objectPosition: 'top' }}
                priority
                unoptimized
              />
            ) : (
              <div style={{
                position:'absolute', inset:0,
                background:'linear-gradient(135deg,#141414 0%,#0a0a0a 100%)',
                display:'flex', flexDirection:'column',
                alignItems:'center', justifyContent:'center', gap:'1rem',
              }}>
                <span style={{ fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--color-text-tertiary)' }}>
                  Niddhish Puuzhakkal
                </span>
                <span style={{ fontSize:10, color:'rgba(240,237,232,0.2)', textAlign:'center', maxWidth:200, lineHeight:1.5 }}>
                  Upload portrait in Admin → About Page
                </span>
              </div>
            )}
          </div>
          <div style={{ marginTop:'1.5rem' }}>
            <p style={{ fontSize:12,color:'var(--color-text-tertiary)',letterSpacing:'0.04em',lineHeight:1.6 }}>
              Mumbai, India · niddhish@lightseekermedia.com
            </p>
            <div style={{ display:'flex', gap:'1rem', marginTop:'1rem', flexWrap:'wrap' }}>
              {[
                { label:'Vimeo',    href:'https://vimeo.com/niddhish' },
                { label:'LinkedIn', href:'https://linkedin.com/in/niddhish' },
                { label:'Instagram',href:'https://instagram.com/niddhishp' },
              ].map(s=>(
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{
                  fontSize:11,letterSpacing:'0.08em',textTransform:'uppercase',
                  color:'var(--color-text-tertiary)',textDecoration:'none',transition:'color 0.2s',
                }}>
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Intro */}
        <div>
          <div style={{
            fontFamily:'"JetBrains Mono","Courier New",monospace',
            fontSize:9,letterSpacing:'0.14em',textTransform:'uppercase',
            color:'rgba(232,104,58,0.5)',marginBottom:'1rem',
          }}>SCENE 06 — THE DIRECTOR</div>
          <span className="text-label" style={{ display:'block', marginBottom:'0.75rem' }}>About</span>
          <h1 className="text-display-md" style={{
            color:'var(--color-text-primary)',maxWidth:800,marginBottom:'2rem',
          }}>
            Not a multi-hyphenate.{' '}
            <em style={{ color:'var(--color-accent)' }}>One discipline, six surfaces.</em>
          </h1>
          <p style={{ fontSize:17,lineHeight:1.78,color:'var(--color-text-secondary)',maxWidth:640,marginBottom:'1.5rem' }}>
            Every discipline I work in — film, psychology, brand strategy, technology, writing, PR — is the same action applied to a different surface. The action is: take a complex human problem and solve it with creative intelligence.
          </p>
          <p style={{ fontSize:17,lineHeight:1.78,color:'var(--color-text-secondary)',maxWidth:640 }}>
            I studied psychology before I studied filmmaking. That wasn&apos;t accidental. Understanding why people feel what they feel, and how narrative structure manipulates emotion at a neurological level — that is the methodology behind 200+ commercials, 3 films, 3 books, and 20 years of work.
          </p>
        </div>
      </div>

      {/* The story beat */}
      <div style={{ background:'var(--color-surface-1)', padding:'5rem clamp(1.25rem,5vw,3.5rem)', marginBottom:'0' }}>
        <div style={{ maxWidth:760 }}>
          <span className="accent-line" style={{ marginBottom:'2rem' }} />
          {content.about_story ? (
            (() => {
              const story = content.about_story.replace(/^"|"$/g, '')
              const paras = story.split(/\\n\\n|\n\n/)
              return (
                <>
                  <blockquote style={{ fontFamily:'var(--font-playfair,serif)', fontSize:'clamp(20px,2.8vw,34px)', fontWeight:400, fontStyle:'italic', color:'var(--color-text-primary)', lineHeight:1.4 }}>
                    &ldquo;{paras[0]}&rdquo;
                  </blockquote>
                  {paras.slice(1).map((p, i) => (
                    <p key={i} style={{ marginTop:'1.5rem', fontSize:15, lineHeight:1.75, color:'var(--color-text-secondary)' }}>{p}</p>
                  ))}
                </>
              )
            })()
          ) : (
            <>
              <blockquote style={{ fontFamily:'var(--font-playfair,serif)', fontSize:'clamp(20px,2.8vw,34px)', fontWeight:400, fontStyle:'italic', color:'var(--color-text-primary)', lineHeight:1.4 }}>
                &ldquo;Early in my career I directed a film I was genuinely proud of. The client loved it. The agency celebrated. Then the sales numbers came out. Nothing moved. And nobody could explain why.&rdquo;
              </blockquote>
              <p style={{ marginTop:'2rem', fontSize:15, lineHeight:1.75, color:'var(--color-text-secondary)' }}>
                I went back to my psychology training and looked at the film as a behavioral stimulus — not a piece of craft. I found the exact moment where I had made the audience feel good about the brand instead of feel urgency to act. Two shots. Probably cost ₹40,000 to reshoot. That difference is the difference between a commercial and a campaign that works.
              </p>
              <p style={{ marginTop:'1.5rem', fontSize:15, lineHeight:1.75, color:'var(--color-text-secondary)' }}>
                Since then I&apos;ve built every film backwards from the behavioral outcome. The brief is never &lsquo;make something beautiful&rsquo; — it&apos;s &lsquo;make them do this specific thing after they watch.&rsquo; That&apos;s the difference between a director and a behavioral filmmaker. That&apos;s what &ldquo;Story. Engineered.&rdquo; means.
              </p>
            </>
          )}
        </div>
      </div>

      {/* Credentials */}
      <div style={{ background:'var(--color-bg-light)', padding:'5rem clamp(1.25rem,5vw,3.5rem)' }}>
        <span className="text-label" style={{ display:'block', marginBottom:'2rem', color:'var(--color-text-on-light-muted)' }}>Credentials</span>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'1px', background:'rgba(13,13,13,0.08)' }}>
          {(() => {
            let creds = CREDS
            try { if (content.about_credentials) creds = JSON.parse(content.about_credentials) } catch {}
            return creds.map((c) => (
              <div key={c.label} style={{ background:'var(--color-bg-light)', padding:'2rem' }}>
                <p style={{ fontFamily:'var(--font-playfair,serif)', fontSize:18, fontWeight:400, color:'var(--color-text-on-light)', marginBottom:'0.4rem' }}>{c.label}</p>
                <p style={{ fontSize:13, color:'var(--color-text-on-light-muted)' }}>{c.sub}</p>
              </div>
            ))
          })()}
        </div>
      </div>

      {/* Timeline */}
      <div style={{ padding:'5rem clamp(1.25rem,5vw,3.5rem)' }}>
        <span className="text-label" style={{ display:'block', marginBottom:'2.5rem' }}>Timeline</span>
        <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
          {(() => {
            let timeline = TIMELINE
            try { if (content.about_timeline) timeline = JSON.parse(content.about_timeline) } catch {}
            return timeline.map((item, i) => (
              <div key={item.year} style={{
                display:'grid', gridTemplateColumns:'80px 1fr',
                gap:'2rem', padding:'1.25rem 0',
                borderBottom: i < timeline.length-1 ? '0.5px solid var(--color-border)' : 'none',
                alignItems:'start',
              }}>
                <span style={{ fontFamily:'var(--font-playfair,serif)', fontSize:15, color:'var(--color-accent)', letterSpacing:'-0.01em', paddingTop:'1px' }}>{item.year}</span>
                <span style={{ fontSize:15, color:'var(--color-text-secondary)', lineHeight:1.6 }}>{item.event}</span>
              </div>
            ))
          })()}
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding:'4rem clamp(1.25rem,5vw,3.5rem)', borderTop:'0.5px solid var(--color-border)', display:'flex', gap:'1rem', flexWrap:'wrap' }}>
        <Link href="/collaborate" className="btn-primary">Start a Brief</Link>
        <Link href="/work" className="btn-ghost">View Work</Link>
      </div>

      <style>{`@media(max-width:900px){.about-grid{grid-template-columns:1fr!important;} .about-photo{position:static!important;}} @media(max-width:640px){div > div:nth-child(5) > div{grid-template-columns:1fr!important;}}`}</style>
    </div>
  )
}
