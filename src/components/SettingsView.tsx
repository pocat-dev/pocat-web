import React from 'react';

interface SettingsViewProps {
  backendUrl: string;
  setBackendUrl: React.Dispatch<React.SetStateAction<string>>;
  connectionStatus: {success: boolean; message: string} | null;
  isTestingConnection: boolean;
  onTestConnection: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  backendUrl,
  setBackendUrl,
  connectionStatus,
  isTestingConnection,
  onTestConnection
}) => {
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBackendUrl(e.target.value);
    localStorage.setItem('backend_url', e.target.value);
  };

  return (
    <div className="flex-1 p-8 bg-slate-950">
      <div className="max-w-2xl mx-auto space-y-8">
        <h2 className="text-3xl font-bold">Settings</h2>
        
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <i className="fa-solid fa-link text-blue-500"></i> 
            Backend Connection
          </h3>
          
          <div className="flex gap-2">
            <input 
              type="text" 
              value={backendUrl} 
              onChange={handleUrlChange}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white font-mono" 
              placeholder="Backend API URL"
            />
            <button 
              onClick={onTestConnection} 
              disabled={isTestingConnection} 
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg disabled:opacity-50"
            >
              {isTestingConnection ? (
                <i className="fa-solid fa-circle-notch animate-spin"></i>
              ) : (
                "Test"
              )}
            </button>
          </div>
          
          {connectionStatus && (
            <div className={`mt-4 p-3 rounded-lg ${
              connectionStatus.success 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              <div className="flex items-center gap-2">
                <i className={`fa-solid ${connectionStatus.success ? 'fa-check-circle' : 'fa-exclamation-triangle'}`}></i>
                <span>{connectionStatus.message}</span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <i className="fa-solid fa-info-circle text-purple-500"></i>
            About ClipGenius AI
          </h3>
          <div className="space-y-2 text-slate-400">
            <p><strong className="text-white">Version:</strong> 1.0.0</p>
            <p><strong className="text-white">Backend:</strong> Pocat.io API</p>
            <p><strong className="text-white">Features:</strong> AI Video Analysis, Smart Caching, Real-time Progress</p>
          </div>
        </div>
      </div>
    </div>
  );
};
