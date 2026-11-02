import { Router } from 'express'
import { authenticate } from '../middleware/auth.middleware.js'
import { sendMessage, streamMessage, regenerateMessage, submitFeedback } from '../controllers/chat.controller.js'
import { chatRateLimiter } from '../middleware/rateLimit.middleware.js'

const router = Router()

// All routes require authentication
router.use(authenticate)

// Chat endpoints
router.post('/', chatRateLimiter, sendMessage)
router.post('/stream', chatRateLimiter, streamMessage)
router.post('/:id/regenerate', chatRateLimiter, regenerateMessage)
router.post('/:id/feedback', chatRateLimiter, submitFeedback)

export default router