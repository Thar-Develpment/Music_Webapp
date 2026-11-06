import { z } from "zod";

// ==========================================
// 1. Settings & General Types
// ==========================================
export const SocialLinksSchema = z.object({
  instagram: z.string().url().or(z.literal("")),
  youtube: z.string().url().or(z.literal("")),
  facebook: z.string().url().or(z.literal("")),
  spotify: z.string().url().or(z.literal("")),
  soundcloud: z.string().url().or(z.literal("")),
});
export type SocialLinks = z.infer<typeof SocialLinksSchema>;

export const SiteThemeSchema = z.enum(["black", "white"]);
export type SiteTheme = z.infer<typeof SiteThemeSchema>;

export const SettingSchema = z.object({
  siteName: z.string().min(1, "Site name is required"),
  logoUrl: z.string().min(1, "Logo URL is required"),
  tagline: z.string(),
  bookingEmail: z.string().email("Invalid booking email"),
  bookingPhone: z.string().min(1, "Booking phone is required"),
  address: z.string().optional(),
  footerText: z.string(),
  theme: SiteThemeSchema.default("white"),
  socialLinks: SocialLinksSchema,
});
export type Setting = z.infer<typeof SettingSchema>;

// ==========================================
// 2. Media Asset Schema
// ==========================================
export const MediaAssetSchema = z.object({
  id: z.string(),
  kind: z.enum(["image", "video"]),
  source: z.enum(["upload", "url"]),
  url: z.string().url("Valid URL is required"),
  title: z.string().min(1, "Title is required"),
  alt: z.string().min(1, "Alt text is required"),
  provider: z.enum(["youtube", "vimeo", "direct"]).optional(),
  externalId: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  bytes: z.number().optional(),
  createdAt: z.string().optional(),
});
export type MediaAsset = z.infer<typeof MediaAssetSchema>;

// ==========================================
// 3. Counter Schema
// ==========================================
export const CounterSchema = z.object({
  id: z.string(),
  label: z.string().min(1, "Label is required"),
  value: z.number().min(0),
  suffix: z.string().default("+"),
  order: z.number().default(0),
});
export type Counter = z.infer<typeof CounterSchema>;

// ==========================================
// 4. Artist & Team & Testimonial Schemas
// ==========================================
export const ArtistSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Artist name is required"),
  genre: z.string().min(1, "Genre is required"),
  photoUrl: z.string().min(1, "Photo URL is required"),
  order: z.number().default(0),
  spotifyUrl: z.string().url().optional().or(z.literal("")),
  audioUrl: z.string().optional(),
  featuredTrackTitle: z.string().optional(),
});
export type Artist = z.infer<typeof ArtistSchema>;

export const ManagerSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Manager name is required"),
  role: z.string().min(1, "Role is required"),
  photoUrl: z.string().min(1, "Photo URL is required"),
  order: z.number().default(0),
});
export type Manager = z.infer<typeof ManagerSchema>;

export const TestimonialSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role/Publication is required"),
  quote: z.string().min(5, "Quote is too short"),
  photoUrl: z.string().min(1, "Photo URL is required"),
  order: z.number().default(0),
});
export type Testimonial = z.infer<typeof TestimonialSchema>;

export const TeamMemberSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  photoUrl: z.string().min(1, "Photo URL is required"),
  order: z.number().default(0),
});
export type TeamMember = z.infer<typeof TeamMemberSchema>;

// ==========================================
// 5. Gallery Schemas
// ==========================================
export const GalleryCategorySchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Category name is required"),
  slug: z.string().min(1, "Slug is required"),
  order: z.number().default(0),
});
export type GalleryCategory = z.infer<typeof GalleryCategorySchema>;

export const GalleryItemSchema = z.object({
  id: z.string(),
  categoryId: z.string().min(1, "Category ID is required"),
  title: z.string().min(1, "Title is required"),
  media: MediaAssetSchema,
  order: z.number().default(0),
});
export type GalleryItem = z.infer<typeof GalleryItemSchema>;

// ==========================================
// 6. Upcoming Projects Schema
// ==========================================
export const UpcomingProjectSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  releaseDate: z.string().min(1, "Release date or Quarter is required"),
  category: z.string().min(1, "Category is required"),
  coverUrl: z.string().min(1, "Cover URL is required"),
  description: z.string(),
  order: z.number().default(0),
});
export type UpcomingProject = z.infer<typeof UpcomingProjectSchema>;

// ==========================================
// 7. Page Content Schemas
// ==========================================
export const HomePageContentSchema = z.object({
  hero: z.object({
    headline: z.string().min(1),
    subheadline: z.string(),
    tagline: z.string(),
    introText: z.string(),
    featuredVideoUrl: z.string().url("Valid video URL required"),
    ctaPrimaryText: z.string().default("Explore Roster"),
    ctaSecondaryText: z.string().default("Watch Showreel"),
  }),
  aboutTeaser: z.object({
    heading: z.string(),
    bio: z.string(),
    imageUrl: z.string(),
    buttonText: z.string().default("Learn More"),
  }),
});
export type HomePageContent = z.infer<typeof HomePageContentSchema>;

export const AboutPageContentSchema = z.object({
  artistName: z.string().min(1),
  headline: z.string(),
  fullBio: z.string(),
  mission: z.string(),
  collageImages: z.array(z.string()).min(1),
});
export type AboutPageContent = z.infer<typeof AboutPageContentSchema>;

export const ContactPageContentSchema = z.object({
  headline: z.string(),
  subheadline: z.string(),
  instructions: z.string(),
});
export type ContactPageContent = z.infer<typeof ContactPageContentSchema>;

// ==========================================
// 8. Enquiries Schema (Contact Form)
// ==========================================
export const EnquirySubmissionSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(60, "First name too long"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(5, "Valid phone number is required").max(25, "Phone number too long"),
  message: z.string().min(5, "Message must be at least 5 characters").max(180, "Message cannot exceed 180 characters"),
});
export type EnquirySubmission = z.infer<typeof EnquirySubmissionSchema>;
export const contactFormSchema = EnquirySubmissionSchema;
export type ContactFormData = EnquirySubmission;

export const EnquiryRecordSchema = EnquirySubmissionSchema.extend({
  id: z.string(),
  createdAt: z.string(),
  readAt: z.string().nullable().optional(),
});
export type EnquiryRecord = z.infer<typeof EnquiryRecordSchema>;

// ==========================================
// 9. Standard API Response Wrapper
// ==========================================
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ==========================================
// 10. Tracks & Collections Schemas
// ==========================================
export const TrackSchema = z.object({
  id: z.string(),
  number: z.string().default("01"),
  title: z.string().min(1, "Track title is required"),
  artist: z.string().min(1, "Artist name is required"),
  album: z.string().optional(),
  duration: z.string(),
  audioUrl: z.string(),
  coverUrl: z.string().optional(),
  badge: z.string().default("Master"),
  badgeColor: z.string().optional(),
  description: z.string().optional(),
  order: z.number().default(0),
});
export type Track = z.infer<typeof TrackSchema>;


// ==========================================
// 11. Movie & Film Schemas
// ==========================================
export const MovieItemSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Movie title is required"),
  description: z.string().min(1, "Movie description is required"),
  youtubeUrl: z.string().min(1, "YouTube URL or Video ID is required"),
  thumbnailUrl: z.string().min(1, "Thumbnail image URL is required"),
  director: z.string().default("One Roof Studios"),
  year: z.string().default("2026"),
  duration: z.string().default("1h 45m"),
  genre: z.string().default("Cinematic / Documentary"),
  featured: z.boolean().default(false),
  order: z.number().default(0),
  createdAt: z.string().optional(),
});
export type MovieItem = z.infer<typeof MovieItemSchema>;

export const MovieItemInputSchema = MovieItemSchema.omit({ id: true, createdAt: true });
export type MovieItemInput = z.infer<typeof MovieItemInputSchema>;

// ==========================================
// 12. Music & Audio Track Schemas
// ==========================================
export const MusicItemSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Music title is required"),
  artist: z.string().min(1, "Artist name is required"),
  description: z.string().min(1, "Music description is required"),
  thumbnailUrl: z.string().min(1, "Cover artwork URL is required"),
  audioUrl: z.string().default(""),
  duration: z.string().default("3:45"),
  genre: z.string().default("Electronic / Orchestral"),
  year: z.string().default("2026"),
  spotifyUrl: z.string().optional().or(z.literal("")),
  soundcloudUrl: z.string().optional().or(z.literal("")),
  appleMusicUrl: z.string().optional().or(z.literal("")),
  youtubeUrl: z.string().optional().or(z.literal("")),
  featured: z.boolean().default(false),
  order: z.number().default(0),
  createdAt: z.string().optional(),
});
export type MusicItem = z.infer<typeof MusicItemSchema>;

export const MusicItemInputSchema = MusicItemSchema.omit({ id: true, createdAt: true });
export type MusicItemInput = z.infer<typeof MusicItemInputSchema>;

