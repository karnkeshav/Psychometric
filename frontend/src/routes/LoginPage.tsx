import { Navigate } from 'react-router-dom'
import { AuthForm } from '../components/AuthForm'
import { useAuth } from '../hooks/useAuth'

export function LoginPage() {
  const { session, loading } = useAuth()

  if (loading) return null
  if (session) return <Navigate to="/programs" replace />

  return <AuthForm />
}
