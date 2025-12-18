import React, { useState } from 'react';

interface SettingsViewProps {
  backendUrl: string;
  onBackendUrlChange: (url: string) => void;
  connectionStatus: {success: boolean; message: string} | null;
  isTestingConnection: boolean;
  onTestConnection: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  backendUrl,
  onBackendUrlChange,
  connectionStatus,
  isTestingConnection,
  onTestConnection
}) => {
  const [exportQuality, setExportQuality] = useState('1080p');
  const [exportFormat, setExportFormat] = useState('MP4');
  const [autoCaption, setAutoCaption] = useState(true);
  const [captionLang, setCaptionLang] = useState('en');
  const [theme, setTheme] = useState('dark');
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  return (
    <div className="dashboard-content">
      <h1 className="dashboard-title">Settings</h1>

      <div className="settings-layout">
        {/* Left Column */}
        <div className="settings-column">
          {/* Backend Connection */}
          <div className="settings-section">
            <div className="settings-section-header">
              <i className="fa-solid fa-server" />
              <div>
                <h3>Backend Connection</h3>
                <p>Configure API endpoint</p>
              </div>
            </div>
            <div className="settings-section-body">
              <label className="settings-label">API URL</label>
              <div className="settings-input-row">
                <input 
                  type="text" 
                  value={backendUrl} 
                  onChange={(e) => onBackendUrlChange(e.target.value)}
                  className="settings-input mono"
                  placeholder="http://localhost:3333"
                />
                <button 
                  onClick={onTestConnection} 
                  disabled={isTestingConnection} 
                  className="settings-btn primary"
                >
                  {isTestingConnection ? <i className="fa-solid fa-spinner animate-spin" /> : 'Test'}
                </button>
              </div>
              {connectionStatus && (
                <div className={`settings-alert ${connectionStatus.success ? 'success' : 'error'}`}>
                  <i className={`fa-solid ${connectionStatus.success ? 'fa-check-circle' : 'fa-triangle-exclamation'}`} />
                  {connectionStatus.message}
                </div>
              )}
            </div>
          </div>

          {/* Export Settings */}
          <div className="settings-section">
            <div className="settings-section-header">
              <i className="fa-solid fa-film" />
              <div>
                <h3>Export Settings</h3>
                <p>Default export preferences</p>
              </div>
            </div>
            <div className="settings-section-body">
              <div className="settings-row">
                <div>
                  <label className="settings-label">Video Quality</label>
                  <p className="settings-hint">Output resolution</p>
                </div>
                <select className="settings-select" value={exportQuality} onChange={(e) => setExportQuality(e.target.value)}>
                  <option value="2160p">4K (2160p)</option>
                  <option value="1080p">Full HD (1080p)</option>
                  <option value="720p">HD (720p)</option>
                  <option value="480p">SD (480p)</option>
                </select>
              </div>
              <div className="settings-row">
                <div>
                  <label className="settings-label">Format</label>
                  <p className="settings-hint">Output file format</p>
                </div>
                <select className="settings-select" value={exportFormat} onChange={(e) => setExportFormat(e.target.value)}>
                  <option value="MP4">MP4 (H.264)</option>
                  <option value="WebM">WebM (VP9)</option>
                  <option value="MOV">MOV (ProRes)</option>
                </select>
              </div>
              <div className="settings-row">
                <div>
                  <label className="settings-label">Default Aspect Ratio</label>
                  <p className="settings-hint">For new projects</p>
                </div>
                <select className="settings-select">
                  <option value="16:9">16:9 Landscape</option>
                  <option value="9:16">9:16 Portrait</option>
                  <option value="1:1">1:1 Square</option>
                </select>
              </div>
            </div>
          </div>

          {/* Caption Settings */}
          <div className="settings-section">
            <div className="settings-section-header">
              <i className="fa-solid fa-closed-captioning" />
              <div>
                <h3>Captions & Subtitles</h3>
                <p>Auto-caption preferences</p>
              </div>
            </div>
            <div className="settings-section-body">
              <div className="settings-row">
                <div>
                  <label className="settings-label">Auto-generate Captions</label>
                  <p className="settings-hint">Use AI to generate captions</p>
                </div>
                <label className="settings-toggle">
                  <input type="checkbox" checked={autoCaption} onChange={(e) => setAutoCaption(e.target.checked)} />
                  <span className="settings-toggle-slider" />
                </label>
              </div>
              <div className="settings-row">
                <div>
                  <label className="settings-label">Default Language</label>
                  <p className="settings-hint">Caption language</p>
                </div>
                <select className="settings-select" value={captionLang} onChange={(e) => setCaptionLang(e.target.value)}>
                  <option value="en">English</option>
                  <option value="id">Indonesian</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="ja">Japanese</option>
                  <option value="ko">Korean</option>
                  <option value="zh">Chinese</option>
                </select>
              </div>
              <div className="settings-row">
                <div>
                  <label className="settings-label">Caption Style</label>
                  <p className="settings-hint">Default appearance</p>
                </div>
                <select className="settings-select">
                  <option>Modern (Animated)</option>
                  <option>Classic (Static)</option>
                  <option>Minimal</option>
                  <option>Bold</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="settings-column">
          {/* Appearance */}
          <div className="settings-section">
            <div className="settings-section-header">
              <i className="fa-solid fa-palette" />
              <div>
                <h3>Appearance</h3>
                <p>Theme & display</p>
              </div>
            </div>
            <div className="settings-section-body">
              <div className="settings-row">
                <div>
                  <label className="settings-label">Theme</label>
                  <p className="settings-hint">App color scheme</p>
                </div>
                <select className="settings-select" value={theme} onChange={(e) => setTheme(e.target.value)}>
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                  <option value="system">System</option>
                </select>
              </div>
              <div className="settings-row">
                <div>
                  <label className="settings-label">Notifications</label>
                  <p className="settings-hint">Show desktop alerts</p>
                </div>
                <label className="settings-toggle">
                  <input type="checkbox" checked={notifications} onChange={(e) => setNotifications(e.target.checked)} />
                  <span className="settings-toggle-slider" />
                </label>
              </div>
              <div className="settings-row">
                <div>
                  <label className="settings-label">Auto-save Projects</label>
                  <p className="settings-hint">Save changes automatically</p>
                </div>
                <label className="settings-toggle">
                  <input type="checkbox" checked={autoSave} onChange={(e) => setAutoSave(e.target.checked)} />
                  <span className="settings-toggle-slider" />
                </label>
              </div>
            </div>
          </div>

          {/* Storage */}
          <div className="settings-section">
            <div className="settings-section-header">
              <i className="fa-solid fa-hard-drive" />
              <div>
                <h3>Storage</h3>
                <p>Manage local cache</p>
              </div>
            </div>
            <div className="settings-section-body">
              <div className="settings-storage">
                <div className="settings-storage-header">
                  <span>3.5 GB</span>
                  <span className="settings-storage-total">of 10 GB</span>
                </div>
                <div className="settings-storage-bar">
                  <div className="settings-storage-fill" style={{ width: '35%' }} />
                </div>
                <div className="settings-storage-breakdown">
                  <div className="settings-storage-item">
                    <span className="dot violet" />
                    <span>Videos</span>
                    <span>2.1 GB</span>
                  </div>
                  <div className="settings-storage-item">
                    <span className="dot blue" />
                    <span>Cache</span>
                    <span>1.2 GB</span>
                  </div>
                  <div className="settings-storage-item">
                    <span className="dot gray" />
                    <span>Other</span>
                    <span>0.2 GB</span>
                  </div>
                </div>
              </div>
              <div className="settings-btn-group">
                <button className="settings-btn outline">
                  <i className="fa-solid fa-broom" /> Clear Cache
                </button>
                <button className="settings-btn outline danger">
                  <i className="fa-solid fa-trash" /> Delete All
                </button>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="settings-section">
            <div className="settings-section-header">
              <i className="fa-solid fa-circle-info" />
              <div>
                <h3>About Pocat</h3>
                <p>Version & info</p>
              </div>
            </div>
            <div className="settings-section-body">
              <div className="settings-about">
                <div className="settings-about-row">
                  <span>Version</span>
                  <span className="settings-about-value">1.0.0</span>
                </div>
                <div className="settings-about-row">
                  <span>Backend</span>
                  <span className="settings-about-value">AdonisJS + Tuyau</span>
                </div>
                <div className="settings-about-row">
                  <span>Frontend</span>
                  <span className="settings-about-value">React + TanStack</span>
                </div>
                <div className="settings-about-row">
                  <span>License</span>
                  <span className="settings-about-value">MIT</span>
                </div>
              </div>
              <div className="settings-links">
                <a href="https://github.com/pocat-dev" target="_blank" rel="noopener noreferrer">
                  <i className="fa-brands fa-github" /> GitHub
                </a>
                <a href="https://twitter.com/sandikodev" target="_blank" rel="noopener noreferrer">
                  <i className="fa-brands fa-twitter" /> Twitter
                </a>
                <a href="#" onClick={(e) => { e.preventDefault(); alert('Check for updates...'); }}>
                  <i className="fa-solid fa-rotate" /> Check Updates
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
