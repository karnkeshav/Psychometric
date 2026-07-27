import { useEffect, useState } from 'react'
import { listDraftQuestions, type DraftQuestion } from '../lib/api/questions'
import { ProgressHeader } from './ProgressHeader'
import { LikertCard } from './LikertCard'
import { SjtCard } from './SjtCard'
import { OpenTextCard } from './OpenTextCard'

export function QuestionSession({ disciplineId }: { disciplineId: string }) {
  const [questions, setQuestions] = useState<DraftQuestion[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})

  useEffect(() => {
    listDraftQuestions(disciplineId)
      .then(setQuestions)
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Something went wrong.'),
      )
  }, [disciplineId])

  if (error) return <p className="text-sm text-red-600">{error}</p>
  if (!questions) return <p className="text-sm text-charcoal">Loading…</p>
  if (questions.length === 0) {
    return (
      <p className="text-sm text-charcoal">
        No questions are available for this discipline yet.
      </p>
    )
  }

  const question = questions[index]
  const isFirst = index === 0
  const isLast = index === questions.length - 1

  function setAnswer(value: string) {
    setAnswers((prev) => ({ ...prev, [question.id]: value }))
  }

  return (
    <div className="rounded-xl bg-surface p-6 shadow-sm">
      <ProgressHeader
        current={index + 1}
        total={questions.length}
        domainName={question.skillDomainName}
      />

      {question.type === 'likert' && (
        <LikertCard
          questionId={question.id}
          statement={question.baseText}
          value={answers[question.id]}
          onChange={setAnswer}
        />
      )}
      {question.type === 'mcq_sjt' && question.options && (
        <SjtCard
          questionId={question.id}
          scenario={question.baseText}
          options={question.options}
          value={answers[question.id]}
          onChange={setAnswer}
        />
      )}
      {question.type === 'open_text' && (
        <OpenTextCard
          prompt={question.baseText}
          value={answers[question.id]}
          onChange={setAnswer}
        />
      )}

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          disabled={isFirst}
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          className="rounded-lg px-4 py-2 text-sm font-medium text-charcoal transition hover:text-ink disabled:opacity-40"
        >
          Back
        </button>

        {isLast ? (
          <p className="text-sm text-charcoal">
            That's every question available right now — the full assessment
            flow is coming in a later phase.
          </p>
        ) : (
          <button
            type="button"
            onClick={() => setIndex((i) => Math.min(questions.length - 1, i + 1))}
            className="rounded-lg bg-ink px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
          >
            Next →
          </button>
        )}
      </div>
    </div>
  )
}
