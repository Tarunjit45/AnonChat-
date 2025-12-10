export interface Message {
  id: string;
  senderId: string;
  username: string;
  text: string;
  timestamp: number;
  roomId?: string;
  isSystem?: boolean;
}

export interface ModerationResult {
  flagged: boolean;
  reason?: string;
}

export interface UserSession {
  id: string;
  username: string;
}

// Enum used in Gemini config
export enum SchemaType {
  STRING = 'STRING',
  BOOLEAN = 'BOOLEAN',
  OBJECT = 'OBJECT',
}

export type CategoryId = 'tech' | 'politics' | 'entertainment' | 'education' | 'life' | 'random';

export interface Category {
  id: CategoryId;
  name: string;
  emoji: string;
  description: string;
  color: string;
}

export const CATEGORIES: Category[] = [
  { id: 'tech', name: 'Technology', emoji: '💻', description: 'Coding, gadgets, and AI talk.', color: 'from-blue-600 to-cyan-500' },
  { id: 'politics', name: 'Politics', emoji: '⚖️', description: 'News, debate, and world events.', color: 'from-red-600 to-orange-500' },
  { id: 'entertainment', name: 'Entertainment', emoji: '🎬', description: 'Movies, music, and games.', color: 'from-purple-600 to-pink-500' },
  { id: 'education', name: 'Education', emoji: '📚', description: 'Learning, history, and science.', color: 'from-emerald-600 to-green-500' },
  { id: 'life', name: 'Personal / Life', emoji: '🌱', description: 'Advice, stories, and lifestyle.', color: 'from-yellow-600 to-amber-500' },
  { id: 'random', name: 'Random Chat', emoji: '🎲', description: 'Anything goes!', color: 'from-zinc-600 to-zinc-500' },
];
