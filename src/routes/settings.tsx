import { createFileRoute } from '@tanstack/react-router'
import { SettingsView } from '../components/SettingsView'
import { useState } from 'react'

export const Route = createFileRoute('/settings')({
  component: SettingsComponent,
})

function SettingsComponent() {
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
      // TODO: Implement with Tuyau client
      console.log('Testing connection to:', backendUrl)
      // const response = await tuyau.$get()
      setConnectionStatus({
        success: true,
        message: 'Connection successful!'
      })
    } catch (error) {
      setConnectionStatus({
        success: false,
        message: 'Connection failed: ' + (error as Error).message
      })
    } finally {
      setIsTestingConnection(false)
    }
  }

  return (
    <SettingsView
      backendUrl={backendUrl}
      onBackendUrlChange={handleBackendUrlChange}
      connectionStatus={connectionStatus}
      isTestingConnection={isTestingConnection}
      onTestConnection={handleTestConnection}
    />
  )
}
