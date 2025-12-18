
import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { EditorView } from './components/EditorView';
import { LibraryView } from './components/LibraryView';
import { SettingsView } from './components/SettingsView';
import { VideoState, AIAnalysisResult, AspectRatio, ViralClip } from './types';
import { analyzeFrame, analyzeVideoSegments } from './services/gemini';
import { VideoFrameProcessor } from './services/gpuProcessor';
import { renderClip, checkClipStatus, testBackendConnection, createProject, getProjectDownloadStatus, batchProcessClips, listProjects } from './services/backend';

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

  const [projects, setProjects] = useState<any[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);

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

  // Load projects when component mounts or when switching to library view
  useEffect(() => {
    if (activeView === 'library') {
      loadProjects();
    }
  }, [activeView, backendUrl]);

  const loadProjects = async () => {
    setIsLoadingProjects(true);
    try {
      console.log('🔄 Loading projects from:', backendUrl);
      const response = await listProjects(backendUrl);
      console.log('📦 Projects response:', response);
      
      if (response.success && Array.isArray(response.data)) {
        console.log('✅ Projects loaded:', response.data.length);
        setProjects(response.data);
      } else {
        console.error('❌ Invalid projects response:', response);
        console.log('Response data type:', typeof response.data);
        console.log('Is array?', Array.isArray(response.data));
        setProjects([]); // Fallback to empty array
      }
    } catch (error) {
      console.error('💥 Failed to load projects:', error);
      setProjects([]); // Fallback to empty array
    } finally {
      setIsLoadingProjects(false);
    }
  };

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

                // Get actual status from API response
                const { readyForEditing, status, progress, video } = statusRes.data;
                const actualStatus = status || 'unknown';
                const actualProgress = progress || 0;

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
                     // Use actual status from API
                     const videoSource = video?.source || 'unknown';
                     const sourceLabel = videoSource === 'shared' ? ' [Shared DL]' : '';
                     
                     // Display actual status from API
                     const displayStatus = actualStatus.toString().toUpperCase();
                     setImportStatus(`${displayStatus}${sourceLabel}: ${actualProgress}%`);
                     
                     if (actualStatus === 'failed') {
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
    <div className="h-screen bg-slate-950 text-white flex">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      
      <div className="flex-1 flex flex-col">
        {activeView === 'library' && (
          <LibraryView 
            projects={projects}
            isLoadingProjects={isLoadingProjects}
            onRefresh={loadProjects}
            fileInputRef={fileInputRef}
          />
        )}
        
        {activeView === 'settings' && (
          <SettingsView 
            backendUrl={backendUrl}
            onBackendUrlChange={setBackendUrl}
            connectionStatus={connectionStatus}
            isTestingConnection={isTestingConnection}
            onTestConnection={handleTestConnection}
          />
        )}

        {activeView === 'editor' && (
          <EditorView 
            videoState={videoState}
            setVideoState={setVideoState}
            youtubeLink={youtubeLink}
            setYoutubeLink={setYoutubeLink}
            isImporting={isImporting}
            importStatus={importStatus}
            loadingTitle={loadingTitle}
            aspectRatio={aspectRatio}
            setAspectRatio={setAspectRatio}
            analysis={analysis}
            viralClips={viralClips}
            isAnalyzing={isAnalyzing}
            analysisProgress={analysisProgress}
            analysisTab={analysisTab}
            setAnalysisTab={setAnalysisTab}
            videoRef={videoRef}
            fileInputRef={fileInputRef}
            onYouTubeImport={handleYouTubeImport}
            onFileUpload={handleFileUpload}
            onSeek={handleSeek}
            onAnalyzeFrame={runFrameAnalysis}
            onScanVideo={scanVideo}
            onPlayClip={handlePlayClip}
            onExportClip={handleExportClip}
          />
        )}
      </div>
    </div>
  );
}
