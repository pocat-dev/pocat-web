import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

export const DarkModeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  
  const isDark = theme === 'dark' || 
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 flex items-center justify-center rounded-xl text-tertiary hover:text-primary hover:bg-surface-tertiary transition-colors focus-ring"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
    >
      <i 
        className={`fa-solid ${isDark ? 'fa-sun' : 'fa-moon'} text-lg`} 
        aria-hidden="true" 
      />
    </button>
  );
};
