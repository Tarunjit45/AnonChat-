import React from 'react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwn }) => {
  // Format time (e.g., 14:30)
  const timeString = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (message.isSystem) {
    return (
      <div className="flex justify-center my-4 animate-fade-in">
        <span className="text-xs text-zinc-500 bg-secondary/50 px-3 py-1 rounded-full border border-white/5">
          {message.text}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col mb-4 ${isOwn ? 'items-end' : 'items-start'} animate-fade-in`}>
      <div className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-3 shadow-sm relative group transition-all duration-200 ${
        isOwn 
          ? 'bg-primary text-white rounded-br-none' 
          : 'bg-secondary text-zinc-200 rounded-bl-none'
      }`}>
        {!isOwn && (
          <p className="text-[10px] font-bold text-zinc-400 mb-1 opacity-70">
            {message.username}
          </p>
        )}
        <p className="text-sm sm:text-base leading-relaxed break-words whitespace-pre-wrap">
          {message.text}
        </p>
        <div className={`text-[10px] mt-1 opacity-50 flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
          {timeString}
        </div>
      </div>
    </div>
  );
};