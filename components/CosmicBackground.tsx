'use client';

import PulsingStar from '@/components/PulsingStar';
import TwinklingStars from './TwinklingStars';

export default function CosmicBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {/* 1. OPTIMIZED NOISE TEXTURE (CSS - Zero Performance Cost) */}
      <div
        className="absolute inset-0 z-[20] opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />

      <TwinklingStars />

      {/* 2. THE STARS (Persistent & Connected to Global Physics) */}
      <PulsingStar side="left" colorClass="bg-theme-orange" />
      <PulsingStar side="right" colorClass="bg-theme-orange" />
    </div>
  );
}
