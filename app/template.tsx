'use client';

import { motion, AnimatePresence } from 'motion/react';
import { usePathname } from 'next/navigation';

// This is a special wrapper that remounts on every page change,
// allowing us to trigger Exit animations.
export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // We use AnimatePresence with mode="wait".
  // This tells React: "Wait for the old page to finish warping out
  // BEFORE you load the new page."
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        className="w-full h-full"
        // 1. Entrance: New page fades in gently
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        // 2. Exit: Old page triggers its specific exit variants
        // (The scale: 15 warp effect defined in your page.tsx)
        exit="exit"
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
