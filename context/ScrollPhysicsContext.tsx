'use client';

import React, { createContext, useContext, useEffect, useRef } from 'react';
import { useMotionValue, useAnimationFrame, MotionValue } from 'motion/react';

const ScrollPhysicsContext = createContext<MotionValue<number> | null>(null);

export const ScrollPhysicsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const velocityMV = useMotionValue(0);
  const velocityRef = useRef(0);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Global sensitivity
      const force = Math.abs(e.deltaY) * 0.1;
      velocityRef.current += force;
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  useAnimationFrame(() => {
    // Global Friction
    velocityRef.current *= 0.92;

    // Performance Optimization: Snap to 0 early to stop animation loops
    if (velocityRef.current < 0.5) velocityRef.current = 0;

    velocityMV.set(velocityRef.current);
  });

  return (
    <ScrollPhysicsContext.Provider value={velocityMV}>
      {children}
    </ScrollPhysicsContext.Provider>
  );
};

export const useGlobalScrollPhysics = () => {
  const context = useContext(ScrollPhysicsContext);

  if (!context) {
    throw new Error(
      'useGlobalScrollPhysics must be used within a ScrollPhysicsProvider',
    );
  }

  return context;
};
