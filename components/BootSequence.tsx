import React, { useState, useEffect } from 'react';

interface BootSequenceProps {
  onComplete: () => void;
}

export const BootSequence: React.FC<BootSequenceProps> = ({ onComplete }) => {
  const [lines, setLines] = useState<string[]>([]);
  
  const bootText = [
    "INITIALIZING SECURE KERNEL...",
    "LOADING ENCRYPTION MODULES [AES-256]...",
    "ESTABLISHING PROXY CHAIN...",
    "MASKING IP ADDRESS... [COMPLETED]",
    "BYPASSING FIREWALL... [SUCCESS]",
    "CONNECTING TO ANONYMOUS NETWORK...",
    "ACCESS GRANTED."
  ];

  useEffect(() => {
    let delay = 0;
    bootText.forEach((text, index) => {
      delay += Math.random() * 300 + 100;
      setTimeout(() => {
        setLines(prev => [...prev, text]);
        if (index === bootText.length - 1) {
          setTimeout(onComplete, 800);
        }
      }, delay);
    });
  }, []);

  return (
    <div className="h-full w-full bg-background flex flex-col justify-end pb-20 px-6 font-mono text-sm sm:text-base">
      <div className="max-w-2xl mx-auto w-full">
        {lines.map((line, i) => (
          <div key={i} className="mb-1 text-primary animate-fade-in">
            <span className="text-zinc-500 mr-2">[{new Date().toLocaleTimeString()}]</span>
            {line}
          </div>
        ))}
        <div className="mt-2 text-primary">
          <span className="cursor-blink">_</span>
        </div>
      </div>
    </div>
  );
};