import React, { useRef, useEffect, useState } from 'react';
import { AspectRatio } from '../types';

interface VideoPlayerProps {
  src: string;
  thumbnail?: string;
  onTimeUpdate: (time: number) => void;
  onDurationChange: (duration: number) => void;
  isPlaying: boolean;
  aspectRatio: AspectRatio;
  videoRef: React.RefObject<HTMLVideoElement>;
  currentTime: number;
  duration: number;
  downloadStatus?: string;
  onManualExport?: () => void;
  onQuickExport?: (start: number, end: number) => Promise<void>;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  src, 
  thumbnail,
  onTimeUpdate, 
  onDurationChange,
  isPlaying,
  aspectRatio,
  videoRef,
  currentTime,
  duration,
  downloadStatus,
  onManualExport,
  onQuickExport
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  // Quick Clip State
  const [showQuickClip, setShowQuickClip] = useState(false);
  const [quickStart, setQuickStart] = useState<number>(0);
  const [quickEnd, setQuickEnd] = useState<number>(15);
  const [isQuickExporting, setIsQuickExporting] = useState(false);

  // Crop/Framing State for 9:16
  const [cropPosition, setCropPosition] = useState(50); // 50% = Center
  const [showCropControls, setShowCropControls] = useState(false);

  useEffect(() => {
    setError(null);
  }, [src]);

  useEffect(() => {
    if (videoRef.current && !error && src) {
      if (isPlaying) {
        videoRef.current.play().catch(e => console.error("Play failed", e));
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, videoRef, error, src]);

  const handleError = () => {
     if (videoRef.current?.error) {
         setError(videoRef.current.error.message || "Failed to load video source.");
     } else {
         setError("Unknown video error occurred.");
     }
  };

  const handleQuickExportClick = async () => {
    if (!onQuickExport) return;
    setIsQuickExporting(true);
    try {
      await onQuickExport(quickStart, quickEnd);
      setShowQuickClip(false);
    } catch (e) {
      console.error("Quick export failed", e);
    } finally {
      setIsQuickExporting(false);
    }
  };

  const isPortrait = aspectRatio === AspectRatio.PORTRAIT;

  return (
    <div ref={containerRef} className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden group select-none">
      {!src ? (
        thumbnail ? (
           <div className="relative w-full h-full group">
              <img src={thumbnail} className="w-full h-full object-contain opacity-50 blur-sm" alt="Video Thumbnail" />
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                 <div className="bg-slate-900/95 p-8 rounded-2xl border border-slate-700 backdrop-blur-md text-center max-w-md shadow-2xl transform transition-all hover:scale-105">
                    {downloadStatus ? (
                        <>
                          <div className="w-20 h-20 relative mb-6 mx-auto">
                              <div className="absolute inset-0 rounded-full border-4 border-slate-700"></div>
                              <div className="absolute inset-0 rounded-full border-4 border-purple-500 border-t-transparent animate-spin"></div>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <i className="fa-solid fa-cloud-arrow-down text-3xl text-purple-400"></i>
                              </div>
                          </div>
                          <h3 className="text-white font-bold text-xl mb-3">Downloading & Processing</h3>
                          <p className="text-sm text-slate-400 leading-relaxed mb-6 px-4">
                             {downloadStatus}
                          </p>
                          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                             <div className="bg-gradient-to-r from-purple-600 to-pink-500 h-full rounded-full animate-pulse w-full"></div>
                          </div>
                        </>
                    ) : (
                        <>
                            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700">
                                <i className="fa-solid fa-eye-slash text-2xl text-slate-400"></i>
                            </div>
                            <h3 className="text-white font-bold text-xl mb-2">Preview Unavailable</h3>
                            <p className="text-sm text-slate-400 leading-relaxed mb-6">
                            External video preview is restricted. <br/>
                            <span className="text-purple-400 font-medium">Use the tools below to create clips blindly or wait for download.</span>
                            </p>
                            
                            <div className="flex flex-col gap-4">
                                <div className="flex gap-3 justify-center">
                                    <button 
                                        onClick={onManualExport}
                                        className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white text-sm font-bold rounded-xl shadow transition-all flex items-center gap-2"
                                    >
                                        <i className="fa-solid fa-sliders"></i>
                                        Manual Mode
                                    </button>
                                    <button 
                                        onClick={() => setShowQuickClip(!showQuickClip)}
                                        className={`px-5 py-2.5 text-white text-sm font-bold rounded-xl shadow transition-all flex items-center gap-2 ${showQuickClip ? 'bg-purple-700 ring-2 ring-purple-400' : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500'}`}
                                    >
                                        <i className={`fa-solid ${showQuickClip ? 'fa-times' : 'fa-scissors'}`}></i>
                                        {showQuickClip ? 'Cancel' : 'Quick Clip'}
                                    </button>
                                </div>

                                {showQuickClip && (
                                    <div className="mt-2 bg-slate-800/80 p-5 rounded-xl border border-slate-600 animate-fade-in text-left backdrop-blur-sm">
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1.5">Start (sec)</label>
                                                <input 
                                                    type="number" 
                                                    value={quickStart}
                                                    onChange={(e) => setQuickStart(Number(e.target.value))}
                                                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm font-mono focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1.5">End (sec)</label>
                                                <input 
                                                    type="number" 
                                                    value={quickEnd}
                                                    onChange={(e) => setQuickEnd(Number(e.target.value))}
                                                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm font-mono focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                        <button 
                                            onClick={handleQuickExportClick}
                                            disabled={isQuickExporting || quickEnd <= quickStart}
                                            className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg flex items-center justify-center gap-2 shadow-lg"
                                        >
                                            {isQuickExporting ? <i className="fa-solid fa-circle-notch animate-spin"></i> : <i className="fa-solid fa-bolt"></i>}
                                            {isQuickExporting ? 'Processing...' : 'Generate Clip'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                 </div>
              </div>
           </div>
        ) : (
          <div className="text-slate-600 flex flex-col items-center animate-pulse">
            <i className="fa-solid fa-film text-6xl mb-4 opacity-50"></i>
            <p className="font-medium tracking-wide">Waiting for video source...</p>
          </div>
        )
      ) : error ? (
        <div className="text-red-400 flex flex-col items-center p-8 text-center bg-red-900/10 rounded-xl border border-red-900/30">
            <i className="fa-solid fa-triangle-exclamation text-5xl mb-4"></i>
            <p className="font-bold text-lg">Playback Error</p>
            <p className="text-sm mt-2 opacity-80 max-w-xs">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-6 px-4 py-2 bg-red-900/50 hover:bg-red-900/70 rounded text-sm text-white transition-colors">Reload App</button>
        </div>
      ) : (
        <div 
          className="relative transition-all duration-500 ease-in-out shadow-2xl overflow-hidden bg-black flex items-center justify-center"
          style={isPortrait ? {
            width: '100%',
            maxWidth: '40vh',
            aspectRatio: '9/16',
            height: '95%',
            borderRadius: '24px',
            border: '4px solid #1e293b',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          } : {
            width: '100%',
            height: '100%'
          }}
          onMouseEnter={() => isPortrait && setShowCropControls(true)}
          onMouseLeave={() => setShowCropControls(false)}
        >
          <video
            ref={videoRef}
            src={src}
            className={`w-full h-full transition-all duration-300 ${isPortrait ? 'object-cover' : 'object-contain'}`}
            style={isPortrait ? { objectPosition: `${cropPosition}% center` } : undefined}
            onTimeUpdate={(e) => onTimeUpdate(e.currentTarget.currentTime)}
            onLoadedMetadata={(e) => onDurationChange(e.currentTarget.duration)}
            onError={handleError}
            crossOrigin="anonymous" 
          />
          
          {/* Mobile Overlay Elements (Simulating TikTok/Reels UI) */}
          {isPortrait && (
            <>
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 z-10">
                <div className="w-full text-center">
                    <div className="inline-block bg-black/40 backdrop-blur-md text-white/80 text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider border border-white/10">
                        9:16 Preview
                    </div>
                </div>
                
                <div className="flex flex-col gap-2 w-3/4">
                    <div className="h-3 w-1/3 bg-white/20 rounded animate-pulse"></div>
                    <div className="h-3 w-2/3 bg-white/20 rounded animate-pulse delay-75"></div>
                    <div className="mt-2 inline-block bg-slate-900/80 text-yellow-400 p-2 rounded text-xs border border-yellow-500/30 shadow-lg backdrop-blur-sm">
                    <i className="fa-solid fa-closed-captioning mr-1"></i> Auto-Captions Area
                    </div>
                </div>

                {/* Side Action Buttons Simulation */}
                <div className="absolute right-2 bottom-20 flex flex-col gap-4 items-center opacity-50">
                    <div className="w-8 h-8 rounded-full bg-white/20"></div>
                    <div className="w-8 h-8 rounded-full bg-white/20"></div>
                    <div className="w-8 h-8 rounded-full bg-white/20"></div>
                </div>
                </div>

                {/* Framing Control (Opacity on hover) */}
                <div className={`absolute bottom-4 left-0 right-0 px-6 py-3 transition-opacity duration-300 z-20 ${showCropControls ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="bg-slate-900/90 backdrop-blur rounded-xl p-3 border border-slate-700 shadow-xl pointer-events-auto">
                        <div className="flex justify-between items-center mb-1 text-[10px] text-slate-400 font-bold uppercase tracking-wide">
                            <span>Left</span>
                            <span>Reframing</span>
                            <span>Right</span>
                        </div>
                        <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={cropPosition} 
                            onChange={(e) => setCropPosition(Number(e.target.value))}
                            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                        />
                    </div>
                </div>
            </>
          )}

          {/* Quick Clip Trigger Button (Overlay on video when not showing controls) */}
          {!showQuickClip && !isPortrait && (
             <button 
                onClick={() => setShowQuickClip(true)}
                className="absolute top-4 right-4 z-20 bg-purple-600 hover:bg-purple-500 text-white p-2 rounded-lg shadow-lg transition-colors opacity-0 group-hover:opacity-100"
                title="Open Quick Clip"
             >
                <i className="fa-solid fa-scissors"></i>
             </button>
          )}

           {/* Quick Clip Overlay Panel */}
           {showQuickClip && !downloadStatus && (
               <div className="absolute top-4 right-4 z-30 w-64 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl p-4 shadow-2xl animate-fade-in">
                  <div className="flex justify-between items-center mb-3">
                      <h4 className="text-white font-bold text-sm">Quick Clip</h4>
                      <button onClick={() => setShowQuickClip(false)} className="text-slate-400 hover:text-white">
                          <i className="fa-solid fa-times"></i>
                      </button>
                  </div>
                  <div className="space-y-3">
                      <div className="flex gap-2">
                        <div>
                            <label className="text-[9px] text-slate-400 uppercase font-bold block mb-1">Start</label>
                            <input 
                                type="number" 
                                value={quickStart} 
                                onChange={(e) => setQuickStart(Number(e.target.value))}
                                className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-white text-xs font-mono"
                            />
                        </div>
                        <div>
                            <label className="text-[9px] text-slate-400 uppercase font-bold block mb-1">End</label>
                            <input 
                                type="number" 
                                value={quickEnd} 
                                onChange={(e) => setQuickEnd(Number(e.target.value))}
                                className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-white text-xs font-mono"
                            />
                        </div>
                      </div>
                      <div className="flex gap-2 mt-2">
                          <button 
                             onClick={() => { setQuickStart(Math.floor(currentTime)); }}
                             className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] rounded border border-slate-700"
                          >
                             Set Start
                          </button>
                          <button 
                             onClick={() => { setQuickEnd(Math.floor(currentTime)); }}
                             className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] rounded border border-slate-700"
                          >
                             Set End
                          </button>
                      </div>
                      <button 
                        onClick={handleQuickExportClick}
                        disabled={isQuickExporting || quickEnd <= quickStart}
                        className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded font-bold text-xs flex items-center justify-center gap-2"
                      >
                         {isQuickExporting ? <i className="fa-solid fa-circle-notch animate-spin"></i> : <i className="fa-solid fa-bolt"></i>}
                         Create Clip
                      </button>
                  </div>
               </div>
           )}
        </div>
      )}
    </div>
  );
};