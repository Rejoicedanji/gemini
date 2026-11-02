import { Request, Response, NextFunction } from 'express'
import { AuthenticatedRequest } from '../middleware/auth.middleware.js'
import { generateContent, generateStream, MessageAttachment } from '../services/gemini.service.js'
import { createSupabaseClient } from '../config/supabase.js'
import { config } from '../config/env.js'
import { AppError } from '../middleware/error.middleware.js'

interface ChatRequestBody {
  conversationId?: string
  message: string
  attachments?: MessageAttachment[]
}

export async function sendMessage(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { conversationId, message, attachments = [] } = req.body as ChatRequestBody
    const userId = req.user!.id

    if (!message || message.trim().length === 0) {
      throw new AppError('Message is required', 'INVALID_REQUEST', 400)
    }

    if (message.length > 10000) {
      throw new AppError('Message too long. Maximum 10,000 characters.', 'INVALID_REQUEST', 400)
    }

    const supabase = createSupabaseClient(req.headers.authorization!.split(' ')[1])

    let conversation: any = null
    let messages: any[] = []

    // Get or create conversation
    if (conversationId) {
      const { data: conv, error: convError } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .eq('user_id', userId)
        .single()

      if (convError || !conv) {
        throw new AppError('Conversation not found', 'NOT_FOUND', 404)
      }

      conversation = conv

      // Get previous messages
      const { data: msgs } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

      messages = msgs || []
    } else {
      // Create new conversation
      const { data: newConv, error: createError } = await supabase
        .from('conversations')
        .insert({
          user_id: userId,
          title: message.slice(0, 50) + (message.length > 50 ? '...' : ''),
          model_name: config.gemini.model
        })
        .select()
        .single()

      if (createError || !newConv) {
        throw new AppError('Failed to create conversation', 'CREATE_FAILED', 500)
      }

      conversation = newConv
    }

    // Save user message
    const { data: userMsg, error: msgError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversation.id,
        role: 'user',
        content: message,
        model_name: config.gemini.model
      })
      .select()
      .single()

    if (msgError || !userMsg) {
      throw new AppError('Failed to save message', 'CREATE_FAILED', 500)
    }

    // Build history for Gemini (limit to last 20 messages)
    const history = messages.slice(-20).map(m => ({
      role: m.role,
      content: m.content
    }))

    // Generate AI response
    const startTime = Date.now()
    const result = await generateContent(message, history, attachments)
    const latencyMs = Date.now() - startTime

    // Save assistant message
    const { data: assistantMsg, error: aiMsgError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversation.id,
        role: 'assistant',
        content: result.text,
        model_name: config.gemini.model,
        status: 'completed',
        input_tokens: result.usage?.inputTokens,
        output_tokens: result.usage?.outputTokens
      })
      .select()
      .single()

    if (aiMsgError || !assistantMsg) {
      throw new AppError('Failed to save AI response', 'CREATE_FAILED', 500)
    }

    // Update conversation
    await supabase
      .from('conversations')
      .update({
        title: conversation.title === 'New chat' ? message.slice(0, 50) + (message.length > 50 ? '...' : '') : conversation.title,
        updated_at: new Date().toISOString()
      })
      .eq('id', conversation.id)

    // Log usage
    await supabase
      .from('usage_logs')
      .insert({
        user_id: userId,
        conversation_id: conversation.id,
        model_name: config.gemini.model,
        request_status: 'success',
        input_tokens: result.usage?.inputTokens,
        output_tokens: result.usage?.outputTokens,
        latency_ms: latencyMs
      })

    return res.status(200).json({
      success: true,
      data: {
        conversationId: conversation.id,
        message: {
          id: assistantMsg.id,
          role: assistantMsg.role,
          content: assistantMsg.content,
          created_at: assistantMsg.created_at
        }
      }
    })
  } catch (error) {
    next(error)
  }
}

export async function streamMessage(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { conversationId } = req.query as { conversationId?: string }
    const message = req.query.message as string
    const userId = req.user!.id

    if (!message) {
      throw new AppError('Message is required', 'INVALID_REQUEST', 400)
    }

    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.setHeader('Transfer-Encoding', 'chunked')

    const supabase = createSupabaseClient(req.headers.authorization!.split(' ')[1])

    let conversation: any = null
    let messages: any[] = []

    // Get or create conversation
    if (conversationId) {
      const { data: conv, error: convError } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .eq('user_id', userId)
        .single()

      if (!convError && conv) {
        conversation = conv

        const { data: msgs } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true })

        messages = msgs || []
      }
    }

    if (!conversation) {
      const { data: newConv } = await supabase
        .from('conversations')
        .insert({
          user_id: userId,
          title: message.slice(0, 50) + (message.length > 50 ? '...' : ''),
          model_name: config.gemini.model
        })
        .select()
        .single()

      conversation = newConv
    }

    // Save user message
    await supabase.from('messages').insert({
      conversation_id: conversation.id,
      role: 'user',
      content: message,
      model_name: config.gemini.model
    })

    // Build history
    const history = messages.slice(-20).map(m => ({
      role: m.role,
      content: m.content
    }))

    // Stream response
    const stream = await generateStream(message, history)

    let fullResponse = ''

    for await (const chunk of stream) {
      fullResponse += chunk
      res.write(`data: ${JSON.stringify({ chunk })}\n\n`)
    }

    // Save assistant message
    await supabase.from('messages').insert({
      conversation_id: conversation.id,
      role: 'assistant',
      content: fullResponse,
      model_name: config.gemini.model,
      status: 'completed'
    })

    // Update conversation
    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversation.id)

    res.write(`data: ${JSON.stringify({ done: true, conversationId: conversation.id })}\n\n`)
    res.end()
  } catch (error) {
    console.error('Stream error:', error)
    res.write(`data: ${JSON.stringify({ error: error instanceof Error ? error.message : 'Stream failed' })}\n\n`)
    res.end()
  }
}

export async function regenerateMessage(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { id: messageId } = req.params
    const userId = req.user!.id

    const supabase = createSupabaseClient(req.headers.authorization!.split(' ')[1])

    // Get the message
    const { data: message, error: msgError } = await supabase
      .from('messages')
      .select(`
        *,
        conversations (*)
      `)
      .eq('id', messageId)
      .eq('role', 'assistant')
      .single()

    if (msgError || !message) {
      throw new AppError('Message not found', 'NOT_FOUND', 404)
    }

    if (message.conversations.user_id !== userId) {
      throw new AppError('Forbidden', 'FORBIDDEN', 403)
    }

    // Get conversation history
    const { data: messages } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', message.conversation_id)
      .order('created_at', { ascending: true })

    const history = (messages || [])
      .filter(m => m.id !== messageId)
      .slice(-20)
      .map(m => ({ role: m.role, content: m.content }))

    // Generate new response
    const lastUserMessage = messages?.findLast(m => m.role === 'user')
    if (!lastUserMessage) {
      throw new AppError('No user message to regenerate from', 'INVALID_REQUEST', 400)
    }

    const result = await generateContent(lastUserMessage.content, history)

    // Update message
    const { data: updatedMsg, error: updateError } = await supabase
      .from('messages')
      .update({
        content: result.text,
        status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', messageId)
      .select()
      .single()

    if (updateError || !updatedMsg) {
      throw new AppError('Failed to update message', 'UPDATE_FAILED', 500)
    }

    return res.status(200).json({
      success: true,
      data: {
        message: {
          id: updatedMsg.id,
          role: updatedMsg.role,
          content: updatedMsg.content,
          created_at: updatedMsg.created_at
        }
      }
    })
  } catch (error) {
    next(error)
  }
}

export async function submitFeedback(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { id: messageId } = req.params
    const { rating, comment } = req.body
    const userId = req.user!.id

    if (!rating || ![-1, 1].includes(rating)) {
      throw new AppError('Rating must be -1 or 1', 'INVALID_REQUEST', 400)
    }

    const supabase = createSupabaseClient(req.headers.authorization!.split(' ')[1])

    // Check if message exists and user has access
    const { data: message, error: msgError } = await supabase
      .from('messages')
      .select(`
        *,
        conversations (*)
      `)
      .eq('id', messageId)
      .single()

    if (msgError || !message) {
      throw new AppError('Message not found', 'NOT_FOUND', 404)
    }

    if (message.conversations.user_id !== userId) {
      throw new AppError('Forbidden', 'FORBIDDEN', 403)
    }

    // Upsert feedback
    const { data: feedback, error: fbError } = await supabase
      .from('feedback')
      .upsert({
        user_id: userId,
        message_id: messageId,
        rating,
        comment: comment || null,
        created_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,message_id'
      })
      .select()
      .single()

    if (fbError) {
      throw new AppError('Failed to submit feedback', 'CREATE_FAILED', 500)
    }

    return res.status(200).json({
      success: true,
      data: { feedback }
    })
  } catch (error) {
    next(error)
  }
}