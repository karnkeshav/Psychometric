-- Auto-creates a profiles row on signup (FR-01). Closes the gap flagged in
-- 0007_grants.sql: profiles has no INSERT policy/grant for authenticated,
-- by design -- row creation happens here, as a security-definer trigger on
-- auth.users, which bypasses RLS/grants entirely.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

-- Not callable directly -- only Postgres' trigger mechanism invokes this,
-- which runs regardless of EXECUTE grants. Revoking prevents a client from
-- calling it as an RPC to insert an arbitrary profiles row for another uid.
revoke all on function public.handle_new_user() from public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
