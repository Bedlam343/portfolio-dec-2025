'use client';

import {
  motion,
  useMotionValue,
  useTransform,
  useAnimationFrame,
  AnimatePresence,
} from 'motion/react';
import { useRef, useState } from 'react';
import Image from 'next/image';
import { TECH_ICONS } from '@/utils/constants';

import { useGlobalScrollPhysics } from '@/context/ScrollPhysicsContext';

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

  // 2. Get the global scroll velocity (Shared by Stars, Text, and Rings)
  const globalVelocity = useGlobalScrollPhysics();

  const isHovering = useRef(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const counterRotation = useTransform(rotation, (value) => -value);

  useAnimationFrame((time, delta) => {
    const deltaSeconds = delta / 1000;

    // PAUSE LOGIC: If hovering, strictly stop updating rotation
    if (isHovering.current) return;

    // 1. Calculate Base Speed (Constant background rotation)
    // e.g. 360 degrees / 60 seconds = 6 degrees per second
    const baseSpeed = 360 / duration;

    // 2. Calculate Boost from Global Velocity
    // Global velocity is roughly 0 (idle) to ~200 (fast scroll).
    // We multiply by 0.5 to convert "Physics Energy" into "Degrees Per Second".
    // 200 energy * 0.5 = 100 degrees/sec extra rotation (Fast but readable).
    const currentVelocity = globalVelocity.get();
    const speedBoost = currentVelocity * 2;

    // 3. Apply Total Rotation
    const moveBy = (baseSpeed + speedBoost) * deltaSeconds;

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
        className="w-full h-full relative will-change-transform"
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
                pointer-events-auto z-10 hover:scale-110 hover:border-theme-orange
                transition-all duration-200"
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
                      rounded-md whitespace-nowrap z-20 pointer-events-none"
                    >
                      <p className="text-[10px] font-inter tracking-wider text-theme-white">
                        {icon.alt}
                      </p>
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
