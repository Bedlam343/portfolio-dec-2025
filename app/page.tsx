'use client';

import { useRef } from 'react';

export default function Home() {
  const timeout = useRef<NodeJS.Timeout | null>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLParagraphElement>(null);

  const handleMouseDown = () => {
    timeout.current = setTimeout(() => {
      if (backgroundRef.current) {
        backgroundRef.current.style.backgroundColor = '#1C1B17';
      }
      if (nameRef.current) {
        nameRef.current.style.color = '#eb4604';
      }
    }, 100);
  };

  const handleMouseUp = () => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    if (backgroundRef.current) {
      backgroundRef.current.style.backgroundColor = '#eb4604';
    }
    if (nameRef.current) {
      nameRef.current.style.color = '#1C1B17';
    }
  };

  return (
    <div
      ref={backgroundRef}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      className={`h-screen w-screen flex flex-col justify-center 
      items-center gap-0 bg-[#eb4604]`}
    >
      <p
        ref={nameRef}
        className={`text-[#1C1B17] select-none text-[75px] 
        font-impact tracking-[-2px] uppercase leading-none`}
      >
        Jagjit
      </p>
    </div>
  );
}
