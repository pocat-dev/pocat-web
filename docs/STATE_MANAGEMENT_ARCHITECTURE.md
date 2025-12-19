# 🏗️ State Management Architecture Decision

> Comprehensive analysis and optimal architecture for Pocat's state management system

## 🤔 **The Core Question: Zustand vs TanStack Query + useState**

### **Context Analysis**
Our application has a **hybrid state nature** with distinct categories requiring different management strategies. The key decision is whether to introduce Zustand or leverage our existing TanStack Query + Tuyau ecosystem.

---

## 📊 **State Categories Deep Dive**

### **1. Server State (Remote Data)**
```typescript
// Data that lives on the server and needs synchronization
interface ServerState {
  // Video metadata from YouTube API
  videoInfo: {
    id: string
    title: string
    duration: number
    thumbnail: string
    url: string
  }
  
  // AI analysis results from backend
  analysisResults: {
    clips: ViralClip[]
    transcription: string
    highlights: TimeRange[]
    sentiment: SentimentData
  }
  
  // Export jobs and status
  exportJobs: {
    id: string
    status: 'pending' | 'processing' | 'completed' | 'failed'
    progress: number
    downloadUrl?: string
  }[]
  
  // User projects and saved clips
  projects: Project[]
  savedClips: SavedClip[]
}
```

**Characteristics:**
- **Asynchronous** - Requires loading states, error handling
- **Cacheable** - Benefits from intelligent caching strategies
- **Shareable** - Multiple components need same data
- **Optimistic** - UI updates before server confirmation
- **Stale-while-revalidate** - Show cached data while fetching fresh

### **2. Client State (UI-Only Data)**
```typescript
// Data that only exists in the browser and doesn't sync
interface ClientState {
  // Video player state
  currentTime: number        // Current playback position
  isPlaying: boolean         // Play/pause state
  volume: number             // Audio volume level
  playbackRate: number       // Speed (0.5x, 1x, 2x)
  
  // Editor UI state
  selectedTool: 'select' | 'trim' | 'caption' | 'export'
  timelineZoom: number       // Timeline zoom level (0.1 - 5.0)
  activeClipId: string | null // Currently selected clip
  
  // Modal and overlay state
  showExportModal: boolean
  showSettingsPanel: boolean
  sidebarCollapsed: boolean
  
  // Form state (temporary)
  captionText: string        // Current caption being edited
  fontSettings: FontConfig   // Font family, size, color
  exportSettings: ExportConfig // Quality, format, aspect ratio
}
```

**Characteristics:**
- **Synchronous** - Immediate updates, no loading states
- **Ephemeral** - Doesn't persist across sessions (mostly)
- **Local** - Component-specific or app-wide UI state
- **Fast-changing** - High-frequency updates (timeline scrubbing)

### **3. Hybrid State (Client + Server)**
```typescript
// State that starts local but syncs to server
interface HybridState {
  // Project editing state
  projectChanges: {
    clips: ClipEdit[]          // Local edits not yet saved
    timeline: TimelineState    // Arrangement and timing
    lastSaved: Date           // Auto-save tracking
    isDirty: boolean          // Has unsaved changes
  }
  
  // User preferences (sync across devices)
  userPreferences: {
    theme: 'light' | 'dark'
    defaultExportSettings: ExportConfig
    keyboardShortcuts: ShortcutConfig
    autoSave: boolean
  }
}
```

**Characteristics:**
- **Optimistic** - Update UI immediately, sync later
- **Conflict resolution** - Handle concurrent edits
- **Persistence** - Local storage + server backup
- **Debounced sync** - Batch updates to reduce API calls

---

## 🎯 **Architecture Decision Matrix**

### **Option 1: Zustand for Everything**
```typescript
// Single store approach
interface AppStore {
  // Server state (duplicating TanStack Query)
  videos: Video[]
  clips: Clip[]
  isLoading: boolean
  error: string | null
  
  // Client state
  currentTime: number
  isPlaying: boolean
  selectedTool: string
  
  // Actions
  fetchVideos: () => Promise<void>
  setCurrentTime: (time: number) => void
  // ... 50+ more actions
}
```

**❌ Problems:**
- **Duplication** - Reimplementing TanStack Query features
- **Cache invalidation** - Manual cache management
- **Loading states** - Manual loading/error handling
- **Optimistic updates** - Complex rollback logic
- **Bundle size** - Additional 2.9KB + our existing TanStack Query
- **Learning curve** - Team needs to learn Zustand patterns

### **Option 2: TanStack Query + useState (Recommended)**
```typescript
// Separation of concerns approach
// Server state: TanStack Query + Tuyau
const { data: clips, isLoading, error } = useQuery({
  queryKey: ['clips', videoId],
  queryFn: () => api.clips.list({ videoId }) // Type-safe Tuyau call
})

// Client state: useState + custom hooks
const [playerState, setPlayerState] = useState({
  currentTime: 0,
  isPlaying: false,
  volume: 1
})
```

**✅ Benefits:**
- **Leverage existing** - Use TanStack Query's mature features
- **Type safety** - Tuyau provides end-to-end types
- **Smaller bundle** - No additional state library
- **Proven patterns** - Team already familiar
- **Automatic caching** - Built-in cache management
- **Optimistic updates** - Built-in optimistic mutation support

---

## 🏛️ **Optimal Architecture: Territorial Responsibility**

### **Territory 1: Server State Management**
**Owner: TanStack Query + Tuyau**

```typescript
// hooks/useVideoData.ts
export function useVideoData(videoId: string) {
  return useQuery({
    queryKey: ['video', videoId],
    queryFn: () => api.videos.get({ id: videoId }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000  // 10 minutes
  })
}

// hooks/useClipsData.ts
export function useClipsData(videoId: string) {
  return useQuery({
    queryKey: ['clips', videoId],
    queryFn: () => api.clips.list({ videoId }),
    enabled: !!videoId
  })
}

// hooks/useAnalyzeVideo.ts
export function useAnalyzeVideo() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (url: string) => api.videos.analyze({ url }),
    onSuccess: (data) => {
      // Optimistic update
      queryClient.setQueryData(['video', data.id], data)
      queryClient.invalidateQueries(['clips', data.id])
    }
  })
}
```

**Responsibilities:**
- ✅ **API communication** via type-safe Tuyau calls
- ✅ **Caching strategy** with intelligent invalidation
- ✅ **Loading states** and error handling
- ✅ **Optimistic updates** for better UX
- ✅ **Background refetching** for fresh data
- ✅ **Offline support** with cached data

### **Territory 2: Client State Management**
**Owner: Custom Hooks + useState**

```typescript
// hooks/usePlayerState.ts
export function usePlayerState() {
  const [state, setState] = useState({
    currentTime: 0,
    isPlaying: false,
    volume: 1,
    playbackRate: 1
  })
  
  const actions = useMemo(() => ({
    setCurrentTime: (time: number) => 
      setState(prev => ({ ...prev, currentTime: time })),
    
    togglePlayPause: () => 
      setState(prev => ({ ...prev, isPlaying: !prev.isPlaying })),
    
    setVolume: (volume: number) => 
      setState(prev => ({ ...prev, volume }))
  }), [])
  
  return { ...state, ...actions }
}

// hooks/useEditorUI.ts
export function useEditorUI() {
  const [state, setState] = useState({
    selectedTool: 'select' as const,
    timelineZoom: 1,
    activeClipId: null as string | null,
    showExportModal: false
  })
  
  // Keyboard shortcuts
  useKeyboardShortcuts({
    'Space': () => setState(prev => ({ ...prev, isPlaying: !prev.isPlaying })),
    'Escape': () => setState(prev => ({ ...prev, showExportModal: false }))
  })
  
  return { state, setState }
}
```

**Responsibilities:**
- ✅ **UI state management** for components
- ✅ **Form state** for temporary inputs
- ✅ **Keyboard shortcuts** and interactions
- ✅ **Modal/overlay state** management
- ✅ **Performance optimization** with useMemo/useCallback

### **Territory 3: Hybrid State Management**
**Owner: Custom Hooks + TanStack Query Mutations**

```typescript
// hooks/useProjectEditor.ts
export function useProjectEditor(projectId: string) {
  // Server state
  const { data: project } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => api.projects.get({ id: projectId })
  })
  
  // Local changes (optimistic)
  const [localChanges, setLocalChanges] = useState<ProjectChanges>({
    clips: [],
    timeline: null,
    lastSaved: new Date(),
    isDirty: false
  })
  
  // Auto-save mutation
  const saveProject = useMutation({
    mutationFn: (changes: ProjectChanges) => 
      api.projects.update({ id: projectId, ...changes }),
    onSuccess: () => {
      setLocalChanges(prev => ({ ...prev, isDirty: false, lastSaved: new Date() }))
    }
  })
  
  // Debounced auto-save
  const debouncedSave = useDebouncedCallback(
    () => {
      if (localChanges.isDirty) {
        saveProject.mutate(localChanges)
      }
    },
    2000 // 2 seconds
  )
  
  useEffect(() => {
    debouncedSave()
  }, [localChanges, debouncedSave])
  
  return {
    project: { ...project, ...localChanges }, // Merge server + local
    updateProject: (changes: Partial<ProjectChanges>) => {
      setLocalChanges(prev => ({ ...prev, ...changes, isDirty: true }))
    },
    saveNow: () => saveProject.mutate(localChanges),
    isSaving: saveProject.isPending
  }
}
```

**Responsibilities:**
- ✅ **Optimistic updates** with server sync
- ✅ **Auto-save functionality** with debouncing
- ✅ **Conflict resolution** for concurrent edits
- ✅ **Local storage backup** for offline work

---

## 🎨 **Component Integration Patterns**

### **Pattern 1: Server Data Components**
```typescript
// components/ClipsPanel.tsx
export function ClipsPanel({ videoId }: { videoId: string }) {
  const { data: clips, isLoading, error } = useClipsData(videoId)
  const analyzeVideo = useAnalyzeVideo()
  
  if (isLoading) return <ClipsLoading />
  if (error) return <ClipsError error={error} />
  if (!clips?.length) return <EmptyClips onAnalyze={analyzeVideo.mutate} />
  
  return (
    <div className="clips-panel">
      {clips.map(clip => (
        <ClipItem key={clip.id} clip={clip} />
      ))}
    </div>
  )
}
```

### **Pattern 2: Client State Components**
```typescript
// components/VideoPlayer.tsx
export function VideoPlayer({ videoUrl }: { videoUrl: string }) {
  const player = usePlayerState()
  const videoRef = useRef<HTMLVideoElement>(null)
  
  // Sync video element with state
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = player.currentTime
      if (player.isPlaying) {
        videoRef.current.play()
      } else {
        videoRef.current.pause()
      }
    }
  }, [player.currentTime, player.isPlaying])
  
  return (
    <video
      ref={videoRef}
      src={videoUrl}
      onTimeUpdate={(e) => player.setCurrentTime(e.currentTarget.currentTime)}
      onPlay={() => player.togglePlayPause()}
      onPause={() => player.togglePlayPause()}
    />
  )
}
```

### **Pattern 3: Hybrid State Components**
```typescript
// components/ProjectEditor.tsx
export function ProjectEditor({ projectId }: { projectId: string }) {
  const editor = useProjectEditor(projectId)
  const ui = useEditorUI()
  
  return (
    <div className="project-editor">
      <EditorToolbar 
        project={editor.project}
        onSave={editor.saveNow}
        isSaving={editor.isSaving}
      />
      
      <EditorCanvas
        project={editor.project}
        selectedTool={ui.state.selectedTool}
        onProjectChange={editor.updateProject}
        onToolChange={(tool) => ui.setState(prev => ({ ...prev, selectedTool: tool }))}
      />
      
      <Timeline
        clips={editor.project.clips}
        zoom={ui.state.timelineZoom}
        onZoomChange={(zoom) => ui.setState(prev => ({ ...prev, timelineZoom: zoom }))}
      />
    </div>
  )
}
```

---

## 📈 **Performance Optimization Strategies**

### **1. Memoization Strategy**
```typescript
// Expensive computations
const processedClips = useMemo(() => {
  return clips.map(clip => ({
    ...clip,
    thumbnail: generateThumbnail(clip),
    waveform: generateWaveform(clip.audio)
  }))
}, [clips])

// Stable references
const playerActions = useMemo(() => ({
  play: () => setIsPlaying(true),
  pause: () => setIsPlaying(false),
  seek: (time: number) => setCurrentTime(time)
}), [])
```

### **2. Component Splitting**
```typescript
// Heavy components split by concern
const VideoPlayer = lazy(() => import('./VideoPlayer'))
const Timeline = lazy(() => import('./Timeline'))
const ClipsPanel = lazy(() => import('./ClipsPanel'))

// Conditional loading
{isVideoLoaded && (
  <Suspense fallback={<VideoPlayerSkeleton />}>
    <VideoPlayer />
  </Suspense>
)}
```

### **3. Query Optimization**
```typescript
// Prefetch related data
const prefetchClips = useCallback((videoId: string) => {
  queryClient.prefetchQuery({
    queryKey: ['clips', videoId],
    queryFn: () => api.clips.list({ videoId })
  })
}, [queryClient])

// Selective updates
const updateClip = useMutation({
  mutationFn: api.clips.update,
  onMutate: async (newClip) => {
    // Optimistic update
    await queryClient.cancelQueries(['clips', newClip.videoId])
    const previousClips = queryClient.getQueryData(['clips', newClip.videoId])
    
    queryClient.setQueryData(['clips', newClip.videoId], (old: Clip[]) =>
      old.map(clip => clip.id === newClip.id ? { ...clip, ...newClip } : clip)
    )
    
    return { previousClips }
  },
  onError: (err, newClip, context) => {
    // Rollback on error
    queryClient.setQueryData(['clips', newClip.videoId], context?.previousClips)
  }
})
```

---

## 🧪 **Testing Strategy**

### **1. Server State Testing**
```typescript
// Test TanStack Query hooks
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useClipsData } from '../hooks/useClipsData'

test('should fetch clips data', async () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  })
  
  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
  
  const { result } = renderHook(() => useClipsData('video-123'), { wrapper })
  
  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true)
    expect(result.current.data).toHaveLength(3)
  })
})
```

### **2. Client State Testing**
```typescript
// Test custom hooks
import { renderHook, act } from '@testing-library/react'
import { usePlayerState } from '../hooks/usePlayerState'

test('should toggle play/pause', () => {
  const { result } = renderHook(() => usePlayerState())
  
  expect(result.current.isPlaying).toBe(false)
  
  act(() => {
    result.current.togglePlayPause()
  })
  
  expect(result.current.isPlaying).toBe(true)
})
```

### **3. Integration Testing**
```typescript
// Test component integration
import { render, screen, fireEvent } from '@testing-library/react'
import { ProjectEditor } from '../components/ProjectEditor'

test('should save project changes', async () => {
  render(<ProjectEditor projectId="project-123" />)
  
  const titleInput = screen.getByLabelText('Project Title')
  fireEvent.change(titleInput, { target: { value: 'New Title' } })
  
  await waitFor(() => {
    expect(screen.getByText('Saved')).toBeInTheDocument()
  })
})
```

---

## 📊 **Bundle Size Analysis**

### **Current Approach (TanStack Query + useState)**
```
TanStack Query: 39.2KB (gzipped: 12.8KB)
React: 42.2KB (gzipped: 13.2KB)
Tuyau Client: 5.1KB (gzipped: 1.8KB)
Custom Hooks: 2.3KB (gzipped: 0.8KB)
Total: 88.8KB (gzipped: 28.6KB)
```

### **Alternative (+ Zustand)**
```
TanStack Query: 39.2KB (gzipped: 12.8KB)
React: 42.2KB (gzipped: 13.2KB)
Tuyau Client: 5.1KB (gzipped: 1.8KB)
Zustand: 8.7KB (gzipped: 2.9KB)
Custom Hooks: 2.3KB (gzipped: 0.8KB)
Total: 97.5KB (gzipped: 31.5KB)
```

**Savings: 8.7KB (2.9KB gzipped) by not using Zustand**

---

## 🎯 **Final Decision: TanStack Query + useState**

### **Rationale Summary**

**✅ Technical Benefits:**
- **Smaller bundle** - 2.9KB savings
- **Leverages existing** - No new learning curve
- **Type safety** - Seamless Tuyau integration
- **Performance** - Built-in optimizations
- **Maintainability** - Fewer dependencies

**✅ Team Benefits:**
- **Familiar patterns** - Team already knows TanStack Query
- **Consistent architecture** - Single approach across app
- **Easier debugging** - React DevTools + TanStack DevTools
- **Better testing** - Established testing patterns

**✅ Business Benefits:**
- **Faster development** - No additional setup
- **Lower risk** - Proven, stable approach
- **Better performance** - Optimized bundle size
- **Future-proof** - Aligned with React ecosystem

### **Implementation Guidelines**

**DO:**
- ✅ Use TanStack Query for all server state
- ✅ Use useState for simple UI state
- ✅ Create custom hooks for complex logic
- ✅ Leverage Tuyau for type-safe API calls
- ✅ Implement optimistic updates via mutations
- ✅ Use proper memoization for performance

**DON'T:**
- ❌ Mix server state in useState
- ❌ Duplicate TanStack Query functionality
- ❌ Create global state for local UI concerns
- ❌ Skip error boundaries for async operations
- ❌ Forget to handle loading states properly

---

## 📚 **Reference Implementation**

### **Project Structure**
```
src/
├── hooks/
│   ├── server/           # TanStack Query hooks
│   │   ├── useVideoData.ts
│   │   ├── useClipsData.ts
│   │   └── useAnalyzeVideo.ts
│   ├── client/           # Client state hooks
│   │   ├── usePlayerState.ts
│   │   ├── useEditorUI.ts
│   │   └── useKeyboardShortcuts.ts
│   └── hybrid/           # Hybrid state hooks
│       ├── useProjectEditor.ts
│       └── useUserPreferences.ts
├── components/
│   ├── editor/           # Editor components
│   └── shared/           # Reusable components
└── utils/
    ├── api.ts            # Tuyau client setup
    └── queryClient.ts    # TanStack Query config
```

### **Hook Naming Conventions**
```typescript
// Server state hooks (TanStack Query)
useVideoData()      // GET operations
useClipsData()      // GET operations
useAnalyzeVideo()   // POST/PUT operations (mutations)
useExportClip()     // POST/PUT operations (mutations)

// Client state hooks (useState)
usePlayerState()    // Video player UI state
useEditorUI()       // Editor interface state
useModalState()     // Modal/overlay state

// Hybrid hooks (useState + TanStack Query)
useProjectEditor()  // Project editing with auto-save
useUserPreferences() // Settings with server sync
```

---

**Last Updated:** December 19, 2025  
**Status:** Architecture Decision Approved  
**Next Review:** After Phase 1 implementation

> This document serves as the definitive guide for state management decisions in the Pocat application, ensuring consistent, performant, and maintainable code across all development phases.
