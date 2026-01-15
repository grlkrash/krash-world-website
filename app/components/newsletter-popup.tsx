"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, AlertCircle, Gift, Sparkles } from "lucide-react"

interface NewsletterPopupProps {
  isOpen: boolean
  onClose: () => void
}

export default function NewsletterPopup({ isOpen, onClose }: NewsletterPopupProps) {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name: 'Subscriber' }),
      })
      if (!response.ok) throw new Error('Failed')
      setStatus("success")
      localStorage.setItem("krash-bundle-code", "BUNDLE50")
    } catch {
      setStatus("error")
      setTimeout(() => setStatus("idle"), 3000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    onClose()
    setEmail("")
    setStatus("idle")
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

        {/* Success State */}
        {status === "success" ? (
          <div className="text-center py-4">
            <Gift className="h-12 w-12 text-[#00ff88] mx-auto mb-4" />
            <h3 className="text-2xl font-black text-[#00ff88] mb-2">BUNDLE DISCOUNT UNLOCKED</h3>
            <p className="text-gray-300 text-sm mb-4">
              Your bundle discount auto-applies when you add 3 beats.
            </p>
            <div className="border border-[#ffda0f]/30 rounded-lg p-4 mb-4">
              <div className="text-xs text-gray-400 mb-1">USE LATER, ANY DEVICE</div>
              <div className="text-lg font-black text-[#ffda0f]">BUNDLE50</div>
              <div className="text-xs text-gray-400 mt-2">
                We emailed this code so you can unlock it on another device.
              </div>
            </div>
            <Button onClick={handleClose} className="w-full bg-[#ffda0f] text-black hover:bg-[#ffda0f]/80 font-bold">
              SHOP NOW
            </Button>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <Sparkles className="h-10 w-10 text-[#ffda0f] mx-auto mb-3" />
              <h2 className="text-2xl font-black text-[#ffda0f] mb-1">GET 50% OFF</h2>
              <p className="text-gray-300 text-sm">Sign up & get a discount on your first bundle</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-900 border-gray-700 text-white placeholder-gray-400 focus:border-[#ffda0f]"
              />
              {status === "error" && (
                <div className="flex items-center text-red-400 text-sm">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Try again
                </div>
              )}
              <Button type="submit" disabled={isSubmitting || !email} className="w-full bg-[#ffda0f] text-black hover:bg-[#ffda0f]/80 font-bold">
                {isSubmitting ? "..." : "CLAIM MY DISCOUNT"}
              </Button>
            </form>
            <p className="text-xs text-gray-500 text-center mt-4">No spam. Unsubscribe anytime.</p>
          </>
        )}
      </div>
    </div>
  )
}
