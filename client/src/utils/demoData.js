const DEMO_USER_KEY = 'rejoice-demo-user'
const DEMO_CONVERSATIONS_KEY = 'rejoice-demo-conversations'
const DEMO_MESSAGES_KEY = 'rejoice-demo-messages'

const defaultUser = {
  id: 'demo-user',
  email: 'demo@rejoice.ai',
  user_metadata: {
    display_name: 'Demo User'
  }
}

function safeJsonParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback
  } catch (error) {
    return fallback
  }
}

export function isDemoMode() {
  return Boolean(localStorage.getItem(DEMO_USER_KEY))
}

export function getDemoUser() {
  const stored = safeJsonParse(localStorage.getItem(DEMO_USER_KEY), null)
  return stored || defaultUser
}

export function setDemoUser(user = defaultUser) {
  localStorage.setItem(DEMO_USER_KEY, JSON.stringify(user))
}

export function clearDemoUser() {
  localStorage.removeItem(DEMO_USER_KEY)
}

export function getDemoConversations() {
  return safeJsonParse(localStorage.getItem(DEMO_CONVERSATIONS_KEY), [])
}

export function setDemoConversations(conversations) {
  localStorage.setItem(DEMO_CONVERSATIONS_KEY, JSON.stringify(conversations))
}

export function getDemoMessages(conversationId) {
  const map = safeJsonParse(localStorage.getItem(DEMO_MESSAGES_KEY), {})
  return map[conversationId] || []
}

export function setDemoMessages(conversationId, messages) {
  const map = safeJsonParse(localStorage.getItem(DEMO_MESSAGES_KEY), {})
  map[conversationId] = messages
  localStorage.setItem(DEMO_MESSAGES_KEY, JSON.stringify(map))
}

export function createDemoConversation(title = 'New chat') {
  const conversations = getDemoConversations()
  const conversation = {
    id: `demo-${Date.now()}`,
    title: title || 'New chat',
    user_id: 'demo-user',
    model_name: 'gemini-demo',
    is_archived: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }

  setDemoConversations([conversation, ...conversations])
  setDemoMessages(conversation.id, [])

  return conversation
}

export function updateDemoConversation(conversationId, updates) {
  const conversations = getDemoConversations().map((conversation) =>
    conversation.id === conversationId ? { ...conversation, ...updates, updated_at: new Date().toISOString() } : conversation
  )

  setDemoConversations(conversations)
  return conversations.find((conversation) => conversation.id === conversationId)
}

export function deleteDemoConversation(conversationId) {
  const conversations = getDemoConversations().filter((conversation) => conversation.id !== conversationId)
  const messages = safeJsonParse(localStorage.getItem(DEMO_MESSAGES_KEY), {})
  delete messages[conversationId]
  localStorage.setItem(DEMO_MESSAGES_KEY, JSON.stringify(messages))
  setDemoConversations(conversations)
}

export function getDemoConversation(conversationId) {
  return getDemoConversations().find((conversation) => conversation.id === conversationId)
}

export function addDemoMessage(conversationId, message) {
  const messages = getDemoMessages(conversationId)
  const enhanced = [...messages, message]
  setDemoMessages(conversationId, enhanced)

  const conversations = getDemoConversations().map((conversation) =>
    conversation.id === conversationId
      ? { ...conversation, updated_at: new Date().toISOString() }
      : conversation
  )
  setDemoConversations(conversations)

  return enhanced
}

export function demoAssistantReply(prompt) {
  const normalized = String(prompt || '').trim()

  if (!normalized) {
    return 'I’m ready when you are. Ask me anything.'
  }

  if (/code|write|script|function|react|python|javascript/i.test(normalized)) {
    return `Here’s a clean starting point for that idea:\n\n\`\`\`\n${normalized.length > 80 ? normalized.slice(0, 80) + '...' : normalized}\n\`\`\`\n\nThis is a demo response so you can preview the experience without email-based signup. You can replace it with your real Gemini logic later.`
  }

  if (/explain|what is|how does/i.test(normalized)) {
    return `In simple terms: ${normalized} is a great prompt for an AI assistant. The key idea is to break the problem into context, constraints, and desired outcome, then ask for a clear answer or plan.`
  }

  return `Here’s a polished response to: “${normalized}”\n\nI can help with brainstorming, coding, summarizing, analysis, and creating clear next steps. This demo mode is intentionally simple so you can use the product without signup email limits.`
}
