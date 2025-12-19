import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { SettingsView } from '../components/SettingsView'
import { AppShell } from '../layouts/AppShell'
import { useAuth } from '../contexts/AuthContext'
import { useState, useEffect } from 'react'

export const Route = createFileRoute('/_protected/settings')({
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
    setConnectionStatus(null)
    
    try {
      const healthUrl = `${backendUrl.replace(/\/$/, '')}/health`
      console.log('Testing connection to:', healthUrl)
      
      const response = await fetch(healthUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(10000),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const contentType = response.headers.get('content-type') || ''
      
      if (contentType.includes('application/json')) {
        const data = await response.json()
        
        // Handle Pocat API format: {success, message, data}
        if (data.success === true) {
          const version = data.data?.version || 'Unknown'
          const uptime = data.data?.uptime || 'Unknown'
          setConnectionStatus({ 
            success: true, 
            message: `✅ ${data.message} | Version: ${version} | Uptime: ${uptime}` 
          })
        } else {
          setConnectionStatus({ 
            success: false, 
            message: `⚠️ API responded but reported failure: ${data.message || 'Unknown error'}` 
          })
        }
      } else {
        const text = await response.text()
        throw new Error(`Server returned non-JSON response (${contentType}). Got: ${text.substring(0, 100)}...`)
      }
      
    } catch (error) {
      console.error('Connection test failed:', error)
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        setConnectionStatus({ 
          success: false, 
          message: '❌ Network error: Cannot reach server. Check URL and CORS settings.' 
        })
      } else if (error instanceof Error && error.name === 'TimeoutError') {
        setConnectionStatus({ 
          success: false, 
          message: '⏱️ Connection timeout: Server took too long to respond.' 
        })
      } else {
        setConnectionStatus({ 
          success: false, 
          message: `❌ Connection failed: ${(error as Error).message}` 
        })
      }
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
    <AppShell>
      <SettingsView
        backendUrl={backendUrl}
        onBackendUrlChange={handleBackendUrlChange}
        connectionStatus={connectionStatus}
        isTestingConnection={isTestingConnection}
        onTestConnection={handleTestConnection}
      />
    </AppShell>
  )
}
