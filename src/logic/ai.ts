import { GameState, Move, Player } from '../types';
import { getAllValidMoves, applyMove } from './gameLogic';

export function getBestMove(state: GameState, depth: number): Move | null {
  const moves = getAllValidMoves(state);
  if (moves.length === 0) return null;

  let bestMove = null;
  let bestValue = -Infinity;

  for (const move of moves) {
    const nextState = applyMove(state, move);
    const value = minimax(nextState, depth - 1, -Infinity, Infinity, false);
    if (value > bestValue) {
      bestValue = value;
      bestMove = move;
    }
  }

  return bestMove;
}

function minimax(state: GameState, depth: number, alpha: number, beta: number, isMaximizing: boolean): number {
  if (depth === 0 || state.winner) {
    return evaluate(state);
  }

  const moves = getAllValidMoves(state);
  if (moves.length === 0) return evaluate(state);

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      const nextState = applyMove(state, move);
      const evalVal = minimax(nextState, depth - 1, alpha, beta, false);
      maxEval = Math.max(maxEval, evalVal);
      alpha = Math.max(alpha, evalVal);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      const nextState = applyMove(state, move);
      const evalVal = minimax(nextState, depth - 1, alpha, beta, true);
      minEval = Math.min(minEval, evalVal);
      beta = Math.min(beta, evalVal);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

function evaluate(state: GameState): number {
  if (state.winner === 'dark') return 10000;
  if (state.winner === 'light') return -10000;

  let score = 0;
  for (let r = 0; r < state.board.length; r++) {
    for (let c = 0; c < state.board[r].length; c++) {
      const piece = state.board[r][c];
      if (piece) {
        const val = piece.type === 'king' ? 5 : 1;
        if (piece.player === 'dark') score += val;
        else score -= val;
      }
    }
  }
  return score;
}
