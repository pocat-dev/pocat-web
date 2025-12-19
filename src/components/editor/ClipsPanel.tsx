import { memo, useMemo } from 'react'
import { IconButton, Badge } from '@/components/ui'

interface Clip {
  id: string
  title: string
  score: number
  startTime: number
  endTime: number
  duration: number
  thumbnail?: string
  viralPotential: 'high' | 'medium' | 'low'
  tags: string[]
  engagement: {
    hooks: number
    emotions: string[]
    pacing: 'fast' | 'medium' | 'slow'
  }
}

interface ClipsPanelProps {
  editor: {
    clips: Clip[]
    activeClipId: string | null
    setActiveClip: (id: string | null) => void
    seekToClip: (id: string) => void
    isLoading: boolean
    stats: {
      totalClips: number
      avgScore: number
      highViralClips: number
    }
  }
}

// Memoized clip item component for performance
const ClipItem = memo(({ 
  clip, 
  isActive, 
  onSelect, 
  onSeek 
}: { 
  clip: Clip
  isActive: boolean
  onSelect: (id: string) => void
  onSeek: (id: string) => void
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getViralColor = (potential: string) => {
    switch (potential) {
      case 'high': return 'text-green-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-gray-600'
      default: return 'text-gray-600'
    }
  }

  const getPacingIcon = (pacing: string) => {
    switch (pacing) {
      case 'fast': return 'fa-bolt'
      case 'medium': return 'fa-play'
      case 'slow': return 'fa-pause'
      default: return 'fa-play'
    }
  }

  return (
    <div 
      className={`editor-clip-item ${isActive ? 'active' : ''}`}
      onClick={() => onSelect(clip.id)}
      onDoubleClick={() => onSeek(clip.id)}
    >
      <div className="editor-clip-thumb">
        {clip.thumbnail ? (
          <img src={clip.thumbnail} alt={clip.title} loading="lazy" />
        ) : (
          <div className="clip-placeholder">
            <i className="fa-solid fa-video" />
          </div>
        )}
        <div className="clip-duration">
          {formatTime(clip.duration)}
        </div>
      </div>
      
      <div className="editor-clip-info">
        <div className="editor-clip-title" title={clip.title}>
          {clip.title}
        </div>
        
        <div className="clip-metadata">
          <Badge variant="viral" className="editor-clip-score">
            {clip.score} Score
          </Badge>
          
          <div className={`viral-indicator ${getViralColor(clip.viralPotential)}`}>
            <i className="fa-solid fa-fire" />
            <span>{clip.viralPotential}</span>
          </div>
        </div>
        
        <div className="clip-engagement">
          <div className="engagement-item">
            <i className="fa-solid fa-hook" />
            <span>{clip.engagement.hooks} hooks</span>
          </div>
          
          <div className="engagement-item">
            <i className={`fa-solid ${getPacingIcon(clip.engagement.pacing)}`} />
            <span>{clip.engagement.pacing}</span>
          </div>
          
          <div className="engagement-item">
            <i className="fa-solid fa-heart" />
            <span>{clip.engagement.emotions.length} emotions</span>
          </div>
        </div>
        
        <div className="clip-tags">
          {clip.tags.slice(0, 3).map(tag => (
            <span key={tag} className="clip-tag">
              #{tag}
            </span>
          ))}
        </div>
        
        <div className="clip-timing">
          {formatTime(clip.startTime)} - {formatTime(clip.endTime)}
        </div>
      </div>
      
      <div className="clip-actions">
        <IconButton 
          icon={<i className="fa-solid fa-play" />}
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onSeek(clip.id)
          }}
          title="Play clip"
        />
      </div>
    </div>
  )
})

export const ClipsPanel = memo(({ editor }: ClipsPanelProps) => {
  const { clips, activeClipId, setActiveClip, seekToClip, isLoading, stats } = editor

  // Memoized filtered and sorted clips
  const sortedClips = useMemo(() => 
    [...clips].sort((a, b) => b.score - a.score),
    [clips]
  )

  const clipsByViralPotential = useMemo(() => ({
    high: clips.filter(clip => clip.viralPotential === 'high'),
    medium: clips.filter(clip => clip.viralPotential === 'medium'),
    low: clips.filter(clip => clip.viralPotential === 'low')
  }), [clips])

  if (isLoading) {
    return (
      <div className="editor-panel-left">
        <div className="editor-panel-header">
          <span>AI CLIPS</span>
          <div className="loading-spinner">
            <i className="fa-solid fa-spinner fa-spin" />
          </div>
        </div>
        <div className="editor-loading-state">
          <div className="loading-skeleton">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton-clip-item">
                <div className="skeleton-thumb" />
                <div className="skeleton-content">
                  <div className="skeleton-title" />
                  <div className="skeleton-score" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="editor-panel-left">
      <div className="editor-panel-header">
        <div className="header-content">
          <span>AI CLIPS</span>
          <div className="clips-stats">
            <span className="stat-item">
              <i className="fa-solid fa-video" />
              {stats.totalClips}
            </span>
            <span className="stat-item">
              <i className="fa-solid fa-star" />
              {stats.avgScore}
            </span>
          </div>
        </div>
        <IconButton 
          icon={<i className="fa-solid fa-ellipsis" />} 
          size="sm" 
          title="More options"
        />
      </div>

      {clips.length === 0 ? (
        <div className="editor-empty-state">
          <div className="empty-icon">
            <i className="fa-solid fa-video" />
          </div>
          <h3>No clips generated yet</h3>
          <p>Analyze a video to get AI-generated viral clips</p>
          <div className="empty-tips">
            <div className="tip">
              <i className="fa-solid fa-lightbulb" />
              <span>Tip: Longer videos (10+ min) work best</span>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Quick stats */}
          <div className="clips-summary">
            <div className="summary-item high">
              <span className="count">{clipsByViralPotential.high.length}</span>
              <span className="label">High Viral</span>
            </div>
            <div className="summary-item medium">
              <span className="count">{clipsByViralPotential.medium.length}</span>
              <span className="label">Medium</span>
            </div>
            <div className="summary-item low">
              <span className="count">{clipsByViralPotential.low.length}</span>
              <span className="label">Low</span>
            </div>
          </div>

          {/* Clips list with virtual scrolling for performance */}
          <div className="editor-clips-list">
            {sortedClips.map((clip) => (
              <ClipItem
                key={clip.id}
                clip={clip}
                isActive={activeClipId === clip.id}
                onSelect={setActiveClip}
                onSeek={seekToClip}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
})
