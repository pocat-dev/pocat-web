/// <reference types="vite/client" />
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Sidebar } from '../components/Sidebar'
import { ThemeProvider } from '../contexts/ThemeContext'

export const Route = createRootRoute({
  component: () => (
    <ThemeProvider>
      <div className="h-screen flex overflow-hidden bg-surface">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Outlet />
        </main>
        {import.meta.env.DEV && <TanStackRouterDevtools position="bottom-right" />}
      </div>
    </ThemeProvider>
  ),
})
