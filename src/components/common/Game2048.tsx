import React, { useEffect, useRef, useState } from 'react';

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

const move = (board: Board, dir: 'left' | 'right' | 'up' | 'down') => {
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

const TILE_COLORS: Record<number, string> = {
  2: 'bg-slate-800 text-slate-200',
  4: 'bg-slate-700 text-slate-100',
  8: 'bg-amber-700 text-white',
  16: 'bg-amber-600 text-white',
  32: 'bg-orange-600 text-white',
  64: 'bg-orange-500 text-white',
  128: 'bg-yellow-500 text-slate-950',
  256: 'bg-yellow-400 text-slate-950',
  512: 'bg-cyan-500 text-slate-950',
  1024: 'bg-cyan-400 text-slate-950',
  2048: 'bg-emerald-400 text-slate-950',
};

interface Game2048Props {
  onExit: () => void;
}

export const Game2048: React.FC<Game2048Props> = ({ onExit }) => {
  const [board, setBoard] = useState<Board>(() => addRandomTile(addRandomTile(emptyBoard())));
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => Number(localStorage.getItem('2048-best') ?? 0));
  const [over, setOver] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  const handleMove = (dir: 'left' | 'right' | 'up' | 'down') => {
    if (over) return;
    const result = move(board, dir);
    if (!result.moved) return;
    const withNewTile = addRandomTile(result.board);
    setBoard(withNewTile);
    setScore((s) => {
      const next = s + result.gained;
      setBest((b) => {
        const nb = Math.max(b, next);
        localStorage.setItem('2048-best', String(nb));
        return nb;
      });
      return next;
    });
    if (!hasMoves(withNewTile)) setOver(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { onExit(); return; }
    const map: Record<string, 'left' | 'right' | 'up' | 'down'> = {
      ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down',
    };
    if (map[e.key]) {
      e.preventDefault();
      handleMove(map[e.key]);
    }
  };

  const restart = () => {
    setBoard(addRandomTile(addRandomTile(emptyBoard())));
    setScore(0);
    setOver(false);
    containerRef.current?.focus();
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="outline-none flex flex-col items-center gap-2 py-2"
    >
      <div className="flex items-center justify-between w-full max-w-[272px] text-[10px] font-mono text-slate-400 uppercase tracking-wider">
        <span>Score: <span className="text-yellow-300">{score}</span> · Best: <span className="text-cyan-300">{best}</span></span>
        <span>↑↓←→ · ESC</span>
      </div>
      <div className="relative">
        <div className="grid grid-cols-4 gap-1.5 p-1.5 bg-slate-900 rounded-lg border border-yellow-500/20" style={{ width: 272 }}>
          {board.flatMap((row, r) =>
            row.map((v, c) => (
              <div
                key={`${r}-${c}`}
                className={`w-16 h-16 rounded-md flex items-center justify-center font-mono font-bold text-lg transition-colors ${
                  v === 0 ? 'bg-slate-950/60' : TILE_COLORS[v] ?? 'bg-emerald-300 text-slate-950'
                }`}
              >
                {v !== 0 ? v : ''}
              </div>
            ))
          )}
        </div>
        {over && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#080c14]/85 rounded-lg">
            <p className="text-red-400 font-mono text-xs font-bold">SIN MOVIMIENTOS</p>
            <button onClick={restart} className="text-cyan-300 underline text-xs font-mono">Jugar de nuevo</button>
            <button onClick={onExit} className="text-slate-500 underline text-[10px] font-mono">Volver a la terminal</button>
          </div>
        )}
      </div>
    </div>
  );
};
