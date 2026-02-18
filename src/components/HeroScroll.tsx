"use client";

import { memo, useRef, useCallback, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useScrollProgress } from "@/hooks/useScrollProgress";

interface HeroScrollProps {
  images: HTMLImageElement[];
  isLoaded: boolean;
}

const FRAME_COUNT = 120;

/** Draws an image onto a canvas with "cover" behavior */
function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  w: number,
  h: number
) {
  const r = img.naturalWidth / img.naturalHeight;
  const cr = w / h;
  let dw: number, dh: number, ox: number, oy: number;
  if (cr > r) {
    dw = w; dh = w / r; ox = 0; oy = (h - dh) / 2;
  } else {
    dh = h; dw = h * r; ox = (w - dw) / 2; oy = 0;
  }
  ctx.drawImage(img, ox, oy, dw, dh);
}

/**
 * Hero section — zoom-into-window effect:
 *
 * LAYERS (back to front):
 * 1. Canvas playing sequence-1 frames (sky/clouds) — always full-screen behind
 * 2. Window assembly (hero-back + window-frame + window-overlay) — scales up on scroll
 * 3. Text content on top
 *
 * SCROLL BEHAVIOR:
 * - 0–15%:  text fades out
 * - 0–60%:  window assembly scales from 1× → 3× (zoom into window)
 * - 30–60%: window assembly fades out, revealing full-screen canvas
 * - Canvas frames animate across full 0→120 range
 */
function HeroScrollComponent({ images, isLoaded }: HeroScrollProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentFrameRef = useRef(0);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const dimsRef = useRef({ w: 0, h: 0 });
  const contentRef = useRef<HTMLDivElement>(null);
  // windowRef now wraps the entire window assembly (background + frame + overlay)
  const windowRef = useRef<HTMLDivElement>(null);

  const revealRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(revealRef, { once: true });

  // Canvas setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;
    ctxRef.current = ctx;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      dimsRef.current = { w: rect.width, h: rect.height };
      const img = images[currentFrameRef.current];
      if (img?.complete && img.naturalWidth > 0) {
        drawCover(ctx, img, rect.width, rect.height);
      }
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });
    return () => window.removeEventListener("resize", resize);
  }, [images]);

  // Draw first frame once loaded
  useEffect(() => {
    if (!isLoaded || images.length === 0) return;
    const ctx = ctxRef.current;
    const { w, h } = dimsRef.current;
    const first = images[0];
    if (ctx && first?.complete && first.naturalWidth > 0 && w > 0) {
      drawCover(ctx, first, w, h);
    }
  }, [isLoaded, images]);

  // Scroll callback
  const handleProgress = useCallback(
    (progress: number) => {
      // ── Canvas frame animation (full range) ──────────────────────────────
      const idx = Math.min(Math.floor(progress * (FRAME_COUNT - 1)), FRAME_COUNT - 1);
      if (idx !== currentFrameRef.current) {
        const img = images[idx];
        const ctx = ctxRef.current;
        const { w, h } = dimsRef.current;
        if (ctx && img?.complete && img.naturalWidth > 0 && w > 0) {
          currentFrameRef.current = idx;
          drawCover(ctx, img, w, h);
        }
      }

      // ── Text fades out in first 15% of scroll ────────────────────────────
      if (contentRef.current) {
        const fade = progress < 0.05 ? 1 : Math.max(0, 1 - (progress - 0.05) / 0.10);
        contentRef.current.style.opacity = String(fade);
      }

      // ── Window assembly: zoom (scale) + fade ─────────────────────────────
      if (windowRef.current) {
        // Scale: 1× at rest → 3× at progress=0.6
        const zoomProgress = Math.min(progress / 0.6, 1);
        const scale = 1 + zoomProgress * 2; // 1 → 3

        // Fade: stays fully visible until 30%, then fades to 0 by 60%
        const fadeProgress = progress < 0.30 ? 0 : Math.min((progress - 0.30) / 0.30, 1);
        const opacity = 1 - fadeProgress;

        windowRef.current.style.transform = `scale(${scale})`;
        windowRef.current.style.opacity = String(opacity);
      }
    },
    [images]
  );

  const containerRef = useScrollProgress<HTMLDivElement>({
    onProgress: handleProgress,
    disabled: !isLoaded,
  });

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative h-[500vh]"
      aria-label="Hero scroll animation"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* Layer 1: Canvas (sky/clouds sequence) — always full-screen, always behind */}
        <div className="absolute inset-0 z-[1]">
          <canvas
            ref={canvasRef}
            className="w-full h-full canvas-gpu"
          />
        </div>

        {/* Layer 2: Window assembly — scales up and fades out as you zoom in */}
        <div
          ref={windowRef}
          className="absolute inset-0 z-[2] pointer-events-none"
          style={{ transformOrigin: "center center", willChange: "transform, opacity" }}
        >
          {/* 2a: Warm brown interior background */}
          <Image
            src="/hero/hero-back.webp"
            alt=""
            fill
            className="object-cover"
            priority
          />
          {/* 2b: Window frame (transparent glass cutout reveals canvas behind) */}
          <div className="absolute inset-0">
            <Image
              src="/hero/window-frame.webp"
              alt="Airplane window"
              fill
              className="object-cover"
              priority
            />
          </div>
          {/* 2c: Window glass reflections */}
          <div className="absolute inset-0">
            <Image
              src="/hero/window-overlay.webp"
              alt=""
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Layer 3: Gradient for text readability (fades with window assembly) */}
        <div className="absolute inset-0 z-[3] pointer-events-none bg-gradient-to-b from-black/20 via-transparent to-black/30" />

        {/* Layer 4: Text content */}
        <div ref={contentRef} className="absolute inset-0 z-[4]">
          <div ref={revealRef} className="relative h-full flex flex-col">

            {/* Main text area */}
            <div className="flex-1 relative flex items-center px-6 md:px-14">
              {/* Left — "We are movement" */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="absolute left-6 md:left-14 top-[26%] md:top-[30%]"
              >
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light italic text-white leading-[0.95]">
                  We are
                  <br />
                  movement
                </h1>
              </motion.div>

              {/* Right — "We are distinction" */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="absolute right-6 md:right-14 top-[46%] md:top-[50%] text-right"
              >
                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light italic text-white leading-[0.95]">
                  We are
                  <br />
                  distinction
                </h2>
              </motion.div>
            </div>

            {/* Bottom bar */}
            <div className="px-6 md:px-14 pb-8 md:pb-12">
              <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
                {/* Left — subtitle */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 1, delay: 0.8 }}
                  className="max-w-sm"
                >
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-light italic text-white mb-2 leading-tight">
                    Your freedom to
                    <br />
                    enjoy life
                  </h3>
                  <div className="w-8 h-px bg-white/30 mb-4" />
                  <p className="text-xs sm:text-sm text-white/50 leading-relaxed max-w-xs">
                    Every flight is designed around your comfort, time, and
                    ambitions — so you can focus on what truly matters, while we
                    take care of everything else.
                  </p>
                </motion.div>

                {/* Right — scroll indicator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: 1.2, duration: 1 }}
                  className="hidden md:flex items-end gap-6"
                >
                  <div className="flex items-center gap-3 text-white/40">
                    <motion.svg
                      animate={{ y: [0, 6, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      width="14" height="14" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" strokeWidth="1.5"
                    >
                      <path d="M12 5v14M5 12l7 7 7-7" />
                    </motion.svg>
                    <span className="text-[11px] tracking-[0.15em] uppercase">
                      Scroll down
                    </span>
                  </div>
                  <div className="w-20 h-px bg-white/15" />
                  <span className="text-[11px] tracking-[0.15em] uppercase text-white/40">
                    To start the journey
                  </span>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export const HeroScroll = memo(HeroScrollComponent);
