import { createContext, useContext, useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import {
  isDemoMode,
  getDemoUser,
  setDemoUser,
  clearDemoUser,
  getDemoConversations,
  setDemoConversations,
  createDemoConversation,
  updateDemoConversation,
  deleteDemoConversation,
  getDemoConversation,
  getDemoMessages,
  addDemoMessage,
  demoAssistantReply
} from '../utils/demoData'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
const useDemoFallback = !supabaseUrl || !supabaseAnonKey

const supabase = useDemoFallback ? null : createClient(supabaseUrl, supabaseAnonKey)

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (useDemoFallback) {
      const demoUser = getDemoUser()
      setUser(demoUser)
      setLoading(false)
      return undefined
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email, password, displayName) => {
    if (useDemoFallback) {
      const demoUser = {
        id: 'demo-user',
        email,
        user_metadata: { display_name: displayName || 'Demo User' }
      }
      setDemoUser(demoUser)
      setUser(demoUser)
      return { user: demoUser }
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName }
      }
    })
    if (error) throw error
    return data
  }

  const signIn = async (email, password) => {
    if (useDemoFallback) {
      const demoUser = {
        id: 'demo-user',
        email,
        user_metadata: { display_name: 'Demo User' }
      }
      setDemoUser(demoUser)
      setUser(demoUser)
      return { user: demoUser }
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    return data
  }

  const signInWithGoogle = async () => {
    if (useDemoFallback) {
      const demoUser = {
        id: 'demo-user',
        email: 'demo@rejoice.ai',
        user_metadata: { display_name: 'Demo User' }
      }
      setDemoUser(demoUser)
      setUser(demoUser)
      return { user: demoUser }
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/chat`
      }
    })
    if (error) throw error
    return data
  }

  const signOut = async () => {
    if (useDemoFallback) {
      clearDemoUser()
      setUser(null)
      return
    }

    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const resetPassword = async (email) => {
    if (useDemoFallback) {
      return { success: true }
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })
    if (error) throw error
  }

  const updateProfile = async (updates) => {
    if (useDemoFallback) {
      const nextUser = { ...getDemoUser(), ...updates }
      setDemoUser(nextUser)
      setUser(nextUser)
      return { user: nextUser }
    }

    const { data, error } = await supabase.auth.updateUser(updates)
    if (error) throw error
    return data
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signUp,
      signIn,
      signInWithGoogle,
      signOut,
      resetPassword,
      updateProfile,
      supabase,
      useDemoFallback,
      getDemoConversations,
      setDemoConversations,
      createDemoConversation,
      updateDemoConversation,
      deleteDemoConversation,
      getDemoConversation,
      getDemoMessages,
      addDemoMessage,
      demoAssistantReply
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}