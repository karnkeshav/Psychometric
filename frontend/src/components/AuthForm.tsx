import { useState, type FormEvent } from 'react'
import { supabase } from '../lib/supabaseClient'

type Mode = 'sign-in' | 'sign-up'

export function AuthForm() {
  const [mode, setMode] = useState<Mode>('sign-in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      if (mode === 'sign-up') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        })
        if (signUpError) throw signUpError
        if (!data.session) {
          // Email confirmation is required on this project — sign-in
          // happens after the candidate confirms via the emailed link.
          setAwaitingConfirmation(true)
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword(
          { email, password },
        )
        if (signInError) throw signInError
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  if (awaitingConfirmation) {
    return (
      <div className="rounded-xl bg-surface p-6 text-center shadow-sm">
        <h1 className="mb-2 text-xl">Almost there</h1>
        <p className="text-sm text-charcoal">
          We've sent a confirmation link to {email}. Confirm your email, then
          come back and sign in.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl bg-surface p-6 shadow-sm">
      <h1 className="mb-6 text-xl">
        {mode === 'sign-in' ? 'Sign in' : 'Create your account'}
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {mode === 'sign-up' && (
          <label className="flex flex-col gap-1 text-sm text-charcoal">
            Full name
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="rounded-lg border border-mist px-3 py-2 focus:outline-none focus-visible:outline-2 focus-visible:outline-jade"
            />
          </label>
        )}
        <label className="flex flex-col gap-1 text-sm text-charcoal">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-mist px-3 py-2 focus:outline-none focus-visible:outline-2 focus-visible:outline-jade"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-charcoal">
          Password
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-mist px-3 py-2 focus:outline-none focus-visible:outline-2 focus-visible:outline-jade"
          />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded-lg bg-ink px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {mode === 'sign-in' ? 'Sign In' : 'Create Account'}
        </button>
      </form>

      <button
        type="button"
        onClick={() => {
          setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in')
          setError(null)
        }}
        className="mt-4 text-sm text-jade transition hover:underline"
      >
        {mode === 'sign-in'
          ? "Don't have an account? Create one"
          : 'Already have an account? Sign in'}
      </button>
    </div>
  )
}
