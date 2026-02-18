"use client";

import { memo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Floating "Book the Flight" CTA button — matching original.
 * Fixed at bottom center, opens a contact popup.
 */
function CTAButtonComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsOpen(false);
      setTimeout(() => setIsSubmitted(false), 500);
    }, 2000);
  }, []);

  return (
    <>
      {/* Floating button */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60]">
        <motion.button
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-3 bg-white text-black px-6 py-3 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.4)] transition-shadow group"
        >
          <span className="text-sm tracking-wide">Book the Flight</span>
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
              <path d="M16.8336 6.29137C16.2298 6.00004 15.4795 5.9162 14.9375 5.89587C14.4581 5.87471 14 6.00004 13.5833 6.20837L10.521 7.60404L5.85474 6.16687C5.79208 6.14571 5.72942 6.14571 5.68791 6.18803L4.77158 6.6462C4.70892 6.6877 4.64625 6.75036 4.64625 6.83337C4.64625 6.91638 4.66741 6.97904 4.72926 7.0417L7.60447 9.12504L4.64635 10.6875L2.70868 9.39604C2.62567 9.35453 2.54185 9.35453 2.45885 9.39604L1.77118 9.8542C1.66701 9.91687 1.64585 10.0625 1.70852 10.1667L3.54202 12.875C3.58352 12.9377 3.66734 12.9792 3.75035 12.9792L5.79218 12.7497C5.81334 12.7497 5.83369 12.7497 5.85485 12.7285L9.10526 11.3117L8.43876 15.4369C8.4176 15.4996 8.43876 15.5622 8.48027 15.6241C8.52177 15.6656 8.58443 15.7071 8.6471 15.7071H9.83443C9.91744 15.7071 10.0013 15.6656 10.0428 15.5818L12.7298 9.74845L16.2715 8.20711C16.5425 8.1241 16.8135 7.91578 17.0633 7.64478C17.2717 7.41528 17.3547 7.29078 17.2928 6.99861C17.292 6.66657 17.1049 6.43709 16.8339 6.29143L16.8336 6.29137Z" fill="white"/>
            </svg>
          </div>
        </motion.button>
      </div>

      {/* Contact popup */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.96 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-x-4 top-[10%] bottom-[10%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-lg z-[80] bg-warm-200 text-warm-600 rounded-lg overflow-auto"
            >
              <div className="p-8 md:p-12">
                {/* Close button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-warm-600/10 hover:bg-warm-600/20 transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M8 7.058l3.3-3.3.943.943L8.943 8l3.3 3.3-.943.943L8 8.943l-3.3 3.3-.943-.943L7.057 8l-3.3-3.3.943-.943L8 7.058z" fill="currentColor"/>
                  </svg>
                </button>

                {!isSubmitted ? (
                  <form onSubmit={handleSubmit}>
                    <h3 className="text-3xl md:text-4xl font-light mb-10">Contact</h3>

                    <div className="space-y-6">
                      <div>
                        <label className="text-[13px] tracking-wide text-warm-600/50 block mb-2">Name</label>
                        <input
                          type="text"
                          required
                          placeholder="Type..."
                          className="w-full bg-transparent border-b border-warm-600/20 pb-3 text-base focus:border-warm-600/50 outline-none transition-colors placeholder:text-warm-600/30"
                        />
                      </div>
                      <div>
                        <label className="text-[13px] tracking-wide text-warm-600/50 block mb-2">Email</label>
                        <input
                          type="email"
                          required
                          placeholder="Email..."
                          className="w-full bg-transparent border-b border-warm-600/20 pb-3 text-base focus:border-warm-600/50 outline-none transition-colors placeholder:text-warm-600/30"
                        />
                      </div>
                      <div>
                        <label className="text-[13px] tracking-wide text-warm-600/50 block mb-2">Phone</label>
                        <input
                          type="tel"
                          required
                          placeholder="Phone..."
                          className="w-full bg-transparent border-b border-warm-600/20 pb-3 text-base focus:border-warm-600/50 outline-none transition-colors placeholder:text-warm-600/30"
                        />
                      </div>
                      <div>
                        <label className="text-[13px] tracking-wide text-warm-600/50 block mb-2">Arriving</label>
                        <input
                          type="text"
                          placeholder="City, Country..."
                          className="w-full bg-transparent border-b border-warm-600/20 pb-3 text-base focus:border-warm-600/50 outline-none transition-colors placeholder:text-warm-600/30"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="mt-10 w-10 h-10 bg-warm-600 rounded-full flex items-center justify-center hover:bg-warm-500 transition-colors"
                    >
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M10.035 9.333L6.667 14.667H5.333L7.018 9.333H3.445L2.333 11.333H1.333L2 8.333 1.333 5.333h1l1.112 2h3.573L5.333 2h1.334L10.035 7.333H13.667c.552 0 1 .448 1 1s-.448 1-1 1H10.035z" fill="white"/>
                      </svg>
                    </button>

                    <p className="mt-6 text-[11px] text-warm-600/40">
                      By submitting, you agree to our Privacy Policy
                    </p>
                  </form>
                ) : (
                  <div className="text-center py-16">
                    <h3 className="text-3xl md:text-4xl font-light mb-4">Thank you!</h3>
                    <p className="text-sm text-warm-600/60">Our team will get back to you shortly</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export const CTAButton = memo(CTAButtonComponent);
