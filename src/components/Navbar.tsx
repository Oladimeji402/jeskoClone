"use client";

import { memo, useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Our Fleet", href: "#flight" },
  { label: "Advantages", href: "#benefits" },
  { label: "Global", href: "#global" },
] as const;

/** Inline SVG replica of the JESKO JETS wordmark */
function LogoSVG({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 420 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M137 34V2H141.96V23.8373H142.008L171.67 9.97908H181.978L157.617 21.1143L183.145 34H173.323L152.657 23.3997L141.96 28.3108V34H137Z" fill="currentColor"/>
      <path d="M397.198 34.7539C380.373 34.7539 377.65 29.6969 377.65 26.1472H382.416C382.464 28.3354 384.215 30.8639 397.198 30.8639C409.84 30.8639 413.001 29.0648 413.001 26.7794C413.001 25.8555 412.466 24.9316 410.424 24.5912C407.701 24.105 401.72 24.1536 396.614 24.0077C389.564 23.8132 383.777 23.2783 381.395 22.4517C378.672 21.5278 377.65 19.7287 377.65 17.8809C377.65 12.8239 384.993 9.46875 397.198 9.46875C412.855 9.46875 416.113 13.7964 416.113 18.2213H411.348C411.348 15.4983 409.111 13.3588 397.295 13.3588C387.959 13.3588 382.61 14.9148 382.61 17.3947C382.61 18.4644 383.34 19.2424 385.479 19.6801C387.473 20.0691 393.016 20.215 399.24 20.3608C405.561 20.5067 410.813 20.7498 413.828 21.5765C417.231 22.5003 417.961 24.5912 417.961 26.3904C417.961 30.4263 413.876 34.7539 397.198 34.7539Z" fill="currentColor"/>
      <path d="M365.374 34.1466C351.808 34.1466 347.189 30.1107 347.189 24.1298V14.0643H340.187V9.88256H345.924C347.043 9.88256 347.432 9.39631 347.529 8.18067L347.772 4.43652H352.148V9.88256H370.675C372.984 9.88256 374.856 11.7548 374.856 14.0643V14.0643H352.148V23.3032C352.148 27.3391 353.899 29.9648 365.374 29.9648C369.945 29.9648 373.252 29.6731 374.808 29.4786V33.5631C373.495 33.8062 369.897 34.1466 365.374 34.1466Z" fill="currentColor"/>
      <path d="M337.39 21.4792V23.327H300.094C300.678 27.2656 304.519 30.6694 317.162 30.6694C328.103 30.6694 332.041 28.4326 332.722 26.2931H337.39C336.806 30.2804 331.166 34.6567 317.162 34.6567C299.754 34.6567 295.086 28.1409 295.086 22.2572C295.086 14.623 303.109 9.46875 316.87 9.46875C331.02 9.46875 337.39 14.1854 337.39 21.4792ZM332.722 20.0204V19.8746C332.722 16.1304 328.054 13.456 317.016 13.456C307.194 13.456 301.748 15.8387 300.386 20.0204H332.722Z" fill="currentColor"/>
      <path d="M270.019 34.7782C256.161 34.7782 248.673 29.8184 248.673 20.531C248.673 19.6071 248.77 18.0997 248.867 17.4676H253.827C253.778 17.9052 253.633 19.1208 253.633 20.3851C253.633 26.9981 259.225 30.3047 270.019 30.3047C280.279 30.3047 286.941 27.1926 286.941 18.975V2H292.29V18.4401C292.29 29.8184 283.343 34.7782 270.019 34.7782Z" fill="currentColor"/>
      <path d="M202.124 34.6567C185.932 34.6567 179.659 28.4326 179.659 22.1113C179.659 15.8387 186.078 9.46875 202.124 9.46875C218.17 9.46875 224.589 15.8387 224.589 22.1113C224.589 28.4326 218.316 34.6567 202.124 34.6567ZM202.124 30.4749C214.913 30.4749 219.629 26.439 219.629 22.1113C219.629 17.7837 214.864 13.6505 202.124 13.6505C189.384 13.6505 184.619 17.7837 184.619 22.1113C184.619 26.3904 189.336 30.4749 202.124 30.4749Z" fill="currentColor"/>
      <path d="M113.443 34.7539C96.6185 34.7539 93.8955 29.6969 93.8955 26.1472H98.6608C98.7094 28.3354 100.46 30.8639 113.443 30.8639C126.085 30.8639 129.246 29.0648 129.246 26.7794C129.246 25.8555 128.711 24.9316 126.669 24.5912C123.946 24.105 117.965 24.1536 112.859 24.0077C105.809 23.8132 100.022 23.2783 97.6397 22.4517C94.9166 21.5278 93.8955 19.7287 93.8955 17.8809C93.8955 12.8239 101.238 9.46875 113.443 9.46875C129.1 9.46875 132.358 13.7964 132.358 18.2213H127.593C127.593 15.4983 125.356 13.3588 113.54 13.3588C104.204 13.3588 98.8553 14.9148 98.8553 17.3947C98.8553 18.4644 99.5847 19.2424 101.724 19.6801C103.718 20.0691 109.261 20.215 115.485 20.3608C121.806 20.5067 127.058 20.7498 130.073 21.5765C133.477 22.5003 134.206 24.5912 134.206 26.3904C134.206 30.4263 130.121 34.7539 113.443 34.7539Z" fill="currentColor"/>
      <path d="M91.099 21.4792V23.327H53.8033C54.3868 27.2656 58.2282 30.6694 70.8708 30.6694C81.8115 30.6694 85.7502 28.4326 86.4309 26.2931H91.099C90.5155 30.2804 84.8749 34.6567 70.8708 34.6567C53.463 34.6567 48.7949 28.1409 48.7949 22.2572C48.7949 14.623 56.8181 9.46875 70.5791 9.46875C84.729 9.46875 91.099 14.1854 91.099 21.4792ZM86.4309 20.0204V19.8746C86.4309 16.1304 81.7629 13.456 70.725 13.456C60.9026 13.456 55.4566 15.8387 54.0951 20.0204H86.4309Z" fill="currentColor"/>
      <path d="M23.7284 34.7782C9.87014 34.7782 2.38184 29.8184 2.38184 20.531C2.38184 19.6071 2.47909 18.0997 2.57634 17.4676H7.53612C7.4875 17.9052 7.34162 19.1208 7.34162 20.3851C7.34162 26.9981 12.9335 30.3047 23.7284 30.3047C33.9883 30.3047 40.65 27.1926 40.65 18.975V2H45.9988V18.4401C45.9988 29.8184 37.0517 34.7782 23.7284 34.7782Z" fill="currentColor"/>
    </svg>
  );
}

/** Nav link with slide-up hover effect (matching original) */
function NavLink({ label, href, onClick }: { label: string; href: string; onClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void }) {
  return (
    <a
      href={href}
      onClick={(e) => onClick(e, href)}
      className="nav-item-hover text-[13px] tracking-wide text-white/80 hover:text-white transition-colors duration-300"
    >
      <span className="nav-text-1">{label}</span>
      <span className="nav-text-2">{label}</span>
    </a>
  );
}

function NavbarComponent() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const handleScroll = useCallback(() => {
    if (ticking.current) return;
    ticking.current = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      setIsScrolled(y > 50);
      if (y > lastScrollY.current && y > 300) {
        setIsVisible(false);
        setIsMobileMenuOpen(false);
      } else {
        setIsVisible(true);
      }
      lastScrollY.current = y;
      ticking.current = false;
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      setIsMobileMenuOpen(false);
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    },
    []
  );

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: isVisible ? 0 : -100, opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
          isScrolled ? "bg-black/60 backdrop-blur-xl" : "bg-transparent"
        }`}
      >
        <nav className="flex items-center justify-between px-6 md:px-10 lg:px-14 py-5">
          {/* Left — nav links */}
          <div className="hidden md:flex items-center gap-8 lg:gap-10">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.label} {...link} onClick={handleNavClick} />
            ))}
          </div>

          {/* Center — logo */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, "#hero")}
            className="absolute left-1/2 -translate-x-1/2 hidden md:block"
          >
            <LogoSVG className="w-[160px] lg:w-[200px] text-white" />
          </a>

          {/* Right — contact */}
          <div className="hidden md:flex items-center gap-8 lg:gap-10">
            <a
              href="tel:+971544325050"
              className="nav-item-hover text-[13px] tracking-wide text-white/80 hover:text-white transition-colors"
            >
              <span className="nav-text-1">+971 54 432 5050</span>
              <span className="nav-text-2">+971 54 432 5050</span>
            </a>
            <a
              href="mailto:info@jeskojets.com"
              className="nav-item-hover text-[13px] tracking-wide text-white/80 hover:text-white transition-colors"
            >
              <span className="nav-text-1">info@jeskojets.com</span>
              <span className="nav-text-2">info@jeskojets.com</span>
            </a>
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center justify-between w-full">
            <LogoSVG className="w-[120px] text-white" />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex flex-col gap-1.5 p-2"
              aria-label="Toggle menu"
            >
              <motion.span animate={{ rotate: isMobileMenuOpen ? 45 : 0, y: isMobileMenuOpen ? 6 : 0 }} className="block w-6 h-px bg-white origin-center" />
              <motion.span animate={{ opacity: isMobileMenuOpen ? 0 : 1 }} className="block w-6 h-px bg-white" />
              <motion.span animate={{ rotate: isMobileMenuOpen ? -45 : 0, y: isMobileMenuOpen ? -6 : 0 }} className="block w-6 h-px bg-white origin-center" />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-2xl md:hidden flex flex-col items-center justify-center gap-8"
          >
            {NAV_LINKS.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="text-2xl tracking-widest font-light"
              >
                {link.label}
              </motion.a>
            ))}
            <div className="mt-8 flex flex-col items-center gap-4 text-sm text-white/60">
              <a href="tel:+971544325050">+971 54 432 5050</a>
              <a href="mailto:info@jeskojets.com">info@jeskojets.com</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export const Navbar = memo(NavbarComponent);
