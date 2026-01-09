"use client"

import { createContext, useContext, useState, useRef, useCallback, ReactNode } from "react"

interface AudioContextType {
  currentPlayingId: string | null
  playAudio: (id: string, url: string) => Promise<void>
  pauseAudio: () => void
  isPlaying: (id: string) => boolean
}

const AudioContext = createContext<AudioContextType | null>(null)

export function AudioProvider({ children }: { children: ReactNode }) {
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const playAudio = useCallback(async (id: string, url: string) => {
    // If same audio is playing, just pause it
    if (currentPlayingId === id && audioRef.current) {
      audioRef.current.pause()
      setCurrentPlayingId(null)
      return
    }

    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }

    // Create new audio instance
    const audio = new Audio(url)
    audio.preload = "auto"
    
    audio.addEventListener("ended", () => {
      setCurrentPlayingId(null)
    })

    audio.addEventListener("error", (e) => {
      console.error("Audio error:", e)
      setCurrentPlayingId(null)
    })

    audioRef.current = audio
    
    try {
      await audio.play()
      setCurrentPlayingId(id)
    } catch (error) {
      console.error("Playback error:", error)
      setCurrentPlayingId(null)
    }
  }, [currentPlayingId])

  const pauseAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      setCurrentPlayingId(null)
    }
  }, [])

  const isPlaying = useCallback((id: string) => {
    return currentPlayingId === id
  }, [currentPlayingId])

  return (
    <AudioContext.Provider value={{ currentPlayingId, playAudio, pauseAudio, isPlaying }}>
      {children}
    </AudioContext.Provider>
  )
}

export function useAudio() {
  const context = useContext(AudioContext)
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider")
  }
  return context
}



