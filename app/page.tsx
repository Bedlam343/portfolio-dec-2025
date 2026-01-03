'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, Variants, useTransform } from 'motion/react';

import OrbitRing from '@/components/OrbitRing';
import ScrollHint from '@/components/ScrollHint';
import GlitchText from '@/components/GlitchText';
import { TECH_ICONS } from '@/utils/constants';

// Make sure this path matches the file you created in Step 1
import { useGlobalScrollPhysics } from '@/context/ScrollPhysicsContext';

// Define Motion Components for SVG Filters
const MotionFeDisplacementMap = motion.create('feDisplacementMap');
const MotionFeTurbulence = motion.create('feTurbulence');

export default function PortfolioHome() {
  const backgroundRef = useRef(null);

  // 1. Connect to the global physics engine
  const physicsVelocity = useGlobalScrollPhysics();

  // 2. Map velocity to distortion
  const distortionScale = useTransform(physicsVelocity, [0, 150], [0, 50]);
  const noiseSeed = useTransform(physicsVelocity, (v) => v * 5);

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

  const ringExitVariant: Variants = {
    exit: {
      scale: 15,
      opacity: 0,
      transition: { duration: 0.8, ease: 'easeIn' },
    },
  };

  const contentExitVariant: Variants = {
    exit: {
      y: -50,
      opacity: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div
      ref={backgroundRef}
      // CRITICAL FIX: Removed 'bg-theme-black'.
      // This allows the stars (which are behind this page in the Layout) to show through.
      className="relative h-screen w-screen overflow-hidden selection:bg-theme-orange selection:text-black"
    >
      {/* SVG Filters (Invisible Definition) */}
      <svg
        style={{
          position: 'absolute',
          width: 0,
          height: 0,
          pointerEvents: 'none',
        }}
      >
        <defs>
          <filter id="profile-glitch-filter">
            <MotionFeTurbulence
              type="fractalNoise"
              baseFrequency="0.02 0.04"
              numOctaves="2"
              result="noise"
              seed={noiseSeed}
            />
            <MotionFeDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={distortionScale}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* RINGS WRAPPER */}
      <motion.div
        className="absolute inset-0 z-[1] pointer-events-none"
        variants={ringExitVariant}
        exit="exit"
      >
        {/* Left Rings */}
        <OrbitRing
          radius={300}
          duration={45}
          side="left"
          icons={TECH_ICONS.slice(2, 5)}
        />
        <OrbitRing
          radius={450}
          duration={60}
          reverse={true}
          side="left"
          icons={TECH_ICONS.slice(5, 9)}
        />
        <OrbitRing
          radius={600}
          duration={80}
          side="left"
          icons={TECH_ICONS.slice(9, 15)}
        />

        {/* Right Rings */}
        <OrbitRing
          radius={300}
          duration={45}
          reverse={true}
          side="right"
          icons={TECH_ICONS.slice(10, 13)}
        />
        <OrbitRing
          radius={450}
          duration={60}
          side="right"
          icons={TECH_ICONS.slice(6, 10)}
        />
        <OrbitRing
          radius={600}
          duration={80}
          reverse={true}
          side="right"
          icons={TECH_ICONS.slice(0, 6)}
        />
      </motion.div>

      {/* MAIN CONTENT */}
      <motion.section
        className="relative z-10 w-full h-full flex flex-col items-center justify-center pointer-events-none"
        variants={containerVariants}
        initial="hidden"
        animate="show"
        exit="exit"
      >
        <motion.div variants={contentExitVariant}>
          <GlitchText
            text="JAGJIT"
            className="text-center select-none text-[80px] sm:text-[125px] 
            font-impact tracking-[-2px] sm:tracking-[-4px] uppercase leading-none drop-shadow-2xl"
          />
        </motion.div>

        <motion.div variants={fadeInVariants}>
          <p
            className="text-center text-theme-gray font-inter text-thin sm:text-[45px]
            font-extralight select-none tracking-wide text-[35px] mt-[10px] sm:mt-[0px]"
          >
            Software Engineer
          </p>
        </motion.div>

        {/* Profile Picture */}
        <div className="w-full flex justify-center mt-[25px]">
          <motion.div
            variants={{
              show: { scale: 1, opacity: 1 },
              exit: { scale: 0, opacity: 0, transition: { duration: 0.4 } },
            }}
            // Apply the filter using the ID defined in the SVG above
            style={{ filter: 'url(#profile-glitch-filter)' }}
            className="w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] rounded-full overflow-hidden border-4 border-theme-black shadow-2xl z-20 relative pointer-events-auto"
          >
            <motion.div
              className="absolute inset-0 bg-theme-orange mix-blend-overlay z-10 pointer-events-none"
              style={{
                opacity: useTransform(physicsVelocity, [0, 150], [0, 0.4]),
              }}
            />
            <Image
              src="/images/profile.jpg"
              alt="Profile Image"
              width={300}
              height={300}
              className="object-cover w-full h-full"
            />
          </motion.div>
        </div>

        {/* Navigation */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center mt-[60px] sm:mt-[75px] pointer-events-auto"
        >
          <ul className="flex flex-col sm:flex-row space-y-6 sm:space-x-12 sm:space-y-0">
            {['About', 'Experience', 'Projects', 'More'].map((item) => (
              <li
                key={item}
                className="font-inter text-xl relative group p-0 text-theme-white"
              >
                <div className="absolute top-0 left-0 h-full bg-theme-orange w-0 group-hover:w-full transition-all duration-300 -z-10" />
                <a className="cursor-pointer block relative overflow-hidden px-1 group-hover:text-theme-black transition-colors duration-300 text-center sm:text-left">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>
      </motion.section>

      <ScrollHint />
    </div>
  );
}
