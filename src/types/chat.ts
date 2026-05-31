export interface ChatMessage {
  role: 'user' | 'system' | 'assistant';
  message: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
}

export interface ChatResponse {
  index?: number;
  logprobs?: null | any;
  finish_reason?: string;
  native_finish_reason?: string;
  message?: {
    role?: string;
    content?: string;
  };
}
