import { Piece, Player, Move, GameState, RuleVariant, PieceType } from '../types';
import { RULES } from './rules';

export function createInitialBoard(variant: RuleVariant): (Piece | null)[][] {
  const rules = RULES[variant];
  const size = rules.boardSize;
  const board: (Piece | null)[][] = Array(size).fill(null).map(() => Array(size).fill(null));

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if ((r + c) % 2 !== 0) {
        if (r < rules.rowsOfPieces) {
          board[r][c] = { id: `dark-${r}-${c}`, player: 'dark', type: 'man', position: { r, c } };
        } else if (r >= size - rules.rowsOfPieces) {
          board[r][c] = { id: `light-${r}-${c}`, player: 'light', type: 'man', position: { r, c } };
        }
      }
    }
  }
  return board;
}

export function getValidMoves(state: GameState, r: number, c: number): Move[] {
  const piece = state.board[r][c];
  if (!piece || piece.player !== state.currentPlayer) return [];

  const rules = RULES[state.variant];
  const moves: Move[] = [];
  const captureMoves: Move[] = [];

  // Directions
  const dirs = [
    { dr: -1, dc: -1 }, { dr: -1, dc: 1 },
    { dr: 1, dc: -1 }, { dr: 1, dc: 1 }
  ];

  const forwardDirs = piece.player === 'light' ? [-1] : [1];

  for (const { dr, dc } of dirs) {
    if (piece.type === 'man') {
      // Regular move
      if (forwardDirs.includes(dr)) {
        const nr = r + dr;
        const nc = c + dc;
        if (isWithinBounds(nr, nc, rules.boardSize) && !state.board[nr][nc]) {
          moves.push({ from: { r, c }, to: { r: nr, c: nc } });
        }
      }

      // Capture
      const canCaptureBack = rules.menCaptureBackwards;
      if (forwardDirs.includes(dr) || canCaptureBack) {
        const nr = r + dr;
        const nc = c + dc;
        const fr = r + 2 * dr;
        const fc = c + 2 * dc;

        if (isWithinBounds(fr, fc, rules.boardSize)) {
          const midPiece = state.board[nr][nc];
          if (midPiece && midPiece.player !== piece.player && !state.board[fr][fc]) {
            captureMoves.push({
              from: { r, c },
              to: { r: fr, c: fc },
              captures: [{ r: nr, c: nc }]
            });
          }
        }
      }
    } else {
      // King
      if (rules.flyingKings) {
        let nr = r + dr;
        let nc = c + dc;
        let capturedInPath: { r: number; c: number } | null = null;

        while (isWithinBounds(nr, nc, rules.boardSize)) {
          const target = state.board[nr][nc];
          if (!target) {
            if (!capturedInPath) {
              moves.push({ from: { r, c }, to: { r: nr, c: nc } });
            } else {
              captureMoves.push({
                from: { r, c },
                to: { r: nr, c: nc },
                captures: [capturedInPath]
              });
            }
          } else if (target.player === piece.player) {
            break;
          } else {
            if (capturedInPath) break; // Can't jump two pieces
            capturedInPath = { r: nr, c: nc };
            // Check if space behind is empty
            const behindR = nr + dr;
            const behindC = nc + dc;
            if (!isWithinBounds(behindR, behindC, rules.boardSize) || state.board[behindR][behindC]) {
              break;
            }
          }
          nr += dr;
          nc += dc;
        }
      } else {
        // Non-flying king (English)
        const nr = r + dr;
        const nc = c + dc;
        if (isWithinBounds(nr, nc, rules.boardSize)) {
          if (!state.board[nr][nc]) {
            moves.push({ from: { r, c }, to: { r: nr, c: nc } });
          } else if (state.board[nr][nc]?.player !== piece.player) {
            const fr = r + 2 * dr;
            const fc = c + 2 * dc;
            if (isWithinBounds(fr, fc, rules.boardSize) && !state.board[fr][fc]) {
              captureMoves.push({
                from: { r, c },
                to: { r: fr, c: fc },
                captures: [{ r: nr, c: nc }]
              });
            }
          }
        }
      }
    }
  }

  return captureMoves.length > 0 ? captureMoves : moves;
}

function isWithinBounds(r: number, c: number, size: number) {
  return r >= 0 && r < size && c >= 0 && c < size;
}

export function getAllValidMoves(state: GameState): Move[] {
  const allMoves: Move[] = [];
  const allCaptures: Move[] = [];
  const kingCaptures: Move[] = [];

  for (let r = 0; r < state.board.length; r++) {
    for (let c = 0; c < state.board[r].length; c++) {
      const piece = state.board[r][c];
      if (!piece || piece.player !== state.currentPlayer) continue;
      
      const moves = getValidMoves(state, r, c);
      for (const m of moves) {
        if (m.captures) {
          allCaptures.push(m);
          if (piece.type === 'king') kingCaptures.push(m);
        } else {
          allMoves.push(m);
        }
      }
    }
  }

  const rules = RULES[state.variant];
  if (rules.mandatoryCapture && allCaptures.length > 0) {
    if (rules.kingCapturePriority && kingCaptures.length > 0) {
      return kingCaptures;
    }
    return allCaptures;
  }
  return [...allCaptures, ...allMoves];
}

export function applyMove(state: GameState, move: Move): GameState {
  const newBoard = state.board.map(row => [...row]);
  const { from, to, captures } = move;
  const piece = newBoard[from.r][from.c]!;

  newBoard[from.r][from.c] = null;
  newBoard[to.r][to.c] = { ...piece, position: to };

  if (captures) {
    for (const cap of captures) {
      newBoard[cap.r][cap.c] = null;
    }
  }

  // Promotion
  const rules = RULES[state.variant];
  let isPromotion = false;
  if (piece.type === 'man') {
    if ((piece.player === 'light' && to.r === 0) || (piece.player === 'dark' && to.r === rules.boardSize - 1)) {
      newBoard[to.r][to.c]!.type = 'king';
      isPromotion = true;
    }
  }

  // Multi-jump check
  let nextPlayer = state.currentPlayer === 'light' ? 'dark' : 'light';
  let nextValidMoves: Move[] = [];

  if (captures && !isPromotion) {
    const tempState: GameState = { ...state, board: newBoard, currentPlayer: piece.player };
    const extraCaptures = getValidMoves(tempState, to.r, to.c).filter(m => m.captures);
    if (extraCaptures.length > 0) {
      nextPlayer = piece.player as Player;
      nextValidMoves = extraCaptures;
    }
  }

  const newState: GameState = {
    ...state,
    board: newBoard,
    currentPlayer: nextPlayer as Player,
    selectedPiece: nextPlayer === piece.player ? to : null,
    validMoves: nextValidMoves,
    history: [...state.history, move]
  };

  // Check winner
  const opponentMoves = getAllValidMoves(newState);
  if (opponentMoves.length === 0) {
    newState.winner = state.currentPlayer;
  }

  return newState;
}
