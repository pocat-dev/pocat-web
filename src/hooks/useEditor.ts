import { useState, useCallback } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'

interface ViralClip {
  id: number
  title: string
  score: number
  startTime: number
  endTime: number
  thumbnail?: string
}

interface EditorState {
  // UI-only state (local)
  currentTime: number
  isPlaying: boolean
  selectedTool: 'select' | 'trim' | 'caption'
  timelineZoom: number
  activeClipId: number | null
  
  // Form state (local)
  captionText: string
  fontFamily: string
  fontWeight: string
  textColor: string
  strokeColor: string
}

export function useEditor(videoId?: string) {
  // Local UI state
  const [state, setState] = useState<EditorState>({
    currentTime: 0,
    isPlaying: false,
    selectedTool: 'select',
    timelineZoom: 1,
    activeClipId: null,
    captionText: '',
    fontFamily: 'inter',
    fontWeight: 'regular',
    textColor: '#ffffff',
    strokeColor: '#000000'
  })

  // Server state via TanStack Query + Tuyau
  const { data: videoData, isLoading: videoLoading } = useQuery({
    queryKey: ['video', videoId],
    queryFn: () => {
      // TODO: Replace with actual Tuyau API call
      // return api.videos.get({ id: videoId })
      return Promise.resolve(null)
    },
    enabled: !!videoId
  })

  const { data: clips = [], isLoading: clipsLoading } = useQuery({
    queryKey: ['clips', videoId],
    queryFn: () => {
      // TODO: Replace with actual Tuyau API call
      // return api.clips.list({ videoId })
      return Promise.resolve([
        { id: 1, title: 'Highlight #1', score: 98, startTime: 10, endTime: 25 },
        { id: 2, title: 'Action Sequence', score: 92, startTime: 45, endTime: 60 },
        { id: 3, title: 'Funny Moment', score: 92, startTime: 120, endTime: 135 }
      ] as ViralClip[])
    },
    enabled: !!videoId
  })

  // Mutations for server actions
  const analyzeVideoMutation = useMutation({
    mutationFn: (youtubeUrl: string) => {
      // TODO: Replace with actual Tuyau API call
      // return api.videos.analyze({ url: youtubeUrl })
      console.log('Analyzing:', youtubeUrl)
      return Promise.resolve({ success: true })
    }
  })

  const exportClipMutation = useMutation({
    mutationFn: (clipId: number) => {
      // TODO: Replace with actual Tuyau API call
      // return api.clips.export({ id: clipId })
      console.log('Exporting clip:', clipId)
      return Promise.resolve({ success: true })
    }
  })

  // Local state updaters
  const updateState = useCallback((updates: Partial<EditorState>) => {
    setState(prev => ({ ...prev, ...updates }))
  }, [])

  // Computed values
  const activeClip = clips.find(clip => clip.id === state.activeClipId) || null
  const duration = videoData?.duration || 0

  // Actions
  const actions = {
    // Video controls
    setCurrentTime: (time: number) => updateState({ currentTime: time }),
    setIsPlaying: (playing: boolean) => updateState({ isPlaying: playing }),
    togglePlayPause: () => updateState({ isPlaying: !state.isPlaying }),
    
    // Clip management
    setActiveClip: (id: number | null) => updateState({ activeClipId: id }),
    
    // Tools
    setSelectedTool: (tool: EditorState['selectedTool']) => updateState({ selectedTool: tool }),
    setTimelineZoom: (zoom: number) => updateState({ timelineZoom: zoom }),
    
    // Properties
    setCaptionText: (text: string) => updateState({ captionText: text }),
    setFontFamily: (font: string) => updateState({ fontFamily: font }),
    setFontWeight: (weight: string) => updateState({ fontWeight: weight }),
    setTextColor: (color: string) => updateState({ textColor: color }),
    setStrokeColor: (color: string) => updateState({ strokeColor: color }),
    
    // Server actions
    analyzeVideo: analyzeVideoMutation.mutate,
    exportClip: exportClipMutation.mutate
  }

  return {
    // State
    ...state,
    clips,
    activeClip,
    duration,
    videoData,
    
    // Loading states
    isLoading: videoLoading || clipsLoading,
    isAnalyzing: analyzeVideoMutation.isPending,
    isExporting: exportClipMutation.isPending,
    
    // Actions
    ...actions
  }
}
