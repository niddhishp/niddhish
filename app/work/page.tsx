import type { Metadata } from 'next'
import WorkClient from './WorkClient'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Work — Niddhish Puuzhakkal',
  description: 'Music videos, 200+ commercials and 3 feature films. Work for Nike, Harley Davidson, Maruti, Adidas, Uber, Toyota and 80+ brands.',
}

export default function WorkPage() {
  return <Suspense fallback={<p role="status" style={{ padding: '8rem 2rem' }}>Loading the reel…</p>}><WorkClient /></Suspense>
}
