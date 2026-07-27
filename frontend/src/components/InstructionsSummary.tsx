import { useEffect, useState } from 'react'
import {
  getDisciplineSummary,
  type DisciplineSummary,
} from '../lib/api/disciplineSummary'
import { getDiscipline, type Discipline } from '../lib/api/disciplines'

const TIPS = [
  "Answer as yourself, not as you think you 'should' answer — there are no wrong answers.",
  'You can flag a question to revisit later.',
  'Try to complete it in one sitting.',
]

export function InstructionsSummary({ disciplineId }: { disciplineId: string }) {
  const [discipline, setDiscipline] = useState<Discipline | null>(null)
  const [summary, setSummary] = useState<DisciplineSummary | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([getDiscipline(disciplineId), getDisciplineSummary(disciplineId)])
      .then(([disciplineRow, summaryRow]) => {
        setDiscipline(disciplineRow)
        setSummary(summaryRow)
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Something went wrong.'),
      )
  }, [disciplineId])

  if (error) return <p className="text-sm text-red-600">{error}</p>
  if (!discipline || !summary) {
    return <p className="text-sm text-charcoal">Loading…</p>
  }

  return (
    <div className="rounded-xl bg-surface p-6 shadow-sm">
      <h1 className="mb-3 text-xl">Your {discipline.name} Assessment</h1>

      <p className="mb-4 font-mono text-sm text-ink">
        {summary.totalQuestions} questions · About {summary.estimatedMinutesLow}–{summary.estimatedMinutesHigh} minutes
      </p>

      <p className="mb-1 text-sm font-medium text-charcoal">Covers:</p>
      <p className="mb-6 text-sm text-charcoal">
        {summary.domainNames.join(', ')}
      </p>

      <p className="mb-1 text-sm font-medium text-charcoal">Tips:</p>
      <ul className="mb-6 list-disc pl-5 text-sm text-charcoal">
        {TIPS.map((tip) => (
          <li key={tip}>{tip}</li>
        ))}
      </ul>

      <button
        type="button"
        disabled
        title="Assessment questions are coming in a later phase"
        className="w-full rounded-lg bg-ink px-4 py-2 text-sm font-medium text-white opacity-50"
      >
        Start Assessment
      </button>
    </div>
  )
}
