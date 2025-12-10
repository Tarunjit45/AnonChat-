import { io, Socket } from 'socket.io-client';
import { Message, UserSession } from '../types';

// Default to localhost for development, can be changed for production
const BACKEND_URL = 'http://localhost:3001';

class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io(BACKEND_URL, {
      autoConnect: false,
      reconnection: true,
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('Connected to backend:', this.socket.id);
    });
    
    this.socket.on('connect_error', (err) => {
        console.error("Socket connection error:", err);
    });
  }

  /**
   * Connects to the backend server
   */
  connect() {
    if (!this.socket.connected) {
      this.socket.connect();
    }
  }

  /**
   * Joins a specific room and listens for history
   */
  joinRoom(roomId: string, callback: (messages: Message[], count: number) => void) {
    this.connect();
    this.socket.emit('join_room', roomId);

    // One-time listener for history when joining
    this.socket.once('chat_history', (messages: Message[]) => {
      // We don't have the count yet, it comes via 'online_count' event
      // We pass 0 initially, the subscription will update it immediately after
      callback(messages, 0); 
    });
  }

  /**
   * Leaves the current room
   */
  leaveRoom(roomId: string) {
    if (this.socket.connected) {
      this.socket.emit('leave_room', roomId);
    }
  }

  /**
   * Sends a message to the backend
   */
  async sendMessage(text: string, user: UserSession, roomId: string): Promise<void> {
    if (!this.socket.connected) {
        throw new Error("Not connected to server");
    }
    
    const payload = {
      text,
      username: user.username,
      senderId: user.id,
      roomId
    };
    
    this.socket.emit('send_message', payload);
  }

  /**
   * Subscribes to incoming new messages
   */
  subscribeToMessages(callback: (messages: Message[]) => void) {
    const handler = (message: Message) => {
      // The backend sends a single new message, but our frontend expects an array update or
      // we can adapt the frontend. To keep compatibility with the previous component structure,
      // we'll let the component handle appending, or we wrap it here.
      // However, the previous mock service returned the *full list*. 
      // The real backend emits *single* new messages. 
      // We need to adjust the callback signature in the component or adjust here.
      // Let's pass the single message and let the component append it.
      // WAIT: The mock service passed `Message[]`. 
      // To keep it simple for the component, we will pass the single message 
      // but type it as Message[] with one item for compatibility, 
      // OR better, we change the component to handle single updates.
      // Let's stick to passing the single message inside an array to minimize refactor.
      callback([message]);
    };

    this.socket.on('new_message', handler);
    return () => {
      this.socket.off('new_message', handler);
    };
  }

  /**
   * Subscribes to online user count updates
   */
  subscribeToOnlineCount(callback: (count: number) => void) {
    const handler = (count: number) => {
      callback(count);
    };

    this.socket.on('online_count', handler);
    return () => {
      this.socket.off('online_count', handler);
    };
  }
}

export const socketService = new SocketService();