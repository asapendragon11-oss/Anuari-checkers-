import React from 'react';
import Piece from './Piece';
import { GameState, GameRules, PieceTheme } from '../types';
import { motion } from 'motion/react';

interface BoardProps {
  gameState: GameState;
  rules: GameRules;
  onSquareClick: (r: number, c: number) => void;
  theme: PieceTheme;
}

const Board: React.FC<BoardProps> = ({ gameState, rules, onSquareClick, theme }) => {
  return (
    <div className="relative aspect-square w-full max-w-[500px] bg-[#151619] p-2 rounded-2xl shadow-2xl border border-white/5 overflow-hidden">
      <div 
        className="grid w-full h-full"
        style={{ 
          gridTemplateColumns: `repeat(${rules.boardSize}, 1fr)`,
          gridTemplateRows: `repeat(${rules.boardSize}, 1fr)`
        }}
      >
            {Array.from({ length: rules.boardSize * rules.boardSize }).map((_, i) => {
              const r = Math.floor(i / rules.boardSize);
              const c = i % rules.boardSize;
              const isDark = (r + c) % 2 !== 0;
              const piece = gameState.board[r][c];
              const isSelected = gameState.selectedPiece?.r === r && gameState.selectedPiece?.c === c;
              const isValidMove = gameState.validMoves.some(m => m.to.r === r && m.to.c === c);

              return (
                <div
                  key={`${r}-${c}`}
                  onClick={() => onSquareClick(r, c)}
                  className={`relative flex items-center justify-center transition-all duration-300
                    ${isDark 
                      ? 'bg-[#1A1B1E] shadow-inner' 
                      : 'bg-[#2A2B2F] border border-white/5'}
                    ${isValidMove ? 'cursor-pointer hover:bg-emerald-500/10' : ''}
                  `}
                >
                  {/* Square coordinate helpers (subtle) */}
                  <span className="absolute top-0.5 left-1 text-[6px] text-white/5 font-mono uppercase pointer-events-none">
                    {String.fromCharCode(65 + c)}{rules.boardSize - r}
                  </span>

                  {/* Valid move indicator */}
                  {isValidMove && !piece && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-4 h-4 rounded-full bg-emerald-500/30 border border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.2)]" 
                    />
                  )}
              
              {piece && (
                <Piece
                  piece={piece}
                  isSelected={isSelected}
                  isValidMove={isValidMove}
                  onClick={() => onSquareClick(r, c)}
                  theme={theme}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Board;
