import { Request, Response, NextFunction } from 'express'
import { AuthenticatedRequest } from '../middleware/auth.middleware.js'
import { createSupabaseClient } from '../config/supabase.js'

interface ConversationUpdateBody {
  title?: string
  is_archived?: boolean
}

// List conversations
export async function listConversations(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!.id
    const { page = 1, limit = 20 } = req.query

    const supabase = createSupabaseClient(req.headers.authorization!.split(' ')[1])

    const from = (Number(page) - 1) * Number(limit)
    const to = from + Number(limit) - 1

    const { data: conversations, error, count } = await supabase
      .from('conversations')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .eq('is_archived', false)
      .order('updated_at', { ascending: false })
      .range(from, to)

    if (error) {
      throw error
    }

    return res.status(200).json({
      success: true,
      data: conversations || [],
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count || 0,
        totalPages: Math.ceil((count || 0) / Number(limit))
      }
    })
  } catch (error) {
    next(error)
  }
}

// Create conversation
export async function createConversation(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!.id
    const { title = 'New chat' } = req.body as { title?: string }

    const supabase = createSupabaseClient(req.headers.authorization!.split(' ')[1])

    const { data: conversation, error } = await supabase
      .from('conversations')
      .insert({
        user_id: userId,
        title,
        model_name: process.env.GEMINI_MODEL || 'gemini-1.5-flash'
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return res.status(201).json({
      success: true,
      data: conversation
    })
  } catch (error) {
    next(error)
  }
}

// Get single conversation
export async function getConversation(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params
    const userId = req.user!.id

    const supabase = createSupabaseClient(req.headers.authorization!.split(' ')[1])

    const { data: conversation, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (error || !conversation) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Conversation not found'
        }
      })
    }

    return res.status(200).json({
      success: true,
      data: conversation
    })
  } catch (error) {
    next(error)
  }
}

// Update conversation
export async function updateConversation(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params
    const updates = req.body as ConversationUpdateBody
    const userId = req.user!.id

    const supabase = createSupabaseClient(req.headers.authorization!.split(' ')[1])

    // Verify ownership
    const { data: existing, error: findError } = await supabase
      .from('conversations')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (findError || !existing) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Conversation not found'
        }
      })
    }

    const { data: conversation, error } = await supabase
      .from('conversations')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return res.status(200).json({
      success: true,
      data: conversation
    })
  } catch (error) {
    next(error)
  }
}

// Delete conversation
export async function deleteConversation(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params
    const userId = req.user!.id

    const supabase = createSupabaseClient(req.headers.authorization!.split(' ')[1])

    // Verify ownership and delete
    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      throw error
    }

    return res.status(200).json({
      success: true,
      message: 'Conversation deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}

// Get messages for a conversation
export async function getMessages(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params
    const userId = req.user!.id

    const supabase = createSupabaseClient(req.headers.authorization!.split(' ')[1])

    // Verify conversation ownership
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (convError || !conversation) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Conversation not found'
        }
      })
    }

    // Get messages
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', id)
      .order('created_at', { ascending: true })

    if (error) {
      throw error
    }

    return res.status(200).json({
      success: true,
      data: messages || []
    })
  } catch (error) {
    next(error)
  }
}

// Archive conversation
export async function archiveConversation(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params
    const userId = req.user!.id

    const supabase = createSupabaseClient(req.headers.authorization!.split(' ')[1])

    const { error } = await supabase
      .from('conversations')
      .update({
        is_archived: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      throw error
    }

    return res.status(200).json({
      success: true,
      message: 'Conversation archived successfully'
    })
  } catch (error) {
    next(error)
  }
}

// List archived conversations
export async function listArchivedConversations(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!.id
    const { page = 1, limit = 20 } = req.query

    const supabase = createSupabaseClient(req.headers.authorization!.split(' ')[1])

    const from = (Number(page) - 1) * Number(limit)
    const to = from + Number(limit) - 1

    const { data: conversations, error, count } = await supabase
      .from('conversations')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .eq('is_archived', true)
      .order('updated_at', { ascending: false })
      .range(from, to)

    if (error) {
      throw error
    }

    return res.status(200).json({
      success: true,
      data: conversations || [],
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count || 0,
        totalPages: Math.ceil((count || 0) / Number(limit))
      }
    })
  } catch (error) {
    next(error)
  }
}

// Restore archived conversation
export async function restoreConversation(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params
    const userId = req.user!.id

    const supabase = createSupabaseClient(req.headers.authorization!.split(' ')[1])

    const { error } = await supabase
      .from('conversations')
      .update({
        is_archived: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', userId)
      .eq('is_archived', true)

    if (error) {
      throw error
    }

    return res.status(200).json({
      success: true,
      message: 'Conversation restored successfully'
    })
  } catch (error) {
    next(error)
  }
}