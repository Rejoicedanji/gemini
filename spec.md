# REJOICE AI — PROJECT SPECIFICATION

**Project Name:** REJOICE AI Assistant  
**Project Type:** Artificial Intelligence Web Application  
**Project Version:** 1.0.0  
**Document Type:** Software Requirements Specification  
**Status:** Development Ready

---

# 1. PROJECT OVERVIEW

## 1.1 Introduction

Gemini AI Assistant is an intelligent web application inspired by Google's Gemini. It allows users to communicate with an AI assistant through natural language, ask questions, generate content, write and debug code, summarize documents, analyze images, and perform other AI-powered tasks.

The application will have a modern, responsive interface that works on desktop computers, tablets, and mobile devices.

The system will connect to Google's Gemini API to generate AI responses.

**Official API documentation:** [Gemini API Documentation](https://ai.google.dev/api/generate-content?utm_source=chatgpt.com)

## 1.2 Project Objectives

The objectives are to:

- Build an intelligent conversational AI application.
- Allow users to ask questions and receive AI-generated answers.
- Provide a ChatGPT/Gemini-style chat interface.
- Support text, image, and document inputs.
- Generate programming code and assist with debugging.
- Allow users to save and manage conversations.
- Provide secure user authentication.
- Maintain conversation history.
- Support responsive layouts across different devices.



- Create a scalable architecture for future AI features.

## 1.3 Target Users

The application is designed for:

- Students.
- Software developers.
- Teachers and researchers.
- Business owners.
- Content creators.
- Professionals.
- General users who need AI assistance.

---

# 2. CORE FEATURES

## 2.1 User Authentication

Users should be able to create accounts and access their personal AI workspace.

### Features

- User registration.
- Email and password login.
- Google sign-in.
- Email verification.
- Forgot-password functionality.
- Password reset.
- User logout.
- Session management.
- Protected dashboard routes.
- User profile management.

### Requirements

- Passwords must never be stored as plain text.
- Authentication must be handled securely.
- Protected API endpoints must require valid authentication.
- Users must only access their own private conversations.

## 2.2 AI Chat System

The AI chat system is the main feature of the application.

### Features

- Send text prompts to the AI.
- Receive generated responses.
- Support multi-turn conversations.
- Display responses progressively when streaming is supported.
- Render Markdown formatting.
- Display formatted code blocks.
- Copy AI responses.
- Copy generated code.
- Regenerate responses.
- Edit previous user prompts.
- Stop an ongoing generation.
- Display loading indicators.
- Display helpful error messages.
- Automatically generate conversation titles.
- Start new conversations.

### Example

User:

"Explain JavaScript promises in simple terms."

AI:

A promise in JavaScript represents the eventual completion or failure of an asynchronous operation. It can be pending, fulfilled, or rejected.

The assistant should support follow-up questions while preserving the relevant conversation context.

## 2.3 Conversation History

Users should be able to save and revisit previous conversations.

### Features

- Automatically save conversations.
- Display recent chats in a sidebar.
- Search conversation titles and messages.
- Rename conversations.
- Delete conversations.
- Archive conversations.
- Continue an existing conversation.
- Sort conversations by recent activity.
- Create a new conversation.

### Requirements

- Every conversation belongs to a specific user.
- Conversations must persist after logout.
- Deleted conversations must no longer appear in the user's normal history.
- Archived conversations should be accessible through a separate archive view.

## 2.4 AI Content Generation

The application should generate different types of text content.

### Supported tasks

- Blog posts.
- Essays.
- Business proposals.
- Emails.
- Social media captions.
- Product descriptions.
- Project documentation.
- Reports.
- Summaries.
- Creative writing.
- Study notes.
- Explanations and tutorials.

### Example prompt

"Write a professional email requesting an internship opportunity."

The AI should generate content that the user can copy, edit, and reuse.

## 2.5 AI Coding Assistant

The coding assistant should help developers understand and write software.

### Features

- Generate code from natural-language instructions.
- Explain existing code.
- Debug programming errors.
- Suggest improvements.
- Refactor code.
- Generate functions and components.
- Write unit tests.
- Explain algorithms.
- Generate project documentation.
- Support multiple programming languages.

### Example prompt

"Create a JavaScript calculator with addition, subtraction, multiplication, and division."

The AI should return properly formatted code with explanations when appropriate.

**Important:** Generated code must be treated as untrusted input. Do not execute it automatically on the server.

## 2.6 Image Understanding

Users should be able to upload images and ask questions about them.

### Features

- Upload images.
- Preview images before sending.
- Remove attachments before submission.
- Ask questions about uploaded images.
- Describe image contents.
- Extract visible text when supported.
- Explain diagrams and charts.
- Analyze screenshots.
- Support supported image formats.

### Supported formats

- JPEG.
- PNG.
- WebP.
- Other formats supported by the configured Gemini model.

### Example prompt

"Explain what is happening in this image."

The application sends the image and the user's prompt to a compatible Gemini model and displays the response.

Image-processing capabilities and supported inputs depend on the selected model and API configuration.

## 2.7 Document Analysis

Users should be able to submit supported documents for AI analysis.

### Features

- Upload PDF documents.
- Summarize documents.
- Ask questions about document contents.
- Extract key points.
- Generate study notes.
- Explain difficult passages.
- Compare information within documents.

Additional formats can be introduced based on the selected model and document-processing pipeline.

### Requirements

- Validate file types and sizes.
- Reject unsupported files.
- Apply upload limits.
- Store uploaded files securely.
- Prevent users from accessing another user's private files.
- Delete temporary files when they are no longer needed.

## 2.8 AI Response Controls

Users should be able to interact with generated responses.

### Features

- Copy response.
- Regenerate response.
- Submit a follow-up question.
- Edit the original prompt.
- Rate responses.
- Report inappropriate responses.
- Provide feedback.

## 2.9 Search and Navigation

### Features

- Search conversations.
- Navigate between recent conversations.
- Open archived chats.
- Access settings.
- Open the user profile.
- Start a new chat from anywhere in the application.

External web search or live information retrieval should be implemented as a separate capability using an appropriate search or grounding integration.

Do not assume every Gemini model automatically has access to live internet information.

## 2.10 User Settings

Users should be able to manage their personal preferences.

### Features

- Update display name.
- Update profile picture.
- Change theme.
- Select light mode.
- Select dark mode.
- Configure chat preferences.
- Manage conversation history.
- Review privacy options.
- Delete their account.

---

# 3. ADVANCED FEATURES

The following features can be introduced after the core application is working.

## 3.1 Voice Input

- Record or capture speech.
- Convert speech to text.
- Submit transcribed prompts.
- Display transcription before submission.
- Allow users to cancel recording.

## 3.2 Voice Responses

- Convert AI responses into speech.
- Play and pause audio.
- Stop playback.
- Allow supported voice selection.

Voice input and output may require additional speech services or compatible Gemini API capabilities.

## 3.3 Image Generation

Allow users to generate images from text prompts.

Example:

"Create a futuristic city at sunset in a cinematic style."

Requirements:

- Prompt input.
- Generation progress indicator.
- Generated image preview.
- Image download.
- Error handling.
- Usage limits.

Image generation must use a compatible model and API configuration.

## 3.4 Multiple AI Models

Allow the application to support multiple compatible models.

Possible options include:

- A fast model for everyday questions.
- A more capable model for complex reasoning.
- A compatible image-generation model.

Model names must be configurable rather than hard-coded throughout the application.

## 3.5 Conversation Export

Allow users to export conversations as:

- TXT.
- Markdown.
- PDF.

## 3.6 Custom AI Instructions

Users can configure preferences such as:

- Preferred response length.
- Preferred language.
- Preferred explanation style.
- Programming language preferences.

The application must distinguish user preferences from system-level safety instructions.

---

# 4. USER ROLES AND PERMISSIONS

## 4.1 Guest

A guest is a visitor who has not signed in.

Permissions:

- View the landing page.
- View public information.
- Access registration and login pages.
- Optionally try a limited demo.

Guests should not access private conversation history.

## 4.2 Registered User

A registered user has an authenticated account.

Permissions:

- Use the AI chat.
- Create conversations.
- View personal chat history.
- Upload supported files.
- Edit and delete personal conversations.
- Update profile settings.
- Submit feedback.
- Export personal conversations.
- Delete their account.

## 4.3 Administrator

An administrator manages the application's operational features.

Permissions:

- Access the administration dashboard.
- View aggregate application usage.
- Manage reported content.
- Review system errors.
- Manage user accounts when necessary.
- Configure application-wide limits.
- Review AI usage statistics.
- Manage feature availability.

### Administrator security

- Administrator privileges must be assigned server-side.
- Users must not be able to grant themselves administrator access.
- Administrative actions must be logged.
- Access to private conversation contents should be restricted and justified.
- Administrative routes must be protected by role-based authorization.

---

# 5. APPLICATION PAGES

## 5.1 Landing Page

Route: `/`

Components:

- Application logo.
- Navigation bar.
- Hero section.
- AI assistant introduction.
- Feature highlights.
- Example prompts.
- Sign-up button.
- Login button.
- Footer.

## 5.2 Registration Page

Route: `/register`

Components:

- Name field.
- Email field.
- Password field.
- Confirm-password field.
- Terms acceptance.
- Create-account button.
- Google sign-in option.
- Login link.

## 5.3 Login Page

Route: `/login`

Components:

- Email field.
- Password field.
- Remember-session option where appropriate.
- Login button.
- Forgot-password link.
- Google sign-in option.
- Registration link.

## 5.4 Main Chat Page

Route: `/chat`

Components:

- Sidebar.
- Application logo.
- New-chat button.
- Recent conversations.
- Search conversations.
- User profile menu.
- Main conversation area.
- Welcome message.
- Suggested prompts.
- Message composer.
- Attachment button.
- Send button.
- Generation status indicator.

## 5.5 Conversation Page

Route: `/chat/:conversationId`

Components:

- Conversation messages.
- User prompts.
- AI responses.
- Markdown renderer.
- Code-block renderer.
- Copy buttons.
- Regenerate controls.
- Attachment previews.
- Message composer.
- Conversation menu.

## 5.6 Search Page

Route: `/search`

Components:

- Search input.
- Search results.
- Conversation titles.
- Matching message excerpts.
- Empty state.
- Loading state.

## 5.7 Archived Conversations

Route: `/archive`

Components:

- Archived conversation list.
- Restore button.
- Delete button.
- Search and sorting controls.

## 5.8 User Settings

Route: `/settings`

Sections:

- Profile.
- Appearance.
- Chat preferences.
- Privacy.
- Data management.
- Account deletion.

## 5.9 Administration Dashboard

Route: `/admin`

Components:

- Total registered users.
- Active-user statistics.
- AI request statistics.
- Token or usage estimates where available.
- Error statistics.
- User-management table.
- Feedback and report management.
- System configuration.

---

# 6. TECHNOLOGY STACK

The following stack is recommended for this implementation.

## 6.1 Frontend

- JavaScript.
- React.
- Vite.
- Tailwind CSS.
- React Router.
- Fetch API or Axios.
- A Markdown rendering library.
- A syntax-highlighting library for code blocks.

### Responsibilities

The frontend will handle:

- User interface rendering.
- Form validation.
- Authentication screens.
- Chat interactions.
- Message display.
- Attachment previews.
- Responsive layouts.
- Client-side navigation.
- Loading and error states.

## 6.2 Backend

Use TypeScript with Node.js.

Recommended framework:

- Express.js.

Additional packages may include:

- Zod for input validation.
- A supported authentication library or Supabase client.
- Rate-limiting middleware.
- A logging library.
- A streaming response implementation.

### Responsibilities

The backend will handle:

- Authentication verification.
- Request validation.
- Gemini API integration.
- Conversation persistence.
- File-upload validation.
- Rate limiting.
- Usage tracking.
- Error handling.
- Authorization.
- Administrative operations.

## 6.3 AI Integration

Use Google's official JavaScript/TypeScript SDK:

`@google/genai`

Install it using:

`npm install @google/genai`

Use the Gemini API to generate responses and process supported inputs.

Official API reference:

[Google Gemini Generate Content API](https://ai.google.dev/api/generate-content?utm_source=chatgpt.com)

## 6.4 Database

Recommended database: PostgreSQL through Supabase.

Supabase can provide:

- PostgreSQL database.
- User authentication.
- Object storage.
- Row Level Security.
- Database migrations.

## 6.5 Deployment

Possible deployment services:

- Frontend: Vercel or Netlify.
- Backend: Render, Railway, or another Node.js-compatible hosting provider.
- Database and authentication: Supabase.

The frontend and backend may be deployed separately.

---

# 7. SYSTEM ARCHITECTURE

The application should follow a client-server architecture.

## 7.1 Request Flow

1. The user opens the application.
2. The frontend displays the chat interface.
3. The user enters a prompt.
4. The frontend sends the prompt to the backend.
5. The backend authenticates the user.
6. The backend validates the request.
7. The backend checks rate limits and usage restrictions.
8. The backend retrieves the relevant conversation context.
9. The backend calls the Gemini API.
10. Gemini generates a response.
11. The backend saves the relevant messages.
12. The backend returns the response to the frontend.
13. The frontend displays the response.
14. The user can continue the conversation.

## 7.2 Architecture Diagram

```text
+---------------------------+
|        USER               |
| Browser / Mobile Browser  |
+-------------+-------------+
              |
              v
+---------------------------+
|      REACT FRONTEND       |
|                           |
| Chat UI                   |
| Authentication UI         |
| Conversation History      |
| File Attachments          |
+-------------+-------------+
              |
              v
+---------------------------+
|     NODE.JS BACKEND       |
|       TypeScript          |
|                           |
| Authentication Checks     |
| Input Validation          |
| Chat Service              |
| Usage Limits              |
| File Validation           |
| API Error Handling        |
+----------+----------+-----+
           |          |
           v          v
+----------------+  +----------------+
| GEMINI API     |  | SUPABASE       |
|                |  |                |
| AI Responses   |  | PostgreSQL     |
| Image Analysis |  | Authentication |
| File Analysis  |  | Object Storage |
+----------------+  +----------------+
```

---

# 8. PROJECT FOLDER STRUCTURE

Recommended monorepo structure:

```text
gemini-ai/
│
├── client/
│   ├── public/
│   │   ├── favicon.svg
│   │   └── logo.svg
│   │
│   ├── src/
│   │   ├── assets/
│   │   │
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── AppLayout.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── Header.jsx
│   │   │   │
│   │   │   ├── chat/
│   │   │   │   ├── ChatWindow.jsx
│   │   │   │   ├── MessageList.jsx
│   │   │   │   ├── MessageItem.jsx
│   │   │   │   ├── MessageComposer.jsx
│   │   │   │   ├── AttachmentPreview.jsx
│   │   │   │   └── SuggestedPrompts.jsx
│   │   │   │
│   │   │   ├── common/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Loader.jsx
│   │   │   │   └── ErrorMessage.jsx
│   │   │   │
│   │   │   └── ui/
│   │   │
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── ChatPage.jsx
│   │   │   ├── SearchPage.jsx
│   │   │   ├── ArchivePage.jsx
│   │   │   ├── SettingsPage.jsx
│   │   │   └── AdminPage.jsx
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useChat.js
│   │   │   └── useConversations.js
│   │   │
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   └── chatService.js
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   │
│   │   ├── utils/
│   │   │   ├── formatDate.js
│   │   │   └── validateFile.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   ├── env.ts
│   │   │   ├── database.ts
│   │   │   └── gemini.ts
│   │   │
│   │   ├── controllers/
│   │   │   ├── chat.controller.ts
│   │   │   ├── conversation.controller.ts
│   │   │   ├── upload.controller.ts
│   │   │   └── admin.controller.ts
│   │   │
│   │   ├── services/
│   │   │   ├── gemini.service.ts
│   │   │   ├── chat.service.ts
│   │   │   ├── conversation.service.ts
│   │   │   └── usage.service.ts
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── chat.routes.ts
│   │   │   ├── conversation.routes.ts
│   │   │   ├── upload.routes.ts
│   │   │   └── admin.routes.ts
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── admin.middleware.ts
│   │   │   ├── rateLimit.middleware.ts
│   │   │   └── error.middleware.ts
│   │   │
│   │   ├── schemas/
│   │   │   ├── chat.schema.ts
│   │   │   └── upload.schema.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── logger.ts
│   │   │   └── errors.ts
│   │   │
│   │   ├── app.ts
│   │   └── server.ts
│   │
│   ├── tests/
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── database/
│   ├── migrations/
│   │   └── 001_initial_schema.sql
│   └── seed.sql
│
├── docs/
│   ├── API.md
│   └── DATABASE.md
│
├── .gitignore
├── README.md
└── spec.md
```

This structure separates the frontend, backend, database migrations, and project documentation.

---

# 9. DATABASE DESIGN

Use PostgreSQL as the primary database.

## 9.1 Profiles Table

Stores application-specific user profile information.

| Column | Type | Description |
|---|---|---|
| id | UUID | Primary key and reference to the authentication user |
| display_name | TEXT | User's display name |
| avatar_url | TEXT | Profile image URL |
| role | TEXT | User role |
| created_at | TIMESTAMPTZ | Account creation time |
| updated_at | TIMESTAMPTZ | Last profile update |

The `id` should reference `auth.users(id)` when using Supabase Authentication.

## 9.2 Conversations Table

Stores conversation metadata.

| Column | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| user_id | UUID | Owner of the conversation |
| title | TEXT | Conversation title |
| model_name | TEXT | Model used for the conversation |
| is_archived | BOOLEAN | Whether the conversation is archived |
| created_at | TIMESTAMPTZ | Creation time |
| updated_at | TIMESTAMPTZ | Last activity time |

Relationships:

- One user can have many conversations.
- Every conversation belongs to one user.

## 9.3 Messages Table

Stores individual messages.

| Column | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| conversation_id | UUID | Related conversation |
| role | TEXT | User, assistant, or system |
| content | TEXT | Message text |
| status | TEXT | Generation status |
| model_name | TEXT | Model used, when applicable |
| input_tokens | INTEGER | Input-token usage, when available |
| output_tokens | INTEGER | Output-token usage, when available |
| created_at | TIMESTAMPTZ | Message creation time |

Use database constraints to restrict allowed role and status values.

Do not expose internal system instructions to ordinary users.

## 9.4 Attachments Table

Stores metadata for uploaded files.

| Column | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| user_id | UUID | File owner |
| conversation_id | UUID | Related conversation |
| message_id | UUID | Related message, if available |
| file_name | TEXT | Original filename |
| storage_path | TEXT | Private storage location |
| mime_type | TEXT | Verified file type |
| file_size | BIGINT | File size in bytes |
| created_at | TIMESTAMPTZ | Upload time |

Do not store large binary files directly in ordinary message rows.

## 9.5 Feedback Table

Stores user feedback.

| Column | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| user_id | UUID | Feedback author |
| message_id | UUID | Related AI message |
| rating | SMALLINT | Rating value |
| comment | TEXT | Optional comment |
| created_at | TIMESTAMPTZ | Submission time |

## 9.6 Usage Logs Table

Tracks application usage.

| Column | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| user_id | UUID | User who initiated the request |
| conversation_id | UUID | Related conversation |
| model_name | TEXT | Model used |
| request_status | TEXT | Success or failure |
| input_tokens | INTEGER | Input usage when available |
| output_tokens | INTEGER | Output usage when available |
| latency_ms | INTEGER | Request duration |
| created_at | TIMESTAMPTZ | Request time |

Usage records should not contain API secrets or unnecessary copies of private prompts.

---

# 10. SUPABASE SQL SCHEMA

The following SQL establishes the initial database structure.

Run it in the Supabase SQL Editor in a new project, or adapt it into migrations if tables already exist.

```sql
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

-- Message creation, modification, and deletion should be
-- controlled through the authenticated backend service.
-- Add narrowly scoped policies if direct client writes
-- are required by your architecture.

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

-- Usage logs: ordinary users cannot directly read or modify
-- operational usage records.
-- Access should be provided through authorized backend routes.
```

### Important database implementation notes

1. The schema does not automatically create profile rows when users register. Implement a secure profile-creation trigger or create the profile through a trusted registration workflow.
2. The `role` field must not be user-editable. Restrict role changes to a trusted administrative process.
3. Configure private Supabase Storage buckets and appropriate Storage policies.
4. The backend must verify that every requested conversation belongs to the authenticated user.
5. Add additional policies if the application needs direct client-side message creation.
6. Do not expose the Supabase service-role key in the frontend.
7. Review and test all Row Level Security policies before production deployment.

---

# 11. BACKEND API ENDPOINTS

Use `/api/v1` as the API prefix.

## 11.1 Authentication

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/v1/auth/me` | Return authenticated user information |
| POST | `/api/v1/auth/logout` | Perform application logout if required |

Registration, login, email verification, and password recovery can be handled through Supabase Auth.

The backend must verify authentication tokens before processing protected requests.

## 11.2 Chat

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/v1/chat` | Submit a prompt and generate a response |
| POST | `/api/v1/chat/stream` | Stream a generated response |
| POST | `/api/v1/chat/:id/regenerate` | Regenerate an assistant response |
| POST | `/api/v1/chat/:id/feedback` | Submit response feedback |

The server should validate the request body and enforce model-specific input limits.

## 11.3 Conversations

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/v1/conversations` | List conversations |
| POST | `/api/v1/conversations` | Create a conversation |
| GET | `/api/v1/conversations/:id` | Retrieve conversation details |
| PATCH | `/api/v1/conversations/:id` | Rename or archive a conversation |
| DELETE | `/api/v1/conversations/:id` | Delete a conversation |
| GET | `/api/v1/conversations/:id/messages` | Retrieve messages |

## 11.4 Uploads

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/v1/uploads` | Validate and upload a file |
| DELETE | `/api/v1/uploads/:id` | Delete an owned attachment |

## 11.5 Search

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/v1/search?q=...` | Search personal conversations |

## 11.6 Administration

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/v1/admin/stats` | Retrieve usage statistics |
| GET | `/api/v1/admin/users` | List users |
| PATCH | `/api/v1/admin/users/:id` | Perform authorized account-management actions |
| GET | `/api/v1/admin/feedback` | Review feedback |

All administration endpoints require verified administrator privileges.

---

# 12. GEMINI API INTEGRATION

## 12.1 Environment Variables

Create a `.env` file inside the server directory.

```env
PORT=3000
NODE_ENV=development

GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=your_supported_gemini_model

SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_publishable_key
SUPABASE_SERVICE_ROLE_KEY=your_server_only_secret

CLIENT_URL=http://localhost:5173
```

Use the exact environment variable names supported by your selected SDK and authentication setup.

Never commit real secrets to Git.

The service-role key is optional if the backend uses only user-scoped Supabase access. If it is needed for trusted administrative operations, it must remain server-side and must never be used as a substitute for authorization checks.

## 12.2 AI Service Responsibilities

The Gemini service should:

1. Accept a validated user prompt.
2. Retrieve the relevant conversation messages.
3. Convert the conversation into the supported Gemini request format.
4. Call the configured model.
5. Process the generated response.
6. Record usage information when available.
7. Return a normalized response to the controller.
8. Handle API failures safely.

## 12.3 Example Gemini Service

Create `server/src/services/gemini.service.ts`.

```typescript
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
const model = process.env.GEMINI_MODEL;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not configured");
}

if (!model) {
  throw new Error("GEMINI_MODEL is not configured");
}

const ai = new GoogleGenAI({ apiKey });

export async function generateAIResponse(
  prompt: string
): Promise<string> {
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
  });

  const text = response.text;

  if (!text) {
    throw new Error("The AI did not return a text response");
  }

  return text;
}
```

This is a minimal text-generation example. It does not implement authentication, conversation history, streaming, file uploads, or database persistence.

Those features should be implemented in separate services and controllers.

## 12.4 Chat Request Example

Request:

```http
POST /api/v1/chat
Content-Type: application/json
Authorization: Bearer USER_ACCESS_TOKEN
```

Body:

```json
{
  "conversationId": "CONVERSATION_UUID",
  "message": "Explain TypeScript interfaces with examples."
}
```

Example successful response:

```json
{
  "success": true,
  "data": {
    "conversationId": "CONVERSATION_UUID",
    "message": {
      "role": "assistant",
      "content": "A TypeScript interface defines the expected structure of an object."
    }
  }
}
```

The returned response is illustrative. Actual AI-generated content will vary.

## 12.5 Streaming Responses

When streaming is implemented:

- Send response chunks progressively.
- Use a supported streaming API.
- Prefer Server-Sent Events or another well-defined streaming transport.
- Detect client disconnections.
- Stop upstream generation when cancellation is supported.
- Persist the final completed response.
- Handle partial responses and failures consistently.

---

# 13. FRONTEND USER INTERFACE REQUIREMENTS

## 13.1 Design Style

The interface should be modern, clean, and minimal.

### Suggested visual design

- Light and dark themes.
- Neutral backgrounds.
- Rounded message containers where appropriate.
- Clear typography.
- Subtle shadows.
- Smooth transitions.
- Accessible buttons.
- Consistent spacing.
- Responsive navigation.

### Main layout

Desktop:

- Sidebar on the left.
- Conversation area in the center.
- Message composer at the bottom.
- User menu in the sidebar or header.

Mobile:

- Collapsible sidebar.
- Full-width chat area.
- Mobile-friendly composer.
- Touch-friendly buttons.
- Responsive attachment previews.

## 13.2 Message Composer

The composer should include:

- Multiline text input.
- Send button.
- Attachment button.
- Enter-to-send behavior where appropriate.
- Shift+Enter for a new line.
- Disabled state while a request is being submitted when appropriate.
- Stop-generation control.
- Input-length validation.

## 13.3 AI Message Rendering

AI messages should support:

- Markdown.
- Headings.
- Paragraphs.
- Numbered lists.
- Bullet lists.
- Tables.
- Inline code.
- Code blocks.
- Links.
- Copy controls.

Sanitize untrusted content and avoid unsafe HTML rendering.

## 13.4 Application States

Implement the following states:

- Initial loading.
- Empty conversation.
- Sending message.
- Receiving response.
- Response complete.
- Request failed.
- Network unavailable.
- Authentication expired.
- Attachment uploading.
- Attachment rejected.
- No search results.

---

# 14. SECURITY REQUIREMENTS

Security is a core requirement.

## 14.1 API Key Protection

- Store the Gemini API key on the backend.
- Never place the key in frontend JavaScript.
- Never expose secrets through API responses.
- Configure production secrets through the hosting provider.
- Rotate compromised credentials.

## 14.2 Authentication

- Verify access tokens server-side.
- Protect private API endpoints.
- Apply appropriate session expiration and revocation controls.
- Prevent unauthorized access to other users' data.

## 14.3 Authorization

Every conversation operation must verify ownership.

A valid conversation UUID alone does not grant permission to read or modify that conversation.

## 14.4 Rate Limiting

Apply limits to:

- Chat generation.
- File uploads.
- Authentication-related endpoints.
- Search.
- Expensive AI features.

Enforce important limits on the backend, not just in the frontend.

## 14.5 Input Validation

Validate:

- Message length.
- File size.
- File type.
- Conversation identifiers.
- Model configuration.
- Request frequency.
- User-supplied parameters.

## 14.6 File Security

- Allow only supported file types.
- Use generated storage filenames.
- Verify file contents where practical.
- Store uploads in private buckets.
- Avoid trusting file extensions alone.
- Prevent path traversal.
- Apply malware scanning where appropriate.
- Enforce storage and upload quotas.

## 14.7 AI Safety

- Handle unsafe requests according to the application's safety requirements.
- Treat AI responses as potentially inaccurate.
- Never trust generated code as automatically safe.
- Prevent prompts from overriding application authorization.
- Avoid returning secrets or private system instructions.
- Provide appropriate warnings for high-impact decisions.

## 14.8 Privacy

- Explain how prompts and files are processed.
- Define conversation retention rules.
- Provide account deletion and data deletion workflows.
- Avoid storing unnecessary personal information.
- Restrict access to application logs.
- Never log passwords, access tokens, or API keys.

---

# 15. ERROR HANDLING

The application must handle errors gracefully.

### Common errors

| Error | Expected behavior |
|---|---|
| Invalid input | Return a validation error |
| Unauthorized request | Return HTTP 401 |
| Insufficient permissions | Return HTTP 403 |
| Conversation not found | Return HTTP 404 |
| Rate limit exceeded | Return HTTP 429 |
| Invalid attachment | Explain the supported file requirements |
| Gemini API failure | Return a safe error message |
| Gemini quota exceeded | Explain that the request limit has been reached |
| Network timeout | Allow the user to retry |
| Database failure | Log the error and return a safe response |
| Unexpected server error | Return HTTP 500 without exposing internal details |

Use a consistent error structure:

```json
{
  "success": false,
  "error": {
    "code": "AI_REQUEST_FAILED",
    "message": "The response could not be generated. Please try again."
  }
}
```

Do not expose raw stack traces, database credentials, or upstream API secrets.

---

# 16. PERFORMANCE REQUIREMENTS

The application should:

- Load the initial interface quickly.
- Avoid unnecessary frontend re-renders.
- Paginate long conversation histories.
- Index commonly queried database fields.
- Use streaming when appropriate.
- Apply timeouts to upstream requests.
- Limit the amount of conversation history sent to the model.
- Avoid sending unnecessary attachments.
- Cache suitable non-sensitive metadata.
- Track latency and failure rates.

Performance targets should be validated under realistic usage.

Suggested initial targets:

- Initial application interface: approximately 2.5 seconds or less on a suitable connection.
- Ordinary backend operations: target a response time below 500 milliseconds when external AI processing is not involved.
- AI response time: measured separately because it depends on the model, prompt, network, and provider capacity.

These are engineering targets, not guaranteed results.

---

# 17. TESTING REQUIREMENTS

## 17.1 Frontend Testing

Test:

- Registration and login screens.
- Chat interface.
- Message composer.
- Markdown rendering.
- Attachment previews.
- Conversation sidebar.
- Responsive layouts.
- Loading and error states.

## 17.2 Backend Testing

Test:

- Authentication middleware.
- Authorization checks.
- Request validation.
- Gemini service.
- Conversation persistence.
- Rate limiting.
- Error handling.
- File validation.

## 17.3 Database Testing

Test:

- User profile creation.
- Conversation creation.
- Message persistence.
- Conversation ownership.
- Row Level Security.
- Attachment permissions.
- Account deletion behavior.

## 17.4 Security Testing

Verify that:

- Unauthenticated users cannot access protected endpoints.
- Users cannot retrieve another user's conversations.
- Users cannot change their role to administrator.
- Frontend code does not expose API secrets.
- Invalid files are rejected.
- Rate limits are enforced.
- Untrusted AI output cannot execute arbitrary scripts.

## 17.5 AI Integration Testing

Test:

- Normal text prompts.
- Long prompts.
- Follow-up questions.
- Unsupported model configuration.
- API timeouts.
- Quota errors.
- Empty responses.
- Image input.
- Document input.
- Streaming cancellation.

---

# 18. DEVELOPMENT ROADMAP

## Phase 1: Project Setup

Tasks:

- Create the project directory.
- Initialize the React frontend.
- Initialize the TypeScript backend.
- Configure environment variables.
- Set up Git.
- Configure Supabase.
- Install required dependencies.

Deliverable: A running frontend and backend.

## Phase 2: UI Development

Tasks:

- Build the landing page.
- Build authentication screens.
- Build the sidebar.
- Build the chat interface.
- Build the message composer.
- Build the conversation list.
- Implement responsive styling.

Deliverable: A complete frontend prototype.

## Phase 3: Authentication and Database

Tasks:

- Configure Supabase Authentication.
- Create the database tables.
- Configure Row Level Security.
- Implement user profiles.
- Add conversation persistence.
- Add message persistence.
- Protect application routes.

Deliverable: Users can sign in and manage private conversations.

## Phase 4: Gemini API Integration

Tasks:

- Obtain a Gemini API key.
- Configure the selected model.
- Implement the Gemini service.
- Create the chat endpoint.
- Validate requests.
- Display generated responses.
- Handle API failures.

Deliverable: The application can generate AI responses.

## Phase 5: Conversation Management

Tasks:

- Save messages.
- Load conversation history.
- Rename conversations.
- Delete conversations.
- Archive conversations.
- Search previous chats.

Deliverable: Persistent conversation management.

## Phase 6: File Uploads

Tasks:

- Configure private storage.
- Implement upload validation.
- Add image attachments.
- Add supported document attachments.
- Connect uploaded content to Gemini.
- Enforce ownership and size limits.

Deliverable: Users can ask questions about supported images and documents.

## Phase 7: Advanced Features

Tasks:

- Implement streaming.
- Add response regeneration.
- Add message feedback.
- Add image generation if supported.
- Add voice features if required.
- Add configurable model selection.

Deliverable: An expanded AI assistant.

## Phase 8: Security and Testing

Tasks:

- Review authentication.
- Test Row Level Security.
- Test authorization.
- Add rate limiting.
- Test file handling.
- Verify secret management.
- Test error scenarios.
- Optimize performance.

Deliverable: A tested application ready for staging.

## Phase 9: Deployment

Tasks:

- Deploy the frontend.
- Deploy the backend.
- Configure production environment variables.
- Configure production CORS.
- Configure database migrations.
- Test deployed API connectivity.
- Verify HTTPS.
- Configure monitoring and backups.

Deliverable: A publicly accessible application.

---

# 19. ACCEPTANCE CRITERIA

The initial application is considered functional when:

- Users can register and sign in.
- Authenticated users can open the chat interface.
- Users can send prompts to Gemini.
- AI responses appear in the interface.
- Conversations and messages persist in PostgreSQL.
- Users can reopen previous conversations.
- Users can rename and delete their own conversations.
- Users cannot access another user's private chats.
- The Gemini API key remains server-side.
- The application displays useful error messages.
- The interface works on desktop and mobile devices.
- Protected API endpoints enforce authentication.
- Database access policies are tested.
- The application can be deployed successfully.

Image uploads, document analysis, streaming, and other advanced features should have separate acceptance tests before they are considered complete.

---

# 20. FUTURE IMPROVEMENTS

Potential future additions include:

- AI-powered research with citations.
- Real-time web search integration.
- Advanced coding workspace.
- Voice conversations.
- Image generation and editing.
- Conversation sharing.
- Team workspaces.
- Custom AI assistants.
- Paid subscription plans.
- Usage quotas and billing.
- Multi-language support.
- Mobile applications.
- Analytics dashboards.
- Additional AI providers.
- User-defined prompt templates.

These features should be introduced incrementally rather than delaying the initial working version.

---

# 21. FINAL DEVELOPMENT INSTRUCTIONS

Build the application in small, testable stages.

Follow these priorities:

1. Set up the frontend and backend.
2. Build the core chat interface.
3. Configure authentication.
4. Create the database tables and security policies.
5. Connect the Gemini API through the backend.
6. Save and retrieve conversations.
7. Add file uploads.
8. Implement advanced features.
9. Test security and permissions.
10. Deploy and monitor the application.

Do not build the entire application in a single untested step.

Use reusable components, clear TypeScript types, validated API requests, database migrations, centralized error handling, and environment-based configuration.

**Final objective:** Build a secure, responsive, full-stack AI assistant that provides Gemini-powered conversations and can be expanded with additional AI capabilities over time.