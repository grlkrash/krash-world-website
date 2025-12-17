"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Download, Loader2, CheckCircle, XCircle, ArrowLeft } from "lucide-react"
import NavigationMenu from "@/app/components/navigation-menu"

export default function DownloadPage() {
  const params = useParams()
  const router = useRouter()
  const token = params.token as string
  const [status, setStatus] = useState<"loading" | "success" | "error" | "downloading">("loading")
  const [errorMessage, setErrorMessage] = useState("")
  const [beatTitle, setBeatTitle] = useState("")
  const [beatId, setBeatId] = useState("")

  useEffect(() => {
    // Verify token and get beat info
    async function verifyToken() {
      try {
        const response = await fetch(`/api/beatstore/verify?token=${token}`)
        const data = await response.json()

        if (!response.ok) {
          setStatus("error")
          setErrorMessage(data.error || "Invalid download link")
          return
        }

        setBeatTitle(data.beatTitle || "Your Beat")
        setBeatId(data.beatId)
        setStatus("success")
      } catch (error) {
        console.error("Verification error:", error)
        setStatus("error")
        setErrorMessage("Failed to verify download link")
      }
    }

    if (token) {
      verifyToken()
    }
  }, [token])

  async function handleDownload() {
    if (!beatId) return

    setStatus("downloading")

    try {
      const response = await fetch(`/api/beatstore/download?token=${token}&beatId=${beatId}`)

      if (!response.ok) {
        const data = await response.json()
        setStatus("error")
        setErrorMessage(data.error || "Download failed")
        return
      }

      // Get the blob and create download link
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${beatTitle.replace(/[^a-z0-9]/gi, "_")}.zip`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      setStatus("success")
    } catch (error) {
      console.error("Download error:", error)
      setStatus("error")
      setErrorMessage("Failed to download file")
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
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="container mx-auto px-6 max-w-2xl">
          <Link
            href="/beatstore"
            className="inline-flex items-center gap-2 text-[#ffda0f] hover:text-[#ffda0f]/80 transition-colors mb-8 font-mono text-sm"
          >
            <ArrowLeft size={16} />
            BACK TO BEATSTORE
          </Link>

          <div className="bg-black/60 backdrop-blur-md border border-[#ffda0f]/30 rounded-lg p-8 md:p-12 text-center">
            {status === "loading" && (
              <div className="space-y-6">
                <Loader2 className="h-16 w-16 animate-spin text-[#ffda0f] mx-auto" />
                <div className="text-gray-300">Verifying download link...</div>
              </div>
            )}

            {status === "error" && (
              <div className="space-y-6">
                <XCircle className="h-16 w-16 text-red-500 mx-auto" />
                <div className="text-2xl font-bold text-white mb-2">Download Link Invalid</div>
                <div className="text-gray-300 mb-6">{errorMessage}</div>
                <div className="text-sm text-gray-400">
                  If you believe this is an error, please contact support with your transaction ID.
                </div>
                <Link
                  href="/beatstore"
                  className="inline-block bg-[#ffda0f] text-black px-6 py-3 rounded font-bold hover:bg-[#ffda0f]/80 transition-colors"
                >
                  Back to Beatstore
                </Link>
              </div>
            )}

            {status === "success" && (
              <div className="space-y-6">
                <CheckCircle className="h-16 w-16 text-[#00ff88] mx-auto" />
                <div className="text-2xl font-bold text-white mb-2">Download Ready</div>
                <div className="text-gray-300 mb-2">Your beat: <span className="text-[#ffda0f] font-bold">{beatTitle}</span></div>
                <div className="text-sm text-gray-400 mb-8">
                  Click the button below to download your WAV files and stems.
                </div>
                <button
                  onClick={handleDownload}
                  className="w-full bg-[#ffda0f] text-black px-8 py-4 rounded-lg font-black text-lg hover:bg-[#ffda0f]/80 transition-colors flex items-center justify-center gap-3"
                >
                  <Download size={24} />
                  DOWNLOAD BEAT
                </button>
                <div className="text-xs text-gray-500 mt-4">
                  This link expires in 48 hours. Download your files now.
                </div>
              </div>
            )}

            {status === "downloading" && (
              <div className="space-y-6">
                <Loader2 className="h-16 w-16 animate-spin text-[#ffda0f] mx-auto" />
                <div className="text-gray-300">Preparing your download...</div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
