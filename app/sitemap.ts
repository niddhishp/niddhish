import { MetadataRoute } from 'next'
import { getSupabaseAdmin } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://niddhish.com'
  const now = new Date().toISOString()

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/work`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/press`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/collaborate`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/films/ego`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${base}/films/palkon-pe`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/films/canvas`, lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
  ]

  // Blog posts
  try {
    const { data: posts } = await getSupabaseAdmin()
      .from('blog_posts').select('slug, created_at').eq('published', true)
    const blogPages: MetadataRoute.Sitemap = (posts || []).map(p => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: p.created_at,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
    return [...staticPages, ...blogPages]
  } catch {
    return staticPages
  }
}
