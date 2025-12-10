"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle, X, Send, Music } from "lucide-react"
import type { ChatMessage } from "@/app/services/chat/chatService"

interface GRLKRASHChatProps {
  apiUrl?: string
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export function GRLKRASHChat({ apiUrl = "/api/chat", isOpen: controlledIsOpen, onOpenChange }: GRLKRASHChatProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen
  const setIsOpen = (open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open)
    } else {
      setInternalIsOpen(open)
    }
  }
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "HEYY IT'S GRL! ✨ WHAT YOU WANNA KNOW?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [musicLink, setMusicLink] = useState<string | undefined>()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Sync internal state with controlled state
  useEffect(() => {
    if (controlledIsOpen !== undefined) {
      setInternalIsOpen(controlledIsOpen)
    }
  }, [controlledIsOpen])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput("")
    setMusicLink(undefined)

    // Add user message
    const newUserMessage: ChatMessage = {
      role: "user",
      content: userMessage,
    }
    setMessages((prev) => [...prev, newUserMessage])
    setIsLoading(true)

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          history: messages,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const data = await response.json()
      
      // Add assistant response
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: data.message || data.error || "Hey! What's up?",
      }
      setMessages((prev) => [...prev, assistantMessage])
      
      if (data.musicLink) {
        setMusicLink(data.musicLink)
      }
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: error instanceof Error && error.message.includes('Failed to fetch')
          ? "Hey! Can't connect right now. Check your internet and try again?"
          : "Oops! Something went wrong. Try again?",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#ffda0f] text-black hover:bg-[#ffda0f]/80 transition-all duration-300 shadow-lg hover:scale-110 flex items-center justify-center"
        aria-label="Open chat with GRLKRASH"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[90vw] sm:w-96 h-[500px] bg-black border-2 border-[#ffda0f] rounded-lg shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-[#ffda0f] text-black px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#00ff88] rounded-full animate-pulse" />
              <span className="font-bold text-sm">GRLKRASH</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-black hover:text-black/70 transition-colors"
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-lg ${
                    msg.role === "user"
                      ? "bg-[#ffda0f] text-black"
                      : "bg-gray-800 text-white border border-[#ffda0f]/30"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 text-white border border-[#ffda0f]/30 px-4 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-[#ffda0f] rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
                    <div className="w-2 h-2 bg-[#ffda0f] rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                    <div className="w-2 h-2 bg-[#ffda0f] rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                  </div>
                </div>
              </div>
            )}
            
            {musicLink && (
              <div className="flex justify-start">
                <a
                  href={musicLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#00ff88] text-black px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-[#00ff88]/80 transition-colors"
                >
                  <Music size={16} />
                  <span className="text-sm font-bold">Listen on Spotify</span>
                </a>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-[#ffda0f]/30 p-4 bg-black">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1 bg-gray-900 text-white border border-[#ffda0f]/30 rounded-lg px-4 py-2 focus:outline-none focus:border-[#ffda0f] text-sm"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="bg-[#ffda0f] text-black hover:bg-[#ffda0f]/80 disabled:opacity-50"
                size="icon"
              >
                <Send size={18} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

