import React, { useState, useEffect, useRef } from 'react';
import { UserSession, Message, Category } from '../types';
import { socketService } from '../services/socketService';
import { moderateContent } from '../services/geminiService';
import { MessageBubble } from './MessageBubble';
import { Header } from './Header';

interface ChatRoomProps {
  user: UserSession;
  category: Category;
  onLeave: () => void;
}

export const ChatRoom: React.FC<ChatRoomProps> = ({ user, category, onLeave }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Connect to room
  useEffect(() => {
    setMessages([]); // Clear previous messages
    
    // Join the specific room
    socketService.joinRoom(category.id, (initialMsgs, initialCount) => {
      setMessages(initialMsgs);
      // Count will be updated by the subscription shortly after
    });

    const unsubMsg = socketService.subscribeToMessages((newMsgs) => {
      setMessages((prev) => [...prev, ...newMsgs]);
    });

    const unsubCount = socketService.subscribeToOnlineCount((count) => {
      setOnlineCount(count);
    });

    return () => {
      socketService.leaveRoom(category.id);
      unsubMsg();
      unsubCount();
    };
  }, [category.id]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;

    setIsSending(true);
    setError(null);

    // 1. Moderate Content
    const moderation = await moderateContent(input);

    if (moderation.flagged) {
      setError(`Message blocked: ${moderation.reason || 'Harmful content detected.'}`);
      setIsSending(false);
      return;
    }

    // 2. Send to backend with room ID
    try {
      await socketService.sendMessage(input, user, category.id);
      setInput('');
    } catch (err) {
      setError("Failed to send message. Is the server running?");
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background relative animate-fade-in">
      <Header 
        onlineCount={onlineCount} 
        category={category} 
        onLeave={onLeave} 
      />

      {/* Messages Area */}
      <main className="flex-1 overflow-y-auto pt-20 pb-24 px-4 sm:px-6 scroll-smooth">
        <div className="max-w-3xl mx-auto min-h-full flex flex-col justify-end">
          {messages.length === 0 ? (
            <div className="text-center text-zinc-500 py-10 opacity-60">
              <p>No messages yet. Be the first to say hello!</p>
              <p className="text-xs mt-2">Ensure backend is running on port 3001</p>
            </div>
          ) : (
            messages.map((msg) => (
              <MessageBubble 
                key={msg.id} 
                message={msg} 
                isOwn={msg.senderId === user.id} 
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="fixed bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-xl border-t border-white/5 p-4 z-50">
        <div className="max-w-3xl mx-auto w-full">
          {error && (
            <div className="mb-2 text-red-400 text-xs text-center animate-fade-in bg-red-950/30 py-2 rounded-lg border border-red-900/50">
              {error}
            </div>
          )}
          <form onSubmit={handleSend} className="flex items-end gap-2 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Message #${category.name}...`}
              className="w-full bg-secondary text-zinc-100 placeholder-zinc-500 rounded-2xl py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all border border-transparent focus:border-white/10"
              disabled={isSending}
              autoFocus
            />
            <button
              type="submit"
              disabled={!input.trim() || isSending}
              className={`absolute right-1.5 bottom-1.5 p-2 rounded-xl transition-all ${
                input.trim() && !isSending
                  ? 'bg-primary text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20 scale-100'
                  : 'bg-zinc-700 text-zinc-500 cursor-not-allowed scale-95'
              }`}
            >
              {isSending ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                </svg>
              )}
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
};