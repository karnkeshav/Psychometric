**Technical Requirements Document**

AI-Powered Branch-Wise Psychometric & Soft-Skills Assessment Platform

Version 1.0 \| Stack: GitHub Pages + Supabase + Gemini API

**Table of Contents**

**1. Architecture Overview**

\[ Candidate Browser \]\
\|\
v\
\[ GitHub Pages --- static frontend (React/Next.js export or Vite) \]\
\| HTTPS calls (auth token attached)\
v\
\[ Supabase Edge Functions (Deno) \] \-\-- holds GEMINI_API_KEY as
secret\
\| \\\
v v\
\[ Supabase Postgres DB \] \[ Gemini API \]\
+ Row-Level Security\
\|\
v\
\[ Supabase Storage \] \-- stores generated PDF reports

Key principle: the browser never talks to Gemini directly. All LLM calls
are proxied through Supabase Edge Functions so the API key is never
exposed client-side. GitHub Pages serves only static assets and calls
Supabase\'s public REST/Edge Function endpoints over HTTPS.

**2. Technology Stack**

  -------------------- --------------------------------------------------
  **Layer**            **Technology**

  Frontend             React (Vite) or Next.js static export ---
                       deployable to GitHub Pages

  Styling              Tailwind CSS

  Hosting (frontend)   GitHub Pages, deployed via GitHub Actions on push
                       to main

  Auth                 Supabase Auth (email/password or magic link/OTP)

  Database             Supabase Postgres

  Backend logic        Supabase Edge Functions (Deno/TypeScript)

  File storage         Supabase Storage (PDF reports)

  LLM                  Gemini API (via Edge Function, server-side key)

  PDF generation       Server-side HTML-to-PDF via Edge Function +
                       headless rendering, or a dedicated PDF library
                       (e.g., pdf-lib/puppeteer in a Supabase Function or
                       lightweight external worker)

  CI/CD                GitHub Actions (build/test on PR, deploy on merge
                       to main)
  -------------------- --------------------------------------------------

**3. Repository Structure**

/\
├── .github/workflows/ \# CI/CD pipelines\
├── frontend/ \# React/Next.js app (built and published to gh-pages)\
├── supabase/\
│ ├── functions/ \# Edge Functions\
│ │ ├── generate-scenario/\
│ │ ├── score-open-text/\
│ │ ├── generate-report/\
│ │ └── propose-discipline-weights/\
│ └── migrations/ \# SQL schema migrations\
├── docs/ \# This document set\
└── README.md

**4. Database Schema (Supabase / Postgres)**

**4.1 Core Reference Tables**

  -------------------------- ------------------- ---------------------------------
  **Table**                  **Key Columns**     **Notes**

  programs                   id, name, code      e.g., \"Bachelor of Arts\",
                                                 \"B.Tech\"

  disciplines                id, program_id      status: draft \| pending_review
                             (FK), name, status  \| active

  skill_domains              id, name,           e.g., Communication, Critical
                             description         Thinking, Emotional Intelligence

  discipline_skill_weights   id, discipline_id   Defines branching: which skills +
                             (FK),               how many questions per discipline
                             skill_domain_id     
                             (FK), weight_pct,   
                             question_count      

  question_bank              id, skill_domain_id type: likert \| mcq_sjt \|
                             (FK), type,         open_text; status:
                             base_text,          active\|retired
                             options_json,       
                             scoring_key_json,   
                             difficulty, status  
  -------------------------- ------------------- ---------------------------------

**4.2 Session & Response Tables**

  --------------------- -------------------------- -----------------------------------
  **Table**             **Key Columns**            **Notes**

  assessment_sessions   id, candidate_id (FK),     status:
                        discipline_id (FK),        in_progress\|completed\|abandoned
                        status, started_at,        
                        completed_at               

  session_questions     id, session_id (FK),       generated_scenario_text stores the
                        question_bank_id (FK),     Gemini-rewritten version
                        generated_scenario_text,   
                        sequence_no                

  responses             id, session_question_id    score populated deterministically
                        (FK), raw_response, score, (closed) or via Gemini (open-text)
                        ai_justification,          
                        scored_at                  

  reports               id, session_id (FK),       One row per completed session
                        pdf_storage_path,          
                        domain_scores_json,        
                        strengths_json,            
                        growth_areas_json,         
                        narrative_text,            
                        generated_at               

  ai_call_log           id, session_id (FK,        Auditability per FR-14
                        nullable), function_name,  
                        prompt_hash,               
                        model_version,             
                        response_summary,          
                        created_at                 
  --------------------- -------------------------- -----------------------------------

**4.3 Admin/Workflow Tables**

  --------------------- -------------------- -------------------------------
  **Table**             **Key Columns**      **Notes**

  discipline_requests   id, requested_name,  Candidate-submitted
                        requested_by,        new-discipline requests (FR-04)
                        status, notes        

  profiles              id (=                role: candidate \| admin \| sme
                        auth.users.id),      \| super_admin
                        full_name, role      
  --------------------- -------------------- -------------------------------

**4.4 Row-Level Security (RLS) Policy Summary**

- candidates: can SELECT/INSERT only rows in assessment_sessions,
  session_questions, responses, reports where candidate_id = auth.uid().

- admin/sme roles: full access to reference tables (programs,
  disciplines, skill_domains, discipline_skill_weights, question_bank)
  via a role check function.

- ai_call_log: insert-only from Edge Functions using the service role
  key; no direct client access.

- Storage bucket for reports: private bucket; signed URLs generated
  per-request, scoped to the owning candidate.

**5. Edge Function Specifications**

**5.1 generate-scenario**

Purpose: rewrite a base question\'s scenario text to fit the
candidate\'s discipline while preserving the underlying construct.

POST /functions/v1/generate-scenario\
Body: {\
question_bank_id: string,\
discipline_name: string,\
base_text: string,\
skill_domain: string\
}\
Response: {\
scenario_text: string,\
model_version: string\
}

**5.2 score-open-text**

Purpose: score a candidate\'s free-text response against a rubric for a
given skill domain.

POST /functions/v1/score-open-text\
Body: {\
session_question_id: string,\
skill_domain: string,\
rubric: object,\
candidate_response: string\
}\
Response: {\
score: number, // normalized 0-100\
justification: string,\
model_version: string\
}

**5.3 generate-report**

Purpose: synthesize final structured results and narrative once all
responses in a session are scored.

POST /functions/v1/generate-report\
Body: { session_id: string }\
Response: {\
domain_scores: \[{ domain: string, score: number }\],\
strengths: \[{ domain: string, summary: string, evidence: string }\],\
growth_areas: \[{ domain: string, summary: string, suggested_action:
string }\],\
narrative: string,\
model_version: string\
}

This function also triggers PDF rendering and writes the result to the
reports table + Storage.

**5.4 propose-discipline-weights**

Purpose: one-time, human-reviewed proposal of a skill-weighting profile
for a newly requested discipline. Admin/SME triggered only --- never
called from the candidate-facing flow.

POST /functions/v1/propose-discipline-weights\
Body: { discipline_name: string, program_name: string }\
Response: {\
proposed_weights: \[{ skill_domain: string, weight_pct: number,
rationale: string }\],\
model_version: string\
}

**6. Gemini Prompt Specifications**

**6.1 System Prompt --- Scenario Generation**

You are rewriting the SURFACE CONTEXT of an assessment question only.\
Do NOT change what skill is being measured or the response options.\
Input: base_text (generic scenario), discipline_name, skill_domain.\
Output ONLY valid JSON: { \"scenario_text\": string }\
Rules:\
- Keep length within 10% of base_text length.\
- Use realistic, discipline-appropriate setting and vocabulary.\
- Do not introduce new decision options or change the construct tested.

**6.2 System Prompt --- Open-Text Scoring**

You are scoring a candidate\'s response against a fixed rubric.\
Input: skill_domain, rubric (criteria + score bands),
candidate_response.\
Output ONLY valid JSON: { \"score\": number (0-100), \"justification\":
string }\
Rules:\
- Base the score strictly on the rubric criteria provided.\
- Justification must be specific, evidence-based, and under 40 words.\
- Do not use judgmental or harsh language, even internally in the
justification field.

**6.3 System Prompt --- Report Synthesis (Tone-Critical)**

You write encouraging, development-focused feedback for a UG student\'s\
soft-skills assessment. Input: domain_scores, per-domain response
evidence.\
Output ONLY valid JSON matching the generate-report response schema.\
MANDATORY TONE RULES:\
- Every growth_area must include a constructive suggested_action.\
- NEVER use words like \'weak\', \'poor\', \'fail\', \'below average\',
\'deficient\'.\
- Frame every growth area as an opportunity, e.g. \'An area to build on
is\...\'\
- The narrative must close on an encouraging, forward-looking sentence.\
- No comparison to other candidates or population norms.

Implementation note: enforce output structure using Gemini\'s JSON
schema / structured output mode rather than relying on prompt
instructions alone, and validate the response server-side before writing
to the database. If validation fails, retry once, then fall back to a
safe templated response.

**7. PDF Report Generation**

- Input: the JSON object returned by generate-report.

- Rendering approach: build an HTML template (candidate name,
  program/discipline, date, domain score bars/chart, strengths section,
  growth-areas section, narrative) and convert to PDF server-side.

- Recommended: a lightweight headless-rendering approach invoked from
  the Edge Function or a small companion worker, since Deno Edge
  Functions have limited support for heavy libraries like full Puppeteer
  --- evaluate a PDF-generation service or a minimal HTML/CSS-to-PDF
  library compatible with the Edge runtime during technical spike in
  Phase 2.

- Output stored in a private Supabase Storage bucket; candidate accesses
  it via a time-limited signed URL.

**8. Security Requirements**

- GEMINI_API_KEY stored only as a Supabase Edge Function secret; never
  included in frontend bundle or GitHub repo.

- All Edge Functions validate the caller\'s Supabase Auth JWT and
  enforce role/ownership checks before processing.

- RLS enabled on every table containing candidate data (default-deny,
  explicit allow policies).

- Rate limiting on assessment-session-related Edge Functions to prevent
  abuse/cost overrun.

- Signed URLs for report downloads expire after a short window (e.g., 15
  minutes) and are regenerated on demand.

- Input sanitization on all open-text responses before they are sent to
  Gemini or stored.

**9. Deployment & CI/CD**

- GitHub Actions workflow builds the frontend on push to main and
  publishes to the gh-pages branch / GitHub Pages.

- Supabase migrations (schema changes) applied via the Supabase CLI in a
  separate pipeline step, gated by manual approval for production.

- Edge Functions deployed via \`supabase functions deploy\` from CI,
  with secrets managed through Supabase project settings (never
  committed to the repo).

- Separate Supabase projects (or schemas) for staging and production.

**10. Error Handling & Fallbacks**

  ------------------------ ----------------------------------------------
  **Failure Scenario**     **Required Fallback**

  Gemini API unavailable   Serve the base_text unmodified (generic
  during scenario          scenario) so the assessment can continue
  generation               

  Gemini API unavailable   Retry with backoff; if still failing, generate
  during report generation a templated report from domain_scores only and
                           flag session for manual regeneration

  Gemini returns invalid   One retry with a stricter prompt; on second
  JSON / fails schema      failure, fall back to templated content and
  validation               log the incident

  PDF rendering failure    Store the JSON report and notify candidate
                           that PDF is pending; background job retries
  ------------------------ ----------------------------------------------

**11. Logging, Monitoring & Auditability**

- Every Gemini call logged in ai_call_log with function name, prompt
  hash, model version, and timestamp (per FR-14).

- Supabase log drains / external monitoring (e.g., a status dashboard)
  for Edge Function error rates and latency.

- Alerting on elevated Gemini error rate or unusual API cost spikes.

**12. Environment & Configuration**

  --------------------------- ----------------------------------------------
  **Variable**                **Purpose**

  GEMINI_API_KEY              Server-side secret for Gemini API calls (Edge
                              Function only)

  SUPABASE_URL /              Frontend client configuration (public, safe to
  SUPABASE_ANON_KEY           expose)

  SUPABASE_SERVICE_ROLE_KEY   Server-side only, used by Edge Functions for
                              privileged writes (e.g., ai_call_log)

  GEMINI_MODEL_VERSION        Pinned model identifier for reproducibility
  --------------------------- ----------------------------------------------

**13. Testing Requirements (Technical)**

- Unit tests for scoring logic (closed-format deterministic scoring).

- Contract tests for each Edge Function\'s request/response schema,
  including malformed-input handling.

- Integration test: full session flow from discipline selection through
  PDF generation, using a mocked Gemini response.

- Prompt regression tests: a fixed set of sample responses run against
  the report-synthesis prompt, checked against a banned-word list (tone
  rules) on every deploy.

- RLS policy tests: verify a candidate cannot read another candidate\'s
  session/report data.
