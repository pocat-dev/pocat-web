import { redirect } from '@tanstack/react-router'

// Auth utilities for route protection
export const requireAuth = () => {
  const stored = localStorage.getItem('pocat_user')
  const isAuthenticated = !!stored
  
  if (!isAuthenticated) {
    throw redirect({
      to: '/login',
      search: {
        redirect: window.location.pathname,
      },
    })
  }
  
  return JSON.parse(stored)
}

export const redirectIfAuthenticated = () => {
  const stored = localStorage.getItem('pocat_user')
  const isAuthenticated = !!stored
  
  if (isAuthenticated) {
    const searchParams = new URLSearchParams(window.location.search)
    const redirectTo = searchParams.get('redirect') || '/overview'
    
    throw redirect({
      to: redirectTo,
    })
  }
}
