'use client'

import { useRef, type ReactNode } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion'

interface TiltCardProps {
  children: ReactNode
  className?: string
  intensity?: number
  style?: React.CSSProperties
}

export default function TiltCard({
  children,
  className = '',
  intensity = 10,
  style = {},
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  const mx = useMotionValue(0)
  const my = useMotionValue(0)

  const springConfig = { stiffness: 280, damping: 28, mass: 0.4 }

  const rotateX = useSpring(useTransform(my, [-1, 1], [intensity, -intensity]), springConfig)
  const rotateY = useSpring(useTransform(mx, [-1, 1], [-intensity, intensity]), springConfig)
  const glareX  = useSpring(useTransform(mx, [-1, 1], [0, 100]), springConfig)
  const glareY  = useSpring(useTransform(my, [-1, 1], [0, 100]), springConfig)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1
    mx.set(x)
    my.set(y)
  }

  const handleMouseLeave = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 800,
        position: 'relative',
        ...style,
      }}
      whileHover={{ z: 16 }}
      transition={{ duration: 0.3 }}
    >
      {/* Glare overlay */}
      <motion.div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          pointerEvents: 'none',
          background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.08) 0%, transparent 60%)`,
          zIndex: 10,
          mixBlendMode: 'screen',
        }}
      />
      {children}
    </motion.div>
  )
}
