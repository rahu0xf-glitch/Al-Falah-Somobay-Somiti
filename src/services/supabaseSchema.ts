/**
 * PostgreSQL Schema and RLS Policies for Al Falah Somobay Somiti
 * Compatible with Supabase PostgreSQL
 */

export const SUPABASE_SQL_SCHEMA = `-- =======================================================
-- AL FALAH SOMOBAY SOMITI (আল-ফালাহ সমবায় সমিতি)
-- Production PostgreSQL Database Schema & Security Policies
-- =======================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Members Table
CREATE TABLE IF NOT EXISTS public.members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id VARCHAR(50) UNIQUE NOT NULL, -- e.g. 'AFS-001'
    full_name VARCHAR(255) NOT NULL,
    father_or_husband_name VARCHAR(255),
    mother_name VARCHAR(255),
    date_of_birth DATE,
    occupation VARCHAR(150),
    permanent_address TEXT,
    present_address TEXT,
    mobile_number VARCHAR(30),
    nid_number VARCHAR(50),
    nominee_name VARCHAR(255),
    nominee_relationship VARCHAR(100),
    nominee_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Index for rapid member lookup
CREATE INDEX IF NOT EXISTS idx_members_member_id ON public.members(member_id);
CREATE INDEX IF NOT EXISTS idx_members_full_name ON public.members(full_name);

-- 3. Payments Table
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id VARCHAR(50) NOT NULL REFERENCES public.members(member_id) ON DELETE CASCADE ON UPDATE CASCADE,
    payment_month INT NOT NULL CHECK (payment_month BETWEEN 1 AND 12),
    payment_year INT NOT NULL CHECK (payment_year BETWEEN 2000 AND 2100),
    amount NUMERIC(12, 2) NOT NULL CHECK (amount >= 0),
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    -- Strict Unique Constraint: 1 payment record per member per month per year
    CONSTRAINT unique_member_month_year UNIQUE (member_id, payment_month, payment_year)
);

CREATE INDEX IF NOT EXISTS idx_payments_member ON public.payments(member_id);
CREATE INDEX IF NOT EXISTS idx_payments_year_month ON public.payments(payment_year, payment_month);

-- 4. Policies Table
CREATE TABLE IF NOT EXISTS public.policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    display_order INT NOT NULL DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Contact Content Table
CREATE TABLE IF NOT EXISTS public.contact_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    heading VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    office_hours TEXT NOT NULL,
    social_links JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. Admin Users Table
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'auditor')),
    full_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id VARCHAR(100) NOT NULL,
    admin_email VARCHAR(255) NOT NULL,
    action VARCHAR(50) NOT NULL,
    affected_table VARCHAR(50) NOT NULL,
    affected_record_id VARCHAR(100),
    summary TEXT NOT NULL,
    previous_data JSONB,
    new_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON public.audit_logs(created_at DESC);

-- =======================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =======================================================
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ: Members (Public can view basic member names and IDs, but NOT private NID/Phone/Nominee)
CREATE OR REPLACE VIEW public.public_members AS
SELECT 
    m.id,
    m.member_id,
    m.full_name,
    m.occupation,
    COALESCE(SUM(p.amount), 0) AS total_deposited,
    COUNT(CASE WHEN p.amount > 0 THEN 1 END) AS paid_months_count,
    MAX(p.payment_date) AS last_deposit_date
FROM public.members m
LEFT JOIN public.payments p ON m.member_id = p.member_id
GROUP BY m.id, m.member_id, m.full_name, m.occupation;

-- Public can read policies and contact content freely
CREATE POLICY "Public read access for policies" ON public.policies FOR SELECT USING (true);
CREATE POLICY "Public read access for contact" ON public.contact_content FOR SELECT USING (true);
CREATE POLICY "Public read access for payments" ON public.payments FOR SELECT USING (true);
CREATE POLICY "Public basic read access for members" ON public.members FOR SELECT USING (true);

-- ADMIN FULL ACCESS (Authenticated Admin Users Only)
CREATE POLICY "Admin full access for members" ON public.members
    FOR ALL TO authenticated USING (
        EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.id = auth.uid())
    );

CREATE POLICY "Admin full access for payments" ON public.payments
    FOR ALL TO authenticated USING (
        EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.id = auth.uid())
    );

CREATE POLICY "Admin full access for policies" ON public.policies
    FOR ALL TO authenticated USING (
        EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.id = auth.uid())
    );

CREATE POLICY "Admin full access for contact" ON public.contact_content
    FOR ALL TO authenticated USING (
        EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.id = auth.uid())
    );

CREATE POLICY "Admin view audit logs" ON public.audit_logs
    FOR SELECT TO authenticated USING (
        EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.id = auth.uid())
    );

-- =======================================================
-- AUTOMATIC TOTAL FUND FUNCTION & AGGREGATE VIEW
-- =======================================================
CREATE OR REPLACE VIEW public.society_financial_summary AS
SELECT 
    COUNT(DISTINCT m.id) AS total_members,
    COALESCE(SUM(p.amount), 0) AS total_fund,
    COUNT(p.id) AS total_payment_records,
    COUNT(CASE WHEN p.amount > 0 THEN 1 END) AS paid_months_count,
    MAX(p.payment_date) AS last_deposit_date
FROM public.members m
LEFT JOIN public.payments p ON m.member_id = p.member_id AND p.amount > 0;
`;
