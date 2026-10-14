---
trigger: "model_decision"
---
# Security & Uploads Guidelines

## Media Uploads & URLs
- Support JPG, PNG, WebP, AVIF.
- Max file size: 10MB.
- Validate URLs strictly: must be `https://`.
- Supported embedded video providers: YouTube and Vimeo.
- Required metadata for every media asset: Title, Alt text, Width, Height, Category (for gallery items).
- Provide instant preview and client feedback before saving.

## Admin Access & Input Sanitization
- Form inputs validated with Zod.
- Prevent XSS by escaping or rendering text through React's native JSX escaping.
- Rate limit enquiries and forms.
