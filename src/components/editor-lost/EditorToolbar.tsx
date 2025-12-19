import { useState } from 'react'
import { Button, IconButton } from '@/components/ui'

interface EditorToolbarProps {
  editor: {
    analyzeVideo: (url: string) => void
    isAnalyzing: boolean
    videoData: any
    stats: {
      totalClips: number
      avgScore: number
      highViralClips: number
    }
    exportJobs: any[]
  }
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const { analyzeVideo, isAnalyzing, videoData, stats, exportJobs } = editor

  const handleAnalyze = () => {
    if (youtubeUrl.trim()) {
      analyzeVideo(youtubeUrl)
    }
  }

  const activeExports = exportJobs.filter(job => 
    job.status === 'processing' || job.status === 'queued'
  ).length

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="editor-toolbar">
      {/* Main Input Section */}
      <div className="toolbar-section toolbar-input">
        <div className="url-input-group">
          <input
            type="text"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="Paste YouTube URL here..."
            className="editor-url-input"
            disabled={isAnalyzing}
          />
          <Button 
            variant="primary" 
            leftIcon={<i className="fa-solid fa-wand-magic-sparkles" />}
            onClick={handleAnalyze}
            disabled={!youtubeUrl.trim() || isAnalyzing}
            loading={isAnalyzing}
            className="analyze-button"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze with AI'}
          </Button>
        </div>
      </div>

      {/* Video Info Section */}
      {videoData && (
        <div className="toolbar-section toolbar-video-info">
          <div className="video-thumbnail">
            <img src={videoData.thumbnail} alt={videoData.title} />
            <div className="video-duration">
              {formatDuration(videoData.duration)}
            </div>
          </div>
          
          <div className="video-details">
            <h3 className="video-title" title={videoData.title}>
              {videoData.title}
            </h3>
            <div className="video-metadata">
              <span className="metadata-item">
                <i className="fa-solid fa-eye" />
                {videoData.metadata?.views?.toLocaleString()} views
              </span>
              <span className="metadata-item">
                <i className="fa-solid fa-thumbs-up" />
                {videoData.metadata?.likes?.toLocaleString()} likes
              </span>
              <span className="metadata-item">
                <i className="fa-solid fa-calendar" />
                {new Date(videoData.metadata?.uploadDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Stats Section */}
      {stats.totalClips > 0 && (
        <div className="toolbar-section toolbar-stats">
          <div className="stat-group">
            <div className="stat-item">
              <span className="stat-value">{stats.totalClips}</span>
              <span className="stat-label">Clips</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.avgScore}</span>
              <span className="stat-label">Avg Score</span>
            </div>
            <div className="stat-item high-viral">
              <span className="stat-value">{stats.highViralClips}</span>
              <span className="stat-label">High Viral</span>
            </div>
          </div>
        </div>
      )}

      {/* Actions Section */}
      <div className="toolbar-section toolbar-actions">
        {/* Export Queue Indicator */}
        {activeExports > 0 && (
          <div className="export-indicator">
            <IconButton
              icon={<i className="fa-solid fa-download" />}
              className="export-queue-btn"
              title={`${activeExports} exports in progress`}
            />
            <span className="export-count">{activeExports}</span>
          </div>
        )}

        {/* Quick Actions */}
        <div className="quick-actions">
          <IconButton
            icon={<i className="fa-solid fa-share" />}
            title="Share project"
            size="sm"
          />
          <IconButton
            icon={<i className="fa-solid fa-save" />}
            title="Save project"
            size="sm"
          />
          <IconButton
            icon={<i className="fa-solid fa-cog" />}
            title="Settings"
            size="sm"
          />
        </div>

        {/* User Avatar (Future: Collaboration) */}
        <div className="user-section">
          <div className="user-avatar">
            <i className="fa-solid fa-user" />
          </div>
        </div>
      </div>
    </div>
  )
}
