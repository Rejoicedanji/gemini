import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, MessageCircle, FileText } from 'lucide-react'
import AppLayout from '../components/layout/AppLayout'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/common/LoadingSpinner'

export default function SearchPage() {
  const { supabase } = useAuth()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState({ conversations: [], messages: [] })
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      if (query.length >= 2) {
        performSearch()
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  const performSearch = async () => {
    setLoading(true)
    setSearched(true)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      const response = await fetch(`/api/v1/search?q=${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      })
      if (response.ok) {
        const result = await response.json()
        setResults(result.data || { conversations: [], messages: [] })
      }
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Search Conversations</h1>

        {/* Search Input */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" size={20} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search conversations and messages..."
            className="w-full pl-12 pr-4 py-4 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-lg"
            autoFocus
          />
          {loading && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <LoadingSpinner size="small" />
            </div>
          )}
        </div>

        {/* Results */}
        {!searched ? (
          <div className="text-center py-12 text-[var(--color-text-secondary)]">
            <Search size={48} className="mx-auto mb-4 opacity-50" />
            <p>Enter a search term to find conversations</p>
          </div>
        ) : query.length < 2 ? (
          <div className="text-center py-12 text-[var(--color-text-secondary)]">
            <p>Enter at least 2 characters to search</p>
          </div>
        ) : loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" />
          </div>
        ) : results.conversations.length === 0 && results.messages.length === 0 ? (
          <div className="text-center py-12">
            <Search size={48} className="mx-auto text-[var(--color-text-secondary)] mb-4" />
            <h2 className="text-xl font-semibold mb-2">No results found</h2>
            <p className="text-[var(--color-text-secondary)]">
              Try a different search term
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Conversations */}
            {results.conversations.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <MessageCircle size={18} />
                  Conversations ({results.conversations.length})
                </h2>
                <div className="space-y-2">
                  {results.conversations.map(conv => (
                    <Link
                      key={conv.id}
                      to={`/chat/${conv.id}`}
                      className="flex items-center gap-3 p-4 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl hover:border-primary-500/50 transition-colors"
                    >
                      <MessageCircle size={18} className="text-[var(--color-text-secondary)]" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{conv.title}</div>
                        <div className="text-sm text-[var(--color-text-secondary)]">
                          {new Date(conv.updated_at).toLocaleDateString()}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            {results.messages.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FileText size={18} />
                  Messages ({results.messages.length})
                </h2>
                <div className="space-y-2">
                  {results.messages.map((item, index) => (
                    <Link
                      key={index}
                      to={`/chat/${item.conversationId}`}
                      className="block p-4 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl hover:border-primary-500/50 transition-colors"
                    >
                      <div className="text-sm text-[var(--color-text-secondary)] mb-1">
                        {item.message.role === 'user' ? 'You' : 'AI'}
                      </div>
                      <p className="text-sm line-clamp-2">{item.message.content}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  )
}