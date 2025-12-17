"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause } from "lucide-react"
import PayPalButton from "./paypal-button"

interface Beat {
  id: string
  title: string
  description: string
  price: number
  previewUrl: string
  coverImage: string
}

interface BeatCardProps {
  beat: Beat
}

export default function BeatCard({ beat }: BeatCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)

  const handlePlayPause = () => {
    if (!audio) {
      const newAudio = new Audio(beat.previewUrl)
      newAudio.addEventListener("ended", () => setIsPlaying(false))
      setAudio(newAudio)
      newAudio.play()
      setIsPlaying(true)
    } else {
      if (isPlaying) {
        audio.pause()
        setIsPlaying(false)
      } else {
        audio.play()
        setIsPlaying(true)
      }
    }
  }

  return (
    <Card className="bg-black/80 border border-[#ffda0f]/20 hover:border-[#ffda0f]/40 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,218,15,0.3)]">
      <CardHeader className="p-0">
        <div className="relative w-full aspect-square overflow-hidden rounded-t-lg">
          <Image
            src={beat.coverImage}
            alt={beat.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <CardTitle className="text-white text-xl font-black mb-1">{beat.title}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <CardDescription className="text-gray-300 text-sm leading-relaxed">
          {beat.description}
        </CardDescription>

        {/* Audio Preview */}
        <div className="flex items-center gap-3 bg-black/50 rounded-lg p-3 border border-[#ffda0f]/10">
          <Button
            onClick={handlePlayPause}
            size="icon"
            className="bg-[#ffda0f] text-black hover:bg-[#ffda0f]/80 flex-shrink-0"
            aria-label={isPlaying ? "Pause preview" : "Play preview"}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <div className="flex-1">
            <div className="text-xs text-gray-400 mb-1">PREVIEW</div>
            <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#ffda0f] transition-all duration-100"
                style={{ width: audio && isPlaying ? "100%" : "0%" }}
              />
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-[#ffda0f]">${beat.price}</span>
          <span className="text-gray-400 text-sm">USD</span>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <PayPalButton beat={beat} />
      </CardFooter>
    </Card>
  )
}
