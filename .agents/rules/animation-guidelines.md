---
trigger: "model_decision"
---
# Animation Guidelines

## General Motion Rules
- Keep animations purposeful, elegant, and cinematic.
- Consistent easing: `[0.22, 1, 0.36, 1]` (custom cubic bezier) or standard ease-out.
- Durations: 300ms to 700ms for smooth transitions.
- Animate `transform` (translate, scale) and `opacity` only to ensure 60fps GPU acceleration.
- Respect `prefers-reduced-motion: reduce`:
  - Disable Lenis smooth scrolling.
  - Disable parallax effects and text splitting.
  - Fallback to instant or gentle fade opacity.

## Libraries
- **Lenis**: Smooth page scrolling on public pages; disabled inside the admin panel.
- **Motion**: Section entrances, staggered cards, modals, hover states, mobile drawer.
- **GSAP**: Dynamic import only for hero headline line-by-line reveal and ScrollTrigger parallax.
- **Embla Carousel**: Touch and drag physics for testimonials and featured upcoming projects.
- **yet-another-react-lightbox**: Full-screen gallery image and video viewer.
