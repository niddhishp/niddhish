import type { Metadata } from 'next'
import Invite from '@/sections/Invite'

export const metadata: Metadata = {
  title: 'Collaborate',
  description: 'Start a project with Niddhish Puuzhakkal — film direction, brand strategy, creative technology, or consulting.',
}

export default function CollaboratePage() {
  return (
    <div style={{ minHeight:'100dvh', background:'var(--color-bg)', paddingTop:'7rem' }}>
      <Invite />
    </div>
  )
}
