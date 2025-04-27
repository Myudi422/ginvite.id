// components/MusicPlayer.tsx
"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause } from "lucide-react"

interface MusicPlayerProps {
  autoPlay?: boolean
}

export default function MusicPlayer({ autoPlay = false }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play()
      setIsPlaying(true)
    }
  }

  useEffect(() => {
    const audio = audioRef.current
    if (audio && autoPlay) {
      audio.play()
      setIsPlaying(true)
    }
    return () => {
      if (audio) {
        audio.pause()
      }
    }
  }, [autoPlay])

  return (
    <div className="fixed top-4 right-4 z-50">
      <audio
        ref={audioRef}
        src="https://sin1.contabostorage.com/2db3bf1e16cd47a08843bb881e39cce7:indoinvite-staging/indoinvite-staging/indoinvite-staging/nikah/theme/music/1659167827.mp3"
        preload="auto"
        loop
      />
      <button
        onClick={togglePlay}
        className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 focus:outline-none"
      >
        {isPlaying ? <Pause className="h-6 w-6 text-blue-600" /> : <Play className="h-6 w-6 text-blue-600" />}
      </button>
    </div>
  )
}
