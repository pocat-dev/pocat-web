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
  downloadStatus?: string; // New prop for showing download state
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
  downloadStatus
}) => {
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset error when src changes
    setError(null);
  }, [src]);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setContainerDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (videoRef.current && !error && src) {
      if (isPlaying) {
        videoRef.current.play().catch(e => {
            console.error("Play failed", e);
            // Don't set error here if it's just an interruption
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, videoRef, error, src]);

  const handleError = () => {
     if (videoRef.current?.error) {
         console.error("Video Error:", videoRef.current.error);
         setError(videoRef.current.error.message || "Failed to load video source.");
     } else {
         setError("Unknown video error occurred.");
     }
  };

  return (
    <div ref={containerRef} className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden group">
      {!src ? (
        thumbnail ? (
           <div className="relative w-full h-full group">
              <img src={thumbnail} className="w-full h-full object-contain opacity-50" alt="Video Thumbnail" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <div className="bg-slate-900/90 p-6 rounded-xl border border-slate-700 backdrop-blur text-center max-w-sm shadow-2xl">
                    {downloadStatus ? (
                        <>
                          <div className="w-16 h-16 relative mb-4 mx-auto">
                              <div className="absolute inset-0 rounded-full border-4 border-slate-700"></div>
                              <div className="absolute inset-0 rounded-full border-4 border-purple-500 border-t-transparent animate-spin"></div>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <i className="fa-solid fa-cloud-arrow-down text-purple-400"></i>
                              </div>
                          </div>
                          <h3 className="text-white font-bold text-lg mb-2">Downloading Video...</h3>
                          <p className="text-sm text-slate-400 leading-relaxed mb-4">
                             {downloadStatus}
                          </p>
                          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                             <div className="bg-purple-500 h-full rounded-full animate-pulse w-full"></div>
                          </div>
                        </>
                    ) : (
                        <>
                            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700">
                                <i className="fa-solid fa-eye-slash text-3xl text-slate-400"></i>
                            </div>
                            <h3 className="text-white font-bold text-lg mb-2">Video Preview Unavailable</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">
                            Due to YouTube restrictions, video playback is disabled. 
                            <br/>
                            <span className="text-purple-400 font-medium">You can still create and export clips!</span>
                            </p>
                            <div className="mt-4 text-xs bg-slate-800 p-2 rounded text-slate-500 border border-slate-700/50">
                            <i className="fa-solid fa-info-circle mr-1"></i> Use the timeline below to scrub
                            </div>
                        </>
                    )}
                 </div>
              </div>
           </div>
        ) : (
          <div className="text-slate-600 flex flex-col items-center">
            <i className="fa-solid fa-film text-6xl mb-4"></i>
            <p>No video loaded</p>
          </div>
        )
      ) : error ? (
        <div className="text-red-400 flex flex-col items-center p-4 text-center">
            <i className="fa-solid fa-triangle-exclamation text-4xl mb-3"></i>
            <p className="font-bold">Playback Error</p>
            <p className="text-sm mt-1">{error}</p>
            <p className="text-xs text-slate-500 mt-2">Try re-importing or checking the backend connection.</p>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            src={src}
            className="h-full w-full object-contain"
            onTimeUpdate={(e) => onTimeUpdate(e.currentTarget.currentTime)}
            onLoadedMetadata={(e) => onDurationChange(e.currentTarget.duration)}
            onError={handleError}
            crossOrigin="anonymous" 
          />
          
          {/* 9:16 Crop Overlay - Visual Guide only */}
          {aspectRatio === AspectRatio.PORTRAIT && (
            <div className="absolute inset-0 pointer-events-none flex justify-center">
              {/* Left dim */}
              <div className="h-full bg-black/60 backdrop-blur-sm flex-1"></div>
              
              {/* The "Safe Area" */}
              <div className="h-full aspect-[9/16] border-2 border-yellow-400/50 shadow-2xl relative">
                <div className="absolute top-4 left-0 w-full text-center">
                   <span className="bg-yellow-500/80 text-black text-[10px] px-2 py-0.5 rounded font-bold uppercase">Safe Zone</span>
                </div>
                {/* Simulated captions area */}
                <div className="absolute bottom-1/4 w-full px-4 text-center">
                   <div className="bg-slate-900/80 text-white p-2 rounded text-sm mx-auto w-3/4 opacity-50">
                     [AI Captions Placehoder]
                   </div>
                </div>
              </div>

              {/* Right dim */}
              <div className="h-full bg-black/60 backdrop-blur-sm flex-1"></div>
            </div>
          )}
        </>
      )}
    </div>
  );
};