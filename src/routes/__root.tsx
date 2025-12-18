/// <reference types="vite/client" />
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Sidebar } from '../components/Sidebar'
import { ThemeProvider } from '../contexts/ThemeContext'
import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  component: () => (
    <ThemeProvider>
      <div className="h-screen bg-surface text-primary flex">
        <Sidebar />
        
        <main className="flex-1 flex flex-col min-w-0" role="main">
          <Outlet />
        </main>
        
        {process.env.NODE_ENV === 'development' && (
          <TanStackRouterDevtools />
        )}
      </div>
    </ThemeProvider>
  ),
})
