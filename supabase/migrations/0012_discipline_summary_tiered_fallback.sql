-- Fixes discipline_summary()'s fallback time estimate for disciplines with
-- no active question_bank items yet (today's actual state -- everything in
-- supabase/seed.sql is status='draft'). The previous fallback applied a
-- flat ~40s/question to every question in every domain, which collapses
-- the exact distinction Content Guide section 2 uses to justify a higher
-- time standard for professional/technical branches: 30 questions all at
-- ~40s rounds to a 25-30 minute band, identical to general-academic
-- branches, instead of the documented 30-35 minute standard (section 6.2).
--
-- Fix: when NO domain in the discipline has any active items yet, compute
-- the estimate using the discipline-wide closed/open-text split fixed by
-- section 5 Steps 3-4 (open-text capped at 3 items for the 30-question
-- professional/technical target, 2 for the 28-question general-academic
-- target) at ~40s/closed item + 100s/open-text item -- the same
-- blended-average method section 7's worked example uses -- rather than
-- treating every question as an undifferentiated ~40s item. Once real
-- active content exists anywhere in the discipline, the existing
-- per-domain type-mix calculation (unchanged below) takes over, since only
-- question_bank actually records each item's real type.
--
-- Signature is unchanged from 0011, so this is a plain CREATE OR REPLACE
-- (no drop needed).
create or replace function discipline_summary(p_discipline_id uuid)
returns table (
  total_questions int,
  estimated_minutes_low int,
  estimated_minutes_high int,
  domain_names text[]
)
language plpgsql
security definer
set search_path = public
stable
as $$
declare
  v_total_questions int;
  v_total_seconds numeric := 0;
  v_estimated_low int;
  v_domain_names text[];
  v_domain record;
  v_likert_count numeric;
  v_mcq_count numeric;
  v_open_count numeric;
  v_domain_active_count numeric;
  v_discipline_active_count int;
  v_fallback_open_count int;
  v_fallback_closed_count int;
begin
  select coalesce(sum(dsw.question_count), 0)
    into v_total_questions
    from discipline_skill_weights dsw
    where dsw.discipline_id = p_discipline_id;

  if v_total_questions = 0 then
    return query select 0, 0, 0, array[]::text[];
    return;
  end if;

  select array_agg(sd.name order by sd.is_universal desc, sd.name)
    into v_domain_names
    from discipline_skill_weights dsw
    join skill_domains sd on sd.id = dsw.skill_domain_id
    where dsw.discipline_id = p_discipline_id;

  select count(*)
    into v_discipline_active_count
    from discipline_skill_weights dsw
    join question_bank qb on qb.skill_domain_id = dsw.skill_domain_id
    where dsw.discipline_id = p_discipline_id
      and qb.status = 'active';

  if v_discipline_active_count = 0 then
    v_fallback_open_count := case when v_total_questions >= 30 then 3 else 2 end;
    v_fallback_closed_count := v_total_questions - v_fallback_open_count;
    v_total_seconds := v_fallback_closed_count * 40 + v_fallback_open_count * 100;
  else
    for v_domain in
      select dsw.skill_domain_id, dsw.question_count
        from discipline_skill_weights dsw
        where dsw.discipline_id = p_discipline_id
    loop
      select
        count(*) filter (where qb.type = 'likert'),
        count(*) filter (where qb.type = 'mcq_sjt'),
        count(*) filter (where qb.type = 'open_text'),
        count(*)
        into v_likert_count, v_mcq_count, v_open_count, v_domain_active_count
        from question_bank qb
        where qb.skill_domain_id = v_domain.skill_domain_id
          and qb.status = 'active';

      if v_domain_active_count = 0 then
        -- This specific domain still has no active items even though the
        -- discipline overall does -- fall back to a per-domain ~40s/item
        -- approximation. A partial-rollout state, not the norm today.
        v_total_seconds := v_total_seconds + (v_domain.question_count * 40);
      else
        v_total_seconds := v_total_seconds
          + v_domain.question_count * (v_likert_count / v_domain_active_count) * 15
          + v_domain.question_count * (v_mcq_count / v_domain_active_count) * 50
          + v_domain.question_count * (v_open_count / v_domain_active_count) * 100;
      end if;
    end loop;
  end if;

  v_total_seconds := v_total_seconds + 180; -- 2 min instructions + 1 min review
  v_estimated_low := (ceil((v_total_seconds / 60.0) / 5.0) * 5)::int;

  return query
    select v_total_questions, v_estimated_low, v_estimated_low + 5, v_domain_names;
end;
$$;

revoke all on function discipline_summary(uuid) from public;
grant execute on function discipline_summary(uuid) to authenticated;
