import { parseVideoUrl } from './videoUtils'

export const PROJECTS_URL = '/api/admin/projects'
export const MUSIC_VIDEO_FILTER = 'Music Videos'
export const MUSIC_VIDEO_URL = '/work?category=Music+Videos'

export interface Project {
  id: string
  title: string
  client: string
  category: string
  duration: string | null
  thumbnail: string | null
  video_url: string | null
  is_featured: boolean
  is_active: boolean
  sort_order: number
}

export function isMusicVideo(category: string) {
  return /^music videos?$/i.test(category.trim())
}

export function matchesCategory(category: string, filter: string) {
  return filter === 'All' || (isMusicVideo(filter) ? isMusicVideo(category) : category === filter)
}

export function projectThumbnail(project: Project) {
  // Vimeo image IDs are unrelated to video IDs. Use saved artwork only.
  return project.thumbnail || parseVideoUrl(project.video_url || '')?.thumbnailUrl || ''
}

export async function loadProjects(signal?: AbortSignal): Promise<Project[]> {
  // Keep the latest site's Supabase catalog and its existing media overrides.
  // Empty/error results never repopulate the reel from Railway or static demos.
  const [data, thumbs, urls] = await Promise.all(
    [PROJECTS_URL, '/api/admin/thumbnails', '/api/admin/video-url-overrides'].map(async url => {
      const response = await fetch(url, { signal, cache: 'no-store' })
      if (!response.ok) throw new Error('Unable to load the film collection.')
      return response.json()
    })
  )
  if (!Array.isArray(data.projects)) throw new Error('Invalid film collection response.')
  return (data.projects as Project[])
    .filter(project => project.is_active)
    .map(project => {
      const video_url = urls.overrides?.[project.id] || project.video_url || ''
      const info = parseVideoUrl(video_url)
      return {
        ...project,
        video_url,
        thumbnail: thumbs.overrides?.[info?.id || ''] || project.thumbnail,
      }
    })
    .filter(project => project.video_url && !project.video_url.includes('EQV7jlmU72Q'))
    .sort((a, b) => (a.sort_order ?? 99) - (b.sort_order ?? 99))
}
