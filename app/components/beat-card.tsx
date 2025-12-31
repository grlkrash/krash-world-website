"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause } from "lucide-react"
import PayPalButton from "./paypal-button"
import { useAudio } from "./audio-context"

interface Beat {
  id: string
  title: string
  description: string
  price: number
  tier?: number
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
  const { playAudio, isPlaying } = useAudio()
  const [audioError, setAudioError] = useState(false)
  const currentlyPlaying = isPlaying(beat.id)

  const handlePlayPause = async () => {
    try {
      setAudioError(false)
      await playAudio(beat.id, beat.previewUrl)
    } catch (error) {
      console.error("Playback error:", error)
      setAudioError(true)
    }
  }

  // Tier styling configuration
  const tierConfig = {
    1: {
      badge: "bg-gradient-to-r from-[#ffda0f] via-[#fff176] to-[#ffda0f] text-black shadow-[0_0_10px_rgba(255,218,15,0.5)]",
      border: "border-[#ffda0f]",
      glow: "shadow-[0_0_25px_rgba(255,218,15,0.4),0_0_50px_rgba(255,218,15,0.2),inset_0_0_20px_rgba(255,218,15,0.05)]",
      hoverGlow: "hover:shadow-[0_0_35px_rgba(255,218,15,0.6),0_0_60px_rgba(255,218,15,0.3)]",
      accent: "bg-gradient-to-br from-[#ffda0f]/10 via-transparent to-[#ffda0f]/5",
      priceColor: "text-[#ffda0f]",
      label: "PREMIUM"
    },
    2: {
      badge: "bg-gradient-to-r from-[#00ff88] via-[#50ffab] to-[#00ff88] text-black shadow-[0_0_10px_rgba(0,255,136,0.5)]",
      border: "border-[#00ff88]",
      glow: "shadow-[0_0_25px_rgba(0,255,136,0.3),0_0_50px_rgba(0,255,136,0.15),inset_0_0_20px_rgba(0,255,136,0.05)]",
      hoverGlow: "hover:shadow-[0_0_35px_rgba(0,255,136,0.5),0_0_60px_rgba(0,255,136,0.25)]",
      accent: "bg-gradient-to-br from-[#00ff88]/10 via-transparent to-[#00ff88]/5",
      priceColor: "text-[#00ff88]",
      label: "STANDARD"
    },
    3: {
      badge: "bg-gradient-to-r from-[#ff6b6b] via-[#ff8a8a] to-[#ff6b6b] text-white shadow-[0_0_10px_rgba(255,107,107,0.5)]",
      border: "border-[#ff6b6b]",
      glow: "shadow-[0_0_25px_rgba(255,107,107,0.3),0_0_50px_rgba(255,107,107,0.15),inset_0_0_20px_rgba(255,107,107,0.05)]",
      hoverGlow: "hover:shadow-[0_0_35px_rgba(255,107,107,0.5),0_0_60px_rgba(255,107,107,0.25)]",
      accent: "bg-gradient-to-br from-[#ff6b6b]/10 via-transparent to-[#ff6b6b]/5",
      priceColor: "text-[#ff6b6b]",
      label: "VALUE"
    }
  }

  // Get current tier config or default
  const currentTier = beat.tier ? tierConfig[beat.tier as 1 | 2 | 3] : null

  // Get tier badge
  const getTierBadge = () => {
    if (!beat.tier || !currentTier) return null
    return (
      <span className={`text-xs px-2.5 py-1 rounded-full font-black tracking-wide ${currentTier.badge}`}>
        TIER {beat.tier} • {currentTier.label}
      </span>
    )
  }

  // Get card classes based on tier
  const getCardClasses = () => {
    const baseClasses = "transition-all duration-300"
    
    if (beat.featured) {
      return `${baseClasses} border-2 border-[#ffda0f] shadow-[0_0_40px_rgba(255,218,15,0.5)] hover:shadow-[0_0_50px_rgba(255,218,15,0.7)]`
    }
    
    if (currentTier) {
      return `${baseClasses} border-2 ${currentTier.border} ${currentTier.glow} ${currentTier.hoverGlow}`
    }
    
    return `${baseClasses} border border-[#ffda0f]/20 hover:border-[#ffda0f]/40 hover:shadow-[0_0_20px_rgba(255,218,15,0.3)]`
  }

  // List view layout
  if (viewMode === "list") {
    return (
      <Card className={`relative overflow-hidden bg-black/80 ${getCardClasses()}`}>
        {/* Tier accent gradient overlay */}
        {currentTier && (
          <div className={`absolute inset-0 ${currentTier.accent} pointer-events-none`} />
        )}
        
        <div className="relative flex flex-col md:flex-row gap-4 p-4">
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
              <div className="absolute top-2 right-2 bg-[#ffda0f] text-black px-2 py-0.5 rounded-full text-xs font-black animate-pulse">
                ★ FEATURED
              </div>
            )}
            {/* Tier indicator strip at bottom of image */}
            {currentTier && (
              <div className={`absolute bottom-0 left-0 right-0 h-1 ${currentTier.border.replace('border-', 'bg-')}`} />
            )}
          </div>
          
          {/* Content */}
          <div className="flex-1 flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <CardTitle className="text-white text-lg font-black">{beat.title}</CardTitle>
                {getTierBadge()}
              </div>
              {beat.genre && beat.genre.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {beat.genre.slice(0, 3).map((g, i) => (
                    <span
                      key={i}
                      className={`text-xs px-2 py-0.5 rounded border ${
                        currentTier 
                          ? `${currentTier.border.replace('border-', 'bg-')}/20 ${currentTier.priceColor} ${currentTier.border}/30`
                          : "bg-[#ffda0f]/20 text-[#ffda0f] border-[#ffda0f]/30"
                      }`}
                    >
                      {g}
                    </span>
                  ))}
                </div>
              )}
              <CardDescription className="text-gray-300 text-sm line-clamp-2 mb-2">
                {beat.description}
              </CardDescription>
              
              {/* Audio Preview - Only for beats/loops */}
              {!beat.genre?.includes("Template") && (
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    onClick={handlePlayPause}
                    size="sm"
                    className={`flex-shrink-0 disabled:opacity-50 ${
                      currentTier 
                        ? `${currentTier.border.replace('border-', 'bg-')} text-black hover:opacity-80`
                        : "bg-[#ffda0f] text-black hover:bg-[#ffda0f]/80"
                    }`}
                    aria-label={currentlyPlaying ? "Pause preview" : "Play preview"}
                    disabled={audioError}
                  >
                    {currentlyPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                  </Button>
                  <div className="flex-1 text-xs text-gray-400">
                    {audioError ? "Preview unavailable" : currentlyPlaying ? "NOW PLAYING" : "PREVIEW"}
                  </div>
                </div>
              )}
            </div>
            
            {/* Price and Purchase */}
            <div className="flex flex-col md:items-end gap-3">
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-black ${currentTier?.priceColor || "text-[#ffda0f]"}`}>
                  ${beat.price}
                </span>
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
    <Card className={`relative overflow-hidden bg-black/80 ${getCardClasses()}`}>
      {/* Tier accent gradient overlay */}
      {currentTier && (
        <div className={`absolute inset-0 ${currentTier.accent} pointer-events-none z-0`} />
      )}
      
      {/* Glowing edge effect for tier cards */}
      {currentTier && (
        <div 
          className={`absolute inset-0 rounded-lg pointer-events-none`}
          style={{
            background: `linear-gradient(135deg, ${
              beat.tier === 1 ? 'rgba(255,218,15,0.15)' : 
              beat.tier === 2 ? 'rgba(0,255,136,0.15)' : 
              'rgba(255,107,107,0.15)'
            } 0%, transparent 50%, ${
              beat.tier === 1 ? 'rgba(255,218,15,0.1)' : 
              beat.tier === 2 ? 'rgba(0,255,136,0.1)' : 
              'rgba(255,107,107,0.1)'
            } 100%)`
          }}
        />
      )}

      <CardHeader className="p-0 relative z-10">
        <div className="relative w-full aspect-square overflow-hidden rounded-t-lg">
          <Image
            src={beat.coverImage}
            alt={beat.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Tier-colored gradient overlay at bottom */}
          <div 
            className="absolute inset-0"
            style={{
              background: currentTier 
                ? `linear-gradient(to top, ${
                    beat.tier === 1 ? 'rgba(0,0,0,0.9), rgba(255,218,15,0.1)' : 
                    beat.tier === 2 ? 'rgba(0,0,0,0.9), rgba(0,255,136,0.1)' : 
                    'rgba(0,0,0,0.9), rgba(255,107,107,0.1)'
                  } 40%, transparent 100%)`
                : 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)'
            }}
          />
          {beat.featured && (
            <div className="absolute top-4 right-4 bg-[#ffda0f] text-black px-3 py-1 rounded-full text-xs font-black animate-pulse shadow-[0_0_15px_rgba(255,218,15,0.6)]">
              ★ FEATURED
            </div>
          )}
          {beat.tier && (
            <div className="absolute top-4 left-4">
              {getTierBadge()}
            </div>
          )}
          <div className="absolute bottom-4 left-4 right-4">
            <CardTitle className="text-white text-xl font-black mb-1 drop-shadow-lg">{beat.title}</CardTitle>
            {beat.genre && beat.genre.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {beat.genre.slice(0, 3).map((g, i) => (
                  <span
                    key={i}
                    className={`text-xs px-2 py-0.5 rounded border backdrop-blur-sm ${
                      currentTier 
                        ? `bg-black/50 ${currentTier.priceColor} ${currentTier.border}/50`
                        : "bg-[#ffda0f]/20 text-[#ffda0f] border-[#ffda0f]/30"
                    }`}
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-4 relative z-10">
        <CardDescription className="text-gray-300 text-sm leading-relaxed">
          {beat.description}
        </CardDescription>

        {/* Audio Preview - Only for beats/loops */}
        {!beat.genre?.includes("Template") && (
          <div className={`flex items-center gap-3 bg-black/50 rounded-lg p-3 border ${
            currentTier ? `${currentTier.border}/20` : "border-[#ffda0f]/10"
          }`}>
            <Button
              onClick={handlePlayPause}
              size="icon"
              className={`flex-shrink-0 disabled:opacity-50 ${
                currentTier 
                  ? `${currentTier.border.replace('border-', 'bg-')} text-black hover:opacity-80`
                  : "bg-[#ffda0f] text-black hover:bg-[#ffda0f]/80"
              }`}
              aria-label={currentlyPlaying ? "Pause preview" : "Play preview"}
              disabled={audioError}
            >
              {currentlyPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <div className="flex-1">
              <div className="text-xs text-gray-400 mb-1">
                {audioError ? (
                  <span className="text-red-400">Preview unavailable</span>
                ) : currentlyPlaying ? (
                  <span className={currentTier?.priceColor || "text-[#00ff88]"}>NOW PLAYING</span>
                ) : (
                  "PREVIEW"
                )}
              </div>
              {!audioError && (
                <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-100 ${currentlyPlaying ? "animate-pulse" : ""} ${
                      currentTier ? currentTier.border.replace('border-', 'bg-') : "bg-[#ffda0f]"
                    }`}
                    style={{ width: currentlyPlaying ? "100%" : "0%" }}
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
              Format: <span className={`font-semibold ${currentTier?.priceColor || "text-[#ffda0f]"}`}>{beat.fileFormat}</span>
            </div>
          )}
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-black ${currentTier?.priceColor || "text-[#ffda0f]"}`}>
              ${beat.price}
            </span>
            <span className="text-gray-400 text-sm">USD</span>
          </div>
        </div>

        {/* Lease Terms Summary - Only for beats/loops, not templates */}
        {!beat.genre?.includes("Template") && (
          <div className={`bg-black/50 rounded-lg p-3 border space-y-2 ${
            currentTier ? `${currentTier.border}/20` : "border-[#ffda0f]/10"
          }`}>
            <div className={`text-xs font-semibold mb-1 ${currentTier?.priceColor || "text-[#ffda0f]"}`}>
              STANDARD LEASE INCLUDES:
            </div>
            <ul className="text-xs text-gray-300 space-y-1 list-disc list-inside">
              <li>50% Publishing Rights (50/50 split)</li>
              <li>2,500 Units • 50K Streams</li>
              <li>1 Music Video • Unlimited Live</li>
              <li>Lifetime License Term</li>
            </ul>
            <Link
              href="/lease-terms"
              className={`text-xs hover:underline inline-block mt-2 ${currentTier?.priceColor || "text-[#ffda0f]"}`}
            >
              View Full Terms →
            </Link>
          </div>
        )}
        
        {/* Template Info */}
        {beat.genre?.includes("Template") && (
          <div className={`bg-black/50 rounded-lg p-3 border space-y-2 ${
            currentTier ? `${currentTier.border}/20` : "border-[#ffda0f]/10"
          }`}>
            <div className={`text-xs font-semibold mb-1 ${currentTier?.priceColor || "text-[#ffda0f]"}`}>
              TEMPLATE INCLUDES:
            </div>
            <ul className="text-xs text-gray-300 space-y-1 list-disc list-inside">
              <li>Professional Channel Strip Settings</li>
              <li>Ready-to-use Logic Pro template</li>
              <li>Instant download after purchase</li>
              <li>Commercial use included</li>
            </ul>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-6 pt-0 relative z-10">
        <PayPalButton beat={beat} />
      </CardFooter>
    </Card>
  )
}
