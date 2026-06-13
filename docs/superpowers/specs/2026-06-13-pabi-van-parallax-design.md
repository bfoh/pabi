# Pabi Van Parallax Journey — Design Spec

Date: 2026-06-13
Status: Approved (pending written-spec review)

## Goal

Replace the hero `<video>` with a parallax scrolling experience: a Pabi-branded
van drives down a continuous road scene from the hero section to the footer as
the user scrolls. Full visual redesign — every section becomes part of one
continuous environment the van travels through. All existing copy and
functionality (quote calculator, services, stats, steps, CTAs) is preserved.

## Locked Decisions

- **Van asset:** hand-built SVG illustration (no photo). Long-wheelbase
  high-roof Sprinter matching the reference photo's stance, painted in Pabi
  trade dress: navy body, gold lower stripe, gold hexagon "PABI REMOVALS" badge
  on the side panel, gold wheel trims, glazed windows, headlights.
- **Motion:** van drives across + down — weaves left/right along a winding road,
  scrub-linked to page scroll, with depth scaling, auto-rotation into curves,
  spinning wheels, and a subtle suspension bob.
- **Scope:** full visual redesign. Sections become scenes on the road; their
  solid backgrounds become transparent/translucent over the shared scene.
- **Scene mood:** brand navy → gold dawn. Deep navy night at hero, warm gold
  dawn glow mid-page, navy dusk at footer.
- **Accessibility:** fully respect `prefers-reduced-motion`. Reduced motion =>
  van parked statically in hero, no scrub/parallax, sections render normally.

## Brand Reference

From `tailwind.config.js` / `index.css` and `logo.png`:

- Navy: `#0A1628` (900), `#0F1D32` (800), `#1A2B47` (700)
- Gold: `#C8963E` (500), `#D4A84D` (400), `#B0822F` (600)
- Cream: `#FAF8F5` (50), `#F5F0EA` (100)
- Charcoal: `#1A1A2E` (900), `#3D3D54` (700), `#6B6B80` (500)
- Logo: gold hexagon badge containing a van line-icon, "PABI" wordmark,
  "REMOVALS" sub-label. Trade dress = gold hexagon + van motif on navy/gold.

## Page Structure (current, preserved)

1. `Navigation` — fixed, solid navy (stays solid for legibility)
2. `Hero` (`#hero`) — reworked; was navy + video
3. `ValuePropositions` — "The Pabi Advantage", 4 cards (was cream)
4. `Services` (`#services`) — tabs/accordion, 4 services (was navy)
5. `LondonAdvantage` (`#areas`) — "London Is Our Home", 4 animated stats, skyline
6. `HowItWorks` (`#how-it-works`) — 4 numbered steps (was cream)
7. `TrustBanner` (`#pricing`) — "Join 2,500+", 3 stats, CTA (was navy-800)
8. `Footer` — solid navy (stays solid)

## Architecture

Three new units plus a section re-skin. Z-index ladder:

```
SceneBackdrop   z-0    (absolute, full document height)
VanJourney      z-10
Section content z-20   (text + glass panels)
Navigation      z-50
```

### 1. `SceneBackdrop` (`src/sections/SceneBackdrop.tsx`)

Single absolute layer spanning the full document height, behind all content.
Sub-layers, each parallaxed at its own rate via ScrollTrigger scrub:

- **Sky gradient** — vertical gradient keyed to scroll: navy night (hero) →
  warm gold dawn (mid) → navy dusk (footer). Implemented as a tall gradient
  div; subtle hue shift can be a fixed gradient since the page itself scrolls.
- **Far skyline** — SVG city silhouette, slowest parallax (moves least).
- **Mid buildings** — nearer silhouette, medium parallax.
- **Clouds** — 2–3 drifting cloud shapes, slow horizontal drift + parallax.
- **Road** — the winding road graphic (SVG path + asphalt fill + dashed
  centre line) that the van follows. This is the visual track.

Responsibilities: render the environment and parallax it. Depends on:
ScrollTrigger, document height. Exposes nothing (self-contained visual layer).

Reduced motion: render a static, pleasant version (no parallax translate).

### 2. `VanJourney` (`src/components/VanJourney.tsx`)

The animated van.

- **`VanSvg`** — pure presentational SVG component (the liveried Sprinter).
  Wheels are a named group (`.van-wheel`) for spin. Headlight glow element.
  No animation logic inside; just markup + brand fills.
- **`VanJourney`** — owns the GSAP logic:
  - Master `ScrollTrigger` with `scrub` across the whole document
    (`trigger: document.body`, `start: 'top top'`, `end: 'bottom bottom'`).
  - **MotionPathPlugin** moves the van along the same SVG path used by the
    road in `SceneBackdrop` (shared path data in `src/lib/journeyPath.ts`),
    with `autoRotate` so the van leans into curves.
  - Continuous wheel spin: independent `gsap.to('.van-wheel', { rotate, repeat:-1 })`.
  - Depth scale: van scales along the path (smaller where the road recedes).
  - Suspension bob: small looping y-jitter, amplitude optionally tied to scroll
    velocity (`ScrollTrigger` velocity) for a "bumpy when moving" feel.
  - Headlights brighten subtly in the darker (navy) zones.

Responsibilities: drive the van along the path in sync with scroll. Depends on:
gsap, ScrollTrigger, MotionPathPlugin, shared path, reduced-motion hook.

Reduced motion: render `VanSvg` parked in the hero at a fixed position/size,
no GSAP timeline, no wheel spin.

### 3. Shared path + responsive recompute (`src/lib/journeyPath.ts`)

- Exports a function that, given viewport width + document height, returns the
  SVG path `d` string for the winding road (a vertical sine-like snake from
  hero to footer). Gentler amplitude on mobile, wider weave on desktop.
- Both `SceneBackdrop` (draws the road) and `VanJourney` (follows it) consume
  this so the van always sits on the visible road.
- On resize, both recompute the path and `ScrollTrigger.refresh()`.

### 4. Reduced-motion hook (`src/hooks/use-reduced-motion.ts`)

Small hook returning a boolean from `matchMedia('(prefers-reduced-motion: reduce)')`,
updating on change. Consumed by `SceneBackdrop` and `VanJourney`.

### 5. Section re-skin (existing section files)

Make sections sit on the shared scene rather than painting solid blocks:

- Remove/!-soften opaque `bg-navy-*` / `bg-cream-*` full-bleed backgrounds.
- Wrap text/content groups in translucent "glass" panels
  (`bg-white/8 backdrop-blur border border-white/15` on dark zones;
  `bg-white/70 backdrop-blur` style on light zones) + scrims so copy stays
  legible over the moving van/scene.
- Keep all content, GSAP entrance animations, interactions intact.
- `Navigation` and `Footer` keep solid backgrounds.
- `Hero`: remove `<video>` and its overlays; the van + sky come from the scene
  layers. Keep headline, subtitle, CTAs, trust line, and the 3-step quote
  calculator on a glass panel. Keep the existing intro GSAP timeline. Remove the
  hero's own sticky-video ScrollTrigger (superseded by the global scene).

## Data / Control Flow

```
window scroll
  → master ScrollTrigger (scrub)
      → MotionPathPlugin progress  → van x/y/rotation along shared path
      → parallax tweens            → SceneBackdrop layer translateY
  (independent loop) → wheel spin, suspension bob, cloud drift
resize → recompute journeyPath() → redraw road + ScrollTrigger.refresh()
prefers-reduced-motion → skip all of the above; static van + static scene
```

## File Plan

New:
- `src/sections/SceneBackdrop.tsx`
- `src/components/VanJourney.tsx`
- `src/components/VanSvg.tsx`
- `src/lib/journeyPath.ts`
- `src/hooks/use-reduced-motion.ts`

Modified:
- `src/pages/Home.tsx` — mount `SceneBackdrop` + `VanJourney`; relative wrapper
- `src/sections/Hero.tsx` — remove video, re-skin onto scene
- `src/sections/ValuePropositions.tsx` — transparent bg + glass cards
- `src/sections/Services.tsx` — transparent bg + glass
- `src/sections/LondonAdvantage.tsx` — transparent bg + glass (keep skyline blend)
- `src/sections/HowItWorks.tsx` — transparent bg + glass
- `src/sections/TrustBanner.tsx` — transparent bg + glass
- `tailwind.config.js` — add any keyframes if needed (e.g. cloud drift)

Removed from use:
- `public/videos/hero-video.mp4` (no longer referenced)

## Testing / Verification

- `npm run build` passes (tsc + vite).
- `npm run dev` and manually verify:
  - Van drives smoothly hero → footer on scroll down, reverses on scroll up.
  - Van stays visually on the road across breakpoints (mobile / tablet / desktop).
  - Text remains legible over the scene at every section.
  - Wheels spin; van leans into curves; depth scaling reads naturally.
  - `prefers-reduced-motion: reduce` → static van in hero, no scrub, normal page.
  - No layout shift / horizontal scrollbar; 60fps target on desktop.
- Verify via the `run` skill (launch app) after implementation.

## Risks / Mitigations

- **Van hidden behind solid section bg** → sections re-skinned transparent +
  glass panels (core of the redesign).
- **Path/road misalignment across breakpoints** → single shared path source +
  `ScrollTrigger.refresh()` on resize.
- **Performance (many layers + scrub)** → GPU transforms only, `will-change`,
  fewer layers on mobile, throttled resize.
- **Legibility over busy scene** → scrims + glass panels + drop shadows on text.
- **MotionPathPlugin availability** → free in GSAP 3.15 (installed); import from
  `gsap/MotionPathPlugin` and `gsap.registerPlugin`.

## Out of Scope

- New copy, new sections, backend/quote submission logic.
- Photoreal van / image generation.
- Routing changes.
