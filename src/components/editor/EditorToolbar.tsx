import { useState } from 'react'
import { Button } from '@/components/ui'

interface EditorToolbarProps {
  editor: {
    analyzeVideo: (url: string) => void
    isAnalyzing: boolean
  }
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  const [youtubeUrl, setYoutubeUrl] = useState('')

  const handleAnalyze = () => {
    if (youtubeUrl.trim()) {
      editor.analyzeVideo(youtubeUrl)
    }
  }

  return (
    <div className="editor-toolbar">
      <input
        type="text"
        value={youtubeUrl}
        onChange={(e) => setYoutubeUrl(e.target.value)}
        placeholder="Paste YouTube URL here..."
        className="editor-url-input"
      />
      <Button 
        variant="primary" 
        leftIcon={<i className="fa-solid fa-wand-magic-sparkles" />}
        onClick={handleAnalyze}
        disabled={!youtubeUrl.trim() || editor.isAnalyzing}
        loading={editor.isAnalyzing}
      >
        {editor.isAnalyzing ? 'Analyzing...' : 'Analyze with AI'}
      </Button>
    </div>
  )
}
