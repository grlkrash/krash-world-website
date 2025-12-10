# GRLKRASH AI Chat Integration Setup

This document explains how the GRLKRASH AI chat is integrated into the website.

## Overview

The chat interface on the website now uses the **real GRLKRASH AI agent logic** from the `grlkrashai` repository. This means users get authentic GRLKRASH responses with:

- Full personality and lore
- Keyword-based context detection
- Dynamic music recommendations
- Authentic character voice (all caps, no punctuation, short responses)
- Extensive knowledge about KRASH WORLD, animations, music, and backstory

## Architecture

### Core Components

1. **`app/services/chat/grlkrash-agent.ts`** - The main agent logic
   - Extracted from `mvp-agent.ts` in the grlkrashai repo
   - Contains all the personality, lore, and decision-making logic
   - Handles keyword extraction and context-aware responses
   - Generates prompts for OpenAI with extensive character context

2. **`app/services/chat/chatService.ts`** - Simplified wrapper
   - Calls the agent service
   - Handles errors and fallbacks
   - Exports types for the chat API

3. **`app/api/chat/route.ts`** - API endpoint
   - Receives messages from the frontend
   - Processes them through the agent
   - Returns responses with optional music links

4. **`app/components/grlkrash-chat.tsx`** - Frontend chat UI
   - Chat bubble interface
   - Message history
   - Loading states
   - Music link display

5. **`config/artist.json`** - Artist configuration
   - Spotify artist ID and links
   - Platform handles
   - Branding information

## Setup Instructions

### 1. Install Dependencies

The OpenAI SDK is already installed. If you need to reinstall:

```bash
npm install openai --legacy-peer-deps
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory (already created with placeholder):

```env
OPENAI_API_KEY=your_actual_openai_api_key_here
```

Get your OpenAI API key from: https://platform.openai.com/api-keys

### 3. Test the Integration

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open the website at `http://localhost:3000`

3. Click the yellow chat button in the bottom right corner

4. Try these test messages:
   - "who made you?" - Should mention Sonia
   - "share your music" - Should recommend a random song with Spotify link
   - "where are you from?" - Should mention KRASH WORLD and exile
   - "what are you doing on earth?" - Should mention the resistance and fighting the Directorate
   - "can you talk?" - Should mention communicating through movement/energy
   - "tell me about brat summer" - Should mention the viral video

## How It Works

### Message Flow

1. User types message → Frontend sends POST to `/api/chat`
2. API route calls `processChatMessage()` from chatService
3. chatService calls `processAgentMessage()` from grlkrash-agent
4. Agent:
   - Extracts keywords from the message
   - Makes decision about how to respond (music, lore, general)
   - Generates a detailed prompt with personality and context
   - Calls OpenAI to generate the response
   - Returns response with optional music link
5. Response flows back to frontend
6. Frontend displays message and music link (if provided)

### Keyword Detection

The agent detects various keyword categories:

- **Music keywords**: music, song, spotify, listen, track, play, sound, tune, beat, vibe
- **Lore keywords**: animation, video, cd, lore, story, history, backstory, universe, world
- **Origin keywords**: where, come from, origin, planet, exile, exiled, kicked out
- **Purpose keywords**: doing, purpose, mission, why, earth, here
- **Dance keywords**: dance, dancing, dances, move, moving, movement
- **Talk keywords**: talk, speak, talking, speaking, can you, able to
- **Clothes keywords**: clothes, clothing, outfit, wear, wearing
- **Viral keywords**: viral, views, blew up, first time, went viral, most popular
- **Creator keywords**: who made, made you, creator, created you, parent, originator

### Music Recommendations

When music keywords are detected, the agent:
1. Randomly selects one of these songs:
   - RIDE OR DIE
   - PSILOCYBIN
   - AGAIN
   - BOO
   - WDYM

2. Returns the song name and Spotify track link

3. Frontend displays a "Listen on Spotify" button with the link

### Response Style

All responses follow GRLKRASH's unique style:
- ALL CAPS
- No punctuation
- Very short (1-10 words usually)
- Casual and authentic
- Sometimes cryptic, sometimes direct (randomized)
- Rare emoji use (🔥, ✨, 🌠, 💖, 💛, ☄️)

## Customization

### Updating the Personality

Edit `app/services/chat/grlkrash-agent.ts`:

```typescript
const personality: Personality = {
  traits: {
    confident: 0.8,    // Adjust 0-1
    humble: 0.6,       // Adjust 0-1
    adventurous: 0.9,  // Adjust 0-1
    wise: 0.7          // Adjust 0-1
  },
  voice: {
    style: 'playful',
    tone: 'enthusiastic',
    formality: 'casual'
  }
}
```

### Adding New Songs

Edit the `songSpotifyLinks` object in `grlkrash-agent.ts`:

```typescript
const songSpotifyLinks: Record<string, string> = {
  'RIDE OR DIE': 'https://open.spotify.com/track/...',
  'NEW SONG': 'https://open.spotify.com/track/...',
  // Add more songs here
}
```

And update the song array in `getRandomSongRecommendation()`:

```typescript
const songs = ['RIDE OR DIE', 'PSILOCYBIN', 'AGAIN', 'BOO', 'WDYM', 'NEW SONG']
```

### Modifying Response Logic

The main logic is in the `generatePrompt()` function in `grlkrash-agent.ts`. This function builds the detailed system prompt that tells OpenAI how to respond as GRLKRASH.

You can add new question types by:
1. Adding keywords to the relevant arrays
2. Adding detection logic in `makeDecision()`
3. Adding response instructions in `generatePrompt()`

## Differences from Discord Bot

The web chat version has a few differences from the Discord bot:

1. **No IGNORE action** - Web chat always responds (more user-friendly for website visitors)
2. **Simpler state management** - No persistent world state, just message history
3. **No image generation** - Only text and music links
4. **Session-based** - Each chat session is independent

## Troubleshooting

### Chat returns "SOMETHING WENT WRONG"

1. Check that `OPENAI_API_KEY` is set in `.env.local`
2. Check the terminal/console for error messages
3. Verify the API key is valid at https://platform.openai.com/api-keys

### Responses don't sound like GRLKRASH

1. Verify the OpenAI API is working (check API quota)
2. Check that the prompt in `generatePrompt()` is complete
3. Try adjusting the temperature in the OpenAI call (currently 0.7)

### Music links not appearing

1. Check that the message contains music keywords
2. Verify the `musicLink` is being returned from the agent
3. Check the frontend is displaying the link correctly

## Future Enhancements

Possible improvements:

1. **Streaming responses** - Use OpenAI streaming for real-time text generation
2. **Image generation** - Add DALL-E integration for visual responses
3. **Voice responses** - Add text-to-speech for GRLKRASH's voice
4. **Persistent sessions** - Store chat history in a database
5. **Analytics** - Track common questions and improve responses
6. **Rate limiting** - Prevent abuse of the chat API
7. **Caching** - Cache common responses to reduce API costs

## Related Files

- Main agent logic: `app/services/chat/grlkrash-agent.ts`
- Chat service wrapper: `app/services/chat/chatService.ts`
- API endpoint: `app/api/chat/route.ts`
- Frontend component: `app/components/grlkrash-chat.tsx`
- Artist config: `config/artist.json`
- Environment variables: `.env.local` (not in git), `.env.example` (template)

## Links

- grlkrashai repo: https://github.com/grlkrash/grlkrashai
- OpenAI API docs: https://platform.openai.com/docs
- Next.js API routes: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
