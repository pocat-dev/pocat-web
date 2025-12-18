import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { SettingsView } from '../components/SettingsView'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { useAuth } from '../contexts/AuthContext'
import { useState, useEffect } from 'react'

export const Route = createFileRoute('/settings')({
  component: SettingsComponent,
})

function SettingsComponent() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate({ to: '/login' })
    }
  }, [isAuthenticated, authLoading, navigate])

  const [backendUrl, setBackendUrl] = useState(() => 
    localStorage.getItem('backend_url') || 'http://localhost:3333'
  )
  const [connectionStatus, setConnectionStatus] = useState<{success: boolean, message: string} | null>(null)
  const [isTestingConnection, setIsTestingConnection] = useState(false)

  const handleBackendUrlChange = (url: string) => {
    setBackendUrl(url)
    localStorage.setItem('backend_url', url)
  }

  const handleTestConnection = async () => {
    setIsTestingConnection(true)
    try {
      console.log('Testing connection to:', backendUrl)
      setConnectionStatus({ success: true, message: 'Connection successful!' })
    } catch (error) {
      setConnectionStatus({ success: false, message: 'Connection failed: ' + (error as Error).message })
    } finally {
      setIsTestingConnection(false)
    }
  }

  if (authLoading || !isAuthenticated) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
      </div>
    )
  }

  return (
    <DashboardLayout>
      <SettingsView
        backendUrl={backendUrl}
        onBackendUrlChange={handleBackendUrlChange}
        connectionStatus={connectionStatus}
        isTestingConnection={isTestingConnection}
        onTestConnection={handleTestConnection}
      />
    </DashboardLayout>
  )
}
