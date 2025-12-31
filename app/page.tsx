'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, Variants } from 'motion/react';
import Marquee from 'react-fast-marquee';

import OrbitRing from '@/components/OrbitRing';
import { TECH_ICONS, QUALITIES } from '@/utils/constants';

export default function PortfolioHome() {
  const backgroundRef = useRef(null);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
  };

  const fadeInVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.8 } },
  };

  return (
    <div
      ref={backgroundRef}
      className="relative h-screen w-screen bg-theme-black overflow-hidden selection:bg-theme-orange selection:text-black"
    >
      {/* --- 1. Ambient Light Orbs --- */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
        <motion.div
          className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-theme-white opacity-[0.08] blur-[120px]"
          animate={{ x: [0, 50, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-[-20%] right-[-10%] w-[700px] h-[700px] rounded-full bg-theme-orange opacity-[0.1] blur-[150px]"
          animate={{ x: [0, -60, 0], y: [0, 40, 0], scale: [1, 1.2, 1] }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />
      </div>

      {/* LEFT SIDE RINGS */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        {/* Inner Ring - Left */}
        <OrbitRing
          radius={300}
          duration={45}
          side="left"
          icons={TECH_ICONS.slice(0, 4)}
        />
        {/* Middle Ring - Left */}
        <OrbitRing
          radius={450}
          duration={60}
          reverse={true}
          side="left"
          icons={TECH_ICONS.slice(4, 8)}
        />
        {/* Outer Ring - Left */}
        <OrbitRing
          radius={600}
          duration={80}
          side="left"
          icons={TECH_ICONS.slice(8, 10)}
        />
      </div>

      {/* RIGHT SIDE RINGS */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        {/* Inner Ring - Right */}
        <OrbitRing
          radius={300}
          duration={45}
          reverse={true}
          side="right"
          icons={TECH_ICONS.slice(7, 11)}
        />
        {/* Middle Ring - Right */}
        <OrbitRing
          radius={450}
          duration={60}
          side="right"
          icons={TECH_ICONS.slice(2, 5)}
        />
        {/* Outer Ring - Right */}
        <OrbitRing radius={600} duration={80} reverse={true} side="right" />
      </div>

      {/* --- 2. Marquee Top Bar --- */}
      <div className="relative w-full bg-theme-black/50 backdrop-blur-sm py-2 z-30 border-b border-theme-white/10">
        <Marquee
          speed={20}
          gradient={false}
          direction="left"
          pauseOnHover={false}
          autoFill={true}
        >
          {[...QUALITIES, ...QUALITIES].map((r, i) => (
            <p
              key={i}
              className={`shrink-0 font-inter mr-[20px] ${
                i % 2 === 0 ? 'font-bold' : 'font-extralight'
              } select-none ${
                r.color ? r.color : 'text-theme-white'
              } text-[16px] uppercase tracking-widest`}
            >
              {r.word}
            </p>
          ))}
        </Marquee>
      </div>

      {/* --- 3. Main Content --- */}
      <motion.section
        className="relative pt-[80px] z-10 w-full h-full flex flex-col items-center"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.p
          variants={fadeInVariants}
          className="text-center text-theme-white select-none text-[80px] sm:text-[125px] font-impact tracking-[-4px] uppercase leading-none drop-shadow-2xl"
        >
          Jagjit
        </motion.p>

        <div className="w-full flex justify-center mt-[30px]">
          <motion.div
            variants={itemVariants}
            className="w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] rounded-full overflow-hidden border-4 border-theme-black shadow-2xl z-20"
          >
            <Image
              src="/images/profile.jpg"
              alt="Profile Image"
              width={300}
              height={300}
              className="object-cover transition-transform duration-500 hover:scale-110 w-full h-full"
            />
          </motion.div>
        </div>

        <motion.div
          variants={itemVariants}
          className="flex justify-center mt-[75px]"
        >
          <ul className="flex space-x-12">
            {['About', 'Experience', 'Projects', 'More'].map((item) => (
              <li
                key={item}
                className="font-inter text-xl relative group p-0 text-theme-white"
              >
                <div className="absolute top-0 left-0 h-full bg-theme-orange w-0 group-hover:w-full transition-all duration-300 -z-10" />
                <a className="cursor-pointer block relative overflow-hidden px-1 group-hover:text-theme-black transition-colors duration-300">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>
      </motion.section>
    </div>
  );
}
