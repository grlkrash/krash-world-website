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
    const body = await request.json()
    let railwayUrl = process.env.RAILWAY_API_URL || 'https://your-railway-app.railway.app/api/chat'
    if (railwayUrl && !railwayUrl.startsWith('http')) {
      railwayUrl = `https://${railwayUrl}`
    }
    
    const response = await fetch(railwayUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    
    const data = await response.json()
    return NextResponse.json(data, { headers: getCorsHeaders(origin) })
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

