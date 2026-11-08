import {
  Setting,
  HomePageContent,
  AboutPageContent,
  ContactPageContent,
  GalleryCategory,
  GalleryItem,
  TeamMember,
  Testimonial,
  Artist,
  Manager,
  Counter,
  UpcomingProject,
  MediaAsset,
  EnquiryRecord,
  Track,
  MovieItem,
  MusicItem,
} from "@music-label/shared";

// ==========================================
// Initial Seed Data for Music Label: "ONE ROOF ENTERTAINMENT"
// ==========================================

export const initialSettings: Setting = {
  siteName: "ONE ROOF",
  logoUrl: "/logo-icon.png",
  tagline: "Sound Beyond Horizons — Independent Entertainment & Production House",
  bookingEmail: "booking@oneroofentertainment.com",
  bookingPhone: "+1 (310) 894-2200",
  address: "8439 Sunset Blvd, West Hollywood, CA 90069",
  footerText: "Crafting iconic sonic experiences and cinematic documentaries. Defining the vanguard of electronic, orchestral, and modern soul music.",
  theme: "white",
  socialLinks: {
    instagram: "https://instagram.com/oneroofent",
    youtube: "https://youtube.com/@oneroofent",
    facebook: "https://facebook.com/oneroofent",
    spotify: "https://open.spotify.com",
    soundcloud: "https://soundcloud.com",
  },
};

export const initialCounters: Counter[] = [
  { id: "cnt-1", label: "Global Streams", value: 250, suffix: "M+", order: 1 },
  { id: "cnt-2", label: "Platinum & Gold Records", value: 38, suffix: "+", order: 2 },
  { id: "cnt-3", label: "Original Compositions", value: 140, suffix: "+", order: 3 },
  { id: "cnt-4", label: "World Tour Arenas", value: 24, suffix: " Countries", order: 4 },
];

export const initialHomeContent: HomePageContent = {
  hero: {
    headline: "WHERE SOUND MEETS CINEMA",
    subheadline: "SONIC IMMERSION & ELEVATED ARTISTRY",
    tagline: "An avant-garde collective of boundary-defying producers, cinematic composers, and visionary artists.",
    introText: "One Roof Entertainment transcends standard label boundaries. We engineer sonic landscapes that move dancefloors, score blockbuster cinematic features, and echo across global festivals.",
    featuredVideoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Embed preview
    ctaPrimaryText: "Explore Roster",
    ctaSecondaryText: "Watch Showreel",
  },
  aboutTeaser: {
    heading: "SCULPTING MODERN SOUNDSCAPES",
    bio: "Founded on the belief that music should be a visceral encounter, One Roof Entertainment produces rare, timeless records. From analog modular synthesizers to 80-piece philharmonic sessions, our catalog redefines modern auditory luxury.",
    imageUrl: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200&auto=format&fit=crop",
    buttonText: "Discover Our Story",
  },
};

export const initialAboutContent: AboutPageContent = {
  artistName: "ONE ROOF COLLECTIVE",
  headline: "UNCOMPROMISING VISION, ARCHIVAL QUALITY",
  fullBio: "Established in 2018 in Los Angeles and Berlin, One Roof Entertainment began as a clandestine recording sanctuary for multi-instrumentalists refusing the assembly-line sound of mainstream radio. Today, we stand as an independent global powerhouse, bridging electronic subterranean rhythms with grand orchestral cinema. Every release is masterfully crafted in Dolby Atmos, pressed on audiophile-grade heavyweight vinyl, and accompanied by bespoke visual documentaries.",
  mission: "To champion artists who reshape the cultural dialogue through acoustic purity, boundary-pushing production, and unapologetic artistic freedom.",
  collageImages: [
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000&auto=format&fit=crop",
  ],
};

export const initialContactContent: ContactPageContent = {
  headline: "INITIATE COLLABORATION",
  subheadline: "BOOKINGS, SYNC LICENSING & PRESS ENQUIRIES",
  instructions: "For festival bookings, orchestral commission requests, soundtrack licensing, or general media enquiries, connect with our management office directly below.",
};

// ==========================================
// Centralized Tracks (Copyright-free Local WAV audio samples)
// ==========================================
export const initialTracks: Track[] = [
  {
    id: "track-1",
    number: "01",
    title: "Obsidian Horizon",
    artist: "Aethelgard",
    album: "One Roof Sessions Vol. 1",
    duration: "2:48",
    audioUrl: "/audio/track-.mp3",
    coverUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
    badge: "Direct Master",
    badgeColor: "bg-[#E51E2B]",
    description: "Deep modular synth pulse merged with low-frequency sub-harmonics.",
    order: 1,
  },
  {
    id: "track-2",
    number: "02",
    title: "Aether Resonance",
    artist: "Kaelen Voss",
    album: "One Roof Sessions Vol. 1",
    duration: "3:15",
    audioUrl: "/audio/track-.mp3",
    coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop",
    badge: "Dolby Atmos 9.1",
    badgeColor: "bg-black",
    description: "Lush harmonic ambient textures over subtle acoustic tape flutter.",
    order: 2,
  },
  {
    id: "track-3",
    number: "03",
    title: "Nocturne Noir",
    artist: "SÖLVEIG",
    album: "One Roof Sessions Vol. 1",
    duration: "4:02",
    audioUrl: "/audio/track-.mp3",
    coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop",
    badge: "Analog Cut",
    badgeColor: "bg-[#997d21]",
    description: "Dark cinematic cello drone and hypnotic subterranean bass frequencies.",
    order: 3,
  },
  {
    id: "track-4",
    number: "04",
    title: "Analog Pulse",
    artist: "Milo St. Claire",
    album: "One Roof Sessions Vol. 1",
    duration: "3:40",
    audioUrl: "/audio/track-.mp3",
    coverUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop",
    badge: "45 RPM Master",
    badgeColor: "bg-zinc-700",
    description: "Soul-infused modular polyrhythms recorded live straight to magnetic tape.",
    order: 4,
  },
];

export const initialArtists: Artist[] = [
  {
    id: "art-1",
    name: "Kaelen Voss",
    genre: "Neo-Classical Ambient",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
    spotifyUrl: "https://open.spotify.com",
    audioUrl: "/audio/track-.mp3",
    featuredTrackTitle: "Aether Resonance",
    order: 1,
  },
  {
    id: "art-2",
    name: "SÖLVEIG",
    genre: "Cinematic Dark Techno",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
    spotifyUrl: "https://open.spotify.com",
    audioUrl: "/audio/track-.mp3",
    featuredTrackTitle: "Nocturne Noir",
    order: 2,
  },
  {
    id: "art-3",
    name: "Milo St. Claire",
    genre: "Experimental R&B / Soul",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop",
    spotifyUrl: "https://open.spotify.com",
    audioUrl: "/audio/track-.mp3",
    featuredTrackTitle: "Analog Pulse",
    order: 3,
  },
  {
    id: "art-4",
    name: "Aethelgard",
    genre: "Modular Synthesizer & Drone",
    photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop",
    spotifyUrl: "https://open.spotify.com",
    audioUrl: "/audio/track-.mp3",
    featuredTrackTitle: "Obsidian Horizon",
    order: 4,
  },
];

export const initialManagers: Manager[] = [
  {
    id: "mgr-1",
    name: "Helena Sterling",
    role: "Managing Director & Head of A&R",
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop",
    order: 1,
  },
  {
    id: "mgr-2",
    name: "Marcus Vance",
    role: "Executive Producer & Master Engineer",
    photoUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=800&auto=format&fit=crop",
    order: 2,
  },
];

export const initialUpcomingProjects: UpcomingProject[] = [
  {
    id: "proj-1",
    title: "ECHOES OF ETERNITY (LP)",
    releaseDate: "Q1 2027",
    category: "Full Studio Album",
    coverUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
    description: "An 11-track orchestral journey recorded live with the Prague Philharmonic Orchestra.",
    order: 1,
  },
  {
    id: "proj-2",
    title: "MONOLITH LIVE: BERLIN",
    releaseDate: "Spring 2027",
    category: "Concert Film & Live Album",
    coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop",
    description: "Exclusive audiovisual capture from Kraftwerk Berlin in 4K HDR and spatial sound.",
    order: 2,
  },
  {
    id: "proj-3",
    title: "NOCTURNE SYNDICATE",
    releaseDate: "Summer 2027",
    category: "Club Compilation",
    coverUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop",
    description: "Heavily anticipated underground club cuts pressed on 180g marbled vinyl.",
    order: 3,
  },
];



export const initialTestimonials: Testimonial[] = [
  {
    id: "test-1",
    name: "Julian Mercer",
    role: "Senior Music Critic, Resident Advisor",
    quote: "One Roof Entertainment has fundamentally altered how acoustic instruments and electronic production converse. Their catalog is an unblemished masterclass.",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    order: 1,
  },
  {
    id: "test-2",
    name: "Clara Beauchamp",
    role: "Music Supervisor, HBO Max & A24",
    quote: "Whenever we need soundscapes that pierce through the screen and evoke raw emotional resonance, One Roof is our first and only call.",
    photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop",
    order: 2,
  },
  {
    id: "test-3",
    name: "Dominik Richter",
    role: "Festival Curator, Sonar & Dekmantel",
    quote: "A rare breed of imprint that prioritizes sonic excellence above all commercial compromise. Their artists command absolute reverence.",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    order: 3,
  },
];

export const initialGalleryCategories: GalleryCategory[] = [
  { id: "cat-all", name: "All Works", slug: "all", order: 1 },
  { id: "cat-live", name: "Live Concerts", slug: "live", order: 2 },
  { id: "cat-studio", name: "Studio Sessions", slug: "studio", order: 3 },
  { id: "cat-doc", name: "Documentary Stills", slug: "documentary", order: 4 },
  { id: "cat-art", name: "Cover Art & Posters", slug: "art", order: 5 },
];

export const initialGalleryItems: GalleryItem[] = [
  {
    id: "gal-1",
    categoryId: "cat-live",
    title: "SÖLVEIG Live at Red Rocks Amphitheatre",
    order: 1,
    media: {
      id: "med-1",
      kind: "image",
      source: "upload",
      url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1400&auto=format&fit=crop",
      title: "SÖLVEIG Live at Red Rocks Amphitheatre",
      alt: "Concert crowd beneath dramatic stage lighting at Red Rocks",
      width: 1400,
      height: 933,
    },
  },
  {
    id: "gal-2",
    categoryId: "cat-studio",
    title: "Analog Console Session, Abbey Road Studio 2",
    order: 2,
    media: {
      id: "med-2",
      kind: "image",
      source: "upload",
      url: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1400&auto=format&fit=crop",
      title: "Analog Console Session, Abbey Road Studio 2",
      alt: "Close up of an analog SSL audio mixing desk with illuminated VU meters",
      width: 1400,
      height: 933,
    },
  },
  {
    id: "gal-3",
    categoryId: "cat-live",
    title: "Kaelen Voss Piano Recital in Milan Cathedral",
    order: 3,
    media: {
      id: "med-3",
      kind: "image",
      source: "upload",
      url: "https://images.unsplash.com/photo-1520523839898-507124cd5371?q=80&w=1400&auto=format&fit=crop",
      title: "Kaelen Voss Piano Recital in Milan Cathedral",
      alt: "Grand piano illuminated in a historic stone sanctuary",
      width: 1400,
      height: 933,
    },
  },
  {
    id: "gal-4",
    categoryId: "cat-studio",
    title: "Cello Tracking with Vienna Strings",
    order: 4,
    media: {
      id: "med-4",
      kind: "image",
      source: "upload",
      url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1400&auto=format&fit=crop",
      title: "Cello Tracking with Vienna Strings",
      alt: "Musician playing cello in an acoustically treated recording studio",
      width: 1400,
      height: 933,
    },
  },
  {
    id: "gal-5",
    categoryId: "cat-doc",
    title: "Documentary Shoot on Location in Reykjavik",
    order: 5,
    media: {
      id: "med-5",
      kind: "image",
      source: "upload",
      url: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1400&auto=format&fit=crop",
      title: "Documentary Shoot on Location in Reykjavik",
      alt: "Cinematographer setting up cinema camera in volcanic landscape",
      width: 1400,
      height: 933,
    },
  },
  {
    id: "gal-6",
    categoryId: "cat-art",
    title: "Monolith Vinyl Gatefold Lithograph",
    order: 6,
    media: {
      id: "med-6",
      kind: "image",
      source: "upload",
      url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1400&auto=format&fit=crop",
      title: "Monolith Vinyl Gatefold Lithograph",
      alt: "Abstract gold and charcoal artwork for vinyl record jacket",
      width: 1400,
      height: 933,
    },
  },
  {
    id: "gal-7",
    categoryId: "cat-live",
    title: "Modular Synthesizer Wall at Kraftwerk Berlin",
    order: 7,
    media: {
      id: "med-7",
      kind: "image",
      source: "upload",
      url: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1400&auto=format&fit=crop",
      title: "Modular Synthesizer Wall at Kraftwerk Berlin",
      alt: "Intricate eurorack modular synthesizer setup with glowing LEDs",
      width: 1400,
      height: 933,
    },
  },
  {
    id: "gal-8",
    categoryId: "cat-doc",
    title: "Behind the Glass with the Orchestra",
    order: 8,
    media: {
      id: "med-8",
      kind: "image",
      source: "upload",
      url: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=1400&auto=format&fit=crop",
      title: "Behind the Glass with the Orchestra",
      alt: "Conductor leading orchestra in recording hall through control room window",
      width: 1400,
      height: 933,
    },
  },
];

// Production Team for Documentary Page (10 core required roles)
export const initialTeamMembers: TeamMember[] = [
  {
    id: "tm-1",
    name: "Julian Alexander",
    role: "Director",
    bio: "BAFTA-nominated filmmaker known for intimate music documentaries capturing the raw collision between creator, instrument, and acoustic space.",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop",
    order: 1,
  },
  {
    id: "tm-2",
    name: "Elena Rostova",
    role: "Music Director",
    bio: "Pianist and conductor who bridged classical repertoire with contemporary electronic composition for high-profile feature films.",
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop",
    order: 2,
  },
  {
    id: "tm-3",
    name: "Nico van Dijk",
    role: "Project Manager",
    bio: "Oversees global production logistics across 14 international shoots, ensuring cinematic delivery on schedule and under strict creative vision.",
    photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=600&auto=format&fit=crop",
    order: 3,
  },
  {
    id: "tm-4",
    name: "Tariq Mansoor",
    role: "Cinematographer",
    bio: "Specialist in low-light anamorphic photography and high-contrast film aesthetics that frame our artists in rich chiaroscuro shadows.",
    photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop",
    order: 4,
  },
  {
    id: "tm-5",
    name: "Chloe Mercier",
    role: "Videographer",
    bio: "Documentary verité camera operator embedded on tour buses, green rooms, and clandestine studio late nights worldwide.",
    photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop",
    order: 5,
  },
  {
    id: "tm-6",
    name: "David Lindqvist",
    role: "Editor",
    bio: "Master rhythmic cutter who constructs narrative pacing synchronized with musical cadence and micro-tonal dynamics.",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
    order: 6,
  },
  {
    id: "tm-7",
    name: "Aria Thorne",
    role: "Digital Artist",
    bio: "Creates mesmerizing visual audio reactives, 3D laser scans, and generative surrealist environments for live tours.",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
    order: 7,
  },
  {
    id: "tm-8",
    name: "Liam O'Connor",
    role: "Motion Designer",
    bio: "Crafts typographical title sequences, cinematic kinetic credits, and festival projection mapping graphics.",
    photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop",
    order: 8,
  },
  {
    id: "tm-9",
    name: "Victoria Chen",
    role: "Legal Advisor",
    bio: "Specializes in entertainment rights, sync clearances, global intellectual property, and archival licensing agreements.",
    photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop",
    order: 9,
  },
  {
    id: "tm-10",
    name: "Kasper Holm",
    role: "Poster Designer",
    bio: "Award-winning graphic artist renowned for limited-edition screen-printed gig posters, LP gatefolds, and typographic film one-sheets.",
    photoUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=600&auto=format&fit=crop",
    order: 10,
  },
];

export const initialEnquiries: EnquiryRecord[] = [
  {
    id: "enq-1",
    firstName: "Seraphina",
    email: "seraphina@paramount.com",
    phone: "+1 415 555 0192",
    message: "Interested in licensing Kaelen Voss's ambient catalog for an upcoming psychological thriller feature film.",
    createdAt: "2026-10-12T14:32:00Z",
    readAt: "2026-10-13T09:15:00Z",
  },
  {
    id: "enq-2",
    firstName: "Mateo Rossi",
    email: "mateo@sonar.es",
    phone: "+34 93 123 4567",
    message: "Submitting formal invitation for SÖLVEIG to headline Sónar Club Stage in Barcelona next June.",
    createdAt: "2026-10-14T08:20:00Z",
    readAt: null,
  },
];

export const initialMovies: MovieItem[] = [
  {
    id: "mov-1",
    title: "CHRONICLES OF RESONANCE",
    description: "An intimate visual documentary capturing the underground recording sessions of our flagship album across abandoned brutalist cathedrals in Berlin and Reykjanes volcanic plains.",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnailUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1200&auto=format&fit=crop",
    director: "Hélène Delacroix",
    year: "2026",
    duration: "1h 52m",
    featured: true,
    order: 1,
    createdAt: "2026-01-15T00:00:00Z",
  },
  {
    id: "mov-2",
    title: "OBSIDIAN ECHOES: LIVE AT THE ODEON",
    description: "Captured in 4K HDR with 9.1 Dolby Atmos spatial audio, this concert film chronicles SÖLVEIG’s legendary midsummer solstice performance surrounded by 40-foot monolith video sculptures.",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnailUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop",
    director: "Marcus Sterling",
    year: "2025",
    duration: "2h 10m",
    featured: true,
    order: 2,
    createdAt: "2026-02-10T00:00:00Z",
  },
  {
    id: "mov-3",
    title: "THE ANALOG COUPLING",
    description: "A meditative visual essay exploring the craft of hand-cutting vinyl lacquer discs, magnetic tape bias calibration, and the sensory allure of physical analog sound in the digital age.",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnailUrl: "https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=1200&auto=format&fit=crop",
    director: "Kaelen Voss",
    year: "2026",
    duration: "48m",
    featured: false,
    order: 3,
    createdAt: "2026-03-05T00:00:00Z",
  },
  {
    id: "mov-4",
    title: "SYMPHONY OF THE VOID",
    description: "Orchestral overture documentary filmed during the live tracking of Symphony No. 9 with the Prague Philharmonic, featuring composer diary entries and exclusive control-room footage.",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnailUrl: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=1200&auto=format&fit=crop",
    director: "Julian Vance",
    year: "2025",
    duration: "1h 35m",
    featured: false,
    order: 4,
    createdAt: "2026-03-20T00:00:00Z",
  },
  {
    id: "mov-5",
    title: "NEON HORIZONS: TOKYO SESSIONS",
    description: "A midnight odyssey tracking synthesized audio design and modular synth improvisations through the neon alleys of Shinjuku and subterranean Tokyo audio listening bars.",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnailUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop",
    director: "Kenji Takahashi",
    year: "2026",
    duration: "1h 18m",
    featured: false,
    order: 5,
    createdAt: "2026-04-02T00:00:00Z",
  },
];

export const initialMusicItems: MusicItem[] = [
  {
    id: "mus-1",
    title: "Obsidian Horizon",
    artist: "Aethelgard",
    description: "Hypnotic sub-bass foundation intertwined with organic cello harmonics and modular tape synthesis.",
    thumbnailUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
    audioUrl: "/audio/track-1.mp3",
    duration: "2:48",
    genre: "Dark Ambient / Electronic",
    year: "2026",
    spotifyUrl: "https://open.spotify.com",
    soundcloudUrl: "https://soundcloud.com",
    appleMusicUrl: "https://music.apple.com",
    youtubeUrl: "https://youtube.com",
    featured: true,
    order: 1,
    createdAt: "2026-01-10T00:00:00Z",
  },
  {
    id: "mus-2",
    title: "Aether Resonance",
    artist: "Kaelen Voss",
    description: "Atmospheric acoustic flutter and delicate valve tube saturation tailored for late-night deep listening.",
    thumbnailUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop",
    audioUrl: "/audio/track-2.mp3",
    duration: "3:15",
    genre: "Modular Drone / Neoclassical",
    year: "2026",
    spotifyUrl: "https://open.spotify.com",
    soundcloudUrl: "https://soundcloud.com",
    appleMusicUrl: "https://music.apple.com",
    youtubeUrl: "https://youtube.com",
    featured: true,
    order: 2,
    createdAt: "2026-01-22T00:00:00Z",
  },
  {
    id: "mus-3",
    title: "Nocturne Noir",
    artist: "SÖLVEIG",
    description: "Heavy subterranean industrial pulse merged with soaring cinematic soprano vocalizations.",
    thumbnailUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop",
    audioUrl: "/audio/track-3.mp3",
    duration: "4:02",
    genre: "Cinematic Electronic",
    year: "2025",
    spotifyUrl: "https://open.spotify.com",
    soundcloudUrl: "https://soundcloud.com",
    appleMusicUrl: "https://music.apple.com",
    youtubeUrl: "https://youtube.com",
    featured: true,
    order: 3,
    createdAt: "2026-02-05T00:00:00Z",
  },
  {
    id: "mus-4",
    title: "Analog Pulse (45 RPM Edit)",
    artist: "Milo St. Claire",
    description: "Warm vintage Rhodes chords passed through Space Echo tape delays with dynamic acoustic percussion.",
    thumbnailUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop",
    audioUrl: "/audio/track-4.mp3",
    duration: "3:40",
    genre: "Downtempo / Analog Soul",
    year: "2026",
    spotifyUrl: "https://open.spotify.com",
    soundcloudUrl: "https://soundcloud.com",
    appleMusicUrl: "https://music.apple.com",
    youtubeUrl: "https://youtube.com",
    featured: false,
    order: 4,
    createdAt: "2026-02-18T00:00:00Z",
  },
  {
    id: "mus-5",
    title: "Symphony No. 9: Andante Maestoso",
    artist: "Aethelgard & Prague Philharmonic",
    description: "A monumental clash of 90-piece orchestral strings and monolithic analog synthesizer crescendo.",
    thumbnailUrl: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=800&auto=format&fit=crop",
    audioUrl: "/audio/acoustic-feed.mp3",
    duration: "5:24",
    genre: "Orchestral / Film Score",
    year: "2025",
    spotifyUrl: "https://open.spotify.com",
    soundcloudUrl: "https://soundcloud.com",
    appleMusicUrl: "https://music.apple.com",
    youtubeUrl: "https://youtube.com",
    featured: false,
    order: 5,
    createdAt: "2026-03-01T00:00:00Z",
  },
];

// Single in-memory mock store
class MockDatabase {
  settings: Setting = { ...initialSettings };
  counters: Counter[] = [...initialCounters];
  homeContent: HomePageContent = { ...initialHomeContent };
  aboutContent: AboutPageContent = { ...initialAboutContent };
  contactContent: ContactPageContent = { ...initialContactContent };
  tracks: Track[] = [...initialTracks];
  artists: Artist[] = [...initialArtists];
  managers: Manager[] = [...initialManagers];
  upcomingProjects: UpcomingProject[] = [...initialUpcomingProjects];
  testimonials: Testimonial[] = [...initialTestimonials];
  galleryCategories: GalleryCategory[] = [...initialGalleryCategories];
  galleryItems: GalleryItem[] = [...initialGalleryItems];
  teamMembers: TeamMember[] = [...initialTeamMembers];
  enquiries: EnquiryRecord[] = [...initialEnquiries];
  movies: MovieItem[] = [...initialMovies];
  musicItems: MusicItem[] = [...initialMusicItems];
}

declare global {
  var __mockDb: MockDatabase | undefined;
}

export const db: MockDatabase = global.__mockDb ?? new MockDatabase();
if (!db.settings.theme) {
  db.settings.theme = "white";
}
if (!db.movies) {
  db.movies = [...initialMovies];
}
if (!db.musicItems) {
  db.musicItems = [...initialMusicItems];
}
global.__mockDb = db;

