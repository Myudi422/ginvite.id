"use client"

import { useEffect, useRef } from "react"

interface MusicPlayerProps {
  isPlaying: boolean
}

export default function MusicPlayer({ isPlaying }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Create audio element if it doesn't exist
    if (!audioRef.current) {
      audioRef.current = new Audio("/background-music.mp3")
      audioRef.current.loop = true
    }

    // Play or pause based on isPlaying prop
    if (isPlaying) {
      const playPromise = audioRef.current.play()

      // Handle play() promise to avoid DOMException
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Playback started successfully
          })
          .catch((error) => {
            // Auto-play was prevented
            console.log("Playback prevented:", error)
          })
      }
    } else {
      audioRef.current.pause()
    }

    // Cleanup function
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [isPlaying])

  return null // This component doesn't render anything
}
