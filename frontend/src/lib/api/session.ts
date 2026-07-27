import { supabase } from '../supabaseClient'
import type { Json } from '../database.types'
import type { DraftQuestion, QuestionOption, QuestionType } from './questions'

export interface SessionQuestion {
  id: string
  skillDomainName: string
  type: QuestionType
  promptText: string
  options: QuestionOption[] | null
  sequenceNo: number
}

export async function findInProgressSession(
  disciplineId: string,
): Promise<{ id: string } | null> {
  const { data, error } = await supabase
    .from('assessment_sessions')
    .select('id')
    .eq('discipline_id', disciplineId)
    .eq('status', 'in_progress')
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function createSession(
  disciplineId: string,
  candidateId: string,
): Promise<string> {
  const { data, error } = await supabase
    .from('assessment_sessions')
    .insert({ discipline_id: disciplineId, candidate_id: candidateId })
    .select('id')
    .single()

  if (error) throw error
  return data.id
}

export async function createSessionQuestions(
  sessionId: string,
  questions: DraftQuestion[],
): Promise<SessionQuestion[]> {
  const rows = questions.map((q) => ({
    session_id: sessionId,
    question_bank_id: q.id,
    generated_scenario_text: q.baseText,
    sequence_no: q.sequenceNo,
    type: q.type,
    options_json: q.options as unknown as Json,
    skill_domain_name: q.skillDomainName,
  }))

  const { data, error } = await supabase
    .from('session_questions')
    .insert(rows)
    .select('id, skill_domain_name, type, generated_scenario_text, options_json, sequence_no')
    .order('sequence_no')

  if (error) throw error
  return data.map(rowToSessionQuestion)
}

export async function listSessionQuestions(
  sessionId: string,
): Promise<SessionQuestion[]> {
  const { data, error } = await supabase
    .from('session_questions')
    .select('id, skill_domain_name, type, generated_scenario_text, options_json, sequence_no')
    .eq('session_id', sessionId)
    .order('sequence_no')

  if (error) throw error
  return data.map(rowToSessionQuestion)
}

export async function listResponses(
  sessionQuestionIds: string[],
): Promise<Record<string, string>> {
  if (sessionQuestionIds.length === 0) return {}

  const { data, error } = await supabase
    .from('responses')
    .select('session_question_id, raw_response')
    .in('session_question_id', sessionQuestionIds)

  if (error) throw error
  return Object.fromEntries(data.map((r) => [r.session_question_id, r.raw_response]))
}

export async function upsertResponse(
  sessionQuestionId: string,
  rawResponse: string,
): Promise<void> {
  const { error } = await supabase
    .from('responses')
    .upsert(
      { session_question_id: sessionQuestionId, raw_response: rawResponse },
      { onConflict: 'session_question_id' },
    )

  if (error) throw error
}

export async function completeSession(sessionId: string): Promise<void> {
  const { error } = await supabase
    .from('assessment_sessions')
    .update({ status: 'completed', completed_at: new Date().toISOString() })
    .eq('id', sessionId)

  if (error) throw error
}

function rowToSessionQuestion(row: {
  id: string
  skill_domain_name: string
  type: string
  generated_scenario_text: string | null
  options_json: unknown
  sequence_no: number
}): SessionQuestion {
  return {
    id: row.id,
    skillDomainName: row.skill_domain_name,
    type: row.type as QuestionType,
    promptText: row.generated_scenario_text ?? '',
    options: (row.options_json as QuestionOption[] | null) ?? null,
    sequenceNo: row.sequence_no,
  }
}
