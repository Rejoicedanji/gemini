import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Copy, RotateCcw, AlertCircle } from 'lucide-react'

function MessageItem({ message, onRetry }) {
  const [copied, setCopied] = useState(false)

  const isUser = message.role === 'user'
  const isAssistant = message.role === 'assistant'
  const isSystem = message.role === 'system'
  const isFailed = message.status === 'failed'

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRetry = () => {
    if (onRetry) onRetry()
  }

  if (isSystem) {
    return (
      <div className="flex justify-center py-2">
        <span className="text-xs text-[var(--color-text-secondary)]">
          {message.content}
        </span>
      </div>
    )
  }

  return (
    <div className={`message-fade-in py-4 ${isUser ? 'bg-[var(--color-bg-primary)]' : ''}`}>
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex gap-4">
          {/* Avatar */}
          <div className={`
            flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
            ${isUser 
              ? 'bg-primary-500 text-white' 
              : 'bg-gradient-to-br from-blue-500 to-purple-500 text-white'
            }
          `}>
            {isUser ? (
              <span className="text-sm font-medium">U</span>
            ) : (
              <span className="text-sm font-medium">AI</span>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Role indicator */}
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium">
                {isUser ? 'You' : 'Gemini'}
              </span>
              {isFailed && (
                <span className="text-xs px-2 py-0.5 bg-red-100 text-red-600 rounded-full">
                  Failed
                </span>
              )}
            </div>

            {/* Message content */}
            {isFailed ? (
              <div className="flex items-start gap-2 text-red-500">
                <AlertCircle size={16} className="mt-1" />
                <div>
                  <p>{message.content}</p>
                  <button
                    onClick={handleRetry}
                    className="mt-2 flex items-center gap-1 text-sm text-primary-500 hover:text-primary-600"
                  >
                    <RotateCcw size={14} />
                    Retry
                  </button>
                </div>
              </div>
            ) : (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '')
                      return !inline && match ? (
                        <div className="relative group">
                          <SyntaxHighlighter
                            style={vscDarkPlus}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                          <button
                            onClick={async () => {
                              await navigator.clipboard.writeText(String(children))
                            }}
                            className="absolute top-2 right-2 p-1 bg-[var(--color-bg-tertiary)] rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Copy code"
                          >
                            <Copy size={14} />
                          </button>
                        </div>
                      ) : (
                        <code className="bg-[var(--color-bg-tertiary)] px-1.5 py-0.5 rounded" {...props}>
                          {children}
                        </code>
                      )
                    },
                    pre({ children }) {
                      return <>{children}</>
                    }
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            )}

            {/* Actions */}
            {!isUser && !isFailed && (
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-1 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                  {copied ? (
                    <>
                      <span className="text-green-500">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      Copy
                    </>
                  )}
                </button>
                <button
                  onClick={handleRetry}
                  className="flex items-center gap-1 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                  <RotateCcw size={14} />
                  Regenerate
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MessageList({ messages, onRetry }) {
  return (
    <div className="py-4">
      {messages.map((message) => (
        <MessageItem 
          key={message.id || message.created_at} 
          message={message}
          onRetry={messages.length > 0 ? onRetry : undefined}
        />
      ))}
    </div>
  )
}