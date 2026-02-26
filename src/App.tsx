import React from 'react';
import { MusicPlayer } from './components/MusicPlayer';
import { SnakeGame } from './components/SnakeGame';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden flex flex-col items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-pink-500/10 blur-[120px] rounded-full" />
        
        {/* Grid lines */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            transform: 'perspective(500px) rotateX(60deg) translateY(-100px) translateZ(-200px)',
            transformOrigin: 'top center'
          }}
        />
      </div>

      {/* Header */}
      <div className="absolute top-6 left-0 w-full text-center z-10">
        <h1 className="text-4xl md:text-5xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500 neon-text tracking-widest">
          SYNTH<span className="text-white">SNAKE</span>
        </h1>
      </div>

      {/* Main Content */}
      <div className="z-10 w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-12 mt-16">
        
        {/* Left/Top side: Music Player */}
        <div className="w-full lg:w-auto flex justify-center lg:justify-end order-2 lg:order-1">
          <MusicPlayer />
        </div>

        {/* Right/Center side: Snake Game */}
        <div className="w-full lg:w-auto flex justify-center order-1 lg:order-2">
          <SnakeGame />
        </div>

      </div>
    </div>
  );
}
