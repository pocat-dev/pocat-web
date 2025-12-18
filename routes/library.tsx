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
      // TODO: Implement with Tuyau client
      console.log('Loading projects...')
      // const projectsData = await tuyau.projects.$get()
      // setProjects(projectsData.data || [])
    } catch (error) {
      console.error('Failed to load projects:', error)
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
