-- 0002_add_profile_insert_policy.sql
-- Adds missing INSERT policy required for PostgREST upsert (INSERT .. ON CONFLICT) on profiles
-- Also backfills any missing profile rows for existing auth.users.

BEGIN;

-- RLS upserts require INSERT permission even if the row already exists, because
-- PostgREST generates an INSERT ... ON CONFLICT DO UPDATE statement. Without an
-- INSERT policy, a client upsert will raise: "new row violates row-level security policy".
CREATE POLICY IF NOT EXISTS "insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Backfill: ensure every auth user has a profile row (service role bypasses RLS during migration)
INSERT INTO public.profiles (id, email, full_name, display_name)
SELECT u.id, u.email, u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'display_name'
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL;

COMMIT;
