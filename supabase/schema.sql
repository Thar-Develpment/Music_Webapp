-- ==============================================================================
-- VELVET NOIR RECORDINGS — Supabase Database Schema & Initial Seed
-- Run this script in your Supabase SQL Editor (supabase.com -> Project -> SQL Editor)
-- ==============================================================================

-- 1. Enable UUID Extension 
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. CREATE TABLES
-- ==============================================================================

-- Site Settings & Theme
CREATE TABLE IF NOT EXISTS public.settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    site_name TEXT NOT NULL DEFAULT 'VELVET NOIR',
    logo_url TEXT NOT NULL DEFAULT '/images/logo.svg',
    tagline TEXT NOT NULL DEFAULT 'Sound Beyond Horizons — Independent Luxury Record Label & Production House',
    booking_email TEXT NOT NULL DEFAULT 'booking@velvetnoir.com',
    booking_phone TEXT NOT NULL DEFAULT '+1 (310) 894-2200',
    address TEXT DEFAULT '8439 Sunset Blvd, West Hollywood, CA 90069',
    footer_text TEXT NOT NULL DEFAULT 'Crafting iconic sonic experiences and cinematic documentaries. Defining the vanguard of electronic, orchestral, and modern soul music.',
    theme TEXT NOT NULL DEFAULT 'black' CHECK (theme IN ('black', 'white')),
    social_links JSONB NOT NULL DEFAULT '{"instagram": "https://instagram.com/velvetnoirrec", "youtube": "https://youtube.com/@velvetnoirrec", "facebook": "https://facebook.com/velvetnoirrec", "spotify": "https://open.spotify.com", "soundcloud": "https://soundcloud.com"}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Page Contents (Home, About, Contact)
CREATE TABLE IF NOT EXISTS public.page_contents (
    slug TEXT PRIMARY KEY,
    content JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Statistics / Counters
CREATE TABLE IF NOT EXISTS public.counters (
    id TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    value NUMERIC NOT NULL DEFAULT 0,
    suffix TEXT NOT NULL DEFAULT '+',
    order_num INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Artists
CREATE TABLE IF NOT EXISTS public.artists (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    genre TEXT NOT NULL,
    photo_url TEXT NOT NULL,
    spotify_url TEXT DEFAULT '',
    order_num INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Managers / Executive Team
CREATE TABLE IF NOT EXISTS public.managers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    photo_url TEXT NOT NULL,
    order_num INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Upcoming Releases / Projects
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

-- Press Testimonials & Reviews
CREATE TABLE IF NOT EXISTS public.testimonials (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    quote TEXT NOT NULL,
    photo_url TEXT NOT NULL,
    order_num INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Gallery Categories
CREATE TABLE IF NOT EXISTS public.gallery_categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    order_num INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Gallery Items
CREATE TABLE IF NOT EXISTS public.gallery_items (
    id TEXT PRIMARY KEY,
    category_id TEXT NOT NULL REFERENCES public.gallery_categories(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    media JSONB NOT NULL,
    order_num INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Documentary Production Team
CREATE TABLE IF NOT EXISTS public.team_members (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    bio TEXT NOT NULL,
    photo_url TEXT NOT NULL,
    order_num INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Media Assets Library
CREATE TABLE IF NOT EXISTS public.media_assets (
    id TEXT PRIMARY KEY,
    kind TEXT NOT NULL CHECK (kind IN ('image', 'video')),
    source TEXT NOT NULL CHECK (source IN ('upload', 'url')),
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    alt TEXT NOT NULL,
    provider TEXT DEFAULT NULL,
    external_id TEXT DEFAULT NULL,
    width INT DEFAULT NULL,
    height INT DEFAULT NULL,
    bytes BIGINT DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Contact & Booking Enquiries (Transmissions)
CREATE TABLE IF NOT EXISTS public.enquiries (
    id TEXT PRIMARY KEY DEFAULT ('enq-' || substr(gen_random_uuid()::text, 1, 8)),
    first_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    read_at TIMESTAMPTZ DEFAULT NULL
);

-- ==============================================================================
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.managers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.upcoming_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

-- Public READ access for website frontend visitors
CREATE POLICY "Public can view settings" ON public.settings FOR SELECT USING (true);
CREATE POLICY "Public can view page contents" ON public.page_contents FOR SELECT USING (true);
CREATE POLICY "Public can view counters" ON public.counters FOR SELECT USING (true);
CREATE POLICY "Public can view artists" ON public.artists FOR SELECT USING (true);
CREATE POLICY "Public can view managers" ON public.managers FOR SELECT USING (true);
CREATE POLICY "Public can view upcoming projects" ON public.upcoming_projects FOR SELECT USING (true);
CREATE POLICY "Public can view testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Public can view gallery categories" ON public.gallery_categories FOR SELECT USING (true);
CREATE POLICY "Public can view gallery items" ON public.gallery_items FOR SELECT USING (true);
CREATE POLICY "Public can view team members" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "Public can view media assets" ON public.media_assets FOR SELECT USING (true);

-- Public INSERT access for contact form submissions
CREATE POLICY "Public can submit enquiries" ON public.enquiries FOR INSERT WITH CHECK (true);

-- Service Role (Backend & Admin) full read/write access
CREATE POLICY "Service role full access settings" ON public.settings FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access page_contents" ON public.page_contents FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access counters" ON public.counters FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access artists" ON public.artists FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access managers" ON public.managers FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access upcoming_projects" ON public.upcoming_projects FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access testimonials" ON public.testimonials FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access gallery_categories" ON public.gallery_categories FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access gallery_items" ON public.gallery_items FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access team_members" ON public.team_members FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access media_assets" ON public.media_assets FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access enquiries" ON public.enquiries FOR ALL USING (auth.role() = 'service_role');

-- ==============================================================================
-- 4. SUPABASE STORAGE BUCKET (For Media & Images)
-- ==============================================================================

-- Create 'media' storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to uploaded media files
CREATE POLICY "Public Media Access" ON storage.objects
FOR SELECT USING (bucket_id = 'media');

-- Allow service role or authenticated users to upload media
CREATE POLICY "Admin Media Upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'media');

-- Allow delete/update
CREATE POLICY "Admin Media Modify" ON storage.objects
FOR UPDATE USING (bucket_id = 'media');
CREATE POLICY "Admin Media Delete" ON storage.objects
FOR DELETE USING (bucket_id = 'media');

-- ==============================================================================
-- 5. INITIAL SEED DATA
-- ==============================================================================

-- Settings
INSERT INTO public.settings (id, site_name, logo_url, tagline, booking_email, booking_phone, address, footer_text, theme, social_links)
VALUES (
    'default',
    'VELVET NOIR',
    '/images/logo.svg',
    'Sound Beyond Horizons — Independent Luxury Record Label & Production House',
    'booking@velvetnoir.com',
    '+1 (310) 894-2200',
    '8439 Sunset Blvd, West Hollywood, CA 90069',
    'Crafting iconic sonic experiences and cinematic documentaries. Defining the vanguard of electronic, orchestral, and modern soul music.',
    'black',
    '{"instagram": "https://instagram.com/velvetnoirrec", "youtube": "https://youtube.com/@velvetnoirrec", "facebook": "https://facebook.com/velvetnoirrec", "spotify": "https://open.spotify.com", "soundcloud": "https://soundcloud.com"}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
    site_name = EXCLUDED.site_name,
    tagline = EXCLUDED.tagline,
    theme = EXCLUDED.theme;

-- Page Contents
INSERT INTO public.page_contents (slug, content)
VALUES
(
    'home',
    '{
        "hero": {
            "headline": "WHERE SOUND MEETS CINEMA",
            "subheadline": "SONIC IMMERSION & ELEVATED ARTISTRY",
            "tagline": "An avant-garde collective of boundary-defying producers, cinematic composers, and visionary artists.",
            "introText": "Velvet Noir transcends standard label boundaries. We engineer sonic landscapes that move dancefloors, score blockbuster cinematic features, and echo across global festivals.",
            "featuredVideoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            "ctaPrimaryText": "Explore Roster",
            "ctaSecondaryText": "Watch Showreel"
        },
        "aboutTeaser": {
            "heading": "SCULPTING MODERN SOUNDSCAPES",
            "bio": "Founded on the belief that music should be a visceral encounter, Velvet Noir produces rare, timeless records. From analog modular synthesizers to 80-piece philharmonic sessions, our catalog redefines modern auditory luxury.",
            "imageUrl": "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200&auto=format&fit=crop",
            "buttonText": "Discover Our Story"
        }
    }'::jsonb
),
(
    'about',
    '{
        "artistName": "VELVET NOIR COLLECTIVE",
        "headline": "UNCOMPROMISING VISION, ARCHIVAL QUALITY",
        "fullBio": "Established in 2018 in Los Angeles and Berlin, Velvet Noir began as a clandestine recording sanctuary for multi-instrumentalists refusing the assembly-line sound of mainstream radio. Today, we stand as an independent global powerhouse, bridging electronic subterranean rhythms with grand orchestral cinema. Every release is masterfully crafted in Dolby Atmos, pressed on audiophile-grade heavyweight vinyl, and accompanied by bespoke visual documentaries.",
        "mission": "To champion artists who reshape the cultural dialogue through acoustic purity, boundary-pushing production, and unapologetic artistic freedom.",
        "collageImages": [
            "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000&auto=format&fit=crop"
        ]
    }'::jsonb
),
(
    'contact',
    '{
        "headline": "INITIATE COLLABORATION",
        "subheadline": "BOOKINGS, SYNC LICENSING & PRESS ENQUIRIES",
        "instructions": "For festival bookings, orchestral commission requests, soundtrack licensing, or general media enquiries, connect with our management office directly below."
    }'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content;

-- Counters
INSERT INTO public.counters (id, label, value, suffix, order_num) VALUES
('cnt-1', 'Global Streams', 250, 'M+', 1),
('cnt-2', 'Platinum & Gold Records', 38, '+', 2),
('cnt-3', 'Original Compositions', 140, '+', 3),
('cnt-4', 'World Tour Arenas', 24, ' Countries', 4)
ON CONFLICT (id) DO NOTHING;

-- Artists
INSERT INTO public.artists (id, name, genre, photo_url, spotify_url, order_num) VALUES
('art-1', 'Kaelen Voss', 'Neo-Classical Ambient', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop', 'https://open.spotify.com', 1),
('art-2', 'SÖLVEIG', 'Cinematic Dark Techno', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop', 'https://open.spotify.com', 2),
('art-3', 'Milo St. Claire', 'Experimental R&B / Soul', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop', 'https://open.spotify.com', 3),
('art-4', 'Aethelgard', 'Modular Synthesizer & Drone', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop', 'https://open.spotify.com', 4)
ON CONFLICT (id) DO NOTHING;

-- Managers
INSERT INTO public.managers (id, name, role, photo_url, order_num) VALUES
('mgr-1', 'Helena Sterling', 'Managing Director & Head of A&R', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop', 1),
('mgr-2', 'Marcus Vance', 'Executive Producer & Master Engineer', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=800&auto=format&fit=crop', 2)
ON CONFLICT (id) DO NOTHING;

-- Upcoming Projects
INSERT INTO public.upcoming_projects (id, title, release_date, category, cover_url, description, order_num) VALUES
('proj-1', 'ECHOES OF ETERNITY (LP)', 'Q1 2027', 'Full Studio Album', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop', 'An 11-track orchestral journey recorded live with the Prague Philharmonic Orchestra.', 1),
('proj-2', 'MONOLITH LIVE: BERLIN', 'Spring 2027', 'Concert Film & Live Album', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop', 'Exclusive audiovisual capture from Kraftwerk Berlin in 4K HDR and spatial sound.', 2),
('proj-3', 'NOCTURNE SYNDICATE', 'Summer 2027', 'Club Compilation', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop', 'Heavily anticipated underground club cuts pressed on 180g marbled vinyl.', 3)
ON CONFLICT (id) DO NOTHING;

-- Testimonials
INSERT INTO public.testimonials (id, name, role, quote, photo_url, order_num) VALUES
('test-1', 'Julian Mercer', 'Senior Music Critic, Resident Advisor', 'Velvet Noir has fundamentally altered how acoustic instruments and electronic production converse. Their catalog is an unblemished masterclass.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop', 1),
('test-2', 'Clara Beauchamp', 'Music Supervisor, HBO Max & A24', 'Whenever we need soundscapes that pierce through the screen and evoke raw emotional resonance, Velvet Noir is our first and only call.', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop', 2),
('test-3', 'Dominik Richter', 'Festival Curator, Sonar & Dekmantel', 'A rare breed of imprint that prioritizes sonic excellence above all commercial compromise. Their artists command absolute reverence.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop', 3)
ON CONFLICT (id) DO NOTHING;

-- Gallery Categories
INSERT INTO public.gallery_categories (id, name, slug, order_num) VALUES
('cat-all', 'All Works', 'all', 1),
('cat-live', 'Live Concerts', 'live', 2),
('cat-studio', 'Studio Sessions', 'studio', 3),
('cat-doc', 'Documentary Stills', 'documentary', 4),
('cat-art', 'Cover Art & Posters', 'art', 5)
ON CONFLICT (id) DO NOTHING;

-- Gallery Items
INSERT INTO public.gallery_items (id, category_id, title, media, order_num) VALUES
('gal-1', 'cat-live', 'SÖLVEIG Live at Red Rocks Amphitheatre', '{"id": "med-1", "kind": "image", "source": "upload", "url": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1400&auto=format&fit=crop", "title": "SÖLVEIG Live at Red Rocks Amphitheatre", "alt": "Concert crowd beneath dramatic stage lighting at Red Rocks", "width": 1400, "height": 933}'::jsonb, 1),
('gal-2', 'cat-studio', 'Analog Console Session, Abbey Road Studio 2', '{"id": "med-2", "kind": "image", "source": "upload", "url": "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1400&auto=format&fit=crop", "title": "Analog Console Session, Abbey Road Studio 2", "alt": "Close up of an analog SSL audio mixing desk with illuminated VU meters", "width": 1400, "height": 933}'::jsonb, 2),
('gal-3', 'cat-live', 'Kaelen Voss Piano Recital in Milan Cathedral', '{"id": "med-3", "kind": "image", "source": "upload", "url": "https://images.unsplash.com/photo-1520523839898-507124cd5371?q=80&w=1400&auto=format&fit=crop", "title": "Kaelen Voss Piano Recital in Milan Cathedral", "alt": "Grand piano illuminated in a historic stone sanctuary", "width": 1400, "height": 933}'::jsonb, 3),
('gal-4', 'cat-studio', 'Cello Tracking with Vienna Strings', '{"id": "med-4", "kind": "image", "source": "upload", "url": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1400&auto=format&fit=crop", "title": "Cello Tracking with Vienna Strings", "alt": "Acoustic cello tracking in a treated studio environment", "width": 1400, "height": 933}'::jsonb, 4),
('gal-5', 'cat-doc', 'Tape Reel Calibration for Film Score', '{"id": "med-5", "kind": "image", "source": "upload", "url": "https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=1400&auto=format&fit=crop", "title": "Tape Reel Calibration for Film Score", "alt": "Macro view of vintage magnetic tape running through a reel machine", "width": 1400, "height": 933}'::jsonb, 5)
ON CONFLICT (id) DO NOTHING;

-- Team Members
INSERT INTO public.team_members (id, name, role, bio, photo_url, order_num) VALUES
('tm-1', 'Daria Lindqvist', 'Documentary Director', 'Visionary filmmaker specializing in long-form cinematic music documentaries and spatial concert captures.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop', 1),
('tm-2', 'Julian Vance', 'Director of Photography', 'Master cinematographer specializing in 35mm anamorphic film formats and atmospheric low-light staging.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop', 2),
('tm-3', 'Amara O’Connor', 'Chief Audio Engineer', 'Emmy-winning spatial sound designer translating complex orchestral tracking sessions into pristine Dolby Atmos.', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop', 3),
('tm-4', 'Tariq Al-Mansoor', 'Lead Sound Designer', 'Pioneer in modular acoustic synthesis and immersive spatial field recordings captured across world environments.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop', 4)
ON CONFLICT (id) DO NOTHING;

-- Enquiries Sample
INSERT INTO public.enquiries (id, first_name, email, phone, message, created_at, read_at) VALUES
('enq-1', 'Seraphina', 'seraphina@paramount.com', '+1 415 555 0192', 'Interested in licensing Kaelen Voss ambient catalog for an upcoming psychological thriller feature film.', timezone('utc'::text, now()) - interval '3 days', timezone('utc'::text, now()) - interval '2 days'),
('enq-2', 'Mateo Rossi', 'mateo@sonar.es', '+34 93 123 4567', 'Submitting formal invitation for SÖLVEIG to headline Sónar Club Stage in Barcelona next June.', timezone('utc'::text, now()) - interval '1 day', NULL)
ON CONFLICT (id) DO NOTHING;


-- ==============================================================================
-- TRACKS & COLLECTIONS TABLES
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.tracks (
    id TEXT PRIMARY KEY,
    number TEXT NOT NULL DEFAULT '01',
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    album TEXT,
    duration TEXT NOT NULL DEFAULT '3:30',
    audio_url TEXT NOT NULL,
    cover_url TEXT,
    badge TEXT DEFAULT 'Master',
    badge_color TEXT DEFAULT 'bg-[#E51E2B]',
    description TEXT,
    order_num INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- Seed Tracks
INSERT INTO public.tracks (id, number, title, artist, album, duration, audio_url, cover_url, badge, badge_color, description, order_num) VALUES
('track-1', '01', 'Obsidian Horizon', 'Aethelgard', 'Velvet Noir Sessions Vol. 1', '2:48', '/audio/track-1.mp3', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop', 'Direct Master', 'bg-[#E51E2B]', 'Deep modular synth pulse merged with low-frequency sub-harmonics.', 1),
('track-2', '02', 'Aether Resonance', 'Kaelen Voss', 'Velvet Noir Sessions Vol. 1', '3:15', '/audio/track-2.mp3', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop', 'Dolby Atmos 9.1', 'bg-black', 'Lush harmonic ambient textures over subtle acoustic tape flutter.', 2),
('track-3', '03', 'Nocturne Noir', 'SÖLVEIG', 'Velvet Noir Sessions Vol. 1', '4:02', '/audio/track-3.mp3', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop', 'Analog Cut', 'bg-[#997d21]', 'Dark cinematic cello drone and hypnotic subterranean bass frequencies.', 3),
('track-4', '04', 'Analog Pulse', 'Milo St. Claire', 'Velvet Noir Sessions Vol. 1', '3:40', '/audio/track-4.mp3', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop', '45 RPM Master', 'bg-zinc-700', 'Soul-infused modular polyrhythms recorded live straight to magnetic tape.', 4)
ON CONFLICT (id) DO NOTHING;


-- ==============================================================================
-- MOVIES & FILMS TABLE
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.movies (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    youtube_url TEXT NOT NULL,
    thumbnail_url TEXT NOT NULL,
    director TEXT NOT NULL DEFAULT 'Velvet Noir Studios',
    year TEXT NOT NULL DEFAULT '2026',
    duration TEXT NOT NULL DEFAULT '1h 45m',
    genre TEXT NOT NULL DEFAULT 'Cinematic / Documentary',
    featured BOOLEAN NOT NULL DEFAULT false,
    order_num INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view movies" ON public.movies;
DROP POLICY IF EXISTS "Service role has full access to movies" ON public.movies;
CREATE POLICY "Public can view movies" ON public.movies FOR SELECT USING (true);
CREATE POLICY "Service role has full access to movies" ON public.movies FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Seed Movies
INSERT INTO public.movies (id, title, description, youtube_url, thumbnail_url, director, year, duration, genre, featured, order_num) VALUES
('mov-1', 'CHRONICLES OF RESONANCE', 'An intimate visual documentary capturing the underground recording sessions of our flagship album across abandoned brutalist cathedrals in Berlin and Reykjanes volcanic plains.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1200&auto=format&fit=crop', 'Hélène Delacroix', '2026', '1h 52m', 'Documentary Feature', true, 1),
('mov-2', 'OBSIDIAN ECHOES: LIVE AT THE ODEON', 'Captured in 4K HDR with 9.1 Dolby Atmos spatial audio, this concert film chronicles SÖLVEIG’s legendary midsummer solstice performance surrounded by 40-foot monolith video sculptures.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop', 'Marcus Sterling', '2025', '2h 10m', 'Live Concert Film', true, 2),
('mov-3', 'THE ANALOG COUPLING', 'A meditative visual essay exploring the craft of hand-cutting vinyl lacquer discs, magnetic tape bias calibration, and the sensory allure of physical analog sound in the digital age.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=1200&auto=format&fit=crop', 'Kaelen Voss', '2026', '48m', 'Cinematic Short', false, 3),
('mov-4', 'SYMPHONY OF THE VOID', 'Orchestral overture documentary filmed during the live tracking of Symphony No. 9 with the Prague Philharmonic, featuring composer diary entries and exclusive control-room footage.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=1200&auto=format&fit=crop', 'Julian Vance', '2025', '1h 35m', 'Orchestral Score', false, 4),
('mov-5', 'NEON HORIZONS: TOKYO SESSIONS', 'A midnight odyssey tracking synthesized audio design and modular synth improvisations through the neon alleys of Shinjuku and subterranean Tokyo audio listening bars.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop', 'Kenji Takahashi', '2026', '1h 18m', 'Art House / Electronic', false, 5)
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- MUSIC & AUDIO TRACKS TABLE
-- ==============================================================================

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

-- Seed Music Items
INSERT INTO public.music_items (id, title, artist, description, thumbnail_url, audio_url, duration, genre, year, spotify_url, soundcloud_url, apple_music_url, youtube_url, featured, order_num) VALUES
('mus-1', 'Obsidian Horizon', 'Aethelgard', 'Hypnotic sub-bass foundation intertwined with organic cello harmonics and modular tape synthesis.', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop', '/audio/track-1.mp3', '2:48', 'Dark Ambient / Electronic', '2026', 'https://open.spotify.com', 'https://soundcloud.com', 'https://music.apple.com', 'https://youtube.com', true, 1),
('mus-2', 'Aether Resonance', 'Kaelen Voss', 'Atmospheric acoustic flutter and delicate valve tube saturation tailored for late-night deep listening.', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop', '/audio/track-2.mp3', '3:15', 'Modular Drone / Neoclassical', '2026', 'https://open.spotify.com', 'https://soundcloud.com', 'https://music.apple.com', 'https://youtube.com', true, 2),
('mus-3', 'Nocturne Noir', 'SÖLVEIG', 'Heavy subterranean industrial pulse merged with soaring cinematic soprano vocalizations.', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop', '/audio/track-3.mp3', '4:02', 'Cinematic Electronic', '2025', 'https://open.spotify.com', 'https://soundcloud.com', 'https://music.apple.com', 'https://youtube.com', true, 3),
('mus-4', 'Analog Pulse (45 RPM Edit)', 'Milo St. Claire', 'Warm vintage Rhodes chords passed through Space Echo tape delays with dynamic acoustic percussion.', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop', '/audio/track-4.mp3', '3:40', 'Downtempo / Analog Soul', '2026', 'https://open.spotify.com', 'https://soundcloud.com', 'https://music.apple.com', 'https://youtube.com', false, 4),
('mus-5', 'Symphony No. 9: Andante Maestoso', 'Aethelgard & Prague Philharmonic', 'A monumental clash of 90-piece orchestral strings and monolithic analog synthesizer crescendo.', 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=800&auto=format&fit=crop', '/audio/acoustic-feed.mp3', '5:24', 'Orchestral / Film Score', '2025', 'https://open.spotify.com', 'https://soundcloud.com', 'https://music.apple.com', 'https://youtube.com', false, 5)
ON CONFLICT (id) DO NOTHING;

