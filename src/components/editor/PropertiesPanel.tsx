import { memo } from 'react'
import { Button, Select } from '@/components/ui'

const fontOptions = [
  { value: 'inter', label: 'Inter' },
  { value: 'roboto', label: 'Roboto' },
  { value: 'arial', label: 'Arial' }
]

const weightOptions = [
  { value: 'regular', label: 'Regular' },
  { value: 'bold', label: 'Bold' }
]

export const PropertiesPanel = memo(({ editor }: any) => {
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

  return (
    <div className="editor-panel-right">
      <div className="editor-panel-header">
        <span>PROPERTIES</span>
      </div>
      <div className="editor-properties">
        <div className="editor-prop-group">
          <label className="editor-prop-label">Caption Editing</label>
          <input 
            type="text" 
            className="editor-prop-input" 
            placeholder={activeClip?.title || "No clip selected"}
            value={captionText}
            onChange={(e) => setCaptionText(e.target.value)}
          />
          <textarea 
            className="editor-prop-textarea" 
            placeholder="Enter your caption text here..."
            rows={3}
            value={captionText}
            onChange={(e) => setCaptionText(e.target.value)}
          />
        </div>
        
        <div className="editor-prop-group">
          <label className="editor-prop-label">Font Selection</label>
          <div className="editor-prop-row">
            <Select 
              options={fontOptions} 
              value={fontFamily}
              onChange={(value) => setFontFamily(value)}
              className="editor-prop-select" 
            />
            <Select 
              options={weightOptions}
              value={fontWeight}
              onChange={(value) => setFontWeight(value)}
              className="editor-prop-select" 
            />
          </div>
          <div className="editor-prop-row">
            <div className="editor-color-picker">
              <span>Color</span>
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="editor-color-input"
              />
            </div>
            <div className="editor-color-picker">
              <span>Stroke</span>
              <input
                type="color"
                value={strokeColor}
                onChange={(e) => setStrokeColor(e.target.value)}
                className="editor-color-input"
              />
            </div>
          </div>
        </div>
        
        <Button 
          variant="primary" 
          leftIcon={<i className="fa-solid fa-download" />}
          onClick={handleExport}
          disabled={!activeClip || isExporting}
          loading={isExporting}
          className="editor-export-btn"
        >
          {isExporting ? 'Exporting...' : 'Export'}
        </Button>
      </div>
    </div>
  )
})
