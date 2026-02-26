import React, { useState, useEffect, useRef } from 'react';

const PLAYLIST = [
  {
    id: 1,
    title: "DATA_CORRUPTION_01",
    artist: "UNKNOWN_ENTITY",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: 2,
    title: "SECTOR_FAULT",
    artist: "SYS_ADMIN",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: 3,
    title: "KERNEL_PANIC",
    artist: "ROOTKIT",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  }
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = PLAYLIST[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Audio play error:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
    setIsPlaying(true);
  };
  
  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleTrackEnded = () => {
    handleNext();
  };

  return (
    <div className="border-glitch p-6 w-full max-w-sm flex flex-col items-start gap-6 relative">
      <div className="absolute top-0 left-0 bg-[#00ffff] text-black text-xs px-2 py-1 font-bold">
        AUDIO_STREAM.EXE
      </div>
      
      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnded}
      />
      
      <div className="w-full mt-4">
        <div className="text-[#ff00ff] text-xs mb-1 tracking-widest">CURRENT_FILE:</div>
        <h2 className="font-display text-3xl font-bold text-white uppercase glitch-text" data-text={currentTrack.title}>
          {currentTrack.title}
        </h2>
        <p className="text-[#00ffff] text-sm mt-1">SRC: {currentTrack.artist}</p>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full">
        <div className="text-xs text-gray-500 mb-1">BUFFER_STATUS: {Math.round(progress)}%</div>
        <div className="w-full h-4 border border-[#00ffff] bg-black relative">
          <div 
            className="h-full bg-[#ff00ff]" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      {/* Controls */}
      <div className="flex items-center justify-between w-full border-t border-b border-[#ff00ff] py-2">
        <button onClick={handlePrev} className="text-[#00ffff] hover:text-white hover:bg-[#00ffff] px-2 py-1 transition-colors">
          [PREV]
        </button>
        <button 
          onClick={togglePlay} 
          className="text-[#ff00ff] hover:text-white hover:bg-[#ff00ff] px-4 py-1 font-bold transition-colors text-xl"
        >
          {isPlaying ? '[PAUSE]' : '[PLAY]'}
        </button>
        <button onClick={handleNext} className="text-[#00ffff] hover:text-white hover:bg-[#00ffff] px-2 py-1 transition-colors">
          [NEXT]
        </button>
      </div>
      
      {/* Volume */}
      <div className="w-full">
        <div className="text-xs text-gray-500 mb-1">OUTPUT_GAIN:</div>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-full h-2 bg-black border border-[#ff00ff] appearance-none cursor-pointer accent-[#00ffff]"
        />
      </div>
    </div>
  );
}
