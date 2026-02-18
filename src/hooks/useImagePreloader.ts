"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface PreloaderState {
  /** Array of loaded HTMLImageElement objects, indexed by frame number */
  images: HTMLImageElement[];
  /** Loading progress from 0 to 1 */
  progress: number;
  /** Whether all images have been loaded */
  isLoaded: boolean;
}

interface PreloaderOptions {
  /** Number of images to load in each batch */
  batchSize?: number;
  /** Priority frames to load first (indices) */
  priorityFrames?: number[];
}

/**
 * Custom hook to preload a sequence of images for canvas-based scrollytelling.
 *
 * Performance strategy:
 * - Loads priority frames first (first and last) for instant display
 * - Remaining frames load in configurable batches
 * - Uses Image() constructor for off-screen loading
 * - Stores images in a ref to avoid re-renders during batch loads
 * - Only triggers state updates on progress milestones and completion
 *
 * NOTE: Properly handles React Strict Mode double-mount by resetting
 * all tracking state in cleanup and re-initializing on remount.
 */
export function useImagePreloader(
  urls: string[],
  options: PreloaderOptions = {}
): PreloaderState {
  const { batchSize = 10, priorityFrames = [0] } = options;

  const imagesRef = useRef<HTMLImageElement[]>([]);
  const loadedCountRef = useRef<number>(0);
  const isMountedRef = useRef<boolean>(true);

  const [progress, setProgress] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const loadSingleImage = useCallback(
    (url: string, index: number, imageStore: HTMLImageElement[]): Promise<void> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.decoding = "async";

        img.onload = () => {
          if (!isMountedRef.current) {
            resolve();
            return;
          }

          imageStore[index] = img;
          loadedCountRef.current += 1;

          const currentProgress = loadedCountRef.current / urls.length;

          // Throttle state updates: only update every 5% or on completion
          const prevMilestone = Math.floor(
            ((loadedCountRef.current - 1) / urls.length) * 20
          );
          const currMilestone = Math.floor(currentProgress * 20);

          if (
            currMilestone > prevMilestone ||
            loadedCountRef.current === urls.length
          ) {
            setProgress(currentProgress);
          }

          if (loadedCountRef.current === urls.length) {
            setIsLoaded(true);
          }

          resolve();
        };

        img.onerror = () => {
          if (!isMountedRef.current) {
            resolve();
            return;
          }
          // On error, still count as "loaded" to not block progress
          loadedCountRef.current += 1;

          const currentProgress = loadedCountRef.current / urls.length;
          if (loadedCountRef.current === urls.length) {
            setProgress(1);
            setIsLoaded(true);
          } else {
            const prevMilestone = Math.floor(
              ((loadedCountRef.current - 1) / urls.length) * 20
            );
            const currMilestone = Math.floor(currentProgress * 20);
            if (currMilestone > prevMilestone) {
              setProgress(currentProgress);
            }
          }

          resolve();
        };

        img.src = url;
      });
    },
    [urls.length]
  );

  useEffect(() => {
    if (urls.length === 0) return;

    // Reset all state for fresh start (handles React Strict Mode remount)
    isMountedRef.current = true;
    loadedCountRef.current = 0;
    setProgress(0);
    setIsLoaded(false);

    // Pre-allocate array
    const imageStore = new Array<HTMLImageElement>(urls.length);
    imagesRef.current = imageStore;

    let cancelled = false;

    const loadSequence = async () => {
      // 1. Load priority frames first
      const priorityPromises = priorityFrames
        .filter((i) => i >= 0 && i < urls.length)
        .map((i) => loadSingleImage(urls[i], i, imageStore));
      await Promise.all(priorityPromises);

      if (cancelled) return;

      // 2. Load remaining frames in batches
      const remaining = Array.from({ length: urls.length }, (_, i) => i).filter(
        (i) => !priorityFrames.includes(i)
      );

      for (
        let batchStart = 0;
        batchStart < remaining.length;
        batchStart += batchSize
      ) {
        if (cancelled) break;

        const batch = remaining.slice(batchStart, batchStart + batchSize);
        await Promise.all(
          batch.map((i) => loadSingleImage(urls[i], i, imageStore))
        );
      }
    };

    loadSequence();

    return () => {
      cancelled = true;
      isMountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urls, batchSize]);

  return {
    images: imagesRef.current,
    progress,
    isLoaded,
  };
}

/**
 * Generates an array of image URLs for a sequence folder.
 */
export function generateSequenceUrls(
  folder: string,
  count: number,
  prefix: string = "ezgif-frame-",
  extension: string = "jpg"
): string[] {
  return Array.from({ length: count }, (_, i) => {
    const frameNum = String(i + 1).padStart(3, "0");
    return `${folder}/${prefix}${frameNum}.${extension}`;
  });
}
