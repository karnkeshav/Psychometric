-- ============================================================
-- Local/dev seed data — Phase 2 placeholder content
-- ============================================================
-- Source: docs/Content_Psychometric_Validation_Guide.md §3, §5, §6
--         docs/BRD_Requirements_Document.md §3 (in-scope programs)
--
-- IMPORTANT — everything below is PLACEHOLDER data, not launch content:
--
--   • disciplines.status = 'pending_review', not 'active'. The
--     weight_pct / question_count values in discipline_skill_weights
--     are computed by mechanically applying the §5 default methodology
--     (default weights, round(weight% × total), floor-of-3-per-domain)
--     to every discipline — the same procedure the §7 worked example
--     (B.A. Journalism) walks through by hand. For the 30-question
--     professional/technical branches, naive rounding of the default
--     weights overshoots the total by 2, so a largest-remainder
--     (Hamilton) apportionment is applied to bring EI and Collaboration
--     & Teamwork up to 4 each instead of the naive 5/5 on Communication
--     and Critical Thinking — this is a computed stand-in, NOT SME
--     output. Flip a discipline to 'active' only once Content Guide
--     §10's SME Review Checklist has actually been run against it.
--
--   • question_bank rows are draft placeholders (status='draft', the
--     column default): 3 items per skill domain (one likert, one
--     mcq_sjt, one open_text) so Phase 2 UI has real rows to render,
--     NOT the validated question bank (Project Plan Phase 1 SME work).
--     base_text is tagged "[DRAFT]" so nobody mistakes these for real
--     content. Every domain gets all 3 types for UI-coverage purposes,
--     even domains that wouldn't actually get an open-text item in the
--     real per-branch blueprint.
--
-- See supabase/seed_notes.md for how 'pending_review' interacts with
-- Phase 2 frontend queries, and for remote-seeding behavior.

-- ------------------------------------------------------------
-- 1. programs (8)
-- ------------------------------------------------------------
insert into programs (name, code) values
  ('B.A.', 'ba'),
  ('B.Sc.', 'bsc'),
  ('B.Com.', 'bcom'),
  ('BBA', 'bba'),
  ('B.Tech / B.E.', 'btech'),
  ('MBBS', 'mbbs'),
  ('B.Pharm', 'bpharm'),
  ('LLB / BA LLB', 'llb')
on conflict (code) do nothing;

-- ------------------------------------------------------------
-- 2. skill_domains (29): 6 universal (Content Guide §3) + 23
--    discipline-specific (Content Guide §6, de-duplicated by exact
--    name — several are intentionally reused across disciplines,
--    e.g. "Attention to Detail" appears in 5 different branches).
-- ------------------------------------------------------------
insert into skill_domains (name, description, is_universal) values
  ('Communication', 'Clarity of expression, active listening, audience awareness', true),
  ('Critical Thinking & Problem-Solving', 'Structured reasoning, evaluating options, drawing sound conclusions', true),
  ('Emotional Intelligence', 'Self-awareness, empathy, managing emotional reactions under pressure', true),
  ('Collaboration & Teamwork', 'Working effectively with others, handling disagreement constructively', true),
  ('Adaptability & Resilience', 'Responding to change, recovering from setbacks', true),
  ('Time Management & Prioritization', 'Organizing tasks, meeting deadlines, judging urgency vs. importance', true),
  ('Persuasive Storytelling', null, false),
  ('Research & Verification Mindset', null, false),
  ('Empathy & Active Listening', null, false),
  ('Ethical Sensitivity', null, false),
  ('Analytical/Numerical Reasoning', null, false),
  ('Data Interpretation', null, false),
  ('Attention to Detail', null, false),
  ('Analytical Rigor', null, false),
  ('Analytical Reasoning', null, false),
  ('Systematic Problem-Solving', null, false),
  ('Logical Problem-Solving', null, false),
  ('Numerical Reasoning', null, false),
  ('Ethical Integrity', null, false),
  ('Data-Driven Decision Making', null, false),
  ('Leadership Potential', null, false),
  ('Negotiation & Influence', null, false),
  ('Practical/Applied Reasoning', null, false),
  ('Risk Assessment', null, false),
  ('Empathy & Stress Tolerance', null, false),
  ('Ethical Reasoning', null, false),
  ('Precision & Regulatory Compliance Mindset', null, false),
  ('Ethical Reasoning & Argumentation', null, false),
  ('Persuasive Communication', null, false)
on conflict (name) do nothing;

-- ------------------------------------------------------------
-- 3. disciplines (16) — status='pending_review'.
--    Life Sciences is seeded twice (under B.A. and under B.Sc.) per
--    Content Guide §6.1's "B.A. / B.Sc." program listing: since
--    disciplines.program_id is single-valued, offering one discipline
--    under two degree tracks requires two rows. unique(program_id,
--    name) makes this safe (no collision with the other's uniqueness).
-- ------------------------------------------------------------
insert into disciplines (program_id, name, status)
select p.id, d.name, 'pending_review'
from (values
  ('ba', 'Journalism & Mass Communication'),
  ('ba', 'Psychology'),
  ('ba', 'Economics'),
  ('ba', 'Life Sciences'),
  ('bsc', 'Life Sciences'),
  ('bsc', 'Physics'),
  ('bsc', 'Computer Science'),
  ('bcom', 'Accounting & Finance'),
  ('bcom', 'Business Analytics'),
  ('bba', 'General Management'),
  ('btech', 'Computer Science Engineering'),
  ('btech', 'Mechanical Engineering'),
  ('btech', 'Civil Engineering'),
  ('mbbs', 'General Medicine'),
  ('bpharm', 'Pharmacy'),
  ('llb', 'Law')
) as d(program_code, name)
join programs p on p.code = d.program_code
on conflict (program_id, name) do nothing;

-- ------------------------------------------------------------
-- 4. discipline_skill_weights (128 = 16 disciplines × 8 domains).
--    General-academic branches (28 total): Communication 15%→4,
--    Critical Thinking 15%→4, EI 12%→3, Collaboration 12%→3,
--    Adaptability 10%→3, Time Mgmt 8%→3 (floor-raised from round(2.24)=2),
--    + 2 specific domains at 14%→4 each. Matches Content Guide §7's
--    worked Journalism example exactly.
--    Professional/technical branches (30 total): same weight_pct
--    targets, but 30 doesn't divide evenly — naive rounding gives
--    Communication 5, Critical Thinking 5, EI 3, Collaboration 3,
--    summing to 32. Largest-remainder reconciliation moves the extra
--    seats from Communication/Critical Thinking (weakest rounding
--    justification, smallest fractional remainder among the rounded-up
--    domains) to EI and Collaboration (largest remainders), landing on
--    Communication 4, Critical Thinking 4, EI 4, Collaboration 4,
--    Adaptability 3, Time Mgmt 3, + 2 specific domains at 4 each = 30.
-- ------------------------------------------------------------
insert into discipline_skill_weights (discipline_id, skill_domain_id, weight_pct, question_count)
select disc.id, sd.id, w.weight_pct, w.question_count
from (values
  -- B.A. Journalism & Mass Communication (general academic, 28)
  ('ba','Journalism & Mass Communication','Communication',15,4),
  ('ba','Journalism & Mass Communication','Critical Thinking & Problem-Solving',15,4),
  ('ba','Journalism & Mass Communication','Emotional Intelligence',12,3),
  ('ba','Journalism & Mass Communication','Collaboration & Teamwork',12,3),
  ('ba','Journalism & Mass Communication','Adaptability & Resilience',10,3),
  ('ba','Journalism & Mass Communication','Time Management & Prioritization',8,3),
  ('ba','Journalism & Mass Communication','Persuasive Storytelling',14,4),
  ('ba','Journalism & Mass Communication','Research & Verification Mindset',14,4),
  -- B.A. Psychology (general academic, 28)
  ('ba','Psychology','Communication',15,4),
  ('ba','Psychology','Critical Thinking & Problem-Solving',15,4),
  ('ba','Psychology','Emotional Intelligence',12,3),
  ('ba','Psychology','Collaboration & Teamwork',12,3),
  ('ba','Psychology','Adaptability & Resilience',10,3),
  ('ba','Psychology','Time Management & Prioritization',8,3),
  ('ba','Psychology','Empathy & Active Listening',14,4),
  ('ba','Psychology','Ethical Sensitivity',14,4),
  -- B.A. Economics (general academic, 28)
  ('ba','Economics','Communication',15,4),
  ('ba','Economics','Critical Thinking & Problem-Solving',15,4),
  ('ba','Economics','Emotional Intelligence',12,3),
  ('ba','Economics','Collaboration & Teamwork',12,3),
  ('ba','Economics','Adaptability & Resilience',10,3),
  ('ba','Economics','Time Management & Prioritization',8,3),
  ('ba','Economics','Analytical/Numerical Reasoning',14,4),
  ('ba','Economics','Data Interpretation',14,4),
  -- B.A. Life Sciences (general academic, 28)
  ('ba','Life Sciences','Communication',15,4),
  ('ba','Life Sciences','Critical Thinking & Problem-Solving',15,4),
  ('ba','Life Sciences','Emotional Intelligence',12,3),
  ('ba','Life Sciences','Collaboration & Teamwork',12,3),
  ('ba','Life Sciences','Adaptability & Resilience',10,3),
  ('ba','Life Sciences','Time Management & Prioritization',8,3),
  ('ba','Life Sciences','Attention to Detail',14,4),
  ('ba','Life Sciences','Analytical Rigor',14,4),
  -- B.Sc. Life Sciences (general academic, 28)
  ('bsc','Life Sciences','Communication',15,4),
  ('bsc','Life Sciences','Critical Thinking & Problem-Solving',15,4),
  ('bsc','Life Sciences','Emotional Intelligence',12,3),
  ('bsc','Life Sciences','Collaboration & Teamwork',12,3),
  ('bsc','Life Sciences','Adaptability & Resilience',10,3),
  ('bsc','Life Sciences','Time Management & Prioritization',8,3),
  ('bsc','Life Sciences','Attention to Detail',14,4),
  ('bsc','Life Sciences','Analytical Rigor',14,4),
  -- B.Sc. Physics (general academic, 28)
  ('bsc','Physics','Communication',15,4),
  ('bsc','Physics','Critical Thinking & Problem-Solving',15,4),
  ('bsc','Physics','Emotional Intelligence',12,3),
  ('bsc','Physics','Collaboration & Teamwork',12,3),
  ('bsc','Physics','Adaptability & Resilience',10,3),
  ('bsc','Physics','Time Management & Prioritization',8,3),
  ('bsc','Physics','Analytical Reasoning',14,4),
  ('bsc','Physics','Systematic Problem-Solving',14,4),
  -- B.Sc. Computer Science (general academic, 28)
  ('bsc','Computer Science','Communication',15,4),
  ('bsc','Computer Science','Critical Thinking & Problem-Solving',15,4),
  ('bsc','Computer Science','Emotional Intelligence',12,3),
  ('bsc','Computer Science','Collaboration & Teamwork',12,3),
  ('bsc','Computer Science','Adaptability & Resilience',10,3),
  ('bsc','Computer Science','Time Management & Prioritization',8,3),
  ('bsc','Computer Science','Logical Problem-Solving',14,4),
  ('bsc','Computer Science','Attention to Detail',14,4),
  -- B.Com. Accounting & Finance (general academic, 28)
  ('bcom','Accounting & Finance','Communication',15,4),
  ('bcom','Accounting & Finance','Critical Thinking & Problem-Solving',15,4),
  ('bcom','Accounting & Finance','Emotional Intelligence',12,3),
  ('bcom','Accounting & Finance','Collaboration & Teamwork',12,3),
  ('bcom','Accounting & Finance','Adaptability & Resilience',10,3),
  ('bcom','Accounting & Finance','Time Management & Prioritization',8,3),
  ('bcom','Accounting & Finance','Numerical Reasoning',14,4),
  ('bcom','Accounting & Finance','Ethical Integrity',14,4),
  -- B.Com. Business Analytics (general academic, 28)
  ('bcom','Business Analytics','Communication',15,4),
  ('bcom','Business Analytics','Critical Thinking & Problem-Solving',15,4),
  ('bcom','Business Analytics','Emotional Intelligence',12,3),
  ('bcom','Business Analytics','Collaboration & Teamwork',12,3),
  ('bcom','Business Analytics','Adaptability & Resilience',10,3),
  ('bcom','Business Analytics','Time Management & Prioritization',8,3),
  ('bcom','Business Analytics','Data-Driven Decision Making',14,4),
  ('bcom','Business Analytics','Analytical Reasoning',14,4),
  -- BBA General Management (general academic, 28)
  ('bba','General Management','Communication',15,4),
  ('bba','General Management','Critical Thinking & Problem-Solving',15,4),
  ('bba','General Management','Emotional Intelligence',12,3),
  ('bba','General Management','Collaboration & Teamwork',12,3),
  ('bba','General Management','Adaptability & Resilience',10,3),
  ('bba','General Management','Time Management & Prioritization',8,3),
  ('bba','General Management','Leadership Potential',14,4),
  ('bba','General Management','Negotiation & Influence',14,4),
  -- B.Tech/B.E. Computer Science Engineering (professional/technical, 30)
  ('btech','Computer Science Engineering','Communication',15,4),
  ('btech','Computer Science Engineering','Critical Thinking & Problem-Solving',15,4),
  ('btech','Computer Science Engineering','Emotional Intelligence',12,4),
  ('btech','Computer Science Engineering','Collaboration & Teamwork',12,4),
  ('btech','Computer Science Engineering','Adaptability & Resilience',10,3),
  ('btech','Computer Science Engineering','Time Management & Prioritization',8,3),
  ('btech','Computer Science Engineering','Systematic Problem-Solving',14,4),
  ('btech','Computer Science Engineering','Attention to Detail',14,4),
  -- B.Tech/B.E. Mechanical Engineering (professional/technical, 30)
  ('btech','Mechanical Engineering','Communication',15,4),
  ('btech','Mechanical Engineering','Critical Thinking & Problem-Solving',15,4),
  ('btech','Mechanical Engineering','Emotional Intelligence',12,4),
  ('btech','Mechanical Engineering','Collaboration & Teamwork',12,4),
  ('btech','Mechanical Engineering','Adaptability & Resilience',10,3),
  ('btech','Mechanical Engineering','Time Management & Prioritization',8,3),
  ('btech','Mechanical Engineering','Practical/Applied Reasoning',14,4),
  ('btech','Mechanical Engineering','Systematic Problem-Solving',14,4),
  -- B.Tech/B.E. Civil Engineering (professional/technical, 30)
  ('btech','Civil Engineering','Communication',15,4),
  ('btech','Civil Engineering','Critical Thinking & Problem-Solving',15,4),
  ('btech','Civil Engineering','Emotional Intelligence',12,4),
  ('btech','Civil Engineering','Collaboration & Teamwork',12,4),
  ('btech','Civil Engineering','Adaptability & Resilience',10,3),
  ('btech','Civil Engineering','Time Management & Prioritization',8,3),
  ('btech','Civil Engineering','Risk Assessment',14,4),
  ('btech','Civil Engineering','Attention to Detail',14,4),
  -- MBBS General Medicine (professional/technical, 30)
  ('mbbs','General Medicine','Communication',15,4),
  ('mbbs','General Medicine','Critical Thinking & Problem-Solving',15,4),
  ('mbbs','General Medicine','Emotional Intelligence',12,4),
  ('mbbs','General Medicine','Collaboration & Teamwork',12,4),
  ('mbbs','General Medicine','Adaptability & Resilience',10,3),
  ('mbbs','General Medicine','Time Management & Prioritization',8,3),
  ('mbbs','General Medicine','Empathy & Stress Tolerance',14,4),
  ('mbbs','General Medicine','Ethical Reasoning',14,4),
  -- B.Pharm Pharmacy (professional/technical, 30)
  ('bpharm','Pharmacy','Communication',15,4),
  ('bpharm','Pharmacy','Critical Thinking & Problem-Solving',15,4),
  ('bpharm','Pharmacy','Emotional Intelligence',12,4),
  ('bpharm','Pharmacy','Collaboration & Teamwork',12,4),
  ('bpharm','Pharmacy','Adaptability & Resilience',10,3),
  ('bpharm','Pharmacy','Time Management & Prioritization',8,3),
  ('bpharm','Pharmacy','Precision & Regulatory Compliance Mindset',14,4),
  ('bpharm','Pharmacy','Attention to Detail',14,4),
  -- LLB/BA LLB Law (professional/technical, 30)
  ('llb','Law','Communication',15,4),
  ('llb','Law','Critical Thinking & Problem-Solving',15,4),
  ('llb','Law','Emotional Intelligence',12,4),
  ('llb','Law','Collaboration & Teamwork',12,4),
  ('llb','Law','Adaptability & Resilience',10,3),
  ('llb','Law','Time Management & Prioritization',8,3),
  ('llb','Law','Ethical Reasoning & Argumentation',14,4),
  ('llb','Law','Persuasive Communication',14,4)
) as w(program_code, discipline_name, domain_name, weight_pct, question_count)
join programs p on p.code = w.program_code
join disciplines disc on disc.program_id = p.id and disc.name = w.discipline_name
join skill_domains sd on sd.name = w.domain_name
on conflict (discipline_id, skill_domain_id) do nothing;

-- ------------------------------------------------------------
-- 5. question_bank (87 = 29 domains × 3 draft placeholder items:
--    one likert, one mcq_sjt, one open_text per domain).
--    Not idempotent via a unique constraint (none exists on this
--    table), so guarded with NOT EXISTS to avoid duplicate rows if
--    this file is ever run twice without a full db reset.
-- ------------------------------------------------------------
insert into question_bank (skill_domain_id, type, base_text, options_json, scoring_key_json, rubric_json, difficulty, status)
select sd.id, t.type, format(t.base_text_template, sd.name),
       t.options_json, t.scoring_key_json, t.rubric_json, 'medium', 'draft'
from skill_domains sd
cross join (values
  (
    'likert',
    '[DRAFT] I find it easy to demonstrate %s in everyday situations.',
    null::jsonb,
    '{"scale":5,"labels":["Strongly Disagree","Disagree","Neutral","Agree","Strongly Agree"],"reverse_scored":false}'::jsonb,
    null::jsonb
  ),
  (
    'mcq_sjt',
    '[DRAFT] You are in a situation that tests your %s. Which response best reflects how you would act?',
    '[{"key":"a","text":"[DRAFT option A]"},{"key":"b","text":"[DRAFT option B]"},{"key":"c","text":"[DRAFT option C]"},{"key":"d","text":"[DRAFT option D]"}]'::jsonb,
    '{"a":25,"b":100,"c":50,"d":0}'::jsonb,
    null::jsonb
  ),
  (
    'open_text',
    '[DRAFT] Describe a specific situation where you had to demonstrate %s. What did you do, and what was the outcome?',
    null::jsonb,
    null::jsonb,
    '{"bands":[{"min":80,"max":100,"criteria":"[DRAFT] Response directly addresses the scenario, shows clear reasoning, and demonstrates the target skill explicitly."},{"min":50,"max":79,"criteria":"[DRAFT] Response is relevant and shows some reasoning but is generic or incomplete."},{"min":0,"max":49,"criteria":"[DRAFT] Response is off-topic, too brief to evaluate, or does not engage with the scenario."}]}'::jsonb
  )
) as t(type, base_text_template, options_json, scoring_key_json, rubric_json)
where not exists (
  select 1 from question_bank qb
  where qb.skill_domain_id = sd.id and qb.type = t.type
);
