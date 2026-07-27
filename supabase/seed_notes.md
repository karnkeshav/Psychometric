# seed.sql — what it is and how it behaves

`supabase/seed.sql` loads placeholder reference data (programs, skill
domains, disciplines, discipline-skill weights) and a small set of draft
question_bank items so Phase 2 frontend work has real rows to query
against. See the header comment in `seed.sql` for exactly what's
computed vs. SME-validated.

## Does pushing migrations seed staging?

No. Verified against the installed CLI (`supabase --version` → 2.109.1):

- `supabase db push` applies pending **migrations only**. It does not
  touch `seed.sql` unless you explicitly pass `--include-seed`.
- `supabase db reset --linked` is the one path that seeds a **remote**
  project — and it's destructive: it resets the linked project to the
  current migrations first (wiping existing remote data), then runs
  `seed.sql`. Not something that happens as a side effect of a normal
  deploy.
- Seeding only happens implicitly on **local** `supabase db reset` (or
  `supabase start` bootstrapping a fresh local DB).

So the placeholder data in this repo will not land in staging by
accident from a plain `supabase db push`. If real seed data (or a
staging-specific seed) is ever wanted on a remote project, that has to
be a deliberate, separate command — `--include-seed` on `db push`, or
`db reset --linked`, or running the SQL directly against that
project's connection string.

## Dev-only frontend relaxation

All 16 seeded disciplines have `status = 'pending_review'`, not
`'active'`, because the discipline_skill_weights numbers are computed
placeholders (see `seed.sql` header), not SME-approved weights. The
schema's review gate exists specifically to keep unreviewed disciplines
out of the candidate-facing flow — seeding them as `'active'` would
silently defeat that.

This means the real candidate-facing query (`status = 'active'` only)
will show **zero disciplines** against a freshly seeded local DB.

**For local Phase 2 UI work only**, the discipline-picker query may be
temporarily relaxed to `status in ('pending_review', 'active')` so
there's something to render against. This relaxation is dev-only and
must not ship to production:

- Gate it behind a build-time flag or `import.meta.env.DEV` check —
  never a runtime toggle a candidate could hit.
- Remove/revert it before the Phase 2 diff is considered done, or at
  minimum before any deploy pipeline (see TRD §9) runs against a
  non-local environment.
- Once real discipline weights are reviewed and flipped to `'active'`
  in a given environment, this relaxation should be dropped there —
  the production query must always be `status = 'active'` only.
