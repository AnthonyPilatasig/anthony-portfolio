import React, { useEffect, useRef, useState } from 'react';

const GRID = 18;
const CELL = 16;

interface Point {
  x: number;
  y: number;
}

interface SnakeGameProps {
  onExit: () => void;
}

const randomCell = (): Point => ({
  x: Math.floor(Math.random() * GRID),
  y: Math.floor(Math.random() * GRID),
});

export const SnakeGame: React.FC<SnakeGameProps> = ({ onExit }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({
    snake: [{ x: 8, y: 8 }] as Point[],
    dir: { x: 1, y: 0 },
    nextDir: { x: 1, y: 0 },
    food: { x: 12, y: 8 } as Point,
  });
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => Number(localStorage.getItem('snake-best') ?? 0));
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || gameOver) return;

    const paint = () => {
      const s = stateRef.current;
      ctx.fillStyle = '#080c14';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      s.snake.forEach((seg, i) => {
        ctx.fillStyle = i === 0 ? '#facc15' : '#eab308';
        ctx.fillRect(seg.x * CELL, seg.y * CELL, CELL - 1, CELL - 1);
      });
      ctx.fillStyle = '#22d3ee';
      ctx.fillRect(s.food.x * CELL, s.food.y * CELL, CELL - 1, CELL - 1);
    };
    paint();

    const interval = setInterval(() => {
      const s = stateRef.current;
      s.dir = s.nextDir;
      const head = { x: s.snake[0].x + s.dir.x, y: s.snake[0].y + s.dir.y };

      const hitsWall = head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID;
      const hitsSelf = s.snake.some((seg) => seg.x === head.x && seg.y === head.y);
      if (hitsWall || hitsSelf) {
        setGameOver(true);
        setBest((prevBest) => {
          const next = Math.max(prevBest, s.snake.length - 1);
          localStorage.setItem('snake-best', String(next));
          return next;
        });
        return;
      }

      s.snake = [head, ...s.snake];
      if (head.x === s.food.x && head.y === s.food.y) {
        setScore((sc) => sc + 1);
        s.food = randomCell();
      } else {
        s.snake.pop();
      }
      paint();
    }, 120);

    return () => clearInterval(interval);
  }, [gameOver]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const s = stateRef.current;
    if (e.key === 'Escape') {
      onExit();
      return;
    }
    if (e.key === 'ArrowUp' && s.dir.y === 0) s.nextDir = { x: 0, y: -1 };
    else if (e.key === 'ArrowDown' && s.dir.y === 0) s.nextDir = { x: 0, y: 1 };
    else if (e.key === 'ArrowLeft' && s.dir.x === 0) s.nextDir = { x: -1, y: 0 };
    else if (e.key === 'ArrowRight' && s.dir.x === 0) s.nextDir = { x: 1, y: 0 };
    else return;
    e.preventDefault();
  };

  const restart = () => {
    stateRef.current = {
      snake: [{ x: 8, y: 8 }],
      dir: { x: 1, y: 0 },
      nextDir: { x: 1, y: 0 },
      food: randomCell(),
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
      className="outline-none flex flex-col items-center gap-2 py-2"
    >
      <div className="flex items-center justify-between w-full max-w-[288px] text-[10px] font-mono text-slate-400 uppercase tracking-wider">
        <span>Score: <span className="text-yellow-300">{score}</span> · Best: <span className="text-cyan-300">{best}</span></span>
        <span>↑↓←→ · ESC</span>
      </div>
      <div className="relative">
        <canvas ref={canvasRef} width={GRID * CELL} height={GRID * CELL} className="rounded-lg border border-yellow-500/20" />
        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#080c14]/85 rounded-lg">
            <p className="text-red-400 font-mono text-xs font-bold">GAME OVER</p>
            <button onClick={restart} className="text-cyan-300 underline text-xs font-mono">
              Jugar de nuevo
            </button>
            <button onClick={onExit} className="text-slate-500 underline text-[10px] font-mono">
              Volver a la terminal
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
