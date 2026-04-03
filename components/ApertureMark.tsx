'use client'

import { useEffect, useRef } from 'react'

interface ApertureMarkProps {
  size?: number
  color?: string
  animate?: boolean
  className?: string
}

export default function ApertureMark({
  size = 48,
  color = '#d85a30',
  animate = false,
  className = '',
}: ApertureMarkProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!animate || !svgRef.current) return

    let gsap: typeof import('gsap').default
    import('gsap').then(({ default: g }) => {
      gsap = g
      const paths = svgRef.current!.querySelectorAll('path, circle.inner')
      paths.forEach((el) => {
        const len = (el as SVGGeometryElement).getTotalLength?.() ?? 60
        gsap.set(el, { strokeDasharray: len, strokeDashoffset: len })
      })
      gsap.to(paths, {
        strokeDashoffset: 0,
        duration: 1.5,
        ease: 'expo.out',
        stagger: 0.055,
        delay: 0.15,
      })
    })
  }, [animate])

  return (
    <svg
      ref={svgRef}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Niddhish — Aperture Neural mark"
      role="img"
    >
      {/* Outer ring */}
      <circle cx="50" cy="50" r="46" stroke={color} strokeWidth="0.8" fill="none" />
      {/* Inner aperture ring */}
      <circle className="inner" cx="50" cy="50" r="12" stroke={color} strokeWidth="1.2" fill="none" />

      {/* Six blades — each ends in a neural fork (dendrite) */}
      {/* Top */}
      <path d="M50 38 L50 18" stroke={color} strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M47 21 L50 13 L53 21" stroke={color} strokeWidth="0.9" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* Top-right */}
      <path d="M59 44 L75 30" stroke={color} strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M73 27 L80 23 L77 31" stroke={color} strokeWidth="0.9" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* Bottom-right */}
      <path d="M59 56 L75 70" stroke={color} strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M73 73 L80 77 L77 69" stroke={color} strokeWidth="0.9" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* Bottom */}
      <path d="M50 62 L50 82" stroke={color} strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M47 79 L50 87 L53 79" stroke={color} strokeWidth="0.9" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* Bottom-left */}
      <path d="M41 56 L25 70" stroke={color} strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M27 73 L20 77 L23 69" stroke={color} strokeWidth="0.9" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* Top-left */}
      <path d="M41 44 L25 30" stroke={color} strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M27 27 L20 23 L23 31" stroke={color} strokeWidth="0.9" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
