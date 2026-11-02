import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight, CheckCircle, MessageCircle, Code, Image, Shield, Wand2 } from 'lucide-react'

const features = [
  {
    icon: <MessageCircle size={24} />,
    title: 'Smart Conversations',
    description: 'Engage in natural,上下文-aware discussions with AI'
  },
  {
    icon: <Code size={24} />,
    title: 'Code Assistant',
    description: 'Write, debug, and explain code in multiple languages'
  },
  {
    icon: <Image size={24} />,
    title: 'Image Understanding',
    description: 'Upload images and ask questions about their contents'
  },
  {
    icon: <Shield size={24} />,
    title: 'Secure & Private',
    description: 'Your conversations are encrypted and protected'
  }
]

const examplePrompts = [
  'Explain quantum computing to a 10-year-old',
  'Write a Python script to automate file organization',
  'What are the key takeaways from this research paper?',
  'Help me brainstorm creative marketing ideas'
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      {/* Header */}
      <header className="border-b border-[var(--color-border)] bg-white/60 dark:bg-slate-950/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 via-violet-500 to-pink-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Sparkles size={18} className="text-white" />
              </div>
              <span className="font-semibold text-lg tracking-tight">Rejoice AI</span>
            </div>
            <nav className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl hover:shadow-lg hover:shadow-violet-500/20 transition-all"
              >
                Get Started
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.14),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.18),transparent_30%)]" />
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 text-primary-500 rounded-full text-sm mb-6 border border-primary-500/10">
              <Wand2 size={16} />
              <span>Powered by Google Gemini</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight">
              The AI workspace for
              <span className="block bg-gradient-to-r from-blue-500 via-violet-500 to-pink-500 text-transparent bg-clip-text">
                ideas, code, and clarity
              </span>
            </h1>
            
            <p className="text-xl text-[var(--color-text-secondary)] mb-8 max-w-2xl mx-auto">
              Ask, build, analyze, and create in one polished assistant designed to help you move faster.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl hover:shadow-lg hover:shadow-violet-500/20 transition-all font-medium"
              >
                Start Chatting
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl hover:bg-[var(--color-bg-tertiary)] transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3 max-w-4xl mx-auto">
            {[
              { label: 'Daily productivity', value: '10x' },
              { label: 'AI tasks handled', value: '24/7' },
              { label: 'Workflow quality', value: 'Higher' }
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-primary)]/80 p-5 shadow-sm backdrop-blur-sm">
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-violet-500 text-transparent bg-clip-text">{stat.value}</div>
                <div className="text-sm text-[var(--color-text-secondary)] mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-[var(--color-bg-secondary)]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            Everything you need in one AI assistant
          </h2>
          <p className="text-[var(--color-text-secondary)] text-center mb-12 max-w-2xl mx-auto">
            Powerful features to help you accomplish more, faster
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="p-6 bg-[var(--color-bg-primary)] rounded-xl border border-[var(--color-border)] hover:border-primary-500/50 transition-colors"
              >
                <div className="w-12 h-12 bg-primary-500/10 text-primary-500 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Example Prompts */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            What you can ask
          </h2>
          <p className="text-[var(--color-text-secondary)] text-center mb-12">
            Here are just a few examples of what Gemini can help you with
          </p>
          
          <div className="grid gap-4">
            {examplePrompts.map((prompt, index) => (
              <div 
                key={index}
                className="p-4 bg-[var(--color-bg-secondary)] rounded-xl hover:bg-[var(--color-bg-tertiary)] transition-colors cursor-pointer"
              >
                <p className="text-[var(--color-text-secondary)]">{prompt}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-[var(--color-bg-secondary)]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to get started?
          </h2>
          <p className="text-[var(--color-text-secondary)] mb-8">
            Join thousands of users who are already experiencing the future of AI assistance.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors font-medium"
          >
            Create Free Account
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <Sparkles size={12} className="text-white" />
            </div>
            <span className="font-medium text-sm">Gemini AI</span>
          </div>
          <p className="text-xs text-[var(--color-text-secondary)]">
            Powered by Google's Gemini API
          </p>
        </div>
      </footer>
    </div>
  )
}