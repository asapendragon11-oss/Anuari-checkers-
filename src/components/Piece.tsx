import React from 'react';
import { Crown } from 'lucide-react';
import { Piece as PieceType, PieceTheme } from '../types';
import { motion } from 'motion/react';

interface PieceProps {
  piece: PieceType;
  isSelected: boolean;
  isValidMove: boolean;
  onClick: () => void;
  theme: PieceTheme;
}

const THEME_COLORS = {
  classic: {
    light: 'from-[#FFFFFF] to-[#CCCCCC] border-[#BBBBBB]',
    dark: 'from-[#2A2B2F] to-[#0A0A0A] border-[#3A3B3F]',
    kingLight: 'text-emerald-600',
    kingDark: 'text-emerald-400'
  },
  wood: {
    light: 'from-[#D2B48C] to-[#8B4513] border-[#A0522D]',
    dark: 'from-[#3E2723] to-[#1B1109] border-[#2D1B0E]',
    kingLight: 'text-amber-200',
    kingDark: 'text-amber-500'
  },
  neon: {
    light: 'from-[#00FFFF] to-[#008B8B] border-[#00CED1]',
    dark: 'from-[#FF00FF] to-[#8B008B] border-[#C71585]',
    kingLight: 'text-white',
    kingDark: 'text-white'
  },
  royal: {
    light: 'from-[#FFD700] to-[#DAA520] border-[#B8860B]',
    dark: 'from-[#4B0082] to-[#2E0854] border-[#3C0A6B]',
    kingLight: 'text-white',
    kingDark: 'text-amber-400'
  }
};

const Piece: React.FC<PieceProps> = ({ piece, isSelected, isValidMove, onClick, theme }) => {
  const isLight = piece.player === 'light';
  const colors = THEME_COLORS[theme];
  const gradient = isLight ? colors.light : colors.dark;
  const kingColor = isLight ? colors.kingLight : colors.kingDark;
  
  return (
    <motion.div
      layoutId={piece.id}
      onClick={onClick}
      className={`relative w-[85%] h-[85%] rounded-full cursor-pointer flex items-center justify-center transition-all shadow-2xl
        bg-gradient-to-br border-2 ${gradient}
        ${isSelected ? 'ring-4 ring-emerald-500 scale-110 z-10 shadow-emerald-500/40' : ''}
        ${isValidMove ? 'ring-2 ring-emerald-400/50' : ''}
      `}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95, y: 0 }}
    >
      {/* Texture/Grooves */}
      <div className={`absolute inset-2 rounded-full border border-dashed opacity-20 ${isLight ? 'border-black' : 'border-white'}`} />
      <div className={`absolute inset-4 rounded-full border border-solid opacity-10 ${isLight ? 'border-black' : 'border-white'}`} />
      
      {/* Inner ring for depth */}
      <div className={`absolute inset-1 rounded-full border-2 ${isLight ? 'border-black/5' : 'border-white/5'}`} />
      
      {piece.type === 'king' && (
        <motion.div
          initial={{ rotate: -10, scale: 0.8 }}
          animate={{ rotate: 0, scale: 1 }}
          className="relative z-10"
        >
          <Crown className={`w-1/2 h-1/2 mx-auto ${kingColor} drop-shadow-sm`} fill="currentColor" />
        </motion.div>
      )}
      
      {/* Glow for selected */}
      {isSelected && (
        <div className="absolute inset-0 rounded-full bg-emerald-500/30 animate-pulse blur-sm" />
      )}
    </motion.div>
  );
};

export default Piece;
