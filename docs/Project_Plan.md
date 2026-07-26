**Project Plan**

AI-Powered Branch-Wise Psychometric & Soft-Skills Assessment Platform

Version 1.0 \| Prepared for Development Handover

**Table of Contents**

**1. Project Summary**

This plan sequences the build of the psychometric assessment platform
described in the Business & Functional Requirements Document (BRD) and
the Technical Requirements Document (TRD). Delivery is organized into 6
phases across an estimated 14--16 weeks for a v1 launch, using an agile
approach with 2-week sprints from Phase 2 onward.

**2. Recommended Team**

  ---------------------- -------------------- ---------------------------
  **Role**               **Allocation**       **Primary Responsibility**

  Product Owner          Part-time, full      Requirements sign-off,
                         duration             prioritization, SME liaison

  Full-Stack Developer   Full-time, full      Frontend + Supabase
  (Lead)                 duration             schema/Edge Functions

  Frontend Developer     Full-time, weeks     Assessment UI, admin
                         3--14                console, candidate
                                              dashboard

  Backend/Supabase       Full-time, weeks     Schema, RLS policies, Edge
  Developer              1--14                Functions, auth

  Prompt/AI Engineer     Part-time, weeks     Gemini prompt design for
                         3--14                questions, scoring, reports

  Psychometric SME       Part-time, weeks     Question bank validation,
                         1--4 and ongoing     skill-weight review, rubric
                                              design

  QA Engineer            Part-time, weeks     Test plan execution,
                         6--16                regression testing

  UI/UX Designer         Part-time, weeks     Wireframes, report PDF
                         1--4                 layout, design system
  ---------------------- -------------------- ---------------------------

**3. Phase Breakdown**

**Phase 0 --- Discovery & Setup (Week 1)**

- Finalize BRD/TRD sign-off with stakeholders.

- Set up GitHub repository, branching strategy, Supabase project, Gemini
  API access.

- Define initial launch scope: which programs/disciplines ship in v1
  (recommend 3--5 programs, 2--3 disciplines each).

**Phase 1 --- Content & Data Foundation (Weeks 2--4)**

- SME authors/curates the core validated question bank per skill domain.

- Define skill domains and initial discipline-skill weight mappings for
  launch disciplines.

- Design and review the report tone/style guide with sample outputs.

- Finalize Supabase schema (tables, relationships, RLS policies) per
  TRD.

**Phase 2 --- Core Platform Build, Sprint 1--2 (Weeks 5--8)**

- Candidate auth, program/discipline selection flow.

- Assessment engine: branching logic, question retrieval, session state
  persistence.

- Core question rendering UI (Likert, MCQ/SJT, open-text).

**Phase 3 --- AI Integration, Sprint 3--4 (Weeks 9--11)**

- Gemini integration for scenario rewriting (Edge Function).

- Gemini integration for open-text rubric scoring with structured JSON
  output.

- Gemini integration for final report synthesis (strengths/growth
  areas/narrative) with tone-guideline enforcement.

- Prompt testing and iteration with SME review of sample outputs.

**Phase 4 --- Reporting & Admin Console, Sprint 5 (Weeks 12--13)**

- PDF report generation and rendering pipeline.

- Candidate dashboard (history, downloads).

- Admin console: question bank management, discipline/weight management,
  new-discipline approval workflow.

**Phase 5 --- QA, Pilot & Hardening (Weeks 14--15)**

- Full regression test pass (see Test Plan).

- Security review: RLS policy audit, API key exposure check, consent
  flow review.

- Pilot with a small candidate group (e.g., 20--50 students across
  launch disciplines); collect feedback.

- SME review of a sample of real generated reports for tone-guideline
  compliance.

**Phase 6 --- Launch & Stabilization (Week 16)**

- Production deployment (GitHub Pages + Supabase production project).

- Monitoring/alerting in place for Edge Function errors and Gemini API
  failures.

- Post-launch support window and backlog grooming for v1.1.

**4. Milestone Summary**

  ---------- -------------------------------- -----------------------------
  **Week**   **Milestone**                    **Exit Criteria**

  1          Project kickoff complete         Repos, Supabase project,
                                              Gemini access, scope locked

  4          Content foundation ready         Question bank + skill weights
                                              approved by SME

  8          Core assessment flow functional  Candidate can complete a
             (no AI yet)                      static assessment end-to-end

  11         AI integration complete          Scenario rewriting, scoring,
                                              and report synthesis working
                                              in staging

  13         Admin console & PDF reports      Admin can manage content; PDF
             complete                         report generated
                                              automatically

  15         Pilot complete                   Pilot feedback incorporated;
                                              tone/security review passed

  16         v1 Launch                        Production live, monitoring
                                              active
  ---------- -------------------------------- -----------------------------

**5. Risk Register**

  -------------------- ---------------------- ---------------- --------------------
  **Risk**             **Impact**             **Likelihood**   **Mitigation**

  Gemini output breaks High                   Medium           Fixed system
  tone guidelines                                              prompt + schema
  (discouraging                                                validation + SME
  language slips                                               spot-checks before
  through)                                                     wider rollout

  Gemini API           Medium                 Medium           Fallback to generic
  downtime/rate limits                                         (non-AI-flavored)
  during peak usage                                            scenario text;
                                                               queue/retry logic

  Question bank not    High                   Medium           Lock SME review as a
  psychometrically                                             hard gate before
  validated in time                                            Phase 2 sign-off

  Scope creep          Medium                 High             Explicitly
  (Pymetrics-style                                             out-of-scope for v1
  games, Yoodli-style                                          in BRD; park in v2
  speech analysis)                                             backlog

  Data                 High                   Low              Dedicated Data
  privacy/compliance                                           Privacy review in
  gaps                                                         Phase 5 before
                                                               launch

  API cost overrun     Medium                 Medium           Cache/reuse
  from live generation                                         generated scenario
                                                               variants; monitor
                                                               usage from day 1
  -------------------- ---------------------- ---------------- --------------------

**6. Dependencies**

- Access to Gemini API key with sufficient quota before Phase 3 begins.

- SME availability in Weeks 1--4 is on the critical path --- delays here
  delay everything downstream.

- GitHub organization and Supabase project provisioned in Week 1.

**7. Assumptions**

- Team works in 2-week sprints from Phase 2 onward with sprint reviews
  and demos.

- Design system/wireframes are approved before frontend build begins in
  Phase 2.

- Pilot group availability is arranged in advance by the Product Owner.
