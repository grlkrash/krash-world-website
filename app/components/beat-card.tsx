"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
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
  includesWav?: boolean
  fileFormat?: string
  featured?: boolean
  genre?: string[]
}

interface BeatCardProps {
  beat: Beat
  viewMode?: "grid" | "list"
}

export default function BeatCard({ beat, viewMode = "grid" }: BeatCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const [audioError, setAudioError] = useState(false)

  const handlePlayPause = async () => {
    try {
      if (!audio) {
        console.log("🎵 Loading audio:", beat.previewUrl)
        const newAudio = new Audio(beat.previewUrl)
        newAudio.preload = "auto"
        
        newAudio.addEventListener("ended", () => setIsPlaying(false))
        newAudio.addEventListener("error", (e) => {
          console.error("❌ Audio error:", e)
          console.error("❌ Audio src:", newAudio.src)
          console.error("❌ Audio networkState:", newAudio.networkState)
          console.error("❌ Audio error code:", newAudio.error?.code, newAudio.error?.message)
          setAudioError(true)
          setIsPlaying(false)
        })
        newAudio.addEventListener("canplaythrough", () => {
          console.log("✅ Audio can play through")
          setAudioError(false)
        })
        newAudio.addEventListener("loadstart", () => {
          console.log("🔄 Audio load started")
        })
        newAudio.addEventListener("loadeddata", () => {
          console.log("✅ Audio data loaded")
        })
        newAudio.addEventListener("stalled", () => {
          console.warn("⚠️ Audio loading stalled")
        })
        
        setAudio(newAudio)
        try {
          await newAudio.play()
          console.log("✅ Audio playback started")
          setIsPlaying(true)
        } catch (playError) {
          console.error("❌ Play error:", playError)
          setAudioError(true)
          setIsPlaying(false)
        }
      } else {
        if (isPlaying) {
          audio.pause()
          setIsPlaying(false)
        } else {
          await audio.play()
          setIsPlaying(true)
        }
      }
    } catch (error) {
      console.error("❌ Playback error:", error)
      setAudioError(true)
      setIsPlaying(false)
    }
  }

  // List view layout
  if (viewMode === "list") {
    return (
      <Card className={`bg-black/80 border transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,218,15,0.3)] ${
        beat.featured 
          ? "border-[#ffda0f] hover:border-[#ffda0f] shadow-[0_0_30px_rgba(255,218,15,0.4)]" 
          : "border-[#ffda0f]/20 hover:border-[#ffda0f]/40"
      }`}>
        <div className="flex flex-col md:flex-row gap-4 p-4">
          {/* Thumbnail */}
          <div className="relative w-full md:w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
            <Image
              src={beat.coverImage}
              alt={beat.title}
              fill
              className="object-cover"
              sizes="128px"
            />
            {beat.featured && (
              <div className="absolute top-2 right-2 bg-[#ffda0f] text-black px-2 py-0.5 rounded-full text-xs font-black">
                FEATURED
              </div>
            )}
          </div>
          
          {/* Content */}
          <div className="flex-1 flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className="text-white text-lg font-black">{beat.title}</CardTitle>
                {beat.genre && beat.genre.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {beat.genre.slice(0, 2).map((g, i) => (
                      <span
                        key={i}
                        className="text-xs bg-[#ffda0f]/20 text-[#ffda0f] px-2 py-0.5 rounded border border-[#ffda0f]/30"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <CardDescription className="text-gray-300 text-sm line-clamp-2 mb-2">
                {beat.description}
              </CardDescription>
              
              {/* Audio Preview - Only for beats/loops */}
              {!beat.genre?.includes("Template") && (
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    onClick={handlePlayPause}
                    size="sm"
                    className="bg-[#ffda0f] text-black hover:bg-[#ffda0f]/80 flex-shrink-0 disabled:opacity-50"
                    aria-label={isPlaying ? "Pause preview" : "Play preview"}
                    disabled={audioError}
                  >
                    {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                  </Button>
                  <div className="flex-1 text-xs text-gray-400">
                    {audioError ? "Preview unavailable" : "PREVIEW"}
                  </div>
                </div>
              )}
            </div>
            
            {/* Price and Purchase */}
            <div className="flex flex-col md:items-end gap-3">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-[#ffda0f]">${beat.price}</span>
                <span className="text-gray-400 text-sm">USD</span>
              </div>
              {beat.fileFormat && (
                <div className="text-xs text-gray-400">
                  {beat.fileFormat}
                </div>
              )}
              <div className="w-full md:w-auto">
                <PayPalButton beat={beat} />
              </div>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  // Grid view layout (default)
  return (
    <Card className={`bg-black/80 border transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,218,15,0.3)] ${
      beat.featured 
        ? "border-[#ffda0f] hover:border-[#ffda0f] shadow-[0_0_30px_rgba(255,218,15,0.4)]" 
        : "border-[#ffda0f]/20 hover:border-[#ffda0f]/40"
    }`}>
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
          {beat.featured && (
            <div className="absolute top-4 right-4 bg-[#ffda0f] text-black px-3 py-1 rounded-full text-xs font-black">
              FEATURED
            </div>
          )}
          <div className="absolute bottom-4 left-4 right-4">
            <CardTitle className="text-white text-xl font-black mb-1">{beat.title}</CardTitle>
            {beat.genre && beat.genre.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {beat.genre.slice(0, 2).map((g, i) => (
                  <span
                    key={i}
                    className="text-xs bg-[#ffda0f]/20 text-[#ffda0f] px-2 py-0.5 rounded border border-[#ffda0f]/30"
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <CardDescription className="text-gray-300 text-sm leading-relaxed">
          {beat.description}
        </CardDescription>

        {/* Audio Preview - Only for beats/loops */}
        {!beat.genre?.includes("Template") && (
          <div className="flex items-center gap-3 bg-black/50 rounded-lg p-3 border border-[#ffda0f]/10">
            <Button
              onClick={handlePlayPause}
              size="icon"
              className="bg-[#ffda0f] text-black hover:bg-[#ffda0f]/80 flex-shrink-0 disabled:opacity-50"
              aria-label={isPlaying ? "Pause preview" : "Play preview"}
              disabled={audioError}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <div className="flex-1">
              <div className="text-xs text-gray-400 mb-1">
                {audioError ? (
                  <span className="text-red-400">Preview unavailable - Check console for details</span>
                ) : (
                  "PREVIEW"
                )}
              </div>
              {!audioError && (
                <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#ffda0f] transition-all duration-100"
                    style={{ width: audio && isPlaying ? "100%" : "0%" }}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* File Format & Price */}
        <div className="space-y-2">
          {beat.fileFormat && (
            <div className="text-xs text-gray-400">
              Format: <span className="text-[#ffda0f] font-semibold">{beat.fileFormat}</span>
            </div>
          )}
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#ffda0f]">${beat.price}</span>
            <span className="text-gray-400 text-sm">USD</span>
          </div>
        </div>

        {/* Lease Terms Summary - Only for beats/loops, not templates */}
        {!beat.genre?.includes("Template") && (
          <div className="bg-black/50 rounded-lg p-3 border border-[#ffda0f]/10 space-y-2">
            <div className="text-xs font-semibold text-[#ffda0f] mb-1">STANDARD LEASE INCLUDES:</div>
            <ul className="text-xs text-gray-300 space-y-1 list-disc list-inside">
              <li>50% Publishing Rights (50/50 split)</li>
              <li>2,500 Units • 50K Streams</li>
              <li>1 Music Video • Unlimited Live</li>
              <li>Lifetime License Term</li>
            </ul>
            <Link
              href="/lease-terms"
              className="text-xs text-[#ffda0f] hover:underline inline-block mt-2"
            >
              View Full Terms →
            </Link>
          </div>
        )}
        
        {/* Template Info */}
        {beat.genre?.includes("Template") && (
          <div className="bg-black/50 rounded-lg p-3 border border-[#ffda0f]/10 space-y-2">
            <div className="text-xs font-semibold text-[#ffda0f] mb-1">TEMPLATE INCLUDES:</div>
            <ul className="text-xs text-gray-300 space-y-1 list-disc list-inside">
              <li>Professional Channel Strip Settings</li>
              <li>Ready-to-use Logic Pro template</li>
              <li>Instant download after purchase</li>
              <li>Commercial use included</li>
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <PayPalButton beat={beat} />
      </CardFooter>
    </Card>
  )
}
