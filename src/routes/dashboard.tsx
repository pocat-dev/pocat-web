import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useAuth } from '../contexts/AuthContext'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { Badge, IconButton } from '../components/ui'

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
  { title: 'Summer Vacation 2024', date: 'Today at 10:30 AM', status: 'draft' as const },
  { title: 'Product Demo - v2', date: 'Yesterday at 4:15 PM', status: 'processing' as const },
  { title: 'Client Testimonial', date: 'Oct 26 at 2:00 PM', status: 'published' as const },
  { title: 'Social Media Clips', date: 'Oct 25 at 11:45 AM', status: 'draft' as const },
  { title: 'Gaming Montage', date: 'Oct 24 at 9:00 AM', status: 'published' as const },
]

const statusVariant = { draft: 'neutral', processing: 'processing', published: 'success' } as const

function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()

  if (isLoading) return <div className="loading-screen"><div className="loading-spinner" /></div>
  if (!isAuthenticated) { navigate({ to: '/login' }); return null }

  return (
    <DashboardLayout>
      <div className="app-content">
        <h1 className="dashboard-title">Welcome, {user?.username}</h1>

        {/* Quick Actions */}
        <div className="dashboard-actions">
          {[
            { to: '/editor', icon: 'fa-plus', color: 'violet', title: 'New Project', desc: 'Start a new video creation' },
            { to: '/library', icon: 'fa-folder-open', color: 'blue', title: 'My Library', desc: 'Access your clips and assets' },
            { to: '/settings', icon: 'fa-gear', color: 'gray', title: 'Settings', desc: 'Configure your preferences' },
          ].map((action) => (
            <Link key={action.to} to={action.to} className="dashboard-action-card">
              <div className={`dashboard-action-icon ${action.color}`}><i className={`fa-solid ${action.icon}`} /></div>
              <div><div className="dashboard-action-title">{action.title}</div><div className="dashboard-action-desc">{action.desc}</div></div>
            </Link>
          ))}
        </div>

        {/* Stats */}
        <div className="dashboard-stats">
          {stats.map((stat) => (
            <div key={stat.label} className="dashboard-stat-card">
              <div className="dashboard-stat-icon"><i className={`fa-solid ${stat.icon}`} /></div>
              <div className="dashboard-stat-value">{stat.value}{stat.extra && <span className="dashboard-stat-extra">{stat.extra}</span>}</div>
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
          <div>
            {projects.map((project, i) => (
              <div key={i} className="dashboard-project-row">
                <div className="dashboard-project-thumb"><i className="fa-solid fa-film" /></div>
                <div className="dashboard-project-info">
                  <div className="dashboard-project-title">{project.title}</div>
                  <div className="dashboard-project-date">{project.date}</div>
                </div>
                <Badge
                  variant={statusVariant[project.status]}
                  icon={project.status === 'processing' ? <i className="fa-solid fa-spinner animate-spin" /> : project.status === 'published' ? <i className="fa-solid fa-check" /> : undefined}
                >
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </Badge>
                <div className="dashboard-project-actions">
                  <IconButton icon={<i className="fa-solid fa-share-nodes" />} size="sm" />
                  <IconButton icon={<i className="fa-solid fa-ellipsis" />} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
