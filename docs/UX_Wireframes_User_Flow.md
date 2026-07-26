**UX Wireframes & User Flow**

Screen-by-Screen Specification, Including Timing & Progress UX

Version 1.0 \| Companion to the BRD and Technical Requirements Document

**Table of Contents**

**1. Purpose & Scope**

This document specifies every screen a candidate or admin sees, in
enough detail for a frontend developer to build without guessing layout,
states, or copy. It is text/box-based (not high-fidelity mockups) ---
pair with the frontend-design system for final visual styling. Timing
figures reference the Content & Psychometric Validation Guide.

**2. Overall User Flow**

Register/Login\
\|\
v\
Program Selection \-\-\-\-\-\-\-\--\> (new program? -\> request logged,
Sec. 3.3)\
\|\
v\
Discipline Selection \-\-\-\-\-\--\> (new discipline? -\> request
logged, Sec. 3.3)\
\|\
v\
Pre-Assessment Instructions (shows question count + time estimate)\
\|\
v\
Assessment Session (Likert / SJT / Open-text screens, progress bar)\
\|\
v\
Review Screen (optional flag-for-review pass)\
\|\
v\
Submission / Processing (\'Generating your report\...\')\
\|\
v\
In-App Report Summary \-\--\> PDF Download\
\|\
v\
Candidate Dashboard (history of past attempts)

**3. Candidate-Facing Screens**

**3.1 Login / Register**

- Standard email/password or magic-link fields (Supabase Auth).

- No time budget consumed here --- excluded from the assessment timer.

**3.2 Program Selection**

+\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\--+\
\| Select your program \|\
\| \|\
\| \[ B.A. \] \[ B.Sc. \] \[ B.Com. \] \[ B.Tech/B.E. \] \|\
\| \[ MBBS \] \[ B.Pharm \] \[ LLB \] \[ BBA \] \|\
\| \|\
\| Don\'t see your program? \[ Request it \] \|\
+\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\--+

- Grid of program cards, pulled live from the \`programs\` table
  (admin-managed) --- never hardcoded, so new programs appear
  automatically once approved.

**3.3 Discipline Selection**

+\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\--+\
\| B.A. -\> Select your discipline \|\
\| \|\
\| ( ) Journalism & Mass Communication \|\
\| ( ) Psychology \|\
\| ( ) Economics \|\
\| ( ) Life Sciences \|\
\| \|\
\| Don\'t see your discipline? \[ Request it \] \|\
+\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\--+

- List scoped to the selected program, sourced from \`disciplines\`
  where status = active.

- \"Request it\" opens a short text field, writes to
  \`discipline_requests\`, and shows a confirmation: \"Thanks --- our
  team will review this and may add it soon.\" (Encouraging tone applies
  even here, not just in reports.)

**3.4 Pre-Assessment Instructions**

This is the single most important screen for setting time expectations
correctly --- the candidate must see the standard before starting, never
be surprised by it.

+\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\--+\
\| Your Journalism & Mass Communication Assessment \|\
\| \|\
\| 28 questions · About 25--30 minutes \|\
\| Covers: Communication, Critical Thinking, \|\
\| Emotional Intelligence, Collaboration, \|\
\| Adaptability, Time Management, Storytelling, \|\
\| Research & Verification \|\
\| \|\
\| Tips: \|\
\| - Answer as yourself, not as you think you \|\
\| \'should\' answer --- there are no wrong answers. \|\
\| - You can flag a question to revisit later. \|\
\| - Try to complete it in one sitting. \|\
\| \|\
\| \[ Start Assessment \] \|\
+\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\--+

- Question count and time estimate are pulled dynamically from
  discipline_skill_weights (sum of question_count) --- never hardcoded
  in the frontend, so it stays correct if content changes.

- Tone note: framed as helpful tips, not rules or warnings ---
  consistent with the encouraging-tone requirement extending beyond the
  final report into the whole experience.

**3.5 Assessment Question Screens**

Three question-card layouts, one progress system shared across all of
them.

**Shared header (all question screens)**

+\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\--+\
\| \[==========\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\--\] 12 / 28 \|\
\| Communication \|\
+\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\--+

- Progress bar reflects question count, not elapsed time --- no visible
  countdown clock. A visible ticking countdown increases anxiety and can
  depress performance on soft-skill/SJT items; the hard time cap runs
  silently in the background (see Section 4).

- Current domain name shown for transparency, not score-relevant detail.

**Likert-scale card**

\| \"I stay calm when a deadline is moved up \|\
\| at the last minute.\" \|\
\| \|\
\| Strongly Disagree Neutral Agree Strongly \|\
\| Disagree Agree \|\
\| (1) (2) (3) (4) (5) \|\
+\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\--+\
\| \[ Back \] \[ Next -\> \] \|

**SJT / MCQ card**

\| Scenario: Your editor moves your deadline up \|\
\| by two days for a breaking story\... \|\
\| \|\
\| ( ) Drop your other assignments entirely \|\
\| ( ) Ask your editor to help re-prioritize \|\
\| ( ) Submit a rushed, lower-quality draft \|\
\| ( ) Quietly work overtime without flagging it \|\
+\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\--+\
\| \[ Back \] \[ Next -\> \] \|

**Open-text card**

\| Describe a time you had to explain a complex \|\
\| topic to someone unfamiliar with it. What did \|\
\| you do to make it clear? \|\
\| \|\
\| \[ \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\...
\] \|\
\| \[ \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\...
\] \|\
\| \~250 characters \|\
+\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\--+\
\| \[ Back \] \[ Next -\> \] \|

- Open-text items show a soft character guide (\"\~250 characters\"),
  not a hard minimum --- keeps friction low.

**3.6 Review Screen (Optional)**

- Grid of question numbers; flagged/skipped items highlighted; \"Submit
  Assessment\" button.

- Not counted separately in the time budget --- folded into the 1-minute
  review allowance from the Content Guide\'s Section 5 formula.

**3.7 Submission / Processing**

+\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\--+\
\| Generating your report\... \|\
\| This usually takes under 30 seconds. \|\
+\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\--+

- Backed by the generate-report Edge Function (TRD Section 5.3); shows a
  friendly wait state, not a raw spinner.

**3.8 In-App Report Summary**

+\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\--+\
\| Your Results --- Journalism & Mass Communication \|\
\| \|\
\| Communication \[########\--\] Strength \|\
\| Critical Thinking \[######\-\-\--\] Strength \|\
\| Time Management \[####\-\-\-\-\--\] Growth area \|\
\| \... \|\
\| \|\
\| Top Strengths: \|\
\| - Persuasive Storytelling \|\
\| - Communication \|\
\| \|\
\| Growing Into: \|\
\| - Time Management -\> Try a daily priority list \|\
\| \|\
\| \[ Download PDF Report \] \|\
+\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\--+

- Domain bars deliberately unlabeled with raw numeric scores in-app
  (numbers can appear in the PDF, framed positively); bars use
  qualitative Strength/Growth-area labels, never a 0-100 number alone,
  to avoid a \"grade\" feeling.

- \"Growing Into\" heading intentionally avoids the word \"Weaknesses\"
  per the tone guide.

**3.9 Candidate Dashboard**

- List of past attempts: discipline, date, link to report PDF, and a
  \"Retake\" button (enabled after the configured cooldown period).

**4. Timer & Progress UX Rules**

  ------------------------ ----------------------------------------------
  **Rule**                 **Rationale**

  No visible countdown     Reduces test anxiety; soft-skill/SJT responses
  clock during the         are more authentic without time pressure
  assessment               signaling

  Question-count progress  Gives orientation without inducing time
  bar always visible       pressure

  Silent hard cap enforced Protects data quality and prevents
  server-side (40 min      abandoned-but-open sessions from blocking
  general / 45 min         retakes; candidate is auto-submitted with a
  professional branches)   gentle notice if reached

  Estimated time shown     Sets expectations without repeated on-screen
  once, upfront, on the    reminders that feel like pressure
  Instructions screen only 

  \"Save & resume\"        Session state persisted in Supabase so a
  available (FR-10)        candidate can leave and return without losing
                           progress
  ------------------------ ----------------------------------------------

**5. Admin Console Screens**

**5.1 Discipline & Weight Manager**

- Table view of all programs/disciplines with status
  (draft/pending_review/active).

- Edit screen per discipline: skill-domain weight sliders (must total
  100%), auto-calculated question counts per domain (read-only, computed
  per Content Guide Section 5), and total time estimate preview.

**5.2 New Discipline Approval Workflow**

Candidate requests discipline\
\| v\
Appears in Admin queue (status: pending_review)\
\| v\
Admin triggers \'Propose weights\' (calls propose-discipline-weights)\
\| v\
SME reviews/edits proposed weights & question counts\
\| v\
SME reviews 3-5 sample generated reports for tone compliance\
\| v\
Admin sets status: active \--\> now selectable by candidates

**5.3 Question Bank Manager**

- Filterable table by skill domain, type, status; add/edit form includes
  the rubric fields (Section 8 of Content Guide) for open-text items,
  enforced as required fields before save.

**5.4 Analytics View**

- Aggregate, anonymized charts: completions by discipline, average
  time-to-complete vs. standard, drop-off point in the funnel.

**6. Component Inventory (For Developer Reuse)**

  ------------------------ -------------------------------------------------
  **Component**            **Used In**

  ProgressBar              Assessment question screens, review screen

  QuestionCard (Likert /   Assessment session
  SJT / OpenText variants) 

  DomainScoreBar           In-app report summary, PDF template

  StrengthCard /           In-app report summary, PDF template
  GrowthAreaCard           

  DisciplineRequestModal   Program/discipline selection screens

  WeightSliderGroup        Admin discipline & weight manager

  ApprovalQueueTable       Admin new-discipline workflow
  ------------------------ -------------------------------------------------

**7. Accessibility & Responsive Notes**

- All question types operable by keyboard alone (radio groups,
  textareas) --- no drag interactions required for core flow.

- Color is never the only signal for Strength vs. Growth area --- pair
  with icon/label text.

- Layouts tested at mobile (375px), tablet (768px), and desktop
  (1280px+) breakpoints; assessment is single-column on mobile.
