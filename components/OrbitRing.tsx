import { motion } from 'motion/react';
import { TECH_ICONS } from '@/utils/constants';
import Image from 'next/image';

const OrbitRing = ({
  radius,
  duration,
  reverse = false,
  side = 'left', // 'left' or 'right'
  icons = [],
}: {
  radius: number;
  duration: number;
  reverse?: boolean;
  side: 'left' | 'right';
  icons?: typeof TECH_ICONS;
}) => {
  return (
    <div
      className={`absolute top-1/2 -translate-y-1/2 rounded-full border border-theme-white/10 flex items-center justify-center pointer-events-none z-[5]
      ${side === 'left' ? '-left-[50%]' : '-right-[50%]'} 
      // Hide on small screens to prevent clutter
      hidden xl:flex`}
      style={{
        width: radius * 2,
        height: radius * 2,
        // If on the right side, we position the center on the right edge
        left: side === 'left' ? `-${radius}px` : 'auto',
        right: side === 'right' ? `-${radius}px` : 'auto',
      }}
    >
      {/* The Rotating Container */}
      <motion.div
        className="w-full h-full relative"
        animate={{ rotate: reverse ? -360 : 360 }}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {icons.map((icon, index) => {
          // Calculate angle for even distribution
          const angleStep = 360 / icons.length;
          const angle = index * angleStep;

          return (
            <div
              key={icon.id}
              className="absolute top-1/2 left-1/2"
              style={{
                // 1. Rotate to the correct angle
                // 2. Translate OUT to the border (radius)
                // 3. Rotate BACK so the icon container is oriented normally
                transform: `rotate(${angle}deg) translate(${radius}px) rotate(-${angle}deg)`,
              }}
            >
              {/* Counter-Rotation to keep the icon itself upright relative to the screen */}
              <motion.div
                animate={{ rotate: reverse ? 360 : -360 }}
                transition={{
                  duration: duration,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="relative flex items-center justify-center w-10 h-10 -ml-5 -mt-5 bg-theme-black border border-theme-white/20 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.1)]"
              >
                {/* PLACEHOLDER ICON */}
                {icon.src ? (
                  <Image
                    src={icon.src}
                    alt={icon.alt || icon.label}
                    width={icon.width || 24}
                    height={icon.height || 24}
                  />
                ) : (
                  <span className={`text-[10px] font-bold text-white`}>
                    {icon.label}
                  </span>
                )}

                {/* Optional: Glow dot */}
                <div
                  className={`absolute inset-0 rounded-full opacity-20 ${icon.color}`}
                />
              </motion.div>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default OrbitRing;
