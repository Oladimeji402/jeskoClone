"use client";

import { memo, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoaderProps {
  progress: number;
  isLoaded: boolean;
  onComplete: () => void;
}

/**
 * Preloader matching the original Jesko Jets design:
 * - Dark warm gradient background
 * - "Jesko Jets" title + "Private jet charter worldwide" subtitle
 * - Minimal progress bar
 * - Fade-out transition when complete
 */
function LoaderComponent({ progress, isLoaded, onComplete }: LoaderProps) {
  const [isExiting, setIsExiting] = useState(false);

  const handleExit = useCallback(() => {
    setIsExiting(true);
    const timer = setTimeout(onComplete, 1200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  useEffect(() => {
    if (isLoaded && !isExiting) {
      const delay = setTimeout(handleExit, 500);
      return () => clearTimeout(delay);
    }
  }, [isLoaded, isExiting, handleExit]);

  const percent = Math.round(progress * 100);

  return (
    <AnimatePresence>
      {!isExiting || percent < 100 ? null : null}
      <motion.div
        key="loader"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        animate={{ opacity: isExiting ? 0 : 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-dark-gradient"
        onAnimationComplete={() => {
          if (isExiting) onComplete();
        }}
      >
        {/* Center content */}
        <div className="flex flex-col items-center gap-4">
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-5xl font-light tracking-[0.3em] text-white"
          >
            Jesko Jets
          </motion.h1>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 48 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="h-px bg-white/20"
          />

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-sm tracking-[0.2em] font-light text-white/50"
          >
            Private jet charter worldwide
          </motion.p>
        </div>

        {/* Progress bar at bottom */}
        <div className="absolute bottom-[15%] left-1/2 -translate-x-1/2 w-[280px] sm:w-[360px]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] tracking-[0.2em] text-white/40 uppercase">
              Loading experience
            </span>
            <span className="text-[11px] tracking-[0.15em] text-white/60 font-light tabular-nums">
              {percent}%
            </span>
          </div>
          <div className="h-px bg-white/10 w-full overflow-hidden">
            <motion.div
              className="h-full bg-white/40"
              initial={{ width: "0%" }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Bottom tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-[6%] text-[11px] tracking-[0.25em] text-white/30 uppercase"
        >
          Elevating every journey
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
}

export const Loader = memo(LoaderComponent);
