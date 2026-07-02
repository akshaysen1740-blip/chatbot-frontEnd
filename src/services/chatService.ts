import type { ChatMessage, ChatResponse } from '../types/chat';

const API_URL = import.meta.env.VITE_CHAT_API_URL as string;
const API_KEY = import.meta.env.VITE_CHAT_API_KEY as string;

if (!API_URL) {
  throw new Error('VITE_CHAT_API_URL is not defined in environment variables.');
}

/**
 * Sends the conversation history to the chatbot API endpoint.
 * Throws an error if the request fails or is offline.
 */
export async function sendChatMessage(messages: ChatMessage[]): Promise<ChatMessage> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (API_KEY) {
    headers.Authorization = `Bearer ${API_KEY}`;
  }

  const response = await fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers,
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
