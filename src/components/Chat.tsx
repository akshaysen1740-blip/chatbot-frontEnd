import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Sparkles, 
  RefreshCw, 
  User, 
  Cpu,
  MessageSquare,
  Settings,
  ChevronDown,
  Copy,
  Check,
  Plus
} from 'lucide-react';
import type { ChatMessage } from '../types/chat';
import { sendChatMessage } from '../services/chatService';
import ReactMarkdown from 'react-markdown';

export default function Chat() {
  // Messages state starts empty if there is no dynamic conversation
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('OWL Cognitive v1.2');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  const messagesAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    if (messagesAreaRef.current) {
      messagesAreaRef.current.scrollTo({
        top: messagesAreaRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    // Only scroll if there are messages in the conversation to prevent window shifting on mount
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, isLoading]);

  // Handle message submission
  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');

    // Append user message to history
    const updatedMessages: ChatMessage[] = [
      ...messages,
      { role: 'user', message: userMessage }
    ];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // Send the entire message history array to the backend
      const response = await sendChatMessage(updatedMessages);
      // Response from the API goes into the system object
      setMessages((prev) => [
        ...prev, 
        { role: 'assistant', message: response.message }
      ]);
    } catch (error) {
      console.error('Failed to send message:', error);
      // If the API call fails or there is no response, add the error response in the system object
      setMessages((prev) => [
        ...prev,
        { role: 'system', message: '⚠️ Error: Failed to get response from server. Please make sure the API is running at http://localhost:4000.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Pre-fill quick replies
  const handleQuickReply = (text: string) => {
    setInputValue(text);
  };

  const handleReset = () => {
    setMessages([]);
  };

  // Copy message to clipboard
  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="chat-container">
      {/* Background Neon Aura Orbs */}
      <div className="glow-orb orb-1"></div>
      <div className="glow-orb orb-2"></div>

      <div className="chat-workspace">
        {/* Sidebar Panel - Desktop Master Panel */}
        <aside className="chat-sidebar">
          <div className="sidebar-header">
            <div className="logo-area">
              <Cpu size={16} className="sidebar-logo-icon" />
              <span>OWL Hub</span>
            </div>
            <button onClick={handleReset} className="new-chat-btn" title="New conversation">
              <Plus size={14} />
            </button>
          </div>
          
          <div className="sidebar-content">
            <div className="sidebar-section">
              <h3>Conversations</h3>
              <div className="conversation-list">
                <button className={`conv-item ${messages.length === 0 ? 'active' : ''}`}>
                  <MessageSquare size={13} />
                  <span>Sandbox Prompt</span>
                </button>
                {messages.length > 0 && (
                  <button className="conv-item active">
                    <MessageSquare size={13} />
                    <span className="truncate">Active Conversation ({messages.length})</span>
                  </button>
                )}
                <button className="conv-item disabled">
                  <MessageSquare size={13} />
                  <span>Akshay Sen context</span>
                </button>
              </div>
            </div>

            <div className="sidebar-section">
              <h3>Preferences</h3>
              <div className="settings-controls">
                <div className="setting-row">
                  <span className="setting-label">Model</span>
                  <div className="select-wrapper">
                    <select 
                      value={selectedModel} 
                      onChange={(e) => setSelectedModel(e.target.value)}
                    >
                      <option>OWL Cognitive v1.2</option>
                      <option>OWL Reasoning v0.8</option>
                    </select>
                    <ChevronDown size={12} className="select-arrow" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="sidebar-footer">
            <User size={14} className="user-icon" />
            <div className="user-meta">
              <span className="user-name">Developer Hub</span>
              <span className="user-role">Administrator</span>
            </div>
            <Settings size={14} className="settings-trigger" />
          </div>
        </aside>

        {/* Main Chat Interface */}
        <main className="chat-main-panel">
          {/* Header */}
          <header className="chat-header">
            <div className="bot-profile">
              <div className="avatar-wrapper">
                <Cpu className="bot-avatar-icon" />
                <span className="online-indicator"></span>
              </div>
              <div className="bot-info">
                <h1>OWL AI</h1>
                <p className="bot-status">{selectedModel}</p>
              </div>
            </div>
            
            <div className="header-actions">
              <button 
                onClick={handleReset}
                className="action-btn"
                title="Reset conversation"
              >
                <RefreshCw size={14} />
                <span>Reset</span>
              </button>
            </div>
          </header>

          {/* Messages Area */}
          <div ref={messagesAreaRef} className="messages-area">
            <div className="messages-area-wrapper">
              <div className="chat-welcome-banner">
                <Sparkles size={20} className="welcome-icon" />
                <h3>Owl Chat Sandbox</h3>
                <p>Type below to send messages. Each message sends the entire array of conversation history in the payload, mirroring your API specification.</p>
              </div>

              {/* Static Initial Greeting (Not included in request payload array) */}
              <div className="message-row bot-row">
                <div className="avatar-bubble">
                  <Cpu size={14} />
                </div>
                <div className="message-content">
                  <div className="message-meta">OWL Agent</div>
                  <div className="message-text">
                    Hey! How can I help you today?
                  </div>
                </div>
              </div>

              <AnimatePresence initial={false}>
                {messages.map((msg, index) => {
                  const isUser = msg.role === 'user';
                  const isError = msg.message.startsWith('⚠️ Error:');
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className={`message-row ${isUser ? 'user-row' : 'bot-row'}`}
                    >
                      <div className="avatar-bubble">
                        {isUser ? <User size={14} /> : <Cpu size={14} />}
                      </div>
                      <div className="message-content">
                        <div className="message-meta">
                          {isUser ? 'User' : 'OWL Agent'}
                        </div>
                        <div className="bubble-wrapper-actions">
                          <div className={`message-text ${isError ? 'error-text-bubble' : ''}`}>
                            <ReactMarkdown>{msg.message}</ReactMarkdown>
                          </div>
                          {!isUser && !isError && (
                            <button 
                              className="message-action-btn" 
                              onClick={() => handleCopy(msg.message, index)}
                              title="Copy response"
                            >
                              {copiedIndex === index ? <Check size={12} className="success-copy" /> : <Copy size={12} />}
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Loading Indicator */}
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15 }}
                  className="message-row bot-row"
                >
                  <div className="avatar-bubble">
                    <Cpu size={14} />
                  </div>
                  <div className="message-content">
                    <div className="message-meta">OWL is typing</div>
                    <div className="message-text loading-bubble">
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
          {/* Quick replies suggested prompts */}
          <div className="quick-replies">
            <button onClick={() => handleQuickReply('Heyy, my name is akshay sen')} className="quick-btn">
              My name is Akshay
            </button>
            <button onClick={() => handleQuickReply('Do you know me')} className="quick-btn">
              Do you know me?
            </button>
            <button onClick={() => handleQuickReply('Tell me a cool facts about owls')} className="quick-btn">
              Cool Owl facts 🦉
            </button>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="chat-input-form">
            <div className="input-glow-wrapper">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Send a message to OWL..."
                disabled={isLoading}
              />
              <button 
                type="submit" 
                className="send-button"
                disabled={!inputValue.trim() || isLoading}
              >
                <Send size={16} />
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
