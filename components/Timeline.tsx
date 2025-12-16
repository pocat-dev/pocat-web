import React from 'react';
import { ViralClip } from '../types';

interface TimelineProps {
  duration: number;
  currentTime: number;
  onSeek: (time: number) => void;
  clips?: ViralClip[];
}

export const Timeline: React.FC<TimelineProps> = ({ duration, currentTime, onSeek, clips = [] }) => {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const parseTime = (timeStr: string) => {
    const [min, sec] = timeStr.split(':').map(Number);
    return min * 60 + sec;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    onSeek(time);
  };

  const percent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full h-24 bg-slate-900 border-t border-slate-700 p-4 flex flex-col justify-center">
      <div className="flex justify-between text-xs text-slate-400 mb-2 font-mono">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
      
      <div className="relative w-full h-12 flex items-center group">
        {/* Track Background */}
        <div className="absolute inset-0 bg-slate-800 rounded-lg overflow-hidden flex relative">
          {/* Simulated Audio Waveform (Visual noise) */}
          {Array.from({ length: 100 }).map((_, i) => (
             <div 
               key={i} 
               className="flex-1 bg-slate-700/50 mx-[1px] rounded-full"
               style={{ 
                 height: `${Math.random() * 80 + 20}%`,
                 opacity: i % 2 === 0 ? 0.6 : 0.3
               }}
             ></div>
          ))}

          {/* Render Clips on Timeline */}
          {clips.map((clip) => {
            const start = parseTime(clip.start);
            const end = parseTime(clip.end);
            const left = (start / duration) * 100;
            const width = ((end - start) / duration) * 100;
            const color = clip.viralScore > 70 ? 'bg-green-500' : clip.viralScore > 40 ? 'bg-yellow-500' : 'bg-blue-500';
            
            return (
              <div
                key={clip.id}
                className={`absolute top-0 bottom-0 ${color} opacity-40 hover:opacity-70 transition-opacity cursor-pointer border-l border-r border-white/20`}
                style={{ left: `${left}%`, width: `${width}%` }}
                title={`${clip.title} (${clip.start}-${clip.end})`}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent seeking to click position immediately if we want special behavior, but usually seeking is fine
                  onSeek(start);
                }}
              >
                {/* Tooltip on hover could go here */}
              </div>
            );
          })}

        </div>

        {/* Progress Fill */}
        <div 
          className="absolute left-0 top-0 bottom-0 bg-purple-500/30 border-r-2 border-purple-500 pointer-events-none transition-all duration-75 z-10"
          style={{ width: `${percent}%` }}
        ></div>

        {/* Input Range (Interaction Layer) */}
        <input
          type="range"
          min="0"
          max={duration}
          step="0.1"
          value={currentTime}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
        />
      </div>
    </div>
  );
};