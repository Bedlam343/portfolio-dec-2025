'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { usePathname } from 'next/navigation';

const generatedStars = Array.from({ length: 100 }).map((_, i) => ({
  id: i,
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  size: Math.random() > 0.8 ? 2 : 1, // Mostly small, some slightly larger
  duration: Math.random() * 3 + 2, // Twinkle duration between 2s and 5s
  delay: Math.random() * 5,
}));

export default function TwinklingStars() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  // Store star data in state to avoid hydration mismatches
  const [stars, setStars] = useState<
    {
      id: number;
      top: string;
      left: string;
      size: number;
      duration: number;
      delay: number;
    }[]
  >(generatedStars);

  return (
    <motion.div
      className="absolute inset-0 z-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: isHome ? 0 : 1 }} // Only show when NOT on home
      transition={{ duration: 2, ease: 'easeInOut' }} // Slow fade in as we "travel"
    >
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute bg-white rounded-full"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
          }}
          // The Twinkle Effect
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </motion.div>
  );
}
