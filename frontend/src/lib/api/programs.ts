import { supabase } from '../supabaseClient'
import type { Database } from '../database.types'

export type Program = Database['public']['Tables']['programs']['Row']

export async function listPrograms(): Promise<Program[]> {
  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .order('name')

  if (error) throw error
  return data
}
