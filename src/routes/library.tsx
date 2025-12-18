import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { LibraryView } from '../components/LibraryView'
import { AppShell } from '../layouts/AppShell'
import { useAuth } from '../contexts/AuthContext'
import { useState, useRef, useEffect } from 'react'
import { Project } from '../services/backend'

export const Route = createFileRoute('/library')({
  component: LibraryComponent,
})

function LibraryComponent() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoadingProjects, setIsLoadingProjects] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate({ to: '/login' })
    }
  }, [isAuthenticated, authLoading, navigate])

  const loadProjects = async () => {
    setIsLoadingProjects(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const mockProjects: Project[] = [
        {
          id: 1,
          title: "Product Demo Video",
          status: "completed",
          duration: 180,
          thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='180' viewBox='0 0 320 180'%3E%3Crect width='320' height='180' fill='%239333ea'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-family='Arial' font-size='14'%3EProduct Demo%3C/text%3E%3C/svg%3E",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          videoAvailable: true,
          source: "youtube"
        },
        {
          id: 2,
          title: "Tutorial Series Episode 1",
          status: "processing",
          duration: 420,
          thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='180' viewBox='0 0 320 180'%3E%3Crect width='320' height='180' fill='%233b82f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-family='Arial' font-size='14'%3ETutorial Ep.1%3C/text%3E%3C/svg%3E",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date().toISOString(),
          videoAvailable: false,
          source: "upload"
        },
        {
          id: 3,
          title: "Marketing Campaign 2024",
          status: "completed",
          duration: 90,
          thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='180' viewBox='0 0 320 180'%3E%3Crect width='320' height='180' fill='%2322c55e'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-family='Arial' font-size='14'%3EMarketing%3C/text%3E%3C/svg%3E",
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          updatedAt: new Date().toISOString(),
          videoAvailable: true,
          source: "youtube"
        }
      ]
      
      setProjects(mockProjects)
    } catch (error) {
      console.error('Failed to load projects:', error)
      setProjects([])
    } finally {
      setIsLoadingProjects(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) loadProjects()
  }, [isAuthenticated])

  if (authLoading || !isAuthenticated) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
      </div>
    )
  }

  return (
    <AppShell>
      <LibraryView
        projects={projects}
        isLoadingProjects={isLoadingProjects}
        onRefresh={loadProjects}
        fileInputRef={fileInputRef}
      />
    </AppShell>
  )
}
