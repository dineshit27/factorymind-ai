-- Water Management App Database Schema

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  display_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create water_usage table
CREATE TABLE IF NOT EXISTS public.water_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  device_id UUID REFERENCES public.devices(id) ON DELETE SET NULL,
  usage_amount DECIMAL(10,2) NOT NULL, -- in gallons or liters
  usage_type TEXT CHECK (usage_type IN ('shower', 'faucet', 'toilet', 'laundry', 'dishwasher', 'garden', 'other')) NOT NULL,
  location TEXT,
  cost_per_unit DECIMAL(8,4) DEFAULT 0.0, -- cost per gallon/liter
  total_cost DECIMAL(10,2) DEFAULT 0.0, -- calculated total cost
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb -- for additional data like temperature, pressure, etc.
);

-- Create devices table
CREATE TABLE IF NOT EXISTS public.devices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  device_name TEXT NOT NULL,
  device_type TEXT CHECK (device_type IN ('smart_meter', 'sensor', 'manual_entry')),
  location TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create water_goals table
CREATE TABLE IF NOT EXISTS public.water_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  -- AquaWatt Minimal Schema (October 2025)
  -- Clean, focused tables supporting Profile, Devices, Dashboard, Analytics, Billing, Community

  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  CREATE EXTENSION IF NOT EXISTS "pgcrypto";

  -- =============== TABLES ===============

  -- Profiles (extends auth.users)
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

  -- Rooms
  CREATE TABLE IF NOT EXISTS public.rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    room_type TEXT CHECK (room_type IN ('kitchen','bedroom','hall','bathroom','outdoor','other')) DEFAULT 'other',
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- Connected Devices
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

  -- Usage Readings (water liters or electricity kWh)
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

  -- Billing Records
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

  -- User Settings
  CREATE TABLE IF NOT EXISTS public.user_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    prefers_units TEXT CHECK (prefers_units IN ('metric','imperial')) DEFAULT 'metric',
    theme TEXT CHECK (theme IN ('light','dark','system')) DEFAULT 'system',
    notifications_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- Family Members
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

  -- Community Posts
  CREATE TABLE IF NOT EXISTS public.community_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- Community Replies
  CREATE TABLE IF NOT EXISTS public.community_replies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- =============== COMMON FUNCTIONS / TRIGGERS ===============

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
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'display_name');
    INSERT INTO public.user_settings (user_id) VALUES (NEW.id) ON CONFLICT DO NOTHING;
    RETURN NEW;
  END; $$ LANGUAGE plpgsql SECURITY DEFINER;

  CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

  -- Updated_at triggers
  CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  CREATE TRIGGER trg_devices_updated_at BEFORE UPDATE ON public.connected_devices
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  CREATE TRIGGER trg_user_settings_updated_at BEFORE UPDATE ON public.user_settings
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  CREATE TRIGGER trg_family_members_updated_at BEFORE UPDATE ON public.family_members
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

  -- =============== RLS POLICIES ===============

  ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "select own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
  CREATE POLICY "update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

  ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "room select" ON public.rooms FOR SELECT USING (auth.uid() = user_id);
  CREATE POLICY "room modify" ON public.rooms FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

  ALTER TABLE public.connected_devices ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "device select" ON public.connected_devices FOR SELECT USING (auth.uid() = user_id);
  CREATE POLICY "device modify" ON public.connected_devices FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

  ALTER TABLE public.usage_readings ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "usage select" ON public.usage_readings FOR SELECT USING (auth.uid() = user_id);
  CREATE POLICY "usage insert" ON public.usage_readings FOR INSERT WITH CHECK (auth.uid() = user_id);

  ALTER TABLE public.billing_records ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "billing select" ON public.billing_records FOR SELECT USING (auth.uid() = user_id);
  CREATE POLICY "billing modify" ON public.billing_records FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

  ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "settings select" ON public.user_settings FOR SELECT USING (auth.uid() = user_id);
  CREATE POLICY "settings modify" ON public.user_settings FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

  ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "family owner select" ON public.family_members FOR SELECT USING (auth.uid() = owner_user_id);
  CREATE POLICY "family owner modify" ON public.family_members FOR ALL USING (auth.uid() = owner_user_id) WITH CHECK (auth.uid() = owner_user_id);

  ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "posts select" ON public.community_posts FOR SELECT USING (TRUE);
  CREATE POLICY "posts modify" ON public.community_posts FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

  ALTER TABLE public.community_replies ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "replies select" ON public.community_replies FOR SELECT USING (TRUE);
  CREATE POLICY "replies modify" ON public.community_replies FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

  -- =============== ANALYTICS HELPERS (VIEWS/FUNCTIONS) ===============

  CREATE OR REPLACE VIEW public.v_usage_daily AS
  SELECT user_id, reading_type,
         date_trunc('day', recorded_at) AS day,
         SUM(amount) AS total_amount,
         SUM(cost) AS total_cost
  FROM public.usage_readings
  GROUP BY user_id, reading_type, date_trunc('day', recorded_at);

  -- Aggregate function for dashboard weekly trend
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

  -- =============== SEED DATA (Sample) ===============
  -- NOTE: Assumes at least one user exists; replace :USER_ID with a real UUID when running manually
  -- You can run a substitution or manually edit before executing if not using psql variable.

  -- Example seed block (wrap in DO to avoid failures if nothing to seed)
  DO $$
  DECLARE
    v_user UUID;
  BEGIN
    SELECT id INTO v_user FROM auth.users LIMIT 1;
    IF v_user IS NULL THEN
      RAISE NOTICE 'No auth.users present; seed skipped.';
      RETURN;
    END IF;

    -- Basic rooms (idempotent check)
    IF NOT EXISTS (SELECT 1 FROM rooms WHERE user_id = v_user) THEN
      INSERT INTO rooms (user_id, name, room_type) VALUES
        (v_user,'Kitchen','kitchen'),
        (v_user,'Bedroom','bedroom'),
        (v_user,'Hall','hall'),
        (v_user,'Bathroom','bathroom');
    END IF;

    -- Devices
    IF NOT EXISTS (SELECT 1 FROM connected_devices WHERE user_id = v_user) THEN
      INSERT INTO connected_devices (user_id, device_name, device_type, room_id, is_active)
      SELECT v_user,'Kitchen Faucet Sensor','water', r.id, TRUE FROM rooms r WHERE r.user_id=v_user AND r.name='Kitchen';
      INSERT INTO connected_devices (user_id, device_name, device_type, room_id, is_active)
      SELECT v_user,'Kitchen Power Meter','electricity', r.id, TRUE FROM rooms r WHERE r.user_id=v_user AND r.name='Kitchen';
      INSERT INTO connected_devices (user_id, device_name, device_type, room_id, is_active)
      SELECT v_user,'Bedroom Power Plug','electricity', r.id, TRUE FROM rooms r WHERE r.user_id=v_user AND r.name='Bedroom';
    END IF;

    -- Usage last 30 days (synthetic)
    IF NOT EXISTS (SELECT 1 FROM usage_readings WHERE user_id=v_user) THEN
      FOR i IN 0..29 LOOP
        INSERT INTO usage_readings (user_id, reading_type, amount, cost, recorded_at)
          VALUES (v_user,'water', (20 + random()*60)::NUMERIC(12,2), (5 + random()*10)::NUMERIC(12,2), NOW() - (i||' days')::INTERVAL);
        INSERT INTO usage_readings (user_id, reading_type, amount, cost, recorded_at)
          VALUES (v_user,'electricity', (10 + random()*30)::NUMERIC(12,2), (8 + random()*12)::NUMERIC(12,2), NOW() - (i||' days')::INTERVAL);
      END LOOP;
    END IF;

    -- Billing (current + 3 history)
    IF NOT EXISTS (SELECT 1 FROM billing_records WHERE user_id=v_user) THEN
      FOR m IN 0..3 LOOP
        INSERT INTO billing_records (
          user_id, period_start, period_end, water_usage, electricity_usage,
          water_cost, electricity_cost, total_amount, status, due_date
        ) VALUES (
          v_user,
          date_trunc('month', NOW() - (m||' months')::INTERVAL)::DATE,
          (date_trunc('month', NOW() - (m||' months')::INTERVAL) + INTERVAL '1 month - 1 day')::DATE,
          (500 + random()*300)::NUMERIC(12,2),
          (150 + random()*120)::NUMERIC(12,2),
          (1500 + random()*500)::NUMERIC(12,2),
          (2000 + random()*800)::NUMERIC(12,2),
          (3500 + random()*900)::NUMERIC(12,2),
          CASE WHEN m=0 THEN 'pending' ELSE 'paid' END,
          (date_trunc('month', NOW() - (m||' months')::INTERVAL) + INTERVAL '1 month + 15 days')::DATE
        );
      END LOOP;
    END IF;

    -- Community sample
    IF NOT EXISTS (SELECT 1 FROM community_posts WHERE user_id=v_user) THEN
      INSERT INTO community_posts (user_id, title, content) VALUES
        (v_user,'Welcome to AquaWatt','Share your conservation tips here!'),
        (v_user,'Leak Detection Tips','How to quickly spot and fix leaks.');
    END IF;
  END $$;

  -- =============== END SCHEMA ===============
-- Triggers for updated_at
