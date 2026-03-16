import React from 'react';
import { X, Globe, Music, Volume2, Monitor, Palette } from 'lucide-react';
import { RuleVariant, Difficulty, PieceTheme } from '../types';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  variant: RuleVariant;
  setVariant: (v: RuleVariant) => void;
  musicEnabled: boolean;
  setMusicEnabled: (v: boolean) => void;
  volume: number;
  setVolume: (v: number) => void;
  aiEnabled: boolean;
  setAiEnabled: (v: boolean) => void;
  difficulty: Difficulty;
  setDifficulty: (d: Difficulty) => void;
  pieceTheme: PieceTheme;
  setPieceTheme: (t: PieceTheme) => void;
  onExitToMenu: () => void;
}

const Settings: React.FC<SettingsProps> = ({
  isOpen, onClose, variant, setVariant, musicEnabled, setMusicEnabled, volume, setVolume, aiEnabled, setAiEnabled, difficulty, setDifficulty, pieceTheme, setPieceTheme, onExitToMenu
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#151619] border border-white/10 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-bottom border-white/5 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Monitor className="w-5 h-5 text-emerald-400" />
            Game Settings
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <X className="w-6 h-6 text-white/60" />
          </button>
        </div>

        <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Rules Variant */}
          <section className="space-y-4">
            <label className="text-xs font-mono uppercase tracking-widest text-white/40 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Rule Variant
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['english', 'international', 'brazilian', 'russian', 'czech'] as RuleVariant[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setVariant(v)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all border ${
                    variant === v 
                      ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' 
                      : 'bg-white/5 border-transparent text-white/60 hover:bg-white/10'
                  }`}
                >
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>
          </section>

          {/* Piece Theme */}
          <section className="space-y-4">
            <label className="text-xs font-mono uppercase tracking-widest text-white/40 flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Piece Theme
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['classic', 'wood', 'neon', 'royal'] as PieceTheme[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setPieceTheme(t)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all border flex items-center justify-between ${
                    pieceTheme === t 
                      ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' 
                      : 'bg-white/5 border-transparent text-white/60 hover:bg-white/10'
                  }`}
                >
                  <span>{t.charAt(0).toUpperCase() + t.slice(1)}</span>
                  <div className="flex gap-1">
                    <div className={`w-3 h-3 rounded-full ${
                      t === 'classic' ? 'bg-white' : 
                      t === 'wood' ? 'bg-[#D2B48C]' : 
                      t === 'neon' ? 'bg-[#00FFFF]' : 'bg-[#FFD700]'
                    }`} />
                    <div className={`w-3 h-3 rounded-full ${
                      t === 'classic' ? 'bg-black' : 
                      t === 'wood' ? 'bg-[#3E2723]' : 
                      t === 'neon' ? 'bg-[#FF00FF]' : 'bg-[#4B0082]'
                    }`} />
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* AI Mode */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-widest text-white/40 flex items-center gap-2">
                <Monitor className="w-4 h-4" />
                AI Opponent
              </label>
              <button
                onClick={() => setAiEnabled(!aiEnabled)}
                className={`w-12 h-6 rounded-full transition-colors relative ${aiEnabled ? 'bg-emerald-500' : 'bg-white/10'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${aiEnabled ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            {aiEnabled && (
              <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                <label className="text-[10px] font-mono uppercase tracking-widest text-white/20">Difficulty</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
                        difficulty === d 
                          ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' 
                          : 'bg-white/5 border-transparent text-white/60 hover:bg-white/10'
                      }`}
                    >
                      {d.charAt(0).toUpperCase() + d.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Audio */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-widest text-white/40 flex items-center gap-2">
                <Music className="w-4 h-4" />
                Background Music
              </label>
              <button
                onClick={() => setMusicEnabled(!musicEnabled)}
                className={`w-12 h-6 rounded-full transition-colors relative ${musicEnabled ? 'bg-emerald-500' : 'bg-white/10'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${musicEnabled ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
            
            <div className="flex items-center gap-4">
              <Volume2 className="w-4 h-4 text-white/40" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="flex-1 accent-emerald-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </section>
        </div>

        <div className="p-6 bg-white/5 flex justify-between items-center">
          <button
            onClick={onExitToMenu}
            className="text-xs font-mono uppercase tracking-widest text-red-400/60 hover:text-red-400 transition-colors"
          >
            Exit to Main Menu
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-xl transition-all active:scale-95"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
