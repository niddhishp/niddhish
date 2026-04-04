'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export default function CustomCursor() {
  const pathname = usePathname()
  const dotRef   = useRef<HTMLDivElement>(null)
  const ringRef  = useRef<HTMLDivElement>(null)
  const posRef   = useRef({ x: -100, y: -100 })
  const ringPos  = useRef({ x: -100, y: -100 })
  const rafRef   = useRef<number>(0)

  // Disable on admin and touch devices
  const isAdmin = pathname?.startsWith('/admin')

  useEffect(() => {
    if (isAdmin) return

    const dot  = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    const move = (e: MouseEvent) => { posRef.current = { x: e.clientX, y: e.clientY } }

    const onEnterInteractive = () => ring.classList.add('cursor-expanded')
    const onLeaveInteractive = () => ring.classList.remove('cursor-expanded')
    const onEnterFilm = () => ring.classList.add('cursor-film')
    const onLeaveFilm = () => ring.classList.remove('cursor-film')

    const tick = () => {
      const { x, y } = posRef.current
      dot.style.transform  = `translate(${x}px, ${y}px)`
      ringPos.current.x += (x - ringPos.current.x) * 0.12
      ringPos.current.y += (y - ringPos.current.y) * 0.12
      ring.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px)`
      rafRef.current = requestAnimationFrame(tick)
    }

    const attachListeners = () => {
      document.querySelectorAll('a, button, [role="button"]').forEach(el => {
        el.addEventListener('mouseenter', onEnterInteractive)
        el.addEventListener('mouseleave', onLeaveInteractive)
      })
      document.querySelectorAll('.film-card').forEach(el => {
        el.addEventListener('mouseenter', onEnterFilm)
        el.addEventListener('mouseleave', onLeaveFilm)
      })
    }

    window.addEventListener('mousemove', move, { passive: true })
    rafRef.current = requestAnimationFrame(tick)
    attachListeners()

    const obs = new MutationObserver(attachListeners)
    obs.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', move)
      cancelAnimationFrame(rafRef.current)
      obs.disconnect()
    }
  }, [isAdmin])

  // Restore native cursor on admin
  if (isAdmin) {
    return <style>{`body { cursor: auto !important; } a, button { cursor: pointer !important; }`}</style>
  }

  return (
    <>
      <div ref={dotRef} aria-hidden="true" style={{
        position:'fixed', top:0, left:0, width:4, height:4, borderRadius:'50%',
        background:'var(--color-accent)', pointerEvents:'none', zIndex:99998,
        marginLeft:-2, marginTop:-2,
      }} />
      <div ref={ringRef} aria-hidden="true" className="cursor-ring" style={{
        position:'fixed', top:0, left:0, width:32, height:32, borderRadius:'50%',
        border:'1px solid rgba(232,104,58,0.5)', pointerEvents:'none', zIndex:99997,
        marginLeft:-16, marginTop:-16,
        transition:'width 0.3s cubic-bezier(0.16,1,0.3,1), height 0.3s, border-color 0.3s, border-radius 0.3s',
      }} />
      <style>{`
        body { cursor: none; }
        a, button, [role="button"] { cursor: none; }
        .cursor-ring.cursor-expanded { width:52px!important; height:52px!important; margin-left:-26px!important; margin-top:-26px!important; border-color:rgba(232,104,58,0.8)!important; }
        .cursor-ring.cursor-film { width:64px!important; height:64px!important; margin-left:-32px!important; margin-top:-32px!important; border-color:rgba(240,237,232,0.6)!important; border-radius:2px!important; }
        @media(hover:none){ body { cursor:auto!important; } .cursor-ring { display:none!important; } }
      `}</style>
    </>
  )
}
