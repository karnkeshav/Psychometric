-- Enables real session persistence for the Phase 2 question UI without a
-- second SECURITY DEFINER RPC. question_bank still has zero candidate RLS
-- policy (0005), so a resumed session can't re-join it for type/options at
-- read time -- instead, session_questions snapshots the renderable fields
-- once, when the session is created (from discipline_questions()'s
-- already-safe output, 0013). After that, resuming a session is a plain
-- session_questions_select_own-scoped read -- no RLS bypass involved.
-- This also has the side benefit of fixing what the candidate actually
-- saw, independent of later edits to question_bank/skill_domains.
alter table session_questions
  add column type text not null check (type in ('likert', 'mcq_sjt', 'open_text')),
  add column options_json jsonb,
  add column skill_domain_name text not null;

-- Lets the app upsert a single current response per question (candidate
-- changes their answer -> update in place) instead of accumulating
-- duplicate rows. score/ai_justification/scored_at are untouched by an
-- upsert that only sets raw_response, staying null until Phase 3 scoring.
alter table responses
  add constraint responses_session_question_id_key unique (session_question_id);
