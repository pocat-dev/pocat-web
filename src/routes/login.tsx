import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { PublicLayout } from '../layouts/PublicLayout'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  // Redirect if already logged in
  if (isAuthenticated) {
    navigate({ to: '/dashboard' })
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const success = await login(username, password)
    
    if (success) {
      navigate({ to: '/dashboard' })
    } else {
      setError('Invalid username or password')
    }
    setIsLoading(false)
  }

  return (
    <PublicLayout>
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-brand-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-play text-white text-xl" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-semibold text-primary">Welcome back</h1>
            <p className="text-secondary text-sm mt-1">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-error-50 border border-error-500/20 rounded-lg text-error-600 text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-primary mb-1.5">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input"
                placeholder="Enter username"
                required
                autoComplete="username"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-primary mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="Enter password"
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full"
            >
              {isLoading ? (
                <>
                  <i className="fa-solid fa-spinner animate-spin" aria-hidden="true" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="text-center text-xs text-tertiary mt-6">
            Demo: sandikodev / password
          </p>
        </div>
      </div>
    </PublicLayout>
  )
}
