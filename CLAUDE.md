# Project: Branch-Wise Psychometric & Soft-Skills Assessment Platform

Read this file at the start of every session. Full specs live in `/docs` —
consult them before building the relevant feature:
- `docs/BRD_Requirements_Document.docx` — what to build and why
- `docs/Technical_Requirements_Document.docx` — schema, Edge Functions, prompts
- `docs/Content_Psychometric_Validation_Guide.docx` — per-branch question counts & timing
- `docs/UX_Wireframes_User_Flow.docx` — screen-by-screen flow
- `docs/Project_Plan.docx` — phase sequencing

## Stack
- Frontend: React (Vite) → static export → GitHub Pages
- Backend: Supabase (Postgres + Auth + Storage + Edge Functions)
- LLM: Gemini API, called only from Edge Functions — never from the browser
- Styling: Tailwind CSS

## Non-negotiable rules
1. `GEMINI_API_KEY` is a Supabase Edge Function secret only. Never in frontend code, never committed.
2. Every table with candidate data has Row-Level Security enabled. A candidate can only read their own rows.
3. Closed-format questions (Likert/MCQ) are scored deterministically in code — never by the LLM.
4. All Gemini calls use structured/JSON-schema output and are validated server-side before being stored. On validation failure: retry once, then fall back to a templated response — never surface a raw/malformed AI response to a candidate.
5. Report language follows the tone rules in the Content Guide, Section 9: no words like "weak," "poor," "fail," "below average," "deficient." Every growth area pairs with a concrete next step. Every report ends on an encouraging, forward-looking line. This is enforced by the system prompt AND checked by a banned-word test before any prompt change ships.
6. No visible countdown timer during the assessment. Progress is shown as a question-count bar only. The time cap is enforced silently server-side.

## Build order (work one phase per session, review diffs before moving on)
1. Supabase schema + migrations (TRD §4)
2. Static candidate flow: auth → program/discipline select → question UI (no AI)
3. Edge Functions with mocked Gemini responses (prove the contracts)
4. Wire in real Gemini calls (TRD §5–6)
5. PDF report generation + in-app report screen
6. Admin console (discipline/weight manager, question bank, approval workflow)
7. Dedicated design pass (see Design System below) — screenshot and self-critique against it
8. CI/CD: GitHub Actions → GitHub Pages (frontend) + Supabase CLI (functions/migrations)

---

## Design System

**This is a credibility instrument, not a marketing page.** Students may be
screened by something like this before a real job application — it should
read as calm, precise, and trustworthy, closer to a clinical/analytical
instrument than a typical SaaS landing page. Avoid generic AI-default looks:
no warm-cream-background-with-terracotta-accent, no near-black-with-neon-accent,
no zero-radius newspaper-hairline layout. This product's own identity below
takes precedence over any of those defaults.

### Palette
| Token | Hex | Use |
|---|---|---|
| `ink` | `#14213D` | Primary text, headers, primary buttons |
| `paper` | `#F7F8FA` | App background (cool, not warm cream) |
| `surface` | `#FFFFFF` | Cards, elevated panels |
| `jade` | `#2E8B74` | Primary accent — strengths, growth, positive signal, progress |
| `amber` | `#C7830A` | Secondary accent — used sparingly, for a single highlight per screen |
| `charcoal` | `#1C1F26` | Body text |
| `mist` | `#DCE1E8` | Borders, dividers |

Never use pure black or pure white for text/background — use `charcoal`/`ink` and `paper`.

### Typography
- **Display (headings):** a humanist serif with academic gravitas — e.g. `Source Serif 4` or `Lora`, semibold, used only for H1/H2 and the candidate's name on the report. Not decorative — restrained.
- **Body / UI:** a clean grotesk sans — e.g. `Inter` or `IBM Plex Sans` — for all interface copy, questions, buttons.
- **Data / scores:** a monospace — e.g. `IBM Plex Mono` — for any number: scores, question counters ("12 / 28"), timestamps. This visually marks numbers as *measured data*, distinct from prose.

### Layout principles
- Generous whitespace; cards use soft shadows (`shadow-sm`/`shadow-md`, never harsh drop shadows) and `rounded-xl` corners — not flat, not zero-radius.
- Assessment screens are single-column, centered, max-width ~640px — feels focused, not like a form buried in a sidebar layout.
- Admin console uses a proper dashboard layout (persistent left nav, data tables) — it should look and feel distinct from the candidate-facing experience, more utilitarian.

### Signature element: the Skill Wheel
Instead of generic horizontal progress bars for domain scores, use a **radial
"skill wheel"** — each skill domain is a spoke, its length representing the
score, arranged in a circle. This is the one place to spend visual boldness:
it appears on the in-app report summary and in the PDF, and it directly
reflects the product's core idea — a student's soft-skill profile branches
in different directions depending on discipline, and the wheel makes that
literal. Keep everything else on the page quiet around it: no extra
gradients, no competing illustrations. `jade` for domains scored as
strengths, `amber` used only for the single "growing into" domain called out
in the narrative — not for every below-median domain, to avoid it reading as
a warning color.

### Motion
- Use motion once, deliberately: the skill wheel draws in (spokes animate
  outward from center) when the report first renders. That's the moment
  worth an animation.
- Elsewhere: subtle, fast (150–200ms) transitions on hover/focus states only.
  No page-load animations on every screen — that reads as generic AI output,
  not as an intentional choice.

### Writing/copy rules
- Buttons say exactly what happens: "Start Assessment," "Download Report,"
  never "Submit" or "Go."
- Empty/error states speak in the interface's voice, not an apology: e.g.
  "This report hasn't been generated yet" rather than "Sorry, something went
  wrong."
- Never use system/database language in candidate-facing copy — say
  "assessment," not "session"; say "your program," not "the discipline_id."

### Before shipping any screen
- Screenshot it and compare against this file — does it still look like a
  generic AI-built form, or does it look like a deliberate instrument?
- Keyboard-navigable, visible focus states, works down to 375px width,
  respects `prefers-reduced-motion`.
