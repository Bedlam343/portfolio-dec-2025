'use client';

import { useState, useRef } from 'react';
import { useAnimationFrame } from 'motion/react';
import { useGlobalScrollPhysics } from '@/context/ScrollPhysicsContext';

const GLITCH_CHARS = '0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/';

interface GlitchTextProps {
  text: string;
  className?: string;
}

export default function GlitchText({ text, className = '' }: GlitchTextProps) {
  const [displayChars, setDisplayChars] = useState(
    text.split('').map((char) => ({ char, isGlitching: false })),
  );

  const globalVelocity = useGlobalScrollPhysics();

  const timeSinceLastGlitch = useRef(0);

  useAnimationFrame((time, delta) => {
    const currentVelocity = globalVelocity.get();

    // Chaos Calculation
    // Using the same tuning as before: divide by 150, cap at 0.5
    const chaosLevel = Math.min(currentVelocity / 200, 0.5);

    // Activation Threshold
    if (chaosLevel > 0.1) {
      // --- ACTIVE MODE (Scrolling) ---
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

        // Snap back shortly after
        setTimeout(() => {
          // Check global velocity to ensure we haven't started scrolling
          if (globalVelocity.get() < 0.1) {
            setDisplayChars(
              text.split('').map((c) => ({ char: c, isGlitching: false })),
            );
          }
        }, 100);
      }

      // Cleanup: Snap back to clean text if we just stopped scrolling
      if (
        currentVelocity === 0 &&
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
