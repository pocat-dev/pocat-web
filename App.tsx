
import React, { useState, useRef, useEffect } from 'react';
import { VideoPlayer } from './components/VideoPlayer';
import { Timeline } from './components/Timeline';
import { AnalysisSidebar } from './components/AnalysisSidebar';
import { VideoState, AIAnalysisResult, AspectRatio, ViralClip } from './types';
import { analyzeFrame, analyzeVideoSegments } from './services/gemini';
import { VideoFrameProcessor } from './services/gpuProcessor';
import { renderClip, checkClipStatus, testBackendConnection, createProject, getProjectDownloadStatus, batchProcessClips } from './services/backend';

type ViewType = 'editor' | 'library' | 'settings';
const DEFAULT_BACKEND_URL = 'https://nonimitating-corie-extemporary.ngrok-free.dev';

export default function App() {
  const [activeView, setActiveView] = useState<ViewType>('editor');
  const [analysisTab, setAnalysisTab] = useState<'clips' | 'frame' | 'custom'>('clips');
  const [backendUrl, setBackendUrl] = useState(() => localStorage.getItem('backend_url') || DEFAULT_BACKEND_URL);
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
  
  const [youtubeLink, setYoutubeLink] = useState('');
  const [downloadQuality, setDownloadQuality] = useState('720p');
  const [downloaderMethod, setDownloaderMethod] = useState('auto');
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState('');
  const [loadingTitle, setLoadingTitle] = useState('Downloading & Processing');

  const [projects, setProjects] = useState([
    { id: 1, title: "Podcast Interview #1", edited: "2 hours ago", duration: "12:40", clips: 5, ratio: "9:16" },
    { id: 2, title: "Product Launch Event", edited: "1 day ago", duration: "45:10", clips: 12, ratio: "9:16" },
    { id: 3, title: "Gaming Stream Highlights", edited: "3 days ago", duration: "08:15", clips: 3, ratio: "16:9" }
  ]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const gpuProcessorRef = useRef<VideoFrameProcessor | null>(null);

  useEffect(() => {
    gpuProcessorRef.current = new VideoFrameProcessor();
    return () => gpuProcessorRef.current?.destroy();
  }, []);

  useEffect(() => {
    return () => { if (videoState.url && !videoState.url.startsWith('http')) URL.revokeObjectURL(videoState.url); };
  }, [videoState.url]);

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    setConnectionStatus(null);
    try {
      const result = await testBackendConnection(backendUrl);
      setConnectionStatus(result);
    } catch (e) {
      setConnectionStatus({ success: false, message: (e as Error).message });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleYouTubeImport = async () => {
    if (!youtubeLink.trim()) return;

    setIsImporting(true);
    setLoadingTitle("Pocat.io Smart Import");
    setImportStatus(`Initializing project...`);
    
    try {
        const title = "Project " + new Date().toLocaleTimeString();
        const createRes = await createProject(backendUrl, youtubeLink, title, downloadQuality, downloaderMethod);
        
        if (!createRes.success) throw new Error(createRes.message);

        const { projectId, videoInfo } = createRes.data;
        const durationVal = typeof videoInfo.duration === 'string' ? parseInt(videoInfo.duration) : videoInfo.duration;
        
        setVideoState({
            file: null,
            url: null,
            thumbnail: videoInfo.thumbnail,
            duration: durationVal,
            currentTime: 0,
            isPlaying: false,
            sourceType: 'youtube',
            projectId: projectId
        });
        
        setAnalysis(null);
        setViralClips([]);
        setActiveView('editor');

        const pollInterval = setInterval(async () => {
            try {
                const statusRes = await getProjectDownloadStatus(backendUrl, projectId);
                
                // DEFENSIVE: Ensure statusRes.data exists
                if (!statusRes || !statusRes.data) {
                    console.warn("Polling returned empty data");
                    return;
                }

                // FIX: Remove '= {}' default value which was causing TypeScript to infer 'video' as an empty object type.
                const { readyForEditing, status = 'unknown', progress = 0, video } = statusRes.data;

                if (statusRes.success && readyForEditing) {
                    clearInterval(pollInterval);
                    setImportStatus('');
                    setIsImporting(false);
                    
                    const cleanBaseUrl = backendUrl.replace(/\/$/, '');
                    const streamUrl = `${cleanBaseUrl}/v2/projects/${projectId}/stream`;
                    
                    setVideoState(prev => ({
                        ...prev,
                        sourceType: 'backend-stream',
                        url: streamUrl,
                        isPlaying: true
                    }));
                    
                    // FIX: video is correctly typed now, source property is accessible.
                    const sourceText = video?.source === 'cached' ? " (Instant Access from Cache)" : "";
                    alert(`✅ Video Ready${sourceText}! You can now start clipping.`);
                    
                } else if (statusRes.success) {
                     // FIX: video is correctly typed now, source property is accessible.
                     const videoSource = video?.source || 'unknown';
                     const sourceLabel = videoSource === 'shared' ? ' [Shared DL]' : '';
                     
                     // FIX: Use safe status string for toUpperCase()
                     const displayStatus = (status || 'processing').toString().toUpperCase();
                     setImportStatus(`${displayStatus}${sourceLabel}: ${progress}%`);
                     
                     if (status === 'failed') {
                         clearInterval(pollInterval);
                         setImportStatus('Download Failed');
                         alert("Server Error: Video download failed.");
                         setIsImporting(false);
                     }
                }
            } catch (e) {
                console.warn("Polling error:", e);
                // Safety: if error persists, you might want to stop the interval
            }
        }, 3000);

    } catch (error) {
        setImportStatus('Import failed');
        alert(`Failed to import video: ${(error as Error).message}`);
        setIsImporting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAnalysis(null);
      setViralClips([]);
      setActiveView('editor'); 
      setIsImporting(true);
      setLoadingTitle("Preparing Video");
      
      let progress = 0;
      const interval = setInterval(() => {
         progress += 20;
         setImportStatus(`Processing: ${Math.min(progress, 100)}%`);
         if (progress >= 100) {
             clearInterval(interval);
             setTimeout(() => {
                const url = URL.createObjectURL(file);
                setVideoState({ file, url, thumbnail: null, duration: 0, currentTime: 0, isPlaying: false, sourceType: 'local' });
                setIsImporting(false);
             }, 300);
         }
      }, 100);
      e.target.value = '';
    }
  };

  const handleSeek = (time: number) => {
    if (videoRef.current) videoRef.current.currentTime = time;
    setVideoState(prev => ({ ...prev, currentTime: time }));
  };

  const handlePlayClip = (timeStr: string) => {
    const [min, sec] = timeStr.split(':').map(Number);
    if (!isNaN(min) && !isNaN(sec)) {
      handleSeek(min * 60 + sec);
      if (videoState.url) setVideoState(prev => ({ ...prev, isPlaying: true }));
      setActiveView('editor');
    }
  };

  const handleExportClip = async (clip: ViralClip) => {
    if (!videoState.url && !youtubeLink) return;
    
    const parseTime = (t: string) => {
      const [m, s] = t.split(':').map(Number);
      return m * 60 + s;
    };

    if (videoState.projectId) {
      try {
          const processRes = await batchProcessClips(backendUrl, videoState.projectId, [{
              title: clip.title,
              startTime: parseTime(clip.start),
              endTime: parseTime(clip.end),
              aspectRatio: aspectRatio
          }]);
          
          if (processRes.success) {
             alert(`✅ Processing started! Check the Library in a few minutes.`);
          } else throw new Error(processRes.message);
      } catch(e) {
          alert("Processing error: " + (e as Error).message);
      }
      return;
    }

    // Demo Mode Flow
    try {
      const initResponse = await renderClip(backendUrl, {
        videoUrl: youtubeLink,
        startTime: parseTime(clip.start),
        endTime: parseTime(clip.end),
        aspectRatio
      });
      
      if (!initResponse.success) throw new Error(initResponse.message);

      const pollInterval = setInterval(async () => {
          const statusRes = await checkClipStatus(backendUrl, initResponse.data.clipId);
          if (statusRes.success && statusRes.data.status === 'completed') {
            clearInterval(pollInterval);
            window.open(statusRes.data.downloadUrl, '_blank');
          } else if (statusRes.data.status === 'failed') {
            clearInterval(pollInterval);
            alert("Render failed on server.");
          }
      }, 3000);
    } catch (e) {
      alert("Export failed: " + (e as Error).message);
    }
  };

  const runFrameAnalysis = async () => {
    if (videoState.sourceType === 'youtube') {
       alert("AI Analysis requires the video to finish downloading.");
       return;
    }
    setVideoState(prev => ({ ...prev, isPlaying: false }));
    setIsAnalyzing(true);
    setAnalysisProgress('Capturing current frame...');
    try {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current?.videoWidth || 1280;
      canvas.height = videoRef.current?.videoHeight || 720;
      canvas.getContext('2d')?.drawImage(videoRef.current!, 0, 0);
      canvas.toBlob(async (blob) => {
        if (blob) {
          const res = await analyzeFrame(blob, `Target: ${aspectRatio}`);
          setAnalysis(res);
          setIsAnalyzing(false);
        }
      }, 'image/jpeg');
    } catch (e) {
      setIsAnalyzing(false);
    }
  };

  const scanVideo = async () => {
    if (videoState.sourceType === 'youtube') {
       alert("Auto-Detect requires the video to finish downloading.");
       return;
    }
    setIsAnalyzing(true);
    setAnalysisProgress('Scanning for viral segments...');
    // Simulated frame capturing for analysis
    setTimeout(async () => {
       const frames = [{ timestamp: 10, blob: new Blob() }]; // Dummy
       const clips = await analyzeVideoSegments(frames, "Finding highlights");
       setViralClips(clips);
       setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-100 overflow-hidden">
      <div className="w-16 bg-slate-900 border-r border-slate-700 flex flex-col items-center py-6 space-y-8 z-20">
        <div className="text-purple-500 text-2xl font-bold cursor-pointer" onClick={() => setActiveView('editor')}><i className="fa-brands fa-google"></i></div>
        <button onClick={() => setActiveView('editor')} className={`w-full p-3 transition-colors ${activeView === 'editor' ? 'text-purple-400 bg-slate-800/50' : 'text-slate-500 hover:text-slate-300'}`}><i className="fa-solid fa-scissors text-xl"></i></button>
        <button onClick={() => setActiveView('library')} className={`w-full p-3 transition-colors ${activeView === 'library' ? 'text-purple-400 bg-slate-800/50' : 'text-slate-500 hover:text-slate-300'}`}><i className="fa-solid fa-layer-group text-xl"></i></button>
        <button onClick={() => setActiveView('settings')} className={`w-full p-3 transition-colors ${activeView === 'settings' ? 'text-purple-400 bg-slate-800/50' : 'text-slate-500 hover:text-slate-300'}`}><i className="fa-solid fa-gear text-xl"></i></button>
      </div>

      <div className="flex-1 flex flex-col h-full min-w-0">
        {activeView === 'library' && (
           <div className="flex-1 p-8 bg-slate-950 overflow-y-auto">
             <h2 className="text-3xl font-bold mb-6">Project Library</h2>
             <div className="grid grid-cols-3 gap-6">
                <div onClick={() => fileInputRef.current?.click()} className="bg-slate-900/50 border-2 border-dashed border-slate-800 rounded-xl h-64 flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 transition-all text-slate-500">
                   <i className="fa-solid fa-plus text-3xl mb-2"></i><span>New Project</span>
                </div>
                {projects.map(p => (
                   <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-purple-500 transition-all cursor-pointer">
                      <div className="h-40 bg-slate-800 flex items-center justify-center"><i className="fa-solid fa-play-circle text-4xl text-slate-600"></i></div>
                      <div className="p-4"><h3 className="font-bold">{p.title}</h3><p className="text-slate-400 text-sm">{p.duration} • {p.clips} clips</p></div>
                   </div>
                ))}
             </div>
           </div>
        )}
        
        {activeView === 'settings' && (
           <div className="flex-1 p-8 bg-slate-950">
              <div className="max-w-2xl mx-auto space-y-8">
                <h2 className="text-3xl font-bold">Settings</h2>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                   <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><i className="fa-solid fa-link text-blue-500"></i> Backend Connection</h3>
                   <div className="flex gap-2">
                      <input type="text" value={backendUrl} onChange={(e) => {setBackendUrl(e.target.value); localStorage.setItem('backend_url', e.target.value);}} className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white font-mono" />
                      <button onClick={handleTestConnection} disabled={isTestingConnection} className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg disabled:opacity-50">{isTestingConnection ? <i className="fa-solid fa-circle-notch animate-spin"></i> : "Test"}</button>
                   </div>
                   {connectionStatus && <div className={`mt-3 p-3 rounded-lg border flex items-center gap-3 ${connectionStatus.success ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}><span>{connectionStatus.message}</span></div>}
                </div>
              </div>
           </div>
        )}

        {activeView === 'editor' && (
          <>
            <header className="h-16 bg-slate-900/50 border-b border-slate-800 flex items-center justify-between px-6 backdrop-blur-sm">
              <div className="flex items-center space-x-4">
                <h1 className="text-lg font-bold">ClipGenius</h1>
                <div className="flex items-center bg-slate-800 rounded-lg border border-slate-700 overflow-hidden ml-4">
                  <div className="pl-3 text-red-500"><i className="fa-brands fa-youtube"></i></div>
                  <input type="text" placeholder="Paste YouTube Link..." className="bg-transparent text-xs text-white px-3 py-2 w-64 focus:outline-none" value={youtubeLink} onChange={(e) => setYoutubeLink(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleYouTubeImport()} />
                  <button onClick={handleYouTubeImport} disabled={isImporting || !youtubeLink} className="bg-slate-700 hover:bg-slate-600 px-3 py-2 text-xs font-medium transition-colors border-l border-slate-600">Import</button>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <input type="file" ref={fileInputRef} accept="video/*" onChange={handleFileUpload} className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded text-sm font-medium transition-colors">Upload File</button>
              </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
              <div className="flex-1 flex flex-col relative bg-black">
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-slate-900/90 border border-slate-700 rounded-full px-4 py-2 flex items-center space-x-4 shadow-xl">
                  <button onClick={() => setAspectRatio(AspectRatio.LANDSCAPE)} className={`text-xs px-3 py-1 rounded-full ${aspectRatio === AspectRatio.LANDSCAPE ? 'bg-purple-600 text-white' : 'text-slate-400'}`}>Original</button>
                  <button onClick={() => setAspectRatio(AspectRatio.PORTRAIT)} className={`text-xs px-3 py-1 rounded-full ${aspectRatio === AspectRatio.PORTRAIT ? 'bg-purple-600 text-white' : 'text-slate-400'}`}>Shorts (9:16)</button>
                </div>
                <div className="flex-1 overflow-hidden">
                  <VideoPlayer src={videoState.url || ''} thumbnail={videoState.thumbnail || ''} videoRef={videoRef} isPlaying={videoState.isPlaying} currentTime={videoState.currentTime} duration={videoState.duration} onTimeUpdate={(t) => setVideoState(p => ({...p, currentTime: t}))} onDurationChange={(d) => setVideoState(p => ({...p, duration: d}))} aspectRatio={aspectRatio} downloadStatus={isImporting ? importStatus : undefined} loadingTitle={loadingTitle} onManualExport={() => setAnalysisTab('custom')} onQuickExport={async (s,e) => {}} />
                </div>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center space-x-6">
                    <button onClick={() => handleSeek(Math.max(0, videoState.currentTime - 5))} className="text-white/70 hover:text-white"><i className="fa-solid fa-rotate-left text-xl"></i></button>
                    <button onClick={() => setVideoState(p => ({...p, isPlaying: !p.isPlaying}))} className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform">{videoState.isPlaying ? <i className="fa-solid fa-pause text-xl"></i> : <i className="fa-solid fa-play text-xl ml-1"></i>}</button>
                    <button onClick={() => handleSeek(Math.min(videoState.duration, videoState.currentTime + 5))} className="text-white/70 hover:text-white"><i className="fa-solid fa-rotate-right text-xl"></i></button>
                </div>
              </div>
              <AnalysisSidebar analysis={analysis} viralClips={viralClips} isAnalyzing={isAnalyzing} analysisProgress={analysisProgress} onAnalyzeFrame={runFrameAnalysis} onScanVideo={scanVideo} hasVideo={!!videoState.url || !!videoState.thumbnail} onPlayClip={handlePlayClip} onExportClip={handleExportClip} currentTime={videoState.currentTime} duration={videoState.duration} isYouTube={videoState.sourceType === 'youtube'} activeTab={analysisTab} onTabChange={setAnalysisTab} />
            </div>

            <div className="h-32 bg-slate-900 border-t border-slate-800 z-20">
              <Timeline duration={videoState.duration} currentTime={videoState.currentTime} onSeek={handleSeek} clips={viralClips} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
