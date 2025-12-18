import { createFileRoute } from '@tanstack/react-router'
import { LibraryView } from '../components/LibraryView'
import { useState, useRef, useEffect } from 'react'
import { Project } from '../services/backend'

export const Route = createFileRoute('/library')({
  component: LibraryComponent,
})

function LibraryComponent() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoadingProjects, setIsLoadingProjects] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadProjects = async () => {
    setIsLoadingProjects(true)
    try {
      // TODO: Implement with Tuyau client when backend is ready
      console.log('Loading projects...')
      
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data for now
      const mockProjects: Project[] = [
        {
          id: 1,
          title: "Sample Video Project",
          status: "completed",
          duration: 120,
          thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='180' viewBox='0 0 320 180'%3E%3Crect width='320' height='180' fill='%236366f1'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-family='Arial, sans-serif' font-size='16'%3ESample Video%3C/text%3E%3C/svg%3E",
          createdAt: new Date().toISOString(),
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
    loadProjects()
  }, [])

  return (
    <LibraryView
      projects={projects}
      isLoadingProjects={isLoadingProjects}
      onRefresh={loadProjects}
      fileInputRef={fileInputRef}
    />
  )
}
