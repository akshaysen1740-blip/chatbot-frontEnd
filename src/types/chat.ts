export interface ChatMessage {
  role: 'user' | 'system' | 'assistant';
  message: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
}

export interface ChatResponse {
  statusCode: number;
  status: string;
  message: string;
  data?: {
    role?: 'user' | 'system' | 'assistant';
    content?: string;
  };
}
