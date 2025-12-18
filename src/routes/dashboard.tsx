import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useAuth } from '../contexts/AuthContext'
import { DashboardLayout } from '../layouts/DashboardLayout'

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-surface">
        <div className="w-8 h-8 border-3 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    navigate({ to: '/login' })
    return null
  }

  return (
    <DashboardLayout>
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-surface/80 backdrop-blur-sm border-b border-primary">
          <div className="px-6 py-5">
            <h1 className="text-2xl font-semibold text-primary">
              Welcome, {user?.username}
            </h1>
            <p className="text-sm text-secondary mt-1">
              Here's what's happening with your projects
            </p>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {/* Quick Actions */}
          <section className="mb-8">
            <h2 className="text-sm font-medium text-tertiary uppercase tracking-wide mb-4">
              Quick Actions
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <Link
                to="/editor"
                className="card card-hover p-5 flex items-center gap-4"
              >
                <div className="w-10 h-10 bg-brand-100 dark:bg-brand-900/30 rounded-xl flex items-center justify-center">
                  <i className="fa-solid fa-plus text-brand-600" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-medium text-primary">New Project</h3>
                  <p className="text-sm text-secondary">Create from scratch</p>
                </div>
              </Link>

              <Link
                to="/library"
                className="card card-hover p-5 flex items-center gap-4"
              >
                <div className="w-10 h-10 bg-info-50 dark:bg-info-900/30 rounded-xl flex items-center justify-center">
                  <i className="fa-solid fa-folder-open text-info-600" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-medium text-primary">My Library</h3>
                  <p className="text-sm text-secondary">View all projects</p>
                </div>
              </Link>

              <Link
                to="/settings"
                className="card card-hover p-5 flex items-center gap-4"
              >
                <div className="w-10 h-10 bg-surface-tertiary rounded-xl flex items-center justify-center">
                  <i className="fa-solid fa-gear text-tertiary" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-medium text-primary">Settings</h3>
                  <p className="text-sm text-secondary">Configure app</p>
                </div>
              </Link>
            </div>
          </section>

          {/* Stats */}
          <section className="mb-8">
            <h2 className="text-sm font-medium text-tertiary uppercase tracking-wide mb-4">
              Overview
            </h2>
            <div className="grid sm:grid-cols-4 gap-4">
              {[
                { label: 'Total Projects', value: '12', icon: 'fa-folder', color: 'brand' },
                { label: 'Clips Created', value: '48', icon: 'fa-scissors', color: 'success' },
                { label: 'Processing', value: '2', icon: 'fa-spinner', color: 'warning' },
                { label: 'Storage Used', value: '2.4 GB', icon: 'fa-hard-drive', color: 'info' },
              ].map((stat) => (
                <div key={stat.label} className="card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-secondary">{stat.label}</span>
                    <i className={`fa-solid ${stat.icon} text-${stat.color}-500`} aria-hidden="true" />
                  </div>
                  <div className="text-2xl font-semibold text-primary">{stat.value}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Projects */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-tertiary uppercase tracking-wide">
                Recent Projects
              </h2>
              <Link to="/library" className="text-sm text-brand-600 hover:underline">
                View all
              </Link>
            </div>
            <div className="card divide-y divide-primary">
              {[
                { title: 'Product Demo Video', status: 'completed', date: 'Dec 18' },
                { title: 'Tutorial Series Ep.1', status: 'processing', date: 'Dec 17' },
                { title: 'Marketing Campaign', status: 'completed', date: 'Dec 15' },
              ].map((project, i) => (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-surface-secondary transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-surface-tertiary rounded-lg flex items-center justify-center">
                      <i className="fa-solid fa-film text-tertiary" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-medium text-primary text-sm">{project.title}</h3>
                      <p className="text-xs text-tertiary">{project.date}</p>
                    </div>
                  </div>
                  <span className={`badge ${project.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                    {project.status}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </DashboardLayout>
  )
}
