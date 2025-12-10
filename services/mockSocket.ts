import { Message, UserSession, CategoryId } from '../types';

/**
 * This service simulates the Socket.io backend behavior for the frontend-only demo.
 * In a real deployment, this would be replaced by actual `socket.io-client` logic.
 */

class MockSocketService {
  private subscribers: ((messages: Message[]) => void)[] = [];
  private countSubscribers: ((count: number) => void)[] = [];
  
  // Storage per room
  private roomMessages: Record<string, Message[]> = {};
  private roomCounts: Record<string, number> = {};
  
  private currentRoomId: string | null = null;
  private intervalId: any = null;
  private countIntervalId: any = null;

  constructor() {
    // Initialize empty storage for simulated rooms
    ['tech', 'politics', 'entertainment', 'education', 'life', 'random'].forEach(id => {
      this.roomMessages[id] = [
        {
          id: `init-${id}`,
          senderId: 'system',
          username: 'System',
          text: `Welcome to the ${id} channel. Messages expire in 24h.`,
          timestamp: Date.now() - 100000,
          isSystem: true,
          roomId: id
        }
      ];
      this.roomCounts[id] = Math.floor(Math.random() * 20) + 2;
    });

    // Simulate incoming messages globally (but only delivered to active room)
    this.intervalId = setInterval(() => {
        this.simulateIncomingMessage();
    }, 8000);

    // Simulate online count fluctuation
    this.countIntervalId = setInterval(() => {
        if (this.currentRoomId) {
          const current = this.roomCounts[this.currentRoomId];
          const change = Math.random() > 0.5 ? 1 : -1;
          this.roomCounts[this.currentRoomId] = Math.max(1, current + change);
          this.notifyCount();
        }
    }, 4000);
  }

  // --- Connection Methods ---

  joinRoom(roomId: string, callback: (messages: Message[], count: number) => void) {
    this.currentRoomId = roomId;
    
    // Initial data for this room
    const msgs = this.roomMessages[roomId] || [];
    const count = this.roomCounts[roomId] || 0;
    
    callback(msgs, count);
  }

  leaveRoom() {
    this.currentRoomId = null;
    // In a real socket, we would emit('leave_room') here
  }

  // --- Subscription Methods ---

  subscribeToMessages(callback: (messages: Message[]) => void) {
    this.subscribers.push(callback);
    // Send current room data immediately if joined
    if (this.currentRoomId && this.roomMessages[this.currentRoomId]) {
      callback(this.roomMessages[this.currentRoomId]);
    }
    return () => {
      this.subscribers = this.subscribers.filter(s => s !== callback);
    };
  }

  subscribeToOnlineCount(callback: (count: number) => void) {
    this.countSubscribers.push(callback);
    if (this.currentRoomId && this.roomCounts[this.currentRoomId]) {
      callback(this.roomCounts[this.currentRoomId]);
    }
    return () => {
      this.countSubscribers = this.countSubscribers.filter(s => s !== callback);
    };
  }

  // --- Action Methods ---

  async sendMessage(text: string, user: UserSession, roomId: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newMessage: Message = {
          id: Date.now().toString(),
          senderId: user.id,
          username: user.username,
          text: text,
          timestamp: Date.now(),
          roomId: roomId
        };

        if (!this.roomMessages[roomId]) {
          this.roomMessages[roomId] = [];
        }
        
        this.roomMessages[roomId] = [...this.roomMessages[roomId], newMessage];
        
        // Only notify if we are currently looking at this room
        if (this.currentRoomId === roomId) {
          this.notifyMessages();
        }
        resolve();
      }, 200); // Small network latency
    });
  }

  // --- Internal Simulation Logic ---

  private notifyMessages() {
    if (!this.currentRoomId) return;
    const msgs = this.roomMessages[this.currentRoomId];
    this.subscribers.forEach(cb => cb(msgs));
  }

  private notifyCount() {
    if (!this.currentRoomId) return;
    const count = this.roomCounts[this.currentRoomId];
    this.countSubscribers.forEach(cb => cb(count));
  }

  private simulateIncomingMessage() {
    if (!this.currentRoomId) return;
    
    // 30% chance to receive a message in the current room
    if (Math.random() > 0.3) return;

    const roomId = this.currentRoomId;
    const randomUser = `User-${Math.floor(Math.random() * 9000) + 1000}`;
    const phrases = [
      "Interesting point.",
      "I agree with that.",
      "What do you think about the recent news?",
      "Has anyone seen the latest update?",
      "This topic is quite complex.",
      "lol true",
      "Anyone here from Europe?",
      "I love this anonymous vibe."
    ];
    const text = phrases[Math.floor(Math.random() * phrases.length)];
    
    const msg: Message = {
        id: Date.now().toString(),
        senderId: 'simulated-id',
        username: randomUser,
        text,
        timestamp: Date.now(),
        roomId: roomId
    };
    
    this.roomMessages[roomId] = [...this.roomMessages[roomId], msg];
    this.notifyMessages();
  }
}

export const socketService = new MockSocketService();
