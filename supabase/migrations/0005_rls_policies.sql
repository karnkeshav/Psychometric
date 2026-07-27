-- Row-Level Security: default-deny on every table, explicit allow policies
-- only (TRD section 4.4, section 8).

create or replace function is_admin_or_sme()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from profiles
    where id = auth.uid()
      and role in ('admin', 'sme', 'super_admin')
  );
$$;

revoke all on function is_admin_or_sme() from public;
grant execute on function is_admin_or_sme() to authenticated;

-- profiles --------------------------------------------------------------
alter table profiles enable row level security;

create policy profiles_select_own on profiles
  for select using (id = auth.uid());

create policy profiles_update_own on profiles
  for update using (id = auth.uid());

create policy profiles_select_admin on profiles
  for select using (is_admin_or_sme());

-- programs ----------------------------------------------------------------
alter table programs enable row level security;

create policy programs_select_all on programs
  for select using (true);

create policy programs_write_admin on programs
  for all using (is_admin_or_sme()) with check (is_admin_or_sme());

-- disciplines ---------------------------------------------------------------
alter table disciplines enable row level security;

create policy disciplines_select_active on disciplines
  for select using (status = 'active');

create policy disciplines_select_admin on disciplines
  for select using (is_admin_or_sme());

create policy disciplines_write_admin on disciplines
  for insert with check (is_admin_or_sme());

create policy disciplines_update_admin on disciplines
  for update using (is_admin_or_sme()) with check (is_admin_or_sme());

create policy disciplines_delete_admin on disciplines
  for delete using (is_admin_or_sme());

-- skill_domains ---------------------------------------------------------
alter table skill_domains enable row level security;

create policy skill_domains_select_all on skill_domains
  for select using (true);

create policy skill_domains_write_admin on skill_domains
  for all using (is_admin_or_sme()) with check (is_admin_or_sme());

-- discipline_skill_weights ------------------------------------------------
-- Deliberately NOT candidate-readable: weight_pct would let a candidate
-- infer which domains are scored higher and answer strategically.
-- Candidates get only discipline_summary() (see migration 0006) instead.
alter table discipline_skill_weights enable row level security;

create policy discipline_skill_weights_select_admin on discipline_skill_weights
  for select using (is_admin_or_sme());

create policy discipline_skill_weights_write_admin on discipline_skill_weights
  for all using (is_admin_or_sme()) with check (is_admin_or_sme());

-- question_bank -----------------------------------------------------------
-- No candidate-facing policy at all: questions reach candidates only via
-- session_questions.generated_scenario_text, never a direct client query,
-- so scoring keys and rubrics stay hidden.
alter table question_bank enable row level security;

create policy question_bank_admin on question_bank
  for all using (is_admin_or_sme()) with check (is_admin_or_sme());

-- assessment_sessions -------------------------------------------------------
alter table assessment_sessions enable row level security;

create policy assessment_sessions_select_own on assessment_sessions
  for select using (candidate_id = auth.uid());

create policy assessment_sessions_insert_own on assessment_sessions
  for insert with check (candidate_id = auth.uid());

create policy assessment_sessions_update_own on assessment_sessions
  for update using (candidate_id = auth.uid());

create policy assessment_sessions_admin on assessment_sessions
  for all using (is_admin_or_sme()) with check (is_admin_or_sme());

-- session_questions -----------------------------------------------------
alter table session_questions enable row level security;

create policy session_questions_select_own on session_questions
  for select using (
    exists (
      select 1 from assessment_sessions s
      where s.id = session_questions.session_id
        and s.candidate_id = auth.uid()
    )
  );

create policy session_questions_insert_own on session_questions
  for insert with check (
    exists (
      select 1 from assessment_sessions s
      where s.id = session_questions.session_id
        and s.candidate_id = auth.uid()
    )
  );

create policy session_questions_admin on session_questions
  for all using (is_admin_or_sme()) with check (is_admin_or_sme());

-- responses ---------------------------------------------------------------
alter table responses enable row level security;

create policy responses_select_own on responses
  for select using (
    exists (
      select 1 from session_questions sq
      join assessment_sessions s on s.id = sq.session_id
      where sq.id = responses.session_question_id
        and s.candidate_id = auth.uid()
    )
  );

create policy responses_insert_own on responses
  for insert with check (
    exists (
      select 1 from session_questions sq
      join assessment_sessions s on s.id = sq.session_id
      where sq.id = responses.session_question_id
        and s.candidate_id = auth.uid()
    )
  );

create policy responses_update_own on responses
  for update using (
    exists (
      select 1 from session_questions sq
      join assessment_sessions s on s.id = sq.session_id
      where sq.id = responses.session_question_id
        and s.candidate_id = auth.uid()
    )
  );

create policy responses_admin on responses
  for all using (is_admin_or_sme()) with check (is_admin_or_sme());

-- reports -------------------------------------------------------------------
-- Candidates get read-only access; writes happen only via the
-- generate-report Edge Function using the service role key (bypasses RLS).
alter table reports enable row level security;

create policy reports_select_own on reports
  for select using (
    exists (
      select 1 from assessment_sessions s
      where s.id = reports.session_id
        and s.candidate_id = auth.uid()
    )
  );

create policy reports_admin on reports
  for all using (is_admin_or_sme()) with check (is_admin_or_sme());

-- ai_call_log ---------------------------------------------------------------
-- RLS enabled, zero client-facing policies: only the service role (which
-- bypasses RLS entirely) writes here, per TRD section 4.4.
alter table ai_call_log enable row level security;

create policy ai_call_log_admin_read on ai_call_log
  for select using (is_admin_or_sme());

-- discipline_requests ---------------------------------------------------
alter table discipline_requests enable row level security;

create policy discipline_requests_select_own on discipline_requests
  for select using (requested_by = auth.uid());

create policy discipline_requests_insert_own on discipline_requests
  for insert with check (requested_by = auth.uid());

create policy discipline_requests_admin on discipline_requests
  for all using (is_admin_or_sme()) with check (is_admin_or_sme());
