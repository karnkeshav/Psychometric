-- Phase 2 UI scaffold ONLY -- see docs/PRE_PRODUCTION_CHECKLIST.md.
--
-- question_bank has zero candidate-facing RLS policy (0005_rls_policies.sql):
-- "questions reach candidates only via session_questions.generated_
-- scenario_text, never a direct client query, so scoring keys and rubrics
-- stay hidden." The real architecture (TRD section 5.1/4.2) delivers
-- questions through a session row populated server-side by the
-- generate-scenario Edge Function, which doesn't exist yet (Phase 3+).
--
-- Until that exists, this SECURITY DEFINER function -- same pattern as
-- discipline_summary() -- lets the Phase 2 question-rendering UI read
-- question_bank without punching a hole in its RLS. It deliberately
-- selects ONLY id, domain name, type, base_text, and options_json (option
-- *text*, no scores). It never selects scoring_key_json or rubric_json --
-- those columns map answers to scores/rubric criteria and must never
-- reach a candidate's browser. Status includes 'draft' since no
-- 'active' content exists yet (matches supabase/seed.sql).
--
-- MUST be dropped -- not just tightened -- once Phase 3's session-based
-- question delivery exists. This function exposes the full draft/active
-- question bank per discipline to any authenticated candidate, bypassing
-- the intended session-scoped delivery model entirely; that's acceptable
-- only as a temporary scaffold with no real candidates yet.
create function discipline_questions(p_discipline_id uuid)
returns table (
  question_id uuid,
  skill_domain_name text,
  type text,
  base_text text,
  options_json jsonb,
  sequence_no int
)
language sql
security definer
set search_path = public
stable
as $$
  select
    qb.id,
    sd.name,
    qb.type,
    qb.base_text,
    qb.options_json,
    row_number() over (
      order by sd.is_universal desc, sd.name,
        case qb.type when 'likert' then 1 when 'mcq_sjt' then 2 when 'open_text' then 3 end
    )::int
  from discipline_skill_weights dsw
  join skill_domains sd on sd.id = dsw.skill_domain_id
  join question_bank qb on qb.skill_domain_id = dsw.skill_domain_id
  where dsw.discipline_id = p_discipline_id
    and qb.status in ('draft', 'active')
  order by sd.is_universal desc, sd.name,
    case qb.type when 'likert' then 1 when 'mcq_sjt' then 2 when 'open_text' then 3 end;
$$;

revoke all on function discipline_questions(uuid) from public;
grant execute on function discipline_questions(uuid) to authenticated;
