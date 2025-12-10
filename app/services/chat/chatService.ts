import { processAgentMessage, type ChatMessage as AgentChatMessage } from './grlkrash-agent'

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface ChatResponse {
  message: string
  musicLink?: string
}

export async function processChatMessage(
  userMessage: string,
  conversationHistory: ChatMessage[] = []
): Promise<ChatResponse> {
  if (!userMessage || userMessage.trim().length === 0) {
    return {
      message: "HEY SAY SOMETHING IM LISTENING",
    }
  }

  try {
    // Use the real GRLKRASH agent
    const response = await processAgentMessage(userMessage.trim(), conversationHistory)
    
    return {
      message: response.message,
      musicLink: response.musicLink
    }
  } catch (error) {
    console.error('Chat service error:', error)
    
    // Fallback response if agent fails
    return {
      message: "HEY SORRY SOMETHING WENT WRONG TRY AGAIN",
    }
  }
}

