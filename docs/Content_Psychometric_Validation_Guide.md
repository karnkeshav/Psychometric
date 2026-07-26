**Content & Psychometric Validation Guide**

Question Counts, Timing Standards & Report Tone Rules --- Per Branch

Version 1.0 \| Companion to the BRD and Technical Requirements Document

**Table of Contents**

**1. Purpose**

This document gives the development team fixed, ready-to-implement
numbers for every branch (program + discipline): how many questions, of
what type, and how long the assessment should take. It also defines the
methodology behind those numbers so new disciplines added after launch
can be sized consistently, plus the rubric and tone rules that govern
report content.

**2. Why 25--35 Minutes: Benchmarking the Standard**

Existing tools this platform draws inspiration from cluster around a
similar range, which is not a coincidence --- it reflects the point past
which candidate completion rates drop sharply and attention/reliability
degrades:

  ------------------- ------------------ ---------------------------------
  **Tool**            **Typical          **Note**
                      Duration**         

  Mercer \| Mettl     20--40 minutes     Varies by module count; longer
                                         batteries split across sittings

  Pymetrics           \~25 minutes       Short game-based tasks, low
                                         fatigue per task

  LinkedIn Skill      \~15 minutes       Narrow, single-skill scope, not a
  Assessments                            full profile

  HireVue Assessments 20--30 minutes     Behavioral + cognitive combined,
                                         excludes video interview time

  Yoodli              Variable           Practice-oriented, not a timed
                      (self-paced)       single sitting
  ------------------- ------------------ ---------------------------------

Decision: this platform standardizes on 25--35 minutes for most
branches, with a 30--35 minute standard and slightly higher hard caps
for professional/technical branches (Engineering, Medicine, Pharmacy,
Law) where situational-judgment scenarios are inherently more
text-heavy. This keeps the tool competitive with Mettl/HireVue while
remaining shorter than fatigue-risk territory.

**3. Universal Core Skill Domains (Tested in Every Branch)**

Six domains are tested for every candidate regardless of discipline,
because they are broadly predictive of workplace soft-skill success.
Each branch then adds 2 discipline-specific domains on top of these six.

  -------------------- --------------------------------------------------
  **Domain**           **What It Measures**

  Communication        Clarity of expression, active listening, audience
                       awareness

  Critical Thinking &  Structured reasoning, evaluating options, drawing
  Problem-Solving      sound conclusions

  Emotional            Self-awareness, empathy, managing emotional
  Intelligence         reactions under pressure

  Collaboration &      Working effectively with others, handling
  Teamwork             disagreement constructively

  Adaptability &       Responding to change, recovering from setbacks
  Resilience           

  Time Management &    Organizing tasks, meeting deadlines, judging
  Prioritization       urgency vs. importance
  -------------------- --------------------------------------------------

**4. Question Types & Time Cost**

Timing standards are derived bottom-up from per-item time cost, not
chosen arbitrarily. Use these per-item estimates when sizing any new
branch:

  ------------------- ---------------- -----------------------------------
  **Question Type**   **Avg.           **Notes**
                      Time/Item**      

  Likert Scale        \~15 seconds     Single statement, 5-point agreement
                                       scale --- fastest format

  MCQ / Situational   \~45--60 seconds Requires reading a short scenario
  Judgment (SJT)                       plus weighing 3--4 response options

  Open-Text Response  \~90--120        Requires composing a short written
                      seconds          answer; used sparingly due to time
                                       cost and fatigue
  ------------------- ---------------- -----------------------------------

**5. Standard Assessment Blueprint (Methodology)**

For any branch, follow this procedure to derive the question count and
expected time --- the same procedure used to produce Section 6.

- Step 1 --- Assign a weight percentage to each of the 6 core domains
  plus 2 discipline-specific domains, totaling 100%. Default starting
  point: Communication 15%, Critical Thinking 15%, Emotional
  Intelligence 12%, Collaboration 12%, Adaptability 10%, Time Management
  8% (= 72% baseline for the 6 core domains), leaving 28% to split
  across the 2 discipline-specific domains (\~14% each).

- Step 2 --- Convert each domain\'s weight into a question count:
  round(weight% × total target questions). Enforce a floor of 3
  questions per domain --- fewer than 3 items per domain is not
  psychometrically reliable.

- Step 3 --- Set total target questions: 28 for general academic
  branches (Arts, Science, Commerce), 30 for professional/technical
  branches (Engineering, Medicine, Pharmacy, Law) to allow slightly
  deeper scenario coverage.

- Step 4 --- Allocate question types: the large majority as Likert +
  SJT/MCQ (for deterministic, comparable scoring), and cap open-text
  items at 2 for general branches / 3 for professional branches ---
  open-text is the most time-expensive and cost-expensive (Gemini
  scoring) format.

- Step 5 --- Compute total time: (Likert count × 15s) + (SJT/MCQ count ×
  50s avg) + (Open-text count × 100s avg) + 2 minutes for
  instructions/consent + 1 minute for final review screen. Round up to
  the nearest 5-minute band for the candidate-facing time estimate.

**6. Per-Program / Discipline Question & Time Allocation**

These are the launch-ready numbers. \"Discipline-Specific Domains\" are
added on top of the 6 universal domains from Section 3.

**6.1 General Academic Branches --- 28 Questions, 25--30 Minutes
Standard (40 min hard cap)**

  ------------- ----------------- ----------------------- ------------------
  **Program**   **Discipline**    **Discipline-Specific   **Closed /
                                  Domains Added**         Open-Text Split**

  B.A.          Journalism & Mass Persuasive              26 closed, 2
                Communication     Storytelling; Research  open-text
                                  & Verification Mindset  

  B.A.          Psychology        Empathy & Active        26 closed, 2
                                  Listening; Ethical      open-text
                                  Sensitivity             

  B.A.          Economics         Analytical/Numerical    26 closed, 2
                                  Reasoning; Data         open-text
                                  Interpretation          

  B.A. / B.Sc.  Life Sciences     Attention to Detail;    26 closed, 2
                                  Analytical Rigor        open-text

  B.Sc.         Physics           Analytical Reasoning;   26 closed, 2
                                  Systematic              open-text
                                  Problem-Solving         

  B.Sc.         Computer Science  Logical                 26 closed, 2
                                  Problem-Solving;        open-text
                                  Attention to Detail     

  B.Com.        Accounting &      Numerical Reasoning;    26 closed, 2
                Finance           Ethical Integrity       open-text

  B.Com.        Business          Data-Driven Decision    26 closed, 2
                Analytics         Making; Analytical      open-text
                                  Reasoning               

  BBA           General           Leadership Potential;   26 closed, 2
                Management        Negotiation & Influence open-text
  ------------- ----------------- ----------------------- ------------------

**6.2 Professional / Technical Branches --- 30 Questions, 30--35 Minutes
Standard (45 min hard cap)**

  ------------- ----------------- ----------------------- ------------------
  **Program**   **Discipline**    **Discipline-Specific   **Closed /
                                  Domains Added**         Open-Text Split**

  B.Tech / B.E. Computer Science  Systematic              27 closed, 3
                Engineering       Problem-Solving;        open-text
                                  Attention to Detail     

  B.Tech / B.E. Mechanical        Practical/Applied       27 closed, 3
                Engineering       Reasoning; Systematic   open-text
                                  Problem-Solving         

  B.Tech / B.E. Civil Engineering Risk Assessment;        27 closed, 3
                                  Attention to Detail     open-text

  MBBS          General Medicine  Empathy & Stress        27 closed, 3
                                  Tolerance; Ethical      open-text
                                  Reasoning               

  B.Pharm       Pharmacy          Precision & Regulatory  27 closed, 3
                                  Compliance Mindset;     open-text
                                  Attention to Detail     

  LLB / BA LLB  Law               Ethical Reasoning &     27 closed, 3
                                  Argumentation;          open-text
                                  Persuasive              
                                  Communication           
  ------------- ----------------- ----------------------- ------------------

These figures are launch defaults for the SME to validate, not immutable
constants --- but any change to total question count or time standard
for a branch already in production should go through the same Section 5
methodology so numbers stay comparable across branches.

**7. Worked Example: Deriving Numbers for B.A. Journalism**

This shows the Section 5 methodology applied end-to-end, for reference
when sizing a new discipline.

  ---------------------------- -------------------- ---------------------
  **Domain**                   **Weight %**         **Question Count (of
                                                    28)**

  Communication                15%                  4

  Critical Thinking &          15%                  4
  Problem-Solving                                   

  Emotional Intelligence       12%                  3

  Collaboration & Teamwork     12%                  3

  Adaptability & Resilience    10%                  3

  Time Management &            8%                   2 → raised to 3
  Prioritization                                    (floor rule)

  Persuasive Storytelling      14%                  4
  (specific)                                        

  Research & Verification      14%                  4
  Mindset (specific)                                
  ---------------------------- -------------------- ---------------------

Total closed-format items: 26 after rounding (matches Section 6.1). Two
of these 26 slots --- one from Communication, one from Persuasive
Storytelling --- are converted to open-text format to capture
writing/argument quality directly, giving the final 26 closed / 2
open-text split shown in the table.

Time check: (24 Likert/SJT-mixed items × \~40s blended avg) + (2
open-text × 100s) + 2 min instructions + 1 min review ≈ 16 min + 3.3
min + 3 min ≈ 22 minutes raw, rounded up to the published
candidate-facing estimate of 25--30 minutes to allow for slower readers.

**8. Open-Text Scoring Rubric Template**

Every open-text item must ship with a rubric in this shape before it
enters the question bank --- this is what gets passed to the
score-open-text Edge Function (see TRD Section 5.2):

  ----------------- ------------------------- ---------------------------
  **Score Band**    **Criteria**              **Example Anchor
                                              (generic)**

  80--100           Response directly         Names a specific action and
                    addresses the scenario,   explains why it addresses
                    shows clear reasoning,    the core tension in the
                    and demonstrates the      scenario
                    target skill explicitly   

  50--79            Response is relevant and  Gives a reasonable answer
                    shows some reasoning but  but doesn\'t engage with
                    is generic or incomplete  the specific complication
                                              in the scenario

  0--49             Response is off-topic,    One-word or unrelated
                    too brief to evaluate, or answer
                    does not engage with the  
                    scenario                  
  ----------------- ------------------------- ---------------------------

- Each open-text item in the question bank must specify: the skill
  domain it targets, 2--3 score-band criteria in the shape above, and
  one worked example response per band for calibration.

- SME reviews and signs off on the rubric before the item goes live ---
  this is a hard gate, not optional.

**9. Report Tone & Style Guide**

The \"always encouraging, never demotivating\" requirement needs
concrete examples, not just an instruction, so writers and prompt
engineers apply it consistently.

  ------------- ----------------------------- ----------------------------
                **Avoid (Demotivating)**      **Use Instead (Encouraging,
                                              Still Honest)**

  Framing a low \"Your time management skills \"Time management is an area
  score         are weak.\"                   with strong room to grow ---
                                              try starting with a simple
                                              daily priority list.\"

  Framing a gap \"You failed to consider the  \"Bringing in the team\'s
                team\'s perspective.\"        perspective earlier is a
                                              great next step to build on
                                              your collaboration skills.\"

  Comparative   \"You scored below average    (Omit comparisons entirely
  language      for your discipline.\"        --- report only the
                                              candidate\'s own domain
                                              scores and trajectory.)

  Closing line  (No closing framing, report   \"You\'re bringing real
                just ends after growth        strengths to the table ---
                areas.)                       and every growth area here
                                              is simply your next
                                              opportunity to build on
                                              them.\"
  ------------- ----------------------------- ----------------------------

- Every report\'s growth-area section must pair each observation with
  one concrete, actionable suggestion.

- Banned-word list enforced by prompt + automated post-check: weak,
  poor, fail(ed), below average, deficient, lacking, inadequate.

- Every report must end on a forward-looking, encouraging sentence ---
  this is checked in the prompt regression test suite (TRD Section 13).

**10. SME Review Checklist for New Disciplines**

- Discipline-specific domains selected and weighted (Section 5, Step 1)
  --- reviewed by SME, not auto-approved from the Gemini proposal alone.

- Question count and time budget computed using Section 5 methodology
  and matches the appropriate band (28/25--30min or 30/30--35min).

- Every open-text item has a complete rubric per Section 8 template.

- A sample of 3--5 generated reports for the new discipline reviewed
  against the Section 9 tone guide before the discipline is set to
  \"active\".
