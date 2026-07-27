import { useParams } from 'react-router-dom'
import { InstructionsSummary } from '../components/InstructionsSummary'

export function InstructionsPage() {
  const { disciplineId } = useParams<{ disciplineId: string }>()
  if (!disciplineId) return null

  return <InstructionsSummary disciplineId={disciplineId} />
}
