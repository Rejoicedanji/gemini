-- =========================================
-- GEMINI AI ASSISTANT - DATABASE SCHEMA
-- =========================================
-- Run this in Supabase SQL Editor
-- =========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =========================================
-- USER PROFILES
-- =========================================

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY
        REFERENCES auth.users(id)
        ON DELETE CASCADE,

    display_name TEXT,
    avatar_url TEXT,

    role TEXT NOT NULL DEFAULT 'user'
        CHECK (role IN ('user', 'admin')),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================
-- CONVERSATIONS
-- =========================================

CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
        REFERENCES auth.users(id)
        ON DELETE CASCADE,

    title TEXT NOT NULL DEFAULT 'New chat',

    model_name TEXT,

    is_archived BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================
-- MESSAGES
-- =========================================

CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    conversation_id UUID NOT NULL
        REFERENCES public.conversations(id)
        ON DELETE CASCADE,

    role TEXT NOT NULL
        CHECK (role IN ('user', 'assistant', 'system')),

    content TEXT NOT NULL DEFAULT '',

    status TEXT NOT NULL DEFAULT 'completed'
        CHECK (
            status IN (
                'pending',
                'completed',
                'failed'
            )
        ),

    model_name TEXT,

    input_tokens INTEGER,
    output_tokens INTEGER,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CHECK (
        input_tokens IS NULL OR input_tokens >= 0
    ),

    CHECK (
        output_tokens IS NULL OR output_tokens >= 0
    )
);

-- =========================================
-- ATTACHMENTS
-- =========================================

CREATE TABLE IF NOT EXISTS public.attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
        REFERENCES auth.users(id)
        ON DELETE CASCADE,

    conversation_id UUID
        REFERENCES public.conversations(id)
        ON DELETE CASCADE,

    message_id UUID
        REFERENCES public.messages(id)
        ON DELETE SET NULL,

    file_name TEXT NOT NULL,

    storage_path TEXT NOT NULL,

    mime_type TEXT NOT NULL,

    file_size BIGINT NOT NULL
        CHECK (file_size >= 0),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (storage_path)
);

-- =========================================
-- RESPONSE FEEDBACK
-- =========================================

CREATE TABLE IF NOT EXISTS public.feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
        REFERENCES auth.users(id)
        ON DELETE CASCADE,

    message_id UUID NOT NULL
        REFERENCES public.messages(id)
        ON DELETE CASCADE,

    rating SMALLINT NOT NULL
        CHECK (rating IN (-1, 1)),

    comment TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (user_id, message_id)
);

-- =========================================
-- USAGE LOGS
-- =========================================

CREATE TABLE IF NOT EXISTS public.usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID
        REFERENCES auth.users(id)
        ON DELETE SET NULL,

    conversation_id UUID
        REFERENCES public.conversations(id)
        ON DELETE SET NULL,

    model_name TEXT,

    request_status TEXT NOT NULL
        CHECK (
            request_status IN (
                'success',
                'failed'
            )
        ),

    input_tokens INTEGER,
    output_tokens INTEGER,
    latency_ms INTEGER,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CHECK (
        input_tokens IS NULL OR input_tokens >= 0
    ),

    CHECK (
        output_tokens IS NULL OR output_tokens >= 0
    ),

    CHECK (
        latency_ms IS NULL OR latency_ms >= 0
    )
);

-- =========================================
-- INDEXES
-- =========================================

CREATE INDEX IF NOT EXISTS idx_conversations_user
    ON public.conversations(user_id, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_messages_conversation
    ON public.messages(conversation_id, created_at);

CREATE INDEX IF NOT EXISTS idx_attachments_user
    ON public.attachments(user_id);

CREATE INDEX IF NOT EXISTS idx_feedback_message
    ON public.feedback(message_id);

CREATE INDEX IF NOT EXISTS idx_usage_logs_user
    ON public.usage_logs(user_id, created_at DESC);

-- =========================================
-- ROW LEVEL SECURITY
-- =========================================

ALTER TABLE public.profiles
    ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.conversations
    ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.messages
    ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.attachments
    ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.feedback
    ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.usage_logs
    ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read and update their own profile.
CREATE POLICY "Users read own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (id = (SELECT auth.uid()));

CREATE POLICY "Users update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (id = (SELECT auth.uid()))
WITH CHECK (id = (SELECT auth.uid()));

-- Conversations: users manage their own conversations.
CREATE POLICY "Users read own conversations"
ON public.conversations
FOR SELECT
TO authenticated
USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users create own conversations"
ON public.conversations
FOR INSERT
TO authenticated
WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users update own conversations"
ON public.conversations
FOR UPDATE
TO authenticated
USING (user_id = (SELECT auth.uid()))
WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users delete own conversations"
ON public.conversations
FOR DELETE
TO authenticated
USING (user_id = (SELECT auth.uid()));

-- Messages: ownership is inherited from the conversation.
CREATE POLICY "Users read own messages"
ON public.messages
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.conversations c
        WHERE c.id = messages.conversation_id
          AND c.user_id = (SELECT auth.uid())
    )
);

-- Attachments: users can read metadata for their own files.
CREATE POLICY "Users read own attachments"
ON public.attachments
FOR SELECT
TO authenticated
USING (user_id = (SELECT auth.uid()));

-- Feedback: users can read and submit their own feedback.
CREATE POLICY "Users read own feedback"
ON public.feedback
FOR SELECT
TO authenticated
USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users submit own feedback"
ON public.feedback
FOR INSERT
TO authenticated
WITH CHECK (
    user_id = (SELECT auth.uid())
    AND EXISTS (
        SELECT 1
        FROM public.messages m
        JOIN public.conversations c
          ON c.id = m.conversation_id
        WHERE m.id = feedback.message_id
          AND m.role = 'assistant'
          AND c.user_id = (SELECT auth.uid())
    )
);

-- =========================================
-- DATABASE FUNCTIONS
-- =========================================

-- Function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, display_name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- =========================================
-- STORAGE BUCKET SETUP
-- =========================================

-- Create private attachments bucket (run via Supabase CLI or dashboard)
-- This is for future file upload functionality
-- INSERT INTO storage.buckets (id, name, public) VALUES ('attachments', 'attachments', false);

-- Storage policies for attachments (future use)
-- CREATE POLICY "Users can upload attachments"
-- ON storage.objects
-- FOR INSERT
-- TO authenticated
-- WITH CHECK (
--     bucket_id = 'attachments'
--     AND auth.uid() = owner
-- );

-- =========================================
-- SAMPLE DATA (Optional)
-- =========================================

-- Insert a sample conversation for testing
-- INSERT INTO public.conversations (user_id, title, model_name)
-- SELECT 
--     id,
--     'Welcome to Gemini AI',
--     'gemini-1.5-flash'
-- FROM auth.users
-- LIMIT 1;

-- =========================================
-- END OF SCHEMA
-- =========================================