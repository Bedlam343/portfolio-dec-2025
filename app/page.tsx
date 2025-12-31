'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll } from 'framer-motion';
import Marquee from 'react-fast-marquee';

const QUALITIES = [
  { word: 'Developer', color: 'text-theme-orange' },

  { word: 'Dependable' },
  { word: 'Diligent' },
  { word: 'Dreamer' },
  { word: 'Dope' },
  { word: 'Determined' },
  { word: 'Designer', color: 'text-theme-green' },
  { word: 'Devoted' },
  { word: 'Disciplined' },
  { word: 'Detail-Oriented' },
  { word: 'Driven' },
  { word: 'Daring' },
  { word: 'Distinctive' },
  { word: 'Deliberate' },
  { word: 'Dexterous' },
  { word: 'Dedicated' },
];

export default function PortfolioHome() {
  const backgroundRef = useRef(null);

  // Optional: Parallax effect based on scroll (kept from previous code, but less impactful with fixed elements)
  const { scrollYProgress } = useScroll({
    target: backgroundRef,
    offset: ['start start', 'end start'],
  });
  // Placeholder for parallax if needed in the future, not used in this specific layout.
  // const nameY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  // Animation variants for staggered entrance of main elements
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  // Variant for elements fading in and moving up
  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
  };

  // Variant for elements that should just fade in (like the title)
  const fadeInVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.8 } },
  };

  return (
    <div
      ref={backgroundRef}
      className="relative h-screen w-screen bg-theme-black overflow-hidden"
    >
      {/* 1. Ambient Light Orbs */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
        {/* Top Left Cool Light Orb */}
        <motion.div
          className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-theme-white opacity-[0.08] blur-[120px]"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        {/* Bottom Right Warm Light Orb */}
        <motion.div
          className="absolute bottom-[-20%] right-[-10%] w-[700px] h-[700px] rounded-full bg-theme-orange opacity-[0.1] blur-[150px]"
          animate={{
            x: [0, -60, 0],
            y: [0, 40, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />
      </div>

      {/* 2. Subtle Noise Texture Overlay */}
      {/* <div
        className="absolute inset-0 z-[1] opacity-[0.15] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.80' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      ></div> */}

      <div
        className="relative w-full bg-theme-black/50 backdrop-blur-sm py-2 z-30 border-b 
          border-theme-white/10"
      >
        <Marquee
          speed={20}
          gradient={false}
          direction="left"
          pauseOnHover={false}
          autoFill={true}
        >
          {[...QUALITIES, ...QUALITIES].map((r, i) => {
            return (
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
            );
          })}
        </Marquee>
      </div>

      <motion.section
        className="pt-[90px] z-10 w-full h-full"
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

        <div className="w-full flex justify-center mt-[40px]">
          <motion.div
            variants={itemVariants}
            className="w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] 
            rounded-full overflow-hidden"
          >
            <Image
              src="/images/profile.jpg"
              alt="Profile Image"
              width={300}
              height={300}
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </motion.div>
        </div>
      </motion.section>

      <div
        className="absolute z-20 bg-theme-orange flex justify-center 
      items-center right-10 bottom-10 px-6 py-4 sm:px-8 sm:py-6 
      shadow-[8px_8px_0px_rgba(0,0,0,0.5)] 
      hover:shadow-[12px_12px_0px_rgba(0,0,0,0.5)] 
      hover:-translate-x-1 hover:-translate-y-1 transition-all 
      duration-300"
      >
        <ul className="text-theme-black text-[20px] sm:text-[25px] space-y-2">
          {['About', 'Projects', 'Experience'].map((item) => (
            <li key={item} className="font-impact group text-left">
              <a className="cursor-pointer block relative overflow-hidden">
                <span className="relative z-10 group-hover:text-theme-white transition-colors duration-300">
                  {item}
                </span>
                <span className="absolute bottom-0 left-0 w-0 h-full bg-theme-black -z-0 transition-all duration-300 group-hover:w-full"></span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
