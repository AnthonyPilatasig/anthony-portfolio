import type { ConsoleGame } from '../ConsoleDashboard';

export type ConsoleThemeId = 'apdeck' | 'hibrida' | 'ondas' | 'canales' | 'pixel';

export interface ConsoleThemeInfo {
  id: ConsoleThemeId;
  name: string;
  /** Which generation of consoles inspired it (shown in the picker). */
  inspiration: string;
  /** Swatch colors for the picker preview. */
  swatch: [string, string, string];
}

export const CONSOLE_THEMES: ConsoleThemeInfo[] = [
  { id: 'apdeck', name: 'AP-Deck', inspiration: 'Consolas de nueva generación', swatch: ['#050811', '#38BDF8', '#F43F5E'] },
  { id: 'hibrida', name: 'Híbrida', inspiration: 'Consolas híbridas portátiles', swatch: ['#EBEBEB', '#2D2D2D', '#00C3E3'] },
  { id: 'ondas', name: 'Ondas', inspiration: 'Menús de barra cruzada', swatch: ['#0B1C3D', '#4F7BD8', '#FFFFFF'] },
  { id: 'canales', name: 'Canales', inspiration: 'Consolas de sala familiares', swatch: ['#F4F6F8', '#34BEED', '#9AA5B1'] },
  { id: 'pixel', name: 'Pixel 8-bit', inspiration: 'Portátiles de pantalla verde', swatch: ['#0F380F', '#8BAC0F', '#9BBC0F'] },
];

/** Colors (and font) of the bar shown above a running game, so games keep the theme. */
export interface ConsoleChrome {
  bar: string;
  border: string;
  text: string;
  muted: string;
  accent: string;
  accentText: string;
  /** Background behind the launch transition. */
  stage: string;
  font?: string;
}

export const THEME_CHROME: Record<ConsoleThemeId, ConsoleChrome> = {
  apdeck: { bar: 'rgba(4,5,11,0.82)', border: 'rgba(255,255,255,0.1)', text: '#FFFFFF', muted: '#94A3B8', accent: '#38BDF8', accentText: '#04050B', stage: '#04050B' },
  hibrida: { bar: '#EBEBEB', border: '#D0D0D0', text: '#2D2D2D', muted: '#5B5B5B', accent: '#00C3E3', accentText: '#FFFFFF', stage: '#EBEBEB' },
  ondas: { bar: '#0B1C3D', border: 'rgba(255,255,255,0.14)', text: '#FFFFFF', muted: 'rgba(255,255,255,0.7)', accent: '#4F7BD8', accentText: '#FFFFFF', stage: '#0B1C3D' },
  canales: { bar: '#F4F6F8', border: '#C9D1D9', text: '#3C454F', muted: '#56606B', accent: '#34BEED', accentText: '#FFFFFF', stage: '#F4F6F8' },
  pixel: { bar: '#9BBC0F', border: '#306230', text: '#0F380F', muted: '#306230', accent: '#306230', accentText: '#9BBC0F', stage: '#0F380F', font: "'Press Start 2P', monospace" },
};

/** Everything a theme's home screen needs; actions are the console's existing ones. */
export interface ConsoleHomeProps {
  games: ConsoleGame[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  onLaunch: (game: ConsoleGame) => void;
  /** Real result shown for a game: saved high score where it exists, its label otherwise. */
  recordLabel: (game: ConsoleGame) => string;
  showInfo: boolean;
  onToggleInfo: () => void;
  currentTime: string;
  online: boolean;
  battery: { level: number; charging: boolean } | null;
  soundEnabled: boolean;
  crtEnabled: boolean;
  onOpenTrophies: () => void;
  onOpenSettings: () => void;
  onToggleCrt: () => void;
  onToggleSound: () => void;
  onOpenThemes: () => void;
  onExit: () => void;
}
