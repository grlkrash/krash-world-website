"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Mail, CheckCircle, AlertCircle } from "lucide-react"

interface NewsletterPopupProps {
  isOpen: boolean
  onClose: () => void
}

export default function NewsletterPopup({ isOpen, onClose }: NewsletterPopupProps) {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsSubmitting(true)

    try {
      // Submit to Google Sheets via a form endpoint
      const formData = new FormData()
      formData.append("Email", email)
      formData.append("Name", name || "Anonymous")
      formData.append("Timestamp", new Date().toISOString())
      formData.append("Source", "Krash World Website")

      // You'll need to create a Google Form and use its action URL
      // For now, I'll simulate the submission
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Replace this URL with your actual Google Form action URL
      // const response = await fetch('https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse', {
      //   method: 'POST',
      //   body: formData,
      //   mode: 'no-cors'
      // })

      setStatus("success")
      setTimeout(() => {
        onClose()
        setEmail("")
        setName("")
        setStatus("idle")
      }, 2000)
    } catch (error) {
      setStatus("error")
      setTimeout(() => setStatus("idle"), 3000)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-black border border-[#ffda0f]/30 rounded-lg p-8 max-w-md w-full mx-4 relative">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
          <X size={20} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-[#ffda0f]/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="h-8 w-8 text-[#ffda0f]" />
          </div>
          <h2 className="text-2xl font-black text-[#ffda0f] mb-2">JOIN THE RESISTANCE</h2>
          <p className="text-gray-300 text-sm">
            Get exclusive updates on GRLKRASH's journey and the Krash World universe
          </p>
        </div>

        {/* Form */}
        {status === "success" ? (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-[#00ff88] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#00ff88] mb-2">Welcome to the Resistance!</h3>
            <p className="text-gray-300 text-sm">You'll receive updates about Krash World soon.</p>
          </div>
        ) : (
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
              {isSubmitting ? "JOINING..." : "JOIN RESISTANCE"}
            </Button>
          </form>
        )}

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">No spam, just updates about the Krash World universe</p>
        </div>
      </div>
    </div>
  )
}
