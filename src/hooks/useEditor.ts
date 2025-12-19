import { useState, useCallback, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { mockApi, mockVideoData, mockClipsData } from '@/data/mockData'

interface ViralClip {
  id: string
  title: string
  score: number
  startTime: number
  endTime: number
  duration: number
  thumbnail?: string
  viralPotential: 'high' | 'medium' | 'low'
  tags: string[]
  transcript: string
  engagement: {
    hooks: number
    emotions: string[]
    pacing: 'fast' | 'medium' | 'slow'
  }
}

interface EditorState {
  // UI-only state (local)
  currentTime: number
  isPlaying: boolean
  selectedTool: 'select' | 'trim' | 'caption'
  timelineZoom: number
  activeClipId: string | null
  
  // Form state (local)
  captionText: string
  fontFamily: string
  fontWeight: string
  textColor: string
  strokeColor: string
}

export function useEditor(videoId?: string) {
  // Local UI state with performance optimization
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

  // Memoized state updater to prevent unnecessary re-renders
  const updateState = useCallback((updates: Partial<EditorState>) => {
    setState(prev => ({ ...prev, ...updates }))
  }, [])

  // Server state via TanStack Query with realistic mockup data
  const { data: videoData, isLoading: videoLoading } = useQuery({
    queryKey: ['video', videoId],
    queryFn: () => mockApi.videos.get(videoId!),
    enabled: !!videoId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  })

  const { data: clips = [], isLoading: clipsLoading } = useQuery({
    queryKey: ['clips', videoId],
    queryFn: () => mockApi.clips.list(videoId!),
    enabled: !!videoId,
    select: useCallback((data: ViralClip[]) => 
      data.sort((a, b) => b.score - a.score), []), // Memoized sorting
    staleTime: 2 * 60 * 1000, // 2 minutes
  })

  const { data: exportJobs = [], isLoading: exportsLoading } = useQuery({
    queryKey: ['exports', videoId],
    queryFn: () => mockApi.exports.list(videoId!),
    enabled: !!videoId,
    refetchInterval: (data) => {
      // Smart polling - only poll if there are active exports
      if (!data || !Array.isArray(data)) return false
      
      const hasActiveExports = data.some(job => 
        job.status === 'processing' || job.status === 'queued'
      )
      return hasActiveExports ? 2000 : false
    }
  })

  // Mutations for server actions with optimistic updates
  const queryClient = useQueryClient()

  const analyzeVideoMutation = useMutation({
    mutationFn: (youtubeUrl: string) => mockApi.videos.analyze(youtubeUrl),
    onMutate: async () => {
      // Show loading state immediately
      return { startTime: Date.now() }
    },
    onSuccess: (data, variables, context) => {
      // Cache the analysis results
      queryClient.setQueryData(['analysis', data.videoId], data)
      queryClient.invalidateQueries(['clips', data.videoId])
      
      // Show success notification
      console.log(`Analysis completed in ${Date.now() - context.startTime}ms`)
    },
    onError: (error) => {
      console.error('Analysis failed:', error)
    }
  })

  const exportClipMutation = useMutation({
    mutationFn: (clipId: string) => {
      const clip = clips.find(c => c.id === clipId)
      return mockApi.exports.create(clipId, {
        format: 'mp4',
        quality: '1080p',
        aspectRatio: '9:16'
      })
    },
    onMutate: async (clipId) => {
      // Optimistic update - show export as starting
      await queryClient.cancelQueries(['exports', videoId])
      const previousExports = queryClient.getQueryData(['exports', videoId])
      
      const optimisticExport = {
        id: `temp-${clipId}`,
        clipId,
        status: 'queued' as const,
        progress: 0,
        settings: { format: 'mp4', quality: '1080p', aspectRatio: '9:16' },
        createdAt: new Date()
      }
      
      queryClient.setQueryData(['exports', videoId], (old: any[]) => 
        [...(old || []), optimisticExport]
      )
      
      return { previousExports, clipId }
    },
    onSuccess: (newExport) => {
      // Replace optimistic export with real one
      queryClient.setQueryData(['exports', videoId], (old: any[]) =>
        old.map(exp => 
          exp.id === `temp-${newExport.clipId}` ? newExport : exp
        )
      )
    },
    onError: (error, clipId, context) => {
      // Rollback optimistic update
      queryClient.setQueryData(['exports', videoId], context?.previousExports)
      console.error('Export failed:', error)
    }
  })

  // Computed values with memoization for performance
  const activeClip = useMemo(() => 
    clips.find(clip => clip.id === state.activeClipId) || null,
    [clips, state.activeClipId]
  )

  const duration = videoData?.duration || 0

  const timelineSegments = useMemo(() => 
    clips.map(clip => ({
      id: clip.id,
      startPercent: duration > 0 ? (clip.startTime / duration) * 100 : 0,
      widthPercent: duration > 0 ? (clip.duration / duration) * 100 : 0,
      title: clip.title,
      score: clip.score
    })),
    [clips, duration]
  )

  // Performance-optimized actions with useCallback
  const actions = useMemo(() => ({
    // Video controls
    setCurrentTime: (time: number) => updateState({ currentTime: time }),
    setIsPlaying: (playing: boolean) => updateState({ isPlaying: playing }),
    togglePlayPause: () => updateState({ isPlaying: !state.isPlaying }),
    
    // Clip management
    setActiveClip: (id: string | null) => {
      updateState({ activeClipId: id })
      // Auto-load clip caption when selected
      if (id) {
        const clip = clips.find(c => c.id === id)
        if (clip) {
          updateState({ captionText: clip.title })
        }
      }
    },
    
    // Tools
    setSelectedTool: (tool: EditorState['selectedTool']) => updateState({ selectedTool: tool }),
    setTimelineZoom: (zoom: number) => updateState({ timelineZoom: Math.max(0.1, Math.min(5, zoom)) }),
    
    // Properties with debounced updates
    setCaptionText: (text: string) => updateState({ captionText: text }),
    setFontFamily: (font: string) => updateState({ fontFamily: font }),
    setFontWeight: (weight: string) => updateState({ fontWeight: weight }),
    setTextColor: (color: string) => updateState({ textColor: color }),
    setStrokeColor: (color: string) => updateState({ strokeColor: color }),
    
    // Server actions
    analyzeVideo: analyzeVideoMutation.mutate,
    exportClip: exportClipMutation.mutate,
    
    // Utility actions
    seekToClip: (clipId: string) => {
      const clip = clips.find(c => c.id === clipId)
      if (clip) {
        updateState({ 
          currentTime: clip.startTime,
          activeClipId: clipId,
          captionText: clip.title
        })
      }
    },
    
    // Timeline interactions
    seekToTime: (time: number) => {
      const clampedTime = Math.max(0, Math.min(duration, time))
      updateState({ currentTime: clampedTime })
    }
  }), [state, clips, duration, updateState, analyzeVideoMutation.mutate, exportClipMutation.mutate])

  return {
    // State
    ...state,
    clips,
    activeClip,
    duration,
    videoData,
    exportJobs,
    timelineSegments,
    
    // Loading states
    isLoading: videoLoading || clipsLoading,
    isAnalyzing: analyzeVideoMutation.isPending,
    isExporting: exportClipMutation.isPending,
    
    // Actions
    ...actions,
    
    // Computed stats for UI
    stats: {
      totalClips: clips.length,
      avgScore: clips.length > 0 ? Math.round(clips.reduce((sum, clip) => sum + clip.score, 0) / clips.length) : 0,
      highViralClips: clips.filter(clip => clip.viralPotential === 'high').length,
      totalDuration: clips.reduce((sum, clip) => sum + clip.duration, 0)
    }
  }
}
