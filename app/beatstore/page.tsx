"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import BeatCard from "../components/beat-card"
import NavigationMenu from "../components/navigation-menu"
import { Menu, X, ArrowLeft } from "lucide-react"
import beatData from "../../beat-data.json"

interface Beat {
  id: string
  title: string
  description: string
  price: number
  previewUrl: string
  coverImage: string
  includesWav?: boolean
  fileFormat?: string
}

export default function BeatstorePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState("")
  const [activeTab, setActiveTab] = useState<"beats" | "loops">("beats")

  // Update time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        }),
      )
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  const currentItems: Beat[] = activeTab === "beats" ? beatData.beats : beatData.loops

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Grid Background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 218, 15, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 218, 15, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-md border-b border-[#ffda0f]/20">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-4">
            <Image src="/images/krash-logo.png" alt="KRASH" width={40} height={40} className="brightness-110" />
            <div className="hidden md:block">
              <div className="text-[#ffda0f] font-black text-lg">KRASH WORLD</div>
              <div className="text-gray-400 text-xs">LA BASED</div>
            </div>
          </Link>

          {/* Status Info */}
          <div className="hidden md:flex items-center space-x-8 text-xs text-gray-400 font-mono">
            <div>
              STATUS: <span className="text-[#00ff88]">ACTIVE</span>
            </div>
            <div>
              TIME: <span className="text-white">{currentTime}</span>
            </div>
            <div>
              USER: <span className="text-[#ffda0f]">VISITOR</span>
            </div>
          </div>

          {/* Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-[#ffda0f] hover:text-[#ffda0f]/80 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <NavigationMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          onNewsletterOpen={() => {}}
        />
      </header>

      {/* Main Content */}
      <main className="relative z-10 min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#ffda0f] hover:text-[#ffda0f]/80 transition-colors mb-8 font-mono text-sm"
          >
            <ArrowLeft size={16} />
            BACK TO KRASH WORLD
          </Link>

          {/* Page Header */}
          <div className="text-center mb-8">
            <div className="text-[#ffda0f] text-sm font-mono mb-2">GRLKRASH BEATSTORE</div>
            <h1 className="text-4xl md:text-6xl font-black mb-4">
              <span className="text-white">EXCLUSIVE</span>
              <br />
              <span className="text-[#ffda0f]">BEATS & LOOPS</span>
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-6">
              Premium beats and loops for your next project. Each purchase includes full audio files.
            </p>

            {/* Tabs */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setActiveTab("beats")}
                className={`px-6 py-2 rounded-lg font-bold transition-all ${
                  activeTab === "beats"
                    ? "bg-[#ffda0f] text-black"
                    : "bg-black/50 text-gray-400 hover:text-white border border-[#ffda0f]/20"
                }`}
              >
                BEATS ({beatData.beats.length})
              </button>
              <button
                onClick={() => setActiveTab("loops")}
                className={`px-6 py-2 rounded-lg font-bold transition-all ${
                  activeTab === "loops"
                    ? "bg-[#ffda0f] text-black"
                    : "bg-black/50 text-gray-400 hover:text-white border border-[#ffda0f]/20"
                }`}
              >
                LOOPS ({beatData.loops.length})
              </button>
            </div>
          </div>

          {/* Items Grid */}
          {currentItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {currentItems.map((item) => (
                <BeatCard key={item.id} beat={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400">
              No {activeTab} available yet.
            </div>
          )}

          {/* Info Section */}
          <div className="mt-16 text-center border-t border-[#ffda0f]/20 pt-12">
            <div className="text-[#ffda0f] text-sm font-mono mb-4">WHAT YOU GET</div>
            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto text-gray-300">
              <div>
                <div className="text-white font-bold mb-2">HIGH QUALITY AUDIO</div>
                <div className="text-sm">WAV or MP3 format for professional use</div>
              </div>
              <div>
                <div className="text-white font-bold mb-2">INSTANT DELIVERY</div>
                <div className="text-sm">Download link sent to your email after purchase</div>
              </div>
              <div>
                <div className="text-white font-bold mb-2">50% PUBLISHING RIGHTS</div>
                <div className="text-sm">Standard lease includes 50/50 publishing split and 2,500 unit distribution</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Info */}
      <div className="fixed bottom-4 left-6 text-xs text-gray-500 font-mono">
        <div>KRASH_WORLD_V1.0</div>
        <div>GRLKRASH © 2024</div>
      </div>

      <div className="fixed bottom-4 right-6 text-xs text-gray-500 font-mono">
        <div>BEATSTORE</div>
        <div>LA_BASED</div>
      </div>
    </div>
  )
}
