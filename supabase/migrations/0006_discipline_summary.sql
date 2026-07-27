-- Candidate-facing summary for the Pre-Assessment Instructions screen
-- (UX_Wireframes_User_Flow.md section 3.4): total question count and an
-- estimated duration, WITHOUT exposing discipline_skill_weights.weight_pct
-- or per-domain question_count, which would let a candidate infer which
-- domains are weighted higher and answer strategically.
--
-- Duration is derived from Content_Psychometric_Validation_Guide.md
-- section 5, Step 5: per-item time cost by question type (likert 15s,
-- mcq_sjt 50s, open_text 100s) + 2 min instructions + 1 min review,
-- rounded up to the nearest 5-minute band. Because the type split isn't
-- stored per discipline (only a total question_count per skill domain),
-- the function estimates each domain's type mix from the proportion of
-- active question_bank items of each type within that domain -- the same
-- blended-average approach the Content Guide's own worked example (section
-- 7) uses when an exact split isn't available.
create or replace function discipline_summary(p_discipline_id uuid)
returns table (total_questions int, estimated_minutes int)
language plpgsql
security definer
set search_path = public
stable
as $$
declare
  v_total_questions int;
  v_total_seconds numeric := 0;
  v_domain record;
  v_likert_count numeric;
  v_mcq_count numeric;
  v_open_count numeric;
  v_domain_active_count numeric;
begin
  select coalesce(sum(dsw.question_count), 0)
    into v_total_questions
    from discipline_skill_weights dsw
    where dsw.discipline_id = p_discipline_id;

  if v_total_questions = 0 then
    return query select 0, 0;
    return;
  end if;

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
      -- No active items yet for this domain; fall back to the Content
      -- Guide's own blended per-item average (~40s) used in its worked
      -- example rather than assuming a type split that doesn't exist yet.
      v_total_seconds := v_total_seconds + (v_domain.question_count * 40);
    else
      v_total_seconds := v_total_seconds
        + v_domain.question_count * (v_likert_count / v_domain_active_count) * 15
        + v_domain.question_count * (v_mcq_count / v_domain_active_count) * 50
        + v_domain.question_count * (v_open_count / v_domain_active_count) * 100;
    end if;
  end loop;

  v_total_seconds := v_total_seconds + 180; -- 2 min instructions + 1 min review

  return query
    select v_total_questions, (ceil((v_total_seconds / 60.0) / 5.0) * 5)::int;
end;
$$;

revoke all on function discipline_summary(uuid) from public;
grant execute on function discipline_summary(uuid) to authenticated;
