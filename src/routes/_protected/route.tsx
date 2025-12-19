import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { AppShell } from '../../layouts/AppShell'

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
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  )
}
