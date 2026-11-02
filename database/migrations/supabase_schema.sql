-- =========================================
-- SUPABASE SETUP INSTRUCTIONS
-- =========================================

-- 1. Create a new Supabase project at https://supabase.com

-- 2. Go to the SQL Editor and run the schema from: migrations/001_initial_schema.sql

-- 3. Enable Google OAuth (optional):
--    - Go to Authentication > Providers
--    - Enable Google provider
--    - Add your Google Cloud credentials

-- 4. Configure environment variables for the server:
--    
--    Create a .env file in the server directory:
--    
--    PORT=3000
--    NODE_ENV=development
--    
--    GEMINI_API_KEY=your_google_gemini_api_key
--    GEMINI_MODEL=gemini-1.5-flash
--    
--    SUPABASE_URL=your_supabase_project_url
--    SUPABASE_ANON_KEY=your_supabase_anon_key
--    SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

--    CLIENT_URL=http://localhost:5173

-- 5. Get your Gemini API key:
--    - Go to https://aistudio.google.com/
--    - Create an API key in API settings

-- 6. Configure frontend environment:
--    
--    Copy client/.env.example to client/.env and add:
--    
--    VITE_SUPABASE_URL=your_supabase_project_url
--    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

-- 7. Run database migrations if using Supabase CLI:
--    supabase db push