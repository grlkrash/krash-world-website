"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Mail, CheckCircle, AlertCircle, Gift, Music, Sparkles } from "lucide-react"

interface NewsletterPopupProps {
  isOpen: boolean
  onClose: () => void
}

export default function NewsletterPopup({ isOpen, onClose }: NewsletterPopupProps) {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [showPromo, setShowPromo] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name: name || 'Anonymous' }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) throw new Error('Submission failed')

      setStatus("success")
      setShowPromo(true)
      // Don't auto-close - let user see the promo code
    } catch (error) {
      setStatus("error")
      setTimeout(() => setStatus("idle"), 3000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    onClose()
    setEmail("")
    setName("")
    setStatus("idle")
    setShowPromo(false)
  }

  const handleCopyPromo = () => {
    navigator.clipboard.writeText("BUNDLE50")
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-black border border-[#ffda0f]/30 rounded-lg p-8 max-w-md w-full mx-4 relative">
        {/* Close Button */}
        <button 
          onClick={handleClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close popup"
        >
          <X size={20} />
        </button>

        {/* Success State with Promo Code */}
        {status === "success" && showPromo ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-[#00ff88]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="h-8 w-8 text-[#00ff88]" />
            </div>
            <h3 className="text-xl font-black text-[#00ff88] mb-2">WELCOME TO THE RESISTANCE!</h3>
            <p className="text-gray-300 text-sm mb-6">Here's your exclusive welcome gift:</p>
            
            {/* Promo Code Box */}
            <div className="bg-gradient-to-r from-[#ffda0f]/20 to-[#00ff88]/20 border-2 border-dashed border-[#ffda0f] rounded-lg p-4 mb-4">
              <div className="text-xs text-gray-400 mb-1 font-mono">YOUR PROMO CODE</div>
              <button
                onClick={handleCopyPromo}
                className="text-3xl font-black text-[#ffda0f] tracking-wider hover:scale-105 transition-transform cursor-pointer"
                title="Click to copy"
              >
                BUNDLE50
              </button>
              <div className="text-xs text-gray-500 mt-1">Click to copy</div>
            </div>

            <div className="text-left bg-gray-900/50 rounded-lg p-4 mb-4">
              <div className="text-sm font-bold text-[#ffda0f] mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                HOW IT WORKS:
              </div>
              <ul className="text-xs text-gray-300 space-y-1">
                <li>• Bundle any 3 beats at checkout</li>
                <li>• Get 1 lease at 50% OFF</li>
                <li>• Use code: <span className="text-[#ffda0f] font-bold">BUNDLE50</span></li>
              </ul>
            </div>

            <p className="text-gray-400 text-xs mb-4">
              You'll also be first to know about new beats, loops, and vocal templates!
            </p>

            <Button
              onClick={handleClose}
              className="w-full bg-[#ffda0f] text-black hover:bg-[#ffda0f]/80 font-bold"
            >
              START SHOPPING
            </Button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[#ffda0f]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-[#ffda0f]" />
              </div>
              <h2 className="text-2xl font-black text-[#ffda0f] mb-2">JOIN THE RESISTANCE</h2>
              <p className="text-gray-300 text-sm mb-4">
                GET EXCLUSIVE DEALS & FIRST ACCESS
              </p>
              
              {/* Benefits List */}
              <div className="text-left bg-gray-900/50 rounded-lg p-4">
                <ul className="text-sm text-gray-300 space-y-2">
                  <li className="flex items-center gap-2">
                    <Music className="h-4 w-4 text-[#ffda0f] flex-shrink-0" />
                    <span>Exclusive sales on beats</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#00ff88] flex-shrink-0" />
                    <span>First to know when new beats, loops & vocal templates drop</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Gift className="h-4 w-4 text-[#ff6b6b] flex-shrink-0" />
                    <span>Get a special promo code when you sign up!</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Your name (optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-gray-900 border-gray-700 text-white placeholder-gray-400 focus:border-[#ffda0f]"
                />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-900 border-gray-700 text-white placeholder-gray-400 focus:border-[#ffda0f]"
                />
              </div>

              {status === "error" && (
                <div className="flex items-center text-red-400 text-sm">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Something went wrong. Please try again.
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting || !email}
                className="w-full bg-[#ffda0f] text-black hover:bg-[#ffda0f]/80 font-bold"
              >
                {isSubmitting ? "JOINING..." : "GET MY PROMO CODE"}
              </Button>
            </form>

            {/* Footer */}
            <div className="text-center mt-6">
              <p className="text-xs text-gray-500">No spam, just fire beats and exclusive deals 🔥</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
