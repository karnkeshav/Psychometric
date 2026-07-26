**Business & Functional Requirements Document**

AI-Powered Branch-Wise Psychometric & Soft-Skills Assessment Platform

Version 1.0 \| Prepared for Development Handover

Document Owner: \[Product Owner Name\] \| Date: \[DD Month YYYY\]

**Document Control**

  ----------------- ----------------- ----------------- -------------------
  **Version**       **Date**          **Author**        **Change Summary**

  0.1               \[date\]          \[name\]          Initial draft

  1.0               \[date\]          \[name\]          Reviewed and
                                                        approved for
                                                        handover
  ----------------- ----------------- ----------------- -------------------

**Table of Contents**

**1. Purpose & Overview**

This document defines the business and functional requirements for a
web-based psychometric and soft-skills assessment platform aimed at
undergraduate (UG) students across all disciplines --- Arts,
Engineering, Medicine, Pharmacy, Law, Science, Commerce, and others. The
platform selects assessment content dynamically based on the student\'s
chosen program and discipline (\"branch\"), evaluates soft skills
relevant to that field, and produces an encouraging, development-focused
PDF report.

The platform draws conceptual inspiration from existing tools such as
Mercer \| Mettl (employer-grade psychometric and skills screening),
Pymetrics (game-based cognitive/emotional trait assessment), Yoodli (AI
speech coaching), LinkedIn Skill Assessments (quick benchmarking with
shareable credentials), and HireVue (behavioral assessment). This is a
from-scratch build using Supabase, GitHub, and the Gemini API --- it
does not integrate with or resell any of the above products.

**2. Objectives**

- Allow a student to select their UG program and discipline and receive
  a soft-skills assessment tailored to that field.

- Combine a validated, reusable question bank with AI-generated
  discipline-specific scenario framing, so scores remain comparable
  across candidates while content feels relevant.

- Score responses across defined soft-skill domains (e.g.,
  Communication, Critical Thinking, Emotional Intelligence,
  Collaboration, Adaptability, Ethical Reasoning).

- Generate a candidate-facing PDF report highlighting strengths and
  growth areas, written in a consistently encouraging, constructive tone
  --- never demotivating.

- Support the addition of new programs/disciplines over time without
  requiring new code.

**3. Scope**

**3.1 In Scope**

- Candidate registration/login and program-discipline selection.

- Branch-aware assessment engine: question selection by
  discipline-to-skill weighting.

- Question types: Likert-scale, multiple-choice situational judgment
  (SJT), and short open-text responses.

- AI (Gemini) generation of discipline-flavored scenario text layered on
  fixed, validated skill-testing constructs.

- AI scoring of open-text responses against a defined rubric.

- Automated PDF report generation (strengths, growth areas, per-domain
  scores, encouraging narrative).

- Admin console: manage programs/disciplines, skill-weight mappings,
  question bank, and review AI-proposed weightings for new disciplines.

- Candidate dashboard: assessment history, past reports.

**3.2 Out of Scope (v1)**

- Live proctoring / webcam-based behavioral analysis (as used by
  HireVue).

- Neuroscience-style interactive games (as used by Pymetrics) --- noted
  as a possible v2 enhancement.

- Real-time speech/audio analysis (as used by Yoodli) --- possible v2
  enhancement.

- Third-party credential/badge issuance or integration with LinkedIn.

- Native mobile applications (web-responsive only in v1).

**4. Stakeholders**

  ----------------------- ------------------------ ----------------------
  **Stakeholder**         **Interest**             **Involvement**

  Product Owner / Sponsor Overall product          Approves requirements,
                          direction, ROI           sign-off

  Candidates (students)   Fair, relevant,          End users
                          encouraging assessment   

  Academic/Institution    Manage disciplines &     Admin console users
  Admins                  question content         

  Psychometric SME /      Validity of questions &  Reviews question bank
  Reviewer                scoring                  & rubrics

  Development Team        Build & maintain the     Implementation
                          platform                 

  Data Protection Officer Compliance with data     Reviews privacy design
  / Legal                 protection law           
  ----------------------- ------------------------ ----------------------

**5. User Roles & Personas**

  ------------------ -------------------------- -------------------------
  **Role**           **Description**            **Key Actions**

  Candidate          UG student taking the      Register, select
                     assessment                 program/discipline, take
                                                assessment, view/download
                                                report

  Admin              Manages platform content   Add/edit programs,
                     and configuration          disciplines, skill
                                                weights, question bank;
                                                approve new disciplines

  Reviewer (SME)     Validates psychometric     Reviews/edits AI-proposed
                     content                    discipline weightings and
                                                questions before
                                                publishing

  Super Admin        System-level control       Manage admin users, view
                                                analytics, manage API
                                                usage/costs
  ------------------ -------------------------- -------------------------

**6. Functional Requirements**

**6.1 Onboarding & Program/Discipline Selection**

  --------- ----------------------------------------------- --------------
  **ID**    **Requirement**                                 **Priority**

  FR-01     Candidate can create an account and log in      Must
            (email/password or OTP via Supabase Auth).      

  FR-02     Candidate selects a UG Program (e.g., B.A.,     Must
            B.Sc., B.Tech, MBBS, B.Pharm, LLB) from a       
            configurable list.                              

  FR-03     Candidate selects a Discipline within that      Must
            program (e.g., Journalism, Life Science) from a 
            configurable list scoped to the chosen program. 

  FR-04     If a candidate\'s exact discipline is not       Should
            listed, they can request it; the request is     
            logged for Admin/SME review (see FR-16).        
  --------- ----------------------------------------------- --------------

**6.2 Assessment Engine (Branching Logic)**

  --------- ----------------------------------------------- --------------
  **ID**    **Requirement**                                 **Priority**

  FR-05     System retrieves the skill-weight profile for   Must
            the selected program+discipline and determines  
            which soft-skill domains to test, and how many  
            questions per domain.                           

  FR-06     System selects validated items from the core    Must
            Question Bank matching the required domains and 
            difficulty spread.                              

  FR-07     For scenario-based items, the system calls the  Must
            Gemini API to rewrite the scenario\'s surface   
            context to match the candidate\'s discipline,   
            while preserving the underlying construct being 
            measured.                                       

  FR-08     Assessment supports Likert-scale,               Must
            single/multiple-choice SJT, and short open-text 
            question formats within a single session.       

  FR-09     System can adapt difficulty of subsequent items Could
            based on prior response performance (adaptive   
            testing).                                       

  FR-10     Candidate can pause and resume an in-progress   Should
            assessment (session state persisted in          
            Supabase).                                      
  --------- ----------------------------------------------- --------------

**6.3 Scoring & AI Evaluation**

  --------- ----------------------------------------------- --------------
  **ID**    **Requirement**                                 **Priority**

  FR-11     Closed-format responses (Likert/MCQ) are scored Must
            deterministically using predefined scoring keys 
            --- not by the LLM.                             

  FR-12     Open-text responses are scored by Gemini        Must
            against a defined rubric per skill domain,      
            returning a structured numeric score plus       
            justification.                                  

  FR-13     System aggregates domain-level and overall      Must
            scores per candidate session.                   

  FR-14     All AI-generated content (question text,        Must
            scores, justifications) is logged and traceable 
            to the model version and prompt used, for       
            auditability.                                   
  --------- ----------------------------------------------- --------------

**6.4 Report Generation**

  --------- ----------------------------------------------- --------------
  **ID**    **Requirement**                                 **Priority**

  FR-15     On assessment completion, the system generates  Must
            a structured JSON result (domain scores, top    
            strengths, top growth areas) via Gemini,        
            constrained by a fixed output schema.           

  FR-16     The system renders the JSON into a formatted    Must
            PDF report including candidate name,            
            program/discipline, date, per-domain scores     
            (visual bars/chart), strengths, growth areas,   
            and a narrative summary.                        

  FR-17     All report language --- strengths, growth       Must
            areas, and narrative --- must follow the        
            platform\'s tone guidelines: constructive,      
            specific, and encouraging. Growth areas are     
            always framed as development opportunities,     
            never as failures or deficits.                  

  FR-18     Report is stored in Supabase Storage and        Must
            accessible from the candidate\'s dashboard; a   
            shareable/downloadable link is provided.        
  --------- ----------------------------------------------- --------------

**6.5 Admin Console**

  --------- ----------------------------------------------- --------------
  **ID**    **Requirement**                                 **Priority**

  FR-19     Admin can create/edit Programs, Disciplines,    Must
            Skill Domains, and Discipline-Skill weight      
            mappings.                                       

  FR-20     Admin can add, edit, retire, and tag items in   Must
            the core Question Bank.                         

  FR-21     For a newly requested discipline, Admin/SME can Must
            trigger a one-time Gemini-assisted proposal of  
            a skill-weighting profile, then review and      
            approve/edit it before it becomes selectable by 
            candidates.                                     

  FR-22     Admin can view aggregate (anonymized)           Should
            analytics: assessments completed, average       
            domain scores by discipline, drop-off rate.     
  --------- ----------------------------------------------- --------------

**6.6 Candidate Dashboard**

  --------- ----------------------------------------------- --------------
  **ID**    **Requirement**                                 **Priority**

  FR-23     Candidate can view a history of past assessment Should
            attempts and download past reports.             

  FR-24     Candidate can retake an assessment after a      Could
            configurable cooldown period.                   
  --------- ----------------------------------------------- --------------

**7. Non-Functional Requirements**

  -------------------- --------------------------------------------------
  **Category**         **Requirement**

  Performance          Assessment question load time \< 2s; report
                       generation completed within 30s of assessment
                       submission.

  Scalability          Must support concurrent assessment sessions
                       (target: 500 concurrent candidates for v1) without
                       degradation.

  Availability         Target 99.5% uptime for candidate-facing services.

  Security             Gemini API key and all secrets held server-side
                       only (Supabase Edge Functions); never exposed to
                       the browser. Row-Level Security (RLS) enforced on
                       all Supabase tables so candidates can only access
                       their own data.

  Data Privacy         Compliant with applicable data protection law
                       (e.g., India\'s DPDP Act, 2023) --- see Section 9
                       and the separate Data Privacy document.

  Usability            Mobile-responsive; accessible to WCAG 2.1 AA where
                       practical; assessment UI usable without
                       instructions beyond on-screen guidance.

  Auditability         Every AI-generated question, score, and report is
                       logged with prompt, model version, and timestamp.

  Maintainability      New programs/disciplines addable via
                       configuration/admin console without a code
                       deployment.

  Cost Control         Gemini API usage monitored; caching/reuse of
                       generated scenario text where appropriate to
                       control cost.
  -------------------- --------------------------------------------------

**8. Tone & Content Guidelines (Report Language)**

Because this platform assesses students who may be early in their
careers, report language is a first-class requirement, not a styling
detail:

- Strengths are named specifically and tied to real response evidence,
  not generic praise.

- Growth areas are always framed as \"opportunities to develop\" with a
  concrete, actionable next step --- never as weaknesses, failures, or
  deficiencies.

- No comparative or ranking language against other candidates (e.g., no
  \"below average\") is shown to the candidate.

- Overall summary paragraph must close on an encouraging,
  forward-looking note in every report, regardless of overall score.

- This tone contract is enforced via a fixed system prompt and reviewed
  periodically by an SME (see Section 10).

**9. Compliance & Data Handling Considerations**

- Candidate consent captured before assessment begins, explaining data
  use and AI processing.

- Personally identifiable information minimized in data sent to the
  Gemini API where feasible.

- Data retention policy defined (e.g., reports retained for N months,
  deletable on request).

- Candidates can request export or deletion of their data.

**10. Assumptions & Constraints**

- Core question bank items are authored/vetted by a psychometric SME
  prior to launch; the LLM does not invent core constructs unsupervised.

- Gemini API availability and rate limits are accepted as an external
  dependency; graceful degradation (e.g., fallback to a non-AI-flavored
  generic scenario) is required if the API is unavailable.

- GitHub Pages hosts the static frontend only; all secret-holding logic
  runs in Supabase Edge Functions.

- Initial discipline coverage will be launched with a limited, curated
  set of programs/disciplines and expanded post-launch.

**11. Success Metrics**

  -------------------------------- --------------------------------------
  **Metric**                       **Target**

  Assessment completion rate       \> 80% of started sessions

  Report generation success rate   \> 99% without manual intervention

  Candidate-reported               \> 4/5 average
  clarity/fairness (survey)        

  New discipline onboarding time   \< 2 business days
  (with SME review)                

  Tone-guideline compliance (SME   100% of sampled reports pass
  spot-check of reports)           
  -------------------------------- --------------------------------------

**12. Glossary**

  ------------------ ----------------------------------------------------
  **Term**           **Definition**

  Branch /           The specific field of study within a UG program,
  Discipline         e.g., Journalism within B.A.

  Skill Domain       A measurable soft-skill construct, e.g.,
                     Communication, Critical Thinking.

  SJT                Situational Judgment Test --- a scenario-based
                     question format assessing decision-making.

  Discipline-Skill   The mapping that determines which skill domains and
  Weighting          how many questions apply to a given discipline.

  RLS                Row-Level Security --- Supabase/Postgres feature
                     restricting data access per user.
  ------------------ ----------------------------------------------------
