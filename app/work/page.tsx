import type { Metadata } from 'next'
import WorkClient from './WorkClient'

export const metadata: Metadata = {
  title: 'Work — Niddhish Puuzhakkal',
  description: '200+ commercials, 3 feature films. Advertising work for Nike, Harley Davidson, Maruti, Adidas, Uber, Toyota and 80+ brands.',
}

export default function WorkPage() {
  return <WorkClient />
}
