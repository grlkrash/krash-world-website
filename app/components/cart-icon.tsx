"use client"

import { ShoppingCart } from "lucide-react"
import { useCart } from "./cart-context"

interface CartIconProps {
  onClick: () => void
}

export default function CartIcon({ onClick }: CartIconProps) {
  const { itemCount, discountApplied } = useCart()

  return (
    <button
      onClick={onClick}
      className="relative text-[#ffda0f] hover:text-[#ffda0f]/80 transition-colors p-2"
      aria-label={`Shopping cart with ${itemCount} items`}
    >
      <ShoppingCart size={24} />
      {itemCount > 0 && (
        <span
          className={`absolute -top-1 -right-1 text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center ${
            discountApplied
              ? "bg-[#00ff88] text-black animate-pulse"
              : "bg-[#ffda0f] text-black"
          }`}
        >
          {itemCount}
        </span>
      )}
    </button>
  )
}

