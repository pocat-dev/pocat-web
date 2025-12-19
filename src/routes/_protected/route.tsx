import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { AppShell } from '@/layouts/AppShell'
import { SplashScreen } from '@/components/SplashScreen'
import { useState } from 'react'

export const Route = createFileRoute('/_protected')({
  beforeLoad: ({ location }) => {
    const stored = localStorage.getItem('pocat_user')
    const isAuthenticated = !!stored
    
    if (!isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.pathname,
        },
      })
    }
  },
  component: ProtectedLayoutComponent,
})

function ProtectedLayoutComponent() {
  const [showSplash, setShowSplash] = useState(true)

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />
  }

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  )
}
