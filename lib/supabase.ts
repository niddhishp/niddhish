import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL  || ''
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const SERVICE_KEY   = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Public client (anon key — used client-side)
export function getSupabaseClient() {
  if (!SUPABASE_URL || !SUPABASE_ANON) {
    throw new Error('Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set in Vercel.')
  }
  return createClient(SUPABASE_URL, SUPABASE_ANON)
}

// Admin client (service role — server-side only)
export function getSupabaseAdmin() {
  if (!SUPABASE_URL || !SERVICE_KEY) {
    throw new Error('Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in Vercel.')
  }
  return createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

// Contact types
export interface Contact {
  id: string
  project_type: string
  name: string
  email: string
  brief: string
  created_at: string
  status: 'new' | 'read' | 'replied'
}

// Blog post types (for admin management)
export interface BlogPostRecord {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  published: boolean
  created_at: string
  updated_at: string
}

// Supabase table SQL (run once in Supabase dashboard)
export const SCHEMA_SQL = `
-- contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_type TEXT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  brief TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'new'
);

-- blog_posts table (optional — use for dynamic blog management)
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  category TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row level security
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Allow service role full access
CREATE POLICY "Service role full access on contacts"
  ON contacts FOR ALL USING (true);
CREATE POLICY "Service role full access on blog_posts"
  ON blog_posts FOR ALL USING (true);
`
