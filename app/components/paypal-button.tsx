"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

interface Beat {
  id: string
  title: string
  price: number
  downloadUrl?: string
  includesWav?: boolean
  fileFormat?: string
}

interface PayPalButtonProps {
  beat: Beat
}

declare global {
  interface Window {
    paypal?: {
      Buttons: (config: {
        createOrder: (data: any, actions: any) => Promise<string>
        onApprove: (data: any, actions: any) => Promise<void>
        onError: (err: any) => void
        style?: {
          layout?: string
          color?: string
          shape?: string
          label?: string
        }
      }) => {
        render: (selector: string) => void
      }
    }
  }
}

export default function PayPalButton({ beat }: PayPalButtonProps) {
  const paypalButtonRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [optInNewsletter, setOptInNewsletter] = useState(false)
  
  // Templates don't need lease terms acceptance
  const isTemplate = beat.genre?.includes("Template") || beat.id?.startsWith("template")
  const needsTerms = !isTemplate

  useEffect(() => {
    // Load PayPal SDK
    const script = document.createElement("script")
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || ""}&currency=USD`
    script.async = true
    script.onload = () => setIsScriptLoaded(true)
    script.onerror = () => {
      console.error("Failed to load PayPal SDK")
      setIsLoading(false)
    }
    document.body.appendChild(script)

    return () => {
      // Cleanup
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  useEffect(() => {
    if (!isScriptLoaded || !window.paypal || !paypalButtonRef.current) return
    if (needsTerms && !termsAccepted) return

    setIsLoading(true)

    try {
      window.paypal
        .Buttons({
          createOrder: function (data, actions) {
            const format = beat.fileFormat || "MP3"
            const isTemplate = beat.genre?.includes("Template") || beat.id?.startsWith("template")
            const description = isTemplate
              ? `${beat.title} - Logic Pro Template`
              : `${beat.title} - Standard Lease (${format}) - 50% Publishing`
            
            return actions.order.create({
              purchase_units: [
                {
                  description,
                  amount: {
                    value: beat.price.toFixed(2),
                  },
                },
              ],
            })
          },
          onApprove: async function (data, actions) {
            try {
              const details = await actions.order?.capture()
              if (!details) throw new Error("Payment capture failed")

              // Send email with download link
              const response = await fetch("/api/beatstore/send-download", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  email: details.payer?.email_address,
                  beatId: beat.id,
                  beatTitle: beat.title,
                  transactionId: data.orderID,
                  optInNewsletter: optInNewsletter,
                }),
              })

              if (!response.ok) throw new Error("Failed to send download email")

              // Show success message
              alert("Payment complete! Check your email for the download link.")
            } catch (error) {
              console.error("Payment error:", error)
              alert("Payment processed, but there was an issue sending your download link. Please contact support.")
            } finally {
              setIsLoading(false)
            }
          },
          onError: function (err) {
            console.error("PayPal error:", err)
            alert("There was an error processing your payment. Please try again.")
            setIsLoading(false)
          },
          style: {
            layout: "vertical",
            color: "gold",
            shape: "rect",
            label: "paypal",
          },
        })
        .render(paypalButtonRef.current)

      setIsLoading(false)
    } catch (error) {
      console.error("Error rendering PayPal button:", error)
      setIsLoading(false)
    }
  }, [isScriptLoaded, beat, termsAccepted, needsTerms])

  if (!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID) {
    return (
      <Button disabled className="w-full bg-gray-600">
        PayPal not configured
      </Button>
    )
  }

  if (isLoading) {
    return (
      <Button disabled className="w-full bg-[#ffda0f] text-black">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </Button>
    )
  }

  return (
    <div className="w-full space-y-3">
      <div className="space-y-3">
        {/* Terms checkbox - only for beats/loops */}
        {needsTerms && (
          <div className="flex items-start space-x-2">
            <Checkbox
              id={`terms-${beat.id}`}
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(checked === true)}
              className="mt-1 border-[#ffda0f]/50 data-[state=checked]:bg-[#ffda0f] data-[state=checked]:border-[#ffda0f]"
            />
            <Label
              htmlFor={`terms-${beat.id}`}
              className="text-xs text-gray-300 leading-tight cursor-pointer"
            >
              I agree to the <Link href="/lease-terms" className="text-[#ffda0f] underline hover:no-underline">Lease Terms</Link> and understand 
              this purchase includes 50% publishing rights, 2,500 units, 50K streams, and 1 music video.
            </Label>
          </div>
        )}
        {/* Newsletter opt-in - for all products */}
        <div className="flex items-start space-x-2">
          <Checkbox
            id={`newsletter-${beat.id}`}
            checked={optInNewsletter}
            onCheckedChange={(checked) => setOptInNewsletter(checked === true)}
            className="mt-1 border-[#00ff88]/50 data-[state=checked]:bg-[#00ff88] data-[state=checked]:border-[#00ff88]"
          />
          <Label
            htmlFor={`newsletter-${beat.id}`}
            className="text-xs text-gray-300 leading-tight cursor-pointer"
          >
            <span className="text-[#00ff88]">✓</span> Join newsletter for new beats, sales, and updates (optional)
          </Label>
        </div>
      </div>
      <div 
        ref={paypalButtonRef} 
        className={`w-full ${needsTerms && !termsAccepted ? "opacity-50 pointer-events-none" : ""}`}
      />
      {needsTerms && !termsAccepted && (
        <p className="text-xs text-gray-500 text-center">
          Please accept the terms to proceed with purchase
        </p>
      )}
    </div>
  )
}
