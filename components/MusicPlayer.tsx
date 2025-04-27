// components/MusicPlayer.tsx
"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause } from "lucide-react"

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  useEffect(() => {
    const audio = audioRef.current
    return () => {
      // cleanup: pause if unmount
      if (audio) {
        audio.pause()
      }
    }
  }, [])

  return (
    <div className="fixed top-4 right-4 z-50">
      <audio
        ref={audioRef}
        src="https://sin1.contabostorage.com/2db3bf1e16cd47a08843bb881e39cce7:indoinvite-staging/indoinvite-staging/indoinvite-staging/nikah/theme/music/1659167827.mp3"
        preload="auto"
        loop
      />
      <button onClick={togglePlay} className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 focus:outline-none">
        {isPlaying ? <Pause className="h-6 w-6 text-blue-600" /> : <Play className="h-6 w-6 text-blue-600" />}
      </button>
    </div>
  )
}