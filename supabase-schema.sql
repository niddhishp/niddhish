-- ============================================================
-- niddhish.com — Supabase Schema
-- Run this entire script in the Supabase SQL editor
-- Project: https://hvgxjpeqqedluxofnrgb.supabase.co
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─────────────────────────────────────────────
-- 1. CONTACTS TABLE
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contacts (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_type  TEXT,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL,
  brief         TEXT,
  status        TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 2. BLOG POSTS TABLE
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blog_posts (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug          TEXT UNIQUE NOT NULL,
  title         TEXT NOT NULL,
  excerpt       TEXT,
  content       TEXT,
  category      TEXT DEFAULT 'Film & Direction',
  published     BOOLEAN DEFAULT false,
  read_time     TEXT DEFAULT '5 min',
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 3. PRESS ITEMS TABLE
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS press_items (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  outlet        TEXT NOT NULL,
  title         TEXT NOT NULL,
  summary       TEXT,
  type          TEXT DEFAULT 'Feature Interview',
  year          TEXT,
  url           TEXT,
  kind          TEXT DEFAULT 'press' CHECK (kind IN ('press', 'podcast')),
  podcast_show  TEXT,      -- for podcasts: show name
  podcast_host  TEXT,      -- for podcasts: host name
  published     BOOLEAN DEFAULT true,
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 4. FILMS TABLE
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS films (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title         TEXT NOT NULL,
  year          TEXT,
  genre         TEXT,
  tagline       TEXT,
  cast_members  TEXT,
  status        TEXT DEFAULT 'production' CHECK (status IN ('release', 'post', 'production')),
  status_label  TEXT,
  poster_url    TEXT,
  sort_order    INTEGER DEFAULT 0,
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 5. ROW LEVEL SECURITY
-- ─────────────────────────────────────────────
ALTER TABLE contacts    ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts  ENABLE ROW LEVEL SECURITY;
ALTER TABLE press_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE films       ENABLE ROW LEVEL SECURITY;

-- Allow anon/public to INSERT contacts (from the website contact form)
CREATE POLICY "Public can insert contacts"
  ON contacts FOR INSERT TO anon WITH CHECK (true);

-- Allow anon/public to read published blog posts
CREATE POLICY "Public can read published blog posts"
  ON blog_posts FOR SELECT TO anon USING (published = true);

-- Allow anon/public to read published press items
CREATE POLICY "Public can read published press items"
  ON press_items FOR SELECT TO anon USING (published = true);

-- Allow anon/public to read films
CREATE POLICY "Public can read films"
  ON films FOR SELECT TO anon USING (true);

-- Service role gets full access to everything (used by admin API routes)
CREATE POLICY "Service role full access contacts"
  ON contacts FOR ALL USING (true);

CREATE POLICY "Service role full access blog"
  ON blog_posts FOR ALL USING (true);

CREATE POLICY "Service role full access press"
  ON press_items FOR ALL USING (true);

CREATE POLICY "Service role full access films"
  ON films FOR ALL USING (true);

-- ─────────────────────────────────────────────
-- 6. AUTO-UPDATE updated_at ON blog_posts
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─────────────────────────────────────────────
-- 7. SEED INITIAL FILMS DATA
-- ─────────────────────────────────────────────
INSERT INTO films (title, year, genre, tagline, cast_members, status, status_label, poster_url, sort_order)
VALUES
  (
    'EGO',
    '2024',
    'Feature Film · Hindi · Drama-Comedy',
    'Some fights are with the world. Some are with yourself.',
    'Arshad Warsi · Juhi Chawla · Divya Dutta · Gauhar Khan',
    'release',
    'Preparing for Release',
    'https://static.wixstatic.com/media/7b7113_08d50cb6ea2c4f4daf7738dffbc6799f~mv2.png/v1/crop/x_14,y_0,w_1385,h_2000/fill/w_471,h_680,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Black%20White%20Typographic%20Modern%20Movie%20Poster(1).png',
    1
  ),
  (
    'Palkon Pe',
    '2024',
    'Feature Film · Hindi',
    'A story carried on the edges of sight.',
    'Completing Post-Production',
    'post',
    'In Post-Production',
    NULL,
    2
  ),
  (
    'Canvas',
    '2025',
    'Feature Film · Malayalam',
    'Every life is a work in progress.',
    'Niddhish Puuzhakkal · Sudhy Kopa · Mamu Koya · Vijay Menon',
    'production',
    'In Production',
    'https://static.wixstatic.com/media/7b7113_7d42f7955c7f4357b9f21975cb34dd6c~mv2.png/v1/crop/x_14,y_0,w_1385,h_2000/fill/w_471,h_680,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/CANVAS%20POSTER%201(1).png',
    3
  )
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────
-- DONE. Check tables:
-- SELECT * FROM contacts;
-- SELECT * FROM blog_posts;
-- SELECT * FROM press_items;
-- SELECT * FROM films;
-- ─────────────────────────────────────────────

-- ─────────────────────────────────────────────
-- 8. SITE SETTINGS TABLE (key-value store)
-- Run this if you haven't already
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS site_settings (
  key           TEXT PRIMARY KEY,
  value         TEXT,
  updated_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read site settings"
  ON site_settings FOR SELECT TO anon USING (true);

CREATE POLICY "Service role full access site_settings"
  ON site_settings FOR ALL USING (true);

-- Seed default settings
INSERT INTO site_settings (key, value) VALUES
  ('hero_video_url', ''),
  ('hero_tagline', 'Creativity.'),
  ('hero_tagline_accent', 'Applied.'),
  ('hero_subtitle', 'Behavioral filmmaking. Creative strategy. Technology built to think.'),
  ('hero_sub_italic', 'Where psychology meets cinema.'),
  ('site_title', 'Niddhish Puuzhakkal — Creativity. Applied.'),
  ('contact_email', 'niddhish@lightseekermedia.com'),
  ('contact_phone', '+91 99204 62666'),
  ('about_photo_url', '')
ON CONFLICT (key) DO NOTHING;

-- ─────────────────────────────────────────────
-- 9. STORAGE BUCKETS (run separately in Supabase dashboard > Storage)
-- Or via API — handled by /api/admin/upload automatically
-- ─────────────────────────────────────────────
-- Create bucket 'uploads' with public access in:
-- Supabase Dashboard → Storage → New Bucket → Name: uploads → Public: ON
