import React from 'react';
import { Trophy, Users, Monitor, Play, Globe, Palette } from 'lucide-react';
import { RuleVariant, Difficulty, PieceTheme } from '../types';

interface StartScreenProps {
  onStart: () => void;
  variant: RuleVariant;
  setVariant: (v: RuleVariant) => void;
  aiEnabled: boolean;
  setAiEnabled: (v: boolean) => void;
  difficulty: Difficulty;
  setDifficulty: (d: Difficulty) => void;
  pieceTheme: PieceTheme;
  setPieceTheme: (t: PieceTheme) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({
  onStart, variant, setVariant, aiEnabled, setAiEnabled, difficulty, setDifficulty, pieceTheme, setPieceTheme
}) => {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-2xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        {/* Logo/Title */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500 rounded-3xl shadow-2xl shadow-emerald-500/20 mb-4 rotate-3 hover:rotate-0 transition-transform duration-500">
            <Trophy className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-5xl font-bold tracking-tighter">
            ANUARI <span className="text-emerald-500">CHECKERS</span>
          </h1>
          <p className="text-white/40 font-mono text-xs uppercase tracking-[0.3em]">The Ultimate Strategy Experience</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Game Mode & Difficulty */}
          <div className="space-y-6 bg-white/5 p-6 rounded-3xl border border-white/5 backdrop-blur-xl">
            <div className="space-y-4">
              <label className="text-[10px] font-mono uppercase tracking-widest text-white/30 flex items-center gap-2">
                <Users className="w-3 h-3" />
                Select Opponent
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setAiEnabled(true)}
                  className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${
                    aiEnabled 
                      ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' 
                      : 'bg-white/5 border-transparent text-white/40 hover:bg-white/10'
                  }`}
                >
                  <Monitor className="w-6 h-6" />
                  <span className="text-xs font-semibold">VS AI</span>
                </button>
                <button
                  onClick={() => setAiEnabled(false)}
                  className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${
                    !aiEnabled 
                      ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' 
                      : 'bg-white/5 border-transparent text-white/40 hover:bg-white/10'
                  }`}
                >
                  <Users className="w-6 h-6" />
                  <span className="text-xs font-semibold">Local PVP</span>
                </button>
              </div>
            </div>

            {aiEnabled && (
              <div className="space-y-4 animate-in fade-in zoom-in duration-300">
                <label className="text-[10px] font-mono uppercase tracking-widest text-white/30">AI Difficulty</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={`py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border ${
                        difficulty === d 
                          ? 'bg-emerald-500 border-emerald-500 text-black' 
                          : 'bg-white/5 border-transparent text-white/40 hover:bg-white/10'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <label className="text-[10px] font-mono uppercase tracking-widest text-white/30 flex items-center gap-2">
                <Globe className="w-3 h-3" />
                Rule Variant
              </label>
              <select 
                value={variant}
                onChange={(e) => setVariant(e.target.value as RuleVariant)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none cursor-pointer"
              >
                <option value="english">English (8x8)</option>
                <option value="international">International (10x10)</option>
                <option value="brazilian">Brazilian (8x8)</option>
                <option value="russian">Russian (8x8)</option>
                <option value="czech">Czech (8x8)</option>
              </select>
            </div>
          </div>

          {/* Right Column: Visuals */}
          <div className="space-y-6 bg-white/5 p-6 rounded-3xl border border-white/5 backdrop-blur-xl">
            <div className="space-y-4">
              <label className="text-[10px] font-mono uppercase tracking-widest text-white/30 flex items-center gap-2">
                <Palette className="w-3 h-3" />
                Piece Theme
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(['classic', 'wood', 'neon', 'royal'] as PieceTheme[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setPieceTheme(t)}
                    className={`group relative p-4 rounded-2xl border transition-all overflow-hidden ${
                      pieceTheme === t 
                        ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' 
                        : 'bg-white/5 border-transparent text-white/40 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2 relative z-10">
                      <div className="flex -space-x-2">
                        <div className={`w-6 h-6 rounded-full border border-white/10 ${
                          t === 'classic' ? 'bg-white' : 
                          t === 'wood' ? 'bg-[#D2B48C]' : 
                          t === 'neon' ? 'bg-[#00FFFF]' : 'bg-[#FFD700]'
                        }`} />
                        <div className={`w-6 h-6 rounded-full border border-white/10 ${
                          t === 'classic' ? 'bg-black' : 
                          t === 'wood' ? 'bg-[#3E2723]' : 
                          t === 'neon' ? 'bg-[#FF00FF]' : 'bg-[#4B0082]'
                        }`} />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider">{t}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
              <p className="text-[10px] text-emerald-400/60 leading-relaxed italic">
                "Strategy is the art of making use of time and space. I am less concerned about the latter than the former. Space we can recover, lost time never."
              </p>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={onStart}
          className="group relative w-full py-6 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xl rounded-3xl transition-all active:scale-[0.98] shadow-2xl shadow-emerald-500/20 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <span className="relative flex items-center justify-center gap-3">
            START GAME
            <Play className="w-6 h-6 fill-current" />
          </span>
        </button>

        <p className="text-center text-white/20 text-[10px] font-mono uppercase tracking-widest">
          Version 2.0 • Built with Passion
        </p>
      </div>
    </div>
  );
};

export default StartScreen;
