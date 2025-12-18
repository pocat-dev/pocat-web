import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Sidebar } from '../components/Sidebar'
import appCss from '../src/styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  component: () => (
    <div className="h-screen bg-slate-950 text-white flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>
      
      {process.env.NODE_ENV === 'development' && (
        <TanStackRouterDevtools />
      )}
    </div>
  ),
})
