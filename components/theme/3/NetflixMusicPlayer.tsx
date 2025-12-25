"use client";

import { useState, useEffect, useRef } from "react";
import { Music, MicOffIcon } from "lucide-react";

interface NetflixMusicPlayerProps {
  url: string;
  autoPlay?: boolean;
}

export default function NetflixMusicPlayer({ url, autoPlay = false }: NetflixMusicPlayerProps) {
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
    <div className="fixed bottom-24 right-4 z-40">
      <audio ref={audioRef} src={url} preload="metadata" loop />
      <button
        onClick={togglePlay}
        className="p-3 bg-red-600 rounded-full shadow-lg hover:bg-red-700 focus:outline-none transition-colors"
        title={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <Music className="h-5 w-5 text-white" />
        ) : (
          <MicOffIcon className="h-5 w-5 text-white" />
        )}
      </button>
    </div>
  );
}
