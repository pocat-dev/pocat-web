// Realistic mockup data for editor development
export const mockVideoData = {
  id: 'video-123',
  title: 'How to Build a Startup in 2024 | Complete Guide',
  duration: 1847, // 30:47 minutes
  thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
  url: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
  status: 'analyzed',
  createdAt: new Date('2024-12-19T08:00:00Z'),
  metadata: {
    views: 125000,
    likes: 8500,
    comments: 342,
    channel: 'TechStartup Academy',
    uploadDate: '2024-12-18'
  }
}

export const mockClipsData = [
  {
    id: 'clip-1',
    title: 'The #1 Mistake New Entrepreneurs Make',
    score: 98,
    startTime: 45,
    endTime: 75,
    duration: 30,
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    viralPotential: 'high',
    tags: ['entrepreneurship', 'mistakes', 'startup'],
    transcript: 'The biggest mistake I see new entrepreneurs make is trying to build everything at once...',
    engagement: {
      hooks: 3,
      emotions: ['surprise', 'concern'],
      pacing: 'fast'
    }
  },
  {
    id: 'clip-2', 
    title: 'How I Raised $1M in 30 Days',
    score: 95,
    startTime: 234,
    endTime: 264,
    duration: 30,
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    viralPotential: 'high',
    tags: ['fundraising', 'investment', 'success'],
    transcript: 'Here\'s exactly how I raised one million dollars in just thirty days...',
    engagement: {
      hooks: 4,
      emotions: ['excitement', 'curiosity'],
      pacing: 'medium'
    }
  },
  {
    id: 'clip-3',
    title: 'The Brutal Truth About Startup Failure',
    score: 92,
    startTime: 567,
    endTime: 597,
    duration: 30,
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    viralPotential: 'medium',
    tags: ['failure', 'reality', 'lessons'],
    transcript: 'Let me tell you the brutal truth that nobody talks about...',
    engagement: {
      hooks: 2,
      emotions: ['concern', 'realization'],
      pacing: 'slow'
    }
  },
  {
    id: 'clip-4',
    title: 'My Biggest Business Win (Unexpected)',
    score: 89,
    startTime: 892,
    endTime: 922,
    duration: 30,
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    viralPotential: 'medium',
    tags: ['success', 'unexpected', 'business'],
    transcript: 'This completely unexpected thing happened that changed everything...',
    engagement: {
      hooks: 3,
      emotions: ['surprise', 'joy'],
      pacing: 'medium'
    }
  },
  {
    id: 'clip-5',
    title: 'Why 90% of Startups Fail (Data)',
    score: 87,
    startTime: 1234,
    endTime: 1264,
    duration: 30,
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    viralPotential: 'medium',
    tags: ['statistics', 'failure', 'data'],
    transcript: 'The data shows that ninety percent of startups fail because...',
    engagement: {
      hooks: 2,
      emotions: ['concern', 'learning'],
      pacing: 'medium'
    }
  }
]

export const mockAnalysisData = {
  id: 'analysis-123',
  videoId: 'video-123',
  status: 'completed',
  progress: 100,
  results: {
    totalClips: 5,
    avgViralScore: 92.2,
    bestMoments: mockClipsData.slice(0, 3),
    insights: {
      topEmotions: ['surprise', 'excitement', 'concern'],
      bestHooks: 'Questions and bold statements work best',
      optimalLength: '30-45 seconds',
      recommendedAspectRatio: '9:16'
    },
    transcription: {
      confidence: 0.94,
      language: 'en',
      wordCount: 4521,
      speakingRate: 145 // words per minute
    }
  },
  createdAt: new Date('2024-12-19T08:15:00Z'),
  completedAt: new Date('2024-12-19T08:18:00Z')
}

export const mockExportJobs = [
  {
    id: 'export-1',
    clipId: 'clip-1',
    status: 'completed' as const,
    progress: 100,
    settings: {
      format: 'mp4',
      quality: '1080p',
      aspectRatio: '9:16'
    },
    downloadUrl: 'https://cdn.pocat.app/exports/clip-1.mp4',
    createdAt: new Date('2024-12-19T08:30:00Z'),
    completedAt: new Date('2024-12-19T08:32:00Z')
  },
  {
    id: 'export-2', 
    clipId: 'clip-2',
    status: 'processing' as const,
    progress: 67,
    settings: {
      format: 'mp4',
      quality: '1080p', 
      aspectRatio: '16:9'
    },
    createdAt: new Date('2024-12-19T08:35:00Z')
  }
]

// Simulate API delays for realistic UX
export const mockApiDelay = (min = 500, max = 1500) => 
  new Promise(resolve => setTimeout(resolve, Math.random() * (max - min) + min))

// Mock API responses
export const mockApi = {
  videos: {
    get: async (id: string) => {
      await mockApiDelay()
      return mockVideoData
    },
    analyze: async (url: string) => {
      await mockApiDelay(2000, 4000) // Longer for AI analysis
      return mockAnalysisData
    }
  },
  clips: {
    list: async (videoId: string) => {
      await mockApiDelay()
      return mockClipsData
    },
    update: async (clipData: any) => {
      await mockApiDelay(200, 500)
      return { ...clipData, updatedAt: new Date() }
    }
  },
  exports: {
    create: async (clipId: string, settings: any) => {
      await mockApiDelay(1000, 2000)
      return {
        id: `export-${Date.now()}`,
        clipId,
        status: 'processing',
        progress: 0,
        settings,
        createdAt: new Date()
      }
    },
    list: async (projectId: string) => {
      await mockApiDelay()
      return mockExportJobs
    }
  }
}
