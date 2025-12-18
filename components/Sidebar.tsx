import React from 'react';
import { Link, useRouterState } from '@tanstack/react-router';

export const Sidebar: React.FC = () => {
  const router = useRouterState()
  const currentPath = router.location.pathname

  return (
    <div className="w-16 bg-slate-900 border-r border-slate-700 flex flex-col items-center py-6 space-y-8 z-20">
      <Link 
        to="/"
        className="text-purple-500 text-2xl font-bold cursor-pointer hover:text-purple-400 transition-colors"
      >
        <i className="fa-brands fa-google"></i>
      </Link>
      
      <Link 
        to="/editor"
        className={`w-full p-3 transition-colors flex items-center justify-center ${
          currentPath === '/editor' 
            ? 'text-purple-400 bg-slate-800/50' 
            : 'text-slate-500 hover:text-slate-300'
        }`}
        title="Video Editor"
      >
        <i className="fa-solid fa-scissors text-xl"></i>
      </Link>
      
      <Link 
        to="/library"
        className={`w-full p-3 transition-colors flex items-center justify-center ${
          currentPath === '/library' 
            ? 'text-purple-400 bg-slate-800/50' 
            : 'text-slate-500 hover:text-slate-300'
        }`}
        title="Project Library"
      >
        <i className="fa-solid fa-layer-group text-xl"></i>
      </Link>
      
      <Link 
        to="/settings"
        className={`w-full p-3 transition-colors flex items-center justify-center ${
          currentPath === '/settings' 
            ? 'text-purple-400 bg-slate-800/50' 
            : 'text-slate-500 hover:text-slate-300'
        }`}
        title="Settings"
      >
        <i className="fa-solid fa-gear text-xl"></i>
      </Link>
    </div>
  );
};
