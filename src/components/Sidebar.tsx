import React from 'react';
import { Link, useRouterState, useNavigate } from '@tanstack/react-router';
import { DarkModeToggle } from './DarkModeToggle';
import { useAuth } from '../contexts/AuthContext';

interface NavItem {
  to: string;
  icon: string;
  label: string;
}

const navItems: NavItem[] = [
  { to: '/dashboard', icon: 'fa-home', label: 'Home' },
  { to: '/editor', icon: 'fa-scissors', label: 'Editor' },
  { to: '/library', icon: 'fa-folder-open', label: 'Library' },
  { to: '/settings', icon: 'fa-gear', label: 'Settings' },
];

export const Sidebar: React.FC = () => {
  const router = useRouterState();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const currentPath = router.location.pathname;

  const handleLogout = () => {
    logout();
    navigate({ to: '/' });
  };

  return (
    <nav 
      className="w-[72px] bg-surface-secondary flex flex-col items-center py-4 border-r border-primary"
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Logo */}
      <Link 
        to="/dashboard"
        className="w-10 h-10 flex items-center justify-center rounded-xl bg-brand-600 text-white mb-6 hover:bg-brand-700 transition-colors focus-ring"
        aria-label="Pocat Dashboard"
      >
        <i className="fa-solid fa-play text-sm" aria-hidden="true"></i>
      </Link>
      
      {/* Navigation */}
      <div className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => {
          const isActive = currentPath === item.to;
          return (
            <Link 
              key={item.to}
              to={item.to}
              className={`
                group relative w-12 h-12 flex flex-col items-center justify-center rounded-xl
                transition-all duration-150 focus-ring
                ${isActive 
                  ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400' 
                  : 'text-tertiary hover:bg-surface-tertiary hover:text-primary'
                }
              `}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <i className={`fa-solid ${item.icon} text-lg`} aria-hidden="true"></i>
              <span className="text-[10px] mt-0.5 font-medium">{item.label}</span>
              
              {isActive && (
                <span 
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-brand-600 rounded-r-full"
                  aria-hidden="true"
                />
              )}
            </Link>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col gap-2 mt-auto pt-4 border-t border-primary w-full items-center">
        <DarkModeToggle />
        
        {/* User & Logout */}
        <button
          onClick={handleLogout}
          className="w-10 h-10 flex items-center justify-center rounded-xl text-tertiary hover:text-error-600 hover:bg-error-50 dark:hover:bg-error-900/20 transition-colors focus-ring"
          aria-label={`Logout ${user?.username}`}
          title="Logout"
        >
          <i className="fa-solid fa-right-from-bracket text-lg" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
};
