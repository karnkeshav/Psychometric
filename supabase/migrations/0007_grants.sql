-- Base Postgres table privileges for the `authenticated` role.
--
-- RLS policies (migration 0005) only filter ROWS; they do nothing until the
-- calling role also has the underlying table-level GRANT. Supabase's own
-- bootstrap grants `authenticated` only Dxtm (delete-trigger/references/
-- trigger/maintain) on every table by default -- select/insert/update/
-- delete must be granted explicitly per table. Without this migration,
-- every query from a logged-in candidate or admin fails with a hard
-- "permission denied" before RLS is ever evaluated.
--
-- Grants below are deliberately generous per table (all four DML verbs
-- where any policy on that table uses any of them) -- the actual
-- candidate-vs-admin boundary is enforced by the RLS policies themselves,
-- not by which verbs are granted here. `anon` gets nothing: FR-01 requires
-- login before any of this data is touched.

-- No INSERT grant: 0005 defines no INSERT policy on profiles (profile
-- creation is expected to happen via a security-definer trigger on
-- auth.users in Phase 2, which bypasses grants/RLS entirely -- revisit
-- this if that trigger isn't how Phase 2 ends up creating profile rows).
grant select, update on profiles to authenticated;

grant select, insert, update, delete on programs to authenticated;
grant select, insert, update, delete on disciplines to authenticated;
grant select, insert, update, delete on skill_domains to authenticated;

-- Candidates get zero matching policies on these two (by design, see
-- 0005) so the grant alone doesn't leak anything -- RLS still returns 0
-- rows for a non-admin caller.
grant select, insert, update, delete on discipline_skill_weights to authenticated;
grant select, insert, update, delete on question_bank to authenticated;

grant select, insert, update, delete on assessment_sessions to authenticated;
grant select, insert, update, delete on session_questions to authenticated;
grant select, insert, update, delete on responses to authenticated;
grant select, insert, update, delete on reports to authenticated;

-- Insert-only from Edge Functions via the service_role key, which already
-- bypasses RLS and holds its own broad grants -- authenticated only needs
-- read, for the admin-read policy in 0005 to be reachable at all.
grant select on ai_call_log to authenticated;

grant select, insert, update, delete on discipline_requests to authenticated;
