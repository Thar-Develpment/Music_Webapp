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
  CollectionItem,
} from "@music-label/shared";

// ==========================================
// Initial Seed Data for Music Label: "VELVET NOIR RECORDINGS"
// ==========================================

export const initialSettings: Setting = {
  siteName: "VELVET NOIR",
  logoUrl: "/images/logo.svg",
  tagline: "Sound Beyond Horizons — Independent Luxury Record Label & Production House",
  bookingEmail: "booking@velvetnoir.com",
  bookingPhone: "+1 (310) 894-2200",
  address: "8439 Sunset Blvd, West Hollywood, CA 90069",
  footerText: "Crafting iconic sonic experiences and cinematic documentaries. Defining the vanguard of electronic, orchestral, and modern soul music.",
  theme: "white",
  socialLinks: {
    instagram: "https://instagram.com/velvetnoirrec",
    youtube: "https://youtube.com/@velvetnoirrec",
    facebook: "https://facebook.com/velvetnoirrec",
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
    introText: "Velvet Noir transcends standard label boundaries. We engineer sonic landscapes that move dancefloors, score blockbuster cinematic features, and echo across global festivals.",
    featuredVideoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Embed preview
    ctaPrimaryText: "Explore Roster",
    ctaSecondaryText: "Watch Showreel",
  },
  aboutTeaser: {
    heading: "SCULPTING MODERN SOUNDSCAPES",
    bio: "Founded on the belief that music should be a visceral encounter, Velvet Noir produces rare, timeless records. From analog modular synthesizers to 80-piece philharmonic sessions, our catalog redefines modern auditory luxury.",
    imageUrl: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200&auto=format&fit=crop",
    buttonText: "Discover Our Story",
  },
};

export const initialAboutContent: AboutPageContent = {
  artistName: "VELVET NOIR COLLECTIVE",
  headline: "UNCOMPROMISING VISION, ARCHIVAL QUALITY",
  fullBio: "Established in 2018 in Los Angeles and Berlin, Velvet Noir began as a clandestine recording sanctuary for multi-instrumentalists refusing the assembly-line sound of mainstream radio. Today, we stand as an independent global powerhouse, bridging electronic subterranean rhythms with grand orchestral cinema. Every release is masterfully crafted in Dolby Atmos, pressed on audiophile-grade heavyweight vinyl, and accompanied by bespoke visual documentaries.",
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
    album: "Velvet Noir Sessions Vol. 1",
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
    album: "Velvet Noir Sessions Vol. 1",
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
    album: "Velvet Noir Sessions Vol. 1",
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
    album: "Velvet Noir Sessions Vol. 1",
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

// ==========================================
// Collections Seed Data (Our Collections Catalog)
// ==========================================
export const initialCollections: CollectionItem[] = [
  {
    id: "col-1",
    title: "VELVET NOIR SESSIONS VOL. 1",
    subtitle: "Direct Metal Master • 180g Crimson Marbled Vinyl",
    artist: "Velvet Noir Collective",
    year: "2026",
    format: "180g Audiophile Double Vinyl (45 RPM)",
    catalogNumber: "VN-LP-001",
    coverUrl: "https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=1200&auto=format&fit=crop",
    vinylColor: "#E51E2B",
    description: "Our signature flagship compilation pressed directly from 1/2-inch analogue master tapes at Abbey Road Studios. Features high-dynamic uncompressed mastering with bespoke gatefold lithographs.",
    tracks: initialTracks,
    badge: "Flagship Master",
    order: 1,
  },
  {
    id: "col-2",
    title: "SYMPHONY NO. 9 IN D MINOR",
    subtitle: "Recorded Live at Rudolfinum Hall",
    artist: "Aethelgard & Prague Philharmonic",
    year: "2025",
    format: "Tri-fold 200g Virgin Vinyl + 4K Blu-ray",
    catalogNumber: "VN-LP-002",
    coverUrl: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=1200&auto=format&fit=crop",
    vinylColor: "#D4AF37",
    description: "An unearthly intersection of modular electronic synthesis and a 90-piece orchestra. Captured via 32-channel discrete DSD microphones.",
    tracks: [initialTracks[0], initialTracks[1]],
    badge: "Audiophile Gold",
    order: 2,
  },
  {
    id: "col-3",
    title: "KRAFTWERK BERLIN: TURBINE SESSIONS",
    subtitle: "Industrial Concrete Acoustics • Limited 500 Copies",
    artist: "SÖLVEIG",
    year: "2026",
    format: "Smoked Obsidian Heavyweight Vinyl",
    catalogNumber: "VN-LP-003",
    coverUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop",
    vinylColor: "#222226",
    description: "Recorded within the immense concrete chambers of the Kraftwerk power plant in Berlin. Subterranean sub-bass resonance and spatial delay tapestries.",
    tracks: [initialTracks[2], initialTracks[3]],
    badge: "Limited Edition",
    order: 3,
  },
  {
    id: "col-4",
    title: "ELYSIAN DRIFT",
    subtitle: "Ambient Tape Loops & Analog Echo",
    artist: "Kaelen Voss & Milo St. Claire",
    year: "2025",
    format: "Clear Amber Vinyl (33 1/3 RPM)",
    catalogNumber: "VN-LP-004",
    coverUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1200&auto=format&fit=crop",
    vinylColor: "#D97706",
    description: "Intimate late-night tape loop explorations and acoustic Rhodes piano passed through custom valve tube preamplifiers.",
    tracks: [initialTracks[1], initialTracks[3]],
    badge: "Pure Analogue",
    order: 4,
  },
];

export const initialTestimonials: Testimonial[] = [
  {
    id: "test-1",
    name: "Julian Mercer",
    role: "Senior Music Critic, Resident Advisor",
    quote: "Velvet Noir has fundamentally altered how acoustic instruments and electronic production converse. Their catalog is an unblemished masterclass.",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    order: 1,
  },
  {
    id: "test-2",
    name: "Clara Beauchamp",
    role: "Music Supervisor, HBO Max & A24",
    quote: "Whenever we need soundscapes that pierce through the screen and evoke raw emotional resonance, Velvet Noir is our first and only call.",
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

// Single in-memory mock store
class MockDatabase {
  settings: Setting = { ...initialSettings };
  counters: Counter[] = [...initialCounters];
  homeContent: HomePageContent = { ...initialHomeContent };
  aboutContent: AboutPageContent = { ...initialAboutContent };
  contactContent: ContactPageContent = { ...initialContactContent };
  tracks: Track[] = [...initialTracks];
  collections: CollectionItem[] = [...initialCollections];
  artists: Artist[] = [...initialArtists];
  managers: Manager[] = [...initialManagers];
  upcomingProjects: UpcomingProject[] = [...initialUpcomingProjects];
  testimonials: Testimonial[] = [...initialTestimonials];
  galleryCategories: GalleryCategory[] = [...initialGalleryCategories];
  galleryItems: GalleryItem[] = [...initialGalleryItems];
  teamMembers: TeamMember[] = [...initialTeamMembers];
  enquiries: EnquiryRecord[] = [...initialEnquiries];
}

declare global {
  var __mockDb: MockDatabase | undefined;
}

export const db: MockDatabase = global.__mockDb ?? new MockDatabase();
if (!db.settings.theme) {
  db.settings.theme = "white";
}
if (process.env.NODE_ENV !== "production") {
  global.__mockDb = db;
}
