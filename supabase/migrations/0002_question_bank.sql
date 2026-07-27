-- Core validated question bank (TRD section 4.1). Per-type fields are
-- stored as JSONB rather than split into per-type tables; the check
-- constraint below enforces which fields are required/forbidden per type
-- so a malformed item can't reach 'active' status.

create table question_bank (
  id uuid primary key default gen_random_uuid(),
  skill_domain_id uuid not null references skill_domains(id),
  type text not null check (type in ('likert', 'mcq_sjt', 'open_text')),
  base_text text not null,
  options_json jsonb,
  scoring_key_json jsonb,
  rubric_json jsonb,
  difficulty text check (difficulty in ('easy', 'medium', 'hard')),
  status text not null default 'draft'
    check (status in ('draft', 'active', 'retired')),
  created_at timestamptz not null default now(),
  constraint question_bank_type_fields_check check (
    (type = 'likert'
      and options_json is null
      and rubric_json is null
      and scoring_key_json is not null)
    or (type = 'mcq_sjt'
      and options_json is not null
      and scoring_key_json is not null
      and rubric_json is null)
    or (type = 'open_text'
      and rubric_json is not null
      and options_json is null
      and scoring_key_json is null)
  )
);

create index idx_question_bank_skill_domain_id
  on question_bank(skill_domain_id);
