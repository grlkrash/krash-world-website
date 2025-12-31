"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { X, ShoppingCart, Trash2, Sparkles, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "./cart-context"

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, subtotal, discount, total, discountApplied, cheapestItem, clearCart } = useCart()
  const drawerRef = useRef<HTMLDivElement>(null)

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
    }
  }, [isOpen, onClose])

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm">
      <div
        ref={drawerRef}
        className="absolute right-0 top-0 h-full w-full max-w-md bg-black border-l border-[#ffda0f]/30 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#ffda0f]/20">
          <div className="flex items-center gap-3">
            <ShoppingCart className="h-6 w-6 text-[#ffda0f]" />
            <h2 className="text-xl font-black text-white">YOUR CART</h2>
            <span className="bg-[#ffda0f] text-black text-xs font-bold px-2 py-0.5 rounded-full">
              {items.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2"
            aria-label="Close cart"
          >
            <X size={24} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-2">Your cart is empty</p>
              <p className="text-gray-500 text-sm">Add some beats to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`flex gap-4 p-3 rounded-lg border transition-all ${
                    discountApplied && cheapestItem?.id === item.id
                      ? "bg-[#00ff88]/10 border-[#00ff88]/30"
                      : "bg-gray-900/50 border-gray-800"
                  }`}
                >
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.coverImage}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold text-sm truncate">{item.title}</h3>
                    {item.fileFormat && (
                      <p className="text-gray-500 text-xs">{item.fileFormat}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      {discountApplied && cheapestItem?.id === item.id ? (
                        <>
                          <span className="text-gray-500 line-through text-sm">${item.price}</span>
                          <span className="text-[#00ff88] font-bold">${(item.price * 0.5).toFixed(0)}</span>
                          <span className="text-[#00ff88] text-xs bg-[#00ff88]/20 px-1.5 py-0.5 rounded">
                            50% OFF
                          </span>
                        </>
                      ) : (
                        <span className="text-[#ffda0f] font-bold">${item.price}</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-500 hover:text-red-400 transition-colors p-1"
                    aria-label={`Remove ${item.title}`}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Bundle Deal Promo */}
          {items.length > 0 && items.length < 3 && (
            <div className="mt-6 p-4 rounded-lg border border-dashed border-[#ffda0f]/50 bg-[#ffda0f]/5">
              <div className="flex items-start gap-3">
                <Tag className="h-5 w-5 text-[#ffda0f] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[#ffda0f] font-bold text-sm">BUNDLE DEAL!</p>
                  <p className="text-gray-400 text-xs mt-1">
                    Add {3 - items.length} more beat{3 - items.length > 1 ? "s" : ""} to get 50% off the cheapest one!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Discount Applied Banner */}
          {discountApplied && (
            <div className="mt-6 p-4 rounded-lg border border-[#00ff88]/30 bg-[#00ff88]/10">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-[#00ff88]" />
                <div>
                  <p className="text-[#00ff88] font-bold text-sm">BUNDLE50 APPLIED!</p>
                  <p className="text-gray-400 text-xs">
                    You're saving ${discount.toFixed(0)} on "{cheapestItem?.title}"
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer - Totals & Checkout */}
        {items.length > 0 && (
          <div className="border-t border-[#ffda0f]/20 p-6 space-y-4">
            {/* Pricing Breakdown */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal ({items.length} items)</span>
                <span>${subtotal.toFixed(0)}</span>
              </div>
              {discountApplied && (
                <div className="flex justify-between text-[#00ff88]">
                  <span>Bundle Discount (50% off cheapest)</span>
                  <span>-${discount.toFixed(0)}</span>
                </div>
              )}
              <div className="flex justify-between text-white text-lg font-black pt-2 border-t border-gray-800">
                <span>Total</span>
                <span className="text-[#ffda0f]">${total.toFixed(0)}</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <Link href="/cart" onClick={onClose}>
                <Button className="w-full bg-[#ffda0f] text-black hover:bg-[#ffda0f]/80 font-bold text-lg py-6">
                  CHECKOUT
                </Button>
              </Link>
              <button
                onClick={clearCart}
                className="w-full text-gray-500 hover:text-red-400 text-sm transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

