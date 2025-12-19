import { memo, useState } from 'react'
import { IconButton } from '@/components/ui'

interface VideoPreviewProps {
  editor: {
    isPlaying: boolean
    currentTime: number
    duration: number
    setIsPlaying: (playing: boolean) => void
    setCurrentTime: (time: number) => void
    activeClip: any
    videoData: any
  }
}

export const VideoPreview = memo(({ editor }: VideoPreviewProps) => {
  const [volume, setVolume] = useState(1)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [aspectRatio, setAspectRatio] = useState('16:9')
  const [isFullscreen, setIsFullscreen] = useState(false)
  
  const { 
    isPlaying, 
    currentTime, 
    duration, 
    setIsPlaying, 
    setCurrentTime,
    activeClip,
    videoData
  } = editor

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = Math.floor(seconds % 60)
    return h > 0 
      ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
      : `${m}:${s.toString().padStart(2, '0')}`
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (direction: 'backward' | 'forward') => {
    const seekAmount = direction === 'backward' ? -10 : 10
    const newTime = Math.max(0, Math.min(duration, currentTime + seekAmount))
    setCurrentTime(newTime)
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percentage = clickX / rect.width
    const newTime = percentage * duration
    setCurrentTime(Math.max(0, Math.min(duration, newTime)))
  }

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case '9:16': return 'aspect-9-16'
      case '1:1': return 'aspect-1-1'
      case '16:9': 
      default: return 'aspect-16-9'
    }
  }

  return (
    <div className="editor-panel-center">
      {/* Video Container */}
      <div className="editor-video-container">
        {/* Aspect Ratio Selector */}
        <div className="aspect-ratio-selector">
          {['16:9', '9:16', '1:1'].map(ratio => (
            <button
              key={ratio}
              className={`aspect-btn ${aspectRatio === ratio ? 'active' : ''}`}
              onClick={() => setAspectRatio(ratio)}
            >
              {ratio}
            </button>
          ))}
        </div>

        {/* Video Player */}
        <div className={`editor-video-wrapper ${getAspectRatioClass()}`}>
          <div className="editor-video-player">
            {videoData ? (
              <>
                {/* Video Thumbnail/Preview */}
                <img 
                  src={videoData.thumbnail} 
                  alt={videoData.title}
                  className="video-preview-image"
                />
                
                {/* Play Button Overlay */}
                <div className="video-play-overlay" onClick={handlePlayPause}>
                  <div className="play-button">
                    <i className={`fa-solid fa-${isPlaying ? 'pause' : 'play'}`} />
                  </div>
                </div>

                {/* Active Clip Indicator */}
                {activeClip && (
                  <div className="active-clip-overlay">
                    <div className="clip-info">
                      <span className="clip-title">{activeClip.title}</span>
                      <span className="clip-score">Score: {activeClip.score}</span>
                    </div>
                  </div>
                )}

                {/* Caption Preview */}
                <div className="caption-preview">
                  <div className="caption-text">
                    {activeClip?.title || 'Caption preview will appear here'}
                  </div>
                </div>
              </>
            ) : (
              <div className="video-placeholder">
                <i className="fa-solid fa-video" />
                <p>Import a video to start editing</p>
              </div>
            )}
          </div>
        </div>

        {/* Video Controls */}
        <div className="editor-video-controls">
          {/* Primary Controls */}
          <div className="controls-primary">
            <IconButton 
              icon={<i className="fa-solid fa-backward-step" />}
              onClick={() => handleSeek('backward')}
              title="Seek backward 10s"
              size="sm"
            />
            
            <IconButton 
              icon={<i className={`fa-solid fa-${isPlaying ? 'pause' : 'play'}`} />}
              onClick={handlePlayPause}
              className="play-pause-btn"
              title={isPlaying ? 'Pause' : 'Play'}
            />
            
            <IconButton 
              icon={<i className="fa-solid fa-forward-step" />}
              onClick={() => handleSeek('forward')}
              title="Seek forward 10s"
              size="sm"
            />
          </div>

          {/* Time Display */}
          <div className="time-display">
            <span className="current-time">{formatTime(currentTime)}</span>
            <span className="time-separator">/</span>
            <span className="total-time">{formatTime(duration)}</span>
          </div>

          {/* Progress Bar */}
          <div className="progress-container" onClick={handleProgressClick}>
            <div className="progress-track">
              <div 
                className="progress-fill" 
                style={{ width: `${progressPercentage}%` }} 
              />
              <div 
                className="progress-handle"
                style={{ left: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Secondary Controls */}
          <div className="controls-secondary">
            {/* Volume Control */}
            <div className="volume-control">
              <IconButton
                icon={<i className={`fa-solid fa-volume-${volume === 0 ? 'mute' : volume < 0.5 ? 'low' : 'high'}`} />}
                size="sm"
                title="Volume"
              />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="volume-slider"
              />
            </div>

            {/* Playback Speed */}
            <div className="speed-control">
              <select
                value={playbackRate}
                onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
                className="speed-selector"
              >
                <option value={0.5}>0.5x</option>
                <option value={0.75}>0.75x</option>
                <option value={1}>1x</option>
                <option value={1.25}>1.25x</option>
                <option value={1.5}>1.5x</option>
                <option value={2}>2x</option>
              </select>
            </div>

            {/* Fullscreen */}
            <IconButton
              icon={<i className={`fa-solid fa-${isFullscreen ? 'compress' : 'expand'}`} />}
              onClick={() => setIsFullscreen(!isFullscreen)}
              title="Fullscreen"
              size="sm"
            />
          </div>
        </div>
      </div>
    </div>
  )
})
