# Jesko Jets — Implementation Plan

## 1. Project Overview

**Jesko Jets** is a cinematic, luxury private aviation website featuring scroll-driven canvas animations, smooth inertial scrolling, and a premium dark-mode aesthetic. The site is designed to feel like a high-end product launch — every interaction is intentional, every transition butter-smooth.

---

## 2. Technology Stack

| Layer         | Technology                        |
| ------------- | --------------------------------- |
| Framework     | Next.js 14 (App Router)           |
| Language      | TypeScript (strict mode)          |
| Styling       | Tailwind CSS 3.4                  |
| Animation     | Framer Motion 11                  |
| Smooth Scroll | Lenis (`lenis` package)           |
| Font          | Inter (Google Fonts, `next/font`) |

---

## 3. Visual & UX Direction

### Aesthetic
- **Minimalist, premium, dark-mode luxury**
- Deep black/charcoal background (`#050505`)
- High-contrast white text
- Gold accent color (`#C9A96E`) for highlights and CTAs

### Typography
- Font: **Inter** (via `next/font/google`)
- Wide letter-spacing: `0.25em` (ultrawide), `0.4em` (megawide)
- All headings: uppercase, light weight, generous tracking
- Body text: light weight, relaxed leading, muted gray tones

### Layout Principles
- Full-viewport sticky sections for scroll animations
- Generous whitespace (py-32 to py-48 between sections)
- Max-width containers (7xl) for content sections
- Responsive grid layouts (1→2→3 columns)

---

## 4. Core Assets

| Asset              | Location                                           | Type          |
| ------------------ | -------------------------------------------------- | ------------- |
| Hero cloud sequence | `/public/sequence-1/ezgif-frame-001.jpg` → `120.jpg` | 120 JPEGs     |
| Plane morph sequence| `/public/sequence-2/ezgif-frame-001.jpg` → `120.jpg` | 120 JPEGs     |
| Globe loop video   | `/public/globe-loop.mp4`                            | MP4 video     |

---

## 5. Project Structure

```
src/
├── app/
│   ├── globals.css          # Tailwind imports + custom utilities
│   ├── layout.tsx           # Root layout (font, metadata, viewport)
│   └── page.tsx             # Main page (orchestrator)
├── components/
│   ├── SmoothScroll.tsx     # Lenis smooth scroll provider
│   ├── Navbar.tsx           # Fixed nav with glassmorphism
│   ├── Loader.tsx           # Full-screen preload progress
│   ├── HeroScroll.tsx       # Canvas scroll — sequence-1 (clouds)
│   ├── AboutSection.tsx     # Features with staggered reveals
│   ├── PlaneMorph.tsx       # Canvas scroll — sequence-2 (plane)
│   ├── FleetSection.tsx     # Aircraft cards grid
│   ├── StatsSection.tsx     # Animated counters
│   ├── Globe.tsx            # Video loop + destinations
│   └── Footer.tsx           # CTA + links + branding
├── hooks/
│   ├── useImagePreloader.ts # Batch image preloading with progress
│   └── useScrollProgress.ts # rAF-based scroll tracking
```

---

## 6. Component Architecture & Animation Logic

### 6.1 Loading Screen (`Loader.tsx`)

**Purpose:** Display while 240 images preload across both sequences.

**Behavior:**
1. Shows Jesko Jets logo with pulse animation
2. Progress bar tracks combined loading of both sequences
3. Displays percentage (0–100%) with tabular nums
4. On complete: 600ms delay → exit animation (fade out) → removed from DOM
5. Main content mounts only after loader exit completes

**Performance:** Progress state updates throttled to every 5% increment.

---

### 6.2 Hero Section (`HeroScroll.tsx`)

**Architecture:**
- Outer container: `h-[500vh]` (creates 5 viewport heights of scroll runway)
- Inner container: `position: sticky; top: 0; height: 100vh` (pins to viewport)
- `<canvas>` element fills the sticky container

**Animation Logic:**
1. `useScrollProgress` hook monitors container's scroll position
2. Maps scroll progress (0→1) to frame index (0→119)
3. Draws corresponding frame to canvas via `drawImage()` with "cover" scaling
4. Text overlays (heading, subheading, scroll indicator) fade out imperatively via refs

**Performance Optimizations:**
- Canvas context created with `{ alpha: false }` (no transparency compositing)
- Device pixel ratio scaling for crisp rendering on Retina displays
- Frame only redrawn when index changes (skip redundant draws)
- Text opacity updated via DOM refs — zero React re-renders during scroll
- IntersectionObserver gates the rAF loop (no wasted cycles off-screen)

---

### 6.3 Plane Morph Section (`PlaneMorph.tsx`)

**Same canvas architecture as HeroScroll** but with different overlay behavior:

**Three text overlay phases:**
1. **Phase 1 (5%–30%):** "Beyond First Class" — fades in at 5%, peaks at 12%, fades by 30%
2. **Phase 2 (35%–65%):** "Performance Without Compromise" — mid-sequence reveal
3. **Phase 3 (72%–100%):** "Elevate Your Standard" + CTA button — stays visible until end

All overlays updated imperatively via refs (no re-renders).

---

### 6.4 Globe Section (`Globe.tsx`)

**Implementation:**
- HTML5 `<video>` with attributes: `autoPlay`, `loop`, `muted`, `playsInline`
- `src="/globe-loop.mp4"`
- `object-cover` for full-bleed display
- **Lazy loading:** Video element only mounts when section approaches viewport (200px margin via IntersectionObserver)
- Dark gradient overlays from all directions for text legibility

---

### 6.5 Smooth Scroll (`SmoothScroll.tsx`)

**Provider component wrapping all page content.**

Configuration:
- Duration: 1.2s
- Easing: exponential ease-out → `1.001 - 2^(-10t)`
- Touch multiplier: 2x
- rAF-based update loop
- Cleanup on unmount (destroy Lenis instance, cancel rAF)

---

### 6.6 Navbar (`Navbar.tsx`)

**Behavior:**
- Fixed positioning (`z-50`)
- Transparent initially → glassmorphism (`backdrop-blur-xl`) after 50px scroll
- Hides on scroll down (past 200px), reveals on scroll up
- Logo: animated diamond shape with gold borders
- Desktop: horizontal links with gold underline hover effect
- Mobile: full-screen overlay menu with staggered animations

---

## 7. Custom Hooks

### `useImagePreloader(urls, options)`

**Strategy:**
1. **Priority frames** loaded first (frames 0, 1, 2 — for instant display)
2. **Remaining frames** loaded in batches of 12
3. Progress tracked via counter ref
4. State updates throttled to 5% increments (20 updates total per sequence)
5. Returns `{ images: HTMLImageElement[], progress: number, isLoaded: boolean }`

### `useScrollProgress<T>(options)`

**Strategy:**
1. Returns a `ref` to attach to the scroll container
2. IntersectionObserver activates/deactivates rAF loop based on visibility
3. Calculates: `progress = -container.top / (container.height - viewport.height)`
4. Clamps to [0, 1], calls back only when progress changes by >0.1%
5. Uses callback ref pattern — no re-renders, just imperative updates

---

## 8. Performance Optimization Summary

| Technique                      | Where Applied                        |
| ------------------------------ | ------------------------------------ |
| `React.memo()` on all components| Every exported component             |
| Refs instead of state for scroll| HeroScroll, PlaneMorph               |
| `{ alpha: false }` canvas      | Both canvas components               |
| DPR-aware canvas sizing         | Both canvas components               |
| IntersectionObserver gating     | useScrollProgress, Globe video       |
| Batched image preloading        | useImagePreloader                    |
| Throttled progress state        | useImagePreloader (5% increments)    |
| `will-change: transform`        | Canvas containers                    |
| rAF-based animation loops       | Scroll tracking, Lenis, counters     |
| Stable memoized URL arrays      | page.tsx (useMemo)                   |
| Imperative DOM updates          | Text overlay opacity/transforms      |
| Lazy video mounting              | Globe section                        |
| Font `display: swap`            | Inter font loading                   |

---

## 9. Page Flow (Top to Bottom)

1. **Loader** → full-screen, gold progress bar, fades out when ready
2. **Navbar** → fixed, transparent → glassmorphism on scroll
3. **HeroScroll** → 500vh, sticky canvas, sequence-1 clouds, hero text
4. **AboutSection** → "The Jesko Difference", features list with stagger
5. **PlaneMorph** → 500vh, sticky canvas, sequence-2 plane morph, 3-phase text
6. **FleetSection** → 3-column aircraft cards with specs
7. **StatsSection** → Animated counter numbers (25+, 50, 5000+, 99.8%)
8. **Globe** → Full-screen video loop, destination tags
9. **Footer** → CTA, links grid, copyright

---

## 10. Color System

```
jet-950:  #050505  — primary background
jet-900:  #0a0a0a  — card backgrounds
jet-800:  #111111  — borders, dividers
jet-700:  #1a1a1a  — subtle backgrounds
jet-400:  #555555  — muted labels
jet-300:  #888888  — body text
jet-200:  #aaaaaa  — secondary text
jet-100:  #cccccc  — highlighted body text
gold:     #C9A96E  — primary accent
gold-light: #DFC9A0 — accent highlights
gold-dark:  #A88B4A — accent shadows
white:    #ffffff  — headings
```

---

## 11. Build & Run

```bash
npm install
npm run dev      # Development server at http://localhost:3000
npm run build    # Production build
npm start        # Production server
```

---

## 12. Browser Support

- Chrome 90+
- Firefox 90+
- Safari 15+
- Edge 90+

Canvas `drawImage`, IntersectionObserver, `requestAnimationFrame`, and `backdrop-filter` are all well-supported across these targets.
