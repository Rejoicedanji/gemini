import express from 'express'
import cors from 'cors'
import helmet from 'helmet'

import { config } from './config/env.js'
import { generalRateLimiter } from './middleware/rateLimit.middleware.js'
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js'

// Import routes
import chatRoutes from './routes/chat.routes.js'
import conversationRoutes from './routes/conversation.routes.js'
import searchRoutes from './routes/search.routes.js'
import authRoutes from './routes/auth.routes.js'

const app = express()

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}))

// CORS
app.use(cors({
  origin: config.clientUrl,
  credentials: true
}))

// Body parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Rate limiting
app.use(generalRateLimiter)

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  })
})

// API routes
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/chat', chatRoutes)
app.use('/api/v1/conversations', conversationRoutes)
app.use('/api/v1/search', searchRoutes)

// Error handling
app.use(notFoundHandler)
app.use(errorHandler)

export default app