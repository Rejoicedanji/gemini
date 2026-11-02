import { useState, useRef } from 'react'
import { Send, Paperclip, X, StopCircle } from 'lucide-react'

export default function MessageComposer({ onSend, disabled, onStop, isGenerating }) {
  const [message, setMessage] = useState('')
  const [attachments, setAttachments] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const textareaRef = useRef(null)
  const fileInputRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim() || attachments.length > 0) {
      const files = attachments.map(a => ({
        name: a.name,
        type: a.type,
        data: a.data
      }))
      onSend(message, files)
      setMessage('')
      setAttachments([])
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleFileSelect = (files) => {
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setAttachments(prev => [...prev, {
            name: file.name,
            type: file.type,
            data: e.target.result
          }])
        }
        reader.readAsDataURL(file)
      }
    })
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  const handlePaste = (e) => {
    const items = e.clipboardData.items
    const files = []
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        const file = items[i].getAsFile()
        if (file) files.push(file)
      }
    }
    if (files.length > 0) {
      handleFileSelect(files)
    }
  }

  return (
    <div className="bg-[var(--color-bg-primary)]">
      {/* Attachments preview */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 p-4 pb-0">
          {attachments.map((file, index) => (
            <div 
              key={index}
              className="relative group flex items-center gap-2 px-3 py-2 bg-[var(--color-bg-tertiary)] rounded-lg"
            >
              {file.type.startsWith('image/') && (
                <img 
                  src={file.data} 
                  alt={file.name}
                  className="w-8 h-8 rounded object-cover"
                />
              )}
              <span className="text-sm truncate max-w-32">{file.name}</span>
              <button
                onClick={() => removeAttachment(index)}
                className="p-0.5 hover:bg-[var(--color-bg-primary)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Composer */}
      <form 
        onSubmit={handleSubmit}
        className={`
          border border-[var(--color-border)] rounded-xl mx-4 my-4 overflow-hidden
          ${isDragging ? 'ring-2 ring-primary-500' : ''}
        `}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <div className="flex items-end gap-2 p-3">
          {/* Attachment button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] rounded-lg transition-colors"
            title="Attach file"
          >
            <Paperclip size={20} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files)}
          />

          {/* Text input */}
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder="Message Gemini..."
            rows={1}
            className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 resize-none text-sm"
            style={{
              minHeight: '24px',
              maxHeight: '200px'
            }}
          />

          {/* Send/Stop button */}
          {isGenerating ? (
            <button
              type="button"
              onClick={onStop}
              className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              title="Stop generation"
            >
              <StopCircle size={20} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={disabled || (!message.trim() && attachments.length === 0)}
              className="p-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={20} />
            </button>
          )}
        </div>
      </form>

      {/* Info text */}
      <div className="text-center pb-3">
        <p className="text-xs text-[var(--color-text-secondary)]">
          Gemini can make mistakes. Please verify important information.
        </p>
      </div>
    </div>
  )
}