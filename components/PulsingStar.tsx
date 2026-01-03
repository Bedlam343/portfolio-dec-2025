'use client';

import { motion, useTransform } from 'motion/react';
import { useGlobalScrollPhysics } from '@/context/ScrollPhysicsContext';

const PulsingStar = ({
  side,
  colorClass,
}: {
  side: 'left' | 'right';
  colorClass: string;
}) => {
  const velocity = useGlobalScrollPhysics();

  const positionClasses =
    side === 'left'
      ? 'top-1/2 left-0 -translate-x-1/2 -translate-y-1/2'
      : 'top-1/2 right-0 translate-x-1/2 -translate-y-1/2';

  // Map global velocity to local animations
  // When velocity is 0, boost is 0.
  const scaleBoost = useTransform(
    velocity,
    (v) => 1 + Math.min(v, 150) * 0.005,
  );
  const opacityBoost = useTransform(velocity, (v) => Math.min(v, 150) * 0.005);

  // Create rotation from velocity (optional visual flair)
  const rotation = useTransform(velocity, (v) => v * 2);

  return (
    <motion.div
      className={`absolute pointer-events-none z-[0] ${positionClasses} flex items-center justify-center will-change-transform`}
      style={{ rotate: rotation, scale: scaleBoost }}
    >
      {/* Atmosphere */}
      <motion.div
        className={`absolute w-[600px] h-[600px] rounded-full blur-[120px] mix-blend-screen ${colorClass}`}
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
        className={`absolute w-[300px] h-[300px] rounded-full blur-[60px] mix-blend-screen ${colorClass}`}
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
        className="absolute w-[80px] h-[80px] bg-white rounded-full blur-[20px] mix-blend-overlay"
        style={{ opacity: useTransform(opacityBoost, (v) => 0.5 + v) }}
      />
    </motion.div>
  );
};

export default PulsingStar;
