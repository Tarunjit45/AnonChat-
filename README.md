# AnonChat - Anonymous Community Chat

A secure, anonymous chat application with 24-hour message retention and AI moderation.

## Folder Structure

```
/
├── index.html          # Entry HTML (Frontend)
├── index.tsx           # React Entry
├── App.tsx             # Main Logic
├── types.ts            # Interfaces
├── components/         # UI Components
│   ├── ChatRoom.tsx
│   ├── MessageBubble.tsx
│   └── Header.tsx
├── services/
│   ├── geminiService.ts # AI Moderation
│   └── socketService.ts # Real WebSocket Client
└── backend/            # Backend Server Code
    └── server.js       # Node.js + Socket.io implementation
```

## How to Run (Local Development)

To make the chat work for real users, you need to run the **Backend** separately from the **Frontend**.

### 1. Start the Backend
The backend handles the chat rooms and message broadcasting.

1. Open a terminal and navigate to the `backend` folder.
2. Initialize and install dependencies:
   ```bash
   npm init -y
   npm install express socket.io cors
   ```
3. Start the server:
   ```bash
   node server.js
   ```
   *You should see: "Server running on port 3001"*

### 2. Start the Frontend
The frontend is the UI you see in the browser.

1. Open a new terminal in the project root.
2. If you are using a simple static server (like Live Server):
   - Open `index.html`.
3. If you are using a bundler (Vite/CRA):
   - Run `npm install` and `npm start` (or `npm run dev`).

**Note:** By default, the frontend tries to connect to `http://localhost:3001`. If you deploy the backend remotely, update `BACKEND_URL` in `services/socketService.ts`.

## Deployment Guide

### Backend (Render / Railway)
1. Create a new repository for the `backend/` folder contents (`server.js` + `package.json`).
2. Deploy to a Node.js service (e.g., Render, Railway, Heroku).
3. Copy the **Deployment URL** (e.g., `https://my-anon-chat.onrender.com`).

### Frontend (Vercel / Netlify)
1. In `services/socketService.ts`, change `BACKEND_URL` to your deployed backend URL.
2. Deploy the frontend code to Vercel or Netlify.
3. Add your `API_KEY` (Gemini) in the hosting provider's environment variables.
