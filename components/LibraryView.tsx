import React, { useRef } from 'react';

interface Project {
  id: number;
  title: string;
  youtubeUrl: string;
  status: string;
  duration: number;
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
  videoAvailable: boolean;
  source: string;
}

interface LibraryViewProps {
  projects: Project[];
  isLoadingProjects: boolean;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  projects,
  isLoadingProjects,
  onFileUpload
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex-1 p-8 bg-slate-950 overflow-y-auto">
      <h2 className="text-3xl font-bold mb-6">Project Library</h2>
      <div className="grid grid-cols-3 gap-6">
        <div 
          onClick={() => fileInputRef.current?.click()} 
          className="bg-slate-900/50 border-2 border-dashed border-slate-800 rounded-xl h-64 flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 transition-all text-slate-500"
        >
          <i className="fa-solid fa-plus text-3xl mb-2"></i>
          <span>New Project</span>
        </div>
        
        {isLoadingProjects ? (
          <div className="col-span-2 flex items-center justify-center h-64">
            <div className="text-center">
              <i className="fa-solid fa-circle-notch animate-spin text-4xl text-purple-500 mb-4"></i>
              <p className="text-slate-400">Loading projects...</p>
            </div>
          </div>
        ) : !Array.isArray(projects) || projects.length === 0 ? (
          <div className="col-span-2 flex items-center justify-center h-64">
            <div className="text-center text-slate-500">
              <i className="fa-solid fa-folder-open text-4xl mb-4"></i>
              <p>No projects found</p>
              <p className="text-sm">Create your first project to get started</p>
            </div>
          </div>
        ) : (
          projects.map(p => (
            <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-purple-500 transition-all cursor-pointer">
              <div className="h-40 bg-slate-800 flex items-center justify-center relative">
                {p.thumbnail ? (
                  <img src={p.thumbnail} alt={p.title} className="w-full h-full object-cover" />
                ) : (
                  <i className="fa-solid fa-play-circle text-4xl text-slate-600"></i>
                )}
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    p.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                    p.status === 'downloading' ? 'bg-blue-500/20 text-blue-400' :
                    p.status === 'processing' ? 'bg-yellow-500/20 text-yellow-400' :
                    p.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                    'bg-slate-500/20 text-slate-400'
                  }`}>
                    {p.status}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold truncate" title={p.title}>{p.title}</h3>
                <p className="text-slate-400 text-sm">
                  {p.duration ? `${Math.floor(p.duration / 60)}:${(p.duration % 60).toString().padStart(2, '0')}` : 'Unknown'} • 
                  {p.videoAvailable ? ` ${p.source}` : ' No video'}
                </p>
                <p className="text-slate-500 text-xs mt-1">
                  {new Date(p.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={onFileUpload}
        className="hidden"
      />
    </div>
  );
};
