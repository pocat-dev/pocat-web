import { useAuth } from '../contexts/AuthContext'
import { Navigate, useLocation } from '@tanstack/react-router'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  // Show loading during auth check
  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner">
          <i className="fa-solid fa-spinner fa-spin"></i>
        </div>
        <p>Loading...</p>
      </div>
    )
  }

  // Redirect to login with current path if not authenticated
  // BUT don't redirect if already on login page to prevent infinite loop
  if (!isAuthenticated) {
    const currentPath = location.pathname
    
    // Prevent infinite redirect loop
    if (currentPath === '/login') {
      return null
    }
    
    return (
      <Navigate 
        to="/login" 
        search={{ redirect: currentPath }}
        replace
      />
    )
  }

  return <>{children}</>
}
