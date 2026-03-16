import React, { useState, useEffect, useCallback } from 'react';
import { Settings as SettingsIcon, RotateCcw, Trophy, Undo2, Redo2 } from 'lucide-react';
import { GameState, RuleVariant, Move, Player, Difficulty, PieceTheme } from './types';
import { createInitialBoard, getAllValidMoves, applyMove, getValidMoves } from './logic/gameLogic';
import { getBestMove } from './logic/ai';
import { RULES } from './logic/rules';
import Board from './components/Board';
import Settings from './components/Settings';
import StartScreen from './components/StartScreen';
import AudioPlayer from './components/AudioPlayer';
import Piece from './components/Piece';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [variant, setVariant] = useState<RuleVariant>('english');
  const [gameState, setGameState] = useState<GameState>(() => ({
    board: createInitialBoard('english'),
    currentPlayer: 'light',
    selectedPiece: null,
    validMoves: [],
    winner: null,
    history: [],
    variant: 'english'
  }));

  const [past, setPast] = useState<GameState[]>([]);
  const [future, setFuture] = useState<GameState[]>([]);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [pieceTheme, setPieceTheme] = useState<PieceTheme>('classic');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [turnTimer, setTurnTimer] = useState(20);
  const [gameStarted, setGameStarted] = useState(false);

  const playSound = useCallback((type: 'move' | 'capture' | 'promotion' | 'win') => {
    const sounds = {
      move: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
      capture: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
      promotion: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3',
      win: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3'
    };
    const audio = new Audio(sounds[type]);
    audio.volume = volume;
    audio.play().catch(() => {});
  }, [volume]);

  const playMoveSound = useCallback((move: Move, nextState: GameState) => {
    if (nextState.winner) {
      playSound('win');
      return;
    }
    if (move.captures) {
      playSound('capture');
    } else {
      // Check if it was a promotion
      const piece = nextState.board[move.to.r][move.to.c];
      const oldPiece = gameState.board[move.from.r][move.from.c];
      if (piece?.type === 'king' && oldPiece?.type === 'man') {
        playSound('promotion');
      } else {
        playSound('move');
      }
    }
  }, [gameState.board, playSound]);

  // Reset game when variant changes
  useEffect(() => {
    setGameState({
      board: createInitialBoard(variant),
      currentPlayer: 'light',
      selectedPiece: null,
      validMoves: [],
      winner: null,
      history: [],
      variant
    });
    setPast([]);
    setFuture([]);
    setTurnTimer(20);
  }, [variant]);

  // Turn Timer
  useEffect(() => {
    if (gameState.winner) return;
    
    const timer = setInterval(() => {
      setTurnTimer(prev => {
        if (prev <= 1) {
          // Time's up!
          // If it's user's turn, maybe auto-move or switch turn?
          // For now, let's just stop at 0 or handle it.
          // The request says "user should think 20 seconds", maybe it's just a display?
          // Let's assume it's a limit.
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.currentPlayer, gameState.winner]);

  // Handle time up
  useEffect(() => {
    if (turnTimer === 0 && !gameState.winner) {
      if (gameState.currentPlayer === 'light') {
        // User timed out - AI wins or turn skipped?
        // Let's say AI wins for now as a penalty.
        setGameState(prev => ({ ...prev, winner: 'dark' }));
        playSound('win');
      } else {
        // AI timed out (shouldn't happen with current logic but for completeness)
        setGameState(prev => ({ ...prev, winner: 'light' }));
        playSound('win');
      }
    }
  }, [turnTimer, gameState.currentPlayer, gameState.winner, playSound]);

  // AI Turn
  useEffect(() => {
    if (aiEnabled && gameState.currentPlayer === 'dark' && !gameState.winner) {
      setIsAiThinking(true);
      // User requested 10 seconds thinking for AI
      const timer = setTimeout(() => {
        const depth = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 4 : 6;
        const bestMove = getBestMove(gameState, depth);
        if (bestMove) {
          setPast(prev => [...prev, gameState]);
          setFuture([]);
          const nextState = applyMove(gameState, bestMove);
          setGameState(nextState);
          playMoveSound(bestMove, nextState);
          setTurnTimer(20); // Reset timer for next turn
        }
        setIsAiThinking(false);
      }, 10000); // 10 seconds
      return () => clearTimeout(timer);
    }
  }, [gameState.currentPlayer, aiEnabled, gameState.winner, gameState.variant, difficulty]);

  const handleSquareClick = (r: number, c: number) => {
    if (gameState.winner || (aiEnabled && gameState.currentPlayer === 'dark')) return;

    const piece = gameState.board[r][c];
    
    // Selecting a piece
    if (piece && piece.player === gameState.currentPlayer) {
      // If we're in a multi-jump, we can only select the same piece
      if (gameState.selectedPiece && gameState.validMoves.length > 0) {
        if (gameState.selectedPiece.r !== r || gameState.selectedPiece.c !== c) return;
      }

      const moves = gameState.validMoves.length > 0 
        ? gameState.validMoves 
        : getValidMoves(gameState, r, c);
      
      // If mandatory capture is on, filter moves
      const allMoves = getAllValidMoves(gameState);
      const hasCaptures = allMoves.some(m => m.captures);
      const filteredMoves = hasCaptures ? moves.filter(m => m.captures) : moves;

      setGameState(prev => ({
        ...prev,
        selectedPiece: { r, c },
        validMoves: filteredMoves
      }));
      return;
    }

    // Moving a piece
    const move = gameState.validMoves.find(m => m.to.r === r && m.to.c === c);
    if (move) {
      setPast(prev => [...prev, gameState]);
      setFuture([]);
      const nextState = applyMove(gameState, move);
      setGameState(nextState);
      playMoveSound(move, nextState);
      setTurnTimer(20); // Reset timer for next turn
    } else {
      // Deselect if clicking empty square or invalid move
      if (gameState.validMoves.length === 0) {
        setGameState(prev => ({ ...prev, selectedPiece: null, validMoves: [] }));
      }
    }
  };

  const resetGame = () => {
    setGameState({
      board: createInitialBoard(variant),
      currentPlayer: 'light',
      selectedPiece: null,
      validMoves: [],
      winner: null,
      history: [],
      variant
    });
    setPast([]);
    setFuture([]);
    setTurnTimer(20);
    setIsAiThinking(false);
    playSound('move');
  };

  const undo = () => {
    if (past.length === 0 || isAiThinking) return;
    
    const newPast = [...past];
    const lastState = newPast.pop()!;
    
    // If AI is enabled and it was AI's turn or we just moved, we might want to undo twice
    // to get back to player's turn if AI just moved.
    // However, a simple undo is usually better.
    // Let's check if we should undo twice if AI is enabled and it's currently AI's turn or was.
    
    setFuture(prev => [gameState, ...prev]);
    setGameState(lastState);
    setPast(newPast);
    playSound('move');
  };

  const redo = () => {
    if (future.length === 0 || isAiThinking) return;
    
    const newFuture = [...future];
    const nextState = newFuture.shift()!;
    
    setPast(prev => [...prev, gameState]);
    setGameState(nextState);
    setFuture(newFuture);
    playSound('move');
  };

  const handleStart = () => {
    setGameStarted(true);
    playSound('move');
  };

  const rules = RULES[variant];

  if (!gameStarted) {
    return (
      <>
        <AudioPlayer isPlaying={musicEnabled} volume={volume} />
        <StartScreen
          onStart={handleStart}
          variant={variant}
          setVariant={setVariant}
          aiEnabled={aiEnabled}
          setAiEnabled={setAiEnabled}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          pieceTheme={pieceTheme}
          setPieceTheme={setPieceTheme}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans selection:bg-emerald-500/30">
      <AudioPlayer isPlaying={musicEnabled} volume={volume} />
      
      {/* Header */}
      <header className="p-6 flex justify-between items-center max-w-4xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Trophy className="text-black w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">Anuari checkers</h1>
            <p className="text-[10px] font-mono uppercase tracking-widest text-white/40">{variant} Rules</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={undo}
            disabled={past.length === 0 || isAiThinking}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all active:scale-95 disabled:opacity-20 disabled:cursor-not-allowed"
            title="Undo"
          >
            <Undo2 className="w-5 h-5" />
          </button>
          <button 
            onClick={redo}
            disabled={future.length === 0 || isAiThinking}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all active:scale-95 disabled:opacity-20 disabled:cursor-not-allowed"
            title="Redo"
          >
            <Redo2 className="w-5 h-5" />
          </button>
          <button 
            onClick={resetGame}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all active:scale-95"
            title="Reset"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setSettingsOpen(true)}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all active:scale-95"
            title="Settings"
          >
            <SettingsIcon className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pb-12 flex flex-col items-center gap-8">
        {/* Status Bar */}
        <div className="w-full flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5 relative overflow-hidden">
          {/* Active indicator glow */}
          <motion.div 
            animate={{ 
              x: gameState.currentPlayer === 'light' ? '0%' : '100%',
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 w-1/2 bg-emerald-500/10 blur-3xl pointer-events-none"
          />

          <div className={`flex items-center gap-3 transition-all duration-500 relative z-10 ${gameState.currentPlayer === 'light' ? 'opacity-100 scale-105' : 'opacity-40'}`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white to-gray-300 border-2 border-white/20 shadow-lg" />
            <div className="flex flex-col">
              <span className={`text-xs font-bold ${gameState.currentPlayer === 'light' ? 'text-emerald-400' : 'text-white'}`}>You</span>
              <span className="text-[10px] text-white/40 uppercase font-mono">Light</span>
            </div>
          </div>

          <div className="flex flex-col items-center relative z-10">
            {gameState.winner ? (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-emerald-400 font-bold text-sm uppercase tracking-widest drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]"
              >
                {gameState.winner === 'light' ? 'Victory!' : 'Defeat!'}
              </motion.div>
            ) : (
              <div className="flex flex-col items-center gap-1">
                <div className="text-[10px] font-mono text-white/20 uppercase tracking-widest flex items-center gap-2">
                  <div className={`w-1 h-1 rounded-full bg-emerald-500 ${isAiThinking ? 'animate-ping' : ''}`} />
                  {isAiThinking ? 'AI Thinking' : 'VS'}
                  <div className={`w-1 h-1 rounded-full bg-emerald-500 ${isAiThinking ? 'animate-ping' : ''}`} />
                </div>
                <div className={`text-xl font-mono font-bold ${turnTimer <= 5 ? 'text-red-500 animate-pulse' : 'text-white/60'}`}>
                  {turnTimer}s
                </div>
              </div>
            )}
          </div>

          <div className={`flex items-center gap-3 text-right transition-all duration-500 relative z-10 ${gameState.currentPlayer === 'dark' ? 'opacity-100 scale-105' : 'opacity-40'}`}>
            <div className="flex flex-col">
              <span className={`text-xs font-bold ${gameState.currentPlayer === 'dark' ? 'text-emerald-400' : 'text-white'}`}>{aiEnabled ? 'AI Master' : 'Opponent'}</span>
              <span className="text-[10px] text-white/40 uppercase font-mono">Dark</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-black border-2 border-white/10 shadow-lg" />
          </div>
        </div>

        {/* Board Container */}
        <Board 
          gameState={gameState} 
          rules={rules} 
          onSquareClick={handleSquareClick} 
          theme={pieceTheme}
        />

        {/* Footer Info */}
        <div className="w-full max-w-[500px] grid grid-cols-2 gap-4">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col gap-1">
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">History</span>
            <span className="text-sm font-semibold">{gameState.history.length} Moves</span>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col gap-1">
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Mode</span>
            <span className="text-sm font-semibold">{aiEnabled ? 'AI Opponent' : 'Local PvP'}</span>
          </div>
        </div>
      </main>

      <Settings
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        variant={variant}
        setVariant={setVariant}
        musicEnabled={musicEnabled}
        setMusicEnabled={setMusicEnabled}
        volume={volume}
        setVolume={setVolume}
        aiEnabled={aiEnabled}
        setAiEnabled={setAiEnabled}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        pieceTheme={pieceTheme}
        setPieceTheme={setPieceTheme}
        onExitToMenu={() => {
          setGameStarted(false);
          setSettingsOpen(false);
          playSound('move');
        }}
      />

      {/* Winner Modal */}
      <AnimatePresence>
        {gameState.winner && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#151619] border border-white/10 p-8 rounded-3xl text-center max-w-sm w-full shadow-2xl"
            >
              <div className="w-20 h-20 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20">
                <Trophy className="text-black w-10 h-10" />
              </div>
              <h2 className="text-3xl font-bold mb-2">
                {gameState.winner === 'light' ? 'You Won!' : 'AI Won!'}
              </h2>
              <p className="text-white/40 text-sm mb-8">
                {gameState.winner === 'light' 
                  ? 'Impressive strategy. You have mastered the board.' 
                  : 'The AI was too strong this time. Try another variant?'}
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={resetGame}
                  className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  Play Again
                </button>
                <button
                  onClick={() => {
                    setGameStarted(false);
                    resetGame();
                  }}
                  className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all active:scale-95"
                >
                  Main Menu
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
