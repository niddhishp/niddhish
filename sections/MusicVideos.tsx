'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import VideoModal from '@/components/VideoModal'
import { isMusicVideo, MUSIC_VIDEO_URL, projectThumbnail, type Project } from '@/lib/projects'
import styles from './MusicVideos.module.css'

export default function MusicVideos({ projects, loading, error }: { projects: Project[]; loading: boolean; error: boolean }) {
  const [active, setActive] = useState<Project | null>(null)
  const films = projects.filter(project => isMusicVideo(project.category)).slice(0, 4)

  useEffect(() => {
    if (loading || window.location.hash !== '#music-videos') return
    const frame = requestAnimationFrame(() => document.getElementById('music-videos')?.scrollIntoView())
    return () => cancelAnimationFrame(frame)
  }, [loading])

  if (!loading && !error && films.length === 0) return null

  return (
    <section id="music-videos" aria-labelledby="music-videos-heading" className={styles.section}>
      <div className={styles.header}>
        <div>
          <p className={styles.label}>Music Videos</p>
          <h2 id="music-videos-heading" className="text-display-md">Music, <em className={styles.accent}>in motion.</em></h2>
        </div>
        <Link href={MUSIC_VIDEO_URL} className={styles.link}>Explore music videos <span aria-hidden>↗</span></Link>
      </div>
      {loading ? <p role="status" className={styles.status}>Loading music videos…</p> : error ? (
        <p role="status" className={styles.status}>The films could not be loaded. Please refresh to try again.</p>
      ) : (
        <div className={styles.grid}>
          {films.map((film, index) => {
            const thumbnail = projectThumbnail(film)
            return (
              <button key={film.id} type="button" className={styles.film}
                aria-label={`Watch ${film.title}`} onClick={() => setActive(film)}>
                <div className={styles.image}>
                  {thumbnail && <Image src={thumbnail} alt="" fill unoptimized sizes="(max-width: 640px) 100vw, 50vw" />}
                  <span className={styles.play}><span aria-hidden>▶</span> Play film</span>
                  {film.duration && <span className={styles.duration}>{film.duration}</span>}
                </div>
                <div className={styles.caption}>
                  <span className={styles.number}>{String(index + 1).padStart(2, '0')}</span>
                  <h3>{film.title}</h3>
                  <span aria-hidden className={styles.arrow}>↗</span>
                </div>
              </button>
            )
          })}
        </div>
      )}
      {active && <VideoModal videoUrl={active.video_url || ''} title={active.title} brand={active.client} onClose={() => setActive(null)} />}
    </section>
  )
}
