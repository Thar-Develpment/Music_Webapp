-- ==============================================================================
-- ONE ROOF ENTERTAINMENT — ADVANCED ENTERPRISE DATABASE ARCHITECTURE
-- PostgreSQL / Supabase Schema (Scalable, Indexed, Highly Resilient)
-- Run in Supabase SQL Editor: Dashboard -> Project -> SQL Editor -> Run
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 2. AUTOMATIC TIMESTAMP UPDATE TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- 3. CORE DOMAIN TABLES
-- ==============================================================================

-- SITE SETTINGS & THEME TOKENS
CREATE TABLE IF NOT EXISTS public.settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    site_name TEXT NOT NULL DEFAULT 'ONE ROOF',
    logo_url TEXT NOT NULL DEFAULT '/logo-icon.png',
    tagline TEXT NOT NULL DEFAULT 'Sound Beyond Horizons — Independent Entertainment & Production House',
    booking_email TEXT NOT NULL DEFAULT 'booking@oneroofentertainment.com',
    booking_phone TEXT NOT NULL DEFAULT '+1 (310) 894-2200',
    address TEXT DEFAULT '8439 Sunset Blvd, West Hollywood, CA 90069',
    footer_text TEXT NOT NULL DEFAULT 'Crafting iconic sonic experiences and cinematic documentaries. Defining the vanguard of electronic, orchestral, and modern soul music.',
    theme TEXT NOT NULL DEFAULT 'black' CHECK (theme IN ('black', 'white')),
    social_links JSONB NOT NULL DEFAULT '{
        "instagram": "https://instagram.com/oneroofent",
        "youtube": "https://youtube.com/@oneroofent",
        "facebook": "https://facebook.com/oneroofent",
        "spotify": "https://open.spotify.com",
        "soundcloud": "https://soundcloud.com"
    }'::jsonb,
    meta_seo JSONB NOT NULL DEFAULT '{
        "title": "One Roof Entertainment — Luxury Sonic Immersion",
        "description": "An avant-garde collective of boundary-defying producers, rock icons, and visionary recording artists."
    }'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- PAGE CONTENTS (Modular CMS for Home, About, Contact)
CREATE TABLE IF NOT EXISTS public.page_contents (
    slug TEXT PRIMARY KEY,
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ARTISTS ROSTER
CREATE TABLE IF NOT EXISTS public.artists (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    role TEXT DEFAULT 'Recording Artist',
    genre TEXT NOT NULL,
    bio TEXT DEFAULT '',
    photo_url TEXT NOT NULL,
    banner_url TEXT DEFAULT '',
    spotify_url TEXT DEFAULT '',
    social_links JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT true,
    order_num INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- MOVIES & CINEMA ARCHIVE
CREATE TABLE IF NOT EXISTS public.movies (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE,
    description TEXT NOT NULL,
    youtube_url TEXT NOT NULL,
    youtube_id VARCHAR(32),
    thumbnail_url TEXT NOT NULL,
    backdrop_url TEXT DEFAULT '',
    director TEXT NOT NULL DEFAULT 'One Roof Studios',
    year VARCHAR(10) NOT NULL DEFAULT '2026',
    duration VARCHAR(20) NOT NULL DEFAULT '1h 45m',
    genre VARCHAR(100) NOT NULL DEFAULT 'Cinematic / Documentary',
    featured BOOLEAN NOT NULL DEFAULT false,
    status VARCHAR(20) NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived', 'unlisted')),
    order_num INT NOT NULL DEFAULT 0,
    views_count BIGINT NOT NULL DEFAULT 0,
    youtube_metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- MUSIC & AUDIO TRACKS
CREATE TABLE IF NOT EXISTS public.music_items (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    artist_id TEXT REFERENCES public.artists(id) ON DELETE SET NULL,
    description TEXT NOT NULL DEFAULT '',
    thumbnail_url TEXT NOT NULL,
    audio_url TEXT NOT NULL DEFAULT '',
    duration VARCHAR(20) NOT NULL DEFAULT '3:45',
    genre VARCHAR(100) NOT NULL DEFAULT 'Electronic / Orchestral',
    year VARCHAR(10) NOT NULL DEFAULT '2026',
    bpm INT DEFAULT NULL,
    spotify_url TEXT DEFAULT '',
    soundcloud_url TEXT DEFAULT '',
    apple_music_url TEXT DEFAULT '',
    youtube_url TEXT DEFAULT '',
    streaming_links JSONB DEFAULT '{}'::jsonb,
    waveform_data JSONB DEFAULT '[]'::jsonb,
    featured BOOLEAN NOT NULL DEFAULT false,
    status VARCHAR(20) NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    order_num INT NOT NULL DEFAULT 0,
    plays_count BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- GALLERY CATEGORIES
CREATE TABLE IF NOT EXISTS public.gallery_categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    cover_url TEXT DEFAULT '',
    order_num INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- GALLERY MEDIA ITEMS
CREATE TABLE IF NOT EXISTS public.gallery_items (
    id TEXT PRIMARY KEY,
    category_id TEXT NOT NULL REFERENCES public.gallery_categories(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    media JSONB NOT NULL DEFAULT '[]'::jsonb,
    caption TEXT DEFAULT '',
    order_num INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- DIGITAL ASSETS MANAGEMENT (DAM)
CREATE TABLE IF NOT EXISTS public.media_assets (
    id TEXT PRIMARY KEY,
    bucket_id TEXT DEFAULT 'media',
    storage_path TEXT DEFAULT '',
    url TEXT NOT NULL,
    kind TEXT NOT NULL CHECK (kind IN ('image', 'video', 'audio', 'document')),
    source TEXT NOT NULL CHECK (source IN ('upload', 'url', 'external')),
    title TEXT NOT NULL,
    alt TEXT NOT NULL DEFAULT '',
    provider TEXT DEFAULT NULL,
    external_id TEXT DEFAULT NULL,
    width INT DEFAULT NULL,
    height INT DEFAULT NULL,
    bytes BIGINT DEFAULT NULL,
    mime_type TEXT DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- CONTACT & BOOKING ENQUIRIES (CRM)
CREATE TABLE IF NOT EXISTS public.enquiries (
    id TEXT PRIMARY KEY DEFAULT ('enq-' || substr(gen_random_uuid()::text, 1, 8)),
    first_name TEXT NOT NULL,
    last_name TEXT DEFAULT '',
    email TEXT NOT NULL,
    phone TEXT NOT NULL DEFAULT '',
    subject TEXT DEFAULT 'Booking & Inquiry',
    message TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'in_progress', 'resolved', 'archived', 'spam')),
    admin_notes TEXT DEFAULT '',
    read_at TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- STATS / COUNTERS
CREATE TABLE IF NOT EXISTS public.counters (
    id TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    value NUMERIC NOT NULL DEFAULT 0,
    suffix TEXT NOT NULL DEFAULT '+',
    order_num INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- UPCOMING PROJECTS
CREATE TABLE IF NOT EXISTS public.upcoming_projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    release_date TEXT NOT NULL,
    category TEXT NOT NULL,
    cover_url TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    order_num INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- PRESS REVIEWS & TESTIMONIALS
CREATE TABLE IF NOT EXISTS public.testimonials (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    quote TEXT NOT NULL,
    photo_url TEXT NOT NULL,
    order_num INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- EXECUTIVE & PRODUCTION MANAGEMENT
CREATE TABLE IF NOT EXISTS public.managers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    photo_url TEXT NOT NULL,
    order_num INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- PRODUCTION CREW & TEAM MEMBERS
CREATE TABLE IF NOT EXISTS public.team_members (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    bio TEXT NOT NULL DEFAULT '',
    photo_url TEXT NOT NULL,
    order_num INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 4. HIGH-PERFORMANCE INDEXES (For Scalability & Low Latency)
-- ==============================================================================

-- Movies Indexes
CREATE INDEX IF NOT EXISTS idx_movies_order ON public.movies (order_num ASC);
CREATE INDEX IF NOT EXISTS idx_movies_status_order ON public.movies (status, order_num ASC);
CREATE INDEX IF NOT EXISTS idx_movies_featured ON public.movies (featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_movies_youtube_id ON public.movies (youtube_id);
CREATE INDEX IF NOT EXISTS idx_movies_search ON public.movies USING gin (to_tsvector('english', title || ' ' || description || ' ' || director));

-- Music Indexes
CREATE INDEX IF NOT EXISTS idx_music_order ON public.music_items (order_num ASC);
CREATE INDEX IF NOT EXISTS idx_music_artist_id ON public.music_items (artist_id);
CREATE INDEX IF NOT EXISTS idx_music_featured ON public.music_items (featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_music_search ON public.music_items USING gin (to_tsvector('english', title || ' ' || artist));

-- Artists Indexes
CREATE INDEX IF NOT EXISTS idx_artists_order ON public.artists (order_num ASC);
CREATE INDEX IF NOT EXISTS idx_artists_active ON public.artists (is_active);

-- Gallery Indexes
CREATE INDEX IF NOT EXISTS idx_gallery_items_cat_order ON public.gallery_items (category_id, order_num ASC);

-- Enquiries Indexes
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON public.enquiries (status, created_at DESC);

-- ==============================================================================
-- 5. AUTOMATIC TIMESTAMP TRIGGERS
-- ==============================================================================

DROP TRIGGER IF EXISTS trg_settings_updated_at ON public.settings;
CREATE TRIGGER trg_settings_updated_at BEFORE UPDATE ON public.settings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_page_contents_updated_at ON public.page_contents;
CREATE TRIGGER trg_page_contents_updated_at BEFORE UPDATE ON public.page_contents FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_artists_updated_at ON public.artists;
CREATE TRIGGER trg_artists_updated_at BEFORE UPDATE ON public.artists FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_movies_updated_at ON public.movies;
CREATE TRIGGER trg_movies_updated_at BEFORE UPDATE ON public.movies FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_music_items_updated_at ON public.music_items;
CREATE TRIGGER trg_music_items_updated_at BEFORE UPDATE ON public.music_items FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.music_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.upcoming_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.managers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Public READ policies
DROP POLICY IF EXISTS "Public can view settings" ON public.settings;
CREATE POLICY "Public can view settings" ON public.settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view page contents" ON public.page_contents;
CREATE POLICY "Public can view page contents" ON public.page_contents FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view artists" ON public.artists;
CREATE POLICY "Public can view artists" ON public.artists FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view movies" ON public.movies;
CREATE POLICY "Public can view movies" ON public.movies FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view music items" ON public.music_items;
CREATE POLICY "Public can view music items" ON public.music_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view gallery categories" ON public.gallery_categories;
CREATE POLICY "Public can view gallery categories" ON public.gallery_categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view gallery items" ON public.gallery_items;
CREATE POLICY "Public can view gallery items" ON public.gallery_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view media assets" ON public.media_assets;
CREATE POLICY "Public can view media assets" ON public.media_assets FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view counters" ON public.counters;
CREATE POLICY "Public can view counters" ON public.counters FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view upcoming projects" ON public.upcoming_projects;
CREATE POLICY "Public can view upcoming projects" ON public.upcoming_projects FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view testimonials" ON public.testimonials;
CREATE POLICY "Public can view testimonials" ON public.testimonials FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view managers" ON public.managers;
CREATE POLICY "Public can view managers" ON public.managers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view team members" ON public.team_members;
CREATE POLICY "Public can view team members" ON public.team_members FOR SELECT USING (true);

-- Public INSERT for enquiries
DROP POLICY IF EXISTS "Public can submit enquiries" ON public.enquiries;
CREATE POLICY "Public can submit enquiries" ON public.enquiries FOR INSERT WITH CHECK (true);

-- Service Role Full Access (Admin bypass)
DROP POLICY IF EXISTS "Service role full access settings" ON public.settings;
CREATE POLICY "Service role full access settings" ON public.settings FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access page_contents" ON public.page_contents;
CREATE POLICY "Service role full access page_contents" ON public.page_contents FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access artists" ON public.artists;
CREATE POLICY "Service role full access artists" ON public.artists FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access movies" ON public.movies;
CREATE POLICY "Service role full access movies" ON public.movies FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access music items" ON public.music_items;
CREATE POLICY "Service role full access music items" ON public.music_items FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access gallery categories" ON public.gallery_categories;
CREATE POLICY "Service role full access gallery categories" ON public.gallery_categories FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access gallery items" ON public.gallery_items;
CREATE POLICY "Service role full access gallery items" ON public.gallery_items FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access media assets" ON public.media_assets;
CREATE POLICY "Service role full access media assets" ON public.media_assets FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access enquiries" ON public.enquiries;
CREATE POLICY "Service role full access enquiries" ON public.enquiries FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access counters" ON public.counters;
CREATE POLICY "Service role full access counters" ON public.counters FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access upcoming projects" ON public.upcoming_projects;
CREATE POLICY "Service role full access upcoming projects" ON public.upcoming_projects FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access testimonials" ON public.testimonials;
CREATE POLICY "Service role full access testimonials" ON public.testimonials FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access managers" ON public.managers;
CREATE POLICY "Service role full access managers" ON public.managers FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access team members" ON public.team_members;
CREATE POLICY "Service role full access team members" ON public.team_members FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ==============================================================================
-- 7. STORAGE BUCKET CONFIGURATION (For Images, Audios, Videos)
-- ==============================================================================

-- Create public 'media' storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage RLS Policies
DROP POLICY IF EXISTS "Public Media Read" ON storage.objects;
CREATE POLICY "Public Media Read" ON storage.objects FOR SELECT USING (bucket_id = 'media');

DROP POLICY IF EXISTS "Service Role Media Full Access" ON storage.objects;
CREATE POLICY "Service Role Media Full Access" ON storage.objects FOR ALL TO service_role USING (bucket_id = 'media') WITH CHECK (bucket_id = 'media');

-- ==============================================================================
-- 8. DEFAULT INITIAL SETTINGS (Only if empty, preserves existing)
-- ==============================================================================

INSERT INTO public.settings (id, site_name, logo_url, tagline, booking_email, booking_phone, address, footer_text, theme)
VALUES (
    'default',
    'ONE ROOF',
    '/logo-icon.png',
    'Sound Beyond Horizons — Independent Entertainment & Production House',
    'booking@oneroofentertainment.com',
    '+1 (310) 894-2200',
    '8439 Sunset Blvd, West Hollywood, CA 90069',
    'Crafting iconic sonic experiences and cinematic documentaries. Defining the vanguard of electronic, orchestral, and modern soul music.',
    'black'
) ON CONFLICT (id) DO NOTHING;

-- Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';

