"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"

interface CartItem {
  id: string
  title: string
  price: number
  coverImage: string
  fileFormat?: string
  tier?: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  clearCart: () => void
  isInCart: (id: string) => boolean
  itemCount: number
  subtotal: number
  discount: number
  total: number
  discountApplied: boolean
  cheapestItem: CartItem | null
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = "krash-cart"

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY)
      if (stored) {
        setItems(JSON.parse(stored))
      }
    } catch (error) {
      console.error("Error loading cart:", error)
    }
    setIsHydrated(true)
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    }
  }, [items, isHydrated])

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      if (prev.some((i) => i.id === item.id)) return prev
      return [...prev, item]
    })
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const isInCart = useCallback((id: string) => {
    return items.some((item) => item.id === id)
  }, [items])

  // Calculate pricing with BUNDLE50 discount
  const subtotal = items.reduce((sum, item) => sum + item.price, 0)
  
  // Find cheapest item for discount
  const cheapestItem = items.length >= 3 
    ? items.reduce((min, item) => item.price < min.price ? item : min, items[0])
    : null

  // Discount: 50% off cheapest item when 3+ items
  const discountApplied = items.length >= 3
  const discount = discountApplied && cheapestItem ? cheapestItem.price * 0.5 : 0
  const total = subtotal - discount

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        clearCart,
        isInCart,
        itemCount: items.length,
        subtotal,
        discount,
        total,
        discountApplied,
        cheapestItem,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

