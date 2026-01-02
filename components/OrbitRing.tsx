'use client';

import {
  motion,
  useMotionValue,
  useTransform,
  useAnimationFrame,
  AnimatePresence,
} from 'motion/react';
import { useEffect, useRef, useState } from 'react';
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
  const velocityRef = useRef(50);

  // 1. Ref to track if we should pause rotation
  const isHovering = useRef(false);

  // 2. State for the tooltip
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const counterRotation = useTransform(rotation, (value) => -value);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const scrollForce = Math.abs(e.deltaY) * 0.05;
      velocityRef.current += scrollForce;
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  useAnimationFrame((time, delta) => {
    const deltaSeconds = delta / 1000;

    // Friction Logic (Always run this so momentum settles naturally)
    velocityRef.current *= 0.95;
    if (velocityRef.current < 0.01) velocityRef.current = 0;

    // 3. PAUSE LOGIC: If hovering, skip the rotation update
    if (isHovering.current) return;

    // Base Speed + Boost
    const baseSpeed = (360 / duration) * deltaSeconds;
    const moveBy = baseSpeed + velocityRef.current;

    // Apply Direction
    const currentRotation = rotation.get();
    if (reverse) {
      rotation.set(currentRotation - moveBy);
    } else {
      rotation.set(currentRotation + moveBy);
    }
  });

  return (
    <div
      className={`absolute top-1/2 -translate-y-1/2 rounded-full 
        border border-theme-white/10 flex items-center justify-center 
        pointer-events-none z-[5]
      ${side === 'left' ? '-left-[50%]' : '-right-[50%]'} 
      flex`}
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
                className="relative flex items-center justify-center w-[50px] 
                h-[50px] -ml-5 -mt-5 bg-theme-black border 
                border-theme-white/20 rounded-full 
                shadow-[0_0_15px_rgba(255,255,255,0.1)] cursor-pointer 
                pointer-events-auto z-10 hover:scale-110 
                transition-transform duration-200"
                onMouseEnter={() => {
                  isHovering.current = true;
                  setActiveTooltip(icon.label);
                }}
                onMouseLeave={() => {
                  isHovering.current = false;
                  setActiveTooltip(null);
                }}
              >
                {/* TOOLTIP COMPONENT */}
                <AnimatePresence>
                  {activeTooltip === icon.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute -top-10 left-1/2 -translate-x-1/2 
                      bg-theme-black/90 border border-theme-orange/50 px-3 py-1 
                      rounded-md whitespace-nowrap z-20"
                    >
                      <p className="text-[10px] font-inter tracking-wider text-theme-white">
                        {icon.alt}
                      </p>
                      {/* Little triangle arrow pointing down */}
                      <div
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 
                      bg-theme-orange/50 rotate-45 transform translate-y-[-50%]"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {icon.src ? (
                  <Image
                    src={icon.src}
                    alt={icon.alt || icon.label}
                    width={icon.width || 30}
                    height={icon.height || 30}
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
