# Gemini AI Assistant

A full-stack AI chat application powered by Google's Gemini API, built with React, TypeScript, Node.js, and Supabase.

## Features

- 💬 Intelligent AI conversations
- 🎨 Modern, responsive UI with dark mode
- 📱 Mobile-friendly design
- 🔐 Secure authentication with Supabase
- 💾 Conversation history persistence
- 🖼️ Image upload and analysis support
- 📝 Markdown and code syntax highlighting
- 🔄 Streaming responses

## Tech Stack

### Frontend
- React 18 with Vite
- Tailwind CSS
- React Router
- React Markdown
- Supabase Client

### Backend
- Node.js with Express
- TypeScript
- @google/genai SDK
- Supabase Admin

### Database
- PostgreSQL (via Supabase)
- Row Level Security (RLS)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Google Gemini API key

### Supabase Setup

1. Create a new Supabase project
2. Run the database migrations:
   ```bash
   # Copy the SQL from database/migrations/001_initial_schema.sql
   # and run it in the Supabase SQL Editor
   ```

### Backend Setup

```bash
cd server
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your credentials
# - GEMINI_API_KEY (get from https://aistudio.google.com/)
# - SUPABASE_URL and SUPABASE_ANON_KEY (from Supabase project settings)
# - SUPABASE_SERVICE_ROLE_KEY (from Supabase > Settings > API)

# Start development server
npm run dev
```

### Frontend Setup

```bash
cd client
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your Supabase credentials

# Start development server
npm run dev
```

### Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api/v1

## Project Structure

```
gemini-ai/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── layout/     # Layout components
│   │   │   ├── chat/       # Chat components
│   │   │   └── common/     # Shared components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React contexts
│   │   ├── services/       # API services
│   │   └── hooks/          # Custom hooks
│   └── ...
├── server/                 # Express backend
│   ├── src/
│   │   ├── config/         # Configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utilities
│   └── ...
├── database/               # Database files
│   └── migrations/         # SQL migrations
└── README.md
```

## API Endpoints

### Authentication
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/logout` - Sign out

### Chat
- `POST /api/v1/chat` - Send message
- `POST /api/v1/chat/stream` - Stream response
- `POST /api/v1/chat/:id/regenerate` - Regenerate response
- `POST /api/v1/chat/:id/feedback` - Submit feedback

### Conversations
- `GET /api/v1/conversations` - List conversations
- `POST /api/v1/conversations` - Create conversation
- `GET /api/v1/conversations/:id` - Get conversation
- `PATCH /api/v1/conversations/:id` - Update conversation
- `DELETE /api/v1/conversations/:id` - Delete conversation
- `GET /api/v1/conversations/:id/messages` - Get messages

### Search
- `GET /api/v1/search?q=query` - Search conversations

## Deployment

### Frontend (Vercel/Netlify)
1. Connect your repository
2. Set environment variables
3. Deploy

### Backend (Render/Railway)
1. Connect your repository
2. Set environment variables
3. Deploy

### Database (Supabase)
- Already configured with the schema

## Environment Variables

### Server (.env)
```env
PORT=3000
NODE_ENV=development
GEMINI_API_KEY=your_api_key
GEMINI_MODEL=gemini-1.5-flash
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
CLIENT_URL=http://localhost:5173
```

### Client (.env)
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## License

MIT