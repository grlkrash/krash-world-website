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

interface ChatMessageWithTimestamp extends ChatMessage {
  timestamp?: Date
  isRead?: boolean
}

// Pool of example questions
const EXAMPLE_QUESTIONS = [
  "WHO ARE YOU?",
  "WHERE DID YOU COME FROM?",
  "WHY ARE YOU DANCING?",
  "WHAT IS KRASH WORLD?",
]

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
  const [messages, setMessages] = useState<ChatMessageWithTimestamp[]>([
    {
      role: "assistant",
      content: "HEYY IT'S GRL! ✨ WHAT YOU WANNA KNOW?",
      timestamp: new Date(),
      isRead: true,
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [musicLink, setMusicLink] = useState<string | undefined>()
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([])

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

  // Randomly select 2 questions on mount
  useEffect(() => {
    const shuffled = [...EXAMPLE_QUESTIONS].sort(() => Math.random() - 0.5)
    setSuggestedQuestions(shuffled.slice(0, 2))
  }, [])

  const handleSend = async (messageOverride?: string) => {
    const userMessage = messageOverride || input.trim()
    if (!userMessage || isLoading) return

    setInput("")
    setMusicLink(undefined)

    // Add user message
    const newUserMessage: ChatMessageWithTimestamp = {
      role: "user",
      content: userMessage,
      timestamp: new Date(),
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
        console.error('API request failed:', response.status, errorData)
        throw new Error(errorData.error || errorData.message || `HTTP ${response.status}`)
      }

      const data = await response.json()
      
      // Debug: Log the actual backend response
      console.log('🔍 Backend response data:', JSON.stringify(data, null, 2))
      console.log('🔍 Response keys:', Object.keys(data))
      console.log('🔍 data.response:', data.response)
      console.log('🔍 data.message:', data.message)
      console.log('🔍 Full data object:', data)
      
      // Extract response text - Railway backend returns { response: "..." }
      // Try multiple possible fields and nested structures
      let aiResponse = data.response || data.message || data.content || data.text || data.error
      
      // Handle nested response objects
      if (!aiResponse && data.data) {
        aiResponse = data.data.response || data.data.message || data.data.content
      }
      
      // Handle if response is an object with a text/message property
      if (typeof aiResponse === 'object' && aiResponse !== null) {
        aiResponse = aiResponse.text || aiResponse.message || aiResponse.content || aiResponse.response
      }
      
      console.log('🔍 Extracted aiResponse:', aiResponse)
      console.log('🔍 aiResponse type:', typeof aiResponse)
      
      if (!aiResponse || typeof aiResponse !== 'string') {
        console.error('❌ Invalid response format from backend:', data)
        console.error('❌ aiResponse value:', aiResponse, 'type:', typeof aiResponse)
        throw new Error(`Invalid response format from backend. Received: ${JSON.stringify(data)}`)
      }
      
      // Ensure we have a non-empty string
      if (aiResponse.trim().length === 0) {
        console.error('❌ Empty response string from backend')
        throw new Error('Backend returned empty response')
      }
      
      // Mark user message as read
      setMessages((prev) => 
        prev.map((msg, idx) => 
          idx === prev.length - 1 && msg.role === "user" 
            ? { ...msg, isRead: true } 
            : msg
        )
      )
      
      // Add assistant response with slight delay for read receipt
      setTimeout(() => {
        const assistantMessage: ChatMessageWithTimestamp = {
          role: "assistant",
          content: aiResponse.trim(), // Ensure we use the actual backend response
          timestamp: new Date(),
          isRead: true,
        }
        console.log('✅ Adding assistant message:', assistantMessage.content)
        setMessages((prev) => [...prev, assistantMessage])
      }, 300)
      
      if (data.musicLink) {
        setMusicLink(data.musicLink)
      }
    } catch (error) {
      console.error("❌ Chat error:", error)
      console.error("❌ Error details:", {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      })
      const errorMessage: ChatMessageWithTimestamp = {
        role: "assistant",
        content: error instanceof Error && error.message.includes('Failed to fetch')
          ? "Hey! Can't connect right now. Check your internet and try again?"
          : error instanceof Error 
            ? `Error: ${error.message}` 
            : "Oops! Something went wrong. Try again?",
        timestamp: new Date(),
        isRead: true,
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

  const handleSuggestionClick = (question: string) => {
    handleSend(question)
  }

  // Check if user has sent any messages (only first message is assistant welcome)
  const hasUserMessages = messages.some(msg => msg.role === "user")
  const showSuggestions = !hasUserMessages && suggestedQuestions.length > 0

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
          <div className="flex-1 overflow-y-auto p-4 space-y-3 imessage-bg">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
              >
                <div className="relative max-w-[75%]">
                  {/* Message Bubble with Tail */}
                  <div
                    className={`relative px-4 py-2.5 ${
                      msg.role === "user"
                        ? "imessage-bubble-user rounded-[18px]"
                        : "imessage-bubble-assistant rounded-[18px]"
                    }`}
                  >
                    {/* Speech Bubble Tail */}
                    <div
                      className={`absolute bottom-0 ${
                        msg.role === "user"
                          ? "imessage-tail-user -right-1.5"
                          : "imessage-tail-assistant -left-1.5"
                      }`}
                    />
                    
                    {/* Glossy Shine Effect */}
                    <div
                      className={`absolute top-1 left-3 right-3 h-[40%] rounded-t-[15px] opacity-40 pointer-events-none ${
                        msg.role === "user" 
                          ? "bg-gradient-to-b from-white to-transparent"
                          : "bg-gradient-to-b from-white/20 to-transparent"
                      }`}
                    />
                    
                    <p className="text-sm whitespace-pre-wrap relative z-10">{msg.content}</p>
                  </div>
                </div>
                
                {/* Timestamp and Read Receipt */}
                <div className={`flex items-center gap-1.5 mt-1 px-1 ${
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}>
                  <span className="text-[10px] text-gray-500">
                    {msg.timestamp?.toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit',
                      hour12: true 
                    })}
                  </span>
                  {msg.role === "user" && msg.isRead && (
                    <span className="text-[10px] text-gray-500 font-medium">Read</span>
                  )}
                </div>
              </div>
            ))}

            {/* Suggestion Chips */}
            {showSuggestions && (
              <div className="flex flex-wrap gap-2 justify-start mt-2">
                {suggestedQuestions.map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(question)}
                    className="relative bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] text-[#ffda0f] border border-[#ffda0f]/30 px-4 py-2 rounded-[16px] text-xs font-medium hover:border-[#ffda0f]/60 transition-all shadow-md"
                    disabled={isLoading}
                  >
                    <span className="relative z-10">{question}</span>
                    <div className="absolute top-0.5 left-2 right-2 h-[30%] rounded-t-[14px] bg-gradient-to-b from-white/10 to-transparent opacity-50 pointer-events-none" />
                  </button>
                ))}
              </div>
            )}
            
            {isLoading && (
              <div className="flex flex-col items-start">
                <div className="relative max-w-[75%]">
                  <div className="relative imessage-bubble-assistant rounded-[18px] px-4 py-3">
                    {/* Speech Bubble Tail */}
                    <div className="absolute bottom-0 imessage-tail-assistant -left-1.5" />
                    
                    {/* Glossy Shine Effect */}
                    <div className="absolute top-1 left-3 right-3 h-[40%] rounded-t-[15px] bg-gradient-to-b from-white/20 to-transparent opacity-40 pointer-events-none" />
                    
                    <div className="flex space-x-1 relative z-10">
                      <div className="w-2 h-2 bg-[#ffda0f] rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
                      <div className="w-2 h-2 bg-[#ffda0f] rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                      <div className="w-2 h-2 bg-[#ffda0f] rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {musicLink && (
              <div className="flex flex-col items-start">
                <div className="relative max-w-[75%]">
                  <a
                    href={musicLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative block imessage-bubble-music rounded-[18px] px-4 py-2.5 hover:opacity-90 transition-opacity"
                  >
                    {/* Speech Bubble Tail */}
                    <div className="absolute bottom-0 imessage-tail-music -left-1.5" />
                    
                    {/* Glossy Shine Effect */}
                    <div className="absolute top-1 left-3 right-3 h-[40%] rounded-t-[15px] bg-gradient-to-b from-white/50 to-transparent opacity-60 pointer-events-none" />
                    
                    <div className="flex items-center space-x-2 relative z-10">
                      <Music size={16} />
                      <span className="text-sm font-bold">Listen on Spotify</span>
                    </div>
                  </a>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-[#ffda0f]/30 p-3 bg-black">
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="iMessage"
                  className="w-full bg-[#1a1a1a] text-white border border-[#333] rounded-[20px] px-4 py-2.5 pr-12 focus:outline-none focus:border-[#ffda0f]/50 text-sm placeholder:text-gray-600 shadow-inner"
                  disabled={isLoading}
                />
              </div>
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="w-9 h-9 rounded-full bg-gradient-to-b from-[#ffda0f] to-[#e5c300] text-black hover:from-[#e5c300] hover:to-[#ccaf00] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center shadow-lg transition-all"
                aria-label="Send message"
              >
                <Send size={16} className="-mr-0.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

