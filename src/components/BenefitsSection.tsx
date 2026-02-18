"use client";

import { memo, useRef, useState, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Image from "next/image";

const BENEFITS = [
  {
    id: "pets",
    title: "Pets",
    description:
      "Traveling with pets on a private jet means comfort and peace of mind for both owners and their companions. Our dedicated team ensures seamless arrangements, from documentation and safety to onboard care, so that your pet enjoys the same level of attention and luxury as you do.",
    image: "/benefits/pets.webp",
  },
  {
    id: "availability",
    title: "24/7 availability",
    description:
      "Our team is available around the clock to handle any request, no matter the time zone or urgency. From last-minute flight arrangements to personalized services, we provide seamless support whenever you need it. With us, assistance is never more than a call away.",
    image: "/benefits/availability.webp",
  },
  {
    id: "onboard",
    title: "Onboard services",
    description:
      "Every flight is tailored with a range of personalized onboard services designed to elevate your journey. From fine dining and curated entertainment to attentive crew and seamless connectivity, every detail is arranged to ensure maximum comfort and enjoyment in the air.",
    image: "/benefits/onboard.webp",
  },
  {
    id: "efficient",
    title: "Efficient",
    description:
      "Efficiency is at the core of every flight we operate. From optimized routes and streamlined procedures to quick boarding and smooth ground handling, we make sure your time is always used wisely. The result is a seamless journey that gets you where you need to be, faster and without compromise.",
    image: "/benefits/efficient.webp",
  },
] as const;

/**
 * Benefits/Advantages section — accordion cards with images
 * Matching the original site's expandable benefit cards.
 */
function BenefitsSectionComponent() {
  const [openId, setOpenId] = useState<string | null>("pets");
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const toggle = useCallback((id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  }, []);

  const activeBenefit = BENEFITS.find((b) => b.id === openId);

  return (
    <section
      id="benefits"
      className="relative py-24 md:py-36 section-padding bg-light-gradient text-warm-600"
      aria-label="Advantages"
    >
      <div ref={sectionRef} className="max-w-[1400px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="w-px h-8 bg-warm-600/20 mb-3" />
          <h2 className="text-[13px] tracking-wide">A Better Way to Fly</h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left — Accordion */}
          <div>
            {BENEFITS.map((benefit, i) => (
              <motion.div
                key={benefit.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
              >
                <div className="w-px h-4 bg-warm-600/15" />
                <button
                  onClick={() => toggle(benefit.id)}
                  className="w-full flex items-center justify-between py-5 group text-left"
                >
                  <h3 className="text-lg md:text-xl font-light tracking-wide group-hover:opacity-70 transition-opacity">
                    {benefit.title}
                  </h3>
                  <div className="relative w-6 h-6 flex items-center justify-center">
                    {/* Minus */}
                    <span className="absolute w-4 h-px bg-warm-600/60" />
                    {/* Plus (vertical, rotates away when open) */}
                    <motion.span
                      animate={{ rotate: openId === benefit.id ? 90 : 0, opacity: openId === benefit.id ? 0 : 1 }}
                      transition={{ duration: 0.3 }}
                      className="absolute w-px h-4 bg-warm-600/60"
                    />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {openId === benefit.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pb-6 pt-2">
                        <p className="text-sm text-warm-600/60 leading-relaxed max-w-md">
                          {benefit.description}
                        </p>
                        {/* Mobile image */}
                        <div className="mt-6 lg:hidden relative w-full aspect-[4/3] rounded-sm overflow-hidden">
                          <Image
                            src={benefit.image}
                            alt={benefit.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
            <div className="w-px h-4 bg-warm-600/15" />
          </div>

          {/* Right — Active image (desktop) */}
          <div className="hidden lg:block">
            <div className="sticky top-32 relative w-full aspect-[3/4] rounded-sm overflow-hidden">
              <AnimatePresence mode="wait">
                {activeBenefit && (
                  <motion.div
                    key={activeBenefit.id}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={activeBenefit.image}
                      alt={activeBenefit.title}
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export const BenefitsSection = memo(BenefitsSectionComponent);
