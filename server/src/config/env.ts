import dotenv from 'dotenv'

dotenv.config()

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  // Supabase
  supabase: {
    url: process.env.SUPABASE_URL || '',
    anonKey: process.env.SUPABASE_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  },

  // Gemini
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
    model: process.env.GEMINI_MODEL || 'gemini-1.5-flash'
  },

  // Client URL for CORS
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173'
}

if (!config.supabase.url || !config.supabase.anonKey) {
  console.warn('Warning: Supabase credentials not configured. Authentication will not work.')
}

if (!config.gemini.apiKey) {
  console.warn('Warning: GEMINI_API_KEY not configured. AI features will not work.')
}