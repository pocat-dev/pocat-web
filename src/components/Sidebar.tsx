import React from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { DarkModeToggle } from './DarkModeToggle';

export const Sidebar: React.FC = () => {
  const router = useRouterState()
  const currentPath = router.location.pathname

  return (
    <nav 
      className="w-16 bg-surface border-r border-primary-200 flex flex-col items-center py-6 z-20"
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Logo/Home Link */}
      <Link 
        to="/"
        className="text-brand-600 text-2xl font-bold cursor-pointer hover:text-brand-700 transition-colors focus-ring mb-8"
        aria-label="ClipGenius AI Home"
      >
        <i className="fa-brands fa-google" aria-hidden="true"></i>
      </Link>
      
      {/* Navigation Links */}
      <div className="flex flex-col space-y-2 flex-1">
        <Link 
          to="/editor"
          className={`
            w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200 focus-ring
            ${currentPath === '/editor' 
              ? 'text-brand-600 bg-brand-50 shadow-sm' 
              : 'text-primary-500 hover:text-primary-700 hover:bg-primary-100'
            }
          `}
          aria-label="Video Editor"
          title="Video Editor"
        >
          <i className="fa-solid fa-scissors text-lg" aria-hidden="true"></i>
        </Link>
        
        <Link 
          to="/library"
          className={`
            w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200 focus-ring
            ${currentPath === '/library' 
              ? 'text-brand-600 bg-brand-50 shadow-sm' 
              : 'text-primary-500 hover:text-primary-700 hover:bg-primary-100'
            }
          `}
          aria-label="Project Library"
          title="Project Library"
        >
          <i className="fa-solid fa-layer-group text-lg" aria-hidden="true"></i>
        </Link>
        
        <Link 
          to="/settings"
          className={`
            w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200 focus-ring
            ${currentPath === '/settings' 
              ? 'text-brand-600 bg-brand-50 shadow-sm' 
              : 'text-primary-500 hover:text-primary-700 hover:bg-primary-100'
            }
          `}
          aria-label="Settings"
          title="Settings"
        >
          <i className="fa-solid fa-gear text-lg" aria-hidden="true"></i>
        </Link>
      </div>

      {/* Dark Mode Toggle */}
      <div className="mt-auto">
        <DarkModeToggle />
      </div>
    </nav>
  );
};
