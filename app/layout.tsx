import type { Metadata } from 'next'
import { DM_Sans, Playfair_Display } from 'next/font/google'
import '../styles/globals.css'
import Nav from '@/components/Nav'
import GrainOverlay from '@/components/GrainOverlay'
import Footer from '@/components/Footer'
import CustomCursor from '@/components/CustomCursor'
import SmoothScroll from '@/components/SmoothScroll'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://niddhish.com'),
  title: {
    default: 'Niddhish Puuzhakkal — Creativity. Applied.',
    template: '%s — Niddhish Puuzhakkal',
  },
  description:
    'Filmmaker. Psychologist. Author. Strategist. Technologist. 200+ commercials, 3 films, 3 books, 80+ brands. Creative intelligence applied to every problem.',
  keywords: [
    'Niddhish Puuzhakkal',
    'film director India',
    'TVC director Mumbai',
    'brand strategy',
    'creative director',
    'filmmaker psychologist',
    'Light Seeker Films',
    'advertising director',
  ],
  authors: [{ name: 'Niddhish Puuzhakkal', url: 'https://niddhish.com' }],
  creator: 'Niddhish Puuzhakkal',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://niddhish.com',
    siteName: 'Niddhish Puuzhakkal',
    title: 'Niddhish Puuzhakkal — Creativity. Applied.',
    description:
      'Filmmaker. Psychologist. Author. Strategist. Technologist. Creative intelligence applied to every problem.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Niddhish Puuzhakkal — Creativity. Applied.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@niddhishp',
    creator: '@niddhishp',
    title: 'Niddhish Puuzhakkal — Creativity. Applied.',
    description: 'Filmmaker. Psychologist. Author. Strategist. Technologist.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='48' fill='%230a0a0a'/><g stroke='%23d85a30' stroke-width='2' fill='none' stroke-linecap='round'><circle cx='50' cy='50' r='10'/><path d='M50 40L50 20M48 20L50 15M52 20L50 15'/><path d='M58 45L74 32M75 30L79 25M76 32L79 25'/><path d='M58 55L74 68M75 70L79 75M76 68L79 75'/><path d='M50 60L50 80M48 80L50 85M52 80L50 85'/><path d='M42 55L26 68M25 70L21 75M24 68L21 75'/><path d='M42 45L26 32M25 30L21 25M24 32L21 25'/></g></svg>",
        type: 'image/svg+xml',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${playfair.variable}`}
      style={{ colorScheme: 'dark' }}
    >
      <head>
        <meta name="theme-color" content="#0a0a0a" />
        <meta name="color-scheme" content="dark" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Person",
                "@id": "https://niddhish.com/#person",
                "name": "Niddhish Puuzhakkal",
                "url": "https://niddhish.com",
                "image": "https://niddhish.com/niddhish-photo.jpg",
                "jobTitle": ["Film Director", "Psychologist", "Author", "Brand Strategist"],
                "worksFor": { "@type": "Organization", "name": "Light Seeker Films", "url": "https://niddhish.com" },
                "address": { "@type": "PostalAddress", "addressLocality": "Mumbai", "addressCountry": "IN" },
                "sameAs": [
                  "https://vimeo.com/niddhish",
                  "https://linkedin.com/in/niddhish",
                  "https://instagram.com/niddhishp",
                  "https://twitter.com/niddhishp"
                ],
                "knowsAbout": ["Film Direction", "Behavioral Psychology", "Brand Strategy", "Creative Technology", "TVC Production"]
              },
              {
                "@type": "WebSite",
                "@id": "https://niddhish.com/#website",
                "url": "https://niddhish.com",
                "name": "Niddhish Puuzhakkal — Creativity. Applied.",
                "description": "Filmmaker, psychologist, author, and creative strategist. Founder, Light Seeker Films.",
                "publisher": { "@id": "https://niddhish.com/#person" },
                "inLanguage": "en-IN"
              }
            ]
          })}}
        />
      </head>
      <body>
        <GrainOverlay />
        <CustomCursor />
        <SmoothScroll />
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
