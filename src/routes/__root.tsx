/// <reference types="vite/client" />
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { ThemeProvider } from '../contexts/ThemeContext'
import { AuthProvider } from '../contexts/AuthContext'

export const Route = createRootRoute({
  component: () => (
    <AuthProvider>
      <ThemeProvider>
        <Outlet />
        {import.meta.env.DEV && <TanStackRouterDevtools position="bottom-right" />}
      </ThemeProvider>
    </AuthProvider>
  ),
})
