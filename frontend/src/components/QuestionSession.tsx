import { useEffect, useRef, useState } from 'react'
import { listDraftQuestions } from '../lib/api/questions'
import {
  completeSession,
  createSession,
  createSessionQuestions,
  findInProgressSession,
  listResponses,
  listSessionQuestions,
  upsertResponse,
  type SessionQuestion,
} from '../lib/api/session'
import { useAuth } from '../hooks/useAuth'
import { ProgressHeader } from './ProgressHeader'
import { LikertCard } from './LikertCard'
import { SjtCard } from './SjtCard'
import { OpenTextCard } from './OpenTextCard'

export function QuestionSession({ disciplineId }: { disciplineId: string }) {
  const { session: authSession } = useAuth()
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [questions, setQuestions] = useState<SessionQuestion[] | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)
  const [index, setIndex] = useState(0)
  const completedRef = useRef(false)

  useEffect(() => {
    if (!authSession) return
    let cancelled = false

    async function load() {
      const existing = await findInProgressSession(disciplineId)
      let sid: string
      let sessionQuestions: SessionQuestion[]

      if (existing) {
        sid = existing.id
        sessionQuestions = await listSessionQuestions(sid)
      } else {
        const draft = await listDraftQuestions(disciplineId)
        if (draft.length === 0) {
          if (!cancelled) setQuestions([])
          return
        }
        sid = await createSession(disciplineId, authSession!.user.id)
        sessionQuestions = await createSessionQuestions(sid, draft)
      }

      const responseMap = await listResponses(sessionQuestions.map((q) => q.id))
      if (!cancelled) {
        setSessionId(sid)
        setQuestions(sessionQuestions)
        setAnswers(responseMap)

        // Resume at the first unanswered question, not the start of the
        // list — a fresh session has no responses yet, so this naturally
        // lands on index 0 there too, without needing a separate branch.
        const firstUnanswered = sessionQuestions.findIndex(
          (q) => responseMap[q.id] === undefined,
        )
        setIndex(firstUnanswered === -1 ? sessionQuestions.length - 1 : firstUnanswered)
      }
    }

    load().catch((err) => {
      if (!cancelled) {
        setError(err instanceof Error ? err.message : 'Something went wrong.')
      }
    })

    return () => {
      cancelled = true
    }
  }, [disciplineId, authSession?.user.id])

  const isLast = questions !== null && questions.length > 0 && index === questions.length - 1

  useEffect(() => {
    if (isLast && sessionId && !completedRef.current) {
      completedRef.current = true
      completeSession(sessionId).catch((err) => {
        console.error('Failed to mark session completed', err)
      })
    }
  }, [isLast, sessionId])

  if (error) return <p className="text-sm text-red-600">{error}</p>
  if (!authSession || !questions) {
    return <p className="text-sm text-charcoal">Loading…</p>
  }
  if (questions.length === 0) {
    return (
      <p className="text-sm text-charcoal">
        No questions are available for this discipline yet.
      </p>
    )
  }

  const question = questions[index]
  const isFirst = index === 0

  function setAnswerLocal(value: string) {
    setAnswers((prev) => ({ ...prev, [question.id]: value }))
  }

  function persistAnswer(value: string) {
    upsertResponse(question.id, value).catch((err) => {
      console.error('Failed to save response', err)
    })
  }

  function handleImmediateChange(value: string) {
    setAnswerLocal(value)
    persistAnswer(value)
  }

  function handleOpenTextBlur() {
    const value = answers[question.id]
    if (value !== undefined) persistAnswer(value)
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
          statement={question.promptText}
          value={answers[question.id]}
          onChange={handleImmediateChange}
        />
      )}
      {question.type === 'mcq_sjt' && question.options && (
        <SjtCard
          questionId={question.id}
          scenario={question.promptText}
          options={question.options}
          value={answers[question.id]}
          onChange={handleImmediateChange}
        />
      )}
      {question.type === 'open_text' && (
        <OpenTextCard
          prompt={question.promptText}
          value={answers[question.id]}
          onChange={setAnswerLocal}
          onBlur={handleOpenTextBlur}
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
