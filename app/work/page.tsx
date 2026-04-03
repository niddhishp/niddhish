import type { Metadata } from 'next'
import WorkGrid from './WorkGrid'

export const metadata: Metadata = {
  title: 'Work',
  description: '200+ commercials, 3 feature films, branded content for Nike, Harley Davidson, Uber, Maruti, Adidas and 80+ more brands.',
}

export default function WorkPage() {
  return <WorkGrid />
}
