import { supabase } from '../supabaseClient'

export type QuestionType = 'likert' | 'mcq_sjt' | 'open_text'

export interface QuestionOption {
  key: string
  text: string
}

export interface DraftQuestion {
  id: string
  skillDomainName: string
  type: QuestionType
  baseText: string
  options: QuestionOption[] | null
  sequenceNo: number
}

export async function listDraftQuestions(
  disciplineId: string,
): Promise<DraftQuestion[]> {
  const { data, error } = await supabase.rpc('discipline_questions', {
    p_discipline_id: disciplineId,
  })

  if (error) throw error
  return data.map((row) => ({
    id: row.question_id,
    skillDomainName: row.skill_domain_name,
    type: row.type as QuestionType,
    baseText: row.base_text,
    options: (row.options_json as unknown as QuestionOption[] | null) ?? null,
    sequenceNo: row.sequence_no,
  }))
}
