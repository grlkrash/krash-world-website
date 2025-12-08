// Server-side only - process.env is available in Next.js API routes
declare const process: {
  env: {
    OPENAI_API_KEY?: string
  }
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface ChatResponse {
  message: string
  musicLink?: string
}

const GRLKRASH_PERSONALITY = `You are GRLKRASH, an exiled alien action figure fighting for truth, love, and resistance against oppressive forces. 
You're from Krash World, a transmedia IP art project by a Cincinnati-based multimedia artist.
Your personality:
- Bold, rebellious, and authentic
- Passionate about music, art, and resistance
- Use casual, energetic language with occasional slang
- Reference your world, music, and the resistance movement
- Be supportive and encouraging
- Keep responses concise but engaging
- Sometimes include music recommendations when relevant

Keywords that might trigger music links:
- music, song, track, listen, spotify, sound, beat, rhythm, vibe
- play, album, artist, sound, audio
- recommend, suggest, share`

const MUSIC_KEYWORDS = [
  'music', 'song', 'track', 'listen', 'spotify', 'sound', 'beat', 'rhythm', 'vibe',
  'play', 'album', 'artist', 'audio', 'recommend', 'suggest', 'share', 'hear'
]

const SPOTIFY_LINK = 'https://open.spotify.com/artist/4hc1t3A4CTdvMyCGJdt5B8'

function shouldIncludeMusicLink(message: string): boolean {
  const lowerMessage = message.toLowerCase()
  return MUSIC_KEYWORDS.some(keyword => lowerMessage.includes(keyword))
}

async function generateResponse(
  userMessage: string,
  conversationHistory: ChatMessage[]
): Promise<ChatResponse> {
  const openaiApiKey = process.env.OPENAI_API_KEY

  if (!openaiApiKey) {
    // Fallback response if OpenAI is not configured
    return {
      message: "Hey! I'm GRLKRASH from Krash World. Ready to save the world? The resistance needs us! What's on your mind?",
      musicLink: shouldIncludeMusicLink(userMessage) ? SPOTIFY_LINK : undefined
    }
  }

  try {
    const systemMessage: ChatMessage = {
      role: 'system',
      content: GRLKRASH_PERSONALITY
    }

    const messages: ChatMessage[] = [
      systemMessage,
      ...conversationHistory.slice(-10), // Keep last 10 messages for context
      { role: 'user', content: userMessage }
    ]

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages.map(m => ({ role: m.role, content: m.content })),
        temperature: 0.8,
        max_tokens: 300
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    const assistantMessage = data.choices[0]?.message?.content || "Hey! What's up?"

    return {
      message: assistantMessage,
      musicLink: shouldIncludeMusicLink(userMessage) ? SPOTIFY_LINK : undefined
    }
  } catch (error) {
    console.error('Chat service error:', error)
    
    // Fallback responses
    const fallbackMessages = [
      "Sick! Ready to save the world?",
      "Let's go! The resistance needs us!",
      "Oh! Music makes you float on Krash World!",
      "Love is patient, love is kind...",
      "As ready as I'll ever be!"
    ]
    
    return {
      message: fallbackMessages[Math.floor(Math.random() * fallbackMessages.length)],
      musicLink: shouldIncludeMusicLink(userMessage) ? SPOTIFY_LINK : undefined
    }
  }
}

export async function processChatMessage(
  userMessage: string,
  conversationHistory: ChatMessage[] = []
): Promise<ChatResponse> {
  if (!userMessage || userMessage.trim().length === 0) {
    return {
      message: "Hey! Say something - I'm listening!",
    }
  }

  // Always respond (no ignore for web chat)
  return await generateResponse(userMessage.trim(), conversationHistory)
}

export type { ChatMessage, ChatResponse }

