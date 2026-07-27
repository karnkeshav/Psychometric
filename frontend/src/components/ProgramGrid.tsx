import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listPrograms, type Program } from '../lib/api/programs'
import { DisciplineRequestModal } from './DisciplineRequestModal'

export function ProgramGrid() {
  const [programs, setPrograms] = useState<Program[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [requestOpen, setRequestOpen] = useState(false)

  useEffect(() => {
    listPrograms()
      .then(setPrograms)
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Something went wrong.'),
      )
  }, [])

  return (
    <div>
      <h1 className="mb-6 text-xl">Select your program</h1>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {!programs && !error && (
        <p className="text-sm text-charcoal">Loading programs…</p>
      )}

      {programs && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {programs.map((program) => (
            <Link
              key={program.id}
              to={`/programs/${program.id}/disciplines`}
              className="rounded-xl border border-mist bg-surface px-4 py-6 text-center text-sm font-medium text-ink shadow-sm transition hover:border-jade hover:shadow-md"
            >
              {program.name}
            </Link>
          ))}
        </div>
      )}

      <p className="mt-6 text-sm text-charcoal">
        Don't see your program?{' '}
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
          label="Request a program"
          onClose={() => setRequestOpen(false)}
        />
      )}
    </div>
  )
}
