import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Plus, MessageCircle, Archive, Settings, X, Trash2, Edit2, Search } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import LoadingSpinner from '../common/LoadingSpinner'

export default function Sidebar({ isOpen, mobileOpen, onCloseMobile }) {
  const { supabase } = useAuth()
  const navigate = useNavigate()
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editingTitle, setEditingTitle] = useState('')

  useEffect(() => {
    loadConversations()
  }, [])

  const loadConversations = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const response = await fetch('/api/v1/conversations', {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      })
      if (response.ok) {
        const result = await response.json()
        setConversations(result.data || [])
      }
    } catch (error) {
      console.error('Failed to load conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const createNewChat = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const response = await fetch('/api/v1/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ title: 'New chat' })
      })
      if (response.ok) {
        const result = await response.json()
        navigate(`/chat/${result.data.id}`)
      }
    } catch (error) {
      console.error('Failed to create conversation:', error)
    }
  }

  const deleteConversation = async (id, e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!confirm('Delete this conversation?')) return
    
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const response = await fetch(`/api/v1/conversations/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      })
      if (response.ok) {
        setConversations(prev => prev.filter(c => c.id !== id))
        navigate('/chat')
      }
    } catch (error) {
      console.error('Failed to delete conversation:', error)
    }
  }

  const startEdit = (conversation, e) => {
    e.preventDefault()
    e.stopPropagation()
    setEditingId(conversation.id)
    setEditingTitle(conversation.title)
  }

  const saveTitle = async (id, e) => {
    e.preventDefault()
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const response = await fetch(`/api/v1/conversations/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ title: editingTitle })
      })
      if (response.ok) {
        setConversations(prev => prev.map(c => 
          c.id === id ? { ...c, title: editingTitle } : c
        ))
      }
    } catch (error) {
      console.error('Failed to update title:', error)
    } finally {
      setEditingId(null)
    }
  }

  const filteredConversations = conversations.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={`
        hidden lg:flex flex-col fixed left-0 top-0 h-full bg-[var(--color-bg-secondary)] border-r border-[var(--color-border)]
        transition-all duration-300 z-30
        ${isOpen ? 'w-64' : 'w-16'}
      `}>
        {/* Logo */}
        <div className="p-4 border-b border-[var(--color-border)] bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),transparent_35%),linear-gradient(135deg,rgba(15,23,42,0.02),rgba(168,85,247,0.06))]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 via-violet-500 to-pink-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            {isOpen && (
              <span className="font-semibold text-lg tracking-tight">Rejoice AI</span>
            )}
          </div>
        </div>

        {/* New Chat Button */}
        <div className="p-3">
          <button
            onClick={createNewChat}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white shadow-lg shadow-blue-500/20 transition-all duration-200
              ${!isOpen && 'justify-center'}
            `}
          >
            <Plus size={18} />
            {isOpen && <span className="font-medium">New chat</span>}
          </button>
        </div>

        {/* Navigation */}
        {isOpen && (
          <div className="px-3 py-2">
            <nav className="space-y-1">
              <NavLink
                to="/chat"
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors
                  ${isActive 
                    ? 'bg-[var(--color-bg-tertiary)] text-primary-500 shadow-inner' 
                    : 'hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]'
                  }
                `}
              >
                <MessageCircle size={18} />
                <span>Chat</span>
              </NavLink>
              <NavLink
                to="/search"
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors
                  ${isActive 
                    ? 'bg-[var(--color-bg-tertiary)] text-primary-500 shadow-inner' 
                    : 'hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]'
                  }
                `}
              >
                <Search size={18} />
                <span>Search</span>
              </NavLink>
              <NavLink
                to="/archive"
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors
                  ${isActive 
                    ? 'bg-[var(--color-bg-tertiary)] text-primary-500 shadow-inner' 
                    : 'hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]'
                  }
                `}
              >
                <Archive size={18} />
                <span>Archive</span>
              </NavLink>
              <NavLink
                to="/settings"
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors
                  ${isActive 
                    ? 'bg-[var(--color-bg-tertiary)] text-primary-500 shadow-inner' 
                    : 'hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]'
                  }
                `}
              >
                <Settings size={18} />
                <span>Settings</span>
              </NavLink>
            </nav>
          </div>
        )}

        {/* Conversations List */}
        {isOpen && (
          <div className="flex-1 overflow-y-auto px-3 py-2">
            <div className="mb-3">
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            {loading ? (
              <div className="flex justify-center py-4">
                <LoadingSpinner size="small" />
              </div>
            ) : (
              <div className="space-y-1">
                {filteredConversations.map(conv => (
                  <div
                    key={conv.id}
                    className="group flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[var(--color-bg-tertiary)] cursor-pointer"
                  >
                    <NavLink 
                      to={`/chat/${conv.id}`}
                      className="flex-1 min-w-0"
                    >
                      {editingId === conv.id ? (
                        <input
                          type="text"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          onBlur={(e) => saveTitle(conv.id, e)}
                          onKeyDown={(e) => e.key === 'Enter' && saveTitle(conv.id, e)}
                          className="w-full px-2 py-1 bg-[var(--color-bg-primary)] border border-primary-500 rounded text-sm"
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <span className="text-sm truncate block">
                          {conv.title}
                        </span>
                      )}
                    </NavLink>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => startEdit(conv, e)}
                        className="p-1 hover:bg-[var(--color-bg-primary)] rounded"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={(e) => deleteConversation(conv.id, e)}
                        className="p-1 hover:bg-red-100 text-red-500 rounded"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </aside>

      {/* Mobile sidebar */}
      <aside className={`
        lg:hidden fixed left-0 top-0 h-full w-72 bg-[var(--color-bg-secondary)] border-r border-[var(--color-border)]
        transform transition-transform duration-300 z-50
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <span className="font-semibold text-lg">Gemini AI</span>
            </div>
            <button
              onClick={onCloseMobile}
              className="p-2 hover:bg-[var(--color-bg-tertiary)] rounded-lg"
            >
              <X size={20} />
            </button>
          </div>

          {/* New Chat Button */}
          <div className="p-3">
            <button
              onClick={() => {
                createNewChat()
                onCloseMobile()
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white transition-colors"
            >
              <Plus size={20} />
              <span>New chat</span>
            </button>
          </div>

          {/* Navigation */}
          <div className="px-3 py-2">
            <nav className="space-y-1">
              <NavLink
                to="/chat"
                onClick={onCloseMobile}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                  ${isActive 
                    ? 'bg-[var(--color-bg-tertiary)] text-primary-500' 
                    : 'hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]'
                  }
                `}
              >
                <MessageCircle size={20} />
                <span>Chat</span>
              </NavLink>
              <NavLink
                to="/archive"
                onClick={onCloseMobile}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]"
              >
                <Archive size={20} />
                <span>Archive</span>
              </NavLink>
              <NavLink
                to="/settings"
                onClick={onCloseMobile}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]"
              >
                <Settings size={20} />
                <span>Settings</span>
              </NavLink>
            </nav>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto px-3 py-2">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 mb-3 bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-lg text-sm"
            />
            {filteredConversations.map(conv => (
              <NavLink
                key={conv.id}
                to={`/chat/${conv.id}`}
                onClick={onCloseMobile}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[var(--color-bg-tertiary)]"
              >
                <span className="text-sm truncate">{conv.title}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </aside>
    </>
  )
}