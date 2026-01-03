'use client';

import { motion, useTransform, Variants } from 'motion/react';
import { usePathname } from 'next/navigation';
import { useGlobalScrollPhysics } from '@/context/ScrollPhysicsContext';

const PulsingStar = ({
  side,
  colorClass,
}: {
  side: 'left' | 'right';
  colorClass: string;
}) => {
  const velocity = useGlobalScrollPhysics();
  const pathname = usePathname();

  const isHome = pathname === '/';

  // --- NAVIGATION ANIMATION ---
  // When leaving home, move stars to the center and shrink them
  const distanceToMove = side === 'left' ? '40vw' : '-40vw';

  const navVariants: Variants = {
    home: {
      x: 0,
      scale: 1,
      opacity: 1,
      transition: { duration: 1.5, ease: 'easeInOut' },
    },
    away: {
      x: distanceToMove, // Move to center
      scale: 0.15, // Shrink to distant dot
      opacity: 0.8,
      transition: { duration: 1.5, ease: 'easeInOut' },
    },
  };

  // --- PHYSICS ANIMATION ---
  const scaleBoost = useTransform(
    velocity,
    (v) => 1 + Math.min(v, 150) * 0.005,
  );
  const opacityBoost = useTransform(velocity, (v) => Math.min(v, 150) * 0.003);
  const rotation = useTransform(velocity, (v) => v * 2);

  const positionClasses =
    side === 'left'
      ? 'top-1/2 left-0 -translate-x-1/2 -translate-y-1/2'
      : 'top-1/2 right-0 translate-x-1/2 -translate-y-1/2';

  return (
    <motion.div
      className={`absolute pointer-events-none z-[1] ${positionClasses} flex items-center justify-center will-change-transform`}
      variants={navVariants}
      initial={isHome ? 'home' : 'away'}
      animate={isHome ? 'home' : 'away'}
    >
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
