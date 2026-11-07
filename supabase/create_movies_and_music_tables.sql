-- ==============================================================================
-- CLEAN PRODUCTION SETUP FOR MOVIES & MUSIC (NO DUMMY SEED DATA)
-- Run this in your Supabase Dashboard: SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. MOVIES TABLE
CREATE TABLE IF NOT EXISTS public.movies (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    youtube_url TEXT NOT NULL,
    thumbnail_url TEXT NOT NULL,
    director TEXT NOT NULL DEFAULT 'One Roof Studios',
    year TEXT NOT NULL DEFAULT '2026',
    duration TEXT NOT NULL DEFAULT '1h 45m',
    featured BOOLEAN NOT NULL DEFAULT false,
    order_num INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Drop genre column if it already exists from prior setup
ALTER TABLE public.movies DROP COLUMN IF EXISTS genre;

ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view movies" ON public.movies;
DROP POLICY IF EXISTS "Service role has full access to movies" ON public.movies;
CREATE POLICY "Public can view movies" ON public.movies FOR SELECT USING (true);
CREATE POLICY "Service role has full access to movies" ON public.movies FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 2. MUSIC & AUDIO TRACKS TABLE
CREATE TABLE IF NOT EXISTS public.music_items (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    description TEXT NOT NULL,
    thumbnail_url TEXT NOT NULL,
    audio_url TEXT NOT NULL DEFAULT '',
    duration TEXT NOT NULL DEFAULT '3:45',
    genre TEXT NOT NULL DEFAULT 'Electronic / Orchestral',
    year TEXT NOT NULL DEFAULT '2026',
    spotify_url TEXT DEFAULT '',
    soundcloud_url TEXT DEFAULT '',
    apple_music_url TEXT DEFAULT '',
    youtube_url TEXT DEFAULT '',
    featured BOOLEAN NOT NULL DEFAULT false,
    order_num INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.music_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view music items" ON public.music_items;
DROP POLICY IF EXISTS "Service role has full access to music items" ON public.music_items;
CREATE POLICY "Public can view music items" ON public.music_items FOR SELECT USING (true);
CREATE POLICY "Service role has full access to music items" ON public.music_items FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 3. Force PostgREST schema cache reload
NOTIFY pgrst, 'reload schema';

