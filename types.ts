export interface AIAnalysisResult {
  title: string;
  viralScore: number;
  reasoning: string;
  hashtags: string[];
  suggestedCaption: string;
}

export interface ViralClip {
  id: string;
  title: string;
  start: string; // "00:10" format or string description
  end: string;
  viralScore: number;
  description: string;
  reasoning: string;
}

export interface ClipSegment {
  id: string;
  startTime: number;
  endTime: number;
  label: string;
  analysis?: AIAnalysisResult;
}

export interface VideoState {
  file: File | null;
  url: string | null;
  thumbnail?: string | null;
  duration: number;
  currentTime: number;
  isPlaying: boolean;
  sourceType: 'local' | 'youtube';
}

export enum AspectRatio {
  LANDSCAPE = '16:9',
  PORTRAIT = '9:16',
  SQUARE = '1:1',
}