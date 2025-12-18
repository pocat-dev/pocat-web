import React from 'react';
import { VideoPlayer } from './VideoPlayer';
import { Timeline } from './Timeline';
import { AnalysisSidebar } from './AnalysisSidebar';
import { VideoState, AIAnalysisResult, AspectRatio, ViralClip } from '../types';

interface EditorViewProps {
  videoState: VideoState;
  setVideoState: React.Dispatch<React.SetStateAction<VideoState>>;
  youtubeLink: string;
  setYoutubeLink: React.Dispatch<React.SetStateAction<string>>;
  isImporting: boolean;
  importStatus: string;
  loadingTitle: string;
  aspectRatio: AspectRatio;
  setAspectRatio: React.Dispatch<React.SetStateAction<AspectRatio>>;
  analysis: AIAnalysisResult | null;
  viralClips: ViralClip[];
  isAnalyzing: boolean;
  analysisProgress: string;
  analysisTab: 'clips' | 'frame' | 'custom';
  setAnalysisTab: React.Dispatch<React.SetStateAction<'clips' | 'frame' | 'custom'>>;
  videoRef: React.RefObject<HTMLVideoElement>;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onYouTubeImport: () => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSeek: (time: number) => void;
  onAnalyzeFrame: () => void;
  onScanVideo: () => void;
  onPlayClip: (clip: ViralClip) => void;
  onExportClip: (clip: ViralClip) => void;
}

export const EditorView: React.FC<EditorViewProps> = ({
  videoState,
  setVideoState,
  youtubeLink,
  setYoutubeLink,
  isImporting,
  importStatus,
  loadingTitle,
  aspectRatio,
  setAspectRatio,
  analysis,
  viralClips,
  isAnalyzing,
  analysisProgress,
  analysisTab,
  setAnalysisTab,
  videoRef,
  fileInputRef,
  onYouTubeImport,
  onFileUpload,
  onSeek,
  onAnalyzeFrame,
  onScanVideo,
  onPlayClip,
  onExportClip,
}) => {
  return (
    <>
      <header className="h-16 bg-slate-900/50 border-b border-slate-800 flex items-center justify-between px-6 backdrop-blur-sm">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-bold">ClipGenius</h1>
          <div className="flex items-center bg-slate-800 rounded-lg border border-slate-700 overflow-hidden ml-4">
            <div className="pl-3 text-red-500"><i className="fa-brands fa-youtube"></i></div>
            <input 
              type="text" 
              placeholder="Paste YouTube Link..." 
              className="bg-transparent text-xs text-white px-3 py-2 w-64 focus:outline-none" 
              value={youtubeLink} 
              onChange={(e) => setYoutubeLink(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && onYouTubeImport()} 
            />
            <button 
              onClick={onYouTubeImport} 
              disabled={isImporting || !youtubeLink} 
              className="bg-slate-700 hover:bg-slate-600 px-3 py-2 text-xs font-medium transition-colors border-l border-slate-600"
            >
              Import
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <input type="file" ref={fileInputRef} accept="video/*" onChange={onFileUpload} className="hidden" />
          <button 
            onClick={() => fileInputRef.current?.click()} 
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded text-sm font-medium transition-colors"
          >
            Upload File
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col relative bg-black">
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-slate-900/90 border border-slate-700 rounded-full px-4 py-2 flex items-center space-x-4 shadow-xl">
            <button 
              onClick={() => setAspectRatio(AspectRatio.LANDSCAPE)} 
              className={`text-xs px-3 py-1 rounded-full ${aspectRatio === AspectRatio.LANDSCAPE ? 'bg-purple-600 text-white' : 'text-slate-400'}`}
            >
              Original
            </button>
            <button 
              onClick={() => setAspectRatio(AspectRatio.PORTRAIT)} 
              className={`text-xs px-3 py-1 rounded-full ${aspectRatio === AspectRatio.PORTRAIT ? 'bg-purple-600 text-white' : 'text-slate-400'}`}
            >
              Shorts (9:16)
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <VideoPlayer 
              src={videoState.url || ''} 
              thumbnail={videoState.thumbnail || ''} 
              videoRef={videoRef} 
              isPlaying={videoState.isPlaying} 
              currentTime={videoState.currentTime} 
              duration={videoState.duration} 
              onTimeUpdate={(t) => setVideoState(p => ({...p, currentTime: t}))} 
              onDurationChange={(d) => setVideoState(p => ({...p, duration: d}))} 
              aspectRatio={aspectRatio} 
              downloadStatus={isImporting ? importStatus : undefined} 
              loadingTitle={loadingTitle} 
              onManualExport={() => setAnalysisTab('custom')} 
              onQuickExport={async (s,e) => {}} 
            />
          </div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center space-x-6">
            <button 
              onClick={() => onSeek(Math.max(0, videoState.currentTime - 5))} 
              className="text-white/70 hover:text-white"
            >
              <i className="fa-solid fa-rotate-left text-xl"></i>
            </button>
            <button 
              onClick={() => setVideoState(p => ({...p, isPlaying: !p.isPlaying}))} 
              className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform"
            >
              {videoState.isPlaying ? <i className="fa-solid fa-pause text-xl"></i> : <i className="fa-solid fa-play text-xl ml-1"></i>}
            </button>
            <button 
              onClick={() => onSeek(Math.min(videoState.duration, videoState.currentTime + 5))} 
              className="text-white/70 hover:text-white"
            >
              <i className="fa-solid fa-rotate-right text-xl"></i>
            </button>
          </div>
        </div>
        <AnalysisSidebar 
          analysis={analysis} 
          viralClips={viralClips} 
          isAnalyzing={isAnalyzing} 
          analysisProgress={analysisProgress} 
          onAnalyzeFrame={onAnalyzeFrame} 
          onScanVideo={onScanVideo} 
          hasVideo={!!videoState.url || !!videoState.thumbnail} 
          onPlayClip={onPlayClip} 
          onExportClip={onExportClip} 
          currentTime={videoState.currentTime} 
          duration={videoState.duration} 
          isYouTube={videoState.sourceType === 'youtube'} 
          activeTab={analysisTab} 
          onTabChange={setAnalysisTab} 
        />
      </div>

      <div className="h-32 bg-slate-900 border-t border-slate-800 z-20">
        <Timeline 
          duration={videoState.duration} 
          currentTime={videoState.currentTime} 
          onSeek={onSeek} 
          clips={viralClips} 
        />
      </div>
    </>
  );
};
