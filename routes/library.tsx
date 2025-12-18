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
          thumbnail: "https://via.placeholder.com/320x180/6366f1/ffffff?text=Sample+Video",
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
