import React from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { useAuth } from '../contexts/AuthContext'

interface DashboardLayoutProps {
  children: React.ReactNode
}

const navItems = [
  { to: '/overview', icon: 'fa-house', label: 'Overview' },
  { to: '/editor', icon: 'fa-scissors', label: 'Editor' },
  { to: '/library', icon: 'fa-folder', label: 'Library' },
  { to: '/settings', icon: 'fa-gear', label: 'Settings' },
]

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { logout } = useAuth()
  const location = useLocation()

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="app-sidebar">
        {/* Logo */}
        <div className="app-sidebar-header">
          <div className="app-logo">
            <i className="fa-solid fa-play" aria-hidden="true" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="app-nav">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`app-nav-item ${location.pathname === item.to ? 'active' : ''}`}
              title={item.label}
            >
              <i className={`fa-solid ${item.icon}`} aria-hidden="true" />
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="app-sidebar-footer">
          <button onClick={logout} className="app-nav-item" title="Logout">
            <i className="fa-solid fa-right-from-bracket" aria-hidden="true" />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="app-main">
        {children}
      </main>
    </div>
  )
}
