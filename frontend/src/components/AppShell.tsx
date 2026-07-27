import type { ReactNode } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../hooks/useAuth'

export function AppShell({ children }: { children: ReactNode }) {
  const { session } = useAuth()

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-mist bg-surface">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <span className="font-display text-lg font-semibold text-ink">
            Branch-Wise Assessment
          </span>
          {session && (
            <button
              type="button"
              onClick={() => supabase.auth.signOut()}
              className="text-sm text-charcoal transition hover:text-ink"
            >
              Sign out
            </button>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-xl px-6 py-10">{children}</main>
    </div>
  )
}
