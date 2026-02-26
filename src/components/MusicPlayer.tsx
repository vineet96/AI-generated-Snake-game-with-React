import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';

const PLAYLIST = [
  {
    id: 1,
    title: "Neon Dreams",
    artist: "AI SynthBot Alpha",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://picsum.photos/seed/neon1/400/400"
  },
  {
    id: 2,
    title: "Cybernetic Pulse",
    artist: "Neural Network Beats",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://picsum.photos/seed/neon2/400/400"
  },
  {
    id: 3,
    title: "Digital Horizon",
    artist: "Algorithm Groove",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://picsum.photos/seed/neon3/400/400"
  }
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
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
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

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

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const percentage = x / bounds.width;
      audioRef.current.currentTime = percentage * audioRef.current.duration;
      setProgress(percentage * 100);
    }
  };

  return (
    <div className="bg-gray-900/80 backdrop-blur-md p-6 rounded-2xl neon-border-pink w-full max-w-sm flex flex-col items-center gap-4">
      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnded}
      />
      
      <div className="relative w-48 h-48 rounded-lg overflow-hidden neon-border">
        <img 
          src={currentTrack.cover} 
          alt="Album Cover" 
          className={`w-full h-full object-cover transition-transform duration-10000 ${isPlaying ? 'scale-110' : 'scale-100'}`}
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      
      <div className="text-center w-full">
        <h2 className="font-display text-xl font-bold text-white truncate neon-text-pink">{currentTrack.title}</h2>
        <p className="text-pink-300/80 text-sm truncate">{currentTrack.artist}</p>
      </div>
      
      {/* Progress Bar */}
      <div 
        className="w-full h-2 bg-gray-800 rounded-full cursor-pointer overflow-hidden"
        onClick={handleProgressClick}
      >
        <div 
          className="h-full bg-pink-500 shadow-[0_0_10px_#f0f]" 
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* Controls */}
      <div className="flex items-center justify-center gap-6 w-full">
        <button onClick={handlePrev} className="text-white hover:text-pink-400 transition-colors">
          <SkipBack size={24} />
        </button>
        <button 
          onClick={togglePlay} 
          className="w-14 h-14 flex items-center justify-center bg-pink-500 hover:bg-pink-400 text-white rounded-full shadow-[0_0_15px_#f0f] transition-all transform hover:scale-105"
        >
          {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
        </button>
        <button onClick={handleNext} className="text-white hover:text-pink-400 transition-colors">
          <SkipForward size={24} />
        </button>
      </div>
      
      {/* Volume */}
      <div className="flex items-center gap-3 w-full mt-2">
        <button onClick={() => setIsMuted(!isMuted)} className="text-gray-400 hover:text-white">
          {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={isMuted ? 0 : volume}
          onChange={(e) => {
            setVolume(parseFloat(e.target.value));
            if (isMuted) setIsMuted(false);
          }}
          className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
        />
      </div>
    </div>
  );
}
