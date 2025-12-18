"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import BeatCard from "../components/beat-card"
import NavigationMenu from "../components/navigation-menu"
import { Menu, X, ArrowLeft, Grid3x3, List } from "lucide-react"
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
  featured?: boolean
  genre?: string[]
}

export default function BeatstorePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState("")
  const [activeTab, setActiveTab] = useState<"beats" | "loops" | "templates">("beats")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

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

  // Separate featured and regular items
  const allItems: Beat[] = activeTab === "beats" 
    ? beatData.beats 
    : activeTab === "loops" 
    ? beatData.loops 
    : (beatData.templates || [])
  const featuredItems = allItems.filter(item => item.featured)
  const regularItems = allItems.filter(item => !item.featured)

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
      </header>

      {/* Mobile Menu - Outside header for proper z-index stacking */}
      <NavigationMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onNewsletterOpen={() => {}}
      />

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
              <span className="text-[#ffda0f]">
                {activeTab === "templates" ? "TEMPLATES" : activeTab === "loops" ? "BEATS & LOOPS" : "BEATS & LOOPS"}
              </span>
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-6">
              {activeTab === "templates" 
                ? "Professional Logic Pro mixing templates and channel strip settings."
                : "Premium beats, loops, and Logic Pro templates for your next project."}
            </p>

            {/* Tabs and View Toggle */}
            <div className="flex items-center justify-center gap-4 flex-wrap mb-4">
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
              {beatData.templates && beatData.templates.length > 0 && (
                <button
                  onClick={() => setActiveTab("templates")}
                  className={`px-6 py-2 rounded-lg font-bold transition-all ${
                    activeTab === "templates"
                      ? "bg-[#ffda0f] text-black"
                      : "bg-black/50 text-gray-400 hover:text-white border border-[#ffda0f]/20"
                  }`}
                >
                  TEMPLATES ({beatData.templates.length})
                </button>
              )}
            </div>
            {/* View Mode Toggle */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "grid"
                    ? "bg-[#ffda0f] text-black"
                    : "bg-black/50 text-gray-400 hover:text-white border border-[#ffda0f]/20"
                }`}
                aria-label="Grid view"
              >
                <Grid3x3 size={20} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "list"
                    ? "bg-[#ffda0f] text-black"
                    : "bg-black/50 text-gray-400 hover:text-white border border-[#ffda0f]/20"
                }`}
                aria-label="List view"
              >
                <List size={20} />
              </button>
            </div>
          </div>

          {/* Featured Section */}
          {featuredItems.length > 0 && (activeTab === "beats" || activeTab === "templates") && (
            <div className="mb-16">
              <div className="text-center mb-8">
                <div className="text-[#ffda0f] text-sm font-mono mb-2">PREMIUM SELECTION</div>
                <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
                  FEATURED <span className="text-[#ffda0f]">BEATS</span>
                </h2>
                <p className="text-gray-400 text-sm">Handpicked premium tracks</p>
              </div>
              <div className={viewMode === "list" 
                ? "space-y-4 mb-12" 
                : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
              }>
                {featuredItems.map((item) => (
                  <BeatCard key={item.id} beat={item} viewMode={viewMode} />
                ))}
              </div>
            </div>
          )}

          {/* All Items Grid */}
          {allItems.length > 0 ? (
            <div>
              {featuredItems.length > 0 && (activeTab === "beats" || activeTab === "templates") && (
                <div className="text-center mb-8">
                  <div className="text-[#ffda0f] text-sm font-mono mb-2">FULL CATALOG</div>
                  <h2 className="text-2xl md:text-3xl font-black text-white">
                    ALL <span className="text-[#ffda0f]">BEATS</span>
                  </h2>
                </div>
              )}
              <div className={viewMode === "list" 
                ? "space-y-4 mb-16" 
                : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
              }>
                {regularItems.map((item) => (
                  <BeatCard key={item.id} beat={item} viewMode={viewMode} />
                ))}
              </div>
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

          {/* Contact Section */}
          <div className="mt-12 text-center border-t border-[#ffda0f]/20 pt-12">
            <div className="text-[#ffda0f] text-sm font-mono mb-4">NEED EXCLUSIVE RIGHTS?</div>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Interested in purchasing exclusive rights to a beat? Contact us to discuss pricing and terms.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-[#ffda0f] text-black px-8 py-3 rounded-lg font-bold hover:bg-[#ffda0f]/80 transition-colors"
            >
              CONTACT US
            </Link>
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
