import { createFileRoute } from '@tanstack/react-router'
import { EditorView } from '../components/EditorView'
import { useState, useRef } from 'react'
import { VideoState, AIAnalysisResult, AspectRatio, ViralClip } from '../types'

export const Route = createFileRoute('/editor')({
  component: EditorComponent,
})

function EditorComponent() {
  // State management (moved from App.tsx)
  const [videoState, setVideoState] = useState<VideoState>({
    file: null,
    url: null,
    thumbnail: null,
    duration: 0,
    currentTime: 0,
    isPlaying: false,
    sourceType: 'file',
    projectId: null
  })
  
  const [youtubeLink, setYoutubeLink] = useState('')
  const [isImporting, setIsImporting] = useState(false)
  const [importStatus, setImportStatus] = useState('')
  const [loadingTitle, setLoadingTitle] = useState('')
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.LANDSCAPE)
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null)
  const [viralClips, setViralClips] = useState<ViralClip[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState('')
  const [analysisTab, setAnalysisTab] = useState<'clips' | 'frame' | 'custom'>('clips')
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handlers (simplified versions)
  const handleYouTubeImport = async () => {
    console.log('YouTube import:', youtubeLink)
    // TODO: Implement with backend integration
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File upload:', event.target.files)
    // TODO: Implement file upload
  }

  const handleSeek = (time: number) => {
    if (videoRef.current) videoRef.current.currentTime = time
    setVideoState(prev => ({ ...prev, currentTime: time }))
  }

  const runFrameAnalysis = async () => {
    console.log('Frame analysis')
    // TODO: Implement AI analysis
  }

  const scanVideo = async () => {
    console.log('Scan video')
    // TODO: Implement video scanning
  }

  const handlePlayClip = (clip: ViralClip) => {
    console.log('Play clip:', clip)
    // TODO: Implement clip playback
  }

  const handleExportClip = (clip: ViralClip) => {
    console.log('Export clip:', clip)
    // TODO: Implement clip export
  }

  return (
    <EditorView
      videoState={videoState}
      setVideoState={setVideoState}
      youtubeLink={youtubeLink}
      setYoutubeLink={setYoutubeLink}
      isImporting={isImporting}
      importStatus={importStatus}
      loadingTitle={loadingTitle}
      aspectRatio={aspectRatio}
      setAspectRatio={setAspectRatio}
      analysis={analysis}
      viralClips={viralClips}
      isAnalyzing={isAnalyzing}
      analysisProgress={analysisProgress}
      analysisTab={analysisTab}
      setAnalysisTab={setAnalysisTab}
      videoRef={videoRef}
      fileInputRef={fileInputRef}
      onYouTubeImport={handleYouTubeImport}
      onFileUpload={handleFileUpload}
      onSeek={handleSeek}
      onAnalyzeFrame={runFrameAnalysis}
      onScanVideo={scanVideo}
      onPlayClip={handlePlayClip}
      onExportClip={handleExportClip}
    />
  )
}
