"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Mail, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import NavigationMenu from "@/app/components/navigation-menu"
import { Menu, X } from "lucide-react"

export default function ContactPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus("idle")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok || !data.success) throw new Error("Submission failed")

      setStatus("success")
      setFormData({ name: "", email: "", subject: "", message: "" })
      setTimeout(() => setStatus("idle"), 5000)
    } catch (error) {
      console.error("Contact form error:", error)
      setStatus("error")
      setTimeout(() => setStatus("idle"), 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

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
          <Link href="/" className="flex items-center space-x-4">
            <Image src="/images/krash-logo.png" alt="KRASH" width={40} height={40} className="brightness-110" />
            <div className="hidden md:block">
              <div className="text-[#ffda0f] font-black text-lg">KRASH WORLD</div>
              <div className="text-gray-400 text-xs">LA BASED</div>
            </div>
          </Link>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-[#ffda0f] hover:text-[#ffda0f]/80 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <NavigationMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          onNewsletterOpen={() => {}}
        />
      </header>

      {/* Main Content */}
      <main className="relative z-10 min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#ffda0f] hover:text-[#ffda0f]/80 transition-colors mb-8 font-mono text-sm"
          >
            <ArrowLeft size={16} />
            BACK TO KRASH WORLD
          </Link>

          <div className="text-center mb-12">
            <div className="text-[#ffda0f] text-sm font-mono mb-2">GET IN TOUCH</div>
            <h1 className="text-4xl md:text-6xl font-black mb-4">
              <span className="text-white">CONTACT</span>
              <br />
              <span className="text-[#ffda0f]">GRLKRASH</span>
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Have questions about beats, exclusive rights, collaborations, or just want to connect? 
              Send us a message.
            </p>
          </div>

          <div className="bg-black/60 backdrop-blur-md border border-[#ffda0f]/30 rounded-lg p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">
                    Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-black/50 border-[#ffda0f]/30 text-white focus:border-[#ffda0f]"
                    placeholder="Your name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-black/50 border-[#ffda0f]/30 text-white focus:border-[#ffda0f]"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="text-gray-300">
                  Subject
                </Label>
                <Input
                  id="subject"
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="bg-black/50 border-[#ffda0f]/30 text-white focus:border-[#ffda0f]"
                  placeholder="Exclusive Rights, Collaboration, General Inquiry..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-gray-300">
                  Message
                </Label>
                <Textarea
                  id="message"
                  required
                  rows={8}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="bg-black/50 border-[#ffda0f]/30 text-white focus:border-[#ffda0f] resize-none"
                  placeholder="Tell us what you're interested in..."
                />
              </div>

              {status === "success" && (
                <div className="p-4 bg-[#00ff88]/20 border border-[#00ff88]/50 rounded-lg text-[#00ff88] text-sm">
                  ✓ Message sent! We'll get back to you soon.
                </div>
              )}

              {status === "error" && (
                <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                  ✗ Failed to send message. Please try again or email us directly at{" "}
                  <a href="mailto:info@krash.world" className="underline">
                    info@krash.world
                  </a>
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#ffda0f] text-black hover:bg-[#ffda0f]/80 font-black text-lg py-6"
              >
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    SEND MESSAGE
                  </>
                )}
              </Button>
            </form>

            <div className="mt-8 pt-8 border-t border-[#ffda0f]/20">
              <div className="text-center space-y-4">
                <div className="text-gray-400 text-sm">
                  Or reach us directly at:
                </div>
                <a
                  href="mailto:info@krash.world"
                  className="inline-flex items-center gap-2 text-[#ffda0f] hover:text-[#ffda0f]/80 transition-colors text-lg font-semibold"
                >
                  <Mail className="h-5 w-5" />
                  info@krash.world
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-12 grid md:grid-cols-2 gap-6">
            <Link
              href="/beatstore"
              className="bg-black/60 backdrop-blur-md border border-[#ffda0f]/30 rounded-lg p-6 hover:border-[#ffda0f]/50 transition-all"
            >
              <div className="text-[#ffda0f] font-bold mb-2">BEATSTORE</div>
              <div className="text-gray-300 text-sm">Browse beats and loops</div>
            </Link>
            <Link
              href="/lease-terms"
              className="bg-black/60 backdrop-blur-md border border-[#ffda0f]/30 rounded-lg p-6 hover:border-[#ffda0f]/50 transition-all"
            >
              <div className="text-[#ffda0f] font-bold mb-2">LEASE TERMS</div>
              <div className="text-gray-300 text-sm">View licensing information</div>
            </Link>
          </div>
        </div>
      </main>

      {/* Bottom Info */}
      <div className="fixed bottom-4 left-6 text-xs text-gray-500 font-mono">
        <div>KRASH_WORLD_V1.0</div>
        <div>GRLKRASH © 2024</div>
      </div>
    </div>
  )
}
