import { useEffect, useRef } from 'react';
import { useMotionValue, useAnimationFrame } from 'motion/react';

/**
 * A hook that tracks scroll velocity and applies friction,
 * creating a physics-based value that "heats up" on scroll and "cools down" over time.
 */
export const useScrollPhysics = () => {
  const velocityMV = useMotionValue(0);
  const rawVelocityRef = useRef(0);

  // 1. Capture Scroll Input
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Sensitivity knob. Adjust to make it easier/harder to trigger.
      const force = Math.abs(e.deltaY) * 0.2;
      rawVelocityRef.current += force;
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  // 2. Game Loop (Friction & Update)
  useAnimationFrame(() => {
    // Friction/Decay factor (0.92 = smooth slow down)
    rawVelocityRef.current *= 0.92;

    // Stop tiny calculations close to zero
    if (rawVelocityRef.current < 0.1) rawVelocityRef.current = 0;

    // Update MotionValue for Framer Motion to use
    velocityMV.set(rawVelocityRef.current);
  });

  return velocityMV;
};
