-- Session, response, report, and audit-log tables (TRD section 4.2).

create table assessment_sessions (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references auth.users(id),
  discipline_id uuid not null references disciplines(id),
  status text not null default 'in_progress'
    check (status in ('in_progress', 'completed', 'abandoned')),
  started_at timestamptz not null default now(),
  completed_at timestamptz
);

create index idx_assessment_sessions_candidate_id
  on assessment_sessions(candidate_id);
create index idx_assessment_sessions_discipline_id
  on assessment_sessions(discipline_id);

create table session_questions (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references assessment_sessions(id) on delete cascade,
  question_bank_id uuid not null references question_bank(id),
  -- Null when Gemini scenario rewriting failed/was unavailable; the
  -- application falls back to question_bank.base_text in that case.
  generated_scenario_text text,
  sequence_no int not null,
  unique (session_id, sequence_no)
);

create index idx_session_questions_session_id
  on session_questions(session_id);
create index idx_session_questions_question_bank_id
  on session_questions(question_bank_id);

create table responses (
  id uuid primary key default gen_random_uuid(),
  session_question_id uuid not null references session_questions(id) on delete cascade,
  raw_response text not null,
  score numeric,
  ai_justification text,
  scored_at timestamptz
);

create index idx_responses_session_question_id
  on responses(session_question_id);

-- session_id is unique (one report per session), which already creates a
-- unique index covering FK lookups on this column; no separate index added.
create table reports (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references assessment_sessions(id) unique,
  pdf_storage_path text,
  domain_scores_json jsonb,
  strengths_json jsonb,
  growth_areas_json jsonb,
  narrative_text text,
  generated_at timestamptz
);

create table ai_call_log (
  id uuid primary key default gen_random_uuid(),
  -- nullable: propose-discipline-weights calls aren't session-scoped
  session_id uuid references assessment_sessions(id),
  function_name text not null,
  prompt_hash text not null,
  model_version text not null,
  response_summary text,
  created_at timestamptz not null default now()
);

create index idx_ai_call_log_session_id on ai_call_log(session_id);
