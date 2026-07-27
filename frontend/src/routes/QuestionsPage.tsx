import { useParams } from 'react-router-dom'
import { QuestionSession } from '../components/QuestionSession'

export function QuestionsPage() {
  const { disciplineId } = useParams<{ disciplineId: string }>()
  if (!disciplineId) return null

  return <QuestionSession disciplineId={disciplineId} />
}
