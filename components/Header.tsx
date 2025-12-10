import React from 'react';
import { Category } from '../types';

interface HeaderProps {
  onlineCount: number;
  category: Category;
  onLeave: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onlineCount, category, onLeave }) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-background/95 backdrop-blur border-b border-primary/20 flex items-center justify-between px-3 sm:px-4 z-50 font-mono">
      <div className="flex items-center gap-3">
        <button 
          onClick={onLeave}
          className="text-primary hover:text-white hover:bg-primary/10 px-2 py-1 rounded transition-colors text-xs border border-transparent hover:border-primary/30"
          title="Disconnect"
        >
          &lt; EXIT
        </button>
        
        <div className="h-6 w-px bg-primary/20"></div>

        <div className="flex flex-col">
           <div className="flex items-center gap-2">
             <span className="w-2 h-2 bg-primary rounded-sm animate-pulse"></span>
             <h1 className="font-bold text-sm tracking-wider text-white uppercase">
               {category.code} :: {category.name}
             </h1>
           </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 text-xs font-mono text-primary/80">
        <span className="hidden sm:inline opacity-50">USERS_ONLINE:</span>
        <span className="bg-primary/10 px-2 py-0.5 border border-primary/30 rounded text-primary">
          {String(onlineCount).padStart(3, '0')}
        </span>
      </div>
    </header>
  );
};