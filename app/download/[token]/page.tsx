"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Download, Loader2, CheckCircle, XCircle, ArrowLeft, FileText } from "lucide-react"
import NavigationMenu from "@/app/components/navigation-menu"

export default function DownloadPage() {
  const params = useParams()
  const router = useRouter()
  // Token is now downloadToken format: transactionId-beatId
  const downloadToken = params.token as string | undefined
  const [status, setStatus] = useState<"loading" | "success" | "error" | "downloading">("loading")
  const [errorMessage, setErrorMessage] = useState("")
  const [beatTitle, setBeatTitle] = useState("")
  const [beatId, setBeatId] = useState("")

  useEffect(() => {
    // Log token extraction
    console.log("📄 Download page mounted")
    console.log("📄 URL params:", params)
    console.log("📄 Extracted downloadToken:", downloadToken)
    console.log("📄 Token type:", typeof downloadToken)
    console.log("📄 Token length:", downloadToken?.length)

    // Verify token and get beat info
    async function verifyToken() {
      if (!downloadToken) {
        console.error("❌ No download token provided")
        setStatus("error")
        setErrorMessage("Missing download token")
        return
      }

      console.log("🔍 Verifying downloadToken:", downloadToken)
      console.log("🔍 Token length:", downloadToken.length)
      console.log("🔍 Token type:", typeof downloadToken)
      
      try {
        const verifyUrl = `/api/beatstore/verify?token=${encodeURIComponent(downloadToken)}`
        console.log("🔍 Verify URL:", verifyUrl)
        
        const response = await fetch(verifyUrl)
        console.log("🔍 Verify response status:", response.status)
        console.log("🔍 Verify response ok:", response.ok)
        
        const data = await response.json()
        console.log("🔍 Verify response data:", data)

        if (!response.ok) {
          console.error("❌ Verification failed:", data)
          setStatus("error")
          setErrorMessage(data.error || "Invalid download link")
          return
        }

        console.log("✅ Verification successful:", {
          beatId: data.beatId,
          beatTitle: data.beatTitle,
          email: data.email,
          downloadToken: data.downloadToken,
        })

        if (!data.beatId) {
          console.error("❌ No beatId in verification response")
          setStatus("error")
          setErrorMessage("Invalid verification response: missing beatId")
          return
        }

        setBeatTitle(data.beatTitle || "Your Beat")
        setBeatId(data.beatId)
        setStatus("success")
      } catch (error) {
        console.error("❌ Verification error:", error)
        console.error("❌ Error details:", {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        })
        setStatus("error")
        setErrorMessage(`Failed to verify download link: ${error instanceof Error ? error.message : "Unknown error"}`)
      }
    }

    if (downloadToken) {
      verifyToken()
    } else {
      console.error("❌ No downloadToken in URL params")
      setStatus("error")
      setErrorMessage("Missing download token in URL")
    }
  }, [downloadToken, params])

  async function handleDownload() {
    if (!beatId) {
      console.error("❌ Cannot download: beatId is missing")
      setStatus("error")
      setErrorMessage("Beat ID is missing. Please refresh the page and try again.")
      return
    }

    if (!downloadToken) {
      console.error("❌ Cannot download: downloadToken is missing")
      setStatus("error")
      setErrorMessage("Download token is missing. Please use the link from your email.")
      return
    }

    console.log("📥 Starting download:", { downloadToken, beatId, beatTitle })
    setStatus("downloading")

    try {
      const downloadUrl = `/api/beatstore/download?token=${encodeURIComponent(downloadToken)}&beatId=${encodeURIComponent(beatId)}`
      console.log("📥 Download URL:", downloadUrl)
      
      const response = await fetch(downloadUrl)
      console.log("📥 Download response status:", response.status)
      console.log("📥 Download response ok:", response.ok)
      console.log("📥 Download response headers:", Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        let errorData
        try {
          errorData = await response.json()
          console.error("❌ Download failed:", errorData)
        } catch (e) {
          const text = await response.text()
          console.error("❌ Download failed (non-JSON response):", text)
          errorData = { error: `Download failed: ${response.status} ${response.statusText}` }
        }
        
        setStatus("error")
        setErrorMessage(errorData.error || errorData.message || `Download failed: ${response.status}`)
        if (errorData.details) {
          console.error("❌ Additional error details:", errorData.details)
        }
        return
      }

      console.log("✅ Download response OK, creating blob...")
      
      // Get the blob and create download link
      const blob = await response.blob()
      console.log("✅ Blob created, size:", blob.size, "bytes")
      
      // Extract filename from Content-Disposition header (includes correct extension)
      const disposition = response.headers.get("content-disposition")
      const filenameMatch = disposition?.match(/filename="([^"]+)"/)
      const filename = filenameMatch?.[1] || `${beatTitle.replace(/[^a-z0-9]/gi, "_")}.wav`

      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      // Delay cleanup for iOS Safari which processes downloads asynchronously
      setTimeout(() => {
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }, 1000)

      console.log("✅ Download completed successfully")
      setStatus("success")
    } catch (error) {
      console.error("❌ Download error:", error)
      console.error("❌ Error details:", {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      })
      setStatus("error")
      setErrorMessage(`Failed to download file: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  function handleDownloadLicensePdf() {
    if (!downloadToken) {
      setStatus("error")
      setErrorMessage("Download token missing. Please use your original purchase email link.")
      return
    }

    const licensePdfUrl = `/api/beatstore/license-pdf?token=${encodeURIComponent(downloadToken)}`
    window.open(licensePdfUrl, "_blank", "noopener,noreferrer")
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
                <div className="text-gray-300 mb-2">{errorMessage}</div>
                {downloadToken && (
                  <div className="text-xs text-gray-500 mb-4 font-mono break-all">
                    Download Token: {downloadToken}
                  </div>
                )}
                <div className="text-sm text-gray-400 mb-6">
                  If you believe this is an error, please contact support with your transaction ID above.
                </div>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-gray-700 text-white px-6 py-3 rounded font-bold hover:bg-gray-600 transition-colors"
                  >
                    Retry
                  </button>
                  <Link
                    href="/beatstore"
                    className="inline-block bg-[#ffda0f] text-black px-6 py-3 rounded font-bold hover:bg-[#ffda0f]/80 transition-colors"
                  >
                    Back to Beatstore
                  </Link>
                </div>
              </div>
            )}

            {status === "success" && (
              <div className="space-y-6">
                <CheckCircle className="h-16 w-16 text-[#00ff88] mx-auto" />
                <div className="text-2xl font-bold text-white mb-2">Download Ready</div>
                <div className="text-gray-300 mb-2">Your beat: <span className="text-[#ffda0f] font-bold">{beatTitle}</span></div>
                <div className="text-sm text-gray-400 mb-8">
                  Click the button below to download your beat.
                </div>
                <button
                  onClick={handleDownload}
                  className="w-full bg-[#ffda0f] text-black px-8 py-4 rounded-lg font-black text-lg hover:bg-[#ffda0f]/80 transition-colors flex items-center justify-center gap-3"
                >
                  <Download size={24} />
                  DOWNLOAD BEAT
                </button>
                <button
                  onClick={handleDownloadLicensePdf}
                  className="w-full bg-black border border-[#ffda0f]/40 text-[#ffda0f] px-8 py-3 rounded-lg font-bold text-sm hover:bg-[#ffda0f]/10 transition-colors flex items-center justify-center gap-2"
                >
                  <FileText size={16} />
                  DOWNLOAD LICENSE PDF
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
