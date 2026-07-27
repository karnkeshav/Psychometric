# Pre-Production Checklist

Running list of dev-only shortcuts, relaxations, and placeholder content
introduced during development that must be revisited — reverted, tightened,
or replaced with real content — before this platform serves real candidates.

**Convention:** every time a dev-only shortcut is introduced, add it here in
the same commit/PR. Check items off (and note the commit/date) once resolved.

---

## Schema / RLS

- [ ] **Drop migration `0009_dev_pending_review_visibility.sql`** (the
      `disciplines_select_pending_review_dev` policy) before production. It
      exists only so local Phase 2 frontend work has `pending_review`
      disciplines to render against candidates; production candidates must
      only ever see `status = 'active'` disciplines (the original
      `disciplines_select_active` policy from `0005_rls_policies.sql`).

## Content / data

- [ ] **Flip all 16 seeded disciplines from `pending_review` to `active`
      only after real SME review**, per Content Guide §10's SME Review
      Checklist (domain selection/weighting reviewed, question count +
      time budget matches §5 methodology, every open-text item has a
      complete rubric, 3–5 sample reports reviewed for tone). The
      `discipline_skill_weights` values currently in `supabase/seed.sql`
      are computed via the §5 default methodology as a stand-in, not SME
      output — see `seed.sql` header comment.
- [ ] **Replace/activate `question_bank` placeholder items.** All seeded
      questions are `status = 'draft'`, tagged `[DRAFT]` in `base_text`,
      and are not the validated question bank (that's SME authoring work
      per Project Plan Phase 1). No candidate should ever be served a
      `draft` item — confirm the question-selection logic (once built)
      only pulls `status = 'active'` items, same as the RLS/production
      discipline rule above.

## Frontend

- [ ] **Tighten the discipline-list query to `status = 'active'` only.**
      `frontend/src/lib/api/disciplines.ts` includes `pending_review` in
      the status filter when `import.meta.env.DEV` is true (see
      `supabase/seed_notes.md`). Confirm this resolves to `active`-only in
      the production build (Vite sets `import.meta.env.DEV = false` for
      `vite build`, but verify — don't rely on this alone; consider
      removing the branch entirely once real `active` disciplines exist in
      every environment that needs testing).

## Environment / project configuration

- [ ] **Review email-confirmation settings on the staging/production
      Supabase project dashboard.** Local `supabase/config.toml` sets
      `[auth.email] enable_confirmations = false` for fast local testing
      only — this file only affects `supabase start` / `db reset` locally
      and is not pushed to a hosted project. Confirm the real project's
      Auth settings (email confirmation, rate limits) are configured
      deliberately, not left on whatever Supabase's default is.

## Dependencies

- [ ] **`react-router-dom` has no fully clean version as of this writing.**
      Pinned to `7.18.1`. Every published 7.x from `7.12.0` up is flagged
      for GHSA-qwww-vcr4-c8h2 (RSC Mode CSRF Bypass); versions below that
      fall into an earlier advisory range (open-redirect/XSS, DoS,
      `6.0.0`–`7.17.0`). Accepted for now because this app is a static SPA
      using `HashRouter` only — no SSR, no server actions, no RSC mode, the
      exact surface both advisories target. Re-check `npm audit` and bump
      once react-router ships a version outside both ranges.

## Not yet applicable (tracked here for when they land)

- `GEMINI_API_KEY` handling, Edge Function secrets — no Edge Functions
  exist yet (Phase 3+). Add checklist items here once introduced, per
  CLAUDE.md rule 1 (server-side secret only, never committed).
