"use client";

import { memo, useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";

/**
 * Data/Stats section — matching original:
 * 174 countries | Based in Dubai, UAE | Local time (live clock)
 */
function StatsSectionComponent() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      // Dubai time (UTC+4)
      const dubaiTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Dubai" }));
      setTime(
        dubaiTime.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="data"
      className="relative py-12 section-padding bg-light-gradient text-warm-600 border-t border-warm-600/10"
    >
      <div ref={ref} className="max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="w-px h-6 bg-warm-600/20 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4">
            {/* Countries */}
            <div className="flex items-baseline justify-between md:justify-start md:gap-4">
              <span className="text-[13px] text-warm-600/50 tracking-wide">Countries supported</span>
              <span className="text-[13px] text-warm-600">174</span>
            </div>

            {/* Based in */}
            <div className="flex items-baseline justify-between md:justify-start md:gap-4">
              <span className="text-[13px] text-warm-600/50 tracking-wide">Based in</span>
              <span className="text-[13px] text-warm-600">Dubai, UAE</span>
            </div>

            {/* Local time */}
            <div className="flex items-baseline justify-between md:justify-start md:gap-4">
              <span className="text-[13px] text-warm-600/50 tracking-wide">Local time</span>
              <span className="text-3xl md:text-4xl font-light text-warm-600 tabular-nums">{time}</span>
            </div>
          </div>
          <div className="mt-4 w-px h-6 bg-warm-600/20" />
        </motion.div>
      </div>
    </section>
  );
}

export const StatsSection = memo(StatsSectionComponent);
