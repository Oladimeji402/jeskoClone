"use client";

import { useState, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { useImagePreloader, generateSequenceUrls } from "@/hooks/useImagePreloader";


import { Loader } from "@/components/Loader";
import { Navbar } from "@/components/Navbar";
import { HeroScroll } from "@/components/HeroScroll";
import { AboutSection } from "@/components/AboutSection";
import { FleetSection } from "@/components/FleetSection";
import { BenefitsSection } from "@/components/BenefitsSection";
import { StatsSection } from "@/components/StatsSection";
import { Globe } from "@/components/Globe";
import { Footer } from "@/components/Footer";
import { CTAButton } from "@/components/CTAButton";

const SmoothScroll = dynamic(() => import("@/components/SmoothScroll"), { ssr: false });
const CustomCursor = dynamic(
  () => import("@/components/CustomCursor").then((m) => ({ default: m.CustomCursor })),
  { ssr: false }
);

/** Frame counts */
const HERO_FRAMES = 120;

export default function Home() {
  const [loaderDone, setLoaderDone] = useState(false);

  // Generate URLs for hero sequence
  const heroUrls = useMemo(() => generateSequenceUrls("/sequence-1", HERO_FRAMES), []);

  // Preload hero images
  const hero = useImagePreloader(heroUrls, {
    batchSize: 15,
    priorityFrames: [0, 1, 2, 59, 119],
  });

  const totalProgress = hero.progress;
  const allLoaded = hero.isLoaded;

  const handleLoaderComplete = useCallback(() => {
    setLoaderDone(true);
  }, []);

  return (
    <>
      {/* Preloader */}
      {!loaderDone && (
        <Loader
          progress={totalProgress}
          isLoaded={allLoaded}
          onComplete={handleLoaderComplete}
        />
      )}

      {/* Custom cursor (desktop only) */}
      <CustomCursor />

      {/* Main site content */}
      <SmoothScroll>
        <main>
          {/* Navigation */}
          <Navbar />

          {/* Hero — airplane window with scrolling clouds (sequence-1) */}
          <HeroScroll images={hero.images} isLoaded={hero.isLoaded} />

          {/* Sky-to-light transition */}
          <div className="relative h-[40vh] bg-sky-gradient" aria-hidden="true" />

          {/* About */}
          <AboutSection />

          {/* Fleet — Fly in Luxury + Gulfstream 650ER flying + specs */}
          <FleetSection />

          {/* Benefits accordion */}
          <BenefitsSection />

          {/* Stats bar */}
          <StatsSection />

          {/* Globe / Destinations */}
          <Globe />

          {/* Footer */}
          <Footer />
        </main>
      </SmoothScroll>

      {/* Floating CTA */}
      {loaderDone && <CTAButton />}
    </>
  );
}
