import { supabase } from '../supabaseClient'

export async function requestDiscipline(
  requestedName: string,
  notes: string | null,
  requestedBy: string,
): Promise<void> {
  const { error } = await supabase.from('discipline_requests').insert({
    requested_name: requestedName,
    notes,
    requested_by: requestedBy,
  })

  if (error) throw error
}
