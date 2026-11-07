/**
 * YouTube Utility functions for extraction, oEmbed metadata fetching, and fallbacks.
 */

export interface YouTubeMetadata {
  videoId: string;
  title: string;
  author: string;
  description: string;
  thumbnailUrl: string;
  hqThumbnailUrl: string;
  embedUrl: string;
  success: boolean;
}

/**
 * Extracts the 11-character YouTube video ID from various URL formats.
 */
export function extractYouTubeId(url: string): string {
  if (!url) return "";
  const trimmed = url.trim();

  // If already an 11-char ID
  if (/^[\w-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  const match = trimmed.match(
    /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))([\w-]{11})/i
  );

  return match ? match[1] : "";
}

/**
 * Returns the direct YouTube thumbnail URL for a given video ID or URL.
 */
export function getYouTubeThumbnail(
  videoIdOrUrl: string,
  quality: "maxres" | "hq" | "default" = "maxres"
): string {
  const id = extractYouTubeId(videoIdOrUrl);
  if (!id) return "";

  if (quality === "maxres") {
    return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
  }
  if (quality === "hq") {
    return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  }
  return `https://img.youtube.com/vi/${id}/default.jpg`;
}

/**
 * Generates the clean YouTube embed URL for video playback.
 */
export function getYouTubeEmbedUrl(videoIdOrUrl: string, autoplay: boolean = false): string {
  const id = extractYouTubeId(videoIdOrUrl);
  if (!id) return videoIdOrUrl;
  return `https://www.youtube-nocookie.com/embed/${id}${autoplay ? "?autoplay=1" : ""}`;
}

/**
 * Fetches original YouTube video metadata via public oEmbed.
 * Falls back gracefully to direct thumbnail and title parsing if offline or rate limited.
 */
export async function fetchYouTubeMetadata(urlOrId: string): Promise<YouTubeMetadata> {
  const videoId = extractYouTubeId(urlOrId);

  const fallback: YouTubeMetadata = {
    videoId,
    title: videoId ? `YouTube Video (${videoId})` : "",
    author: "One Roof Studios",
    description: "",
    thumbnailUrl: videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : "",
    hqThumbnailUrl: videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "",
    embedUrl: videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : "",
    success: false,
  };

  if (!videoId) return fallback;

  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(
      `https://www.youtube.com/watch?v=${videoId}`
    )}&format=json`;

    // 4 second timeout controller
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(oembedUrl, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return {
        videoId,
        title: data.title || fallback.title,
        author: data.author_name || fallback.author,
        description: data.title ? `Official release from ${data.author_name || "One Roof Studios"}.` : "",
        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        hqThumbnailUrl: data.thumbnail_url || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
        success: true,
      };
    }
  } catch (err) {
    // Network / CORS / offline fallback
  }

  return {
    ...fallback,
    success: !!videoId,
  };
}
