"use client";

import { useEffect, useRef, useCallback } from "react";

interface ScrollProgressOptions {
  /** Callback invoked with scroll progress (0–1) on each animation frame */
  onProgress: (progress: number) => void;
  /** Whether to disable tracking */
  disabled?: boolean;
}

/**
 * Custom hook to track scroll progress of a container element.
 *
 * Performance characteristics:
 * - Uses IntersectionObserver to only track when the container is visible
 * - Uses requestAnimationFrame for smooth 60fps updates
 * - Avoids React state updates — communicates via callback ref
 * - Cleans up rAF loop when container leaves viewport
 */
export function useScrollProgress<T extends HTMLElement>(
  options: ScrollProgressOptions
) {
  const containerRef = useRef<T>(null);
  const rafIdRef = useRef<number>(0);
  const isVisibleRef = useRef<boolean>(false);
  const lastProgressRef = useRef<number>(-1);
  const onProgressRef = useRef(options.onProgress);

  // Keep callback ref up to date without re-subscribing
  onProgressRef.current = options.onProgress;

  const calculateProgress = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Progress: 0 when container top hits viewport bottom → 1 when container bottom hits viewport top
    // For a sticky scroll, we want: 0 when top of container aligns with top of viewport
    // to 1 when bottom of container minus one viewport height aligns with top of viewport
    const scrollableDistance = rect.height - windowHeight;

    if (scrollableDistance <= 0) return;

    const rawProgress = -rect.top / scrollableDistance;
    const clampedProgress = Math.max(0, Math.min(1, rawProgress));

    // Only call back if progress actually changed (threshold: ~0.1%)
    if (Math.abs(clampedProgress - lastProgressRef.current) > 0.001) {
      lastProgressRef.current = clampedProgress;
      onProgressRef.current(clampedProgress);
    }
  }, []);

  const tick = useCallback(() => {
    if (!isVisibleRef.current) return;
    calculateProgress();
    rafIdRef.current = requestAnimationFrame(tick);
  }, [calculateProgress]);

  useEffect(() => {
    if (options.disabled) return;

    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          isVisibleRef.current = true;
          rafIdRef.current = requestAnimationFrame(tick);
        } else {
          isVisibleRef.current = false;
          cancelAnimationFrame(rafIdRef.current);
        }
      },
      {
        rootMargin: "100px 0px",
        threshold: 0,
      }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafIdRef.current);
      isVisibleRef.current = false;
    };
  }, [tick, options.disabled]);

  return containerRef;
}
