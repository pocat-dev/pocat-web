import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { EditorView } from '../components/EditorView'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { useAuth } from '../contexts/AuthContext'
import { useState, useRef, useEffect } from 'react'
import { VideoState, AIAnalysisResult, AspectRatio, ViralClip } from '../types'

export const Route = createFileRoute('/editor')({
  component: EditorComponent,
})

function EditorComponent() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate({ to: '/login' })
    }
  }, [isAuthenticated, authLoading, navigate])

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

  const handleYouTubeImport = async () => {
    console.log('YouTube import:', youtubeLink)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File upload:', event.target.files)
  }

  const handleSeek = (time: number) => {
    if (videoRef.current) videoRef.current.currentTime = time
    setVideoState(prev => ({ ...prev, currentTime: time }))
  }

  const runFrameAnalysis = async () => {
    console.log('Frame analysis')
  }

  const scanVideo = async () => {
    console.log('Scan video')
  }

  const handlePlayClip = (clip: ViralClip) => {
    console.log('Play clip:', clip)
  }

  const handleExportClip = (clip: ViralClip) => {
    console.log('Export clip:', clip)
  }

  if (authLoading || !isAuthenticated) {
    return (
      <div className="h-screen flex items-center justify-center bg-surface">
        <div className="w-8 h-8 border-3 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <DashboardLayout>
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
    </DashboardLayout>
  )
}
