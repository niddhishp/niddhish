'use client'
import { useScrollReveal } from '@/lib/useScrollReveal'
import TiltCard from '@/components/TiltCard'

const SURFACES = [
  { n:'01', label:'Film & Direction',    slogan:'Story. Engineered.',       proof:'200+ TVCs · 3 Feature Films · Star TV EP', dark:false },
  { n:'02', label:'Brand Strategy',      slogan:'Brands. Transformed.',     proof:'80+ Brands · 360° Campaigns',             dark:false },
  { n:'03', label:'Psychology & Writing',slogan:'Creativity. Taught.',      proof:'MSc Psychology · 3 Published Books',      dark:false },
  { n:'04', label:'Creative Technology', slogan:'Creativity. Built.',       proof:'AI Tools · Apps · Production Systems',    dark:false },
  { n:'05', label:'PR & Reputation',     slogan:'Perception. Engineered.',  proof:'Brand & Individual Rep · Built Tech',     dark:false },
  { n:'06', label:'The Core',            slogan:'Creativity. Applied.',     proof:'Six Sigma Black Belt · PMP · 20+ Years',  dark:true  },
]

const BOOKS = [
  { title:'On Creativity — Vol. I',   sub:'The psychology of the creative mind',        year:'2021' },
  { title:'On Creativity — Vol. II',  sub:'Applied creativity for brand communication', year:'2022' },
  { title:'On Creativity — Vol. III', sub:'Creative intelligence in the age of AI',     year:'2023' },
]

export default function Depth() {
  useScrollReveal()

  return (
    <section style={{ background:'var(--color-bg-light)', padding:'6rem clamp(1.25rem,5vw,3.5rem)', position:'relative', overflow:'hidden' }}>
      {/* Intro */}
      <div data-reveal style={{ marginBottom:'3.5rem' }}>
        <div style={{
          fontFamily:'"JetBrains Mono","Courier New",monospace',
          fontSize:9,letterSpacing:'0.14em',textTransform:'uppercase',
          color:'rgba(216,90,48,0.35)',marginBottom:'0.75rem',
        }}>SCENE 03 — THE METHOD</div>
        <span className="text-label" style={{ display:'block',marginBottom:'0.75rem',color:'var(--color-text-on-light-muted)' }}>
          One discipline. Six surfaces.
        </span>
        <h2 className="text-display-md" style={{ color:'var(--color-text-on-light)',maxWidth:620 }}>
          Creativity applied across every problem domain.
        </h2>
      </div>

      {/* Grid */}
      <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:1,background:'rgba(13,13,13,0.09)',marginBottom:'5rem' }}>
        {SURFACES.map((s,i)=>(
          <div key={s.n} data-reveal data-reveal-delay={String((i%3)+1) as '1'|'2'|'3'}
            style={{
              background:s.dark?'#0d0d0d':'var(--color-bg-light)',
              padding:'2rem',minHeight:190,display:'flex',flexDirection:'column',gap:'0.6rem',
              position:'relative',overflow:'hidden',
            }}>
            {/* Aperture watermark on "The Core" cell */}
            {s.dark && (
              <svg aria-hidden viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"
                style={{ position:'absolute',bottom:'-10px',right:'-10px',width:80,height:80,opacity:0.04,pointerEvents:'none' }}>
                <circle cx="50" cy="50" r="46" stroke="#d85a30" strokeWidth="1" fill="none"/>
                <circle cx="50" cy="50" r="12" stroke="#d85a30" strokeWidth="1.5" fill="none"/>
                {[0,60,120,180,240,300].map(deg=>(
                  <line key={deg}
                    x1={50+15*Math.cos(deg*Math.PI/180)} y1={50+15*Math.sin(deg*Math.PI/180)}
                    x2={50+44*Math.cos(deg*Math.PI/180)} y2={50+44*Math.sin(deg*Math.PI/180)}
                    stroke="#d85a30" strokeWidth="1"/>
                ))}
              </svg>
            )}
            <span style={{ fontSize:10,letterSpacing:'0.1em',color:s.dark?'rgba(240,237,232,0.3)':'var(--color-text-on-light-muted)' }}>{s.n}</span>
            <span className="text-display-sm" style={{ color:s.dark?'var(--color-text-primary)':'var(--color-text-on-light)' }}>{s.label}</span>
            <span style={{ fontSize:11,fontWeight:500,letterSpacing:'0.07em',textTransform:'uppercase' as const,color:'var(--color-accent)' }}>{s.slogan}</span>
            <span style={{ fontSize:12,marginTop:'auto',color:s.dark?'rgba(240,237,232,0.4)':'var(--color-text-on-light-muted)',lineHeight:1.5 }}>{s.proof}</span>
          </div>
        ))}
      </div>

      {/* Books */}
      <div data-reveal style={{ marginBottom:'2rem' }}>
        <span className="text-label" style={{ display:'block',marginBottom:'0.75rem',color:'var(--color-text-on-light-muted)' }}>Published Work</span>
        <h3 className="text-display-sm" style={{ color:'var(--color-text-on-light)',marginBottom:'2.5rem' }}>
          Three books on creativity.{' '}
          <em style={{ color:'var(--color-accent)' }}>The methodology, written down.</em>
        </h3>
      </div>

      <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1.5rem' }}>
        {BOOKS.map((b,i)=>(
          <TiltCard
            key={b.title}
            intensity={8}
            data-reveal
            data-reveal-delay={String(i+1) as '1'|'2'|'3'}
            style={{
              background:'#0d0d0d',padding:'2.5rem 2rem',
              aspectRatio:'3/4',display:'flex',flexDirection:'column',
              justifyContent:'flex-end',overflow:'hidden',
              borderRadius:1,
            }}
          >
            {/* Aperture watermark in each book card */}
            <svg aria-hidden viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"
              style={{ position:'absolute',top:'10%',right:'-5%',width:120,height:120,opacity:0.05,pointerEvents:'none' }}>
              <circle cx="50" cy="50" r="46" stroke="#d85a30" strokeWidth="0.8" fill="none"/>
              <circle cx="50" cy="50" r="12" stroke="#d85a30" strokeWidth="1.2" fill="none"/>
              {[0,60,120,180,240,300].map(deg=>(
                <line key={deg}
                  x1={50+14*Math.cos(deg*Math.PI/180)} y1={50+14*Math.sin(deg*Math.PI/180)}
                  x2={50+44*Math.cos(deg*Math.PI/180)} y2={50+44*Math.sin(deg*Math.PI/180)}
                  stroke="#d85a30" strokeWidth="1"/>
              ))}
            </svg>
            <div aria-hidden style={{ position:'absolute',inset:0,background:'linear-gradient(135deg,#181818 0%,#0a0a0a 100%)',opacity:0.96 }}/>
            <div style={{ position:'relative',zIndex:1 }}>
              <span style={{ display:'block',fontSize:10,letterSpacing:'0.12em',textTransform:'uppercase' as const,color:'var(--color-accent)',marginBottom:'1rem' }}>{b.year}</span>
              <span style={{ display:'block',fontFamily:'var(--font-playfair,serif)',fontSize:19,fontWeight:400,color:'var(--color-text-primary)',lineHeight:1.2,marginBottom:'0.5rem' }}>{b.title}</span>
              <span style={{ display:'block',fontSize:13,color:'var(--color-text-secondary)',lineHeight:1.5 }}>{b.sub}</span>
            </div>
          </TiltCard>
        ))}
      </div>

      <style>{`
        @media(max-width:900px){section > div:nth-child(3){grid-template-columns:repeat(2,1fr)!important;} section > div:nth-child(6){grid-template-columns:1fr!important;}}
        @media(max-width:600px){section > div:nth-child(3){grid-template-columns:1fr!important;}}
      `}</style>
    </section>
  )
}
