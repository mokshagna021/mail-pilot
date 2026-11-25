-- ==========================================================
-- MAILPILOT AI - PostgreSQL Database Architecture for Supabase
-- Tables: Profiles, Activity Logs, Email Records
-- ==========================================================

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    google_connected BOOLEAN DEFAULT FALSE,
    google_email TEXT,
    google_access_token TEXT,
    google_refresh_token TEXT,
    google_token_expiry TIMESTAMPTZ,
    theme VARCHAR(20) DEFAULT 'dark',
    default_tone VARCHAR(30) DEFAULT 'professional',
    notifications BOOLEAN DEFAULT TRUE,
    signature TEXT DEFAULT 'Best regards,
Sent via MailPilot AI',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Agent Activity Traces Table
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    command TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'planning',
    plan JSONB DEFAULT '[]'::jsonb,
    agents_activated JSONB DEFAULT '[]'::jsonb,
    tools_called JSONB DEFAULT '[]'::jsonb,
    email_draft JSONB DEFAULT '{}'::jsonb,
    verification_report JSONB DEFAULT '{}'::jsonb,
    execution_result JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Email Records (Sent, Drafts & Inbox Caches)
CREATE TABLE IF NOT EXISTS public.email_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    gmail_id TEXT,
    thread_id TEXT,
    type VARCHAR(30) NOT NULL,
    recipients TEXT[] DEFAULT '{}',
    cc TEXT[] DEFAULT '{}',
    bcc TEXT[] DEFAULT '{}',
    sender TEXT,
    subject TEXT,
    snippet TEXT,
    body_text TEXT,
    body_html TEXT,
    status VARCHAR(30) DEFAULT 'sent',
    ai_generated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_status ON public.activity_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_records_user_id ON public.email_records(user_id);
CREATE INDEX IF NOT EXISTS idx_email_records_type ON public.email_records(type);

-- Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_records ENABLE ROW LEVEL SECURITY;

-- Drop previous policies if they exist to prevent duplication errors
DROP POLICY IF EXISTS "Allow public read/write for profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow public read/write for activity_logs" ON public.activity_logs;
DROP POLICY IF EXISTS "Allow public read/write for email_records" ON public.email_records;

-- Create clean policies
CREATE POLICY "Allow public read/write for profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write for activity_logs" ON public.activity_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write for email_records" ON public.email_records FOR ALL USING (true) WITH CHECK (true);
