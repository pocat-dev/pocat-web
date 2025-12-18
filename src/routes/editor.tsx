import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { useAuth } from '../contexts/AuthContext'
import { useState, useEffect } from 'react'

export const Route = createFileRoute('/editor')({
  component: EditorPage,
})

const mockClips = [
  { id: 1, title: 'Highlight #1', score: 98, active: true },
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
      <div className="h-screen flex items-center justify-center bg-base">
        <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="editor-layout">
        {/* Left Sidebar - AI Clips */}
        <div className="editor-sidebar-left">
          <div className="panel-header">
            <span className="panel-title">AI Clips</span>
            <button className="btn btn-ghost btn-icon btn-sm">
              <i className="fa-solid fa-ellipsis" aria-hidden="true" />
            </button>
          </div>
          <div className="p-2 space-y-1">
            {mockClips.map((clip) => (
              <div
                key={clip.id}
                onClick={() => setActiveClip(clip.id)}
                className={`clip-item ${activeClip === clip.id ? 'active' : ''}`}
              >
                <div className="clip-thumb flex items-center justify-center">
                  <i className="fa-solid fa-image text-tertiary text-xs" />
                </div>
                <div className="clip-info">
                  <div className="clip-title">{clip.title}</div>
                  <span className="badge badge-viral text-xs">{clip.score} Viral Score</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main - Video Preview */}
        <div className="editor-main">
          {/* Toolbar */}
          <div className="flex items-center gap-4 p-4 border-b border-primary">
            <div className="flex-1">
              <input
                type="text"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="YouTube URL"
                className="input"
              />
            </div>
            <button className="btn btn-primary">
              <i className="fa-solid fa-wand-magic-sparkles" aria-hidden="true" />
              Analyze with AI
            </button>
          </div>

          {/* Video Preview */}
          <div className="editor-preview">
            <div className="video-container max-w-2xl w-full">
              <div className="w-full h-full bg-surface-secondary rounded-xl flex items-center justify-center">
                <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-violet-700 rounded-full flex items-center justify-center glow-violet-lg cursor-pointer hover:scale-105 transition-transform">
                  <i className="fa-solid fa-play text-white text-3xl ml-1" aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>

          {/* Video Controls */}
          <div className="video-controls mx-4 mb-4">
            <button className="btn btn-ghost btn-icon btn-sm">
              <i className="fa-solid fa-play" aria-hidden="true" />
            </button>
            <button className="btn btn-ghost btn-icon btn-sm">
              <i className="fa-solid fa-backward-step" aria-hidden="true" />
            </button>
            <span className="video-time">0:00:00</span>
            <div className="flex-1 h-1 bg-surface-tertiary rounded-full mx-4">
              <div className="h-full w-1/3 bg-gradient-to-r from-violet-500 to-violet-600 rounded-full" />
            </div>
            <span className="video-time">0:12:30</span>
            <button className="btn btn-ghost btn-icon btn-sm">
              <i className="fa-solid fa-forward-step" aria-hidden="true" />
            </button>
            <button className="btn btn-ghost btn-icon btn-sm">
              <i className="fa-solid fa-expand" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Right Sidebar - Properties */}
        <div className="editor-sidebar-right">
          <div className="panel-header border-0 px-0">
            <span className="panel-title">Properties</span>
          </div>

          <div className="space-y-6">
            {/* Caption Editing */}
            <div className="form-group">
              <label className="label">Caption Editing</label>
              <input type="text" className="input" placeholder="Highlight #1 was text" />
              <textarea
                className="input mt-2"
                rows={2}
                placeholder="That I wish you for your captions."
              />
            </div>

            {/* Font Selection */}
            <div className="form-group">
              <label className="label">Font Selection</label>
              <div className="grid grid-cols-2 gap-2">
                <select className="input">
                  <option>AI</option>
                  <option>Inter</option>
                  <option>Roboto</option>
                </select>
                <select className="input">
                  <option>Regular</option>
                  <option>Bold</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-secondary">Color</span>
                  <div className="w-6 h-6 bg-white rounded border border-primary" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-secondary">Color</span>
                  <div className="w-6 h-6 bg-white rounded border border-primary" />
                </div>
              </div>
            </div>

            {/* Export Button */}
            <button className="btn btn-primary w-full btn-lg">
              <i className="fa-solid fa-download" aria-hidden="true" />
              Export
            </button>
          </div>
        </div>

        {/* Timeline */}
        <div className="editor-timeline">
          <div className="timeline">
            <div className="timeline-time">
              <span>0:11:16</span>
              <span>0:1:28:31:22</span>
            </div>
            <div className="timeline-waveform" />
            <div className="timeline-track">
              <div className="timeline-selection" style={{ left: '20%', width: '15%' }} />
              <div className="timeline-selection" style={{ left: '50%', width: '10%' }} />
              <div className="timeline-playhead" style={{ left: '30%' }} />
            </div>
            <div className="timeline-time">
              <span>1:21:4:25</span>
              <span>12:12:33</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
