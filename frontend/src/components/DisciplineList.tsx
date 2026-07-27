import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  listDisciplinesForProgram,
  type Discipline,
} from '../lib/api/disciplines'
import { listPrograms, type Program } from '../lib/api/programs'
import { DisciplineRequestModal } from './DisciplineRequestModal'

export function DisciplineList() {
  const { programId } = useParams<{ programId: string }>()
  const [program, setProgram] = useState<Program | null>(null)
  const [disciplines, setDisciplines] = useState<Discipline[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [requestOpen, setRequestOpen] = useState(false)

  useEffect(() => {
    if (!programId) return
    Promise.all([listPrograms(), listDisciplinesForProgram(programId)])
      .then(([programs, disciplineRows]) => {
        setProgram(programs.find((p) => p.id === programId) ?? null)
        setDisciplines(disciplineRows)
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Something went wrong.'),
      )
  }, [programId])

  return (
    <div>
      <h1 className="mb-6 text-xl">
        {program ? `${program.name} → Select your discipline` : 'Select your discipline'}
      </h1>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {!disciplines && !error && (
        <p className="text-sm text-charcoal">Loading disciplines…</p>
      )}

      {disciplines && disciplines.length === 0 && (
        <p className="text-sm text-charcoal">
          No disciplines are set up for this program yet.
        </p>
      )}

      {disciplines && disciplines.length > 0 && (
        <ul className="flex flex-col gap-2">
          {disciplines.map((discipline) => (
            <li key={discipline.id}>
              <Link
                to={`/disciplines/${discipline.id}/instructions`}
                className="block rounded-xl border border-mist bg-surface px-4 py-3 text-sm font-medium text-ink shadow-sm transition hover:border-jade hover:shadow-md"
              >
                {discipline.name}
              </Link>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-6 text-sm text-charcoal">
        Don't see your discipline?{' '}
        <button
          type="button"
          onClick={() => setRequestOpen(true)}
          className="text-jade transition hover:underline"
        >
          Request it
        </button>
      </p>

      {requestOpen && (
        <DisciplineRequestModal
          label="Request a discipline"
          onClose={() => setRequestOpen(false)}
        />
      )}
    </div>
  )
}
