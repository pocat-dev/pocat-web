import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { useAuth } from '../contexts/AuthContext'
import { useState, useEffect } from 'react'

export const Route = createFileRoute('/editor')({
  component: EditorPage,
})

const mockClips = [
  { id: 1, title: 'Highlight #1', score: 98 },
  { id: 2, title: 'Action Sequence', score: 92 },
  { id: 3, title: 'Funny Moment', score: 92 },
  { id: 4, title: 'Funny Moment #1', score: 98 },
  { id: 5, title: 'Funny Moment #2', score: 92 },
]

function EditorPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [activeClip, setActiveClip] = useState(1)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: '/login' })
    }
  }, [isAuthenticated, isLoading, navigate])

  if (isLoading || !isAuthenticated) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="editor-container">
        {/* Top Toolbar */}
        <div className="editor-toolbar">
          <input
            type="text"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="Paste YouTube URL here..."
            className="editor-url-input"
          />
          <button className="editor-analyze-btn">
            <i className="fa-solid fa-wand-magic-sparkles" />
            Analyze with AI
          </button>
        </div>

        {/* Main Editor Area */}
        <div className="editor-main">
          {/* Left Panel - AI Clips */}
          <div className="editor-panel-left">
            <div className="editor-panel-header">
              <span>AI CLIPS</span>
              <button className="editor-panel-btn">
                <i className="fa-solid fa-ellipsis" />
              </button>
            </div>
            <div className="editor-clips-list">
              {mockClips.map((clip) => (
                <div
                  key={clip.id}
                  onClick={() => setActiveClip(clip.id)}
                  className={`editor-clip-item ${activeClip === clip.id ? 'active' : ''}`}
                >
                  <div className="editor-clip-thumb">
                    <i className="fa-solid fa-image" />
                  </div>
                  <div className="editor-clip-info">
                    <div className="editor-clip-title">{clip.title}</div>
                    <span className="editor-clip-score">{clip.score} Viral Score</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Center - Video Preview */}
          <div className="editor-panel-center">
            <div className="editor-video-wrapper">
              <div className="editor-video-player">
                <div className="editor-video-play">
                  <i className="fa-solid fa-play" />
                </div>
              </div>
            </div>
            <div className="editor-video-controls">
              <button className="editor-control-btn"><i className="fa-solid fa-play" /></button>
              <button className="editor-control-btn"><i className="fa-solid fa-backward-step" /></button>
              <span className="editor-time">0:00:00</span>
              <div className="editor-progress">
                <div className="editor-progress-fill" style={{ width: '0%' }} />
              </div>
              <span className="editor-time">0:12:30</span>
              <button className="editor-control-btn"><i className="fa-solid fa-forward-step" /></button>
              <button className="editor-control-btn"><i className="fa-solid fa-expand" /></button>
            </div>
          </div>

          {/* Right Panel - Properties */}
          <div className="editor-panel-right">
            <div className="editor-panel-header">
              <span>PROPERTIES</span>
            </div>
            <div className="editor-properties">
              <div className="editor-prop-group">
                <label className="editor-prop-label">Caption Editing</label>
                <input type="text" className="editor-prop-input" placeholder="Highlight #1 was text" />
                <textarea className="editor-prop-textarea" placeholder="That I wish you for your captions." rows={3} />
              </div>

              <div className="editor-prop-group">
                <label className="editor-prop-label">Font Selection</label>
                <div className="editor-prop-row">
                  <select className="editor-prop-select">
                    <option>AI</option>
                    <option>Inter</option>
                    <option>Roboto</option>
                  </select>
                  <select className="editor-prop-select">
                    <option>Regular</option>
                    <option>Bold</option>
                  </select>
                </div>
                <div className="editor-prop-row">
                  <div className="editor-color-picker">
                    <span>Color</span>
                    <div className="editor-color-box" style={{ backgroundColor: '#ffffff' }} />
                  </div>
                  <div className="editor-color-picker">
                    <span>Stroke</span>
                    <div className="editor-color-box" style={{ backgroundColor: '#000000' }} />
                  </div>
                </div>
              </div>

              <button className="editor-export-btn">
                <i className="fa-solid fa-download" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Bottom - Timeline */}
        <div className="editor-timeline">
          <div className="editor-timeline-header">
            <span>0:11:16</span>
            <span>0:1:28:31:22</span>
          </div>
          <div className="editor-timeline-track">
            <div className="editor-timeline-waveform" />
            <div className="editor-timeline-segments">
              <div className="editor-timeline-segment" style={{ left: '20%', width: '15%' }} />
              <div className="editor-timeline-segment" style={{ left: '45%', width: '8%' }} />
              <div className="editor-timeline-segment" style={{ left: '65%', width: '12%' }} />
            </div>
            <div className="editor-timeline-playhead" style={{ left: '30%' }} />
          </div>
          <div className="editor-timeline-footer">
            <span>1:21:4:25</span>
            <span>12:12:33</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
