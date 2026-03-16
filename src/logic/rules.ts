import { GameRules, RuleVariant } from '../types';

export const RULES: Record<RuleVariant, GameRules> = {
  english: {
    boardSize: 8,
    rowsOfPieces: 3,
    menCaptureBackwards: false,
    flyingKings: false,
    mandatoryCapture: true,
    promotionDuringJump: false,
  },
  international: {
    boardSize: 10,
    rowsOfPieces: 4,
    menCaptureBackwards: true,
    flyingKings: true,
    mandatoryCapture: true,
    promotionDuringJump: false,
  },
  brazilian: {
    boardSize: 8,
    rowsOfPieces: 3,
    menCaptureBackwards: true,
    flyingKings: true,
    mandatoryCapture: true,
    promotionDuringJump: false,
  },
  russian: {
    boardSize: 8,
    rowsOfPieces: 3,
    menCaptureBackwards: true,
    flyingKings: true,
    mandatoryCapture: true,
    promotionDuringJump: true,
  },
  czech: {
    boardSize: 8,
    rowsOfPieces: 3,
    menCaptureBackwards: true,
    flyingKings: true,
    mandatoryCapture: true,
    promotionDuringJump: false,
    kingCapturePriority: true,
  },
};
