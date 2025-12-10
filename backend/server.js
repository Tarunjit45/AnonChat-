/**
 * BACKEND SERVER CODE
 * 
 * To run this:
 * 1. Create a folder named `backend` (if not exists)
 * 2. Save this file as `backend/server.js`
 * 3. Open terminal in `backend` folder
 * 4. Run: npm install express socket.io cors
 * 5. Run: node server.js
 */

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for simplicity in this demo. Restrict in production.
    methods: ["GET", "POST"]
  }
});

// In-memory storage for multiple rooms
// Structure: { roomId: Message[] }
const roomMessages = {};

// Valid categories to prevent spam rooms
const VALID_ROOMS = ['tech', 'politics', 'entertainment', 'education', 'life', 'random'];

const MESSAGE_TTL = 24 * 60 * 60 * 1000; // 24 Hours

// Initialize storage
VALID_ROOMS.forEach(room => {
  roomMessages[room] = [];
});

// Clean up old messages every minute
setInterval(() => {
  const now = Date.now();
  let cleanedCount = 0;
  VALID_ROOMS.forEach(room => {
    if (roomMessages[room]) {
      const initialLen = roomMessages[room].length;
      roomMessages[room] = roomMessages[room].filter(msg => now - msg.timestamp < MESSAGE_TTL);
      cleanedCount += (initialLen - roomMessages[room].length);
    }
  });
  if (cleanedCount > 0) console.log(`Cleaned ${cleanedCount} expired messages.`);
}, 60 * 1000);

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('join_room', (roomId) => {
    if (!VALID_ROOMS.includes(roomId)) return;

    // Leave other rooms first
    socket.rooms.forEach(r => {
      if (r !== socket.id) socket.leave(r);
    });

    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);

    // Send history for this room
    // Filter expired one last time before sending
    const now = Date.now();
    const history = (roomMessages[roomId] || []).filter(msg => now - msg.timestamp < MESSAGE_TTL);
    socket.emit('chat_history', history);

    // Broadcast user count for this room to everyone (including sender)
    const roomSize = io.sockets.adapter.rooms.get(roomId)?.size || 0;
    io.to(roomId).emit('online_count', roomSize);
  });

  socket.on('leave_room', (roomId) => {
    socket.leave(roomId);
    console.log(`User ${socket.id} left room ${roomId}`);
    const roomSize = io.sockets.adapter.rooms.get(roomId)?.size || 0;
    io.to(roomId).emit('online_count', roomSize);
  });

  socket.on('send_message', (data) => {
    // Data expected: { text, username, senderId, roomId }
    const { roomId, text, username, senderId } = data;
    
    if (!VALID_ROOMS.includes(roomId)) return;

    const newMessage = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      text,
      username,
      senderId,
      roomId,
      timestamp: Date.now()
    };

    if (!roomMessages[roomId]) roomMessages[roomId] = [];
    roomMessages[roomId].push(newMessage);
    
    // Broadcast single new message to specific room
    io.to(roomId).emit('new_message', newMessage);
  });

  socket.on('disconnecting', () => {
    // Notify rooms that user is leaving before they actually leave
    for (const room of socket.rooms) {
      if (VALID_ROOMS.includes(room)) {
        const currentSize = io.sockets.adapter.rooms.get(room)?.size || 1;
        // The user is still in the room count, so we subtract 1
        io.to(room).emit('online_count', Math.max(0, currentSize - 1));
      }
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});