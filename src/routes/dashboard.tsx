import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useAuth } from '../contexts/AuthContext'
import { DashboardLayout } from '../layouts/DashboardLayout'

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})

const stats = [
  { label: 'Total Projects', value: '57', icon: 'fa-folder' },
  { label: 'Clips Created', value: '286', icon: 'fa-scissors' },
  { label: 'Processing', value: '5', icon: 'fa-spinner' },
  { label: 'Storage Used', value: '3.5 GB', icon: 'fa-hard-drive', extra: '35%' },
]

const projects = [
  { title: 'Summer Vacation 2024', date: 'Today at 10:30 AM', status: 'draft' },
  { title: 'Product Demo - v2', date: 'Yesterday at 4:15 PM', status: 'processing' },
  { title: 'Client Testimonial', date: 'Oct 26 at 2:00 PM', status: 'published' },
  { title: 'Social Media Clips', date: 'Oct 25 at 11:45 AM', status: 'draft' },
  { title: 'Gaming Montage', date: 'Oct 24 at 9:00 AM', status: 'published' },
]

function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-base">
        <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    navigate({ to: '/login' })
    return null
  }

  return (
    <DashboardLayout>
      <div className="app-content">
        {/* Welcome */}
        <div className="page-header">
          <h1 className="text-3xl font-bold text-gradient">Welcome, {user?.username}</h1>
        </div>

        {/* Quick Actions */}
        <div className="grid-actions mb-6">
          <Link to="/editor" className="action-card">
            <div className="action-card-icon">
              <i className="fa-solid fa-plus text-lg" aria-hidden="true" />
            </div>
            <div className="action-card-content">
              <div className="action-card-title">New Project</div>
              <div className="action-card-desc">Start a new video creation</div>
            </div>
          </Link>

          <Link to="/library" className="action-card">
            <div className="action-card-icon" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}>
              <i className="fa-solid fa-folder-open text-lg" aria-hidden="true" />
            </div>
            <div className="action-card-content">
              <div className="action-card-title">My Library</div>
              <div className="action-card-desc">Access your clips and assets</div>
            </div>
          </Link>

          <Link to="/settings" className="action-card">
            <div className="action-card-icon" style={{ background: 'linear-gradient(135deg, #71717a 0%, #52525b 100%)' }}>
              <i className="fa-solid fa-gear text-lg" aria-hidden="true" />
            </div>
            <div className="action-card-content">
              <div className="action-card-title">Settings</div>
              <div className="action-card-desc">Configure your preferences</div>
            </div>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid-stats mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-card">
              <div className="stat-card-icon">
                <i className={`fa-solid ${stat.icon}`} aria-hidden="true" />
              </div>
              <div className="stat-card-value">
                {stat.value}
                {stat.extra && <span className="text-sm font-normal text-secondary ml-2">{stat.extra}</span>}
              </div>
              <div className="stat-card-label">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Recent Projects */}
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">Recent Projects</span>
            <Link to="/library" className="text-sm text-brand-400 hover:text-brand-300">
              View All
            </Link>
          </div>
          <div>
            {projects.map((project, i) => (
              <div key={i} className="project-row">
                <div className="project-thumb">
                  <i className="fa-solid fa-film text-tertiary" aria-hidden="true" />
                </div>
                <div className="project-info">
                  <div className="project-title">{project.title}</div>
                  <div className="project-meta">{project.date}</div>
                </div>
                <span className={`badge ${
                  project.status === 'published' ? 'badge-done' :
                  project.status === 'processing' ? 'badge-processing' : 'badge-neutral'
                }`}>
                  {project.status === 'processing' && <i className="fa-solid fa-spinner animate-spin text-xs" />}
                  {project.status === 'published' && <i className="fa-solid fa-check text-xs" />}
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </span>
                <div className="flex gap-2">
                  <button className="btn btn-ghost btn-icon btn-sm">
                    <i className="fa-solid fa-share-nodes" aria-hidden="true" />
                  </button>
                  <button className="btn btn-ghost btn-icon btn-sm">
                    <i className="fa-solid fa-ellipsis" aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
