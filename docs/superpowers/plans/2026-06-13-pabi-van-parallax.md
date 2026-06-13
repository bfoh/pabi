# Pabi Van Parallax Journey Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hero video with a continuous parallax scene in which a Pabi-liveried SVG van drives down a winding road from the hero to the footer as the user scrolls.

**Architecture:** A fixed `SceneBackdrop` (sky gradient + skyline + clouds) sits behind everything. A full-document-height `VanJourney` layer draws the winding road and animates the van along it via a scroll-scrubbed GSAP tween that samples a shared path function (`journeyPath.ts`). All sections are re-skinned with transparent backgrounds + translucent "glass" panels so the scene shows through. `prefers-reduced-motion` parks the van and disables scrubbing.

**Tech Stack:** React 19, Vite 7, Tailwind 3, GSAP 3.15 (ScrollTrigger), TypeScript, lucide-react.

---

## Testing approach (read first)

This is a visual/animation feature with no test runner configured and the project is **not a git repo**. Therefore:

- **Gate per task:** `cd /Users/ebenezerbarning/Desktop/pabi/app && npm run build` must pass (runs `tsc -b` typecheck + `vite build`). This catches type errors and broken imports.
- **Pure logic** (`journeyPath.ts`) is verified with a tiny inline Node assertion script (no framework needed).
- **Final verification:** run the dev server and manually confirm behavior (Task 13) using the `run` skill.
- "Commit" steps are replaced by "build passes" gates since there is no git repo. If the user later runs `git init`, normal commits resume.

---

## File Structure

New:
- `app/src/lib/journeyPath.ts` — shared road geometry (path string + sampler).
- `app/src/hooks/use-reduced-motion.ts` — boolean hook for `prefers-reduced-motion`.
- `app/src/components/VanSvg.tsx` — presentational liveried van (side view).
- `app/src/sections/SceneBackdrop.tsx` — fixed sky/skyline/cloud parallax layer.
- `app/src/components/VanJourney.tsx` — full-doc road layer + scroll-driven van.

Modified:
- `app/src/pages/Home.tsx` — mount backdrop + journey; relative wrapper.
- `app/src/sections/Hero.tsx` — remove video, re-skin onto scene.
- `app/src/sections/ValuePropositions.tsx` — transparent bg + glass cards.
- `app/src/sections/Services.tsx` — transparent bg + glass.
- `app/src/sections/LondonAdvantage.tsx` — transparent bg + glass.
- `app/src/sections/HowItWorks.tsx` — transparent bg + glass.
- `app/src/sections/TrustBanner.tsx` — transparent bg + glass.

Unused after this work:
- `app/public/videos/hero-video.mp4` (no longer referenced; leave file, just unreferenced).

---

## Task 1: Shared road geometry (`journeyPath.ts`)

**Files:**
- Create: `app/src/lib/journeyPath.ts`

The road is a vertical "S-snake": x oscillates as a sine of vertical progress; y goes top→bottom of the document. One source of truth drives both the drawn road and the van sampler.

- [ ] **Step 1: Create the file**

```ts
// app/src/lib/journeyPath.ts

/** Number of full left-right weaves down the page. */
const WAVES = 2.5;

/** Horizontal centre + amplitude of the weave for a given width. */
function weave(width: number) {
  const isMobile = width < 768;
  const margin = width * (isMobile ? 0.22 : 0.14);
  const center = width / 2;
  const amplitude = (width - margin * 2) / 2;
  return { center, amplitude };
}

/** Horizontal position (px) of the road centre at vertical fraction t (0..1). */
export function roadX(t: number, width: number): number {
  const { center, amplitude } = weave(width);
  return center + Math.sin(t * Math.PI * WAVES) * amplitude;
}

export interface RoadSample {
  x: number;
  y: number;
  /** Degrees, small tilt following the road slope (clamped). */
  angle: number;
  /** Depth scale, subtly smaller on the far swings. */
  scale: number;
}

/** Sample the road at fraction t for placing the van. */
export function sampleRoad(t: number, width: number, height: number): RoadSample {
  const clamped = Math.max(0, Math.min(1, t));
  const x = roadX(clamped, width);
  const y = clamped * height;

  // Numerical slope for a small, natural tilt.
  const eps = 0.002;
  const x2 = roadX(Math.min(1, clamped + eps), width);
  const dxdy = (x2 - x) / (eps * height);
  const angle = Math.max(-7, Math.min(7, dxdy * 1400));

  // Depth: slightly smaller mid-swing, larger near the ends.
  const scale = 0.88 + 0.12 * Math.abs(Math.cos(clamped * Math.PI * WAVES));

  return { x, y, angle, scale };
}

/** SVG path "d" string for the drawn road across width x height. */
export function getRoadPath(width: number, height: number, samples = 60): string {
  let d = '';
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const x = roadX(t, width).toFixed(1);
    const y = (t * height).toFixed(1);
    d += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
  }
  return d;
}
```

- [ ] **Step 2: Verify the math with an inline Node check**

Run:

```bash
cd /Users/ebenezerbarning/Desktop/pabi/app && npx tsx -e "
import { roadX, sampleRoad, getRoadPath } from './src/lib/journeyPath.ts';
const W = 1280, H = 8000;
console.assert(Math.abs(roadX(0, W) - 640) < 1, 'start centred');
const s = sampleRoad(0.5, W, H);
console.assert(s.y === 4000, 'mid y');
console.assert(s.angle >= -7 && s.angle <= 7, 'angle clamped');
console.assert(s.scale > 0.8 && s.scale <= 1.0, 'scale range');
console.assert(getRoadPath(W, H).startsWith('M '), 'path d');
console.log('journeyPath OK');
" 2>/dev/null || echo "tsx unavailable — skip; rely on tsc build gate"
```

Expected: prints `journeyPath OK` (or the fallback line if `tsx` isn't present — that's fine, the build gate covers types).

- [ ] **Step 3: Build gate**

Run: `cd /Users/ebenezerbarning/Desktop/pabi/app && npm run build`
Expected: build succeeds, no TypeScript errors.

---

## Task 2: Reduced-motion hook

**Files:**
- Create: `app/src/hooks/use-reduced-motion.ts`

- [ ] **Step 1: Create the hook**

```ts
// app/src/hooks/use-reduced-motion.ts
import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(() =>
    typeof window !== 'undefined' && window.matchMedia(QUERY).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    const onChange = () => setReduced(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
```

- [ ] **Step 2: Build gate**

Run: `cd /Users/ebenezerbarning/Desktop/pabi/app && npm run build`
Expected: build succeeds.

---

## Task 3: Van SVG (`VanSvg.tsx`)

**Files:**
- Create: `app/src/components/VanSvg.tsx`

Side-view long-wheelbase high-roof Sprinter in Pabi livery: navy body, gold lower stripe, gold hexagon "PABI / REMOVALS" badge, gold wheel hubs, glazed cab windows, headlight, mirror. Wheels carry class `van-wheel` for spin (transform-box set so rotation pivots on hub centre).

- [ ] **Step 1: Create the component**

```tsx
// app/src/components/VanSvg.tsx

interface VanSvgProps {
  className?: string;
}

/**
 * Side-view Pabi-liveried Sprinter. viewBox 0 0 380 200.
 * Wheels use class "van-wheel" (rotate via GSAP). Headlight glow id "van-headlight".
 */
export default function VanSvg({ className }: VanSvgProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 380 200"
      width="380"
      height="200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Pabi Removals van"
      role="img"
    >
      <defs>
        <linearGradient id="vanBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1A2B47" />
          <stop offset="1" stopColor="#0A1628" />
        </linearGradient>
        <radialGradient id="headlightGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FDF3D6" stopOpacity="0.9" />
          <stop offset="1" stopColor="#FDF3D6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="vanGlass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#9FB6CE" />
          <stop offset="1" stopColor="#5E7894" />
        </linearGradient>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="190" cy="186" rx="168" ry="10" fill="#0A1628" opacity="0.22" />

      {/* Headlight glow (drawn behind body, projecting forward-left) */}
      <circle id="van-headlight" cx="20" cy="120" r="34" fill="url(#headlightGlow)" />

      {/* Body shell: long box with raked cab front (nose at left) */}
      <path
        d="M44 150
           L44 92
           Q44 64 72 60
           L96 60
           L120 36
           L356 36
           Q368 36 368 50
           L368 150
           Z"
        fill="url(#vanBody)"
        stroke="#0A1628"
        strokeWidth="2"
      />

      {/* Roof highlight */}
      <path d="M120 40 L356 40 Q362 40 362 48 L120 48 Z" fill="#22324F" opacity="0.6" />

      {/* Windscreen */}
      <path d="M98 60 L120 40 L150 40 L150 60 Z" fill="url(#vanGlass)" stroke="#0A1628" strokeWidth="1.5" />
      {/* Cab door window */}
      <rect x="156" y="42" width="34" height="20" rx="3" fill="url(#vanGlass)" stroke="#0A1628" strokeWidth="1.5" />

      {/* Cargo body panel lines */}
      <line x1="196" y1="40" x2="196" y2="150" stroke="#0A1628" strokeWidth="1.5" opacity="0.5" />
      <line x1="282" y1="40" x2="282" y2="150" stroke="#0A1628" strokeWidth="1.5" opacity="0.5" />
      {/* Sliding-door handle */}
      <rect x="236" y="96" width="22" height="5" rx="2.5" fill="#22324F" />

      {/* Gold lower livery stripe */}
      <rect x="44" y="132" width="324" height="18" fill="#C8963E" />
      <rect x="44" y="130" width="324" height="3" fill="#D4A84D" />

      {/* Pabi hexagon badge on cargo side */}
      <g transform="translate(228 84)">
        <polygon
          points="0,-26 22,-13 22,13 0,26 -22,13 -22,-13"
          fill="none"
          stroke="#C8963E"
          strokeWidth="3"
        />
        <text x="0" y="2" textAnchor="middle" fontFamily="Inter, sans-serif"
              fontSize="15" fontWeight="700" letterSpacing="1" fill="#C8963E">PABI</text>
        <text x="0" y="15" textAnchor="middle" fontFamily="Inter, sans-serif"
              fontSize="6" fontWeight="600" letterSpacing="2" fill="#D4A84D">REMOVALS</text>
      </g>

      {/* Front bumper + headlight lens */}
      <path d="M44 150 L44 120 Q40 120 40 128 L40 150 Z" fill="#1A2B47" />
      <rect x="42" y="112" width="10" height="12" rx="2" fill="#FDF3D6" stroke="#C8963E" strokeWidth="1" />

      {/* Mirror */}
      <path d="M96 64 l-10 -2 l0 8 l10 -2 Z" fill="#1A2B47" />

      {/* Wheel arches */}
      <path d="M86 150 a30 30 0 0 1 60 0 Z" fill="#0A1628" />
      <path d="M270 150 a30 30 0 0 1 60 0 Z" fill="#0A1628" />

      {/* Wheels (spin via .van-wheel) */}
      <g className="van-wheel" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
        <circle cx="116" cy="150" r="22" fill="#15151F" stroke="#2A2A38" strokeWidth="3" />
        <circle cx="116" cy="150" r="9" fill="#C8963E" />
        <rect x="114.5" y="131" width="3" height="38" fill="#0A1628" />
        <rect x="97" y="148.5" width="38" height="3" fill="#0A1628" />
      </g>
      <g className="van-wheel" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
        <circle cx="300" cy="150" r="22" fill="#15151F" stroke="#2A2A38" strokeWidth="3" />
        <circle cx="300" cy="150" r="9" fill="#C8963E" />
        <rect x="298.5" y="131" width="3" height="38" fill="#0A1628" />
        <rect x="281" y="148.5" width="38" height="3" fill="#0A1628" />
      </g>
    </svg>
  );
}
```

- [ ] **Step 2: Build gate**

Run: `cd /Users/ebenezerbarning/Desktop/pabi/app && npm run build`
Expected: build succeeds.

---

## Task 4: Scene backdrop (`SceneBackdrop.tsx`)

**Files:**
- Create: `app/src/sections/SceneBackdrop.tsx`

Fixed full-viewport layer behind all content. Stacked gradient (navy night → gold dawn → navy dusk) whose vertical position shifts with scroll, plus a far skyline and drifting clouds parallaxed by scroll. Reduced motion → static.

- [ ] **Step 1: Create the component**

```tsx
// app/src/sections/SceneBackdrop.tsx
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../hooks/use-reduced-motion';

gsap.registerPlugin(ScrollTrigger);

export default function SceneBackdrop() {
  const rootRef = useRef<HTMLDivElement>(null);
  const skyRef = useRef<HTMLDivElement>(null);
  const skylineRef = useRef<HTMLDivElement>(null);
  const cloudsRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      // Crossfade the sky gradient from night -> dawn -> dusk over the page.
      gsap.to(skyRef.current, {
        backgroundPositionY: '100%',
        ease: 'none',
        scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: true },
      });
      gsap.to(skylineRef.current, {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: true },
      });
      gsap.to(cloudsRef.current, {
        yPercent: -18,
        ease: 'none',
        scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: true },
      });
      // Gentle continuous cloud drift.
      gsap.to('.scene-cloud', {
        x: '+=40',
        duration: 14,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        stagger: 3,
      });
    }, rootRef);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <div ref={rootRef} className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Sky: tall gradient, scrolled via background-position */}
      <div
        ref={skyRef}
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(180deg, #0A1628 0%, #14213B 28%, #3A3358 48%, #C8963E 62%, #6E5A52 78%, #0F1D32 100%)',
          backgroundSize: '100% 260%',
          backgroundPositionY: '0%',
        }}
      />
      {/* Soft sun glow in the dawn band */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(212,168,77,0.28) 0%, rgba(212,168,77,0) 70%)' }}
      />

      {/* Clouds */}
      <div ref={cloudsRef} className="absolute inset-0">
        {[
          { top: '12%', left: '8%', w: 180, o: 0.10 },
          { top: '22%', left: '62%', w: 240, o: 0.08 },
          { top: '40%', left: '30%', w: 200, o: 0.07 },
        ].map((c, i) => (
          <div
            key={i}
            className="scene-cloud absolute rounded-full bg-white blur-2xl"
            style={{ top: c.top, left: c.left, width: c.w, height: c.w * 0.4, opacity: c.o }}
          />
        ))}
      </div>

      {/* Far skyline silhouette pinned to the bottom of the viewport */}
      <div ref={skylineRef} className="absolute bottom-0 left-0 right-0 h-[34vh]">
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-full h-full" fill="#0A1628" opacity="0.55">
          <path d="M0 320 L0 200 L60 200 L60 150 L110 150 L110 200 L170 200 L170 120 L210 120 L210 80 L230 80 L230 120 L270 120 L270 200 L340 200 L340 160 L400 160 L400 110 L430 110 L430 160 L500 160 L500 210 L560 210 L560 140 L600 140 L600 90 L620 90 L620 140 L690 140 L690 200 L760 200 L760 150 L820 150 L820 200 L900 200 L900 120 L940 120 L940 70 L960 70 L960 120 L1020 120 L1020 200 L1100 200 L1100 160 L1160 160 L1160 110 L1190 110 L1190 160 L1260 160 L1260 200 L1340 200 L1340 150 L1400 150 L1400 200 L1440 200 L1440 320 Z" />
        </svg>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Build gate**

Run: `cd /Users/ebenezerbarning/Desktop/pabi/app && npm run build`
Expected: build succeeds.

---

## Task 5: Van journey layer (`VanJourney.tsx`)

**Files:**
- Create: `app/src/components/VanJourney.tsx`

Full-document-height absolute layer. Draws the road (from `getRoadPath`) and positions `VanSvg` via a scroll-scrubbed proxy that samples `sampleRoad`. Measures document height on mount + resize and refreshes ScrollTrigger. Wheels spin continuously. Reduced motion → park van near the hero.

- [ ] **Step 1: Create the component**

```tsx
// app/src/components/VanJourney.tsx
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import VanSvg from './VanSvg';
import { getRoadPath, sampleRoad } from '../lib/journeyPath';
import { useReducedMotion } from '../hooks/use-reduced-motion';

gsap.registerPlugin(ScrollTrigger);

export default function VanJourney() {
  const layerRef = useRef<HTMLDivElement>(null);
  const vanRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ width: 0, height: 0 });
  const reduced = useReducedMotion();

  // Measure viewport width + full document height.
  useLayoutEffect(() => {
    const measure = () => {
      const width = window.innerWidth;
      const height = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      );
      setDims({ width, height });
    };
    measure();
    window.addEventListener('resize', measure);
    // Re-measure after fonts/images settle.
    const t = window.setTimeout(measure, 600);
    return () => {
      window.removeEventListener('resize', measure);
      window.clearTimeout(t);
    };
  }, []);

  // Drive the van.
  useEffect(() => {
    const van = vanRef.current;
    if (!van || dims.width === 0 || dims.height === 0) return;

    const place = (t: number) => {
      const s = sampleRoad(t, dims.width, dims.height);
      gsap.set(van, {
        x: s.x,
        y: s.y,
        rotation: s.angle,
        scale: s.scale,
        xPercent: -50,
        yPercent: -50,
      });
    };

    if (reduced) {
      place(0.06); // parked near the top (hero)
      return;
    }

    const ctx = gsap.context(() => {
      const proxy = { t: 0 };
      gsap.to(proxy, {
        t: 1,
        ease: 'none',
        onUpdate: () => place(proxy.t),
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        },
      });
      // Continuous wheel spin.
      gsap.to('.van-wheel', {
        rotation: 360,
        transformOrigin: 'center',
        repeat: -1,
        ease: 'none',
        duration: 1.4,
      });
      ScrollTrigger.refresh();
      place(0);
    }, layerRef);

    return () => ctx.revert();
  }, [dims, reduced]);

  return (
    <div
      ref={layerRef}
      className="absolute top-0 left-0 w-full z-10 pointer-events-none"
      style={{ height: dims.height || '100%' }}
    >
      {/* Road */}
      {dims.width > 0 && (
        <svg
          className="absolute top-0 left-0"
          width={dims.width}
          height={dims.height}
          viewBox={`0 0 ${dims.width} ${dims.height}`}
          fill="none"
        >
          <path d={getRoadPath(dims.width, dims.height)} stroke="#0A1628" strokeOpacity="0.55" strokeWidth="74" strokeLinecap="round" />
          <path d={getRoadPath(dims.width, dims.height)} stroke="#1A2B47" strokeOpacity="0.6" strokeWidth="64" strokeLinecap="round" />
          <path d={getRoadPath(dims.width, dims.height)} stroke="#C8963E" strokeOpacity="0.7" strokeWidth="3" strokeDasharray="22 26" strokeLinecap="round" />
        </svg>
      )}

      {/* Van */}
      <div ref={vanRef} className="absolute top-0 left-0 w-[200px] sm:w-[260px] md:w-[320px]" style={{ willChange: 'transform' }}>
        <VanSvg className="w-full h-auto drop-shadow-[0_18px_30px_rgba(0,0,0,0.45)]" />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Build gate**

Run: `cd /Users/ebenezerbarning/Desktop/pabi/app && npm run build`
Expected: build succeeds.

---

## Task 6: Wire into `Home.tsx`

**Files:**
- Modify: `app/src/pages/Home.tsx`

Mount `SceneBackdrop` (fixed, behind) and `VanJourney` (absolute, inside a relative wrapper that contains the scrolling content so the journey layer spans the full document).

- [ ] **Step 1: Replace the file contents**

```tsx
// app/src/pages/Home.tsx
import Navigation from '../sections/Navigation';
import SceneBackdrop from '../sections/SceneBackdrop';
import VanJourney from '../components/VanJourney';
import Hero from '../sections/Hero';
import ValuePropositions from '../sections/ValuePropositions';
import Services from '../sections/Services';
import LondonAdvantage from '../sections/LondonAdvantage';
import HowItWorks from '../sections/HowItWorks';
import TrustBanner from '../sections/TrustBanner';
import Footer from '../sections/Footer';

export default function Home() {
  return (
    <div className="relative">
      <SceneBackdrop />
      <Navigation />
      {/* Journey layer + content share this relative, full-height wrapper */}
      <div className="relative">
        <VanJourney />
        <main className="relative z-20">
          <Hero />
          <ValuePropositions />
          <Services />
          <LondonAdvantage />
          <HowItWorks />
          <TrustBanner />
        </main>
      </div>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 2: Build gate**

Run: `cd /Users/ebenezerbarning/Desktop/pabi/app && npm run build`
Expected: build succeeds.

---

## Task 7: Hero re-skin — remove video

**Files:**
- Modify: `app/src/sections/Hero.tsx`

Remove the `<video>` and its dark overlays and the hero's own sticky-video ScrollTrigger. Keep the intro timeline, headline, subtitle, CTAs, trust line, quote calculator. Make the section transparent so the scene/van show through; the calculator/text get glass panels (they already use `bg-white/[0.08] backdrop-blur` for the calc — keep). Add a readability scrim only behind the text column.

- [ ] **Step 1: Remove unused refs/imports and the video play effect**

In `app/src/sections/Hero.tsx`, delete the `videoRef` declaration:

```tsx
  const videoRef = useRef<HTMLVideoElement>(null);
```

Delete the entire video autoplay effect:

```tsx
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.play().catch(() => {});
  }, []);
```

- [ ] **Step 2: Replace the ScrollTrigger block + the sticky/video markup**

Replace this block inside the first `useEffect`:

```tsx
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '80% top',
        scrub: true,
        onUpdate: (self) => {
          if (stickyRef.current) stickyRef.current.style.opacity = String(1 - self.progress);
        },
      });
```

with (remove it entirely — the global scene replaces the sticky fade):

```tsx
      // Sticky video fade removed; the global SceneBackdrop/VanJourney handle the scene.
```

Then remove now-unused imports `ScrollTrigger`, `gsap` registration if unused. Keep `gsap` (intro timeline uses it). Remove the `import { ScrollTrigger } ...` line and the `gsap.registerPlugin(ScrollTrigger);` line. Also remove the unused `stickyRef` declaration:

```tsx
  const stickyRef = useRef<HTMLDivElement>(null);
```

- [ ] **Step 3: Replace the section wrapper + video with a transparent scene-friendly hero**

Replace the opening of the returned JSX, from:

```tsx
    <section id="hero" ref={sectionRef} className="relative bg-navy-900" style={{ height: 'clamp(220vh, 260vh, 300vh)' }}>
      <div ref={stickyRef} className="sticky top-0 h-[100dvh] w-full overflow-hidden">
        {/* Video */}
        <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" src="/videos/hero-video.mp4" autoPlay muted loop playsInline preload="auto" poster="/images/service-house-removals-hero.jpg" />
        {/* Overlays for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628]/70 via-[#0A1628]/50 to-[#0A1628]/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1628]/60 via-transparent to-transparent" />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-end">
```

with:

```tsx
    <section id="hero" ref={sectionRef} className="relative min-h-[100dvh]">
      <div className="relative min-h-[100dvh] w-full overflow-hidden">
        {/* Left-side scrim for headline readability over the moving scene */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1628]/75 via-[#0A1628]/30 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#0A1628]/80 to-transparent" />

        {/* Content */}
        <div className="relative z-10 min-h-[100dvh] flex flex-col justify-end pt-24">
```

- [ ] **Step 4: Close the wrapper correctly**

The original had `</div>` closing the sticky wrapper after the scroll indicator. That structure is unchanged (still one wrapper div). Confirm the JSX still closes: content div, then wrapper div, then `</section>`. No change needed beyond Step 3.

- [ ] **Step 5: Build gate**

Run: `cd /Users/ebenezerbarning/Desktop/pabi/app && npm run build`
Expected: build succeeds, no unused-variable TS errors. If `useEffect` becomes unused, keep it (intro timeline still uses it). If `ScrollTrigger` import remains referenced anywhere, remove it.

---

## Task 8: ValuePropositions re-skin

**Files:**
- Modify: `app/src/sections/ValuePropositions.tsx`

Section was `bg-cream-50` (opaque). Make transparent; cards become light glass so the scene reads behind. Text stays dark on the light glass.

- [ ] **Step 1: Make the section transparent**

Change:

```tsx
    <section ref={sectionRef} className="bg-cream-50 py-16 md:py-24 lg:py-28">
```

to:

```tsx
    <section ref={sectionRef} className="relative py-16 md:py-24 lg:py-28">
```

- [ ] **Step 2: Glass cards**

Change the card className from:

```tsx
              className="vp-card opacity-0 bg-white border border-[#0A1628]/[0.06] rounded-xl p-5 md:p-6 lg:p-8 shadow-card hover:shadow-card-hover hover:-translate-y-1 hover:border-gold-500/20 transition-all duration-300 group"
```

to:

```tsx
              className="vp-card opacity-0 bg-white/80 backdrop-blur-md border border-white/60 rounded-xl p-5 md:p-6 lg:p-8 shadow-card hover:shadow-card-hover hover:-translate-y-1 hover:border-gold-500/30 transition-all duration-300 group"
```

- [ ] **Step 3: Heading legibility**

The heading uses `text-charcoal-900`. Over the bright dawn band it stays readable; add a subtle white halo. Change:

```tsx
          <h2 className="vp-heading opacity-0 text-charcoal-900 font-bold tracking-[-0.02em] text-2xl sm:text-3xl md:text-4xl lg:text-[3.5rem]" style={{ lineHeight: 1.05 }}>
```

to:

```tsx
          <h2 className="vp-heading opacity-0 text-charcoal-900 font-bold tracking-[-0.02em] text-2xl sm:text-3xl md:text-4xl lg:text-[3.5rem] drop-shadow-[0_1px_12px_rgba(255,255,255,0.6)]" style={{ lineHeight: 1.05 }}>
```

- [ ] **Step 4: Build gate**

Run: `cd /Users/ebenezerbarning/Desktop/pabi/app && npm run build`
Expected: build succeeds.

---

## Task 9: Services re-skin

**Files:**
- Modify: `app/src/sections/Services.tsx`

Section was `bg-navy-900` (opaque dark). Make transparent; wrap content in a dark glass panel so the white text stays readable while the van passes.

- [ ] **Step 1: Make the section transparent**

Change:

```tsx
    <section id="services" ref={sectionRef} className="bg-navy-900 py-16 md:py-24 lg:py-28">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
```

to:

```tsx
    <section id="services" ref={sectionRef} className="relative py-16 md:py-24 lg:py-28">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 rounded-3xl bg-navy-900/70 backdrop-blur-md border border-white/10 p-6 sm:p-8 md:p-10">
```

- [ ] **Step 2: Build gate**

Run: `cd /Users/ebenezerbarning/Desktop/pabi/app && npm run build`
Expected: build succeeds.

---

## Task 10: LondonAdvantage re-skin

**Files:**
- Modify: `app/src/sections/LondonAdvantage.tsx`

Section was `bg-navy-900` with a faint skyline image. Drop the opaque background but keep a dark glass content panel. Remove the redundant inline skyline image background (the global skyline covers atmosphere) but keep it optional and subtle.

- [ ] **Step 1: Make the section transparent + glass-wrap content**

Change:

```tsx
    <section id="areas" ref={sectionRef} className="relative bg-navy-900 py-16 md:py-24 lg:py-28 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.1]"
        style={{ backgroundImage: 'url(/images/london-skyline.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
      <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6">
```

to:

```tsx
    <section id="areas" ref={sectionRef} className="relative py-16 md:py-24 lg:py-28 overflow-hidden">
      <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 rounded-3xl bg-navy-900/70 backdrop-blur-md border border-white/10 p-6 sm:p-8 md:p-10">
```

- [ ] **Step 2: Build gate**

Run: `cd /Users/ebenezerbarning/Desktop/pabi/app && npm run build`
Expected: build succeeds.

---

## Task 11: HowItWorks re-skin

**Files:**
- Modify: `app/src/sections/HowItWorks.tsx`

Section was `bg-cream-50`. Make transparent; wrap content in light glass so the dark step text stays readable.

- [ ] **Step 1: Make the section transparent + glass-wrap content**

Change:

```tsx
    <section id="how-it-works" ref={sectionRef} className="bg-cream-50 py-16 md:py-24 lg:py-28">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
```

to:

```tsx
    <section id="how-it-works" ref={sectionRef} className="relative py-16 md:py-24 lg:py-28">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 rounded-3xl bg-cream-50/80 backdrop-blur-md border border-white/60 p-6 sm:p-8 md:p-10 shadow-card">
```

- [ ] **Step 2: Build gate**

Run: `cd /Users/ebenezerbarning/Desktop/pabi/app && npm run build`
Expected: build succeeds.

---

## Task 12: TrustBanner re-skin

**Files:**
- Modify: `app/src/sections/TrustBanner.tsx`

Section was `bg-navy-800`. Make transparent; dark glass content panel.

- [ ] **Step 1: Make the section transparent + glass-wrap content**

Change:

```tsx
    <section id="pricing" ref={sectionRef} className="bg-navy-800 py-14 md:py-20 lg:py-24">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 text-center">
```

to:

```tsx
    <section id="pricing" ref={sectionRef} className="relative py-14 md:py-20 lg:py-24">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 text-center rounded-3xl bg-navy-800/75 backdrop-blur-md border border-white/10 p-6 sm:p-8 md:p-12">
```

- [ ] **Step 2: Build gate**

Run: `cd /Users/ebenezerbarning/Desktop/pabi/app && npm run build`
Expected: build succeeds.

---

## Task 13: Final integration verification

**Files:** none (verification only).

- [ ] **Step 1: Production build**

Run: `cd /Users/ebenezerbarning/Desktop/pabi/app && npm run build`
Expected: clean build, no TS errors, no unused-import errors.

- [ ] **Step 2: Launch dev server and verify (use the `run` skill)**

Run: `cd /Users/ebenezerbarning/Desktop/pabi/app && npm run dev`
Then open the served URL and confirm:
- Van starts in the hero and drives down the winding road to the footer as you scroll; reverses on scroll up.
- Van weaves left↔right, tilts slightly on curves, wheels spin, depth scaling reads naturally.
- Van sits on the drawn road across mobile / tablet / desktop widths (resize the window — road + van recompute without drift).
- Sky transitions navy → gold dawn → navy; skyline + clouds parallax.
- All section text remains legible over the moving scene (glass panels + scrims).
- No horizontal scrollbar; smooth (~60fps) scrolling on desktop.

- [ ] **Step 3: Reduced-motion check**

Enable OS "Reduce motion" (macOS: System Settings → Accessibility → Display → Reduce motion), reload, and confirm:
- Van is parked near the hero, no scrub animation, no parallax.
- Page scrolls normally and all content is readable.

- [ ] **Step 4: Resize/refresh sanity**

Resize the browser between mobile and desktop widths; confirm the road and van realign (ScrollTrigger refresh + remeasure) with no overlap of the van off the road.

---

## Self-Review notes

- **Spec coverage:** SceneBackdrop (Task 4), VanJourney+VanSvg (Tasks 3,5), shared path (Task 1), reduced-motion hook (Task 2), section re-skin (Tasks 7–12), hero video removal (Task 7), navy→gold-dawn mood (Task 4 gradient), accessibility (Task 2 + reduced branches in Tasks 4,5 + Task 13 Step 3). Road moved from SceneBackdrop into VanJourney for shared coordinate space (documented deviation from spec, intentional). MotionPathPlugin replaced by `sampleRoad` to keep the side-view van upright (documented deviation).
- **Type consistency:** `sampleRoad`/`roadX`/`getRoadPath` signatures match across Tasks 1 and 5. `RoadSample` fields (x,y,angle,scale) consumed exactly in Task 5. `useReducedMotion` returns boolean, consumed in Tasks 4,5.
- **Placeholders:** none — all steps contain concrete code or exact commands.
