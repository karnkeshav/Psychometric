-- Reference tables: programs, disciplines, skill domains, discipline-skill
-- weight mappings, and candidate/admin profiles (TRD section 4.1, 4.3).
--
-- gen_random_uuid() is native to Postgres core since v13 (moved out of
-- pgcrypto). Supabase runs Postgres 14+ on every project, so no
-- `create extension pgcrypto` is required here.

create table programs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text not null unique,
  created_at timestamptz not null default now()
);

create table disciplines (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references programs(id),
  name text not null,
  status text not null default 'draft'
    check (status in ('draft', 'pending_review', 'active')),
  created_at timestamptz not null default now(),
  unique (program_id, name)
);

create index idx_disciplines_program_id on disciplines(program_id);

create table skill_domains (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  is_universal boolean not null default false
);

create table discipline_skill_weights (
  id uuid primary key default gen_random_uuid(),
  discipline_id uuid not null references disciplines(id),
  skill_domain_id uuid not null references skill_domains(id),
  weight_pct numeric not null check (weight_pct > 0 and weight_pct <= 100),
  question_count int not null check (question_count >= 3),
  unique (discipline_id, skill_domain_id)
);

create index idx_discipline_skill_weights_discipline_id
  on discipline_skill_weights(discipline_id);
create index idx_discipline_skill_weights_skill_domain_id
  on discipline_skill_weights(skill_domain_id);

-- profiles.id doubles as PK and FK to auth.users(id); the primary key
-- already provides an index, so no separate FK index is added.
create table profiles (
  id uuid primary key references auth.users(id),
  full_name text,
  role text not null default 'candidate'
    check (role in ('candidate', 'admin', 'sme', 'super_admin'))
);
