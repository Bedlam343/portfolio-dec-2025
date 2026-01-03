'use client';

import { motion, AnimatePresence, useMotionValueEvent } from 'motion/react';
import { useState } from 'react';
// 1. Import the global hook
import { useGlobalScrollPhysics } from '@/context/ScrollPhysicsContext';

export default function ScrollHint() {
  const [hasScrolled, setHasScrolled] = useState(false);

  // 2. Get the physics value
  const physicsVelocity = useGlobalScrollPhysics();

  // 3. Subscribe to changes
  // Instead of setting up a new wheel listener, we just watch the MotionValue.
  useMotionValueEvent(physicsVelocity, 'change', (latest) => {
    // Optimization: Stop checking if we already hid it
    if (hasScrolled) return;

    // If velocity goes above 1 (meaning the user started scrolling), hide the hint.
    if (latest > 1) {
      setHasScrolled(true);
    }
  });

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
