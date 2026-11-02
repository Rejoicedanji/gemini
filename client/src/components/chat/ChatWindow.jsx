import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import MessageList from './MessageList'
import MessageComposer from './MessageComposer'
import WelcomeScreen from './WelcomeScreen'
import LoadingSpinner from '../common/LoadingSpinner'

export default function ChatWindow() {
  const { conversationId } = useParams()
  const navigate = useNavigate()
  const { supabase, useDemoFallback, createDemoConversation, getDemoConversation, getDemoMessages, addDemoMessage, demoAssistantReply, updateDemoConversation, deleteDemoConversation } = useAuth()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [conversation, setConversation] = useState(null)
  const [pendingPrompt, setPendingPrompt] = useState(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (conversationId) {
      loadConversation()
      loadMessages()
    } else {
      setMessages([])
      setConversation(null)
    }
  }, [conversationId])

  const getSessionToken = async () => {
    if (useDemoFallback) return null
    const { data: { session } } = await supabase.auth.getSession()
    return session?.access_token || null
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (!conversationId || !pendingPrompt) return

    const promptToSend = pendingPrompt
    setPendingPrompt(null)
    handleSendMessage(promptToSend)
  }, [conversationId, pendingPrompt])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadConversation = async () => {
    try {
      if (useDemoFallback) {
        setConversation(getDemoConversation(conversationId) || null)
        return
      }

      const token = await getSessionToken()
      const response = await fetch(`/api/v1/conversations/${conversationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const result = await response.json()
        setConversation(result.data)
      }
    } catch (error) {
      console.error('Failed to load conversation:', error)
    }
  }

  const loadMessages = async () => {
    setLoading(true)
    try {
      if (useDemoFallback) {
        setMessages(getDemoMessages(conversationId) || [])
        return
      }

      const token = await getSessionToken()
      const response = await fetch(`/api/v1/conversations/${conversationId}/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const result = await response.json()
        setMessages(result.data || [])
      }
    } catch (error) {
      console.error('Failed to load messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async (message, attachments = []) => {
    if (!message.trim() && attachments.length === 0) return

    let targetConversationId = conversationId

    if (!conversationId) {
      try {
        if (useDemoFallback) {
          const newConversation = createDemoConversation(message.slice(0, 50) + (message.length > 50 ? '...' : ''))
          navigate(`/chat/${newConversation.id}`)
          setPendingPrompt(message)
          return
        }

        const token = await getSessionToken()
        if (!token) throw new Error('You are signed out. Please sign in again.')
        const response = await fetch('/api/v1/conversations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ title: message.slice(0, 50) + '...' })
        })
        if (response.ok) {
          const result = await response.json()
          targetConversationId = result.data.id
        } else {
          const result = await response.json()
          throw new Error(result.error?.message || 'Failed to create conversation')
        }
      } catch (error) {
        console.error('Failed to create conversation:', error)
        return
      }
    }

    setSending(true)

    try {
      if (useDemoFallback) {
        const timestamp = Date.now()
        const userMessage = {
          id: `demo-user-${timestamp}`,
          role: 'user',
          content: message,
          created_at: new Date().toISOString()
        }
        const assistantReply = demoAssistantReply(message)
        const assistantMessage = {
          id: `demo-assistant-${timestamp}`,
          role: 'assistant',
          content: assistantReply,
          created_at: new Date().toISOString()
        }

        addDemoMessage(targetConversationId, userMessage)
        addDemoMessage(targetConversationId, assistantMessage)
        setMessages(prev => [...prev, userMessage, assistantMessage])
        updateDemoConversation(targetConversationId, { title: message.slice(0, 40) + (message.length > 40 ? '...' : '') })
        if (!conversationId) navigate(`/chat/${targetConversationId}`)

        return
      }

      const token = await getSessionToken()
      if (!token) throw new Error('You are signed out. Please sign in again.')
      const userMessage = {
        id: `pending-${Date.now()}`,
        role: 'user',
        content: message,
        created_at: new Date().toISOString()
      }
      setMessages(prev => [...prev, userMessage])

      const response = await fetch('/api/v1/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          conversationId: targetConversationId,
          message,
          attachments: attachments.map(a => ({
            fileName: a.name,
            fileType: a.type,
            data: a.data // base64 encoded
          }))
        })
      })

      const result = await response.json()
      if (response.ok) {
        const assistantMessage = {
          id: result.data.message.id,
          role: 'assistant',
          content: result.data.message.content,
          created_at: new Date().toISOString()
        }
        setMessages(prev => [...prev, assistantMessage])
        if (!conversationId) navigate(`/chat/${targetConversationId}`)
      } else {
        const errorMessage = {
          id: Date.now().toString(),
          role: 'assistant',
          content: `Error: ${result.error?.message || 'Failed to generate response'}`,
          status: 'failed',
          created_at: new Date().toISOString()
        }
        setMessages(prev => [...prev, errorMessage])
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      const errorMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: error instanceof Error ? error.message : 'Failed to connect to the server. Please try again.',
        status: 'failed',
        created_at: new Date().toISOString()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setSending(false)
    }
  }

  const handleStopGeneration = () => {
    setSending(false)
  }

  const handleNewChat = async (initialPrompt = null) => {
    try {
      if (useDemoFallback) {
        const newConversation = createDemoConversation(initialPrompt ? initialPrompt.slice(0, 50) + (initialPrompt.length > 50 ? '...' : '') : 'New chat')
        if (initialPrompt) {
          setPendingPrompt(initialPrompt)
        }
        navigate(`/chat/${newConversation.id}`)
        return
      }

      const token = await getSessionToken()
      const response = await fetch('/api/v1/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: initialPrompt ? initialPrompt.slice(0, 50) + (initialPrompt.length > 50 ? '...' : '') : 'New chat'
        })
      })
      if (response.ok) {
        const result = await response.json()
        const newConversationId = result.data.id

        if (initialPrompt) {
          setPendingPrompt(initialPrompt)
        }

        navigate(`/chat/${newConversationId}`)
      }
    } catch (error) {
      console.error('Failed to create conversation:', error)
    }
  }

  const handlePromptSelect = async (prompt) => {
    if (!prompt?.trim()) return

    setPendingPrompt(prompt)

    if (!conversationId) {
      await handleNewChat(prompt)
    }
  }

  if (!conversationId) {
    return (
      <div className="flex flex-col h-full">
        <WelcomeScreen onNewChat={handleNewChat} onPromptSelect={handlePromptSelect} />
        <MessageComposer onSend={handleSendMessage} disabled={false} />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <LoadingSpinner size="large" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <WelcomeScreen onNewChat={handleNewChat} />
          </div>
        ) : (
          <MessageList messages={messages} onRetry={loadMessages} />
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Composer */}
      <div className="border-t border-[var(--color-border)]">
        <MessageComposer 
          onSend={handleSendMessage} 
          disabled={sending}
          onStop={handleStopGeneration}
          isGenerating={sending}
        />
      </div>
    </div>
  )
}