import React from 'react';

interface Project {
  id: number;
  title: string;
  status: string;
  duration?: number;
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
  videoAvailable: boolean;
  source: string;
}

interface LibraryViewProps {
  projects: Project[];
  isLoadingProjects: boolean;
  onRefresh: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  projects,
  isLoadingProjects,
  onRefresh,
  fileInputRef,
}) => {
  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'Unknown';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-success-600 bg-success-50';
      case 'processing':
        return 'text-warning-600 bg-warning-50';
      case 'downloading':
        return 'text-info-600 bg-info-50';
      case 'failed':
        return 'text-error-600 bg-error-50';
      default:
        return 'text-secondary bg-surface-secondary';
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex-1 bg-surface min-h-screen">
      {/* Header */}
      <header className="bg-surface-secondary border-b border-primary-200 px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">Project Library</h1>
            <p className="text-secondary">
              Manage your video projects and clips
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={onRefresh}
              disabled={isLoadingProjects}
              className="btn-secondary inline-flex items-center gap-2"
              aria-label={isLoadingProjects ? 'Refreshing projects...' : 'Refresh project list'}
            >
              <i 
                className={`fa-solid fa-refresh ${isLoadingProjects ? 'animate-spin' : ''}`} 
                aria-hidden="true"
              ></i>
              {isLoadingProjects ? 'Refreshing...' : 'Refresh'}
            </button>
            
            <button
              onClick={handleFileUpload}
              className="btn-primary inline-flex items-center gap-2"
              aria-label="Upload new video file"
            >
              <i className="fa-solid fa-plus" aria-hidden="true"></i>
              New Project
            </button>
          </div>
        </div>
      </header>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="video/*"
        className="sr-only"
        aria-label="Select video file to upload"
      />

      {/* Content */}
      <main className="max-w-7xl mx-auto px-8 py-8">
        {isLoadingProjects ? (
          <div className="flex items-center justify-center py-24" role="status" aria-live="polite">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-brand-200 border-t-brand-600 mb-4"></div>
              <p className="text-secondary text-lg">Loading your projects...</p>
            </div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-24">
            <div className="card max-w-md mx-auto p-12">
              <div className="text-6xl text-secondary mb-6" aria-hidden="true">
                <i className="fa-solid fa-folder-open"></i>
              </div>
              <h2 className="text-2xl font-semibold text-primary mb-4">
                No Projects Yet
              </h2>
              <p className="text-secondary mb-8 leading-relaxed">
                Start creating amazing video clips by uploading your first video 
                or importing from YouTube.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleFileUpload}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <i className="fa-solid fa-upload" aria-hidden="true"></i>
                  Upload Video
                </button>
                <a
                  href="/editor"
                  className="btn-secondary inline-flex items-center gap-2"
                >
                  <i className="fa-brands fa-youtube" aria-hidden="true"></i>
                  Import from YouTube
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {projects.map((project) => (
                <article
                  key={project.id}
                  className="card overflow-hidden group cursor-pointer"
                  tabIndex={0}
                  role="button"
                  aria-label={`Open project: ${project.title}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      // TODO: Navigate to project
                      console.log('Open project:', project.id);
                    }
                  }}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-surface-secondary overflow-hidden">
                    {project.thumbnail ? (
                      <img
                        src={project.thumbnail}
                        alt={`Thumbnail for ${project.title}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <i className="fa-solid fa-play-circle text-4xl text-secondary" aria-hidden="true"></i>
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}
                        aria-label={`Project status: ${project.status}`}
                      >
                        {project.status}
                      </span>
                    </div>

                    {/* Duration Badge */}
                    {project.duration && (
                      <div className="absolute bottom-3 right-3">
                        <span className="px-2 py-1 text-xs font-medium bg-black/70 text-white rounded">
                          {formatDuration(project.duration)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-semibold text-primary mb-2 line-clamp-2 group-hover:text-brand-600 transition-colors">
                      {project.title}
                    </h3>
                    
                    <div className="flex items-center gap-4 text-sm text-secondary mb-3">
                      <span className="flex items-center gap-1">
                        <i className="fa-solid fa-calendar" aria-hidden="true"></i>
                        {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                      
                      <span className="flex items-center gap-1">
                        <i className={`fa-brands fa-${project.source === 'youtube' ? 'youtube' : 'file'}`} aria-hidden="true"></i>
                        {project.source}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-1 rounded ${project.videoAvailable ? 'text-success-600 bg-success-50' : 'text-warning-600 bg-warning-50'}`}>
                        {project.videoAvailable ? 'Video Ready' : 'Processing'}
                      </span>
                      
                      <button
                        className="text-secondary hover:text-primary transition-colors p-1"
                        aria-label={`More options for ${project.title}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: Show context menu
                        }}
                      >
                        <i className="fa-solid fa-ellipsis-vertical" aria-hidden="true"></i>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Stats Footer */}
            <footer className="mt-12 pt-8 border-t border-primary-200">
              <div className="flex items-center justify-between text-sm text-secondary">
                <span>
                  {projects.length} project{projects.length !== 1 ? 's' : ''} total
                </span>
                <span>
                  Last updated: {new Date().toLocaleString()}
                </span>
              </div>
            </footer>
          </div>
        )}
      </main>
    </div>
  );
};
