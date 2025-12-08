"use client"

import { useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Float } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Menu, X, Mail, Play } from "lucide-react"
import Image from "next/image"
// import InteractiveGRLKRASH from "./components/interactive-grlkrash"
import NewsletterPopup from "./components/newsletter-popup"
import SocialLinks from "./components/social-links"
import NavigationMenu from "./components/navigation-menu"
import AudioPlayer from "./components/audio-player"
import GLTFCharacter from "./components/gltf-character" // Uncomment when you have a 3D file
import { GRLKRASHChat } from "./components/grlkrash-chat"

export default function KrashWorldWebsite() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showNewsletter, setShowNewsletter] = useState(false)
  const [currentTime, setCurrentTime] = useState("")
  const [chatOpen, setChatOpen] = useState(false)

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

  useEffect(() => {
    // Show newsletter popup after 5 seconds
    const timer = setTimeout(() => {
      setShowNewsletter(true)
    }, 5000)
    return () => clearTimeout(timer)
  }, [])

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
          <div className="flex items-center space-x-4">
            <Image src="/images/krash-logo.png" alt="KRASH" width={40} height={40} className="brightness-110" />
            <div className="hidden md:block">
              <div className="text-[#ffda0f] font-black text-lg">KRASH WORLD</div>
              <div className="text-gray-400 text-xs">CINCINNATI BASED</div>
            </div>
          </div>

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
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <NavigationMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          onNewsletterOpen={() => setShowNewsletter(true)}
        />
      </header>

      {/* Main Content */}
      <main className="relative z-10 min-h-screen flex items-center justify-center pt-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Info */}
            <div className="space-y-8">
              <div>
                <div className="text-[#ffda0f] text-sm font-mono mb-2">CINCINNATI BASED</div>
                <h1 className="text-4xl md:text-6xl font-black mb-4">
                  <span className="text-white">WELCOME TO</span>
                  <br />
                  <span className="text-[#ffda0f]">KRASH WORLD</span>
                </h1>
                <p className="text-gray-300 text-lg leading-relaxed max-w-md">
                  Enter the universe of GRLKRASH - an exiled alien action figure fighting for truth, love, and
                  resistance against oppressive forces.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="bg-[#ffda0f] text-black hover:bg-[#ffda0f]/80 font-bold"
                  onClick={() => window.open("https://play.krash.world", "_blank")}
                >
                  <Play className="mr-2 h-4 w-4" />
                  ENTER WORLD
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-[#ffda0f] text-[#ffda0f] hover:bg-[#ffda0f] hover:text-black font-bold"
                  onClick={() => setShowNewsletter(true)}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  NEWSLETTER
                </Button>
              </div>

              {/* Game Cart */}
              <div className="hidden lg:block">
                <div className="text-[#ffda0f] text-sm font-mono mb-3">FEATURED</div>
                <a
                  href="https://zora.co/collect/base:0x1bf81236cacd7fd0c630fe0bb36e49cffda37b4c/1?referrer=0x4f6d0ca7e66d5e447862793f23904ba15f51f4de"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block relative w-32 h-32 hover:scale-105 transition-transform"
                >
                  <Image
                    src="/images/krash-game-cart.gif"
                    alt="Krash World Game Pass"
                    fill
                    className="object-contain"
                  />
                </a>
              </div>
            </div>

            {/* Right Side - 3D Character */}
            <div className="relative h-[500px] lg:h-[600px]">
              <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
                <Environment preset="city" />
                <ambientLight intensity={0.4} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#ffda0f" />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00ff88" />

                <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
                  <GLTFCharacter 
                    modelPath="/models/grlkrash.glb" 
                    position={[0, 0, 0]} 
                    scale={0.7}
                    onChatOpen={() => setChatOpen(true)}
                  />
                </Float>

                <OrbitControls
                  enableZoom={false}
                  enablePan={false}
                  autoRotate
                  autoRotateSpeed={0.5}
                  maxPolarAngle={Math.PI / 2}
                  minPolarAngle={Math.PI / 3}
                />
              </Canvas>

              {/* Interaction Hint */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-black/80 text-[#ffda0f] px-4 py-2 rounded-full text-sm font-mono border border-[#ffda0f]/30">
                  CLICK GRLKRASH TO CHAT
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* About Section */}
      <section className="py-16 border-t border-[#ffda0f]/20">
        <div className="container mx-auto px-6 text-center">
          <div className="text-[#ffda0f] text-sm font-mono mb-4">TRANSMEDIA IP ART PROJECT</div>
          <h2 className="text-2xl font-black text-white mb-4">BY CINCINNATI-BASED MULTIMEDIA ARTIST GRLKRASH</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Krash World is an immersive universe spanning music, games, art, and storytelling - exploring themes of
            love, resistance, and authentic human connection.
          </p>
        </div>
      </section>

      {/* Social Links */}
      <SocialLinks />

      {/* Newsletter Popup */}
      <NewsletterPopup isOpen={showNewsletter} onClose={() => setShowNewsletter(false)} />

      {/* Audio Player */}
      <AudioPlayer />

      {/* Chat Widget */}
      <GRLKRASHChat 
        apiUrl="/api/chat"
        isOpen={chatOpen}
        onOpenChange={setChatOpen}
      />

      {/* Bottom Info */}
      <div className="fixed bottom-4 left-6 text-xs text-gray-500 font-mono">
        <div>KRASH_WORLD_V1.0</div>
        <div>GRLKRASH © 2024</div>
      </div>

      <div className="fixed bottom-4 right-6 text-xs text-gray-500 font-mono">
        <div>MULTIMEDIA_ART_PROJECT</div>
        <div>CINCINNATI_BASED</div>
      </div>
    </div>
  )
}
