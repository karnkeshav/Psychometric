import { supabase } from '../supabaseClient'
import type { Database } from '../database.types'

export type Discipline = Database['public']['Tables']['disciplines']['Row']

// DEV-ONLY: includes 'pending_review' so local/staging work has data to
// render before SME review flips disciplines to 'active' (see
// supabase/seed_notes.md and supabase/migrations/0009_dev_pending_review_visibility.sql,
// and docs/PRE_PRODUCTION_CHECKLIST.md — this must resolve to 'active' only
// in production).
const DISCIPLINE_STATUSES: Discipline['status'][] = import.meta.env.DEV
  ? ['active', 'pending_review']
  : ['active']

export async function listDisciplinesForProgram(
  programId: string,
): Promise<Discipline[]> {
  const { data, error } = await supabase
    .from('disciplines')
    .select('*')
    .eq('program_id', programId)
    .in('status', DISCIPLINE_STATUSES)
    .order('name')

  if (error) throw error
  return data
}

export async function getDiscipline(
  disciplineId: string,
): Promise<Discipline> {
  const { data, error } = await supabase
    .from('disciplines')
    .select('*')
    .eq('id', disciplineId)
    .single()

  if (error) throw error
  return data
}
