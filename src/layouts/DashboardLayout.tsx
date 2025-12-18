import React from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { useAuth } from '../contexts/AuthContext'

interface DashboardLayoutProps {
  children: React.ReactNode
}

const navItems = [
  { to: '/dashboard', icon: 'fa-house', label: 'Home' },
  { to: '/editor', icon: 'fa-scissors', label: 'Editor' },
  { to: '/library', icon: 'fa-folder', label: 'Library' },
  { to: '/settings', icon: 'fa-gear', label: 'Settings' },
]

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { logout } = useAuth()
  const location = useLocation()

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        {/* Logo */}
        <div className="dashboard-sidebar-logo">
          <div className="dashboard-logo">
            <i className="fa-solid fa-play" aria-hidden="true" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="dashboard-sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`dashboard-sidebar-item ${location.pathname === item.to ? 'active' : ''}`}
              title={item.label}
            >
              <i className={`fa-solid ${item.icon}`} aria-hidden="true" />
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="dashboard-sidebar-footer">
          <button onClick={logout} className="dashboard-sidebar-item" title="Logout">
            <i className="fa-solid fa-right-from-bracket" aria-hidden="true" />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {children}
      </main>
    </div>
  )
}
