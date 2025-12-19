import { memo } from 'react'
import { IconButton, Badge } from '@/components/ui'

export const ClipsPanel = memo(({ editor }: any) => {
  const { clips, activeClipId, setActiveClip } = editor

  return (
    <div className="editor-panel-left">
      <div className="editor-panel-header">
        <span>AI CLIPS</span>
        <IconButton icon={<i className="fa-solid fa-ellipsis" />} size="sm" />
      </div>
      <div className="editor-clips-list">
        {clips.length === 0 ? (
          <div className="editor-empty-state">
            <i className="fa-solid fa-video" />
            <p>No clips generated yet</p>
            <p>Analyze a video to get started</p>
          </div>
        ) : (
          clips.map((clip: any) => (
            <div 
              key={clip.id} 
              onClick={() => setActiveClip(clip.id)} 
              className={`editor-clip-item ${activeClipId === clip.id ? 'active' : ''}`}
            >
              <div className="editor-clip-thumb">
                {clip.thumbnail ? (
                  <img src={clip.thumbnail} alt={clip.title} />
                ) : (
                  <i className="fa-solid fa-image" />
                )}
              </div>
              <div className="editor-clip-info">
                <div className="editor-clip-title">{clip.title}</div>
                <Badge variant="viral" className="editor-clip-score">
                  {clip.score} Viral Score
                </Badge>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
})
