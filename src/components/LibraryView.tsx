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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="dashboard-content">
      {/* Header */}
      <div className="library-header">
        <div>
          <h1 className="dashboard-title" style={{ marginBottom: 0 }}>Library</h1>
          <p className="library-count">{projects.length} projects</p>
        </div>
        <div className="library-actions">
          <button onClick={onRefresh} disabled={isLoadingProjects} className="dashboard-icon-btn">
            <i className={`fa-solid fa-arrows-rotate ${isLoadingProjects ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={() => fileInputRef.current?.click()} className="library-new-btn">
            <i className="fa-solid fa-plus" />
            New Project
          </button>
        </div>
      </div>

      <input type="file" ref={fileInputRef} accept="video/*" className="sr-only" />

      {isLoadingProjects ? (
        <div className="loading-screen" style={{ height: 'auto', padding: '5rem 0' }}>
          <div className="loading-spinner" />
        </div>
      ) : projects.length === 0 ? (
        <div className="library-empty">
          <div className="library-empty-icon">
            <i className="fa-solid fa-film" />
          </div>
          <h2>No projects yet</h2>
          <p>Create your first project by uploading a video or importing from YouTube.</p>
          <div className="library-empty-actions">
            <button onClick={() => fileInputRef.current?.click()} className="library-new-btn">
              <i className="fa-solid fa-upload" /> Upload Video
            </button>
          </div>
        </div>
      ) : (
        <div className="library-grid">
          {projects.map((project) => (
            <article key={project.id} className="library-card">
              <div className="library-card-thumb">
                {project.thumbnail ? (
                  <img src={project.thumbnail} alt="" />
                ) : (
                  <i className="fa-solid fa-play" />
                )}
                {project.duration && (
                  <span className="library-card-duration">{formatDuration(project.duration)}</span>
                )}
              </div>
              <div className="library-card-info">
                <div className="library-card-row">
                  <h3 className="library-card-title">{project.title}</h3>
                  <span className={`dashboard-badge ${project.status === 'completed' ? 'published' : project.status}`}>
                    {project.status}
                  </span>
                </div>
                <div className="library-card-meta">
                  <span>
                    <i className={`fa-${project.source === 'youtube' ? 'brands fa-youtube' : 'solid fa-upload'}`} />
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
    </div>
  );
};
