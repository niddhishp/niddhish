'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion'
import type { Variants } from 'framer-motion'
import Link from 'next/link'
import ApertureMark from '@/components/ApertureMark'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]
const CREDS = [
  { num: '200+', label: 'Commercials' },
  { num: '3',    label: 'Films' },
  { num: '3',    label: 'Books' },
  { num: '80+',  label: 'Brands' },
  { num: '20+',  label: 'Years' },
]
const ROLES = ['Filmmaker', 'Psychologist', 'Author', 'Strategist', 'Technologist']

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}
const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
}

function useFrameCounter() {
  const [frame, setFrame] = useState(0)
  useEffect(() => {
    const start = Date.now()
    const id = setInterval(() => {
      setFrame(Math.floor(((Date.now() - start) / 1000) * 24) % 10000)
    }, 1000 / 24)
    return () => clearInterval(id)
  }, [])
  return frame.toString().padStart(4, '0')
}

export default function Hero() {
  const [roleIdx, setRoleIdx] = useState(0)
  const [heroVideoUrl, setHeroVideoUrl] = useState('')
  const parallaxRef = useRef<HTMLDivElement>(null)
  const frameCount  = useFrameCounter()

  // ── Force scroll to top on mount + load hero video from Supabase ──
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    }
    // Load hero video URL from site_settings
    fetch('/api/content')
      .then(r => r.json())
      .then(d => { if (d.hero_video_url) setHeroVideoUrl(d.hero_video_url) })
      .catch(() => {})
  }, [])

  // ── Scroll values ────────────────────────────────────────────────
  const { scrollY } = useScroll()

  // Background: dramatic zoom in + darken (never fully transparent)
  const bgScaleRaw    = useTransform(scrollY, [0, 700], [1, 1.45])
  const bgOpacityRaw  = useTransform(scrollY, [0, 500], [1, 0.4])

  // Content: scale up slightly + fade — clamp to 0.01 so it never fully
  // disappears if scrollY is non-zero on first render
  const contentScaleRaw   = useTransform(scrollY, [0, 400], [1, 1.08])
  const contentOpacityRaw = useTransform(scrollY, [0, 380], [1, 0.01])
  const contentYRaw       = useTransform(scrollY, [0, 400], [0, -30])

  const bgScale       = useSpring(bgScaleRaw,       { stiffness: 60, damping: 18 })
  const contentScale  = useSpring(contentScaleRaw,  { stiffness: 60, damping: 18 })
  const contentY      = useSpring(contentYRaw,      { stiffness: 60, damping: 18 })

  // ── Mouse parallax — applied to SEPARATE element, no Framer Motion conflict ──
  useEffect(() => {
    const el = parallaxRef.current
    if (!el) return
    let raf: number, mx = 0.5, my = 0.5, cx = 0.5, cy = 0.5
    const onMove = (e: MouseEvent) => { mx = e.clientX / window.innerWidth; my = e.clientY / window.innerHeight }
    const tick = () => {
      cx += (mx - cx) * 0.055; cy += (my - cy) * 0.055
      el.style.transform = `translate(${(cx - 0.5) * -24}px, ${(cy - 0.5) * -16}px)`
      raf = requestAnimationFrame(tick)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    raf = requestAnimationFrame(tick)
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf) }
  }, [])

  useEffect(() => {
    const id = setInterval(() => setRoleIdx(i => (i + 1) % ROLES.length), 2400)
    return () => clearInterval(id)
  }, [])

  return (
    <section style={{
      position: 'relative', minHeight: '100dvh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden', background: 'var(--color-bg)',
    }}>

      {/* ── SCROLL ZOOM LAYER — Framer Motion ONLY, no DOM manipulation ── */}
      <motion.div
        aria-hidden
        style={{
          position: 'absolute', inset: '-10%',
          scale: bgScale,
          opacity: bgOpacityRaw,
          willChange: 'transform, opacity',
          pointerEvents: 'none',
        }}
      >
        {/* Hero background video (if set in admin) */}
        {heroVideoUrl && (() => {
          const ytMatch = heroVideoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)
          const vimeoMatch = heroVideoUrl.match(/vimeo\.com\/(\d+)/)
          if (ytMatch) return (
            <iframe
              src={`https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&mute=1&loop=1&playlist=${ytMatch[1]}&controls=0&showinfo=0&rel=0`}
              style={{ position:'absolute', inset:'-20%', width:'140%', height:'140%', border:'none', objectFit:'cover', pointerEvents:'none' }}
              allow="autoplay; fullscreen"
              title="Hero background"
            />
          )
          if (vimeoMatch) return (
            <iframe
              src={`https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&muted=1&loop=1&background=1&controls=0&dnt=1`}
              style={{ position:'absolute', inset:'-20%', width:'140%', height:'140%', border:'none', objectFit:'cover', pointerEvents:'none' }}
              allow="autoplay; fullscreen"
              title="Hero background"
            />
          )
          return null
        })()}
        {/* Atmospheric gradients */}
        <div style={{
          position: 'absolute', inset: 0,
          background: [
            'radial-gradient(ellipse 75% 60% at 50% 45%, rgba(232,104,58,0.10) 0%, transparent 55%)',
            'radial-gradient(ellipse 40% 50% at 12% 88%, rgba(232,104,58,0.06) 0%, transparent 48%)',
            'radial-gradient(ellipse 35% 45% at 90% 10%, rgba(232,104,58,0.05) 0%, transparent 45%)',
          ].join(','),
        }} />
        {/* Subtle grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: [
            'linear-gradient(rgba(240,237,232,0.024) 1px, transparent 1px)',
            'linear-gradient(90deg, rgba(240,237,232,0.024) 1px, transparent 1px)',
          ].join(','),
          backgroundSize: '88px 88px',
          maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 15%, transparent 80%)',
        }} />
        {/* Vignette */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.78) 100%)',
        }} />
      </motion.div>

      {/* ── MOUSE PARALLAX LAYER — CSS transform only, no Framer Motion ── */}
      <div ref={parallaxRef} aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        willChange: 'transform',
        transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1)',
      }} />

      {/* ── Cinematic letterbox bars ── */}
      <motion.div aria-hidden initial={{ height:0 }} animate={{ height:'clamp(26px,4.5vh,54px)' }}
        transition={{ duration:0.9, ease:EASE, delay:0.1 }}
        style={{ position:'absolute',top:0,left:0,right:0,background:'#000',zIndex:2 }}/>
      <motion.div aria-hidden initial={{ height:0 }} animate={{ height:'clamp(26px,4.5vh,54px)' }}
        transition={{ duration:0.9, ease:EASE, delay:0.1 }}
        style={{ position:'absolute',bottom:0,left:0,right:0,background:'#000',zIndex:2 }}/>

      {/* ── HUD ── */}
      <motion.div aria-hidden initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.0, duration:0.5 }}
        style={{ position:'absolute',top:'clamp(6px,1.1vh,13px)',left:'1.5rem',zIndex:3,
          fontFamily:'"JetBrains Mono","Courier New",monospace',
          fontSize:9,letterSpacing:'0.1em',color:'rgba(240,237,232,0.17)',textTransform:'uppercase' as const }}>
        SCENE 01 — INT. THE DIRECTOR'S CUT
      </motion.div>
      <motion.div aria-hidden initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.2, duration:0.5 }}
        style={{ position:'absolute',top:'clamp(6px,1.1vh,13px)',right:'1.5rem',zIndex:3,
          fontFamily:'"JetBrains Mono","Courier New",monospace',
          fontSize:9,letterSpacing:'0.08em',color:'rgba(232,104,58,0.6)',
          display:'flex',alignItems:'center',gap:8 }}>
        <span>FRAME {frameCount}</span>
        <span style={{ color:'rgba(232,104,58,0.25)' }}>·</span>
        <span>24fps</span>
      </motion.div>

      {/* Corner brackets */}
      {(['tl','tr','bl','br'] as const).map(c => (
        <div key={c} aria-hidden style={{
          position:'absolute',width:26,height:26,pointerEvents:'none',zIndex:3,opacity:0.2,
          ...(c==='tl'?{top:'clamp(38px,7vh,68px)',left:'1.5rem',borderTop:'0.5px solid var(--color-text-secondary)',borderLeft:'0.5px solid var(--color-text-secondary)'}:{}),
          ...(c==='tr'?{top:'clamp(38px,7vh,68px)',right:'1.5rem',borderTop:'0.5px solid var(--color-text-secondary)',borderRight:'0.5px solid var(--color-text-secondary)'}:{}),
          ...(c==='bl'?{bottom:'clamp(38px,7vh,68px)',left:'1.5rem',borderBottom:'0.5px solid var(--color-text-secondary)',borderLeft:'0.5px solid var(--color-text-secondary)'}:{}),
          ...(c==='br'?{bottom:'clamp(38px,7vh,68px)',right:'1.5rem',borderBottom:'0.5px solid var(--color-text-secondary)',borderRight:'0.5px solid var(--color-text-secondary)'}:{}),
        }}/>
      ))}

      {/* ── MAIN CONTENT — scroll zoom (scale+fade) ── */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        style={{
          position:'relative',zIndex:1,
          display:'flex',flexDirection:'column',
          alignItems:'center',textAlign:'center',
          padding:'clamp(9rem,16vh,12rem) clamp(1rem,5vw,4rem) clamp(5rem,10vh,8rem)',
          width:'100%',maxWidth:1440,
          scale: contentScale,
          opacity: contentOpacityRaw,
          y: contentY,
          willChange: 'transform, opacity',
        }}
      >
        {/* Mark */}
        <motion.div variants={item} style={{ display:'flex',alignItems:'center',gap:14,marginBottom:'2.5rem' }}>
          <ApertureMark size={30} animate />
          <span style={{ fontSize:11,letterSpacing:'0.14em',textTransform:'uppercase',color:'var(--color-text-tertiary)' }}>
            Light Seeker Films &nbsp;·&nbsp; Mumbai, India
          </span>
        </motion.div>

        {/* FADE IN */}
        <motion.div variants={item} style={{
          fontFamily:'"JetBrains Mono","Courier New",monospace',
          fontSize:10,letterSpacing:'0.2em',textTransform:'uppercase',
          color:'rgba(232,104,58,0.5)',marginBottom:'1.5rem',
        }}>FADE IN.</motion.div>

        {/* ── HEADLINE — proper descender room ── */}
        <div style={{ marginBottom:'2.5rem' }}>
          {/*
            paddingBottom gives visual space for descenders (y in Creativity, p in Applied).
            At 185px, Playfair Display descenders extend ~35-40px below baseline.
            0.25em at 185px ≈ 46px — plenty of room.
            The outer div does NOT clip — descenders show freely.
          */}
          <div>
            <motion.h1
              initial={{ y:'115%', opacity:0 }}
              animate={{ y:0, opacity:1 }}
              transition={{ duration:1.0, ease:EASE, delay:0.35 }}
              style={{
                fontFamily:'var(--font-playfair,"Playfair Display",Georgia,serif)',
                fontSize:'clamp(62px,13.5vw,185px)',
                fontWeight:400,lineHeight:1.0,letterSpacing:'-0.045em',
                color:'var(--color-text-primary)',
                margin:0,display:'block',
                paddingBottom:'0.08em', // breathing room for descender
              }}
            >Creativity.</motion.h1>
          </div>
          <div>
            <motion.h2
              initial={{ y:'115%', opacity:0 }}
              animate={{ y:0, opacity:1 }}
              transition={{ duration:1.0, ease:EASE, delay:0.52 }}
              style={{
                fontFamily:'var(--font-playfair,"Playfair Display",Georgia,serif)',
                fontSize:'clamp(62px,13.5vw,185px)',
                fontWeight:400,fontStyle:'italic',lineHeight:1.0,letterSpacing:'-0.045em',
                color:'var(--color-accent)',
                margin:0,display:'block',
                paddingBottom:'0.15em', // more room for italic descenders (pp)
              }}
            >Applied.</motion.h2>
          </div>
        </div>

        {/* Subtitle */}
        <motion.p variants={item} style={{
          fontSize:15,lineHeight:1.7,letterSpacing:'0.02em',
          color:'var(--color-text-secondary)',maxWidth:520,marginBottom:'2.5rem',
        }}>
          Behavioral filmmaking. Creative strategy. Technology built to think.{' '}
          <em style={{ color:'var(--color-text-tertiary)',fontStyle:'italic',fontSize:13 }}>
            Where psychology meets cinema.
          </em>
        </motion.p>

        {/* Role cycling — centered via flex */}
        <motion.div variants={item} style={{
          height:22,overflow:'hidden',position:'relative',
          width:'100%',marginBottom:'3rem',
          display:'flex',alignItems:'center',justifyContent:'center',
        }}>
          <AnimatePresence mode="wait">
            <motion.span
              key={roleIdx}
              initial={{ y:26,opacity:0 }}
              animate={{ y:0,opacity:1 }}
              exit={{ y:-26,opacity:0 }}
              transition={{ duration:0.5,ease:EASE }}
              style={{
                position:'absolute',
                fontSize:11,fontWeight:400,letterSpacing:'0.16em',
                textTransform:'uppercase',color:'var(--color-text-secondary)',
                whiteSpace:'nowrap',
              }}
            >{ROLES[roleIdx]}</motion.span>
          </AnimatePresence>
        </motion.div>

        {/* Credentials */}
        <motion.div variants={item} style={{ marginBottom:'3rem' }}>
          <div className="cred-strip">
            {CREDS.map(c=>(
              <div key={c.label} className="cred-item">
                <span className="cred-num">{c.num}</span>
                <span className="cred-label">{c.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div variants={item} style={{ display:'flex',gap:'1rem',flexWrap:'wrap',justifyContent:'center' }}>
          <Link href="/work" className="btn-primary">
            View Work
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M1 6.5h11M6.5 1l5.5 5.5-5.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <Link href="/collaborate" className="btn-ghost">Start a Brief</Link>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div aria-hidden
        initial={{ opacity:0 }} animate={{ opacity:0.5 }} transition={{ delay:1.8, duration:0.8 }}
        style={{
          position:'absolute',bottom:'clamp(34px,6vh,62px)',left:'50%',transform:'translateX(-50%)',
          display:'flex',flexDirection:'column',alignItems:'center',gap:8,zIndex:3,
        }}>
        <div style={{ width:'0.5px',height:38,background:'var(--color-border-mid)',
          animation:'scrollPulse 2.4s ease-in-out infinite' }}/>
        <span style={{ fontSize:8,letterSpacing:'0.2em',textTransform:'uppercase',color:'var(--color-text-tertiary)' }}>
          Scroll
        </span>
      </motion.div>

      <style>{`@keyframes scrollPulse{0%,100%{transform:scaleY(1);opacity:.35}50%{transform:scaleY(.45);opacity:.8}}`}</style>
    </section>
  )
}
