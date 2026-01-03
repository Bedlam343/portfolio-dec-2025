'use client';

import { motion, useTransform, Variants } from 'motion/react';
import { usePathname } from 'next/navigation'; // Import hook to check current page
import { useGlobalScrollPhysics } from '@/context/ScrollPhysicsContext';

const PulsingStar = ({
  side,
  colorClass,
}: {
  side: 'left' | 'right';
  colorClass: string;
}) => {
  const velocity = useGlobalScrollPhysics();
  const pathname = usePathname(); // Get current route

  const isHome = pathname === '/';

  // --- 1. Position & Scale Logic (Page Navigation State) ---
  // If we are home, stay at the edge (0).
  // If we leave home, move towards the center (40vw).
  // Side note: 40vw brings them very close to the middle.
  const distanceToMove = side === 'left' ? '40vw' : '-40vw';

  const navVariants: Variants = {
    home: {
      x: 0,
      y: '-50%', // Maintain vertical centering
      scale: 1,
      opacity: 1,
      transition: { duration: 1.5, ease: 'easeInOut' },
    },
    away: {
      x: distanceToMove, // Move to center
      y: '-50%',
      scale: 0.15, // Shrink to a "shiny dot"
      opacity: 0.8, // Keep them bright so they look like distant stars
      transition: { duration: 1.5, ease: 'easeInOut' },
    },
  };

  // --- 2. Physics Logic (Scroll State) ---
  // This remains unchanged, handling the "wobble" and boost
  const scaleBoost = useTransform(
    velocity,
    (v) => 1 + Math.min(v, 150) * 0.005,
  );
  const opacityBoost = useTransform(velocity, (v) => Math.min(v, 150) * 0.003);
  const rotation = useTransform(velocity, (v) => v * 2);

  const positionClasses =
    side === 'left'
      ? 'top-1/2 left-0 -translate-x-1/2' // Removed -translate-y-1/2 (handled in variants)
      : 'top-1/2 right-0 translate-x-1/2';

  return (
    // WRAPPER DIV: Handles Page Navigation Animation (Home vs Away)
    <motion.div
      className={`absolute pointer-events-none z-[0] ${positionClasses} flex items-center justify-center will-change-transform`}
      variants={navVariants}
      initial={isHome ? 'home' : 'away'}
      animate={isHome ? 'home' : 'away'}
    >
      {/* INNER DIV: Handles Scroll Physics (Wobble & Boost) */}
      <motion.div style={{ rotate: rotation, scale: scaleBoost }}>
        {/* Atmosphere */}
        <motion.div
          className={`absolute -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] mix-blend-screen ${colorClass}`}
          style={{ opacity: useTransform(opacityBoost, (v) => 0.15 + v) }}
          animate={{ scale: [1, 1.1] }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut',
          }}
        />

        {/* Corona */}
        <motion.div
          className={`absolute -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full blur-[60px] mix-blend-screen ${colorClass}`}
          style={{ opacity: useTransform(opacityBoost, (v) => 0.25 + v) }}
          animate={{ scale: [1, 1.15], scaleX: [1, 1.05], scaleY: [1, 0.95] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut',
          }}
        />

        {/* Core */}
        <motion.div
          className="absolute -translate-x-1/2 -translate-y-1/2 w-[80px] h-[80px] bg-white rounded-full blur-[20px] mix-blend-overlay"
          style={{ opacity: useTransform(opacityBoost, (v) => 0.5 + v) }}
        />
      </motion.div>
    </motion.div>
  );
};

export default PulsingStar;
