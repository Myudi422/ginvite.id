"use client";

import { useState, useEffect, useRef } from "react";
import { Music, MicOffIcon } from "lucide-react";

interface MusicPlayerProps {
  url: string;
  autoPlay?: boolean;
}

export default function MusicPlayer({ url, autoPlay = false }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.warn("Audio play was interrupted:", err));
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    // autoplay handling
    if (audio && autoPlay) {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.warn("Audio autoPlay interrupted:", err));
    }

    // pause ketika tab blur / user pindah tab
    const handleVisibility = () => {
      if (document.hidden && audio) {
        audio.pause();
        setIsPlaying(false);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    // pause juga saat page unload/hide (mobile back, refresh, close)
    const handlePageHide = () => {
      if (audio) audio.pause();
      setIsPlaying(false);
    };
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      // cleanup
      if (audio) audio.pause();
      setIsPlaying(false);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, [autoPlay]);

  return (
    <div className="fixed bottom-24 right-6 z-40">
      <audio ref={audioRef} src={url} preload="metadata" loop />
      <button
        onClick={togglePlay}
        className={`p-3 rounded-full shadow-xl focus:outline-none transition-all duration-300 transform hover:scale-105 ${isPlaying
          ? "bg-amber-600/80 hover:bg-amber-600 text-white animate-spin-slow"
          : "bg-zinc-800/80 hover:bg-zinc-800 text-gray-400"
          } backdrop-blur-sm border border-white/10`}
        title={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <Music className="h-5 w-5" />
        ) : (
          <MicOffIcon className="h-5 w-5" />
        )}
      </button>
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
}
