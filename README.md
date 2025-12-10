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

## How to Run

### Frontend
This app is currently configured to connect to a live backend on Render.
1. Open `index.html` with a live server (e.g. VS Code Live Server) or run via a bundler.
2. The app will automatically connect to `https://anonchat-backend-wl7l.onrender.com`.

### Backend
The backend is deployed, but if you want to run it locally:
1. Navigate to `backend/`.
2. `npm install`
3. `node server.js`
4. Update `services/socketService.ts` to `http://localhost:3001`.

## Deployment Guide

### Backend (Render / Railway)
1. Create a new repository for the `backend/` folder contents (`server.js` + `package.json`).
2. Deploy to a Node.js service (e.g., Render, Railway, Heroku).

### Frontend (Vercel / Netlify)
1. In `services/socketService.ts`, change `BACKEND_URL` to your deployed backend URL.
2. Deploy the frontend code to Vercel or Netlify.
3. Add your `API_KEY` (Gemini) in the hosting provider's environment variables.
