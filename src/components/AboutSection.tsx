"use client";

import { memo, useRef } from "react";
import { motion, useInView } from "framer-motion";

const FEATURES = [
  {
    title: "Direct Access to Private Travel",
    description:
      "Fly beyond boundaries with Jesko Jets. Our global operations ensure seamless, personalized travel experiences — from the first call to landing. Every journey is tailored to your comfort, privacy, and schedule.",
  },
  {
    title: "Your Freedom to Enjoy Life",
    description:
      "We value your time above all. Jesko Jets gives you the freedom to live, work, and relax wherever life takes you — without compromise.",
  },
  {
    title: "Precision and Excellence",
    description:
      "Each detail of your flight — from route planning to in-flight service — reflects our dedication to perfection. Our crew and fleet meet the highest global standards, ensuring reliability in every mission.",
  },
  {
    title: "Global Reach, Personal Touch",
    description:
      "With access to destinations in over 150 countries, Jesko Jets brings the world closer to you. Our experts manage every aspect of your flight, guaranteeing a smooth and effortless journey.",
  },
] as const;

function AboutSectionComponent() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      id="about"
      className="relative py-24 md:py-36 section-padding bg-dark-gradient"
      aria-label="About Jesko Jets"
    >
      <div ref={sectionRef} className="max-w-[1400px] mx-auto">
        {/* Lead text with highlight effect */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-24 md:mb-36"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[2rem] font-light leading-relaxed text-white/90 max-w-4xl">
            <span className="text-white">Jesko Jets</span>
            <sup className="text-white/60 text-sm">®</sup>{" "}
            is a private aviation operator with over{" "}
            <span className="text-white">5,000 missions</span> completed across{" "}
            <span className="text-white">150+ countries</span>. From international
            executives to global industries, our clients trust us to deliver on
            time, every time.
          </h2>
        </motion.div>

        {/* Info bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-16 md:mb-24"
        >
          <div className="flex flex-wrap items-center gap-4 md:gap-8 text-[13px] tracking-wide">
            <span className="text-white/40">est.</span>
            <div className="flex items-center gap-4">
              <span className="text-white/80">by Evgeny Demidenko</span>
              <span className="text-white/80">2013</span>
            </div>
          </div>
        </motion.div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 + i * 0.15 }}
              className="border-t border-white/10 py-8 md:py-10 pr-8"
            >
              <h3 className="text-base md:text-lg font-light text-white mb-4 tracking-wide">
                {feature.title}
              </h3>
              <div className="w-full h-px bg-white/10 mb-4" />
              <p className="text-sm text-white/50 leading-relaxed max-w-md">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export const AboutSection = memo(AboutSectionComponent);
