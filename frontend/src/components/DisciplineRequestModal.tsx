import { useState, type FormEvent } from 'react'
import { requestDiscipline } from '../lib/api/disciplineRequests'
import { useAuth } from '../hooks/useAuth'

export function DisciplineRequestModal({
  label,
  onClose,
}: {
  label: string
  onClose: () => void
}) {
  const { session } = useAuth()
  const [name, setName] = useState('')
  const [notes, setNotes] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!session) return
    setError(null)
    setSubmitting(true)
    try {
      await requestDiscipline(name, notes || null, session.user.id)
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-ink/40 px-4">
      <div className="w-full max-w-sm rounded-xl bg-surface p-6 shadow-md">
        {submitted ? (
          <>
            <h2 className="mb-2 text-lg">Thanks!</h2>
            <p className="mb-4 text-sm text-charcoal">
              Our team will review this and may add it soon.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-ink px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
            >
              Close
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <h2 className="text-lg">{label}</h2>
            <label className="flex flex-col gap-1 text-sm text-charcoal">
              Name
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-lg border border-mist px-3 py-2 focus:outline-none focus-visible:outline-2 focus-visible:outline-jade"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-charcoal">
              Anything else we should know? (optional)
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="rounded-lg border border-mist px-3 py-2 focus:outline-none focus-visible:outline-2 focus-visible:outline-jade"
              />
            </label>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-4 py-2 text-sm text-charcoal transition hover:text-ink"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-ink px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
              >
                Send Request
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
