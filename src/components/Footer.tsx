"use client";

import { memo } from "react";

/**
 * Footer — compact, matching the original jeskojets.com design.
 *
 * Layout:
 *  ┌──────────────────────────────────────────────────────────────┐
 *  │  Fly anywhere with total          info@jeskojets.com         │
 *  │  comfort and control              +971 54 432 5050           │
 *  │                                              FOR INQUIRIES   │
 *  ├──────────────────────────────────────────────────────────────┤
 *  │  ©2026 JESKO JETS…   PRIVACY POLICY   MADE BY  THE FIRST…  │
 *  └──────────────────────────────────────────────────────────────┘
 */
function FooterComponent() {
  const year = new Date().getFullYear();

  return (
    <footer
      id="contact"
      className="relative bg-dark-gradient section-padding text-white"
    >
      <div className="max-w-[1400px] mx-auto">

        {/* ── Top row: tagline + contact ─────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-10 pb-6">

          {/* Left — tagline */}
          <h2 className="text-sm md:text-base font-light text-white/70 leading-relaxed max-w-[220px]">
            Fly anywhere with total comfort and control
          </h2>

          {/* Right — contact */}
          <div className="flex flex-col items-start md:items-end gap-1">
            <a
              href="mailto:info@jeskojets.com"
              className="text-sm font-light text-white/80 hover:text-white transition-colors tracking-wide"
            >
              info@jeskojets.com
            </a>
            <a
              href="tel:+971544325050"
              className="text-sm font-light text-white/80 hover:text-white transition-colors tracking-wide"
            >
              +971 54 432 5050
            </a>
            <span className="text-[10px] tracking-[0.18em] uppercase text-white/30 mt-1">
              For inquiries
            </span>
          </div>
        </div>

        {/* ── Divider ────────────────────────────────────────────────── */}
        <div className="w-full h-px bg-white/10" />

        {/* ── Bottom bar: copyright + privacy + credits ──────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4">

          {/* Left — copyright + privacy */}
          <div className="flex items-center gap-6">
            <span className="text-[10px] tracking-[0.12em] uppercase text-white/30">
              ©{year} Jesko Jets. All rights reserved
            </span>
            <a
              href="#"
              className="text-[10px] tracking-[0.12em] uppercase text-white/30 hover:text-white/60 transition-colors"
            >
              Privacy Policy
            </a>
          </div>

          {/* Right — made by */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] tracking-[0.12em] uppercase text-white/30">
              Made by
            </span>
            <span className="text-[10px] tracking-[0.12em] uppercase text-white/30">
              The First The Last
            </span>
            {/* small circular icon matching original */}
            <svg
              width="14" height="14" viewBox="0 0 14 14"
              fill="none"
              className="text-white/25"
            >
              <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1" />
              <circle cx="7" cy="7" r="2" fill="currentColor" />
            </svg>
          </div>
        </div>

      </div>
    </footer>
  );
}

export const Footer = memo(FooterComponent);
