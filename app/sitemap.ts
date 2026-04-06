import { MetadataRoute } from 'next'
import { getSupabaseAdmin } from '@/lib/supabase'

const BASE = 'https://niddhish.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const static_pages: MetadataRoute.Sitemap = [
    { url: BASE,            lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/work`,  lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/blog`,  lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/press`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/collaborate`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/films/ego`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/films/palkon-pe`,lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/films/canvas`,   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ]

  // Blog posts from Supabase
  try {
    const { data } = await getSupabaseAdmin()
      .from('blog_posts').select('slug, created_at').eq('published', true)
    const blog_pages: MetadataRoute.Sitemap = (data || []).map(p => ({
      url: `${BASE}/blog/${p.slug}`,
      lastModified: new Date(p.created_at),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
    return [...static_pages, ...blog_pages]
  } catch {
    return static_pages
  }
}
