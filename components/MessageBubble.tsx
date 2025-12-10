import React from 'react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwn }) => {
  const timeString = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (message.isSystem) {
    return (
      <div className="flex justify-center my-4 animate-fade-in">
        <span className="text-[10px] text-primary/70 bg-primary/5 px-2 py-1 border border-primary/20 font-mono tracking-tight">
          &lt; SYSTEM: {message.text} /&gt;
        </span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col mb-3 ${isOwn ? 'items-end' : 'items-start'} animate-fade-in`}>
      <div className={`max-w-[90%] sm:max-w-[75%] font-mono text-sm relative border ${
        isOwn 
          ? 'bg-primary/10 border-primary/50 text-white' 
          : 'bg-surface border-zinc-700 text-zinc-300'
      }`}>
        {/* Decorative corner markers */}
        <div className={`absolute top-0 w-1 h-1 ${isOwn ? 'right-0 bg-primary' : 'left-0 bg-zinc-500'}`}></div>
        <div className={`absolute bottom-0 w-1 h-1 ${isOwn ? 'left-0 bg-primary' : 'right-0 bg-zinc-500'}`}></div>

        <div className="px-3 py-2">
           {!isOwn && (
            <div className="flex items-center gap-2 mb-1 border-b border-white/5 pb-1">
               <span className="text-[10px] text-primary font-bold">{message.username}</span>
               <span className="text-[8px] text-zinc-600">ID: {message.senderId.slice(0, 4)}</span>
            </div>
          )}
          
          <p className="leading-relaxed whitespace-pre-wrap break-words">
            {message.text}
          </p>
        </div>
      </div>
      <div className="text-[9px] text-zinc-600 mt-1 px-1 font-mono">
        {timeString}
      </div>
    </div>
  );
};