import React, { useState, useEffect } from 'react';
import { AIAnalysisResult, ViralClip } from '../types';

interface AnalysisSidebarProps {
  analysis: AIAnalysisResult | null;
  viralClips: ViralClip[];
  isAnalyzing: boolean;
  analysisProgress: string;
  onAnalyzeFrame: () => void;
  onScanVideo: () => void;
  hasVideo: boolean;
  onPlayClip: (startStr: string) => void;
  onExportClip: (clip: ViralClip) => void;
  currentTime: number;
  duration: number;
  isYouTube: boolean;
  activeTab: 'clips' | 'frame' | 'custom';
  onTabChange: (tab: 'clips' | 'frame' | 'custom') => void;
}

export const AnalysisSidebar: React.FC<AnalysisSidebarProps> = ({ 
  analysis, 
  viralClips,
  isAnalyzing, 
  analysisProgress,
  onAnalyzeFrame,
  onScanVideo,
  hasVideo,
  onPlayClip,
  onExportClip,
  currentTime,
  duration,
  isYouTube,
  activeTab,
  onTabChange
}) => {
  const [exportingId, setExportingId] = useState<string | null>(null);
  
  // Custom clip state
  const [customStart, setCustomStart] = useState<number>(0);
  const [customEnd, setCustomEnd] = useState<number>(15);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleExportClick = async (clip: ViralClip) => {
    setExportingId(clip.id);
    await onExportClip(clip);
    setExportingId(null);
  };

  const handleCustomExport = async () => {
    if (customEnd <= customStart) {
      alert("End time must be greater than start time");
      return;
    }
    const customClip: ViralClip = {
      id: `custom_${Date.now()}`,
      title: "Custom Clip Export",
      start: formatTime(customStart),
      end: formatTime(customEnd),
      viralScore: 0,
      description: "Manually selected clip",
      reasoning: "User Selection",
    };
    await handleExportClick(customClip);
  };

  return (
    <div className="w-full md:w-96 bg-slate-900 border-l border-slate-700 flex flex-col h-full overflow-hidden">
      
      {/* Sidebar Header */}
      <div className="p-6 border-b border-slate-700 bg-slate-900/50">
        <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
          <i className="fa-solid fa-wand-magic-sparkles mr-2"></i>
          AI Studio
        </h2>
        
        {/* Tabs */}
        <div className="flex bg-slate-800 p-1 rounded-lg">
          <button 
            onClick={() => onTabChange('clips')}
            className={`flex-1 py-2 text-xs font-medium rounded-md transition-all ${activeTab === 'clips' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Viral Clips
          </button>
          <button 
            onClick={() => onTabChange('custom')}
            className={`flex-1 py-2 text-xs font-medium rounded-md transition-all ${activeTab === 'custom' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Manual
          </button>
          <button 
            onClick={() => onTabChange('frame')}
            className={`flex-1 py-2 text-xs font-medium rounded-md transition-all ${activeTab === 'frame' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
          >
            AI Frame
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {!hasVideo ? (
           <div className="flex flex-col items-center justify-center h-full text-slate-500 p-6 text-center">
             <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <i className="fa-solid fa-video text-2xl"></i>
             </div>
             <p>Import a YouTube video or upload a file to start analyzing.</p>
           </div>
        ) : isAnalyzing ? (
          <div className="flex flex-col items-center justify-center h-full space-y-6 p-6">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <i className="fa-solid fa-brain text-purple-500 animate-pulse"></i>
              </div>
            </div>
            <div className="text-center">
               <p className="text-white font-medium mb-1">Analyzing Video Content...</p>
               <p className="text-xs text-purple-300 font-mono mt-2 animate-pulse">
                 {analysisProgress || "Gemini is watching your video to find viral moments."}
               </p>
            </div>
          </div>
        ) : activeTab === 'clips' ? (
          <div className="p-4 space-y-4">
            {isYouTube ? (
              <div className="text-center py-10 px-6 animate-fade-in">
                <div className="mb-4 text-yellow-500 bg-yellow-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto border border-yellow-500/20">
                  <i className="fa-brands fa-youtube text-3xl"></i>
                </div>
                <h3 className="text-slate-200 font-bold mb-2">YouTube Mode Active</h3>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                  Direct AI scanning is not available for streamed YouTube videos due to browser restrictions.
                </p>
                <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 text-left">
                  <p className="text-[10px] text-slate-300 mb-3 font-bold uppercase tracking-wider">How to create clips:</p>
                  <ul className="text-xs text-slate-400 space-y-3">
                    <li className="flex gap-3 items-start">
                      <i className="fa-solid fa-hand-pointer text-purple-400 mt-0.5"></i>
                      <span>Switch to the <b>Manual</b> tab above.</span>
                    </li>
                    <li className="flex gap-3 items-start">
                      <i className="fa-solid fa-clock text-purple-400 mt-0.5"></i>
                      <span>Input Start & End times.</span>
                    </li>
                    <li className="flex gap-3 items-start">
                      <i className="fa-solid fa-download text-purple-400 mt-0.5"></i>
                      <span>Click <b>Export Clip</b> to download.</span>
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => onTabChange('custom')}
                  className="mt-6 w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-medium transition-colors"
                >
                  Go to Manual Selection
                </button>
              </div>
            ) : viralClips.length === 0 ? (
              <div className="text-center py-10">
                <div className="mb-4 text-slate-600">
                  <i className="fa-solid fa-scissors text-4xl"></i>
                </div>
                <h3 className="text-slate-300 font-medium mb-2">No clips generated yet</h3>
                <p className="text-xs text-slate-500 mb-6 px-4">
                  Let AI scan your entire video to automatically identify the most engaging segments for Shorts/TikTok.
                </p>
                <button
                  onClick={onScanVideo}
                  className="py-2.5 px-6 bg-purple-600 hover:bg-purple-500 text-white rounded-full font-medium shadow-lg shadow-purple-900/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center mx-auto gap-2"
                >
                  <i className="fa-solid fa-bolt"></i>
                  Auto-Detect Clips
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center px-2 mb-2">
                   <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Detected Segments</span>
                   <button onClick={onScanVideo} className="text-xs text-purple-400 hover:text-purple-300">
                     <i className="fa-solid fa-rotate mr-1"></i> Re-scan
                   </button>
                </div>
                <div className="space-y-4">
                  {viralClips.map((clip) => (
                    <div key={clip.id} className="bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-purple-500/50 transition-colors group">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1 mr-2">
                          <h4 className="font-bold text-slate-100 text-sm leading-tight mb-1">{clip.title}</h4>
                          <div className="flex items-center text-xs text-slate-400 space-x-2 font-mono">
                             <span className="bg-slate-700/50 px-1.5 py-0.5 rounded text-slate-300">
                               {clip.start} - {clip.end}
                             </span>
                          </div>
                        </div>
                        <div className={`flex flex-col items-center justify-center w-10 h-10 rounded-lg font-bold text-sm border ${clip.viralScore > 80 ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'}`}>
                          <span>{clip.viralScore}</span>
                        </div>
                      </div>
                      
                      <p className="text-xs text-slate-400 mb-3 line-clamp-2">
                        {clip.reasoning}
                      </p>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => onPlayClip(clip.start)}
                          className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
                        >
                          <i className="fa-solid fa-play"></i>
                          Review
                        </button>
                        <button 
                          onClick={() => handleExportClick(clip)}
                          disabled={!!exportingId}
                          className={`flex-1 py-2 text-white text-xs font-medium rounded-lg flex items-center justify-center gap-2 transition-colors ${exportingId === clip.id ? 'bg-purple-600/50 cursor-wait' : 'bg-purple-600 hover:bg-purple-500'}`}
                        >
                          {exportingId === clip.id ? (
                            <i className="fa-solid fa-circle-notch animate-spin"></i>
                          ) : (
                            <i className="fa-solid fa-download"></i>
                          )}
                          {exportingId === clip.id ? 'Rendering...' : 'Export'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ) : activeTab === 'custom' ? (
          <div className="p-6 space-y-6">
            <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
               <h3 className="text-white font-bold mb-4 flex items-center">
                 <i className="fa-solid fa-sliders mr-2 text-purple-400"></i>
                 Manual Selection
               </h3>
               
               <div className="space-y-4">
                 <div>
                   <label className="text-xs text-slate-400 uppercase font-bold mb-1 block">Start Time (sec)</label>
                   <div className="flex gap-2">
                      <input 
                        type="number" 
                        value={customStart}
                        onChange={(e) => setCustomStart(Number(e.target.value))}
                        className="flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white font-mono text-sm"
                      />
                      <button 
                        onClick={() => setCustomStart(Math.floor(currentTime))}
                        className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded text-xs text-white"
                        title="Set to Current Time"
                      >
                        <i className="fa-solid fa-stopwatch"></i>
                      </button>
                   </div>
                   <div className="text-xs text-slate-500 mt-1 font-mono">{formatTime(customStart)}</div>
                 </div>

                 <div>
                   <label className="text-xs text-slate-400 uppercase font-bold mb-1 block">End Time (sec)</label>
                   <div className="flex gap-2">
                      <input 
                        type="number" 
                        value={customEnd}
                        onChange={(e) => setCustomEnd(Number(e.target.value))}
                        className="flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white font-mono text-sm"
                      />
                      <button 
                         onClick={() => setCustomEnd(Math.floor(currentTime))}
                         className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded text-xs text-white"
                         title="Set to Current Time"
                      >
                        <i className="fa-solid fa-stopwatch"></i>
                      </button>
                   </div>
                   <div className="text-xs text-slate-500 mt-1 font-mono">{formatTime(customEnd)}</div>
                 </div>

                 <div className="pt-2">
                   <div className="text-xs text-slate-400 mb-2 text-center">
                     Total Duration: <span className="text-white font-bold">{Math.max(0, customEnd - customStart)}s</span>
                   </div>
                   <button
                      onClick={handleCustomExport}
                      disabled={!!exportingId || customEnd <= customStart}
                      className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-bold shadow-lg shadow-purple-900/30 transition-all flex items-center justify-center gap-2"
                   >
                      {exportingId ? <i className="fa-solid fa-circle-notch animate-spin"></i> : <i className="fa-solid fa-file-export"></i>}
                      {exportingId ? 'Processing...' : 'Export Clip'}
                   </button>
                 </div>
               </div>
            </div>
            
            <div className="text-xs text-slate-500 text-center px-4">
               <i className="fa-solid fa-circle-info mr-1"></i>
               Use the timeline player to find the exact moments you want to clip.
            </div>
          </div>
        ) : (
          <div className="p-6">
             {isYouTube ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                   <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-600">
                      <i className="fa-solid fa-ban text-2xl"></i>
                   </div>
                   <p className="text-slate-400 text-sm font-medium">Frame Analysis Unavailable</p>
                   <p className="text-xs text-slate-500 mt-2 max-w-[200px]">
                      Single frame analysis is only available for uploaded files.
                   </p>
                </div>
             ) : !analysis ? (
              <div className="text-center py-8">
                <button
                  onClick={onAnalyzeFrame}
                  className="w-full py-3 px-4 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-camera"></i>
                  Analyze Current Frame
                </button>
                <p className="mt-4 text-xs text-slate-500">
                  Get instant feedback on the specific frame currently visible in the player.
                </p>
              </div>
            ) : (
              <div className="space-y-6 animate-fade-in">
                {/* Score */}
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-400 text-sm font-medium">Virality Score</span>
                    <span className={`text-lg font-bold ${analysis.viralScore > 70 ? 'text-green-400' : analysis.viralScore > 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {analysis.viralScore}/100
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${analysis.viralScore > 70 ? 'bg-green-500' : analysis.viralScore > 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${analysis.viralScore}%` }}
                    ></div>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-1 block">Suggested Title</label>
                  <div className="text-lg font-semibold text-white leading-tight">
                    "{analysis.title}"
                  </div>
                </div>

                {/* Reasoning */}
                <div>
                  <label className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-1 block">Why it works</label>
                  <p className="text-sm text-slate-300 leading-relaxed bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                    {analysis.reasoning}
                  </p>
                </div>

                {/* Hashtags */}
                <div>
                  <label className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-1 block">Hashtags</label>
                  <div className="flex flex-wrap gap-2">
                    {analysis.hashtags.map((tag, idx) => (
                      <span key={idx} className="text-xs bg-purple-900/50 text-purple-300 border border-purple-700/50 px-2 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={onAnalyzeFrame}
                  className="w-full py-2 px-4 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-sm transition-colors mt-4"
                >
                  Analyze Another Frame
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};