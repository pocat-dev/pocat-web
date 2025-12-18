import React from 'react';
import { Link } from '@tanstack/react-router';
import { DarkModeToggle } from '../components/DarkModeToggle';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-sm border-b border-primary">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-play text-white text-sm" aria-hidden="true" />
            </div>
            <span className="font-semibold text-primary text-lg">Pocat</span>
          </Link>
          
          <div className="flex items-center gap-3">
            <DarkModeToggle />
            <Link to="/login" className="btn btn-primary btn-sm">
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-primary py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-tertiary">
          <p>© 2024 Pocat. Built by{' '}
            <a 
              href="https://twitter.com/sandikodev" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-brand-600 hover:underline"
            >
              @sandikodev
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};
