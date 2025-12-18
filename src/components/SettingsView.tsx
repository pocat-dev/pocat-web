import { useState } from 'react'
import { Button, Select, Toggle } from './ui'

interface SettingsViewProps {
  backendUrl: string
  onBackendUrlChange: (url: string) => void
  connectionStatus: { success: boolean; message: string } | null
  isTestingConnection: boolean
  onTestConnection: () => void
}

const qualityOptions = [
  { value: '2160p', label: '4K (2160p)' },
  { value: '1080p', label: 'Full HD (1080p)' },
  { value: '720p', label: 'HD (720p)' },
  { value: '480p', label: 'SD (480p)' },
]

const formatOptions = [
  { value: 'MP4', label: 'MP4 (H.264)' },
  { value: 'WebM', label: 'WebM (VP9)' },
  { value: 'MOV', label: 'MOV (ProRes)' },
]

const aspectOptions = [
  { value: '16:9', label: '16:9 Landscape' },
  { value: '9:16', label: '9:16 Portrait' },
  { value: '1:1', label: '1:1 Square' },
]

const langOptions = [
  { value: 'en', label: 'English' },
  { value: 'id', label: 'Indonesian' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
  { value: 'zh', label: 'Chinese' },
]

const captionStyleOptions = [
  { value: 'modern', label: 'Modern (Animated)' },
  { value: 'classic', label: 'Classic (Static)' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'bold', label: 'Bold' },
]

const themeOptions = [
  { value: 'dark', label: 'Dark' },
  { value: 'light', label: 'Light' },
  { value: 'system', label: 'System' },
]

// Reusable Section Component
const Section = ({ icon, title, desc, children }: { icon: string; title: string; desc: string; children: React.ReactNode }) => (
  <div className="settings-section">
    <div className="settings-section-header">
      <i className={`fa-solid ${icon}`} />
      <div>
        <h3>{title}</h3>
        <p>{desc}</p>
      </div>
    </div>
    <div className="settings-section-body">{children}</div>
  </div>
)

// Reusable Row Component
const Row = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
  <div className="settings-row">
    <div>
      <label className="settings-label">{label}</label>
      {hint && <p className="settings-hint">{hint}</p>}
    </div>
    {children}
  </div>
)

export const SettingsView: React.FC<SettingsViewProps> = ({
  backendUrl,
  onBackendUrlChange,
  connectionStatus,
  isTestingConnection,
  onTestConnection,
}) => {
  const [exportQuality, setExportQuality] = useState('1080p')
  const [exportFormat, setExportFormat] = useState('MP4')
  const [aspectRatio, setAspectRatio] = useState('16:9')
  const [autoCaption, setAutoCaption] = useState(true)
  const [captionLang, setCaptionLang] = useState('en')
  const [captionStyle, setCaptionStyle] = useState('modern')
  const [theme, setTheme] = useState('dark')
  const [notifications, setNotifications] = useState(true)
  const [autoSave, setAutoSave] = useState(true)

  return (
    <div className="app-content">
      <h1 className="dashboard-title">Settings</h1>

      <div className="settings-layout">
        {/* Left Column */}
        <div className="settings-column">
          <Section icon="fa-server" title="Backend Connection" desc="Configure API endpoint">
            <label className="settings-label">API URL</label>
            <div className="settings-input-row">
              <input
                type="text"
                value={backendUrl}
                onChange={(e) => onBackendUrlChange(e.target.value)}
                className="settings-input mono"
                placeholder="http://localhost:3333"
              />
              <Button 
                variant="primary" 
                onClick={onTestConnection} 
                loading={isTestingConnection} 
                className="settings-btn primary"
                disabled={!backendUrl.trim()}
              >
                {isTestingConnection ? 'Testing...' : 'Test'}
              </Button>
            </div>
            {connectionStatus && (
              <div className={`settings-alert ${connectionStatus.success ? 'success' : 'error'}`}>
                <i className={`fa-solid ${connectionStatus.success ? 'fa-check-circle' : 'fa-triangle-exclamation'}`} />
                <span>{connectionStatus.message}</span>
              </div>
            )}
            <p className="settings-hint">
              Test connection to verify backend API is accessible. The health endpoint will be checked at: <code>{backendUrl.replace(/\/$/, '')}/health</code>
            </p>
          </Section>

          <Section icon="fa-film" title="Export Settings" desc="Default export preferences">
            <Row label="Video Quality" hint="Output resolution">
              <Select options={qualityOptions} value={exportQuality} onChange={(e) => setExportQuality(e.target.value)} />
            </Row>
            <Row label="Format" hint="Output file format">
              <Select options={formatOptions} value={exportFormat} onChange={(e) => setExportFormat(e.target.value)} />
            </Row>
            <Row label="Default Aspect Ratio" hint="For new projects">
              <Select options={aspectOptions} value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} />
            </Row>
          </Section>

          <Section icon="fa-closed-captioning" title="Captions & Subtitles" desc="Auto-caption preferences">
            <Row label="Auto-generate Captions" hint="Use AI to generate captions">
              <Toggle checked={autoCaption} onChange={setAutoCaption} />
            </Row>
            <Row label="Default Language" hint="Caption language">
              <Select options={langOptions} value={captionLang} onChange={(e) => setCaptionLang(e.target.value)} />
            </Row>
            <Row label="Caption Style" hint="Default appearance">
              <Select options={captionStyleOptions} value={captionStyle} onChange={(e) => setCaptionStyle(e.target.value)} />
            </Row>
          </Section>
        </div>

        {/* Right Column */}
        <div className="settings-column">
          <Section icon="fa-palette" title="Appearance" desc="Theme & display">
            <Row label="Theme" hint="App color scheme">
              <Select options={themeOptions} value={theme} onChange={(e) => setTheme(e.target.value)} />
            </Row>
            <Row label="Notifications" hint="Show desktop alerts">
              <Toggle checked={notifications} onChange={setNotifications} />
            </Row>
            <Row label="Auto-save Projects" hint="Save changes automatically">
              <Toggle checked={autoSave} onChange={setAutoSave} />
            </Row>
          </Section>

          <Section icon="fa-hard-drive" title="Storage" desc="Manage local cache">
            <div className="settings-storage">
              <div className="settings-storage-header">
                <span>3.5 GB</span>
                <span className="settings-storage-total">of 10 GB</span>
              </div>
              <div className="settings-storage-bar">
                <div className="settings-storage-fill" style={{ width: '35%' }} />
              </div>
              <div className="settings-storage-breakdown">
                <div className="settings-storage-item"><span className="dot violet" /><span>Videos</span><span>2.1 GB</span></div>
                <div className="settings-storage-item"><span className="dot blue" /><span>Cache</span><span>1.2 GB</span></div>
                <div className="settings-storage-item"><span className="dot gray" /><span>Other</span><span>0.2 GB</span></div>
              </div>
            </div>
            <div className="settings-btn-group">
              <Button variant="secondary" leftIcon={<i className="fa-solid fa-broom" />} className="settings-btn outline">Clear Cache</Button>
              <Button variant="secondary" leftIcon={<i className="fa-solid fa-trash" />} className="settings-btn outline danger">Delete All</Button>
            </div>
          </Section>

          <Section icon="fa-circle-info" title="About Pocat" desc="Version & info">
            <div className="settings-about">
              <div className="settings-about-row"><span>Version</span><span className="settings-about-value">1.0.0</span></div>
              <div className="settings-about-row"><span>Backend</span><span className="settings-about-value">AdonisJS + Tuyau</span></div>
              <div className="settings-about-row"><span>Frontend</span><span className="settings-about-value">React + TanStack</span></div>
              <div className="settings-about-row"><span>License</span><span className="settings-about-value">MIT</span></div>
              <div className="settings-about-row"><span>Developer</span><span className="settings-about-value">@sandikodev</span></div>
              <div className="settings-about-row"><span>Company</span><span className="settings-about-value">PT Koneksi Jaringan Indonesia</span></div>
            </div>
            <div className="settings-links">
              <a href="https://github.com/pocat-dev" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-github" /> GitHub</a>
              <a href="https://twitter.com/sandikodev" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-twitter" /> @sandikodev</a>
              <a href="https://www.linkedin.com/in/koneksi-jaringan-a0b149396/" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-linkedin" /> PT Koneksi</a>
              <a href="https://facebook.com/konxc.id" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-facebook" /> @konxc.id</a>
              <a href="https://instagram.com/konxc.id" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-instagram" /> @konxc.id</a>
              <a href="https://tiktok.com/@konxc.id" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-tiktok" /> @konxc.id</a>
            </div>
          </Section>
        </div>
      </div>
    </div>
  )
}
