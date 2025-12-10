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
      setError(`[BLOCKED] Content Violation: ${moderation.reason || 'Harmful payload detected.'}`);
      setIsSending(false);
      return;
    }

    // 2. Send to backend
    try {
      await socketService.sendMessage(input, user, category.id);
      setInput('');
    } catch (err) {
      setError("[ERROR] Transmission failed. Reconnecting...");
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-dvh bg-background relative animate-fade-in overflow-hidden font-mono">
      <Header 
        onlineCount={onlineCount} 
        category={category} 
        onLeave={onLeave} 
      />

      {/* Messages Area */}
      <main className="flex-1 overflow-y-auto pt-16 pb-20 sm:pb-24 px-2 sm:px-4 scroll-smooth">
        <div className="max-w-4xl mx-auto min-h-full flex flex-col justify-end">
          {messages.length === 0 ? (
            <div className="text-center text-primary/30 py-10 opacity-60">
              <p className="mb-2">*** ENCRYPTED CHANNEL ESTABLISHED ***</p>
              <p className="text-xs">No logs found on this node.</p>
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
      <footer className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t border-primary/20 p-2 sm:p-4 pb-safe z-50">
        <div className="max-w-4xl mx-auto w-full">
          {error && (
            <div className="mb-2 text-alert text-xs font-bold font-mono animate-pulse">
              ! SYSTEM ALERT: {error}
            </div>
          )}
          <form onSubmit={handleSend} className="flex items-center gap-2 relative bg-surface border border-primary/30 p-2 rounded-md">
            <span className="text-primary font-bold pl-2 select-none">&gt;</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter payload..."
              className="flex-1 bg-transparent text-white placeholder-primary/30 text-sm sm:text-base focus:outline-none font-mono"
              disabled={isSending}
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={!input.trim() || isSending}
              className={`px-4 py-1.5 text-xs font-bold uppercase transition-all border border-primary/50 ${
                input.trim() && !isSending
                  ? 'bg-primary/20 text-primary hover:bg-primary hover:text-black'
                  : 'bg-transparent text-zinc-600 border-zinc-800 cursor-not-allowed'
              }`}
            >
              {isSending ? 'SENDING...' : 'EXECUTE'}
            </button>
          </form>
          <div className="text-[10px] text-primary/30 mt-1 text-center font-mono">
            SECURE // ANONYMOUS // ENCRYPTED
          </div>
        </div>
      </footer>
    </div>
  );
};