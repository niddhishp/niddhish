import type { MetadataRoute } from 'next'
import { POSTS } from '@/lib/posts'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://niddhish.com'
  const now  = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base,                   lastModified: now, changeFrequency: 'monthly', priority: 1.0 },
    { url: `${base}/work`,         lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/about`,        lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog`,         lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${base}/press`,        lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/collaborate`,  lastModified: now, changeFrequency: 'yearly',  priority: 0.7 },
  ]

  const blogRoutes: MetadataRoute.Sitemap = POSTS.map(post => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: now,
    changeFrequency: 'yearly' as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...blogRoutes]
}
