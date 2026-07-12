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

  const responseData: ChatResponse = await response.json();
  
  // The API response content contains a JSON-encoded string under data.content
  const content = responseData.data?.content || '';
  let messageText = content;
  
  try {
    const parsed = JSON.parse(content);
    if (parsed && typeof parsed === 'object' && 'message' in parsed) {
      messageText = parsed.message;
    }
  } catch (e) {
    // If it is not valid JSON, use the raw content as fallback
    messageText = content;
  }
  
  const role = (responseData.data?.role || 'assistant') as 'user' | 'system' | 'assistant';

  return {
    role,
    message: messageText,
  };
}
