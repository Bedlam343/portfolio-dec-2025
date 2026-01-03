'use client';

import { motion } from 'motion/react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center text-theme-white relative z-10">
      {/* Content Container */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }} // Delay allows the warp to settle
        className="max-w-2xl text-center space-y-8 p-8 bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl"
      >
        <h1 className="text-[60px] font-impact tracking-tighter text-theme-orange">
          ABOUT ME
        </h1>

        <p className="font-inter font-light text-xl leading-relaxed text-theme-gray">
          I am a software engineer obsessed with the intersection of performance
          and aesthetics. While the universe is chaotic, I believe code should
          be structured, efficient, and beautiful.
        </p>

        <div className="pt-8">
          <Link href="/">
            <button className="px-8 py-3 border border-theme-white/30 rounded-full hover:bg-theme-white hover:text-black transition-all duration-300 uppercase tracking-widest text-sm">
              Return to Orbit
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
