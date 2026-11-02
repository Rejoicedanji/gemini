import { createClient } from '@supabase/supabase-js'
import { config } from './env.js'

export const createSupabaseClient = (accessToken: string) => {
  if (!config.supabase.url || !config.supabase.anonKey || config.supabase.url === 'https://your-project.supabase.co') {
    throw new Error('Supabase credentials not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY in your .env file.')
  }
  return createClient(config.supabase.url, config.supabase.anonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  })
}

export const supabaseAdmin = (() => {
  if (!config.supabase.serviceRoleKey || config.supabase.serviceRoleKey === 'your_service_role_key' || !config.supabase.url || config.supabase.url === 'https://your-project.supabase.co') {
    return null
  }
  return createClient(config.supabase.url, config.supabase.serviceRoleKey)
})()