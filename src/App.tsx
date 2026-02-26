import React from 'react';
import { MusicPlayer } from './components/MusicPlayer';
import { SnakeGame } from './components/SnakeGame';

export default function App() {
  return (
    <div className="min-h-screen bg-black bg-static relative flex flex-col items-center justify-center p-4">
      <div className="scanlines"></div>
      
      <div className="absolute top-8 left-0 w-full text-center z-10 screen-tear pointer-events-none">
        <h1 className="text-5xl md:text-7xl font-display font-black glitch-text tracking-widest" data-text="SYS.ERR//SNAKE">
          SYS.ERR//SNAKE
        </h1>
        <p className="text-[#ff00ff] mt-2 text-sm md:text-base tracking-[0.4em] font-bold">
          [UNAUTHORIZED_ACCESS_DETECTED]
        </p>
      </div>

      <div className="z-20 w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-16 mt-24">
        <div className="w-full lg:w-auto flex justify-center lg:justify-end order-2 lg:order-1 screen-tear" style={{animationDelay: '1s'}}>
          <MusicPlayer />
        </div>

        <div className="w-full lg:w-auto flex justify-center order-1 lg:order-2">
          <SnakeGame />
        </div>
      </div>
    </div>
  );
}
