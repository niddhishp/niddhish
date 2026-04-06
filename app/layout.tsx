import type { Metadata } from 'next'
import { DM_Sans, Playfair_Display } from 'next/font/google'
import '../styles/globals.css'
import Nav from '@/components/Nav'
import GrainOverlay from '@/components/GrainOverlay'
import Footer from '@/components/Footer'
import CustomCursor from '@/components/CustomCursor'
import SmoothScroll from '@/components/SmoothScroll'
import { getSiteContent } from '@/lib/site-content'

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
    default: 'Niddhish Puuzhakkal — Film Director, Brand Strategist, Mumbai',
    template: '%s — Niddhish Puuzhakkal',
  },
  description:
    'Film director, behavioral psychologist, author and brand strategist based in Mumbai. 200+ TVCs for Nike, Harley Davidson, Maruti, Adidas & 80+ brands. 3 feature films. Where psychology meets cinema.',
  keywords: [
    'Niddhish Puuzhakkal',
    'film director Mumbai',
    'TVC director India',
    'brand film director Mumbai',
    'advertising director India',
    'commercial director Mumbai',
    'behavioral filmmaker',
    'creative director psychologist',
    'Light Seeker Films',
    'filmmaker psychologist India',
    'brand strategy Mumbai',
    'psychology-based advertising',
    'hire film director India',
    'AI filmmaking India',
    'behavioral brand strategy',
    'Six Sigma filmmaking',
  ],
  authors: [{ name: 'Niddhish Puuzhakkal', url: 'https://niddhish.com' }],
  creator: 'Niddhish Puuzhakkal',
  alternates: {
    canonical: 'https://niddhish.com',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://niddhish.com',
    siteName: 'Niddhish Puuzhakkal',
    title: 'Niddhish Puuzhakkal — Film Director & Brand Strategist, Mumbai',
    description:
      'Behavioral filmmaker, psychologist, author and brand strategist. 200+ TVCs, 3 feature films, 80+ brands. Creative intelligence applied to every problem.',
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
    title: 'Niddhish Puuzhakkal — Film Director, Mumbai',
    description: 'Behavioral filmmaker. Psychologist. Author. Strategist. 200+ TVCs, 3 films, 80+ brands.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large', 'max-video-preview': -1 },
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const content = await getSiteContent().catch(() => ({} as Record<string, string>))
  const verifyGoogle = content['verify_google'] || ''
  const verifyBing = content['verify_bing'] || ''
  const verifyPinterest = content['verify_pinterest'] || ''
  const gaId = content['seo_ga_id'] || ''
  const additionalMeta = content['seo_additional_meta'] || ''

  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${playfair.variable}`}
      style={{ colorScheme: 'dark' }}
    >
      <head>
        <meta name="theme-color" content="#0a0a0a" />
        <meta name="color-scheme" content="dark" />
        {verifyGoogle && <meta name="google-site-verification" content={verifyGoogle} />}
        {verifyBing && <meta name="msvalidate.01" content={verifyBing} />}
        {verifyPinterest && <meta name="p:domain_verify" content={verifyPinterest} />}
        {additionalMeta && <div dangerouslySetInnerHTML={{ __html: additionalMeta }} />}
        {gaId && gaId.startsWith('G-') && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
            <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');` }} />
          </>
        )}
        {gaId && gaId.startsWith('GTM-') && (
          <script dangerouslySetInnerHTML={{ __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gaId}');` }} />
        )}
        {/* Kill Vercel toolbar / comments overlay on all envs */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            // 1. Prevent browser scroll restoration
            if ('scrollRestoration' in history) {
              history.scrollRestoration = 'manual';
            }
            // 2. Force scroll to top immediately
            window.scrollTo(0, 0);
            // 3. Kill Vercel toolbar overlays
            var sel = ['vercel-live-feedback', 'vercel-toolbar', '__NEXT_TOOLBAR__'];
            var kill = function() {
              sel.forEach(function(s) {
                var el = document.querySelector(s) || document.getElementById(s);
                if (el) el.remove();
              });
              document.querySelectorAll('iframe').forEach(function(f) {
                if ((f.src||'').includes('vercel') || (f.id||'').includes('vercel')) f.remove();
              });
            };
            kill();
            var obs = new MutationObserver(kill);
            obs.observe(document.documentElement, { childList: true, subtree: true });
          })();
        ` }} />
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
