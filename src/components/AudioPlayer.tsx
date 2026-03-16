import React, { useEffect, useRef, useState } from 'react';
import { Music, Volume2, VolumeX, SkipForward, SkipBack, Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AudioPlayerProps {
  isPlaying: boolean;
  volume: number;
}

interface Track {
  title: string;
  artist: string;
  url: string;
}

const BONGO_FLAVA_PLAYLIST: Track[] = [
  { title: "Bongo Vibe 01", artist: "Dar es Salaam Beats", url: "https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8a73456.mp3" },
  { title: "Mwanza Nights", artist: "Lake Zone Collective", url: "https://cdn.pixabay.com/audio/2022/01/26/audio_d0c6b1b1b1.mp3" },
  { title: "Zanzibar Sunset", artist: "Island Rhythms", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { title: "Arusha Flow", artist: "Meru Sound", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { title: "Dodoma Groove", artist: "Capital City Band", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
  { title: "Tanga Rhythm", artist: "Coastal Vibes", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
  { title: "Kigoma Soul", artist: "Lake Tanganyika", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" },
  { title: "Mbeya Peak", artist: "Highland Beats", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3" },
  { title: "Morogoro Jam", artist: "Uluguru Sounds", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3" },
  { title: "Iringa Spirit", artist: "Southern Highlands", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" },
];

const AudioPlayer: React.FC<AudioPlayerProps> = ({ isPlaying, volume }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [showInfo, setShowInfo] = useState(false);

  const currentTrack = BONGO_FLAVA_PLAYLIST[currentTrackIndex];

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        audioRef.current?.pause();
      } else if (isPlaying) {
        audioRef.current?.play().catch(e => console.log("Audio play blocked", e));
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      if (isPlaying && !document.hidden) {
        audioRef.current.play().catch(e => console.log("Audio play blocked", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, volume, currentTrackIndex]);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % BONGO_FLAVA_PLAYLIST.length);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + BONGO_FLAVA_PLAYLIST.length) % BONGO_FLAVA_PLAYLIST.length);
  };

  useEffect(() => {
    if (isPlaying) {
      setShowInfo(true);
      const timer = setTimeout(() => setShowInfo(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [currentTrackIndex, isPlaying]);

  return (
    <>
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onEnded={handleNext}
      />
      
      {/* Track Info Overlay */}
      <AnimatePresence>
        {isPlaying && showInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: -20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 20, x: -20 }}
            className="fixed bottom-6 left-6 z-[100] bg-[#151619]/90 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-2xl flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Music className="text-black w-6 h-6 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">Now Playing</span>
              <span className="text-sm font-bold text-white truncate max-w-[150px]">{currentTrack.title}</span>
              <span className="text-[10px] text-white/40 uppercase font-mono">{currentTrack.artist}</span>
            </div>
            <div className="flex gap-1 ml-2">
              <button onClick={handlePrev} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                <SkipBack className="w-4 h-4 text-white/60" />
              </button>
              <button onClick={handleNext} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                <SkipForward className="w-4 h-4 text-white/60" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AudioPlayer;
