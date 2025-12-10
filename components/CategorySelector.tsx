import React from 'react';
import { CATEGORIES, Category } from '../types';

interface CategorySelectorProps {
  onSelectCategory: (category: Category) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({ onSelectCategory }) => {
  return (
    <div className="h-full min-h-dvh bg-background text-zinc-100 flex flex-col items-center p-4 sm:p-6 animate-fade-in overflow-y-auto">
      <div className="max-w-4xl w-full pt-6 sm:pt-12 pb-6 sm:pb-8 text-center">
        <div className="inline-flex items-center justify-center p-3 mb-4 sm:mb-6 bg-surface rounded-full border border-white/5 shadow-xl">
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 sm:w-8 sm:h-8 text-primary">
            <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 12c0 5.282 3.023 9.849 7.304 11.793a.75.75 0 00.892 0c4.282-1.944 7.304-6.511 7.304-11.793a12.74 12.74 0 00-.665-6.235.75.75 0 00-.722-.515 11.208 11.208 0 01-7.877-3.08zM12 13.36c1.655 0 3-1.345 3-3s-1.345-3-3-3-3 1.345-3 3 1.345 3 3 3z" clipRule="evenodd" />
          </svg>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2 sm:mb-3">Choose a Room</h1>
        <p className="text-sm sm:text-base text-zinc-400 max-w-lg mx-auto px-2">
          Select a category to join. Anonymous & auto-deleted in 24h.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 w-full max-w-4xl pb-safe">
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category)}
            className="group relative flex flex-col items-start p-5 sm:p-6 rounded-2xl bg-surface border border-white/5 hover:border-primary/50 active:scale-[0.98] transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 text-left touch-manipulation"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity`} />
            <div className="flex items-center w-full mb-3 sm:mb-4">
               <div className="text-3xl sm:text-4xl bg-background/50 w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-2xl border border-white/5 shadow-inner mr-4">
                {category.emoji}
              </div>
              <div className="flex-1 sm:hidden">
                 <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                  {category.name}
                 </h3>
              </div>
            </div>
           
            <h3 className="hidden sm:block text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">
              {category.name}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 font-medium">
              {category.description}
            </p>
            <div className="mt-4 flex items-center text-xs text-primary font-semibold opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
              Join Room <span className="ml-1">→</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};