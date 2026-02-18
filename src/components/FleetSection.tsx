"use client";

import { memo, useRef, useCallback } from "react";
import Image from "next/image";
import { useScrollProgress } from "@/hooks/useScrollProgress";

interface FleetSectionProps {
  images?: HTMLImageElement[];
  isLoaded?: boolean;
}

const SPECS = [
  { label: "Maximum operating range", value: "11,263 km" },
  { label: "Speed",                   value: "480 knots" },
  { label: "Passenger capacity",      value: "Up to 12 seats (+1 cabin server)" },
  { label: "Endurance",               value: "14 hrs (Maximum for european based aircraft)" },
  { label: "Baggage capacity",        value: "5.52 m³" },
  { label: "Cruising altitude",       value: "15,544 m" },
] as const;

const DIMENSIONS = [
  { label: "Cabin length", value: "14.05 m²" },
  { label: "Cabin Width",  value: "2.49 m²"  },
  { label: "Cabin Height", value: "1.92 m²"  },
] as const;

/**
 * Fleet section — "Fly in Luxury"
 *
 * SCROLL BEHAVIOUR (three phases):
 *
 *  Phase 1 — 0 → 20 %
 *    Jet is large (scale 2.0).  "Fly in / Luxury" title visible.
 *    Title fades out.
 *
 *  Phase 2 — 20 → 60 %
 *    Jet scales DOWN  2.0 → 1.0  (shrinks to normal size, centred).
 *    Left-column  (Gulfstream 650ER + specs)  slides DOWN from above.
 *    Right-column (Ultra-long-range + desc)   slides DOWN from above.
 *
 *  Phase 3 — 60 → 90 %
 *    Jet photo  opacity 1 → 0
 *    Blueprint  opacity 0 → 1          ← seamless crossfade
 *    Both images are the same size / position, so they morph into each other.
 */
function FleetSectionComponent({ }: FleetSectionProps) {
  const titleRef     = useRef<HTMLDivElement>(null);
  const jetScaleRef  = useRef<HTMLDivElement>(null);
  const jetPhotoRef  = useRef<HTMLDivElement>(null);
  const bpRef        = useRef<HTMLDivElement>(null);
  const leftColRef   = useRef<HTMLDivElement>(null);
  const rightColRef  = useRef<HTMLDivElement>(null);

  const handleProgress = useCallback((progress: number) => {

    // ── Phase 1: title fades (0 → 20%) ──────────────────────────────────────
    const titleOpacity = progress < 0.05
      ? 1
      : Math.max(0, 1 - (progress - 0.05) / 0.12);
    if (titleRef.current) titleRef.current.style.opacity = String(titleOpacity);

    // ── Phase 2: jet shrinks (20% → 60%) ────────────────────────────────────
    //    scale: 2.0 → 1.0
    const shrinkProgress = progress < 0.20
      ? 0
      : Math.min((progress - 0.20) / 0.40, 1);
    const easedShrink = 1 - Math.pow(1 - shrinkProgress, 2); // ease-out quad
    const scale = 2.0 - easedShrink * 1.0; // 2.0 → 1.0

    if (jetScaleRef.current) {
      jetScaleRef.current.style.transform = `scale(${scale})`;
    }

    // ── Phase 2: spec columns slide down from above (20% → 55%) ─────────────
    const colProgress = progress < 0.20
      ? 0
      : Math.min((progress - 0.20) / 0.35, 1);
    const easedCol = 1 - Math.pow(1 - colProgress, 3); // ease-out cubic
    const colY = -40 + easedCol * 40;  // −40px → 0px

    if (leftColRef.current) {
      leftColRef.current.style.opacity   = String(easedCol);
      leftColRef.current.style.transform = `translateY(${colY}px)`;
    }
    if (rightColRef.current) {
      rightColRef.current.style.opacity   = String(easedCol);
      rightColRef.current.style.transform = `translateY(${colY}px)`;
    }

    // ── Phase 3: jet → blueprint crossfade (60% → 90%) ──────────────────────
    const bpProgress = progress < 0.60
      ? 0
      : Math.min((progress - 0.60) / 0.30, 1);

    if (jetPhotoRef.current) jetPhotoRef.current.style.opacity = String(1 - bpProgress);
    if (bpRef.current)       bpRef.current.style.opacity       = String(bpProgress);

  }, []);

  const scrollRef = useScrollProgress<HTMLDivElement>({
    onProgress: handleProgress,
  });

  return (
    <section id="flight" className="relative">

      {/* ── Scroll driver  (tall to give scroll room) ──────────────────── */}
      <div ref={scrollRef} className="relative h-[550vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-light-gradient">

          {/* ════════════════════════════════════════════════════════════
              THREE-COLUMN LAYOUT
              left col │ centre (jet + bp) │ right col
              The left/right cols are positioned absolute so they don't
              affect the centre's scale geometry.
          ════════════════════════════════════════════════════════════ */}

          {/* ── Left column — Gulfstream 650ER + specs ──────────────── */}
          <div
            ref={leftColRef}
            className="absolute left-8 md:left-14 top-1/2 -translate-y-1/2 z-[2] text-warm-600 w-[22vw] min-w-[200px]"
            style={{ opacity: 0, transform: "translateY(-40px)", willChange: "opacity, transform" }}
          >
            <div className="w-px h-8 bg-warm-600/20 mb-3" />
            <p className="text-sm font-light tracking-wide mb-1">Gulfstream</p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light mb-8">650ER</h2>

            {/* Spec rows */}
            <div className="space-y-0">
              {SPECS.map((spec) => (
                <div key={spec.label} className="py-[5px] border-b border-warm-600/10 last:border-0">
                  <p className="text-[10px] tracking-[0.12em] uppercase text-warm-600/45 mb-[1px]">
                    {spec.label}
                  </p>
                  <p className="text-[11px] font-medium text-warm-600 uppercase tracking-wide">
                    {spec.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Dimensions */}
            <div className="mt-5">
              <p className="text-[10px] tracking-[0.12em] uppercase text-warm-600/45 mb-2">
                Specification
              </p>
              {DIMENSIONS.map((dim) => (
                <div key={dim.label} className="flex justify-between py-[4px]">
                  <span className="text-[11px] font-semibold text-warm-600 uppercase tracking-wide">
                    {dim.label}
                  </span>
                  <span className="text-[11px] font-semibold text-warm-600 uppercase tracking-wide">
                    {dim.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Centre — jet photo + blueprint (same container, crossfade) ── */}
          <div className="absolute inset-0 z-[1] flex items-center justify-center overflow-hidden">
            {/*
             * jetScaleRef scales both images together.
             * jetPhotoRef / bpRef control which is visible.
             */}
            <div
              ref={jetScaleRef}
              className="relative flex items-center justify-center"
              style={{
                transform:   "scale(2.0)",
                willChange:  "transform",
                width:  "38vw",
                /* tall enough for portrait jet image */
                height: "80vh",
              }}
            >
              {/* Jet photo */}
              <div
                ref={jetPhotoRef}
                className="absolute inset-0"
                style={{ willChange: "opacity" }}
              >
                <Image
                  src="/fleet/jet.webp"
                  alt="Gulfstream 650ER top-down view"
                  fill
                  className="object-contain object-center"
                  priority
                />
              </div>

              {/* Blueprint (fades in during phase 3) */}
              <div
                ref={bpRef}
                className="absolute inset-0"
                style={{ opacity: 0, willChange: "opacity" }}
              >
                <Image
                  src="/fleet/blueprint.avif"
                  alt="Gulfstream 650ER interior blueprint"
                  fill
                  className="object-contain object-center"
                />
              </div>
            </div>
          </div>

          {/* ── Right column — Ultra-long-range + description ───────── */}
          <div
            ref={rightColRef}
            className="absolute right-8 md:right-14 top-1/2 -translate-y-1/2 z-[2] text-warm-600 w-[22vw] min-w-[200px]"
            style={{ opacity: 0, transform: "translateY(-40px)", willChange: "opacity, transform" }}
          >
            <h3 className="text-base md:text-lg font-light leading-snug mb-8">
              Ultra-long-range<br />Aircraft
            </h3>

            <div className="w-full h-px bg-warm-600/15 mb-5" />

            <p className="text-[10px] tracking-[0.12em] uppercase text-warm-600/45 mb-3">
              Direct Access to<br />Private Travel
            </p>

            <p className="text-[12px] text-warm-600/65 leading-relaxed">
              A true time-saving machine it brings Tokyo
              and New York an hour closer, and at 92% of
              the speed of sound, it can circle the globe
              with just a single stop.
            </p>
          </div>

          {/* ── "Fly in / Luxury" title (phase 1 only) ──────────────── */}
          <div
            ref={titleRef}
            className="absolute inset-0 z-[3] pointer-events-none flex items-center"
            style={{ willChange: "opacity" }}
          >
            {/* "Fly in" — left side */}
            <span
              className="absolute left-8 md:left-14 text-[13vw] font-light leading-none text-warm-600"
              style={{ top: "50%", transform: "translateY(-50%)" }}
            >
              Fly in
            </span>

            {/* "Luxury" — right side */}
            <span
              className="absolute right-8 md:right-14 text-[13vw] font-light leading-none text-warm-600 text-right"
              style={{ top: "50%", transform: "translateY(-50%)" }}
            >
              Luxury
            </span>

            {/* Bottom-left: tagline */}
            <div className="absolute bottom-10 left-8 md:left-14 text-warm-600">
              <p className="text-base md:text-lg font-light leading-snug">
                Luxury<br />that moves<br />with you
              </p>
            </div>

            {/* Bottom-right: model label */}
            <div className="absolute bottom-10 right-8 md:right-14 text-right text-warm-600">
              <p className="text-[11px] tracking-[0.14em] uppercase text-warm-600/50">Gulfstream</p>
              <p className="text-[13px] tracking-[0.1em] font-medium">650ER</p>
            </div>
          </div>

        </div>
      </div>
      {/* ── end sticky ─────────────────────────────────────────────── */}

    </section>
  );
}

export const FleetSection = memo(FleetSectionComponent);
