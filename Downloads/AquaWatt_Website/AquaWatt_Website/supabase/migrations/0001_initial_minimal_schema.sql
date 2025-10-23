-- 0001_initial_minimal_schema.sql
-- Snapshot of current minimal AquaWatt schema for migration baseline.
-- Future changes should be added in incremented files (0002_add_xyz.sql, etc.)

-- This file intentionally mirrors the clean state; DO NOT include seed data here.
-- If you need seed/test data, keep it in seed.sql or a dedicated test seed migration guarded by env.

BEGIN;

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tables
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  display_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  room_type TEXT CHECK (room_type IN ('kitchen','bedroom','hall','bathroom','outdoor','other')) DEFAULT 'other',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.connected_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  room_id UUID REFERENCES public.rooms(id) ON DELETE SET NULL,
  device_name TEXT NOT NULL,
  device_type TEXT CHECK (device_type IN ('water','electricity','combo')) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.usage_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  room_id UUID REFERENCES public.rooms(id) ON DELETE SET NULL,
  device_id UUID REFERENCES public.connected_devices(id) ON DELETE SET NULL,
  reading_type TEXT CHECK (reading_type IN ('water','electricity')) NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  cost NUMERIC(12,2) DEFAULT 0,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.billing_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  water_usage NUMERIC(12,2) DEFAULT 0,
  electricity_usage NUMERIC(12,2) DEFAULT 0,
  water_cost NUMERIC(12,2) DEFAULT 0,
  electricity_cost NUMERIC(12,2) DEFAULT 0,
  total_amount NUMERIC(12,2) DEFAULT 0,
  status TEXT CHECK (status IN ('pending','paid','overdue')) DEFAULT 'pending',
  due_date DATE NOT NULL,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  prefers_units TEXT CHECK (prefers_units IN ('metric','imperial')) DEFAULT 'metric',
  theme TEXT CHECK (theme IN ('light','dark','system')) DEFAULT 'system',
  notifications_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.family_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  member_email TEXT NOT NULL,
  access_level TEXT CHECK (access_level IN ('view','edit','admin')) DEFAULT 'view',
  status TEXT CHECK (status IN ('pending','active','revoked')) DEFAULT 'pending',
  invited_at TIMESTAMPTZ DEFAULT NOW(),
  joined_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.community_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Functions
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, display_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'display_name')
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_settings (user_id) VALUES (NEW.id) ON CONFLICT DO NOTHING;
  RETURN NEW;
END; $$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE OR REPLACE TRIGGER trg_devices_updated_at BEFORE UPDATE ON public.connected_devices
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE OR REPLACE TRIGGER trg_user_settings_updated_at BEFORE UPDATE ON public.user_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE OR REPLACE TRIGGER trg_family_members_updated_at BEFORE UPDATE ON public.family_members
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS enable
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connected_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_replies ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY IF NOT EXISTS "select own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY IF NOT EXISTS "update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "room select" ON public.rooms FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "room modify" ON public.rooms FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "device select" ON public.connected_devices FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "device modify" ON public.connected_devices FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "usage select" ON public.usage_readings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "usage insert" ON public.usage_readings FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "billing select" ON public.billing_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "billing modify" ON public.billing_records FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "settings select" ON public.user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "settings modify" ON public.user_settings FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "family owner select" ON public.family_members FOR SELECT USING (auth.uid() = owner_user_id);
CREATE POLICY IF NOT EXISTS "family owner modify" ON public.family_members FOR ALL USING (auth.uid() = owner_user_id) WITH CHECK (auth.uid() = owner_user_id);

CREATE POLICY IF NOT EXISTS "posts select" ON public.community_posts FOR SELECT USING (TRUE);
CREATE POLICY IF NOT EXISTS "posts modify" ON public.community_posts FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "replies select" ON public.community_replies FOR SELECT USING (TRUE);
CREATE POLICY IF NOT EXISTS "replies modify" ON public.community_replies FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Views / Functions for Analytics
CREATE OR REPLACE VIEW public.v_usage_daily AS
SELECT user_id, reading_type,
       date_trunc('day', recorded_at) AS day,
       SUM(amount) AS total_amount,
       SUM(cost) AS total_cost
FROM public.usage_readings
GROUP BY user_id, reading_type, date_trunc('day', recorded_at);

CREATE OR REPLACE FUNCTION public.get_weekly_usage(p_user UUID)
RETURNS TABLE(label TEXT, water NUMERIC, electricity NUMERIC) AS $$
BEGIN
  RETURN QUERY
  WITH days AS (
    SELECT generate_series(date_trunc('day', NOW()) - INTERVAL '6 days', date_trunc('day', NOW()), INTERVAL '1 day') AS d
  ), agg AS (
    SELECT date_trunc('day', recorded_at) d, reading_type, SUM(amount) amt
    FROM usage_readings
    WHERE user_id = p_user
      AND recorded_at >= (NOW() - INTERVAL '7 days')
    GROUP BY 1,2
  )
  SELECT to_char(d.d, 'Dy') AS label,
         COALESCE(SUM(CASE WHEN reading_type='water' THEN amt END),0) AS water,
         COALESCE(SUM(CASE WHEN reading_type='electricity' THEN amt END),0) AS electricity
  FROM days d
  LEFT JOIN agg ON agg.d = d.d
  GROUP BY d.d
  ORDER BY d.d;
END; $$ LANGUAGE plpgsql SECURITY DEFINER;

COMMIT;
