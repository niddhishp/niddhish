'use client'

import { useProjects } from '@/lib/useProjects'
import WorkReel from './WorkReel'
import MusicVideos from './MusicVideos'

export default function Reels() {
  const { projects, loading, error } = useProjects()
  return <>
    <MusicVideos projects={projects} loading={loading} error={error} />
    <WorkReel projects={projects} loading={loading} error={error} />
  </>
}
