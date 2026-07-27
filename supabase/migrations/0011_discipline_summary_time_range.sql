-- Replaces the single estimated_minutes value with a range
-- (estimated_minutes_low/high) per Content Guide section 5, Step 5's own
-- worked example (section 7): the raw computed time is rounded up to the
-- nearest 5-minute band, then published as that band *to* band+5 "to
-- allow for slower readers" -- e.g. Journalism's ~22 raw minutes becomes
-- "25-30 minutes", matching UX_Wireframes_User_Flow.md section 3.4's
-- example exactly. Previously the function only returned the low bound.
--
-- Same RETURNS TABLE column-set change as 0010 -- drop and recreate.
drop function if exists discipline_summary(uuid);

create function discipline_summary(p_discipline_id uuid)
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
  v_estimated_low := (ceil((v_total_seconds / 60.0) / 5.0) * 5)::int;

  return query
    select v_total_questions, v_estimated_low, v_estimated_low + 5, v_domain_names;
end;
$$;

revoke all on function discipline_summary(uuid) from public;
grant execute on function discipline_summary(uuid) to authenticated;
