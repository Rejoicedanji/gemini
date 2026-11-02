import { useState } from 'react'
import { Link } from 'react-router-dom'
import { User, Moon, Sun, Trash2, Download, Shield, ChevronRight } from 'lucide-react'
import AppLayout from '../components/layout/AppLayout'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

export default function SettingsPage() {
  const { user, signOut, deleteAccount } = useAuth()
  const { darkMode, toggleTheme } = useTheme()
  const [activeSection, setActiveSection] = useState('profile')

  const settingsSections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Moon },
    { id: 'privacy', label: 'Privacy & Data', icon: Shield },
    { id: 'account', label: 'Account', icon: Trash2 }
  ]

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl overflow-hidden">
              {settingsSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 text-left transition-colors
                    ${activeSection === section.id 
                      ? 'bg-[var(--color-bg-tertiary)] text-primary-500' 
                      : 'hover:bg-[var(--color-bg-tertiary)]'
                    }
                  `}
                >
                  <section.icon size={18} />
                  <span>{section.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            {activeSection === 'profile' && (
              <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-6">Profile Settings</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    {user?.user_metadata?.avatar_url ? (
                      <img 
                        src={user.user_metadata.avatar_url} 
                        alt="Profile" 
                        className="w-20 h-20 rounded-full"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-primary-500 flex items-center justify-center text-white text-2xl font-bold">
                        {user?.user_metadata?.display_name?.[0] || user?.email?.[0]?.toUpperCase()}
                      </div>
                    )}
                    <div>
                      <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
                        Change Photo
                      </button>
                      <p className="text-xs text-[var(--color-text-secondary)] mt-2">
                        JPG, PNG or GIF. Max 2MB.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Display Name</label>
                    <input
                      type="text"
                      defaultValue={user?.user_metadata?.display_name || ''}
                      className="w-full px-4 py-3 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      defaultValue={user?.email}
                      disabled
                      className="w-full px-4 py-3 bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-xl opacity-60 cursor-not-allowed"
                    />
                  </div>

                  <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeSection === 'appearance' && (
              <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-6">Appearance</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-[var(--color-bg-primary)] rounded-xl">
                    <div className="flex items-center gap-3">
                      {darkMode ? <Moon size={20} /> : <Sun size={20} />}
                      <div>
                        <div className="font-medium">Dark Mode</div>
                        <div className="text-sm text-[var(--color-text-secondary)]">
                          {darkMode ? 'Switch to light theme' : 'Switch to dark theme'}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={toggleTheme}
                      className={`w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-primary-500' : 'bg-[var(--color-border)]'}`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'privacy' && (
              <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-6">Privacy & Data</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-[var(--color-bg-primary)] rounded-xl">
                    <div className="flex items-center gap-3">
                      <Download size={20} />
                      <div>
                        <div className="font-medium">Export Your Data</div>
                        <div className="text-sm text-[var(--color-text-secondary)]">
                          Download all your conversations and data
                        </div>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-[var(--color-bg-tertiary)] rounded-lg hover:bg-[var(--color-border)] transition-colors">
                      Export
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-[var(--color-bg-primary)] rounded-xl border border-red-500/20">
                    <div className="flex items-center gap-3 text-red-500">
                      <Trash2 size={20} />
                      <div>
                        <div className="font-medium">Delete Account</div>
                        <div className="text-sm opacity-70">
                          Permanently delete your account and all data
                        </div>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'account' && (
              <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-6">Account Actions</h2>
                
                <div className="space-y-4">
                  <div className="p-4 bg-[var(--color-bg-primary)] rounded-xl">
                    <div className="font-medium mb-1">Sign Out</div>
                    <div className="text-sm text-[var(--color-text-secondary)] mb-4">
                      Sign out of your account on this device
                    </div>
                    <button 
                      onClick={() => signOut()}
                      className="px-4 py-2 bg-[var(--color-bg-tertiary)] rounded-lg hover:bg-[var(--color-border)] transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}