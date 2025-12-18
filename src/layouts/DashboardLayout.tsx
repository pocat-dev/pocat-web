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
    <div className="app-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-violet-700 rounded-xl flex items-center justify-center">
            <i className="fa-solid fa-play text-white" aria-hidden="true" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`sidebar-item ${location.pathname === item.to ? 'active' : ''}`}
              title={item.label}
            >
              <i className={`fa-solid ${item.icon} sidebar-item-icon`} aria-hidden="true" />
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <button
            onClick={logout}
            className="sidebar-item"
            title="Logout"
          >
            <i className="fa-solid fa-right-from-bracket sidebar-item-icon" aria-hidden="true" />
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
