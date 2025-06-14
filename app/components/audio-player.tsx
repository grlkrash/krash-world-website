"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, Play, Pause } from "lucide-react"

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [volume, setVolume] = useState(0.3)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Add your music file to the public folder and reference it here
  const audioSrc = "/audio/krash-world-theme.mp3" // You'll need to add this file

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [isMuted, volume])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30">
      <div className="bg-black/80 backdrop-blur-md border border-[#ffda0f]/30 rounded-full px-4 py-2 flex items-center space-x-3">
        <Button
          size="sm"
          variant="ghost"
          onClick={togglePlay}
          className="text-[#ffda0f] hover:bg-[#ffda0f]/20 rounded-full w-8 h-8 p-0"
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </Button>

        <div className="text-[#ffda0f] text-xs font-mono">{isPlaying ? "NOW PLAYING" : "KRASH WORLD"}</div>

        <Button
          size="sm"
          variant="ghost"
          onClick={toggleMute}
          className="text-[#ffda0f] hover:bg-[#ffda0f]/20 rounded-full w-8 h-8 p-0"
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </Button>
      </div>

      <audio ref={audioRef} src={audioSrc} loop onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} />
    </div>
  )
}
