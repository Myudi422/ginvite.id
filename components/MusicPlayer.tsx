// components/MusicPlayer.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause } from "lucide-react";

interface MusicPlayerProps {
  url: string;
  autoPlay?: boolean;
  accentColor?: string; // Add accentColor prop
}

export default function MusicPlayer({ url, autoPlay = false, accentColor = "#c80e5f" }: MusicPlayerProps) {
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
    <div className="fixed top-4 right-4 z-50">
      <audio ref={audioRef} src={url} preload="auto" loop />
      <button
        onClick={togglePlay}
        className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 focus:outline-none"
      >
        {isPlaying ? 
          <Pause className="h-6 w-6" style={{ color: accentColor }} /> : 
          <Play className="h-6 w-6" style={{ color: accentColor }} />
        }
      </button>
    </div>
  );
}
