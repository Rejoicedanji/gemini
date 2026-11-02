import { Menu, Sun, Moon, LogOut, User } from 'lucide-react'
import { NavLink } from 'react-router-dom'

export default function Header({ 
  onToggleSidebar, 
  onToggleMobileSidebar,
  darkMode, 
  onToggleTheme,
  onSignOut,
  user
}) {
  return (
    <header className="sticky top-0 z-20 bg-[var(--color-bg-primary)]/80 backdrop-blur-sm border-b border-[var(--color-border)]">
      <div className="flex items-center justify-between px-4 lg:px-6 py-3">
        {/* Left side */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 hover:bg-[var(--color-bg-tertiary)] rounded-lg"
          >
            <Menu size={20} />
          </button>
          <button
            onClick={onToggleSidebar}
            className="hidden lg:flex p-2 hover:bg-[var(--color-bg-tertiary)] rounded-lg"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleTheme}
            className="p-2 hover:bg-[var(--color-bg-tertiary)] rounded-lg transition-colors"
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <div className="relative group">
            <button className="flex items-center gap-2 p-2 hover:bg-[var(--color-bg-tertiary)] rounded-lg">
              {user?.user_metadata?.avatar_url ? (
                <img 
                  src={user.user_metadata.avatar_url} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white">
                  <User size={16} />
                </div>
              )}
            </button>

            {/* Dropdown */}
            <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              <div className="p-3 border-b border-[var(--color-border)]">
                <p className="text-sm font-medium truncate">
                  {user?.user_metadata?.display_name || user?.email}
                </p>
                <p className="text-xs text-[var(--color-text-secondary)] truncate">
                  {user?.email}
                </p>
              </div>
              <div className="p-2">
                <NavLink
                  to="/settings"
                  className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-[var(--color-bg-tertiary)]"
                >
                  <User size={16} />
                  <span>Settings</span>
                </NavLink>
                <button
                  onClick={onSignOut}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-[var(--color-bg-tertiary)] text-red-500"
                >
                  <LogOut size={16} />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}