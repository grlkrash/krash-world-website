"use client"

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import BeatCard from "../components/beat-card"
import NavigationMenu from "../components/navigation-menu"
import { AudioProvider } from "../components/audio-context"
import { CartProvider } from "../components/cart-context"
import CartIcon from "../components/cart-icon"
import CartDrawer from "../components/cart-drawer"
import { Menu, X, ArrowLeft, Grid3x3, List, Filter, ChevronDown, SlidersHorizontal } from "lucide-react"
import beatData from "../../beat-data.json"

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

type SortOption = "default" | "price-asc" | "price-desc" | "alpha-asc" | "alpha-desc"

export default function BeatstorePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState("")
  const [activeTab, setActiveTab] = useState<"beats" | "loops" | "templates">("beats")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  
  // Filter states
  const [selectedTiers, setSelectedTiers] = useState<number[]>([])
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<SortOption>("default")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false)

  // Extract all unique genres from beats
  const allGenres = useMemo(() => {
    const genres = new Set<string>()
    beatData.beats.forEach((beat) => {
      beat.genre?.forEach((g) => {
        if (g !== "Template" && g !== "Logic Pro" && g !== "Loop") {
          genres.add(g)
        }
      })
    })
    return Array.from(genres).sort()
  }, [])

  // Tier configuration
  const tiers = [
    { tier: 1, label: "TIER 1", price: "$50", color: "bg-[#ffda0f] text-black" },
    { tier: 2, label: "TIER 2", price: "$25", color: "bg-[#00ff88] text-black" },
    { tier: 3, label: "TIER 3", price: "$15", color: "bg-[#ff6b6b] text-white" },
  ]

  // Toggle tier filter
  const handleTierToggle = (tier: number) => {
    setSelectedTiers((prev) =>
      prev.includes(tier) ? prev.filter((t) => t !== tier) : [...prev, tier]
    )
  }

  // Toggle genre filter
  const handleGenreToggle = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    )
  }

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedTiers([])
    setSelectedGenres([])
    setSortBy("default")
  }

  const hasActiveFilters = selectedTiers.length > 0 || selectedGenres.length > 0 || sortBy !== "default"

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

  // Close genre dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest("[data-genre-dropdown]")) {
        setIsGenreDropdownOpen(false)
      }
    }
    if (isGenreDropdownOpen) {
      document.addEventListener("click", handleClickOutside)
    }
    return () => document.removeEventListener("click", handleClickOutside)
  }, [isGenreDropdownOpen])

  // Reset filters when switching tabs
  useEffect(() => {
    handleClearFilters()
  }, [activeTab])

  // Get base items for current tab
  const baseItems: Beat[] = activeTab === "beats" 
    ? beatData.beats 
    : activeTab === "loops" 
    ? beatData.loops 
    : (beatData.templates || [])

  // Apply filters and sorting
  const filteredAndSortedItems = useMemo(() => {
    let items = [...baseItems]

    // Filter by tier (only for beats)
    if (selectedTiers.length > 0 && activeTab === "beats") {
      items = items.filter((item) => item.tier && selectedTiers.includes(item.tier))
    }

    // Filter by genre
    if (selectedGenres.length > 0) {
      items = items.filter((item) =>
        item.genre?.some((g) => selectedGenres.includes(g))
      )
    }

    // Apply sorting
    switch (sortBy) {
      case "price-asc":
        items.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        items.sort((a, b) => b.price - a.price)
        break
      case "alpha-asc":
        items.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "alpha-desc":
        items.sort((a, b) => b.title.localeCompare(a.title))
        break
      default:
        // Keep featured first for default
        break
    }

    return items
  }, [baseItems, selectedTiers, selectedGenres, sortBy, activeTab])

  // Separate featured and regular items from filtered results
  const featuredItems = sortBy === "default" 
    ? filteredAndSortedItems.filter(item => item.featured) 
    : []
  const regularItems = sortBy === "default" 
    ? filteredAndSortedItems.filter(item => !item.featured)
    : filteredAndSortedItems

  return (
    <CartProvider>
    <AudioProvider>
    <div className="min-h-screen bg-black text-white relative">
      {/* Grid Background */}
      <div
        className="fixed inset-0 opacity-20 pointer-events-none"
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

          {/* Cart & Menu */}
          <div className="flex items-center gap-2">
            <CartIcon onClick={() => setIsCartOpen(true)} />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-[#ffda0f] hover:text-[#ffda0f]/80 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
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
            {/* View Mode Toggle & Filter Toggle */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="flex items-center gap-2">
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
              
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
                  isFilterOpen || hasActiveFilters
                    ? "bg-[#ffda0f] text-black"
                    : "bg-black/50 text-gray-400 hover:text-white border border-[#ffda0f]/20"
                }`}
                aria-label="Toggle filters"
              >
                <SlidersHorizontal size={18} />
                FILTERS
                {hasActiveFilters && (
                  <span className="bg-black text-[#ffda0f] text-xs px-1.5 py-0.5 rounded-full">
                    {selectedTiers.length + selectedGenres.length + (sortBy !== "default" ? 1 : 0)}
                  </span>
                )}
              </button>
            </div>

            {/* Filter Panel */}
            {isFilterOpen && (
              <div className="bg-black/80 border border-[#ffda0f]/30 rounded-xl p-6 mb-8 backdrop-blur-sm">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Tier Filter - Only show for beats */}
                  {activeTab === "beats" && (
                    <div className="flex-1">
                      <div className="text-[#ffda0f] text-xs font-mono mb-3 flex items-center gap-2">
                        <Filter size={14} />
                        FILTER BY TIER
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {tiers.map(({ tier, label, price, color }) => (
                          <button
                            key={tier}
                            onClick={() => handleTierToggle(tier)}
                            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                              selectedTiers.includes(tier)
                                ? color
                                : "bg-black/50 text-gray-400 hover:text-white border border-[#ffda0f]/20"
                            }`}
                            aria-label={`Filter by ${label}`}
                            aria-pressed={selectedTiers.includes(tier)}
                          >
                            {label} ({price})
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Genre Filter */}
                  <div className="flex-1">
                    <div className="text-[#ffda0f] text-xs font-mono mb-3 flex items-center gap-2">
                      <Filter size={14} />
                      FILTER BY GENRE
                    </div>
                    <div className="relative" data-genre-dropdown>
                      <button
                        onClick={() => setIsGenreDropdownOpen(!isGenreDropdownOpen)}
                        className="w-full flex items-center justify-between px-4 py-2 rounded-lg bg-black/50 text-gray-400 hover:text-white border border-[#ffda0f]/20 transition-all"
                      >
                        <span>
                          {selectedGenres.length > 0
                            ? `${selectedGenres.length} genre${selectedGenres.length > 1 ? "s" : ""} selected`
                            : "Select genres..."}
                        </span>
                        <ChevronDown
                          size={18}
                          className={`transition-transform ${isGenreDropdownOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                      
                      {isGenreDropdownOpen && (
                        <div className="absolute z-50 mt-2 w-full max-h-64 overflow-y-auto bg-black/95 border border-[#ffda0f]/30 rounded-lg shadow-xl backdrop-blur-sm">
                          <div className="p-2 flex flex-wrap gap-1">
                            {allGenres.map((genre) => (
                              <button
                                key={genre}
                                onClick={() => handleGenreToggle(genre)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                                  selectedGenres.includes(genre)
                                    ? "bg-[#ffda0f] text-black"
                                    : "bg-[#ffda0f]/10 text-[#ffda0f] hover:bg-[#ffda0f]/20 border border-[#ffda0f]/30"
                                }`}
                              >
                                {genre}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Selected genres display */}
                    {selectedGenres.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {selectedGenres.map((genre) => (
                          <span
                            key={genre}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-[#ffda0f] text-black rounded-full text-xs font-bold"
                          >
                            {genre}
                            <button
                              onClick={() => handleGenreToggle(genre)}
                              className="hover:bg-black/20 rounded-full p-0.5"
                              aria-label={`Remove ${genre} filter`}
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Sort Options */}
                  <div className="flex-1">
                    <div className="text-[#ffda0f] text-xs font-mono mb-3 flex items-center gap-2">
                      <SlidersHorizontal size={14} />
                      SORT BY
                    </div>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="w-full px-4 py-2 rounded-lg bg-black/50 text-white border border-[#ffda0f]/20 focus:border-[#ffda0f] focus:outline-none transition-all cursor-pointer"
                    >
                      <option value="default">Featured First</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="alpha-asc">Name: A to Z</option>
                      <option value="alpha-desc">Name: Z to A</option>
                    </select>
                  </div>
                </div>

                {/* Clear Filters & Results Count */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#ffda0f]/10">
                  <div className="text-gray-400 text-sm">
                    Showing <span className="text-[#ffda0f] font-bold">{filteredAndSortedItems.length}</span> of{" "}
                    <span className="text-white">{baseItems.length}</span> {activeTab}
                  </div>
                  {hasActiveFilters && (
                    <button
                      onClick={handleClearFilters}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-[#ff6b6b] hover:bg-[#ff6b6b]/10 transition-all"
                    >
                      <X size={16} />
                      CLEAR ALL FILTERS
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Featured Section - Only show when not sorting */}
          {featuredItems.length > 0 && sortBy === "default" && (activeTab === "beats" || activeTab === "templates") && (
            <div className="mb-16 scroll-mt-24">
              <div className="text-center mb-8">
                <div className="text-[#ffda0f] text-sm font-mono mb-2">PREMIUM SELECTION</div>
                <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
                  FEATURED <span className="text-[#ffda0f]">{activeTab.toUpperCase()}</span>
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
          {filteredAndSortedItems.length > 0 ? (
            <div className="scroll-mt-24">
              {featuredItems.length > 0 && sortBy === "default" && regularItems.length > 0 && (activeTab === "beats" || activeTab === "templates") && (
                <div className="text-center mb-8">
                  <div className="text-[#ffda0f] text-sm font-mono mb-2">FULL CATALOG</div>
                  <h2 className="text-2xl md:text-3xl font-black text-white">
                    ALL <span className="text-[#ffda0f]">{activeTab.toUpperCase()}</span>
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
            <div className="text-center py-16">
              <div className="text-gray-400 text-lg mb-4">
                No {activeTab} match your filters.
              </div>
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#ffda0f] text-black font-bold hover:bg-[#ffda0f]/80 transition-all"
                >
                  <X size={18} />
                  CLEAR FILTERS
                </button>
              )}
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
      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
    </AudioProvider>
    </CartProvider>
  )
}
