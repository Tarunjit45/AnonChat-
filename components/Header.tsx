import React from 'react';
import { Category } from '../types';

interface HeaderProps {
  onlineCount: number;
  category: Category;
  onLeave: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onlineCount, category, onLeave }) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-surface/90 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-3 sm:px-4 z-50 shadow-sm">
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
        <button 
          onClick={onLeave}
          className="p-2 -ml-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors flex-shrink-0"
          title="Leave Room"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clipRule="evenodd" />
          </svg>
        </button>
        
        <div className="flex items-center gap-2 min-w-0">
           <span className="text-xl sm:text-2xl flex-shrink-0">{category.emoji}</span>
           <div className="min-w-0">
             <h1 className="font-bold text-sm sm:text-base tracking-tight text-white leading-tight truncate">
               {category.name}
             </h1>
             <p className="text-[10px] text-zinc-400 font-medium truncate hidden xs:block">AnonChat</p>
           </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 bg-black/40 px-2 sm:px-3 py-1.5 rounded-full border border-white/5 flex-shrink-0 ml-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-xs font-semibold text-zinc-300 whitespace-nowrap">
          {onlineCount} <span className="hidden sm:inline">online</span>
        </span>
      </div>
    </header>
  );
};