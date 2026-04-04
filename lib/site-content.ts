import { createClient } from '@supabase/supabase-js'

// Default values used when Supabase is not connected
export const DEFAULTS = {
  about_photo_url: '',
  about_name: 'Niddhish Puuzhakkal',
  about_title: 'Filmmaker · Psychologist · Author · Strategist',
  about_quote: 'Creativity is not a talent. It is a skill that can be engineered.',
  about_bio: 'With over 20 years across advertising, cinema, and behavioral science, Niddhish Puuzhakkal sits at the intersection of storytelling and strategy. He has directed 200+ TVCs for 80+ brands — from Nike and Harley Davidson to Tata and L\'Oréal — and written three books on the science of creativity.\n\nHis debut feature EGO (Arshad Warsi, Juhi Chawla, Divya Dutta, Gauhar Khan) is preparing for release.',
  about_stat1_num: '200', about_stat1_suffix: '+', about_stat1_label: 'Commercials',
  about_stat2_num: '3',   about_stat2_suffix: '',  about_stat2_label: 'Feature Films',
  about_stat3_num: '80',  about_stat3_suffix: '+', about_stat3_label: 'Brands',
  about_stat4_num: '20',  about_stat4_suffix: '+', about_stat4_label: 'Years',
  hero_video_url: '',
  hero_tagline: 'Creativity.',
  hero_tagline_accent: 'Applied.',
  hero_subtitle: 'Behavioral filmmaking. Creative strategy. Technology built to think.',
  hero_sub_italic: 'Where psychology meets cinema.',
  social_linkedin: 'https://linkedin.com/in/niddhish',
  social_twitter: 'https://twitter.com/niddhishp',
  social_vimeo: 'https://vimeo.com/niddhish',
  social_instagram: 'https://instagram.com/niddhishp',
  social_youtube: 'https://youtube.com/@niddhishp',
}

export type SiteContent = typeof DEFAULTS

export async function getSiteContent(): Promise<SiteContent> {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) return DEFAULTS

    const sb = createClient(url, key)
    const { data } = await sb.from('site_settings').select('key,value')
    if (!data) return DEFAULTS

    const merged = { ...DEFAULTS }
    data.forEach(row => {
      if (row.key in merged) {
        (merged as Record<string, string>)[row.key] = row.value
      }
    })
    return merged
  } catch {
    return DEFAULTS
  }
}
