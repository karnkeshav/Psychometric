import { supabase } from '../supabaseClient'

export interface DisciplineSummary {
  totalQuestions: number
  estimatedMinutesLow: number
  estimatedMinutesHigh: number
  domainNames: string[]
}

export async function getDisciplineSummary(
  disciplineId: string,
): Promise<DisciplineSummary> {
  const { data, error } = await supabase
    .rpc('discipline_summary', { p_discipline_id: disciplineId })
    .single()

  if (error) throw error
  return {
    totalQuestions: data.total_questions,
    estimatedMinutesLow: data.estimated_minutes_low,
    estimatedMinutesHigh: data.estimated_minutes_high,
    domainNames: data.domain_names ?? [],
  }
}
