const API_BASE = '/api/v1'

export function createApiClient(supabase) {
  async function getAccessToken() {
    if (!supabase) {
      throw new Error('Supabase authentication is not configured')
    }

    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    if (!session?.access_token) {
      throw new Error('You are signed out. Please sign in again.')
    }

    return session.access_token
  }

  async function fetchWithAuth(url, options = {}) {
    const token = await getAccessToken()
    const headers = new Headers(options.headers)
    headers.set('Authorization', `Bearer ${token}`)

    if (options.body && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json')
    }

    const response = await fetch(`${API_BASE}${url}`, {
      ...options,
      headers
    })
    const body = await response.text()
    const data = body ? JSON.parse(body) : null

    if (!response.ok) {
      throw new Error(data?.error?.message || 'An error occurred')
    }

    return data
  }

  const chatAPI = {
    sendMessage: (conversationId, message, attachments = []) =>
      fetchWithAuth('/chat', {
        method: 'POST',
        body: JSON.stringify({ conversationId, message, attachments })
      }),

    streamMessage: async (conversationId, message, signal) => {
      const params = new URLSearchParams({ message })
      if (conversationId) params.set('conversationId', conversationId)

      const token = await getAccessToken()
      const response = await fetch(`${API_BASE}/chat/stream?${params}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        signal
      })

      if (!response.ok) {
        const body = await response.text()
        let data
        try {
          data = body ? JSON.parse(body) : null
        } catch {
          throw new Error(body || 'Failed to start response stream')
        }
        throw new Error(data?.error?.message || 'Failed to start response stream')
      }

      return response
    },

    regenerate: (messageId) =>
      fetchWithAuth(`/chat/${messageId}/regenerate`, { method: 'POST' }),

    submitFeedback: (messageId, rating, comment) =>
      fetchWithAuth(`/chat/${messageId}/feedback`, {
        method: 'POST',
        body: JSON.stringify({ rating, comment })
      })
  }

  const conversationsAPI = {
    list: () => fetchWithAuth('/conversations'),
    create: (title) =>
      fetchWithAuth('/conversations', {
        method: 'POST',
        body: JSON.stringify({ title })
      }),
    get: (id) => fetchWithAuth(`/conversations/${id}`),
    update: (id, updates) =>
      fetchWithAuth(`/conversations/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates)
      }),
    delete: (id) =>
      fetchWithAuth(`/conversations/${id}`, { method: 'DELETE' }),
    getMessages: (id) => fetchWithAuth(`/conversations/${id}/messages`)
  }

  const searchAPI = (query) =>
    fetchWithAuth(`/search?q=${encodeURIComponent(query)}`)

  return { chatAPI, conversationsAPI, searchAPI }
}
