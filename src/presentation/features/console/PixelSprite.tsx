import React, { useMemo } from 'react';
import type { CritterPalette } from './critterSprite';

interface PixelSpriteProps {
  grid: number[][];
  palette: CritterPalette;
  pixelSize?: number;
  className?: string;
}

export const PixelSprite: React.FC<PixelSpriteProps> = ({ grid, palette, pixelSize = 7, className }) => {
  const colorMap = useMemo(() => ({ 0: 'transparent', 1: palette[1], 2: palette[0], 3: palette[2], 4: palette[3], 5: palette[5] }), [palette]);
  const cols = grid[0]?.length ?? 0;

  return (
    <div
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, ${pixelSize}px)`,
        imageRendering: 'pixelated',
      }}
    >
      {grid.flatMap((row, y) =>
        row.map((v, x) => (
          <div key={`${x}-${y}`} style={{ width: pixelSize, height: pixelSize, background: colorMap[v as keyof typeof colorMap] }} />
        ))
      )}
    </div>
  );
};
