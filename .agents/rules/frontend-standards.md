---
trigger: "glob: apps/web/**"
---
# Frontend Standards (apps/web)

## Architecture & Conventions
- Use Next.js App Router with TypeScript.
- Follow the route structure:
  - `app/(site)/` for public pages: `/`, `/about`, `/gallery`, `/documentary`, `/contact`.
  - `app/admin/` for the management console: `/admin`, `/admin/pages`, `/admin/gallery`, `/admin/documentary`, `/admin/home-extras`, `/admin/media`, `/admin/settings`, `/admin/enquiries`.
  - `app/api/` for route handlers conforming to the API contract.
- Keep components modular:
  - `components/ui/` for primitive controls (Button, Input, Card, Modal, Badge).
  - `components/layout/` for Header, Footer, MobileNav, AdminLayout.
  - `components/animations/` for motion wrappers and Lenis provider.
  - `components/site/` for public page sections.
  - `components/admin/` for admin management widgets.

## Design & UI Tokens
- Core palette: Obsidian Black (`#0a0a0c`), Charcoal (`#121318`), Gold/Champagne (`#d4af37`), Muted Gray (`#9ca3af`), Pure White (`#ffffff`).
- Glassmorphism: `backdrop-blur-md bg-white/[0.03] border border-white/[0.08]`.
- Typography: Headings use *Syne*, body text uses *Plus Jakarta Sans*.

## Accessibility & SEO
- Unique descriptive IDs on all interactive buttons and inputs.
- All `img` elements have meaningful `alt` text.
- Form inputs have paired `<label>` and inline validation messages.
- Full keyboard accessibility and visible focus rings.
