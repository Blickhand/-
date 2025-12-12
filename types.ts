
export enum AppStage {
  EARTH_ROAM = 'EARTH_ROAM',
  TRANSITION_GUANGZHOU = 'TRANSITION_GUANGZHOU',
  SCHOOL_HUB = 'SCHOOL_HUB',
  GALLERY = 'GALLERY',
  GAME_BLESSINGS = 'GAME_BLESSINGS',
  GAME_RIDDLES = 'GAME_RIDDLES',
  FIREWORKS = 'FIREWORKS'
}

export interface BlessingCard {
  id: number;
  name: string; // e.g., "学业福"
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  collected: boolean;
  color: string;
}

export interface Riddle {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface GalleryItem {
  id: number;
  images: string[]; // Changed from 'url: string' to array
  title: string;
  description: string;
}
