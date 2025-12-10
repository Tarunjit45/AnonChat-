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
  code: string;
  description: string;
  hexColor: string;
}

export const CATEGORIES: Category[] = [
  { id: 'tech', name: 'Technology', code: 'NODE_01', description: 'AI, Cybersec, Crypto', hexColor: '#00ff41' },
  { id: 'politics', name: 'Politics', code: 'NODE_02', description: 'Global Affairs, Policies', hexColor: '#ff003c' },
  { id: 'entertainment', name: 'Entertainment', code: 'NODE_03', description: 'Media, Arts, Games', hexColor: '#d600ff' },
  { id: 'education', name: 'Education', code: 'NODE_04', description: 'Knowledge Base, Research', hexColor: '#00eaff' },
  { id: 'life', name: 'Life / Advice', code: 'NODE_05', description: 'Human Protocols, Support', hexColor: '#ffbf00' },
  { id: 'random', name: 'Random Uplink', code: 'NODE_06', description: 'Unstructured Data Stream', hexColor: '#ffffff' },
];