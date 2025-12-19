import { memo, useState } from 'react'
import { Button, Select, IconButton } from '@/components/ui'

const fontOptions = [
  { value: 'inter', label: 'Inter' },
  { value: 'roboto', label: 'Roboto' },
  { value: 'arial', label: 'Arial' },
  { value: 'helvetica', label: 'Helvetica' },
  { value: 'georgia', label: 'Georgia' },
  { value: 'times', label: 'Times New Roman' }
]

const weightOptions = [
  { value: 'light', label: 'Light' },
  { value: 'regular', label: 'Regular' },
  { value: 'medium', label: 'Medium' },
  { value: 'semibold', label: 'Semi Bold' },
  { value: 'bold', label: 'Bold' },
  { value: 'black', label: 'Black' }
]

const animationOptions = [
  { value: 'none', label: 'None' },
  { value: 'fade-in', label: 'Fade In' },
  { value: 'slide-up', label: 'Slide Up' },
  { value: 'zoom-in', label: 'Zoom In' },
  { value: 'typewriter', label: 'Typewriter' }
]

const exportFormats = [
  { value: 'mp4', label: 'MP4 (Recommended)' },
  { value: 'mov', label: 'MOV' },
  { value: 'webm', label: 'WebM' },
  { value: 'gif', label: 'GIF' }
]

const qualityOptions = [
  { value: '480p', label: '480p (Fast)' },
  { value: '720p', label: '720p (Good)' },
  { value: '1080p', label: '1080p (Best)' },
  { value: '4k', label: '4K (Premium)' }
]

interface PropertiesPanelProps {
  editor: {
    captionText: string
    fontFamily: string
    fontWeight: string
    textColor: string
    strokeColor: string
    setCaptionText: (text: string) => void
    setFontFamily: (font: string) => void
    setFontWeight: (weight: string) => void
    setTextColor: (color: string) => void
    setStrokeColor: (color: string) => void
    activeClip: any
    exportClip: (id: string) => void
    isExporting: boolean
  }
}

export const PropertiesPanel = memo(({ editor }: PropertiesPanelProps) => {
  const [fontSize, setFontSize] = useState(24)
  const [animation, setAnimation] = useState('fade-in')
  const [exportFormat, setExportFormat] = useState('mp4')
  const [exportQuality, setExportQuality] = useState('1080p')
  const [showAdvanced, setShowAdvanced] = useState(false)

  const {
    captionText,
    fontFamily,
    fontWeight,
    textColor,
    strokeColor,
    setCaptionText,
    setFontFamily,
    setFontWeight,
    setTextColor,
    setStrokeColor,
    activeClip,
    exportClip,
    isExporting
  } = editor

  const handleExport = () => {
    if (activeClip) {
      exportClip(activeClip.id)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="editor-panel-right">
      <div className="editor-panel-header">
        <span>PROPERTIES</span>
        <IconButton
          icon={<i className="fa-solid fa-chevron-down" />}
          size="sm"
          className={showAdvanced ? 'rotated' : ''}
          onClick={() => setShowAdvanced(!showAdvanced)}
          title="Toggle advanced settings"
        />
      </div>

      <div className="editor-properties">
        {/* Active Clip Info */}
        {activeClip && (
          <div className="editor-prop-group">
            <label className="editor-prop-label">Active Clip</label>
            <div className="active-clip-info">
              <div className="clip-thumbnail">
                <img src={activeClip.thumbnail} alt={activeClip.title} />
                <div className="clip-duration">
                  {formatTime(activeClip.duration)}
                </div>
              </div>
              <div className="clip-details">
                <h4 className="clip-title">{activeClip.title}</h4>
                <div className="clip-metadata">
                  <span className="viral-score">Score: {activeClip.score}</span>
                  <span className="viral-potential">{activeClip.viralPotential} viral</span>
                </div>
                <div className="clip-timing">
                  {formatTime(activeClip.startTime)} - {formatTime(activeClip.endTime)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Caption Editing */}
        <div className="editor-prop-group">
          <label className="editor-prop-label">
            Caption Text
            <span className="char-count">{captionText.length}/100</span>
          </label>
          <textarea 
            className="editor-prop-textarea" 
            placeholder="Enter your caption text here..."
            rows={3}
            value={captionText}
            onChange={(e) => setCaptionText(e.target.value.slice(0, 100))}
            maxLength={100}
          />
          
          {/* Quick Caption Templates */}
          <div className="caption-templates">
            <button 
              className="template-btn"
              onClick={() => setCaptionText(activeClip?.title || '')}
            >
              Use Clip Title
            </button>
            <button 
              className="template-btn"
              onClick={() => setCaptionText('🔥 This will blow your mind!')}
            >
              Viral Template
            </button>
          </div>
        </div>
        
        {/* Font Settings */}
        <div className="editor-prop-group">
          <label className="editor-prop-label">Font & Style</label>
          
          <div className="editor-prop-row">
            <Select 
              options={fontOptions} 
              value={fontFamily}
              onChange={(value) => setFontFamily(value)}
              className="editor-prop-select" 
              placeholder="Font Family"
            />
            <Select 
              options={weightOptions}
              value={fontWeight}
              onChange={(value) => setFontWeight(value)}
              className="editor-prop-select" 
              placeholder="Weight"
            />
          </div>

          <div className="editor-prop-row">
            <div className="font-size-control">
              <label>Size</label>
              <input
                type="range"
                min="12"
                max="72"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="font-size-slider"
              />
              <span className="font-size-value">{fontSize}px</span>
            </div>
          </div>
        </div>

        {/* Colors */}
        <div className="editor-prop-group">
          <label className="editor-prop-label">Colors</label>
          <div className="editor-prop-row">
            <div className="color-picker-group">
              <label>Text Color</label>
              <div className="color-picker">
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="color-input"
                />
                <span className="color-value">{textColor}</span>
              </div>
            </div>
            
            <div className="color-picker-group">
              <label>Stroke Color</label>
              <div className="color-picker">
                <input
                  type="color"
                  value={strokeColor}
                  onChange={(e) => setStrokeColor(e.target.value)}
                  className="color-input"
                />
                <span className="color-value">{strokeColor}</span>
              </div>
            </div>
          </div>

          {/* Color Presets */}
          <div className="color-presets">
            <div className="preset-label">Presets:</div>
            <div className="preset-colors">
              {[
                { text: '#ffffff', stroke: '#000000', name: 'Classic' },
                { text: '#000000', stroke: '#ffffff', name: 'Inverse' },
                { text: '#ff6b6b', stroke: '#ffffff', name: 'Red' },
                { text: '#4ecdc4', stroke: '#ffffff', name: 'Teal' },
                { text: '#ffe66d', stroke: '#000000', name: 'Yellow' }
              ].map(preset => (
                <button
                  key={preset.name}
                  className="color-preset"
                  onClick={() => {
                    setTextColor(preset.text)
                    setStrokeColor(preset.stroke)
                  }}
                  title={preset.name}
                  style={{ 
                    background: preset.text,
                    border: `2px solid ${preset.stroke}`
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Animation */}
        <div className="editor-prop-group">
          <label className="editor-prop-label">Animation</label>
          <Select
            options={animationOptions}
            value={animation}
            onChange={(value) => setAnimation(value)}
            className="editor-prop-select"
            placeholder="Select animation"
          />
        </div>

        {/* Advanced Settings */}
        {showAdvanced && (
          <div className="editor-prop-group advanced-settings">
            <label className="editor-prop-label">Advanced Settings</label>
            
            {/* Position Controls */}
            <div className="position-controls">
              <label>Caption Position</label>
              <div className="position-grid">
                {['top-left', 'top-center', 'top-right', 'center-left', 'center', 'center-right', 'bottom-left', 'bottom-center', 'bottom-right'].map(pos => (
                  <button key={pos} className="position-btn" title={pos}>
                    <i className="fa-solid fa-square" />
                  </button>
                ))}
              </div>
            </div>

            {/* Timing Controls */}
            <div className="timing-controls">
              <label>Caption Timing</label>
              <div className="timing-inputs">
                <input type="number" placeholder="Start (s)" className="timing-input" />
                <input type="number" placeholder="End (s)" className="timing-input" />
              </div>
            </div>
          </div>
        )}

        {/* Export Settings */}
        <div className="editor-prop-group">
          <label className="editor-prop-label">Export Settings</label>
          
          <div className="editor-prop-row">
            <Select
              options={exportFormats}
              value={exportFormat}
              onChange={(value) => setExportFormat(value)}
              className="editor-prop-select"
              placeholder="Format"
            />
            <Select
              options={qualityOptions}
              value={exportQuality}
              onChange={(value) => setExportQuality(value)}
              className="editor-prop-select"
              placeholder="Quality"
            />
          </div>

          <div className="export-info">
            <div className="info-item">
              <span>Estimated size: ~15MB</span>
            </div>
            <div className="info-item">
              <span>Export time: ~30s</span>
            </div>
          </div>
        </div>
        
        {/* Export Button */}
        <Button 
          variant="primary" 
          leftIcon={<i className="fa-solid fa-download" />}
          onClick={handleExport}
          disabled={!activeClip || isExporting}
          loading={isExporting}
          className="editor-export-btn"
          size="lg"
        >
          {isExporting ? 'Exporting...' : 'Export Clip'}
        </Button>

        {/* Quick Actions */}
        <div className="quick-actions">
          <Button
            variant="secondary"
            leftIcon={<i className="fa-solid fa-eye" />}
            size="sm"
            disabled={!activeClip}
          >
            Preview
          </Button>
          <Button
            variant="secondary"
            leftIcon={<i className="fa-solid fa-copy" />}
            size="sm"
            disabled={!activeClip}
          >
            Duplicate
          </Button>
          <Button
            variant="secondary"
            leftIcon={<i className="fa-solid fa-share" />}
            size="sm"
            disabled={!activeClip}
          >
            Share
          </Button>
        </div>
      </div>
    </div>
  )
})
