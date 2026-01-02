'use client';

import { useRef, useEffect } from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimationFrame,
} from 'motion/react';

const PulsingStar = ({
  side,
  colorClass,
}: {
  side: 'left' | 'right';
  colorClass: string;
}) => {
  const positionClasses =
    side === 'left'
      ? 'top-1/2 left-0 -translate-x-1/2 -translate-y-1/2'
      : 'top-1/2 right-0 translate-x-1/2 -translate-y-1/2';

  // --- PHYSICS ENGINE ---
  const rotation = useMotionValue(0);
  const scaleBoost = useMotionValue(1);
  const opacityBoost = useMotionValue(0);

  // CHANGE 1: Start with High Velocity (50) for the "Frantic Intro"
  // This matches your OrbitRing logic.
  const velocityRef = useRef(50);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const force = Math.abs(e.deltaY) * 0.2;
      velocityRef.current += force;
    };
    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  useAnimationFrame((time, delta) => {
    const deltaSeconds = delta / 1000;

    // Friction / Decay
    velocityRef.current *= 0.92;
    if (velocityRef.current < 0.1) velocityRef.current = 0;

    // Spin Calculation
    const moveBy = velocityRef.current * deltaSeconds * 15;
    rotation.set(rotation.get() + moveBy);

    // Intensity Calculations
    const safeVelocity = Math.min(velocityRef.current, 150);

    // Scale Logic
    scaleBoost.set(1 + safeVelocity * 0.005);

    // Opacity Logic
    opacityBoost.set(safeVelocity * 0.003);
  });

  return (
    <motion.div
      className={`absolute pointer-events-none z-[0] ${positionClasses} flex items-center justify-center`}
      style={{
        rotate: rotation,
        scale: scaleBoost,
      }}
    >
      {/* Layer 1: Outer Atmosphere */}
      <motion.div
        className={`absolute w-[600px] h-[600px] rounded-full blur-[120px] mix-blend-screen ${colorClass}`}
        // CHANGE 2: Increased baseline from 0.03 to 0.06 (Resting is slightly brighter)
        style={{ opacity: useTransform(opacityBoost, (v) => 0.06 + v) }}
        animate={{
          scale: [1, 1.1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
        }}
      />

      {/* Layer 2: Inner Corona */}
      <motion.div
        className={`absolute w-[300px] h-[300px] rounded-full blur-[60px] mix-blend-screen ${colorClass}`}
        // CHANGE 2: Increased baseline from 0.1 to 0.15
        style={{ opacity: useTransform(opacityBoost, (v) => 0.15 + v) }}
        animate={{
          scale: [1, 1.15],
          scaleX: [1, 1.05],
          scaleY: [1, 0.95],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
        }}
      />

      {/* Layer 3: The Hot Core */}
      <motion.div
        className="absolute w-[80px] h-[80px] bg-white rounded-full blur-[20px] mix-blend-overlay"
        // CHANGE 2: Increased baseline from 0.3 to 0.4
        style={{ opacity: useTransform(opacityBoost, (v) => 0.4 + v) }}
      />
    </motion.div>
  );
};

export default PulsingStar;
