import { io, Socket } from 'socket.io-client';
import { Message, UserSession } from '../types';

// LIVE BACKEND URL
const BACKEND_URL = 'https://anonchat-backend-wl7l.onrender.com';

class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io(BACKEND_URL, {
      autoConnect: false,
      reconnection: true,
      transports: ['websocket', 'polling'] // Prefer websocket
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
      // We pass 0 count initially; it will be updated by the subscription event immediately after
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
      // The backend emits single messages. We wrap in array for component compatibility.
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