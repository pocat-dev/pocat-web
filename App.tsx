import React, { useState, useRef, useEffect } from 'react';
import { VideoPlayer } from './components/VideoPlayer';
import { Timeline } from './components/Timeline';
import { AnalysisSidebar } from './components/AnalysisSidebar';
import { VideoState, AIAnalysisResult, AspectRatio, ViralClip } from './types';
import { analyzeFrame, analyzeVideoSegments } from './services/gemini';
import { VideoFrameProcessor } from './services/gpuProcessor';
import { renderClip, checkClipStatus, testBackendConnection, createProject, getProjectDownloadStatus, batchProcessClips } from './services/backend';

// Tipe untuk Navigasi Sidebar
type ViewType = 'editor' | 'library' | 'settings';

// Default to local development backend
const DEFAULT_BACKEND_URL = 'http://127.0.0.1:3333';

export default function App() {
  // Navigation State
  const [activeView, setActiveView] = useState<ViewType>('editor');

  // Backend Configuration State
  const [backendUrl, setBackendUrl] = useState(() => {
    // Load from localStorage or use default
    return localStorage.getItem('backend_url') || DEFAULT_BACKEND_URL;
  });
  const [connectionStatus, setConnectionStatus] = useState<{success: boolean; message: string} | null>(null);
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  const [videoState, setVideoState] = useState<VideoState>({
    file: null,
    url: null,
    thumbnail: null,
    duration: 0,
    currentTime: 0,
    isPlaying: false,
    sourceType: 'local'
  });
  
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.LANDSCAPE);
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [viralClips, setViralClips] = useState<ViralClip[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState<string>('');
  
  // YouTube Input State
  const [youtubeLink, setYoutubeLink] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState('');

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const gpuProcessorRef = useRef<VideoFrameProcessor | null>(null);

  // Initialize GPU Processor
  useEffect(() => {
    gpuProcessorRef.current = new VideoFrameProcessor();
    return () => {
      if (gpuProcessorRef.current) {
        gpuProcessorRef.current.destroy();
      }
    };
  }, []);

  // Clean up object URL
  useEffect(() => {
    return () => {
      // Clean up both local file URLs and blob URLs from YouTube fetch
      if (videoState.url) {
        URL.revokeObjectURL(videoState.url);
      }
    };
  }, [videoState.url]);

  const updateBackendUrl = (url: string) => {
    setBackendUrl(url);
    localStorage.setItem('backend_url', url);
    setConnectionStatus(null); // Reset status on change
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    setConnectionStatus(null);
    try {
      const result = await testBackendConnection(backendUrl);
      setConnectionStatus({
        success: result.success,
        message: result.message
      });
    } catch (e) {
      setConnectionStatus({
        success: false,
        message: (e as Error).message
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Revoke previous URL if exists
      if (videoState.url) URL.revokeObjectURL(videoState.url);
      
      const url = URL.createObjectURL(file);
      setVideoState({
        file,
        url,
        thumbnail: null,
        duration: 0,
        currentTime: 0,
        isPlaying: false,
        sourceType: 'local'
      });
      setAnalysis(null);
      setViralClips([]);
      setActiveView('editor'); 
    }
  };

  const handleYouTubeImport = async () => {
    if (!youtubeLink.trim()) return;

    setIsImporting(true);
    setImportStatus('Initializing project...');
    
    try {
        // V2 Workflow: Create Project & Download
        const title = "New Project " + new Date().toLocaleTimeString();
        const createRes = await createProject(backendUrl, youtubeLink, title);
        
        if (!createRes.success) {
            throw new Error(createRes.message);
        }

        const { projectId, videoInfo, estimatedTime } = createRes.data;
        console.log("Project Created:", createRes.data);

        // Show thumbnail immediately while downloading
        const durationVal = typeof videoInfo.duration === 'string' ? parseInt(videoInfo.duration) : videoInfo.duration;
        
        // Revoke previous URL if any
        if (videoState.url) URL.revokeObjectURL(videoState.url);

        setVideoState({
            file: null,
            url: null,
            thumbnail: videoInfo.thumbnail,
            duration: durationVal,
            currentTime: 0,
            isPlaying: false,
            sourceType: 'youtube', // Temporary while downloading
            projectId: projectId
        });
        
        setYoutubeLink(youtubeLink);
        setAnalysis(null);
        setViralClips([]);
        setActiveView('editor');

        setImportStatus(`Downloading: 0% (Est. ${estimatedTime})`);

        // Start polling for download status
        const pollInterval = setInterval(async () => {
            try {
                const statusRes = await getProjectDownloadStatus(backendUrl, projectId);
                
                if (statusRes.success && statusRes.data.readyForEditing) {
                    clearInterval(pollInterval);
                    setImportStatus('');
                    setIsImporting(false);
                    
                    // Construct stream URL for the downloaded file
                    // Format: BASE_URL/storage/downloads/project_{ID}_full.mp4
                    const cleanBaseUrl = backendUrl.replace(/\/$/, '');
                    const streamUrl = `${cleanBaseUrl}/storage/downloads/project_${projectId}_full.mp4`;
                    
                    console.log("Video ready! Switching to stream:", streamUrl);
                    
                    setVideoState(prev => ({
                        ...prev,
                        sourceType: 'backend-stream',
                        url: streamUrl,
                        isPlaying: true
                    }));
                    
                    alert("✅ Video downloaded successfully! You can now use AI Analysis features.");
                    
                } else if (statusRes.success) {
                     // Update progress
                     const progress = statusRes.data.progress || 0;
                     const status = statusRes.data.status;
                     setImportStatus(`Status: ${status} (${progress}%)`);
                     
                     if (status === 'failed') {
                         clearInterval(pollInterval);
                         setImportStatus('Download Failed');
                         alert("Video download failed on the server. Please check backend logs.");
                         setIsImporting(false);
                     }
                }
            } catch (e) {
                console.warn("Polling error:", e);
                // Continue polling despite temporary errors
            }
        }, 3000); // Check every 3 seconds

    } catch (error) {
        console.error("Import failed:", error);
        const errMessage = (error as Error).message;
        setImportStatus('Import failed');
        alert(`Failed to import video: ${errMessage}\nPlease check your backend connection.`);
        setIsImporting(false);
    }
  };

  const handleTimeUpdate = (time: number) => {
    setVideoState(prev => ({ ...prev, currentTime: time }));
  };

  const handleDurationChange = (duration: number) => {
    setVideoState(prev => ({ ...prev, duration }));
  };

  const handlePlayPause = () => {
    // Only allow play if we actually have a video URL
    if (!videoState.url) return;
    setVideoState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const handleSeek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
    // Always update state to allow scrubbing even in thumbnail mode
    setVideoState(prev => ({ ...prev, currentTime: time }));
  };

  const handlePlayClip = (timeStr: string) => {
    const [min, sec] = timeStr.split(':').map(Number);
    if (!isNaN(min) && !isNaN(sec)) {
      const time = min * 60 + sec;
      handleSeek(time);
      if (videoState.url) {
        setVideoState(prev => ({ ...prev, isPlaying: true }));
      }
      setActiveView('editor');
    }
  };

  // Handler untuk Export/Render Clip with Polling
  const handleExportClip = async (clip: ViralClip) => {
    // Both youtube (demo) and backend-stream (real) modes use the render endpoint
    if (!youtubeLink) {
      alert("No video source found.");
      return;
    }
    
    const parseTime = (t: string) => {
      const [m, s] = t.split(':').map(Number);
      return m * 60 + s;
    };

    // V2 Workflow: If we have a project ID (downloaded video), use batch processor for real output
    if (videoState.projectId) {
      try {
          const processRes = await batchProcessClips(backendUrl, videoState.projectId, [{
              title: clip.title || "Exported Clip",
              startTime: parseTime(clip.start),
              endTime: parseTime(clip.end),
              aspectRatio: aspectRatio
          }]);
          
          if (processRes.success) {
             alert(`✅ Clip processing started on server!\n\nStatus: ${processRes.data.estimatedTime}\n\nSince this is a background process, the clip will be saved to your Project Library on the server once complete.`);
          } else {
             throw new Error(processRes.message);
          }
      } catch(e) {
          console.error("Batch Process Failed", e);
          alert("Failed to start processing: " + (e as Error).message);
      }
      return;
    }

    // V1 Workflow: Demo/Direct Render
    try {
      const payload = {
        videoUrl: youtubeLink,
        startTime: parseTime(clip.start),
        endTime: parseTime(clip.end),
        aspectRatio: aspectRatio
      };

      // 1. Initiate Render (Pass backendUrl)
      const initResponse = await renderClip(backendUrl, payload);
      
      if (!initResponse.success || !initResponse.data) {
        throw new Error(initResponse.message || "Failed to initiate render");
      }

      const { clipId } = initResponse.data;

      // 2. Poll for Status (Pass backendUrl)
      await new Promise<void>((resolve, reject) => {
        let attempts = 0;
        const maxAttempts = 60; // 120 seconds timeout (2s interval)
        
        const pollInterval = setInterval(async () => {
          attempts++;
          try {
            const statusRes = await checkClipStatus(backendUrl, clipId);
            
            if (statusRes.status === 'completed' && statusRes.downloadUrl) {
              clearInterval(pollInterval);
              window.open(statusRes.downloadUrl, '_blank');
              resolve();
            } else if (statusRes.status === 'failed') {
              clearInterval(pollInterval);
              reject(new Error("Server reported render failure"));
            } else if (attempts >= maxAttempts) {
              clearInterval(pollInterval);
              reject(new Error("Render timed out. Please check 'My Projects' later."));
            }
          } catch (e) {
            console.error("Polling error", e);
            if (attempts >= maxAttempts) {
               clearInterval(pollInterval);
               reject(e);
            }
          }
        }, 2000);
      });

    } catch (e) {
      console.error("Export failed", e);
      alert("Export failed: " + (e as Error).message);
    }
  };

  const captureFrame = async (): Promise<Blob | null> => {
    if (!videoRef.current) return null;
    const video = videoRef.current;

    if (gpuProcessorRef.current) {
        try {
            return await gpuProcessorRef.current.capture(video);
        } catch (e) {
            console.warn("GPU Capture failed, falling back to CPU", e);
        }
    }

    return new Promise((resolve) => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 1280;
        canvas.height = video.videoHeight || 720;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.8);
        } else {
          resolve(null);
        }
      } catch (e) {
        console.error("Frame capture error:", e);
        resolve(null);
      }
    });
  };

  const runFrameAnalysis = async () => {
    // Only block if sourceType is strictly youtube (Thumbnail mode)
    if (videoState.sourceType === 'youtube') {
       alert("⚠️ AI Analysis Unavailable\n\nVideo is still downloading or in demo mode. Please wait for the download to complete to use AI features.");
       return;
    }

    if (!videoState.url) {
        alert("Video stream is not available for analysis.");
        return;
    }
    setVideoState(prev => ({ ...prev, isPlaying: false }));
    setIsAnalyzing(true);
    setAnalysisProgress('Capturing current frame (GPU Accelerated)...');
    setAnalysis(null);

    try {
      const frameBlob = await captureFrame();
      
      if (!frameBlob) {
         throw new Error("Could not capture frame. If using a downloaded video, ensure CORS headers are set on backend.");
      }

      setAnalysisProgress('Analyzing visual content with Gemini AI...');
      const baseContext = videoState.sourceType === 'backend-stream' ? "A viral YouTube video (Downloaded)" : (videoState.file?.name || "Unknown video");
      const contextText = `${baseContext}. The user is creating a video with a target aspect ratio of ${aspectRatio}. Analyze if the visual composition works well for this format (e.g. is the subject centered?).`;
      
      const result = await analyzeFrame(frameBlob, contextText);
      setAnalysis(result);
    } catch (error) {
      console.error("Analysis failed", error);
      alert(`Analysis failed. ${(error as Error).message}`);
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress('');
    }
  };

  const scanVideo = async () => {
    if (videoState.sourceType === 'youtube') {
       alert("⚠️ Auto-Detect Unavailable\n\nVideo is still downloading or in demo mode. Please wait for the download to complete to use AI features.");
       return;
    }

    if (!videoState.url || !videoRef.current) {
        alert("Video stream is not available for scanning.");
        return;
    }
    
    setVideoState(prev => ({ ...prev, isPlaying: false }));
    setIsAnalyzing(true);
    setAnalysisProgress('Initializing GPU scan...');
    setViralClips([]);

    try {
      const video = videoRef.current;
      const duration = video.duration;
      const frames: { timestamp: number; blob: Blob }[] = [];
      const interval = Math.max(5, duration / 5); 
      
      const captureTimes: number[] = [];
      for (let t = interval; t < duration - 5; t += interval) {
        captureTimes.push(t);
      }

      setAnalysisProgress(`Preparing to capture ${captureTimes.length} keyframes...`);

      for (let i = 0; i < captureTimes.length; i++) {
        const time = captureTimes[i];
        setAnalysisProgress(`Scanning frame ${i + 1} of ${captureTimes.length} (${Math.floor(time)}s)...`);

        video.currentTime = time;

        // Reliable seeking mechanism for streaming video
        const seekPromise = new Promise<void>((resolve) => {
            const handler = () => {
                video.removeEventListener('seeked', handler);
                resolve();
            };
            // Check if we are already close enough (unlikely but safe)
            if (Math.abs(video.currentTime - time) < 0.5) {
                resolve();
            } else {
                video.addEventListener('seeked', handler);
            }
        });
        
        // Trigger seek
        video.currentTime = time;
        
        // Wait for seek to complete (with timeout safety)
        await Promise.race([
            seekPromise,
            new Promise(r => setTimeout(r, 2000)) // 2s timeout fallback
        ]);
        
        // Small buffer to ensure frame is actually rendered on canvas
        await new Promise(r => setTimeout(r, 400)); 

        const blob = await captureFrame();
        if (blob) {
          frames.push({ timestamp: time, blob });
        }
      }

      if (frames.length === 0) {
        throw new Error("No frames could be captured.");
      }

      setAnalysisProgress('Sending frames to Gemini for viral analysis...');
      const baseContext = videoState.sourceType === 'backend-stream' ? "A viral YouTube video (Downloaded)" : (videoState.file?.name || "Unknown video");
      const contextText = `${baseContext}. The user is creating content with a target aspect ratio of ${aspectRatio}. Identify clips where the main action remains visible and effective in this format.`;
      
      const clips = await analyzeVideoSegments(frames, contextText);
      setViralClips(clips);

    } catch (error) {
       console.error("Scan failed", error);
       alert(`Scan failed. ${(error as Error).message}`);
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress('');
    }
  };

  // --- VIEWS ---

  const LibraryView = () => (
    <div className="flex-1 p-8 bg-slate-950 overflow-y-auto">
      <h2 className="text-3xl font-bold mb-6 text-white">Project Library</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* New Project Card */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="bg-slate-900/50 border-2 border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center min-h-[250px] hover:border-purple-500 hover:bg-slate-900 transition-all cursor-pointer text-slate-500 hover:text-purple-400 group"
        >
          <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <i className="fa-solid fa-plus text-2xl"></i>
          </div>
          <span className="font-medium">New Project</span>
          <span className="text-xs mt-2">Upload or Import</span>
        </div>

        {/* Mock Project 1 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all cursor-pointer group" onClick={() => setActiveView('editor')}>
          <div className="h-40 bg-slate-800 flex items-center justify-center relative">
            <i className="fa-solid fa-play-circle text-4xl text-slate-600 group-hover:text-purple-500 transition-colors"></i>
            <span className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 text-xs rounded text-white font-mono">12:40</span>
          </div>
          <div className="p-4">
            <h3 className="font-bold text-lg mb-1 text-white">Podcast Interview #1</h3>
            <p className="text-slate-400 text-sm mb-3">Edited 2 hours ago</p>
            <div className="flex gap-2">
              <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 text-xs rounded border border-purple-500/20">5 Viral Clips</span>
              <span className="px-2 py-0.5 bg-slate-800 text-slate-400 text-xs rounded border border-slate-700">9:16</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const SettingsView = () => (
    <div className="flex-1 p-8 bg-slate-950 overflow-y-auto">
       <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-white">Settings</h2>
        
        <div className="space-y-8">
          
          {/* Backend Connection Settings */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <i className="fa-solid fa-server text-6xl text-slate-500"></i>
             </div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white relative z-10">
              <i className="fa-solid fa-link text-blue-500"></i> Backend Connection
            </h3>
            <div className="space-y-4 relative z-10">
               <div>
                 <p className="text-sm text-slate-400 mb-2">
                   Configure your AdonisJS backend URL here. Used for streaming videos and processing clips.
                   <br/> <span className="text-xs text-slate-500">(Supports Ngrok, VPS IP, or localhost)</span>
                 </p>
                 <div className="flex gap-2">
                   <input 
                      type="text" 
                      placeholder="https://..."
                      value={backendUrl}
                      onChange={(e) => updateBackendUrl(e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-mono"
                   />
                   <button 
                      onClick={handleTestConnection}
                      disabled={isTestingConnection}
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                   >
                     {isTestingConnection ? (
                        <i className="fa-solid fa-circle-notch animate-spin"></i>
                     ) : (
                        <i className="fa-solid fa-plug"></i>
                     )}
                     Test
                   </button>
                 </div>
                 
                 <div className="mt-3 text-xs text-slate-500 bg-slate-950/50 p-3 rounded border border-slate-800">
                    <i className="fa-solid fa-circle-info text-blue-400 mr-2"></i>
                    <strong>Ngrok Users:</strong> If connection fails or video doesn't play, <a href={backendUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">Click here to open Backend URL</a> in a new tab and click "Visit Site" to bypass the browser warning.
                 </div>

                 {/* Connection Status Indicator */}
                 {connectionStatus && (
                    <div className={`mt-3 p-3 rounded-lg border flex items-center gap-3 text-sm ${connectionStatus.success ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                        {connectionStatus.success ? (
                            <i className="fa-solid fa-check-circle text-lg"></i>
                        ) : (
                            <i className="fa-solid fa-triangle-exclamation text-lg"></i>
                        )}
                        <span>{connectionStatus.message}</span>
                    </div>
                 )}
               </div>
            </div>
          </div>

          {/* General Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white">
              <i className="fa-solid fa-sliders text-purple-500"></i> General
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                 <div>
                   <p className="font-medium text-slate-200">Theme</p>
                   <p className="text-sm text-slate-400">Choose your interface appearance</p>
                 </div>
                 <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
                    <button className="px-3 py-1 bg-slate-700 rounded shadow text-sm text-white">Dark</button>
                    <button className="px-3 py-1 text-slate-400 text-sm hover:text-white">Light</button>
                 </div>
              </div>
            </div>
          </div>

          {/* AI Configuration */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white">
              <i className="fa-solid fa-wand-magic-sparkles text-pink-500"></i> AI Configuration
            </h3>
            <div className="space-y-4">
               <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                 <div>
                   <p className="font-medium text-slate-200">Default Model</p>
                   <p className="text-sm text-slate-400">Gemini 2.5 Flash is recommended for speed</p>
                 </div>
                 <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded border border-purple-500/30">Gemini 2.5 Flash</span>
               </div>
            </div>
          </div>
        </div>
       </div>
    </div>
  );

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-100 overflow-hidden">
      
      {/* Sidebar - Navigation */}
      <div className="w-16 bg-slate-900 border-r border-slate-700 flex flex-col items-center py-6 space-y-8 z-20">
        <div className="text-purple-500 text-2xl font-bold cursor-pointer" onClick={() => setActiveView('editor')}>
           <i className="fa-brands fa-google"></i>
        </div>
        <div className="flex flex-col space-y-6 w-full">
          <button 
            onClick={() => setActiveView('editor')}
            className={`w-full p-3 transition-colors relative ${activeView === 'editor' ? 'text-purple-400 bg-slate-800/50' : 'text-slate-500 hover:text-slate-300'}`}
          >
            {activeView === 'editor' && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-purple-500"></div>}
            <i className="fa-solid fa-scissors text-xl"></i>
          </button>
          
          <button 
            onClick={() => setActiveView('library')}
            className={`w-full p-3 transition-colors relative ${activeView === 'library' ? 'text-purple-400 bg-slate-800/50' : 'text-slate-500 hover:text-slate-300'}`}
          >
            {activeView === 'library' && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-purple-500"></div>}
            <i className="fa-solid fa-layer-group text-xl"></i>
          </button>
          
          <button 
            onClick={() => setActiveView('settings')}
            className={`w-full p-3 transition-colors relative ${activeView === 'settings' ? 'text-purple-400 bg-slate-800/50' : 'text-slate-500 hover:text-slate-300'}`}
          >
            {activeView === 'settings' && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-purple-500"></div>}
            <i className="fa-solid fa-gear text-xl"></i>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        
        {activeView === 'library' && <LibraryView />}
        {activeView === 'settings' && <SettingsView />}
        
        {/* Editor View */}
        {activeView === 'editor' && (
          <>
            {/* Header */}
            <header className="h-16 bg-slate-900/50 border-b border-slate-800 flex items-center justify-between px-6 backdrop-blur-sm">
              <div className="flex items-center space-x-4">
                <h1 className="text-lg font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent hidden md:block">
                  ClipGenius
                </h1>
                
                {/* YouTube Input Area */}
                <div className="flex items-center bg-slate-800 rounded-lg border border-slate-700 overflow-hidden ml-4">
                  <div className="pl-3 text-red-500">
                    <i className="fa-brands fa-youtube"></i>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Paste YouTube Link..." 
                    className="bg-transparent border-none text-xs text-white px-3 py-2 w-48 md:w-64 focus:outline-none placeholder-slate-500"
                    value={youtubeLink}
                    onChange={(e) => setYoutubeLink(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleYouTubeImport()}
                  />
                  <button 
                    onClick={handleYouTubeImport}
                    disabled={isImporting || !youtubeLink}
                    className="bg-slate-700 hover:bg-slate-600 px-3 py-2 text-xs font-medium transition-colors disabled:opacity-50 border-l border-slate-600 flex items-center gap-2"
                  >
                    {isImporting ? <i className="fa-solid fa-spinner animate-spin"></i> : 'Import'}
                  </button>
                </div>
                {/* Import Status Message */}
                {isImporting && <span className="text-xs text-slate-400 animate-pulse">{importStatus}</span>}
              </div>
              
              <div className="flex items-center space-x-3">
                <input 
                    type="file" 
                    ref={fileInputRef}
                    accept="video/*" 
                    onChange={handleFileUpload} 
                    className="hidden" 
                  />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded text-sm font-medium transition-colors shadow-lg shadow-purple-900/30 flex items-center gap-2"
                >
                  <i className="fa-solid fa-upload"></i>
                  Upload File
                </button>
                <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-sm font-medium border border-slate-600 transition-colors">
                  Export
                </button>
              </div>
            </header>

            {/* Viewport Area */}
            <div className="flex-1 flex overflow-hidden">
              
              {/* Video Stage */}
              <div className="flex-1 flex flex-col relative bg-black">
                
                {/* Toolbar */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-slate-900/90 backdrop-blur border border-slate-700 rounded-full px-4 py-2 flex items-center space-x-4 shadow-xl">
                  <button 
                    onClick={() => setAspectRatio(AspectRatio.LANDSCAPE)}
                    className={`text-xs font-medium px-3 py-1 rounded-full transition-colors ${aspectRatio === AspectRatio.LANDSCAPE ? 'bg-purple-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                  >
                    <i className="fa-solid fa-panorama mr-1"></i> Original
                  </button>
                  <button 
                    onClick={() => setAspectRatio(AspectRatio.PORTRAIT)}
                    className={`text-xs font-medium px-3 py-1 rounded-full transition-colors ${aspectRatio === AspectRatio.PORTRAIT ? 'bg-purple-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                  >
                    <i className="fa-solid fa-mobile-screen mr-1"></i> Shorts (9:16)
                  </button>
                </div>

                {/* Main Player */}
                <div className="flex-1 overflow-hidden">
                  <VideoPlayer 
                    src={videoState.url || ''} 
                    thumbnail={videoState.thumbnail || ''}
                    videoRef={videoRef}
                    isPlaying={videoState.isPlaying}
                    currentTime={videoState.currentTime}
                    duration={videoState.duration}
                    onTimeUpdate={handleTimeUpdate}
                    onDurationChange={handleDurationChange}
                    aspectRatio={aspectRatio}
                    downloadStatus={isImporting ? importStatus : undefined}
                  />
                </div>

                {/* Playback Controls Overlay (Center) */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center space-x-6">
                    <button 
                      onClick={() => handleSeek(Math.max(0, videoState.currentTime - 5))}
                      className="text-white/70 hover:text-white transition-colors"
                      disabled={!videoState.url && !videoState.thumbnail}
                    >
                      <i className="fa-solid fa-rotate-left text-xl"></i>
                    </button>
                    
                    <button 
                      onClick={handlePlayPause}
                      className={`w-14 h-14 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-white/20 ${!videoState.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={!videoState.url}
                    >
                      {videoState.isPlaying ? (
                        <i className="fa-solid fa-pause text-xl"></i>
                      ) : (
                        <i className="fa-solid fa-play text-xl ml-1"></i>
                      )}
                    </button>

                    <button 
                      onClick={() => handleSeek(Math.min(videoState.duration, videoState.currentTime + 5))}
                      className="text-white/70 hover:text-white transition-colors"
                      disabled={!videoState.url && !videoState.thumbnail}
                    >
                      <i className="fa-solid fa-rotate-right text-xl"></i>
                    </button>
                </div>

              </div>

              {/* AI Sidebar */}
              <AnalysisSidebar 
                analysis={analysis}
                viralClips={viralClips} 
                isAnalyzing={isAnalyzing} 
                analysisProgress={analysisProgress}
                onAnalyzeFrame={runFrameAnalysis}
                onScanVideo={scanVideo}
                hasVideo={!!videoState.url || !!videoState.thumbnail}
                onPlayClip={handlePlayClip}
                onExportClip={handleExportClip}
                currentTime={videoState.currentTime}
                duration={videoState.duration}
                isYouTube={videoState.sourceType === 'youtube'}
              />

            </div>

            {/* Timeline Editor */}
            <div className="h-32 bg-slate-900 border-t border-slate-800 z-20">
              <Timeline 
                duration={videoState.duration}
                currentTime={videoState.currentTime}
                onSeek={handleSeek}
                clips={viralClips}
              />
            </div>
          </>
        )}

      </div>
    </div>
  );
}