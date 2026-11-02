import { Router } from 'express'
import { authenticate } from '../middleware/auth.middleware.js'
import { createSupabaseClient } from '../config/supabase.js'

const router = Router()

// Search conversations
router.get('/', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.id
    const { q } = req.query

    if (!q || typeof q !== 'string') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_REQUEST',
          message: 'Search query is required'
        }
      })
    }

    const supabase = createSupabaseClient(req.headers.authorization!.split(' ')[1])

    // Search in conversation titles
    const { data: conversations, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', userId)
      .ilike('title', `%${q}%`)
      .order('updated_at', { ascending: false })
      .limit(20)

    if (error) {
      throw error
    }

    // Also search in messages
    const { data: messages, error: msgError } = await supabase
      .from('messages')
      .select(`
        *,
        conversations!inner (id, user_id)
      `)
      .eq('conversations.user_id', userId)
      .ilike('content', `%${q}%`)
      .order('created_at', { ascending: false })
      .limit(50)

    if (msgError) {
      throw msgError
    }

    // Group messages by conversation
    const conversationIds = new Set<string>()
    const messageResults: Array<{ conversationId: string; message: any }> = []

    for (const msg of messages || []) {
      if (!conversationIds.has(msg.conversations.id)) {
        conversationIds.add(msg.conversations.id)
        messageResults.push({
          conversationId: msg.conversations.id,
          message: {
            id: msg.id,
            content: msg.content.slice(0, 200) + (msg.content.length > 200 ? '...' : ''),
            role: msg.role,
            created_at: msg.created_at
          }
        })
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        conversations: conversations || [],
        messages: messageResults
      }
    })
  } catch (error) {
    next(error)
  }
})

export default router