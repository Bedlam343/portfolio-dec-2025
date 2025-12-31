'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';

export default function ScrollHint() {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      // If the user scrolls even a little bit (threshold > 10), hide the hint
      if (Math.abs(e.deltaY) > 10) {
        setHasScrolled(true);
      }
    };

    // Listen for the wheel event since the page might not actually "scroll"
    // (content fits viewport)
    window.addEventListener('wheel', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleScroll);
    };
  }, []);

  return (
    <AnimatePresence>
      {!hasScrolled && (
        <motion.div
          // Initial Entrance
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          // Exit Animation (Fade out and move down slightly)
          exit={{ opacity: 0, y: 10, transition: { duration: 0.5 } }}
          transition={{
            delay: 2.5, // Wait for intro to finish
            duration: 1,
          }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 pointer-events-none mix-blend-difference"
        >
          {/* Mouse Icon */}
          <div className="w-5 h-8 border-[1.5px] border-theme-white/40 rounded-full flex justify-center pt-1.5">
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-0.5 h-1.5 bg-theme-white/60 rounded-full"
            />
          </div>

          {/* Tech-styled Text */}
          <p className="font-inter text-[10px] tracking-[0.2em] text-theme-white/40 uppercase">
            {'/// Scroll to Boost ///'}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
