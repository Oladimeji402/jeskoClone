"use client";

import { memo, useRef } from "react";
import { motion, useInView } from "framer-motion";

const CITIES = [
  "Zurich", "Berlin", "Singapore", "Mexico City", "Dubai", "Nice",
  "Lagos", "Riyadh", "Bangkok", "São Paulo", "London", "Sydney",
  "Doha", "Mykonos", "New York", "Marrakech", "Hong Kong", "Los Angeles",
  "Milan", "Cape Town", "Miami", "Abu Dhabi", "Seoul", "Cairo",
  "Geneva", "Paris", "Toronto", "Melbourne", "Tel Aviv", "Shanghai", "Tokyo",
];

/**
 * Globe/Destinations section matching the original:
 * - "Fly anywhere" text with plane icon
 * - Scrolling city names
 * - Large "Global" SVG title
 * - Globe video
 * - "5K+ flights" factoid card
 */
function GlobeComponent() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      id="global"
      className="relative bg-dark-gradient overflow-hidden"
      aria-label="Global destinations"
    >
      <div ref={sectionRef} className="py-24 md:py-36 section-padding">
        <div className="max-w-[1400px] mx-auto">
          {/* Fly anywhere + Cities */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-24 md:mb-36">
            {/* Left — Title */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="flex items-center gap-4"
            >
              <h2 className="text-lg font-light text-white text-right">
                Fly anywhere
              </h2>
              <div className="flex items-center gap-2">
                <div className="w-12 h-px bg-white/20" />
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white/60">
                  <path d="M15.0526 14L10 22L8 22L10.5263 14L5.1667 14L3.5 17L2 17L3 12.5L2 8L3.5 8L5.1667 11L10.5263 11L8 3L10 3L15.0526 11L20.5 11C21.3284 11 22 11.6716 22 12.5C22 13.3284 21.3284 14 20.5 14L15.0526 14Z" fill="currentColor"/>
                </svg>
                <div className="w-12 h-px bg-white/20" />
              </div>
            </motion.div>

            {/* Center — Scrolling cities */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-[200px] overflow-hidden relative"
            >
              <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />
              <div className="city-scroll">
                {[...CITIES, ...CITIES].map((city, i) => (
                  <div key={`${city}-${i}`} className="py-1">
                    <span className="text-base font-light text-white/80">{city}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right — empty for layout balance */}
            <div />
          </div>

          {/* Globe video */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="relative w-full max-w-[800px] mx-auto aspect-square mb-24"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover rounded-full"
              style={{
                maskImage: "radial-gradient(circle, black 45%, transparent 70%)",
                WebkitMaskImage: "radial-gradient(circle, black 45%, transparent 70%)",
              }}
            >
              <source src="/globe-loop.mp4" type="video/mp4" />
            </video>
          </motion.div>

          {/* 5K+ flights factoid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="max-w-md mx-auto text-center"
          >
            <h3 className="text-4xl md:text-5xl font-light text-white mb-4">
              5K+ flights
            </h3>
            <p className="text-[13px] tracking-wide text-white/40 mb-6">
              Successfully arranged
            </p>
            <p className="text-sm text-white/50 leading-relaxed">
              Each journey reflects years of expertise, precision, and trust. From
              last-minute charters to intercontinental business routes — Jesko Jets
              ensures safety, discretion, and excellence in every flight.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export const Globe = memo(GlobeComponent);
