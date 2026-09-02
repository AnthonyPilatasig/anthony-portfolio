import React, { useEffect, useRef, useState } from 'react';
import { FiAward, FiRotateCcw, FiZap, FiVolume2, FiArrowUp, FiArrowDown, FiArrowLeft, FiArrowRight } from 'react-icons/fi';

const GRID_COLS = 28;
const GRID_ROWS = 20;

interface Point {
  x: number;
  y: number;
}

export interface SnakeGameProps {
  onExit?: () => void;
  onBack?: () => void;
}

const randomCell = (snake: Point[]): Point => {
  let p: Point;
  do {
    p = {
      x: Math.floor(Math.random() * GRID_COLS),
      y: Math.floor(Math.random() * GRID_ROWS),
    };
  } while (snake.some(s => s.x === p.x && s.y === p.y));
  return p;
};

export const SnakeGame: React.FC<SnakeGameProps> = ({ onExit, onBack }) => {
  const handleExit = onExit || onBack || (() => {});
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({
    snake: [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }] as Point[],
    dir: { x: 1, y: 0 },
    nextDir: { x: 1, y: 0 },
    food: { x: 18, y: 10 } as Point,
  });

  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => Number(localStorage.getItem('snake-best') ?? 0));
  const [gameOver, setGameOver] = useState(false);
  const [speed, setSpeed] = useState<number>(90);

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx || gameOver) return;

    const cellW = canvas.width / GRID_COLS;
    const cellH = canvas.height / GRID_ROWS;

    const paint = () => {
      const s = stateRef.current;
      // Dark Neon background
      ctx.fillStyle = '#060B12';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Fine grid background
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.06)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += cellW) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += cellH) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Snake Body Glow
      s.snake.forEach((seg, i) => {
        const isHead = i === 0;
        ctx.fillStyle = isHead ? '#34D399' : '#10B981';
        ctx.shadowColor = '#10B981';
        ctx.shadowBlur = isHead ? 16 : 8;
        ctx.beginPath();
        ctx.roundRect(seg.x * cellW + 1, seg.y * cellH + 1, cellW - 2, cellH - 2, isHead ? 6 : 4);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Neon Apple Food
      ctx.fillStyle = '#F43F5E';
      ctx.shadowColor = '#F43F5E';
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(
        s.food.x * cellW + cellW / 2,
        s.food.y * cellH + cellH / 2,
        Math.min(cellW, cellH) / 2.5,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    paint();

    const interval = setInterval(() => {
      const s = stateRef.current;
      s.dir = s.nextDir;
      const head = { x: s.dir.x + s.snake[0].x, y: s.dir.y + s.snake[0].y };

      // Boundary check
      const hitsWall = head.x < 0 || head.x >= GRID_COLS || head.y < 0 || head.y >= GRID_ROWS;
      const hitsSelf = s.snake.some((seg) => seg.x === head.x && seg.y === head.y);

      if (hitsWall || hitsSelf) {
        setGameOver(true);
        setBest((prevBest) => {
          const next = Math.max(prevBest, s.snake.length - 3);
          localStorage.setItem('snake-best', String(next));
          return next;
        });
        return;
      }

      s.snake = [head, ...s.snake];
      if (head.x === s.food.x && head.y === s.food.y) {
        setScore((sc) => sc + 10);
        s.food = randomCell(s.snake);
      } else {
        s.snake.pop();
      }
      paint();
    }, speed);

    return () => clearInterval(interval);
  }, [gameOver, speed]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const s = stateRef.current;
    if (e.key === 'Escape') {
      handleExit();
      return;
    }
    if ((e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') && s.dir.y === 0) s.nextDir = { x: 0, y: -1 };
    else if ((e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') && s.dir.y === 0) s.nextDir = { x: 0, y: 1 };
    else if ((e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') && s.dir.x === 0) s.nextDir = { x: -1, y: 0 };
    else if ((e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') && s.dir.x === 0) s.nextDir = { x: 1, y: 0 };
    else return;
    e.preventDefault();
  };

  const restart = () => {
    const initialSnake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
    stateRef.current = {
      snake: initialSnake,
      dir: { x: 1, y: 0 },
      nextDir: { x: 1, y: 0 },
      food: randomCell(initialSnake),
    };
    setScore(0);
    setGameOver(false);
    containerRef.current?.focus();
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="w-full h-full flex flex-col bg-[#050811] text-white select-none overflow-hidden relative outline-none"
    >
      {/* Top Arcade Status Bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-[#0A0E1A]/80 border-b border-emerald-500/20 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-extrabold text-sm tracking-wider text-emerald-400">RETRO SNAKE 8-BIT DX</span>
        </div>

        <div className="flex items-center gap-6 text-xs font-mono">
          <span className="text-white flex items-center gap-1.5">
            SCORE: <strong className="text-emerald-400 text-sm font-bold">{score}</strong>
          </span>
          <span className="text-slate-400 flex items-center gap-1">
            <FiAward className="w-3.5 h-3.5 text-amber-400" /> RÉCORD: <strong className="text-amber-400">{best}</strong>
          </span>
        </div>
      </div>

      {/* Main Game Screen Stage */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 relative">
        <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500/30 shadow-2xl shadow-emerald-500/10 max-w-4xl w-full aspect-[28/20]">
          <canvas
            ref={canvasRef}
            width={840}
            height={600}
            className="w-full h-full block bg-[#060B12]"
          />

          {gameOver && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#050811]/90 backdrop-blur-md">
              <h2 className="text-3xl sm:text-4xl font-black text-rose-400 tracking-tight">FIN DE LA PARTIDA</h2>
              <p className="text-slate-300 text-sm font-mono">Puntuación alcanzada: <strong className="text-emerald-400 font-bold">{score}</strong></p>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={restart}
                  className="px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-transform active:scale-95 shadow-lg"
                >
                  Jugar de Nuevo
                </button>
                <button
                  onClick={handleExit}
                  className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  Volver al Menú
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile On-Screen D-Pad */}
        <div className="sm:hidden grid grid-cols-3 gap-2 mt-4 w-44">
          <div />
          <button onClick={() => { if (stateRef.current.dir.y === 0) stateRef.current.nextDir = { x: 0, y: -1 }; }} className="p-3 rounded-xl bg-white/10 flex items-center justify-center active:bg-white/20"><FiArrowUp /></button>
          <div />
          <button onClick={() => { if (stateRef.current.dir.x === 0) stateRef.current.nextDir = { x: -1, y: 0 }; }} className="p-3 rounded-xl bg-white/10 flex items-center justify-center active:bg-white/20"><FiArrowLeft /></button>
          <button onClick={() => { if (stateRef.current.dir.y === 0) stateRef.current.nextDir = { x: 0, y: 1 }; }} className="p-3 rounded-xl bg-white/10 flex items-center justify-center active:bg-white/20"><FiArrowDown /></button>
          <button onClick={() => { if (stateRef.current.dir.x === 0) stateRef.current.nextDir = { x: 1, y: 0 }; }} className="p-3 rounded-xl bg-white/10 flex items-center justify-center active:bg-white/20"><FiArrowRight /></button>
        </div>
      </div>
    </div>
  );
};
