import React from 'react';
import { CATEGORIES, Category } from '../types';

interface CategorySelectorProps {
  onSelectCategory: (category: Category) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({ onSelectCategory }) => {
  return (
    <div className="h-full min-h-dvh bg-background text-primary flex flex-col items-center p-4 sm:p-6 animate-fade-in overflow-y-auto">
      <div className="max-w-5xl w-full pt-8 sm:pt-12 pb-6 sm:pb-8">
        
        {/* Header Section */}
        <div className="border-b border-primary/20 pb-6 mb-8 relative">
           <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-2 text-primary uppercase glitch-text">
            AnonNet<span className="animate-pulse">_</span>
           </h1>
           <p className="text-xs sm:text-sm text-primary/60 font-mono tracking-widest uppercase">
             Secure Uplink // version 2.0.4
           </p>
           <div className="absolute top-0 right-0 text-right hidden sm:block">
             <div className="text-[10px] text-primary/40">SYSTEM STATUS</div>
             <div className="text-xs text-primary animate-pulse">ONLINE</div>
           </div>
        </div>

        <div className="mb-6 flex items-center justify-between text-[10px] sm:text-xs text-primary/50 font-mono border border-primary/20 p-2 rounded bg-surface/50">
          <span>ENCRYPTION: <span className="text-white">AES-256</span></span>
          <span>IP STATUS: <span className="text-white">HIDDEN</span></span>
          <span>LOGS: <span className="text-alert">DISABLED</span></span>
        </div>

        <h2 className="text-sm font-bold text-white mb-4 uppercase tracking-widest pl-1 border-l-2 border-primary">
          Select Secure Node
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full pb-safe">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category)}
              className="group relative flex flex-col items-start p-5 bg-surface/80 border border-primary/30 hover:border-primary hover:bg-primary/5 transition-all duration-200 text-left overflow-hidden"
            >
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary opacity-50 group-hover:opacity-100 transition-opacity"></div>

              <div className="flex justify-between w-full mb-2">
                <span className="text-[10px] font-mono text-primary/50 group-hover:text-primary transition-colors">
                  {category.code}
                </span>
                <div className="h-2 w-2 rounded-full bg-zinc-800 group-hover:bg-primary animate-pulse"></div>
              </div>
             
              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors tracking-tight">
                {category.name}
              </h3>
              
              <p className="text-xs text-zinc-400 font-mono mb-4 border-l border-zinc-800 pl-2 group-hover:border-primary/30 transition-colors">
                {category.description}
              </p>
              
              <div className="mt-auto w-full pt-3 border-t border-dashed border-primary/20 flex items-center justify-between text-xs text-primary/70 font-mono">
                <span className="group-hover:translate-x-1 transition-transform">
                  &gt; CONNECT_
                </span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                  [ENTER]
                </span>
              </div>
            </button>
          ))}
        </div>
        
        <div className="mt-8 text-center">
            <p className="text-[10px] text-zinc-600 font-mono">
                "Freedom of speech is the foundation of a free society."
            </p>
        </div>
      </div>
    </div>
  );
};