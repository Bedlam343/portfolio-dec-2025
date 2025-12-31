'use client';

import { useState, useEffect } from 'react';

const GLITCH_CHARS = '0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/';

interface GlitchTextProps {
  text: string;
  className?: string;
}

export default function GlitchText({ text, className = '' }: GlitchTextProps) {
  // We split the text into an array of characters/objects
  const [displayChars, setDisplayChars] = useState(
    text.split('').map((char) => ({ char, isGlitching: false })),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Pick a random index to glitch
      const indexToGlitch = Math.floor(Math.random() * text.length);

      // 2. Start the glitch: Change char to random symbol & set color flag
      setDisplayChars((prev) =>
        prev.map((item, i) =>
          i === indexToGlitch
            ? {
                char: GLITCH_CHARS[
                  Math.floor(Math.random() * GLITCH_CHARS.length)
                ],
                isGlitching: true,
              }
            : item,
        ),
      );

      // 3. Revert back to normal after a very short delay (50ms - 150ms)
      // This creates that "flicker" effect
      setTimeout(() => {
        setDisplayChars((prev) =>
          prev.map((item, i) =>
            i === indexToGlitch
              ? { char: text[i], isGlitching: false } // Reset to original
              : item,
          ),
        );
      }, 100); // 100ms duration of the glitch
    }, 2500); // Repeat every 2.5 seconds

    return () => clearInterval(interval);
  }, [text]);

  return (
    <span className={`inline-flex ${className}`}>
      {displayChars.map((item, index) => (
        <span
          key={index}
          className={`transition-colors duration-75 ${
            item.isGlitching ? 'text-theme-orange' : 'text-theme-white'
          }`}
        >
          {item.char}
        </span>
      ))}
    </span>
  );
}
