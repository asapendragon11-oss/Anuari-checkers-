
export type Player = 'light' | 'dark';
export type PieceType = 'man' | 'king';

export interface Piece {
  id: string;
  player: Player;
  type: PieceType;
  position: { r: number; c: number };
}

export interface Move {
  from: { r: number; c: number };
  to: { r: number; c: number };
  captures?: { r: number; c: number }[];
  isPromotion?: boolean;
}

export type RuleVariant = 'english' | 'international' | 'brazilian' | 'russian' | 'czech';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface PieceColors {
  light: string;
  dark: string;
}

export type PieceTheme = 'classic' | 'wood' | 'neon' | 'royal';

export interface GameRules {
  boardSize: number;
  rowsOfPieces: number;
  menCaptureBackwards: boolean;
  flyingKings: boolean;
  mandatoryCapture: boolean;
  promotionDuringJump: boolean; // Russian rules
  kingCapturePriority?: boolean; // Czech rules
}

export interface GameState {
  board: (Piece | null)[][];
  currentPlayer: Player;
  selectedPiece: { r: number; c: number } | null;
  validMoves: Move[];
  winner: Player | 'draw' | null;
  history: Move[];
  variant: RuleVariant;
}
