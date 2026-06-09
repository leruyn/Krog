export type EmulatorTab = 'wisdom' | 'canvas' | 'crusher' | 'diary';

export interface WisdomQuote {
  id: number;
  content: string;
}

export interface DiaryEntry {
  id: string;
  originalText: string;
  krogText: string;
  timestamp: string;
}

export interface LineStroke {
  points: { x: number; y: number }[];
  color: string;
  width: number;
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
}

export interface FloatText {
  id: number;
  x: number;
  y: number;
  text: string;
}
