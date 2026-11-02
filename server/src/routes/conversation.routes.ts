import { Router } from 'express'
import { authenticate } from '../middleware/auth.middleware.js'
import {
  listConversations,
  createConversation,
  getConversation,
  updateConversation,
  deleteConversation,
  getMessages,
  archiveConversation,
  listArchivedConversations,
  restoreConversation
} from '../controllers/conversation.controller.js'

const router = Router()

// All routes require authentication
router.use(authenticate)

// Conversation CRUD
router.get('/', listConversations)
router.post('/', createConversation)
router.get('/:id', getConversation)
router.patch('/:id', updateConversation)
router.delete('/:id', deleteConversation)

// Messages
router.get('/:id/messages', getMessages)

// Archive operations
router.get('/archive/list', listArchivedConversations)
router.post('/:id/archive', archiveConversation)
router.post('/:id/restore', restoreConversation)

export default router