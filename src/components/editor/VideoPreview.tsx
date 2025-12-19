import { memo } from 'react'
import { IconButton } from '@/components/ui'

export const VideoPreview = memo(({ editor }: any) => {
  const { 
    isPlaying, 
    currentTime, 
    duration, 
    setIsPlaying, 
    setCurrentTime 
  } = editor

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = Math.floor(seconds % 60)
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (direction: 'backward' | 'forward') => {
    const newTime = direction === 'backward' 
      ? Math.max(0, currentTime - 10)
      : Math.min(duration, currentTime + 10)
    setCurrentTime(newTime)
  }

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="editor-panel-center">
      <div className="editor-video-wrapper">
        <div className="editor-video-player">
          <div className="editor-video-play">
            <i className="fa-solid fa-play" />
          </div>
        </div>
      </div>
      <div className="editor-video-controls">
        <IconButton 
          icon={<i className={`fa-solid fa-${isPlaying ? 'pause' : 'play'}`} />}
          onClick={handlePlayPause}
        />
        <IconButton 
          icon={<i className="fa-solid fa-backward-step" />}
          onClick={() => handleSeek('backward')}
        />
        <span className="editor-time">{formatTime(currentTime)}</span>
        <div className="editor-progress">
          <div 
            className="editor-progress-fill" 
            style={{ width: `${progressPercentage}%` }} 
          />
        </div>
        <span className="editor-time">{formatTime(duration)}</span>
        <IconButton 
          icon={<i className="fa-solid fa-forward-step" />}
          onClick={() => handleSeek('forward')}
        />
        <IconButton icon={<i className="fa-solid fa-expand" />} />
      </div>
    </div>
  )
})
