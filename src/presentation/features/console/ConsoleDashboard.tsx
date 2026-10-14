import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMaximize2, FiMinimize2, FiTv, FiVolume2, FiVolumeX,
  FiSettings, FiAward, FiUpload, FiChevronLeft, FiDroplet
} from 'react-icons/fi';
import { Gamepad2 } from 'lucide-react';
import JSZip from 'jszip';
import { GAME_COVERS } from '@infrastructure/data/gameCovers.data';
import { useDeviceStatus } from './useDeviceStatus';
import { useGamepadNavigation } from './useGamepadNavigation';
import { CONSOLE_THEMES, THEME_CHROME, type ConsoleThemeId, type ConsoleHomeProps } from './themes/types';
import { loadConsoleTheme, saveConsoleTheme } from './themes/themeStore';
import { ThemePicker } from './themes/ThemePicker';
import { HibridaHome } from './themes/HibridaHome';
import { OndasHome } from './themes/OndasHome';
import { CanalesHome } from './themes/CanalesHome';
import { PixelHome } from './themes/PixelHome';
import { AuroraHome } from './themes/AuroraHome';

const THEME_HOMES: Record<ConsoleThemeId, React.FC<ConsoleHomeProps>> = {
  apdeck: AuroraHome,
  hibrida: HibridaHome,
  ondas: OndasHome,
  canales: CanalesHome,
  pixel: PixelHome,
};
// Old-TV switch: screen collapses (crt-off), the theme changes, screen reopens (crt-on).
const CRT_OFF_MS = 320;
const CRT_ON_MS = 380;
import { NeonBreaker, NEON_BREAKER_BEST_KEY } from './NeonBreaker';
import { SnakeGame } from './SnakeGame';
import { Game2048 } from './Game2048';
import { RpgMakerPlayer } from './RpgMakerPlayer';

// ─── Modern Console Audio Synthesizer (AP-Deck OS audio feedback) ──────────────
class ModernConsoleAudio {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  playNavigate() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(659.25, now); // E5
      osc.frequency.exponentialRampToValueAtTime(987.77, now + 0.03); // B5
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1800, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.045);
    } catch { /* audio not available */ }
  }

  playLaunch() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const now = this.ctx.currentTime;
      const notes = [440, 554.37, 659.25, 880]; // A major chord arpeggio
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);
        gain.gain.setValueAtTime(0.1, now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.04 + 0.28);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.04);
        osc.stop(now + idx * 0.04 + 0.3);
      });
    } catch { /* audio not available */ }
  }

  playBack() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.08);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } catch { /* audio not available */ }
  }
}

const consoleAudio = new ModernConsoleAudio();

// ─── Game Types & Catalogue ──────────────────────────────────────────────────
export interface ConsoleGame {
  id: string;
  title: string;
  badge: string;
  platform: string;
  genre: string;
  playtime: string;
  trophies: string;
  bgGradient: string;
  accentColor: string;
  description: string;
  type: 'cartridge' | 'rpgmaker' | 'breaker' | 'snake' | '2048';
  src?: string;
  coverArt: string;
  tags: string[];
}

const CONSOLE_GAMES: ConsoleGame[] = [
  {
    id: 'rpg-maker',
    title: 'Motor RPG Maker & Pokémon Essentials',
    badge: 'UNIVERSAL RGSS',
    platform: 'Cualquier Juego RPG Maker / Essentials',
    genre: 'RPG Maker XP / VX / Ace / Essentials',
    playtime: 'Ilimitado',
    trophies: 'Modo Aventura',
    bgGradient: 'from-rose-950 via-pink-950 to-[#050811]',
    accentColor: '#F43F5E',
    description: 'Lanza y ejecuta cualquier juego de RPG Maker XP, VX, Ace y proyectos de Pokémon Essentials (.zip) de forma dinámica con extracción en RAM a 60 FPS.',
    type: 'rpgmaker',
    coverArt: GAME_COVERS.retroArch,
    tags: ['Universal RPG Maker', 'Pokémon Essentials', 'Cualquier .ZIP', '100% Local'],
  },
  {
    id: 'cartridge-slot',
    title: 'Intérprete WebAssembly Universal',
    badge: 'UNIVERSAL WASM',
    platform: 'Virtual Bytecode Engine',
    genre: 'Multi-Consola (WASM)',
    playtime: 'Guardado Local',
    trophies: 'WASM Runtimes',
    bgGradient: 'from-red-950 via-slate-900 to-[#050811]',
    accentColor: '#EF4444',
    description: 'Entorno universal WebAssembly con auto-detección instantánea. Ejecuta Nintendo DS (.nds), PlayStation 1 (.iso/.chd), Nintendo 64 (.z64), Game Boy Advance (.gba), Super Nintendo (.sfc) y Sega Genesis (.md).',
    type: 'cartridge',
    coverArt: GAME_COVERS.retroArch,
    src: './games/cartridge/index.html',
    tags: ['Auto-Detección', 'GBA / NDS / PS1 / N64', 'SNES / Genesis', '100% Local'],
  },
  {
    id: 'neon-breaker',
    title: 'Neon Breaker',
    badge: 'ARCADE',
    platform: 'Canvas 2D · 60 FPS',
    genre: 'Rompe bloques',
    playtime: '', // reemplazado en vivo por el récord real guardado en este navegador
    trophies: 'Récord local',
    bgGradient: 'from-fuchsia-950 via-violet-950 to-[#050811]',
    accentColor: '#D946EF',
    description: 'Rompe bloques con física de rebote según el punto de impacto, niveles generados con patrones, bloques de acero, potenciadores (paleta ancha, multibola, cámara lenta, vida extra) y combos. Se juega con mouse, táctil, teclado o mando.',
    type: 'breaker',
    coverArt: GAME_COVERS.neonBreaker,
    tags: ['Niveles infinitos', 'Potenciadores', 'Combos', 'Mando'],
  },
  {
    id: 'retro-snake',
    title: 'Retro Snake 8-Bit DX',
    badge: 'CLASSIC ARCADE',
    platform: '8-Bit Matrix Engine',
    genre: 'Arcade Classic',
    playtime: '', // reemplazado en vivo por el récord real guardado en este navegador
    trophies: 'Récord local',
    bgGradient: 'from-emerald-950 via-teal-950 to-[#050811]',
    accentColor: '#10B981',
    description: 'Recreación retro de la clásica serpiente con física de rejilla matemática, sintetizador sonoro Chiptune y selector de dificultad.',
    type: 'snake',
    coverArt: GAME_COVERS.snake8bit,
    tags: ['High Score', 'Física Retro', '8-Bit Synth', 'D-Pad'],
  },
  {
    id: 'matrix-2048',
    title: '2048 Logic Matrix',
    badge: 'PUZZLE LOGIC',
    platform: 'Binary Array Grid',
    genre: 'Math Puzzle',
    playtime: '', // reemplazado en vivo por el récord real guardado en este navegador
    trophies: 'Récord local',
    bgGradient: 'from-amber-950 via-orange-950 to-[#050811]',
    accentColor: '#F59E0B',
    description: 'Desliza y fusiona potencias de dos hasta alcanzar el bloque 2048 en una matriz algorítmica optimizada.',
    type: '2048',
    coverArt: GAME_COVERS.matrix2048,
    tags: ['Touch Gestures', 'Matriz 4x4', 'Algoritmo', 'Minimalista'],
  },
];

interface ConsoleDashboardProps {
  embeddedFullscreen?: boolean;
}

// Leaving the emulator with a full page load (not client-side navigation) drops the
// cross-origin isolation /console needs, so third-party embeds like Spotify work again.
const exitConsole = () => window.location.assign(`${import.meta.env.BASE_URL}zona-interactiva`);

// The full power-on sequence plays once per browser session; later visits get a short one.
const BOOT_SEEN_KEY = 'apdeck-boot-seen';
const bootDuration = () => {
  try {
    return sessionStorage.getItem(BOOT_SEEN_KEY) ? 450 : 2100;
  } catch {
    return 450;
  }
};
// How long the "launching game" zoom plays over the game while it starts.
const LAUNCH_FX_MS = 900;

export const ConsoleDashboard: React.FC<ConsoleDashboardProps> = ({ embeddedFullscreen = false }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeRunningGame, setActiveRunningGame] = useState<ConsoleGame | null>(null);
  const [currentTime, setCurrentTime] = useState('');
  const [crtEnabled, setCrtEnabled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controllerConnected, setControllerConnected] = useState(() => {
    if (typeof navigator === 'undefined' || typeof navigator.getGamepads !== 'function') return false;
    const pads = navigator.getGamepads();
    return !!pads && Array.from(pads).some(p => p !== null);
  });
  const [showTrophies, setShowTrophies] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const [showGameInfo, setShowGameInfo] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const [booted, setBooted] = useState(false);
  const [bootMs] = useState(bootDuration);
  // Visual-only: the game being "launched" while the zoom transition plays.
  const [launchFx, setLaunchFx] = useState<ConsoleGame | null>(null);
  const launchFxTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { online, battery } = useDeviceStatus();
  const [theme, setTheme] = useState<ConsoleThemeId>(loadConsoleTheme);
  const [showThemes, setShowThemes] = useState(false);
  const [crtPhase, setCrtPhase] = useState<'idle' | 'off' | 'on'>('idle');
  const crtTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const applyTheme = useCallback((id: ConsoleThemeId) => {
    setShowThemes(false);
    if (id === theme) return;
    if (soundEnabled) consoleAudio.playLaunch();
    crtTimers.current.forEach(clearTimeout);
    setCrtPhase('off');
    crtTimers.current = [
      setTimeout(() => {
        setTheme(id);
        saveConsoleTheme(id);
        setCrtPhase('on');
      }, CRT_OFF_MS),
      setTimeout(() => setCrtPhase('idle'), CRT_OFF_MS + CRT_ON_MS),
    ];
  }, [theme, soundEnabled]);

  useEffect(() => () => crtTimers.current.forEach(clearTimeout), []);
  // Real high scores this browser has actually saved — no invented stats.
  const [snakeBest, setSnakeBest] = useState(() => Number(localStorage.getItem('snake-best') ?? 0));
  const [matrixBest, setMatrixBest] = useState(() => Number(localStorage.getItem('2048-best') ?? 0));
  const [breakerBest, setBreakerBest] = useState(() => Number(localStorage.getItem(NEON_BREAKER_BEST_KEY) ?? 0));

  // Cartridge loader state
  const [cartridgeRomLoaded, setCartridgeRomLoaded] = useState(false);
  const [rpgMakerFile, setRpgMakerFile] = useState<File | null>(null);
  const cartridgeFileInputRef = useRef<HTMLInputElement>(null);

  const handleCartridgeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.name.toLowerCase().endsWith('.zip')) {
      try {
        const zip = new JSZip();
        const zipLoaded = await zip.loadAsync(file);
        const isRpg = Object.keys(zipLoaded.files).some(p => {
          const l = p.toLowerCase();
          return l.endsWith('scripts.rxdata') || l.endsWith('game.ini') || l.includes('data/scripts.rxdata');
        });
        if (isRpg) {
          setRpgMakerFile(file);
          const rpgGame = CONSOLE_GAMES.find(g => g.id === 'rpg-maker') ?? CONSOLE_GAMES[0];
          setActiveRunningGame(rpgGame);
          return;
        }
      } catch { /* not an RPG Maker package, fall through to ROM loader */ }
    }

    const arrayBuffer = await file.arrayBuffer();
    const iframe = document.getElementById('cartridgeIframe') as HTMLIFrameElement;
    if (iframe?.contentWindow) {
      iframe.contentWindow.postMessage({
        type: 'LOAD_ROM_DATA',
        name: file.name,
        data: arrayBuffer,
      }, window.location.origin);
    }
    setCartridgeRomLoaded(true);
  };

  // Time ticker
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setCurrentTime(d.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Gamepad Detection
  useEffect(() => {
    const handleConnect = () => setControllerConnected(true);
    const handleDisconnect = () => setControllerConnected(false);
    window.addEventListener('gamepadconnected', handleConnect);
    window.addEventListener('gamepaddisconnected', handleDisconnect);
    return () => {
      window.removeEventListener('gamepadconnected', handleConnect);
      window.removeEventListener('gamepaddisconnected', handleDisconnect);
    };
  }, []);

  const selectedGame = CONSOLE_GAMES[selectedIndex];

  const selectGame = useCallback((updater: number | ((prev: number) => number)) => {
    setShowGameInfo(false);
    setSelectedIndex(prev => (typeof updater === 'function' ? updater(prev) : updater));
  }, []);

  const isCoarsePointer = () =>
    typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

  const launchGame = useCallback((game: ConsoleGame) => {
    if (soundEnabled) consoleAudio.playLaunch();
    // Console-style zoom over the game while it starts (purely visual).
    setLaunchFx(game);
    if (launchFxTimer.current) clearTimeout(launchFxTimer.current);
    launchFxTimer.current = setTimeout(() => setLaunchFx(null), LAUNCH_FX_MS);
    setActiveRunningGame(game);
    if (isCoarsePointer() && containerRef.current) {
      containerRef.current.requestFullscreen()
        .then(() => {
          setIsFullscreen(true);
          const orientation = screen.orientation as ScreenOrientation & { lock?: (o: string) => Promise<void> };
          orientation?.lock?.('landscape').catch(() => { /* orientation lock unsupported */ });
        })
        .catch(() => { /* fullscreen request rejected */ });
    }
  }, [soundEnabled]);

  const closeGame = useCallback(() => {
    if (soundEnabled) consoleAudio.playBack();
    setActiveRunningGame(null);
    setCartridgeRomLoaded(false);
    // Pick up any new high score the player just set before returning to the shelf.
    setSnakeBest(Number(localStorage.getItem('snake-best') ?? 0));
    setMatrixBest(Number(localStorage.getItem('2048-best') ?? 0));
    setBreakerBest(Number(localStorage.getItem(NEON_BREAKER_BEST_KEY) ?? 0));
    const orientation = screen.orientation as ScreenOrientation & { unlock?: () => void };
    orientation?.unlock?.();
    if (document.fullscreenElement) document.exitFullscreen().catch(() => { /* already exited */ });
    setIsFullscreen(false);
  }, [soundEnabled]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => { /* fullscreen request rejected */ });
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => { /* already exited */ });
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // During the power-on sequence any key just skips it (and never launches a game).
      if (!booted) {
        e.preventDefault();
        setBooted(true);
        return;
      }
      if (activeRunningGame) {
        if (e.key === 'Escape' && !document.fullscreenElement) {
          if (soundEnabled) consoleAudio.playBack();
          setActiveRunningGame(null);
        }
        return;
      }
      if (e.key === 't' || e.key === 'T') {
        setShowThemes(true);
        return;
      }
      if (e.key === 'x' || e.key === 'X') {
        setShowGameInfo(v => !v);
        return;
      }
      // Vertical-list themes (Ondas, Pixel) navigate with ↑ ↓ too.
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        selectGame(prev => {
          const next = (prev + 1) % CONSOLE_GAMES.length;
          if (soundEnabled) consoleAudio.playNavigate();
          return next;
        });
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        selectGame(prev => {
          const next = (prev - 1 + CONSOLE_GAMES.length) % CONSOLE_GAMES.length;
          if (soundEnabled) consoleAudio.playNavigate();
          return next;
        });
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const selected = CONSOLE_GAMES[selectedIndex];
        launchGame(selected);
      } else if (e.key === 'Escape') {
        exitConsole();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, activeRunningGame, soundEnabled, launchGame, selectGame, booted]);

  // Gamepad: same menu actions as the keyboard, on the home screen only (games read
  // the controller themselves).
  useGamepadNavigation(controllerConnected && booted && !activeRunningGame, {
    left: () => {
      selectGame(prev => (prev - 1 + CONSOLE_GAMES.length) % CONSOLE_GAMES.length);
      if (soundEnabled) consoleAudio.playNavigate();
    },
    right: () => {
      selectGame(prev => (prev + 1) % CONSOLE_GAMES.length);
      if (soundEnabled) consoleAudio.playNavigate();
    },
    confirm: () => launchGame(CONSOLE_GAMES[selectedIndex]),
    info: () => setShowGameInfo(v => !v),
    back: () => {
      if (showTrophies || showSettings) {
        setShowTrophies(false);
        setShowSettings(false);
      } else {
        setShowGameInfo(false);
      }
      if (soundEnabled) consoleAudio.playBack();
    },
  });

  useEffect(() => () => {
    if (launchFxTimer.current) clearTimeout(launchFxTimer.current);
  }, []);

  // Portrait detector
  useEffect(() => {
    const mq = window.matchMedia('(orientation: portrait) and (max-width: 900px)');
    const update = () => setIsPortrait(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Fullscreen change listener
  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // Power-on sequence when the console first mounts (full once per session, short after)
  useEffect(() => {
    const t = setTimeout(() => setBooted(true), bootMs);
    try {
      sessionStorage.setItem(BOOT_SEEN_KEY, '1');
    } catch { /* storage unavailable */ }
    return () => clearTimeout(t);
  }, [bootMs]);

  // Same real records the AP-Deck home shows, shared with every theme.
  const recordValue = (game: ConsoleGame): string | null =>
    game.id === 'retro-snake' ? `${snakeBest} pts`
    : game.id === 'matrix-2048' ? `${matrixBest}`
    : game.id === 'neon-breaker' ? `${breakerBest} pts`
    : null;
  const recordLabel = (game: ConsoleGame) => {
    const value = recordValue(game);
    return value ? `Récord en este navegador: ${value}` : game.trophies;
  };

  const ThemeHome = THEME_HOMES[theme];
  const chrome = THEME_CHROME[theme];
  const homeProps: ConsoleHomeProps = {
    games: CONSOLE_GAMES,
    selectedIndex,
    onSelect: (idx) => {
      selectGame(idx);
      if (soundEnabled) consoleAudio.playNavigate();
    },
    onLaunch: launchGame,
    recordLabel,
    showInfo: showGameInfo,
    onToggleInfo: () => setShowGameInfo(v => !v),
    currentTime,
    online,
    battery,
    soundEnabled,
    crtEnabled,
    onOpenTrophies: () => setShowTrophies(true),
    onOpenSettings: () => setShowSettings(true),
    onToggleCrt: () => setCrtEnabled(v => !v),
    onToggleSound: () => setSoundEnabled(v => !v),
    onOpenThemes: () => setShowThemes(true),
    onExit: exitConsole,
  };

  const rootClasses = embeddedFullscreen
    ? 'fixed inset-0 h-[100dvh] w-[100dvw] z-[9999] bg-[#050811] flex flex-col overflow-hidden select-none'
    : `relative w-full bg-[#050811] flex flex-col overflow-hidden select-none ${isFullscreen ? 'fixed inset-0 z-50 rounded-none h-[100dvh] w-[100dvw]' : 'h-[85dvh] max-h-[820px] rounded-[28px] shadow-2xl'}`;

  return (
    <div ref={containerRef} className={rootClasses} style={{ fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif" }}>

      {/* ─── Power-On Sequence (full once per session; any key or tap skips it) ─ */}
      <AnimatePresence>
        {!booted && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            onClick={() => setBooted(true)}
            className="absolute inset-0 z-[60] bg-[#050811] flex flex-col items-center justify-center gap-6 cursor-pointer"
            role="status"
            aria-label="Encendiendo AP-Deck OS"
          >
            {bootMs > 1000 ? (
              <>
                <motion.div
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="relative w-28 h-28 flex items-center justify-center"
                >
                  <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
                    <circle
                      cx="50" cy="50" r="48" fill="none" strokeWidth="2.5" strokeLinecap="round"
                      stroke="url(#boot-ring-gradient)" className="console-boot-ring"
                    />
                    <defs>
                      <linearGradient id="boot-ring-gradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#38BDF8" />
                        <stop offset="100%" stopColor="#A78BFA" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <motion.span
                    initial={{ opacity: 0, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                    transition={{ delay: 0.55, duration: 0.5 }}
                    className="text-3xl font-black text-white tracking-tight"
                    style={{ textShadow: '0 0 24px rgba(56,189,248,0.6)' }}
                  >
                    AP
                  </motion.span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, letterSpacing: '0.6em' }}
                  animate={{ opacity: 1, letterSpacing: '0.3em' }}
                  transition={{ delay: 0.9, duration: 0.7, ease: 'easeOut' }}
                  className="text-sm font-bold text-slate-200 uppercase"
                >
                  AP-Deck OS
                </motion.div>

                <div className="w-40 h-[3px] rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ delay: 0.4, duration: (bootMs - 500) / 1000, ease: 'easeInOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-sky-400 to-violet-400"
                  />
                </div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ delay: 1.2 }}
                  className="absolute bottom-8 text-[11px] text-slate-400"
                >
                  Pulsa cualquier tecla o toca para continuar
                </motion.p>
              </>
            ) : (
              <motion.div
                initial={{ scaleX: 0.2, opacity: 0 }}
                animate={{ scaleX: [0.2, 1, 1], opacity: [0, 1, 0] }}
                transition={{ duration: bootMs / 1000, times: [0, 0.55, 1], ease: 'easeInOut' }}
                className="h-[2px] w-2/3 max-w-xs"
                style={{ background: `linear-gradient(90deg, transparent, ${selectedGame.accentColor}, transparent)` }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Game Launch Transition (cover zooms in over the starting game) ─── */}
      <AnimatePresence>
        {launchFx && (
          <motion.div
            key={launchFx.id}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0 z-[55] flex flex-col items-center justify-center gap-5 pointer-events-none"
            style={{ background: `radial-gradient(circle at 50% 45%, ${launchFx.accentColor}55 0%, ${chrome.stage} 70%)` }}
            aria-hidden
          >
            <motion.img
              src={launchFx.coverArt}
              alt=""
              initial={{ scale: 0.55, opacity: 0, rotate: -3 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              className="w-40 h-40 sm:w-52 sm:h-52 rounded-[28px] object-cover"
              style={{ boxShadow: `0 0 0 2px ${launchFx.accentColor}, 0 30px 80px -10px ${launchFx.accentColor}` }}
            />
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="font-bold text-lg text-center px-6"
              style={{ color: chrome.text === '#FFFFFF' || chrome.stage === '#0F380F' ? '#FFFFFF' : chrome.text, fontFamily: chrome.font }}
            >
              {launchFx.title}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── MAIN CONSOLE STAGE ─────────────────────────────────────────────── */}
      <div
        className={`relative z-10 flex flex-1 min-h-0 overflow-hidden ${crtPhase === 'off' ? 'crt-off' : crtPhase === 'on' ? 'crt-on' : ''}`}
      >

        {/* CRT Scanline Filter */}
        {crtEnabled && (
          <div
            className="pointer-events-none absolute inset-0 z-20 opacity-20"
            style={{
              backgroundImage: 'linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.5) 50%)',
              backgroundSize: '100% 4px',
            }}
          />
        )}

        {/* Mobile rotate reminder */}
        {activeRunningGame && isPortrait && (
          <div className="absolute inset-0 z-50 bg-[#050811]/95 backdrop-blur-sm flex flex-col items-center justify-center gap-4 text-center px-8">
            <motion.div
              animate={{ rotate: [0, 90, 90, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', times: [0, 0.5, 0.85, 1] }}
              className="text-white"
            >
              <FiTv className="w-12 h-12" />
            </motion.div>
            <p className="text-white font-semibold">Gira tu dispositivo</p>
            <p className="text-slate-400 text-sm max-w-xs">Gira a modo horizontal para disfrutar la pantalla completa.</p>
          </div>
        )}

        {/* ── STATE A: ACTIVE RUNNING GAME ──────────────────────────────────── */}
        {activeRunningGame ? (
          <div className="flex-1 flex flex-col min-h-0 bg-black">
            {/* In-game Quick Menu Bar (hidden when rpgmaker is active to avoid duplicate headers) */}
            {activeRunningGame.type !== 'rpgmaker' && (
              <div
                className="flex items-center justify-between px-3 sm:px-6 py-1.5 sm:py-2.5 shrink-0"
                style={{ background: chrome.bar, borderBottom: `1px solid ${chrome.border}`, color: chrome.text, fontFamily: chrome.font }}
              >
                <button
                  onClick={closeGame}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-xs transition-all hover:opacity-80 active:scale-95"
                  style={{ border: `1px solid ${chrome.border}` }}
                >
                  <FiChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Menú Principal</span>
                </button>

              <div className="flex items-center gap-2.5 font-bold text-sm truncate max-w-[50vw]">
                <span className="w-2.5 h-2.5 rounded-full animate-pulse shrink-0" style={{ background: chrome.accent }} />
                <span className="truncate">{activeRunningGame.title}</span>
              </div>

              <div className="flex items-center gap-2">
                {activeRunningGame.type === 'cartridge' && (
                  <button
                    onClick={() => cartridgeFileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-bold text-xs shadow-lg transition-transform active:scale-95 cursor-pointer hover:opacity-90"
                    style={{ background: chrome.accent, color: chrome.accentText }}
                  >
                    <FiUpload className="w-3.5 h-3.5" />
                    <span>Cargar Archivo</span>
                  </button>
                )}
                <button
                  onClick={() => setCrtEnabled(!crtEnabled)}
                  className="p-2 rounded-full transition-colors cursor-pointer"
                  style={{
                    border: `1px solid ${crtEnabled ? chrome.accent : chrome.border}`,
                    color: crtEnabled ? chrome.accent : chrome.muted,
                  }}
                  title="Filtro CRT Scanlines"
                >
                  <FiTv className="w-4 h-4" />
                </button>
                <button
                  onClick={toggleFullscreen}
                  className="p-2 rounded-full transition-colors cursor-pointer"
                  style={{ border: `1px solid ${chrome.border}`, color: chrome.muted }}
                  title="Pantalla Completa"
                >
                  {isFullscreen ? <FiMinimize2 className="w-4 h-4" /> : <FiMaximize2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
            )}

            {/* Game Screen Frame */}
            <div className="flex-1 min-h-0 flex items-stretch bg-black relative">
              {activeRunningGame.type === 'cartridge' && (
                <div className="relative w-full h-full flex-1 flex items-stretch">
                  <iframe
                    id="cartridgeIframe"
                    src={activeRunningGame.src}
                    title={activeRunningGame.title}
                    className="w-full h-full border-0 bg-black flex-1"
                    allow="autoplay; fullscreen; gamepad"
                    sandbox="allow-scripts allow-same-origin allow-pointer-lock"
                  />
                  <AnimatePresence>
                    {!cartridgeRomLoaded && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-40 flex items-center justify-center p-6 bg-black/85 backdrop-blur-md"
                      >
                        <div className="max-w-md w-full bg-[#0F172A] border-2 border-rose-500/40 rounded-3xl p-8 text-center shadow-2xl shadow-rose-500/20 flex flex-col items-center gap-4">
                          <div className="w-16 h-16 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 text-3xl shadow-lg">
                            <Gamepad2 className="w-8 h-8" />
                          </div>
                          <h3 className="text-xl font-bold text-white">Cargar Archivo de Juego</h3>
                          <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
                            Selecciona tu juego o ROM personal (<strong>Pokémon Reminiscencia / RPG Maker</strong>, <strong>.gba</strong>, <strong>.nds</strong>, <strong>.iso (PS1)</strong>, <strong>.z64</strong>, <strong>.sfc</strong>, <strong>.zip</strong>) con <strong>auto-detección automática de motor</strong>.
                          </p>
                          <button
                            onClick={() => cartridgeFileInputRef.current?.click()}
                            className="px-7 py-3 rounded-full font-bold text-xs bg-white hover:bg-slate-100 text-slate-950 shadow-xl transition-transform active:scale-95 flex items-center gap-2 cursor-pointer mt-2"
                          >
                            <FiUpload className="w-4 h-4" />
                            <span>Seleccionar Archivo desde tu PC</span>
                          </button>
                          <div className="flex flex-wrap gap-1 justify-center max-w-xs pt-1">
                            {['RPG Maker / Reminiscencia', 'GBA', 'NDS', 'PS1', 'N64', 'SNES', 'Mega Drive', 'ZIP'].map(c => (
                              <span key={c} className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                                {c}
                              </span>
                            ))}
                          </div>
                          <span className="text-[11px] text-slate-500">o arrastra tu archivo directamente a esta ventana</span>

                          <button
                            onClick={() => setCartridgeRomLoaded(true)}
                            className="text-[11px] text-slate-400 underline hover:text-white pt-2 cursor-pointer"
                          >
                            Continuar al Menú del Sistema sin archivo
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {activeRunningGame.type === 'rpgmaker' && (
                <div className="flex-1 flex items-stretch w-full h-full">
                  <RpgMakerPlayer initialFile={rpgMakerFile} onBack={closeGame} />
                </div>
              )}

              {activeRunningGame.type === 'breaker' && (
                <div className="flex-1 flex items-stretch w-full h-full">
                  <NeonBreaker onBack={closeGame} />
                </div>
              )}

              {activeRunningGame.type === 'snake' && (
                <div className="flex-1 flex items-stretch w-full h-full">
                  <SnakeGame onBack={closeGame} />
                </div>
              )}

              {activeRunningGame.type === '2048' && (
                <div className="flex-1 flex items-stretch w-full h-full">
                  <Game2048 onBack={closeGame} />
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ── STATE B: HOME DRAWN BY THE SELECTED THEME ──────────────────────── */
          <ThemeHome {...homeProps} />
        )}
      </div>

      {/* ─── Theme Picker ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showThemes && (
          <ThemePicker current={theme} onPick={applyTheme} onClose={() => setShowThemes(false)} />
        )}
      </AnimatePresence>

      {/* ─── Trophies Overlay Modal ────────────────────────────────────────── */}
      <AnimatePresence>
        {showTrophies && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 flex items-center justify-center p-6"
            style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(16px)' }}
            onClick={() => setShowTrophies(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md rounded-[28px] p-6 space-y-4 shadow-2xl"
              style={{ background: '#0D111A', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-amber-500/15">
                  <FiAward className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Récords & Biblioteca</h3>
                  <p className="text-xs text-slate-400">Progreso real guardado en este navegador</p>
                </div>
              </div>
              <div className="space-y-2.5 pt-2">
                {CONSOLE_GAMES.map(game => (
                  <div
                    key={game.id}
                    className="flex items-center justify-between px-4 py-3 rounded-2xl bg-white/[0.04]"
                  >
                    <div className="flex items-center gap-2.5">
                      <img src={game.coverArt} alt="" loading="lazy" decoding="async" className="w-7 h-7 rounded-lg object-cover" />
                      <span className="text-xs font-semibold text-slate-200 truncate">{game.title}</span>
                    </div>
                    <span className="text-xs font-bold shrink-0" style={{ color: game.accentColor }}>
                      {recordValue(game) ?? game.trophies}
                    </span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowTrophies(false)}
                className="w-full py-3 rounded-full text-white text-xs font-bold transition-colors bg-white/10 hover:bg-white/15 cursor-pointer"
              >
                Cerrar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Settings Modal ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 flex items-end justify-center"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)' }}
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-xl rounded-t-[32px] p-6 pb-8 space-y-4 shadow-2xl"
              style={{ background: '#0D111A', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <div className="w-12 h-1.5 rounded-full bg-white/20 mx-auto mb-2" />
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/10">
                  <FiSettings className="w-6 h-6 text-slate-200" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Ajustes del Sistema</h3>
                  <p className="text-xs text-slate-400">Configuración de AP-Deck OS</p>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => { setShowSettings(false); setShowThemes(true); }}
                  className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
                >
                  <span className="flex items-center gap-2.5 text-sm text-slate-200">
                    <FiDroplet className="w-4 h-4" style={{ color: 'var(--theme-accent, #38BDF8)' }} /> Tema de la interfaz
                  </span>
                  <span className="text-xs font-bold text-slate-300">
                    {CONSOLE_THEMES.find(t => t.id === theme)?.name}
                  </span>
                </button>

                <button
                  onClick={() => setCrtEnabled(!crtEnabled)}
                  className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
                >
                  <span className="flex items-center gap-2.5 text-sm text-slate-200">
                    <FiTv className="w-4 h-4" style={{ color: 'var(--theme-accent, #38BDF8)' }} /> Filtro CRT Scanlines
                  </span>
                  <span className={`text-xs font-bold ${crtEnabled ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {crtEnabled ? 'ACTIVADO' : 'DESACTIVADO'}
                  </span>
                </button>

                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
                >
                  <span className="flex items-center gap-2.5 text-sm text-slate-200">
                    {soundEnabled ? <FiVolume2 className="w-4 h-4 text-emerald-400" /> : <FiVolumeX className="w-4 h-4 text-slate-500" />}
                    Efectos Sonoros
                  </span>
                  <span className={`text-xs font-bold ${soundEnabled ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {soundEnabled ? 'ACTIVADO' : 'DESACTIVADO'}
                  </span>
                </button>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed px-1">
                AP-Deck es una consola virtual interactiva con interfaz widescreen. Soporta emulación WebAssembly (libretro), el motor RPG Maker / Pokémon Essentials y mini-juegos nativos en TypeScript — todo corre 100% local en tu navegador.
              </p>

              <button
                onClick={() => setShowSettings(false)}
                className="w-full py-3 rounded-full text-white text-xs font-bold bg-white/10 hover:bg-white/15 transition-colors cursor-pointer"
              >
                Cerrar Ajustes
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <input
        type="file"
        ref={cartridgeFileInputRef}
        onChange={handleCartridgeFile}
        style={{ display: 'none' }}
        accept=".gba,.gb,.gbc,.sgb,.nds,.dsi,.nes,.fds,.unf,.sfc,.smc,.fig,.swc,.snes,.z64,.n64,.v64,.iso,.cue,.bin,.chd,.pbp,.img,.md,.gen,.smd,.sms,.gg,.32x,.pce,.sgx,.ws,.wsc,.ngp,.ngc,.a26,.a78,.lnx,.vb,.vboy,.zip,.7z,.rom,*"
      />
    </div>
  );
};
