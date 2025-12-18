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
      <div className="loading-screen">
        <div className="loading-spinner" />
      </div>
    )
  }

  if (!isAuthenticated) {
    navigate({ to: '/login' })
    return null
  }

  return (
    <DashboardLayout>
      <div className="dashboard-content">
        {/* Welcome */}
        <h1 className="dashboard-title">Welcome, {user?.username}</h1>

        {/* Quick Actions */}
        <div className="dashboard-actions">
          <Link to="/editor" className="dashboard-action-card">
            <div className="dashboard-action-icon violet">
              <i className="fa-solid fa-plus" aria-hidden="true" />
            </div>
            <div>
              <div className="dashboard-action-title">New Project</div>
              <div className="dashboard-action-desc">Start a new video creation</div>
            </div>
          </Link>

          <Link to="/library" className="dashboard-action-card">
            <div className="dashboard-action-icon blue">
              <i className="fa-solid fa-folder-open" aria-hidden="true" />
            </div>
            <div>
              <div className="dashboard-action-title">My Library</div>
              <div className="dashboard-action-desc">Access your clips and assets</div>
            </div>
          </Link>

          <Link to="/settings" className="dashboard-action-card">
            <div className="dashboard-action-icon gray">
              <i className="fa-solid fa-gear" aria-hidden="true" />
            </div>
            <div>
              <div className="dashboard-action-title">Settings</div>
              <div className="dashboard-action-desc">Configure your preferences</div>
            </div>
          </Link>
        </div>

        {/* Stats */}
        <div className="dashboard-stats">
          {stats.map((stat) => (
            <div key={stat.label} className="dashboard-stat-card">
              <div className="dashboard-stat-icon">
                <i className={`fa-solid ${stat.icon}`} aria-hidden="true" />
              </div>
              <div className="dashboard-stat-value">
                {stat.value}
                {stat.extra && <span className="dashboard-stat-extra">{stat.extra}</span>}
              </div>
              <div className="dashboard-stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Recent Projects */}
        <div className="dashboard-projects">
          <div className="dashboard-projects-header">
            <span className="dashboard-projects-title">Recent Projects</span>
            <Link to="/library" className="dashboard-projects-link">View All</Link>
          </div>
          <div className="dashboard-projects-list">
            {projects.map((project, i) => (
              <div key={i} className="dashboard-project-row">
                <div className="dashboard-project-thumb">
                  <i className="fa-solid fa-film" aria-hidden="true" />
                </div>
                <div className="dashboard-project-info">
                  <div className="dashboard-project-title">{project.title}</div>
                  <div className="dashboard-project-date">{project.date}</div>
                </div>
                <span className={`dashboard-badge ${project.status}`}>
                  {project.status === 'processing' && <i className="fa-solid fa-spinner animate-spin" />}
                  {project.status === 'published' && <i className="fa-solid fa-check" />}
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </span>
                <div className="dashboard-project-actions">
                  <button className="dashboard-icon-btn">
                    <i className="fa-solid fa-share-nodes" aria-hidden="true" />
                  </button>
                  <button className="dashboard-icon-btn">
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
