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
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  projects,
  isLoadingProjects,
  onRefresh,
  fileInputRef,
}) => {
  const formatDuration = (seconds?: number) => {
    if (!seconds) return '--:--';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      completed: 'badge-success',
      processing: 'badge-warning',
      downloading: 'badge-info',
      failed: 'badge-error',
    };
    return styles[status] || 'badge-neutral';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="flex-1 bg-surface overflow-auto">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-surface/80 backdrop-blur-sm border-b border-primary">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-primary tracking-tight">
                Library
              </h1>
              <p className="text-sm text-secondary mt-1">
                {projects.length} {projects.length === 1 ? 'project' : 'projects'}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={onRefresh}
                disabled={isLoadingProjects}
                className="btn btn-ghost btn-sm"
                aria-label="Refresh"
              >
                <i className={`fa-solid fa-arrows-rotate ${isLoadingProjects ? 'animate-spin' : ''}`} aria-hidden="true" />
              </button>
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn btn-primary"
              >
                <i className="fa-solid fa-plus" aria-hidden="true" />
                <span>New Project</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="video/*"
        className="sr-only"
        aria-label="Select video file"
      />

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-6">
        {isLoadingProjects ? (
          /* Loading State */
          <div className="flex items-center justify-center py-20" role="status">
            <div className="text-center">
              <div className="w-10 h-10 border-3 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto" />
              <p className="text-secondary text-sm mt-4">Loading projects...</p>
            </div>
          </div>
        ) : projects.length === 0 ? (
          /* Empty State */
          <div className="flex items-center justify-center py-20">
            <div className="text-center max-w-sm">
              <div className="w-16 h-16 bg-surface-tertiary rounded-2xl flex items-center justify-center mx-auto mb-5">
                <i className="fa-solid fa-film text-2xl text-tertiary" aria-hidden="true" />
              </div>
              <h2 className="text-lg font-semibold text-primary mb-2">
                No projects yet
              </h2>
              <p className="text-secondary text-sm mb-6 leading-relaxed">
                Create your first project by uploading a video or importing from YouTube.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="btn btn-primary"
                >
                  <i className="fa-solid fa-upload" aria-hidden="true" />
                  Upload Video
                </button>
                <a href="/editor" className="btn btn-secondary">
                  <i className="fa-brands fa-youtube" aria-hidden="true" />
                  Import YouTube
                </a>
              </div>
            </div>
          </div>
        ) : (
          /* Projects Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <article
                key={project.id}
                className="card card-hover group cursor-pointer"
                tabIndex={0}
                role="button"
                aria-label={`Open ${project.title}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    console.log('Open project:', project.id);
                  }
                }}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-surface-tertiary overflow-hidden">
                  {project.thumbnail ? (
                    <img
                      src={project.thumbnail}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <i className="fa-solid fa-play text-3xl text-disabled" aria-hidden="true" />
                    </div>
                  )}
                  
                  {/* Duration */}
                  {project.duration && (
                    <span className="absolute bottom-2 right-2 px-1.5 py-0.5 text-xs font-medium bg-black/75 text-white rounded">
                      {formatDuration(project.duration)}
                    </span>
                  )}
                  
                  {/* Play overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                      <i className="fa-solid fa-play text-brand-600 ml-1" aria-hidden="true" />
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-medium text-primary text-sm line-clamp-2 leading-snug flex-1">
                      {project.title}
                    </h3>
                    <span className={`badge ${getStatusBadge(project.status)} shrink-0`}>
                      {project.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 mt-3 text-xs text-tertiary">
                    <span className="flex items-center gap-1">
                      <i className={`fa-${project.source === 'youtube' ? 'brands fa-youtube' : 'solid fa-file-video'}`} aria-hidden="true" />
                      {project.source === 'youtube' ? 'YouTube' : 'Upload'}
                    </span>
                    <span>•</span>
                    <span>{formatDate(project.createdAt)}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
