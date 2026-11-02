import { Sparkles, Code, Image, FileText, Lightbulb } from 'lucide-react'

const suggestedPrompts = [
  {
    icon: <Lightbulb size={18} />,
    label: 'Explain a concept',
    prompt: 'Explain how neural networks work in simple terms'
  },
  {
    icon: <Code size={18} />,
    label: 'Write code',
    prompt: 'Write a Python function to sort a list of dictionaries by a key'
  },
  {
    icon: <Image size={18} />,
    label: 'Analyze image',
    prompt: 'Analyze this image and describe what you see'
  },
  {
    icon: <FileText size={18} />,
    label: 'Summarize text',
    prompt: 'Summarize the main points of this article'
  }
]

export default function WelcomeScreen({ onNewChat, onPromptSelect }) {
  const handlePromptClick = (prompt) => {
    if (onPromptSelect) {
      onPromptSelect(prompt)
      return
    }

    if (onNewChat) {
      onNewChat(prompt)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-full py-12 px-4">
      {/* Logo */}
      <div className="mb-8">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
          <Sparkles size={40} className="text-white" />
        </div>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-semibold text-center mb-2">
        How can I help you today?
      </h1>
      <p className="text-[var(--color-text-secondary)] text-center mb-8">
        Ask me anything, and I'll do my best to help
      </p>

      {/* Suggested prompts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
        {suggestedPrompts.map((item, index) => (
          <button
            key={index}
            onClick={() => handlePromptClick(item.prompt)}
            className="flex items-center gap-3 p-4 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl hover:bg-[var(--color-bg-tertiary)] hover:border-primary-500/50 transition-all text-left group"
          >
            <div className="p-2 bg-primary-500/10 text-primary-500 rounded-lg group-hover:bg-primary-500 group-hover:text-white transition-colors">
              {item.icon}
            </div>
            <div>
              <div className="font-medium text-sm">{item.label}</div>
              <div className="text-xs text-[var(--color-text-secondary)] truncate max-w-40">
                {item.prompt}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Capabilities */}
      <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        {[
          { label: 'Text', description: 'Ask questions' },
          { label: 'Code', description: 'Write & debug' },
          { label: 'Images', description: 'Analyze photos' },
          { label: 'Files', description: 'Read documents' }
        ].map((item, index) => (
          <div key={index} className="p-3">
            <div className="text-sm font-medium">{item.label}</div>
            <div className="text-xs text-[var(--color-text-secondary)]">{item.description}</div>
          </div>
        ))}
      </div>
    </div>
  )
}