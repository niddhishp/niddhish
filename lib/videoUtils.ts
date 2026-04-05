// Exact copy of lightseeker-films/src/lib/videoUtils.ts — the version that works

export type VideoProvider = 'youtube' | 'vimeo' | 'unknown'

export interface VideoInfo {
  provider: VideoProvider
  id: string
  embedUrl: string
  thumbnailUrl: string
}

export function parseVideoUrl(url: string): VideoInfo | null {
  if (!url) return null

  // YouTube patterns
  const youtubePatterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ]
  for (const pattern of youtubePatterns) {
    const match = url.match(pattern)
    if (match) {
      const id = match[1]
      return {
        provider: 'youtube',
        id,
        embedUrl: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`,
        thumbnailUrl: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
      }
    }
  }

  // Vimeo patterns — extract just the numeric ID, ignore ?fl=tl&fe=ec etc
  const vimeoPattern = /vimeo\.com\/(\d+)/
  const vimeoMatch = url.match(vimeoPattern)
  if (vimeoMatch) {
    const id = vimeoMatch[1]
    return {
      provider: 'vimeo',
      id,
      embedUrl: `https://player.vimeo.com/video/${id}?autoplay=1&title=0&byline=0&portrait=0&dnt=1`,
      thumbnailUrl: `https://i.vimeocdn.com/video/${id}_640.jpg`,
    }
  }

  return null
}

export function getThumbnailFromUrl(url: string): string {
  const info = parseVideoUrl(url)
  if (!info) return ''
  return info.thumbnailUrl
}
