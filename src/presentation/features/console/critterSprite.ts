/** Procedurally builds a round "critter" sprite as a pixel grid — no image assets, always symmetric. */
export const makeCritterGrid = (size: number, bodySeed: number): number[][] => {
  const grid: number[][] = [];
  const r = size / 2;
  for (let y = 0; y < size; y++) {
    const row: number[] = [];
    for (let x = 0; x < size; x++) {
      const dx = x - r + 0.5;
      const dy = (y - r + 0.5) * 1.12;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const edge = dist > r - 1.6 && dist < r - 0.5;
      row.push(dist < r - 0.5 ? (edge ? 1 : 2) : 0);
    }
    grid.push(row);
  }
  // spots for texture, seeded so each critter looks a little different
  const spotCount = 3 + (bodySeed % 3);
  for (let i = 0; i < spotCount; i++) {
    const angle = ((i * 137.5 + bodySeed * 40) % 360) * (Math.PI / 180);
    const dist = r * 0.45;
    const sx = Math.round(r + Math.cos(angle) * dist);
    const sy = Math.round(r + Math.sin(angle) * dist * 1.1);
    if (grid[sy]?.[sx] === 2) grid[sy][sx] = 5;
  }
  // eyes
  const eyeY = Math.floor(size * 0.42);
  const eyeXOffset = Math.max(2, Math.floor(size * 0.24));
  [Math.round(r - eyeXOffset), Math.round(r + eyeXOffset)].forEach((ex) => {
    if (grid[eyeY]) grid[eyeY][ex] = 3;
    if (grid[eyeY + 1]) grid[eyeY + 1][ex] = 4;
  });
  return grid;
};

export type CritterPalette = [body: string, outline: string, eyeWhite: string, pupil: string, transparent: string, spot: string];

export const CRITTER_PALETTES: CritterPalette[] = [
  ['#8bd450', '#3f7a24', '#ffffff', '#1a1a1a', 'transparent', '#5fae30'],
  ['#ff8fa8', '#c94b6b', '#ffffff', '#1a1a1a', 'transparent', '#e0607f'],
  ['#7fb8ff', '#3d6fb8', '#ffffff', '#1a1a1a', 'transparent', '#5a90dd'],
  ['#ffd166', '#c99a2e', '#ffffff', '#1a1a1a', 'transparent', '#e0b040'],
  ['#c792ea', '#8a5aae', '#ffffff', '#1a1a1a', 'transparent', '#a56fc4'],
];
