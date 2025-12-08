import { processChatMessage, type ChatMessage } from '@/app/services/chat/chatService'
import { NextResponse } from 'next/server'

function getCorsHeaders(origin: string | null) {
  const allowedOrigins = [
    'https://krash.world',
    'https://www.krash.world',
    'http://localhost:3000',
    'http://localhost:3001',
  ]
  
  const allowedOrigin = origin && allowedOrigins.includes(origin) 
    ? origin 
    : allowedOrigins[0]

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Credentials': 'true',
  }
}

export async function POST(request: Request) {
  try {
    const origin = request.headers.get('origin')
    const { message, history = [] } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { 
          status: 400,
          headers: getCorsHeaders(origin),
        }
      )
    }

    const chatHistory: ChatMessage[] = Array.isArray(history) ? history : []
    const response = await processChatMessage(message, chatHistory)

    return NextResponse.json(response, {
      headers: getCorsHeaders(origin),
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat message', message: "Hey! Something went wrong. Try again?" },
      { 
        status: 500,
        headers: getCorsHeaders(request.headers.get('origin')),
      }
    )
  }
}

export async function OPTIONS(request: Request) {
  const origin = request.headers.get('origin')
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(origin),
  })
}

