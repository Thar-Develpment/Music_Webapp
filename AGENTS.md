# Project: Music Label Website
Monorepo: apps/web (Next.js App Router, TypeScript), apps/api (Node.js, Express, Prisma, PostgreSQL), packages/shared (Zod schemas).

## Commands
- `npm run dev`: run web application
- `npm run verify`: lint, type check, test, build. Run it before finishing any task.

## Rules
- TypeScript strict mode. No `any`.
- Validate every API input with the Zod schemas in `packages/shared`.
- Never hard-code page content. Text and media come from the API (or mock data layer conforming to the API contract).
- Animation: Motion for UI reveals & staggered cards, GSAP (dynamically loaded) for hero text reveals and parallax. Animate transform and opacity only. Respect `prefers-reduced-motion`.
- Sliders and media: Embla Carousel for testimonials, yet-another-react-lightbox for gallery full-screen viewing.
- Uploads and URL fetching follow the security-and-uploads rules.
- Never commit secrets. Use `.env` and keep `.env.example` updated.
- Permissive licenses only (MIT, Apache-2.0, or GSAP no-charge license).
- Rich Aesthetics: Obsidian dark luxury theme, Champagne Gold accents, glassmorphic cards, modern typography (Syne + Plus Jakarta Sans).
