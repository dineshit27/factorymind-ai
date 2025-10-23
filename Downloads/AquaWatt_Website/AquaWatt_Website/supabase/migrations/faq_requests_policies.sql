-- FAQ requests table (if not exists)
-- Adjust table creation if you already created it via UI
create table if not exists public.faq_requests (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  user_id uuid null references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

-- Basic validation (length constraints)
alter table public.faq_requests
  add constraint question_min_len check (char_length(question) >= 8),
  add constraint question_max_len check (char_length(question) <= 1000);

-- Enable RLS
alter table public.faq_requests enable row level security;

-- Policy: anyone can insert a question (optionally require auth)
create policy faq_requests_insert_anyone on public.faq_requests
  for insert
  to public
  with check (true);

-- Policy: only service_role or admin can select all
-- Replace 'admin' check with your preferred claim/role system
create policy faq_requests_select_admin on public.faq_requests
  for select
  using (
    coalesce(
      (auth.jwt() ->> 'role') = 'service_role' or (auth.jwt() ->> 'role') = 'admin',
      false
    )
  );

-- Optional: allow users to read back only their own submitted entries
create policy faq_requests_select_own on public.faq_requests
  for select
  using (user_id = auth.uid());

-- Rate limit: allow at most 3 requests per 10 minutes per user (or IP if unauth)
-- This trigger prevents excessive inserts
create or replace function public.enforce_faq_requests_rate_limit()
returns trigger as $$
begin
  -- Only apply per-user rule when user_id is present
  if new.user_id is not null then
    if (
      select count(*) from public.faq_requests
      where user_id = new.user_id and created_at > now() - interval '10 minutes'
    ) >= 3 then
      raise exception 'Rate limit exceeded: Please try again in a few minutes';
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_faq_requests_rate_limit on public.faq_requests;
create trigger trg_faq_requests_rate_limit
before insert on public.faq_requests
for each row execute function public.enforce_faq_requests_rate_limit();
