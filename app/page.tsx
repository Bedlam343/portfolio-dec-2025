'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, Variants, useTransform } from 'motion/react';

import OrbitRing from '@/components/OrbitRing';
import ScrollHint from '@/components/ScrollHint';
import GlitchText from '@/components/GlitchText';
import PulsingStar from '@/components/PulsingStar';
import { TECH_ICONS } from '@/utils/constants';

import { useScrollPhysics } from '@/hooks/useScrollPhysics';

// Need to turn SVG filter elements into motion components to animate their attributes
const MotionFeDisplacementMap = motion.create('feDisplacementMap');
const MotionFeTurbulence = motion.create('feTurbulence');

export default function PortfolioHome() {
  const backgroundRef = useRef(null);

  // 2. Use the physics hook
  const physicsVelocity = useScrollPhysics();

  // 3. Map velocity to distortion amounts
  // Map velocity (0 to 150) to displacement scale (0 to 50px)
  // 50px is a strong glitch. Reduce to 20-30 for subtlety.
  const distortionScale = useTransform(physicsVelocity, [0, 150], [0, 50]);

  // Optional: We can also subtly animate the noise seed to make the glitch "crawl"
  // Even when velocity is low.
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

  return (
    <div
      ref={backgroundRef}
      className="relative h-screen w-screen bg-theme-black overflow-hidden selection:bg-theme-orange selection:text-black"
    >
      {/* --- NEW: Hidden SVG Filter Definition --- */}
      {/* This defines the "instruction set" for how to distort the image.
           It's invisible on its own. */}
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
            {/* Generates a fractal noise texture.
                We animate the 'seed' so the noise pattern shifts slightly on scroll. */}
            <MotionFeTurbulence
              type="fractalNoise"
              baseFrequency="0.02 0.04" // Stretch the noise horizontally for a "scanline" look
              numOctaves="2"
              result="noise"
              seed={noiseSeed}
            />
            {/* Uses the noise texture to shift pixels of the SourceGraphic.
                The 'scale' attribute determines how far pixels are shifted. */}
            <MotionFeDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={distortionScale} // This is linked to scroll velocity!
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* --- 1. GLOBAL NOISE TEXTURE (Background) --- */}
      <div className="absolute inset-0 z-[20] opacity-[0.06] mix-blend-overlay pointer-events-none">
        <svg className="h-full w-full">
          <filter id="noiseFilter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.6"
              numOctaves="3"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      {/* --- 2. THE INTERACTIVE PULSING STARS --- */}
      <PulsingStar side="left" colorClass="bg-theme-orange" />
      <PulsingStar side="right" colorClass="bg-theme-orange" />

      {/* LEFT SIDE RINGS */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
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
      </div>

      {/* RIGHT SIDE RINGS */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
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
      </div>

      {/* --- 3. Main Content --- */}
      <motion.section
        className="relative pt-[90px] z-10 w-full h-full flex flex-col items-center"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={fadeInVariants}>
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

        <div className="w-full flex justify-center mt-[25px]">
          <motion.div
            variants={itemVariants}
            // 4. APPLY THE FILTER HERE
            // We use style={{ filter: ... }} to reference the ID of the SVG filter we defined above.
            // When velocity is 0, scale is 0, so the filter does nothing.
            // When velocity increases, scale increases, distorting the image.
            style={{ filter: 'url(#profile-glitch-filter)' }}
            className="w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] rounded-full overflow-hidden border-4 border-theme-black shadow-2xl z-20 relative"
          >
            {/* Added a subtle color overlay that intensifies on scroll for extra effect */}
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
              // Removed hover scale as it conflicts visually with the glitch distortion
              className="object-cover w-full h-full"
            />
          </motion.div>
        </div>

        <motion.div
          variants={itemVariants}
          className="flex justify-center mt-[60px] sm:mt-[75px]"
        >
          <ul className="flex flex-col sm:flex-row space-y-6 sm:space-x-12 sm:space-y-0">
            {['About', 'Experience', 'Projects', 'More'].map((item) => (
              <li
                key={item}
                className="font-inter text-xl relative group p-0 text-theme-white"
              >
                <div
                  className="absolute top-0 left-0 h-full bg-theme-orange w-0 
                  group-hover:w-full transition-all duration-300 -z-10"
                />
                <a
                  className="cursor-pointer block relative overflow-hidden px-1 
                  group-hover:text-theme-black transition-colors duration-300
                  text-center sm:text-left"
                >
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
