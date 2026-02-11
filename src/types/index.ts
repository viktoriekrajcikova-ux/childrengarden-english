export type Difficulty = 'easy' | 'medium' | 'hard';
export type DifficultyKey = 'kuratko' | 'listicka' | 'lev';

export interface LevelItem {
  name: string;
  emoji: string;
  czech: string;
  difficulties?: DifficultyKey[];
}

export interface ColorItem {
  name: string;
  czech: string;
  color: string;
  difficulties: DifficultyKey[];
}

export interface ShapeItem {
  name: string;
  czech: string;
  difficulties: DifficultyKey[];
}

export interface DragDropItem extends LevelItem {
  belongsTo: string;
}

export interface Destination {
  name: string;
  czech: string;
  emoji: string;
  cssClass: string;
}

export interface CountingObject {
  name: string;
  nameSingular: string;
  emoji: string;
  czech: string;
  czechSingular: string;
  difficulties?: DifficultyKey[];
}

export interface DrinkItem {
  name: string;
  emoji: string;
  czech: string;
  difficulties: DifficultyKey[];
}

// Discriminated union for level types
export interface StandardLevel {
  type: 'standard';
  name: string;
  items: LevelItem[];
  maxDisplay: number;
}

export interface AutoReviewLevel {
  type: 'autoReview';
  name: string;
  reviewLevelsRange: [number, number];
}

export interface ColoringLevel {
  type: 'coloring';
  name: string;
  colors: ColorItem[];
  shapes: ShapeItem[];
}

export interface MemoryLevel {
  type: 'memory';
  name: string;
}

export interface DragDropLevel {
  type: 'dragDrop';
  name: string;
  destinations: Destination[];
  items: DragDropItem[];
  itemsPerRound: number;
}

export interface CountingLevel {
  type: 'counting';
  name: string;
  countingObjects: CountingObject[];
}

export interface RestaurantLevel {
  type: 'restaurant';
  name: string;
  drinks: DrinkItem[];
  customers: string[];
  customersToServe: number;
}

export interface RhythmLevel {
  type: 'rhythm';
  name: string;
}

export type Level =
  | StandardLevel
  | AutoReviewLevel
  | ColoringLevel
  | MemoryLevel
  | DragDropLevel
  | CountingLevel
  | RestaurantLevel
  | RhythmLevel;

export interface LevelGroup {
  groupNumber: number;
  levels: { level: Level; index: number }[];
  isLocked: boolean;
  isCompleted: boolean;
}

