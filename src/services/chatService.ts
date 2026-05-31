import type { ChatMessage, ChatResponse } from '../types/chat';

const API_URL = 'http://localhost:4000/chat';

/**
 * Sends the conversation history to the chatbot API endpoint.
 * Throws an error if the request fails or is offline.
 */
export async function sendChatMessage(messages: ChatMessage[]): Promise<ChatMessage> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: ChatResponse = await response.json();
  
  // Parse response message content from the API's nested object format
  const messageText = data.message?.content || '';
  const role = (data.message?.role || 'system') as 'user' | 'system' | 'assistant';

  return {
    role,
    message: messageText,
  };
}
