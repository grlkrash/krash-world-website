"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ShoppingCart, Trash2, Sparkles, Tag, CheckCircle, Loader2, Music, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { CartProvider, useCart } from "../components/cart-context"
import NavigationMenu from "../components/navigation-menu"
import { Menu, X } from "lucide-react"

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

function CartPageContent() {
  const { items, removeItem, subtotal, discount, total, discountApplied, cheapestItem, clearCart, isBundleCodeApplied, applyBundleCode } = useCart()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState("")
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [optInNewsletter, setOptInNewsletter] = useState(false)
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [purchaseComplete, setPurchaseComplete] = useState(false)
  const [bundleCodeInput, setBundleCodeInput] = useState("")
  const [bundleCodeMessage, setBundleCodeMessage] = useState("")
  const [bundleCodeStatus, setBundleCodeStatus] = useState<"idle" | "success" | "error">("idle")
  const paypalButtonRef = useRef<HTMLDivElement>(null)

  // Check if any items need lease terms (non-templates)
  const hasNonTemplates = items.some(item => !item.id?.startsWith("template"))

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

  // Load PayPal SDK
  useEffect(() => {
    if (typeof window !== "undefined" && !window.paypal) {
      const script = document.createElement("script")
      script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || ""}&currency=USD`
      script.async = true
      script.onload = () => setIsScriptLoaded(true)
      document.body.appendChild(script)
    } else if (window.paypal) {
      setIsScriptLoaded(true)
    }
  }, [])

  // Render PayPal button when ready
  useEffect(() => {
    if (!isScriptLoaded || !window.paypal || !paypalButtonRef.current || items.length === 0) return
    if (hasNonTemplates && !termsAccepted) return

    // Clear previous button
    paypalButtonRef.current.innerHTML = ""

    try {
      window.paypal
        .Buttons({
          createOrder: function (data, actions) {
            // Create order with all cart items
            const itemDescriptions = items.map(item => item.title).join(", ")
            const description = `GRLKRASH Beats: ${itemDescriptions}${discountApplied ? " (BUNDLE50 discount applied)" : ""}`
            
            return actions.order.create({
              purchase_units: [
                {
                  description: description.substring(0, 127), // PayPal limit
                  custom_id: items.map(item => item.id).join(","),
                  amount: {
                    value: total.toFixed(2),
                  },
                },
              ],
            })
          },
          onApprove: async function (data, actions) {
            setIsProcessing(true)
            try {
              const details = await actions.order?.capture()
              if (!details) throw new Error("Payment capture failed")

              const payerEmail = details.payer?.email_address

              // Send download emails for each item
              const downloadPromises = items.map(item => {
                // Calculate actual price paid for this item (accounting for bundle discount)
                const isDiscountedItem = discountApplied && cheapestItem?.id === item.id
                const actualPrice = isDiscountedItem ? item.price * 0.5 : item.price
                
                return fetch("/api/beatstore/send-download", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    email: payerEmail,
                    beatId: item.id,
                    beatTitle: item.title,
                    transactionId: data.orderID,
                    optInNewsletter: optInNewsletter,
                    isBundle: items.length > 1,
                    bundleDiscount: isDiscountedItem ? item.price * 0.5 : 0,
                    beatPrice: actualPrice,
                  }),
                })
              })

              await Promise.all(downloadPromises)

              // Clear cart and show success
              clearCart()
              setPurchaseComplete(true)
            } catch (error) {
              console.error("Payment error:", error)
              alert("Payment processed, but there was an issue. Please contact support.")
            } finally {
              setIsProcessing(false)
            }
          },
          onError: function (err) {
            console.error("PayPal error:", err)
            alert("There was an error processing your payment. Please try again.")
            setIsProcessing(false)
          },
          style: {
            layout: "vertical",
            color: "gold",
            shape: "rect",
            label: "paypal",
          },
        })
        .render(paypalButtonRef.current)
    } catch (error) {
      console.error("Error rendering PayPal button:", error)
    }
  }, [isScriptLoaded, items, termsAccepted, hasNonTemplates, total, discountApplied, discount, optInNewsletter, clearCart])

  const handleApplyBundleCode = () => {
    const result = applyBundleCode({ code: bundleCodeInput })
    setBundleCodeStatus(result.isApplied ? "success" : "error")
    setBundleCodeMessage(result.message)
    if (result.isApplied) setBundleCodeInput("")
  }

  // Success state
  if (purchaseComplete) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-20 h-20 bg-[#00ff88]/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-[#00ff88]" />
          </div>
          <h1 className="text-3xl font-black text-[#00ff88] mb-4">PURCHASE COMPLETE!</h1>
          <p className="text-gray-300 mb-6">
            Check your email for download links to your beats. Thanks for supporting GRLKRASH!
          </p>
          <Link href="/beatstore">
            <Button className="bg-[#ffda0f] text-black hover:bg-[#ffda0f]/80 font-bold">
              BACK TO BEATSTORE
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
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
          <Link href="/" className="flex items-center space-x-4">
            <Image src="/images/krash-logo.png" alt="KRASH" width={40} height={40} className="brightness-110" />
            <div className="hidden md:block">
              <div className="text-[#ffda0f] font-black text-lg">KRASH WORLD</div>
              <div className="text-gray-400 text-xs">LA BASED</div>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8 text-xs text-gray-400 font-mono">
            <div>STATUS: <span className="text-[#00ff88]">ACTIVE</span></div>
            <div>TIME: <span className="text-white">{currentTime}</span></div>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-[#ffda0f] hover:text-[#ffda0f]/80 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      <NavigationMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} onNewsletterOpen={() => {}} />

      {/* Main Content */}
      <main className="relative z-10 min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <Link
            href="/beatstore"
            className="inline-flex items-center gap-2 text-[#ffda0f] hover:text-[#ffda0f]/80 transition-colors mb-8 font-mono text-sm"
          >
            <ArrowLeft size={16} />
            CONTINUE SHOPPING
          </Link>

          <div className="flex items-center gap-4 mb-8">
            <ShoppingCart className="h-8 w-8 text-[#ffda0f]" />
            <h1 className="text-3xl md:text-4xl font-black text-white">CHECKOUT</h1>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingCart className="h-20 w-20 text-gray-600 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-400 mb-4">Your cart is empty</h2>
              <p className="text-gray-500 mb-8">Add some beats to get started!</p>
              <Link href="/beatstore">
                <Button className="bg-[#ffda0f] text-black hover:bg-[#ffda0f]/80 font-bold">
                  BROWSE BEATS
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`flex gap-4 p-4 rounded-xl border transition-all ${
                      discountApplied && cheapestItem?.id === item.id
                        ? "bg-[#00ff88]/10 border-[#00ff88]/30"
                        : "bg-gray-900/50 border-gray-800"
                    }`}
                  >
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.coverImage}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-white font-bold text-lg">{item.title}</h3>
                          {item.fileFormat && (
                            <p className="text-gray-500 text-sm">{item.fileFormat}</p>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-500 hover:text-red-400 transition-colors p-2"
                          aria-label={`Remove ${item.title}`}
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        {discountApplied && cheapestItem?.id === item.id ? (
                          <>
                            <span className="text-gray-500 line-through text-lg">${item.price}</span>
                            <span className="text-[#00ff88] font-black text-xl">${(item.price * 0.5).toFixed(0)}</span>
                            <span className="text-[#00ff88] text-xs bg-[#00ff88]/20 px-2 py-1 rounded-full font-bold">
                              BUNDLE50 • 50% OFF
                            </span>
                          </>
                        ) : (
                          <span className="text-[#ffda0f] font-black text-xl">${item.price}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Bundle Deal Hint */}
                {items.length < 3 && (
                  <div className="p-4 rounded-xl border border-dashed border-[#ffda0f]/50 bg-[#ffda0f]/5">
                    <div className="flex items-start gap-3">
                      <Tag className="h-5 w-5 text-[#ffda0f] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[#ffda0f] font-bold">BUNDLE DEAL!</p>
                        <p className="text-gray-400 text-sm mt-1">
                          Add {3 - items.length} more beat{3 - items.length > 1 ? "s" : ""} to get 50% off!
                        </p>
                        <Link href="/beatstore" className="text-[#ffda0f] text-sm hover:underline mt-2 inline-block">
                          → Browse more beats
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-gray-900/50 border border-[#ffda0f]/20 rounded-xl p-6 sticky top-24">
                  <h2 className="text-xl font-black text-white mb-6">ORDER SUMMARY</h2>

                  {/* Discount Applied */}
                  {discountApplied && (
                    <div className="mb-4 p-3 rounded-lg border border-[#00ff88]/30 bg-[#00ff88]/10">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-[#00ff88]" />
                        <span className="text-[#00ff88] font-bold text-sm">BUNDLE50 APPLIED!</span>
                      </div>
                    </div>
                  )}

                  {/* Bundle Code */}
                  <div className="mb-6">
                    <div className="text-xs text-gray-500 mb-2">HAVE A CODE?</div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="text"
                        placeholder="Enter code"
                        value={bundleCodeInput}
                        onChange={(e) => setBundleCodeInput(e.target.value)}
                        className="bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-[#ffda0f]"
                        aria-label="Bundle code"
                      />
                      <Button
                        type="button"
                        onClick={handleApplyBundleCode}
                        className="bg-[#ffda0f] text-black hover:bg-[#ffda0f]/80 font-bold"
                      >
                        Apply
                      </Button>
                    </div>
                    {bundleCodeStatus !== "idle" && (
                      <div className={`mt-2 text-xs ${bundleCodeStatus === "success" ? "text-[#00ff88]" : "text-red-400"} flex items-center gap-2`}>
                        {bundleCodeStatus === "success" ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                        <span>{bundleCodeMessage}</span>
                      </div>
                    )}
                    {isBundleCodeApplied && items.length < 3 && (
                      <p className="text-xs text-gray-400 mt-2">
                        Bundle unlocked. Add {3 - items.length} more beat{3 - items.length > 1 ? "s" : ""} to apply 50% off the cheapest.
                      </p>
                    )}
                  </div>

                  {/* Pricing */}
                  <div className="space-y-3 text-sm mb-6">
                    <div className="flex justify-between text-gray-400">
                      <span>Subtotal ({items.length} items)</span>
                      <span>${subtotal.toFixed(0)}</span>
                    </div>
                    {discountApplied && (
                      <div className="flex justify-between text-[#00ff88]">
                        <span>Bundle Discount</span>
                        <span>-${discount.toFixed(0)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-white text-xl font-black pt-3 border-t border-gray-800">
                      <span>Total</span>
                      <span className="text-[#ffda0f]">${total.toFixed(0)}</span>
                    </div>
                  </div>

                  {/* Terms & Newsletter */}
                  <div className="space-y-4 mb-6">
                    {hasNonTemplates && (
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="terms"
                          checked={termsAccepted}
                          onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                          className="mt-1 border-[#ffda0f]/50 data-[state=checked]:bg-[#ffda0f] data-[state=checked]:border-[#ffda0f]"
                        />
                        <Label htmlFor="terms" className="text-xs text-gray-300 leading-relaxed cursor-pointer">
                          I agree to the <Link href="/lease-terms" className="text-[#ffda0f] underline hover:no-underline">Lease Terms</Link> (50% publishing, 2,500 units, 50K streams)
                        </Label>
                      </div>
                    )}
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="newsletter"
                        checked={optInNewsletter}
                        onCheckedChange={(checked) => setOptInNewsletter(checked === true)}
                        className="mt-1 border-[#00ff88]/50 data-[state=checked]:bg-[#00ff88] data-[state=checked]:border-[#00ff88]"
                      />
                      <Label htmlFor="newsletter" className="text-xs text-gray-300 leading-relaxed cursor-pointer">
                        <span className="text-[#00ff88]">✓</span> Get notified about new beats, sales & exclusive drops
                      </Label>
                    </div>
                  </div>

                  {/* PayPal Button */}
                  {isProcessing ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-[#ffda0f]" />
                      <span className="ml-3 text-gray-400">Processing...</span>
                    </div>
                  ) : (
                    <div 
                      ref={paypalButtonRef}
                      className={`${hasNonTemplates && !termsAccepted ? "opacity-50 pointer-events-none" : ""}`}
                    />
                  )}

                  {hasNonTemplates && !termsAccepted && (
                    <p className="text-xs text-gray-500 text-center mt-3">
                      Accept terms to checkout
                    </p>
                  )}

                  {/* What You Get */}
                  <div className="mt-6 pt-6 border-t border-gray-800">
                    <div className="text-xs text-gray-500 mb-2">INCLUDES:</div>
                    <ul className="text-xs text-gray-400 space-y-1">
                      <li className="flex items-center gap-2">
                        <Music className="h-3 w-3 text-[#ffda0f]" />
                        High quality audio files
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-[#00ff88]" />
                        Instant email delivery
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-[#00ff88]" />
                        50% publishing rights
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <div className="fixed bottom-4 left-6 text-xs text-gray-500 font-mono">
        <div>KRASH_WORLD_V1.0</div>
        <div>GRLKRASH © 2024</div>
      </div>
    </div>
  )
}

export default function CartPage() {
  return (
    <CartProvider>
      <CartPageContent />
    </CartProvider>
  )
}

