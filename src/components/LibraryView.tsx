import { Button, Badge, IconButton } from './ui'

interface Project {
  id: number
  title: string
  status: string
  duration?: number
  thumbnail?: string
  createdAt: string
  source: string
}

interface LibraryViewProps {
  projects: Project[]
  isLoadingProjects: boolean
  onRefresh: () => void
  fileInputRef: React.RefObject<HTMLInputElement | null>
}

const formatDuration = (seconds?: number) => {
  if (!seconds) return '--:--'
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

export const LibraryView: React.FC<LibraryViewProps> = ({ projects, isLoadingProjects, onRefresh, fileInputRef }) => {
  return (
    <div className="app-content">
      <div className="library-header">
        <div>
          <h1 className="dashboard-title" style={{ marginBottom: 0 }}>Library</h1>
          <p className="library-count">{projects.length} projects</p>
        </div>
        <div className="library-actions">
          <IconButton
            icon={<i className={`fa-solid fa-arrows-rotate ${isLoadingProjects ? 'animate-spin' : ''}`} />}
            onClick={onRefresh}
            disabled={isLoadingProjects}
          />
          <Button
            variant="primary"
            leftIcon={<i className="fa-solid fa-plus" />}
            onClick={() => fileInputRef.current?.click()}
            className="library-new-btn"
          >
            New Project
          </Button>
        </div>
      </div>

      <input type="file" ref={fileInputRef} accept="video/*" className="sr-only" />

      {isLoadingProjects ? (
        <div className="loading-screen" style={{ height: 'auto', padding: '5rem 0' }}>
          <div className="loading-spinner" />
        </div>
      ) : projects.length === 0 ? (
        <div className="library-empty">
          <div className="library-empty-icon"><i className="fa-solid fa-film" /></div>
          <h2>No projects yet</h2>
          <p>Create your first project by uploading a video or importing from YouTube.</p>
          <Button variant="primary" leftIcon={<i className="fa-solid fa-upload" />} onClick={() => fileInputRef.current?.click()}>
            Upload Video
          </Button>
        </div>
      ) : (
        <div className="library-grid">
          {projects.map((project) => (
            <article key={project.id} className="library-card">
              <div className="library-card-thumb">
                {project.thumbnail ? <img src={project.thumbnail} alt="" /> : <i className="fa-solid fa-play" />}
                {project.duration && <span className="library-card-duration">{formatDuration(project.duration)}</span>}
              </div>
              <div className="library-card-info">
                <div className="library-card-row">
                  <h3 className="library-card-title">{project.title}</h3>
                  <Badge variant={project.status === 'completed' ? 'success' : project.status === 'processing' ? 'processing' : 'neutral'}>
                    {project.status}
                  </Badge>
                </div>
                <div className="library-card-meta">
                  <span><i className={`fa-${project.source === 'youtube' ? 'brands fa-youtube' : 'solid fa-upload'}`} />{project.source === 'youtube' ? 'YouTube' : 'Upload'}</span>
                  <span>•</span>
                  <span>{formatDate(project.createdAt)}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
