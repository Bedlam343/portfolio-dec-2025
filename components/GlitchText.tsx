'use client';

import { useState, useEffect, useRef } from 'react';
import { useAnimationFrame } from 'motion/react';

const GLITCH_CHARS = '0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/';

interface GlitchTextProps {
  text: string;
  className?: string;
}

export default function GlitchText({ text, className = '' }: GlitchTextProps) {
  const [displayChars, setDisplayChars] = useState(
    text.split('').map((char) => ({ char, isGlitching: false })),
  );

  const velocityRef = useRef(0);
  const timeSinceLastGlitch = useRef(0);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // TUNING 1: Reduced Input Sensitivity
      // Was 0.5, now 0.1. You have to scroll 5x harder to build the same speed.
      const force = Math.abs(e.deltaY) * 0.1;
      velocityRef.current += force;
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  useAnimationFrame((time, delta) => {
    // Friction
    velocityRef.current *= 0.92;
    if (velocityRef.current < 0.1) velocityRef.current = 0;

    // TUNING 2: Chaos Calculation
    // We divide velocity by a much larger number (was 40, now 150).
    // This means it takes way more speed to trigger high chaos.
    // TUNING 3: Hard Cap
    // We cap the result at 0.5. This means at MAXIMUM speed,
    // only 50% of the letters will glitch. It never goes "fully crazy".
    const chaosLevel = Math.min(velocityRef.current / 150, 0.5);

    // TUNING 4: Higher Activation Threshold
    // Chaos won't start until we hit 0.1 (10% chaos), preventing tinyjitters.
    if (chaosLevel > 0.1) {
      // --- ACTIVE MODE ---
      const newChars = text.split('').map((originalChar) => {
        if (Math.random() < chaosLevel) {
          return {
            char: GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)],
            isGlitching: true,
          };
        } else {
          return { char: originalChar, isGlitching: false };
        }
      });
      setDisplayChars(newChars);
    } else {
      // --- PASSIVE MODE (Idle) ---
      timeSinceLastGlitch.current += delta;

      // Every 3 seconds, do a single gentle glitch
      if (timeSinceLastGlitch.current > 3000) {
        const indexToGlitch = Math.floor(Math.random() * text.length);

        const newChars = text.split('').map((originalChar, i) => {
          if (i === indexToGlitch) {
            return {
              char: GLITCH_CHARS[
                Math.floor(Math.random() * GLITCH_CHARS.length)
              ],
              isGlitching: true,
            };
          }
          return { char: originalChar, isGlitching: false };
        });

        setDisplayChars(newChars);
        timeSinceLastGlitch.current = 0;

        setTimeout(() => {
          if (velocityRef.current < 0.1) {
            setDisplayChars(
              text.split('').map((c) => ({ char: c, isGlitching: false })),
            );
          }
        }, 100);
      }

      // Snap back to clean text if we just stopped scrolling
      if (
        velocityRef.current === 0 &&
        timeSinceLastGlitch.current > 150 &&
        timeSinceLastGlitch.current < 3000
      ) {
        const isClean = displayChars.every((c) => !c.isGlitching);
        if (!isClean) {
          setDisplayChars(
            text.split('').map((c) => ({ char: c, isGlitching: false })),
          );
        }
      }
    }
  });

  return (
    <span className={`inline-flex ${className}`}>
      {displayChars.map((item, index) => (
        <span
          key={index}
          className={`transition-colors duration-75 ${
            item.isGlitching
              ? 'text-theme-orange font-bold'
              : 'text-theme-white'
          }`}
        >
          {item.char}
        </span>
      ))}
    </span>
  );
}
