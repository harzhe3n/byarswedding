-- =====================================================================
-- Byar & Lanya wedding invitation — Supabase setup
-- Run once: Supabase dashboard → SQL Editor → New query → paste → Run.
--
-- Security model: the website only uses the public (anon) key. Row Level
-- Security is ON with no public policies, so nobody can read or edit the
-- table directly. Guests can only call the two functions below:
--   track_visit    → counts this browser once, returns the visitor total
--   visitor_count  → returns the visitor total (a single number)
-- =====================================================================

-- One row per browser (an anonymous random id, no personal data).
create table if not exists public.visitors (
  id           uuid primary key,
  first_seen   timestamptz not null default now(),
  last_seen    timestamptz not null default now(),
  visit_count  integer     not null default 1
);


alter table public.visitors enable row level security;
-- (No policies on purpose: direct table access is blocked for the public key.)

-- ---------------------------------------------------------------------
-- Counts a visit. Repeat visits from the same browser only bump
-- last_seen / visit_count, so the total is unique visitors.
-- ---------------------------------------------------------------------
create or replace function public.track_visit(p_visitor uuid)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into visitors (id) values (p_visitor)
  on conflict (id) do update
    set last_seen = now(), visit_count = visitors.visit_count + 1;
  return (select count(*) from visitors);
end;
$$;

create or replace function public.visitor_count()
returns bigint
language sql
stable
security definer
set search_path = public
as $$
  select count(*) from visitors;
$$;

-- Only these two functions are callable with the public key.
revoke all on function public.track_visit(uuid) from public;
revoke all on function public.visitor_count() from public;
grant execute on function public.track_visit(uuid) to anon, authenticated;
grant execute on function public.visitor_count() to anon, authenticated;

