import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        jet: {
          950: "#050505",
          900: "#0a0a0a",
          800: "#111111",
          700: "#1a1a1a",
          600: "#222222",
          500: "#333333",
          400: "#555555",
          300: "#888888",
          200: "#aaaaaa",
          100: "#cccccc",
          50: "#e5e5e5",
        },
        warm: {
          950: "#000000",
          900: "#0C0A0A",
          800: "#181313",
          700: "#211A1A",
          600: "#292120",
          500: "#312726",
          400: "#7A716E",
          300: "#8FC2D7",
          200: "#FFF8ED",
          100: "#FFFFFF",
        },
        sky: {
          deep: "#015AA9",
          light: "#8FC2D7",
        },
        gold: {
          DEFAULT: "#C9A96E",
          light: "#DFC9A0",
          dark: "#A88B4A",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        ultrawide: "0.25em",
        megawide: "0.4em",
      },
      animation: {
        "fade-in": "fadeIn 1s ease-out forwards",
        "fade-in-up": "fadeInUp 1s ease-out forwards",
        "fade-in-slow": "fadeIn 2s ease-out forwards",
        "pulse-subtle": "pulseSubtle 3s ease-in-out infinite",
        "cloud-marquee": "cloudMarquee 48s linear infinite reverse",
        "city-scroll": "cityScroll 20s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        cloudMarquee: {
          from: { transform: "translateX(-50%)" },
          to: { transform: "translateX(0%)" },
        },
        cityScroll: {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
