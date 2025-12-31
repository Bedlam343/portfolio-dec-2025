'use client';

import {
  motion,
  useMotionValue,
  useTransform,
  useAnimationFrame,
} from 'motion/react';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { TECH_ICONS } from '@/utils/constants';

const OrbitRing = ({
  radius,
  duration,
  reverse = false,
  side = 'left',
  icons = [],
}: {
  radius: number;
  duration: number;
  reverse?: boolean;
  side: 'left' | 'right';
  icons?: typeof TECH_ICONS;
}) => {
  const rotation = useMotionValue(0);

  // --- CHANGE 1: Initialize with high velocity for the "Fast Start" effect ---
  // A value of 40-50 provides a nice strong spin on load.
  const velocityRef = useRef(50);

  const counterRotation = useTransform(rotation, (value) => -value);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // --- CHANGE 2: Simplified Scroll Logic ---
      // We take the absolute value of the scroll.
      // This means scrolling UP or DOWN both add energy to the spin.
      // This ensures the ring always speeds up in its natural direction.
      const scrollForce = Math.abs(e.deltaY) * 0.05;

      velocityRef.current += scrollForce;
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  useAnimationFrame((time, delta) => {
    const deltaSeconds = delta / 1000;

    // 1. Base Speed (Constant)
    const baseSpeed = (360 / duration) * deltaSeconds;

    // 2. Friction (Decay)
    // Slowly reduce the extra velocity back to 0
    velocityRef.current *= 0.95;

    // cleanup tiny values to save math
    if (velocityRef.current < 0.01) velocityRef.current = 0;

    // 3. Combine Base Speed + Boost
    // We add the velocity to the base speed.
    const moveBy = baseSpeed + velocityRef.current;

    // 4. Apply Direction
    const currentRotation = rotation.get();
    if (reverse) {
      rotation.set(currentRotation - moveBy);
    } else {
      rotation.set(currentRotation + moveBy);
    }
  });

  return (
    <div
      className={`absolute top-1/2 -translate-y-1/2 rounded-full border border-theme-white/10 flex items-center justify-center pointer-events-none z-[5]
      ${side === 'left' ? '-left-[50%]' : '-right-[50%]'} 
      hidden xl:flex`}
      style={{
        width: radius * 2,
        height: radius * 2,
        left: side === 'left' ? `-${radius}px` : 'auto',
        right: side === 'right' ? `-${radius}px` : 'auto',
      }}
    >
      <motion.div
        className="w-full h-full relative"
        style={{ rotate: rotation }}
      >
        {icons.map((icon, index) => {
          // Evenly distribute icons
          const angleStep = 360 / icons.length;
          const angle = index * angleStep;

          return (
            <div
              key={icon.id}
              className="absolute top-1/2 left-1/2"
              style={{
                transform: `rotate(${angle}deg) translate(${radius}px) rotate(-${angle}deg)`,
              }}
            >
              <motion.div
                style={{ rotate: counterRotation }}
                className="relative flex items-center justify-center w-10 h-10 -ml-5 -mt-5 bg-theme-black border border-theme-white/20 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.1)]"
              >
                {icon.src ? (
                  <Image
                    src={icon.src}
                    alt={icon.alt || icon.label}
                    width={icon.width || 24}
                    height={icon.height || 24}
                  />
                ) : (
                  <span className="text-[10px] font-bold text-white">
                    {icon.label}
                  </span>
                )}
                <div
                  className={`absolute inset-0 rounded-full opacity-20 ${icon.color}`}
                />
              </motion.div>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default OrbitRing;
