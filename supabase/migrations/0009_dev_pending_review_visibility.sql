-- DEV-ONLY: lets authenticated candidates SELECT disciplines with
-- status = 'pending_review', in addition to the production
-- disciplines_select_active policy from 0005_rls_policies.sql.
--
-- Exists solely so Phase 2 local/staging frontend work has real discipline
-- rows to render before SME review flips them to 'active' (all 16 seeded
-- disciplines are currently 'pending_review' -- see supabase/seed.sql).
--
-- MUST be dropped before production -- tracked in
-- docs/PRE_PRODUCTION_CHECKLIST.md. Production candidates must only ever
-- see status = 'active' disciplines.
create policy disciplines_select_pending_review_dev on disciplines
  for select using (status = 'pending_review');
