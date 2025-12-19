import { memo } from 'react'

export const EditorTimeline = memo(({ editor }: any) => {
  const { 
    clips, 
    currentTime, 
    duration, 
    timelineZoom,
    setCurrentTime 
  } = editor

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = Math.floor(seconds % 60)
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percentage = clickX / rect.width
    const newTime = percentage * duration
    setCurrentTime(Math.max(0, Math.min(duration, newTime)))
  }

  const playheadPosition = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="editor-timeline">
      <div className="editor-timeline-header">
        <span>{formatTime(0)}</span>
        <span>{formatTime(duration)}</span>
      </div>
      
      <div 
        className="editor-timeline-track"
        onClick={handleTimelineClick}
      >
        <div className="editor-timeline-waveform" />
        
        <div className="editor-timeline-segments">
          {clips.map((clip: any) => {
            const startPercent = duration > 0 ? (clip.startTime / duration) * 100 : 0
            const widthPercent = duration > 0 ? ((clip.endTime - clip.startTime) / duration) * 100 : 0
            
            return (
              <div
                key={clip.id}
                className="editor-timeline-segment"
                style={{
                  left: `${startPercent}%`,
                  width: `${widthPercent}%`
                }}
                title={`${clip.title} (${formatTime(clip.startTime)} - ${formatTime(clip.endTime)})`}
              />
            )
          })}
        </div>
        
        <div 
          className="editor-timeline-playhead" 
          style={{ left: `${playheadPosition}%` }} 
        />
      </div>
      
      <div className="editor-timeline-footer">
        <span>{formatTime(currentTime)}</span>
        <span>Zoom: {Math.round(timelineZoom * 100)}%</span>
      </div>
    </div>
  )
})
