import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAward, FiRotateCcw, FiZap, FiArrowUp, FiArrowDown, FiArrowLeft, FiArrowRight } from 'react-icons/fi';

const SIZE = 4;
type Board = number[][];

const emptyBoard = (): Board => Array.from({ length: SIZE }, () => Array(SIZE).fill(0));

const addRandomTile = (board: Board): Board => {
  const empties: [number, number][] = [];
  board.forEach((row, r) => row.forEach((v, c) => { if (v === 0) empties.push([r, c]); }));
  if (empties.length === 0) return board;
  const [r, c] = empties[Math.floor(Math.random() * empties.length)];
  const next = board.map((row) => [...row]);
  next[r][c] = Math.random() < 0.9 ? 2 : 4;
  return next;
};

const compactLine = (line: number[]): { line: number[]; gained: number } => {
  const nums = line.filter((v) => v !== 0);
  let gained = 0;
  for (let i = 0; i < nums.length - 1; i++) {
    if (nums[i] === nums[i + 1]) {
      nums[i] *= 2;
      gained += nums[i];
      nums.splice(i + 1, 1);
    }
  }
  while (nums.length < SIZE) nums.push(0);
  return { line: nums, gained };
};

const rotateLeft = (board: Board): Board => {
  const next = emptyBoard();
  for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) next[SIZE - 1 - c][r] = board[r][c];
  return next;
};

const moveLeft = (board: Board): { board: Board; gained: number; moved: boolean } => {
  let gained = 0;
  let moved = false;
  const next = board.map((row) => {
    const { line, gained: g } = compactLine(row);
    gained += g;
    if (line.some((v, i) => v !== row[i])) moved = true;
    return line;
  });
  return { board: next, gained, moved };
};

const moveBoard = (board: Board, dir: 'left' | 'right' | 'up' | 'down') => {
  let rotations = 0;
  if (dir === 'up') rotations = 3;
  else if (dir === 'right') rotations = 2;
  else if (dir === 'down') rotations = 1;

  let working = board;
  for (let i = 0; i < rotations; i++) working = rotateLeft(working);
  const result = moveLeft(working);
  let finalBoard = result.board;
  for (let i = 0; i < (4 - rotations) % 4; i++) finalBoard = rotateLeft(finalBoard);
  return { board: finalBoard, gained: result.gained, moved: result.moved };
};

const hasMoves = (board: Board) => {
  if (board.some((row) => row.some((v) => v === 0))) return true;
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const v = board[r][c];
      if (c < SIZE - 1 && board[r][c + 1] === v) return true;
      if (r < SIZE - 1 && board[r + 1][c] === v) return true;
    }
  }
  return false;
};

const TILE_STYLES: Record<number, { bg: string; text: string; glow?: string }> = {
  2: { bg: '#1E293B', text: '#E2E8F0' },
  4: { bg: '#334155', text: '#F8FAFC' },
  8: { bg: '#B45309', text: '#FFFFFF', glow: '0 0 12px rgba(245,158,11,0.3)' },
  16: { bg: '#D97706', text: '#FFFFFF', glow: '0 0 14px rgba(245,158,11,0.4)' },
  32: { bg: '#EA580C', text: '#FFFFFF', glow: '0 0 16px rgba(234,88,12,0.5)' },
  64: { bg: '#DC2626', text: '#FFFFFF', glow: '0 0 18px rgba(220,38,38,0.5)' },
  128: { bg: '#EAB308', text: '#0F172A', glow: '0 0 20px rgba(234,179,8,0.6)' },
  256: { bg: '#FACC15', text: '#0F172A', glow: '0 0 22px rgba(250,204,21,0.7)' },
  512: { bg: '#06B6D4', text: '#0F172A', glow: '0 0 24px rgba(6,182,212,0.8)' },
  1024: { bg: '#3B82F6', text: '#FFFFFF', glow: '0 0 28px rgba(59,130,246,0.9)' },
  2048: { bg: 'linear-gradient(135deg, #10B981, #06B6D4)', text: '#FFFFFF', glow: '0 0 32px rgba(16,185,129,1)' },
};

export interface Game2048Props {
  onExit?: () => void;
  onBack?: () => void;
}

export const Game2048: React.FC<Game2048Props> = ({ onExit, onBack }) => {
  const handleExit = onExit || onBack || (() => {});
  const [board, setBoard] = useState<Board>(() => addRandomTile(addRandomTile(emptyBoard())));
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => Number(localStorage.getItem('2048-best') ?? 0));
  const [history, setHistory] = useState<{ board: Board; score: number }[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  const handleMove = (dir: 'left' | 'right' | 'up' | 'down') => {
    if (gameOver) return;
    const { board: next, gained, moved } = moveBoard(board, dir);
    if (!moved) return;

    setHistory((prev) => [...prev.slice(-5), { board, score }]);
    const nextWithRandom = addRandomTile(next);
    const nextScore = score + gained;
    setBoard(nextWithRandom);
    setScore(nextScore);

    if (nextScore > best) {
      setBest(nextScore);
      localStorage.setItem('2048-best', String(nextScore));
    }

    if (!hasMoves(nextWithRandom)) {
      setGameOver(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleExit();
      return;
    }
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') handleMove('left');
    else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') handleMove('right');
    else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') handleMove('up');
    else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') handleMove('down');
    else return;
    e.preventDefault();
  };

  const restart = () => {
    setBoard(addRandomTile(addRandomTile(emptyBoard())));
    setScore(0);
    setGameOver(false);
    setHistory([]);
    containerRef.current?.focus();
  };

  const undo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setBoard(prev.board);
    setScore(prev.score);
    setHistory((h) => h.slice(0, -1));
    setGameOver(false);
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="w-full h-full flex flex-col bg-[#050811] text-white select-none overflow-hidden relative outline-none"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-[#0A0E1A]/80 border-b border-amber-500/20 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="font-extrabold text-sm tracking-wider text-amber-400">2048 LOGIC MATRIX WIDESCREEN</span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="px-3 py-1 rounded-xl bg-white/[0.05] border border-white/10">
            PUNTOS: <strong className="text-amber-400 text-sm">{score}</strong>
          </div>
          <div className="px-3 py-1 rounded-xl bg-white/[0.05] border border-white/10 flex items-center gap-1">
            <FiAward className="w-3.5 h-3.5 text-amber-400" /> RÉCORD: <strong className="text-white">{best}</strong>
          </div>
        </div>
      </div>

      {/* Main Grid Screen */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 relative">
        <div className="w-full max-w-sm sm:max-w-md bg-[#0F1422] p-4 rounded-3xl border-2 border-amber-500/30 shadow-2xl shadow-amber-500/10 relative">
          <div className="grid grid-cols-4 gap-3 aspect-square">
            {board.map((row, r) =>
              row.map((val, c) => {
                const style = TILE_STYLES[val] || { bg: '#1E293B', text: '#FFFFFF' };
                return (
                  <motion.div
                    key={`${r}-${c}-${val}`}
                    initial={{ scale: val ? 1.1 : 1 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className="rounded-2xl flex items-center justify-center font-extrabold text-lg sm:text-2xl shadow-md select-none transition-colors"
                    style={{
                      background: val === 0 ? 'rgba(255,255,255,0.03)' : style.bg,
                      color: val === 0 ? 'transparent' : style.text,
                      boxShadow: val > 0 && style.glow ? style.glow : 'none',
                    }}
                  >
                    {val > 0 ? val : ''}
                  </motion.div>
                );
              })
            )}
          </div>

          {gameOver && (
            <div className="absolute inset-0 rounded-3xl flex flex-col items-center justify-center gap-3 bg-[#050811]/92 backdrop-blur-md z-20">
              <h2 className="text-2xl font-extrabold text-amber-400 tracking-tight">SIN MOVIMIENTOS</h2>
              <p className="text-xs text-slate-300 font-mono">Puntuación Final: <strong className="text-white">{score}</strong></p>
              <button
                onClick={restart}
                className="px-6 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-transform active:scale-95 shadow-lg"
              >
                Reiniciar Tablero
              </button>
            </div>
          )}
        </div>

        {/* Controls Bar & Mobile D-Pad */}
        <div className="flex items-center gap-3 mt-5">
          <button
            onClick={undo}
            disabled={history.length === 0}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 disabled:opacity-30 text-xs font-bold font-mono transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <FiRotateCcw className="w-3.5 h-3.5" /> Deshacer
          </button>
          <button
            onClick={restart}
            className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold font-mono transition-colors cursor-pointer"
          >
            Reiniciar
          </button>
        </div>
      </div>
    </div>
  );
};
