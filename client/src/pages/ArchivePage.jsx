import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { RotateCcw, Trash2, Archive, MessageCircle } from 'lucide-react'
import AppLayout from '../components/layout/AppLayout'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/common/LoadingSpinner'

export default function ArchivePage() {
  const { supabase, user } = useAuth()
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadArchivedConversations()
  }, [])

  const loadArchivedConversations = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const response = await fetch('/api/v1/conversations/archive/list', {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      })
      if (response.ok) {
        const result = await response.json()
        setConversations(result.data || [])
      }
    } catch (error) {
      console.error('Failed to load archived conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const restoreConversation = async (id) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const response = await fetch(`/api/v1/conversations/${id}/restore`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      })
      if (response.ok) {
        setConversations(prev => prev.filter(c => c.id !== id))
      }
    } catch (error) {
      console.error('Failed to restore conversation:', error)
    }
  }

  const deleteConversation = async (id) => {
    if (!confirm('Permanently delete this conversation?')) return

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
      }
    } catch (error) {
      console.error('Failed to delete conversation:', error)
    }
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Archive size={24} />
          <h1 className="text-2xl font-bold">Archived Conversations</h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-12">
            <Archive size={48} className="mx-auto text-[var(--color-text-secondary)] mb-4" />
            <h2 className="text-xl font-semibold mb-2">No archived conversations</h2>
            <p className="text-[var(--color-text-secondary)]">
              Conversations you archive will appear here
            </p>
            <Link
              to="/chat"
              className="inline-flex items-center gap-2 mt-4 text-primary-500 hover:text-primary-600"
            >
              <MessageCircle size={18} />
              Go to chat
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {conversations.map(conv => (
              <div 
                key={conv.id}
                className="flex items-center justify-between p-4 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl"
              >
                <div className="flex-1 min-w-0">
                  <Link 
                    to={`/chat/${conv.id}`}
                    className="font-medium hover:text-primary-500 truncate block"
                  >
                    {conv.title}
                  </Link>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Archived on {new Date(conv.updated_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => restoreConversation(conv.id)}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm bg-[var(--color-bg-tertiary)] rounded-lg hover:bg-[var(--color-border)] transition-colors"
                  >
                    <RotateCcw size={14} />
                    Restore
                  </button>
                  <button
                    onClick={() => deleteConversation(conv.id)}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-500 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-colors"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}