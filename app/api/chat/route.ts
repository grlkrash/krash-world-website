import { processChatMessage, type ChatMessage } from '@/app/services/chat/chatService'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { message, history = [] } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    const chatHistory: ChatMessage[] = Array.isArray(history) ? history : []
    const response = await processChatMessage(message, chatHistory)

    return NextResponse.json(response, {
      headers: {
        'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || 'https://krash.world',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat message', message: "Hey! Something went wrong. Try again?" },
      { status: 500 }
    )
  }
}

export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || 'https://krash.world',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

