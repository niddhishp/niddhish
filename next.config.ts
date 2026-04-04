import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Disable browser scroll restoration — Hero resets scroll to 0 on mount.
  // Leaving browser restore enabled causes scrollY > 0 on first render,
  // which makes the scroll-zoom content opacity = 0 (black screen bug).
  experimental: {
    optimizePackageImports: ['lucide-react'],
    scrollRestoration: false,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.vimeocdn.com' },
      { protocol: 'https', hostname: 'static.wixstatic.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
}

export default nextConfig
