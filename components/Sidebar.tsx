import React from 'react';

type ViewType = 'editor' | 'library' | 'settings';

interface SidebarProps {
  activeView: ViewType;
  setActiveView: React.Dispatch<React.SetStateAction<ViewType>>;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  return (
    <div className="w-16 bg-slate-900 border-r border-slate-700 flex flex-col items-center py-6 space-y-8 z-20">
      <div 
        className="text-purple-500 text-2xl font-bold cursor-pointer" 
        onClick={() => setActiveView('editor')}
      >
        <i className="fa-brands fa-google"></i>
      </div>
      
      <button 
        onClick={() => setActiveView('editor')} 
        className={`w-full p-3 transition-colors ${
          activeView === 'editor' 
            ? 'text-purple-400 bg-slate-800/50' 
            : 'text-slate-500 hover:text-slate-300'
        }`}
        title="Video Editor"
      >
        <i className="fa-solid fa-scissors text-xl"></i>
      </button>
      
      <button 
        onClick={() => setActiveView('library')} 
        className={`w-full p-3 transition-colors ${
          activeView === 'library' 
            ? 'text-purple-400 bg-slate-800/50' 
            : 'text-slate-500 hover:text-slate-300'
        }`}
        title="Project Library"
      >
        <i className="fa-solid fa-layer-group text-xl"></i>
      </button>
      
      <button 
        onClick={() => setActiveView('settings')} 
        className={`w-full p-3 transition-colors ${
          activeView === 'settings' 
            ? 'text-purple-400 bg-slate-800/50' 
            : 'text-slate-500 hover:text-slate-300'
        }`}
        title="Settings"
      >
        <i className="fa-solid fa-gear text-xl"></i>
      </button>
    </div>
  );
};
