'use client';

import Image from 'next/image';
import { useRef } from 'react';

export default function Home() {
  const backgroundRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLParagraphElement>(null);

  return (
    <div ref={backgroundRef} className="h-screen w-screen flex">
      <div
        className="w-[75%] bg-theme-black pt-[75px] flex 
        flex-col items-center"
      >
        <p
          ref={nameRef}
          className="text-theme-white select-none text-[125px] 
          font-impact tracking-[-4px] uppercase leading-none text-center"
        >
          Jagjit
        </p>
        <p
          className="font-inter text-center font-extralight text-theme-gray 
          text-[60px] tracking-[-8px] select-none mt-[10px]"
        >
          Developer
        </p>

        <div
          className="flex justify-center w-[300px] h-[300px] rounded-full
          overflow-hidden mt-[30px]"
        >
          <Image
            src="/images/profile.jpg"
            alt="Profile Image"
            width={300}
            height={300}
            className="object-cover"
          />
        </div>
      </div>

      <div className="w-[25%] bg-theme-orange flex justify-center items-center">
        <ul className="text-theme-black text-[25px]">
          <li
            className="font-impact cursor-pointer hover:bg-theme-black
              hover:text-theme-white"
          >
            <a>About</a>
          </li>
          <li
            className="font-impact cursor-pointer hover:bg-theme-black
              hover:text-theme-white"
          >
            <a>Experience</a>
          </li>
          <li
            className="font-impact cursor-pointer hover:bg-theme-black
              hover:text-theme-white"
          >
            <a>Projects</a>
          </li>
        </ul>
      </div>
    </div>
  );
}
