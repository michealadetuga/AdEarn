-- Create migration for AdEarn database schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Users table
CREATE TABLE IF NOT EXISTS public.users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name text NOT NULL,
    email text UNIQUE NOT NULL,
    phone text,
    account_number text,
    bank_name text,
    balance_points integer DEFAULT 0,
    total_earned integer DEFAULT 0,
    total_withdrawn integer DEFAULT 0,
    referral_code text UNIQUE,
    referred_by uuid REFERENCES public.users(id) ON DELETE SET NULL,
    is_verified boolean DEFAULT false,
    is_banned boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);

-- 2. Create Ads table
CREATE TABLE IF NOT EXISTS public.ads (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    ad_network text CHECK (ad_network IN ('adsterra', 'monetag')),
    ad_unit_id text,
    ad_type text CHECK (ad_type IN ('video', 'banner')),
    points_reward integer DEFAULT 50,
    duration_seconds integer,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);

-- 3. Create Ad Views table
CREATE TABLE IF NOT EXISTS public.ad_views (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    ad_id uuid NOT NULL REFERENCES public.ads(id) ON DELETE CASCADE,
    watch_duration integer,
    completed boolean DEFAULT false,
    ip_address text,
    device_fingerprint text,
    points_earned integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);

-- 4. Create Withdrawals table
CREATE TABLE IF NOT EXISTS public.withdrawals (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    amount_naira integer,
    points_spent integer,
    bank_name text,
    account_number text,
    account_name text,
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'rejected')),
    created_at timestamp with time zone DEFAULT now()
);

-- 5. Create Referrals table
CREATE TABLE IF NOT EXISTS public.referrals (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    referred_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    bonus_points integer DEFAULT 500,
    created_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- ─── Users Policies ───────────────────────────────────────────────────────────
CREATE POLICY "Users can insert their own profile" 
    ON public.users FOR INSERT 
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view their own profile" 
    ON public.users FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
    ON public.users FOR UPDATE 
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- ─── Ads Policies ─────────────────────────────────────────────────────────────
CREATE POLICY "Anyone can view ads" 
    ON public.ads FOR SELECT 
    USING (true);

-- ─── Ad Views Policies ─────────────────────────────────────────────────────────
CREATE POLICY "Users can create their own ad views" 
    ON public.ad_views FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own ad views" 
    ON public.ad_views FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own ad views" 
    ON public.ad_views FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ─── Withdrawals Policies ──────────────────────────────────────────────────────
CREATE POLICY "Users can create their own withdrawals" 
    ON public.withdrawals FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own withdrawals" 
    ON public.withdrawals FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own withdrawals" 
    ON public.withdrawals FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ─── Referrals Policies ────────────────────────────────────────────────────────
CREATE POLICY "Users can create their own referrals" 
    ON public.referrals FOR INSERT 
    WITH CHECK (auth.uid() = referrer_id OR auth.uid() = referred_id);

CREATE POLICY "Users can view their own referrals" 
    ON public.referrals FOR SELECT 
    USING (auth.uid() = referrer_id OR auth.uid() = referred_id);
