import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FiPlay, FiMaximize2, FiMinimize2, FiTv, FiVolume2, FiVolumeX,
  FiArrowLeft, FiArrowRight, FiGrid, FiSettings,
  FiAward, FiClock, FiUpload, FiChevronLeft, FiLogOut
} from 'react-icons/fi';
import { Gamepad2 } from 'lucide-react';
import JSZip from 'jszip';
import { GAME_COVERS } from '@infrastructure/data/gameCovers.data';
import { GameBoyBattle } from './GameBoyBattle';
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
  type: 'cartridge' | 'rpgmaker' | 'cyber-battle' | 'snake' | '2048';
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
    id: 'cyber-encounter',
    title: 'Cyber-Encounter',
    badge: 'TACTICAL J-RPG',
    platform: 'TypeScript State Engine',
    genre: 'Turn-Based Battle',
    playtime: 'Sin cronómetro',
    trophies: 'Solo por diversión',
    bgGradient: 'from-cyan-950 via-slate-900 to-[#050811]',
    accentColor: '#06B6D4',
    description: 'Sistema de combate táctico por turnos estilo J-RPG contra el monolito de deuda técnica con mecánicas de refactorización y escudos de arquitectura.',
    type: 'cyber-battle',
    coverArt: GAME_COVERS.cyberEncounter,
    tags: ['Battle Arena', 'Debuffs', 'Critical Strikes', 'Pixel Shell'],
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

export const ConsoleDashboard: React.FC<ConsoleDashboardProps> = ({ embeddedFullscreen = false }) => {
  const navigate = useNavigate();
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
  const shelfRef = useRef<HTMLDivElement>(null);
  const [booted, setBooted] = useState(false);
  // Real high scores this browser has actually saved — no invented stats.
  const [snakeBest, setSnakeBest] = useState(() => Number(localStorage.getItem('snake-best') ?? 0));
  const [matrixBest, setMatrixBest] = useState(() => Number(localStorage.getItem('2048-best') ?? 0));

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
      if (activeRunningGame) {
        if (e.key === 'Escape' && !document.fullscreenElement) {
          if (soundEnabled) consoleAudio.playBack();
          setActiveRunningGame(null);
        }
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        selectGame(prev => {
          const next = (prev + 1) % CONSOLE_GAMES.length;
          if (soundEnabled) consoleAudio.playNavigate();
          return next;
        });
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
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
        navigate('/laboratorio');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, activeRunningGame, soundEnabled, navigate, launchGame, selectGame]);

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

  // One-time "power on" boot flourish when the console first mounts
  useEffect(() => {
    const t = setTimeout(() => setBooted(true), 550);
    return () => clearTimeout(t);
  }, []);

  // Keep the horizontal cartridge shelf following keyboard / gamepad selection
  useEffect(() => {
    const shelf = shelfRef.current;
    if (!shelf) return;
    const card = shelf.querySelector<HTMLElement>(`[data-cartridge-idx="${selectedIndex}"]`);
    card?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [selectedIndex]);

  const rootClasses = embeddedFullscreen
    ? 'fixed inset-0 h-[100dvh] w-[100dvw] z-[9999] bg-[#050811] flex flex-col overflow-hidden select-none'
    : `relative w-full bg-[#050811] flex flex-col overflow-hidden select-none ${isFullscreen ? 'fixed inset-0 z-50 rounded-none h-[100dvh] w-[100dvw]' : 'h-[85dvh] max-h-[820px] rounded-[28px] shadow-2xl'}`;

  return (
    <div ref={containerRef} className={rootClasses} style={{ fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif" }}>

      {/* ─── Ambient Glow Background ───────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <div
          className="absolute inset-0 transition-all duration-700"
          style={{
            background: `radial-gradient(ellipse 90% 70% at 50% -10%, ${selectedGame.accentColor}28 0%, transparent 75%)`,
          }}
        />
        <div className="absolute inset-0 bg-[#050811]/60" />
      </div>

      {/* ─── Power-On Boot Flourish (plays once per session) ───────────────── */}
      <AnimatePresence>
        {!booted && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="absolute inset-0 z-[60] bg-[#050811] flex items-center justify-center pointer-events-none"
          >
            <motion.div
              initial={{ scaleX: 0.2, opacity: 0 }}
              animate={{ scaleX: [0.2, 1, 1], opacity: [0, 1, 0] }}
              transition={{ duration: 0.55, times: [0, 0.55, 1], ease: 'easeInOut' }}
              className="h-[2px] w-2/3 max-w-xs"
              style={{ background: `linear-gradient(90deg, transparent, ${selectedGame.accentColor}, transparent)` }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── TOP AP-DECK OS STATUS BAR ─────────────────────────────────────── */}
      <div
        className="relative z-30 flex items-center justify-between px-4 sm:px-6 py-3"
        style={{
          background: 'rgba(5, 8, 17, 0.88)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        {/* Left: User Profile & Status */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white shadow-lg shrink-0"
            style={{
              background: 'linear-gradient(135deg, var(--theme-accent, #38BDF8), var(--theme-accent-hover, #0EA5E9))',
              boxShadow: '0 0 0 2px color-mix(in srgb, var(--theme-accent, #38BDF8) 40%, transparent)',
            }}
          >
            AP
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white text-sm">Anthony</span>
              <span className="w-1 h-1 rounded-full bg-emerald-400 shrink-0" />
              <span className="text-emerald-400 text-[11px] font-medium">En línea</span>
            </div>
            <div className="flex items-center gap-2.5 text-[11px] text-slate-400">
              <span className="hidden sm:flex items-center gap-1 font-medium shrink-0" title="Zona horaria del desarrollador">
                🇪🇨 Quito, EC
              </span>
              <span className="hidden sm:block w-1 h-1 rounded-full bg-slate-600 shrink-0" />
              <a
                href="https://twitch.tv/anthony_pilatasig"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 font-semibold hover:underline min-w-0"
                style={{ color: '#B197FC' }}
                title="Streams de game dev y arquitectura en Twitch"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#9146FF] animate-pulse shrink-0" />
                <span className="truncate hidden sm:inline">twitch.tv/anthony_pilatasig</span>
                <span className="sm:hidden">Twitch</span>
              </a>
            </div>
          </div>
        </div>

        {/* Center: System Console Brand */}
        <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] shrink-0">
          <Gamepad2 className="w-4 h-4 text-[var(--theme-accent, #38BDF8)]" />
          <span className="font-bold text-sm text-white tracking-wider">AP-DECK OS</span>
          <span className="text-[10px] text-slate-400 font-mono">v3.0</span>
        </div>

        {/* Right: Controller, Sound, Time & Exit */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div
            className="hidden md:flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(255,255,255,0.05)', color: '#94A3B8' }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{
                background: controllerConnected ? '#34D399' : '#60A5FA',
                boxShadow: controllerConnected ? '0 0 8px #34D399' : 'none',
              }}
            />
            <span>{controllerConnected ? 'Mando conectado' : 'Teclado / Mando'}</span>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-full transition-colors"
            style={{
              background: soundEnabled ? 'color-mix(in srgb, var(--theme-accent, #38BDF8) 20%, transparent)' : 'rgba(255,255,255,0.05)',
              color: soundEnabled ? 'var(--theme-accent, #38BDF8)' : '#475569'
            }}
            title="Efectos de sonido de la consola"
          >
            {soundEnabled ? <FiVolume2 className="w-4 h-4" /> : <FiVolumeX className="w-4 h-4" />}
          </button>

          <span
            className="hidden sm:inline font-bold text-white text-xs px-3 py-1.5 rounded-full tracking-wider"
            style={{ background: 'rgba(255,255,255,0.06)' }}
            title="Hora local — Quito, Ecuador (UTC-5)"
          >
            {currentTime}
          </span>

          <button
            onClick={() => navigate('/laboratorio')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-md"
            style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.35)', color: '#FCA5A5' }}
            title="Salir de la consola y volver al portafolio"
          >
            <FiLogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </div>

      {/* ─── MAIN CONSOLE STAGE ─────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-1 min-h-0 overflow-hidden">

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
                style={{ background: 'rgba(5,8,17,0.95)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
              >
                <button
                  onClick={closeGame}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-xs text-white transition-all hover:bg-white/15 active:scale-95"
                  style={{ background: 'rgba(255,255,255,0.08)' }}
                >
                  <FiChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Menú Principal</span>
                </button>

              <div className="flex items-center gap-2.5 text-white font-bold text-sm truncate max-w-[50vw]">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="truncate">{activeRunningGame.title}</span>
              </div>

              <div className="flex items-center gap-2">
                {activeRunningGame.type === 'cartridge' && (
                  <button
                    onClick={() => cartridgeFileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-bold text-xs bg-rose-600 hover:bg-rose-500 text-white shadow-lg transition-transform active:scale-95 cursor-pointer"
                  >
                    <FiUpload className="w-3.5 h-3.5" />
                    <span>Cargar Archivo</span>
                  </button>
                )}
                <button
                  onClick={() => setCrtEnabled(!crtEnabled)}
                  className="p-2 rounded-full transition-colors cursor-pointer"
                  style={{
                    background: crtEnabled ? 'color-mix(in srgb, var(--theme-accent, #38BDF8) 22%, transparent)' : 'rgba(255,255,255,0.05)',
                    color: crtEnabled ? 'var(--theme-accent, #38BDF8)' : '#94A3B8',
                  }}
                  title="Filtro CRT Scanlines"
                >
                  <FiTv className="w-4 h-4" />
                </button>
                <button
                  onClick={toggleFullscreen}
                  className="p-2 rounded-full transition-colors cursor-pointer"
                  style={{ background: 'rgba(255,255,255,0.05)', color: '#94A3B8' }}
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

              {activeRunningGame.type === 'cyber-battle' && (
                <div className="flex-1 flex items-stretch w-full h-full">
                  <GameBoyBattle onBack={closeGame} />
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
          /* ── STATE B: AP-DECK HOME DASHBOARD ──────────────────────────────── */
          <div className="flex flex-1 min-h-0">

            {/* Ozone Left Sidebar Navigation Rail */}
            <div
              className="hidden sm:flex flex-col items-center gap-3.5 py-6 px-3"
              style={{ background: 'rgba(255,255,255,0.015)', borderRight: '1px solid rgba(255,255,255,0.05)' }}
            >
              {[
                { icon: <FiGrid className="w-5 h-5" />, label: 'Biblioteca', action: () => selectGame(0), active: true },
                { icon: <FiAward className="w-5 h-5" />, label: 'Récords', action: () => setShowTrophies(true), active: false },
                { icon: <FiTv className="w-5 h-5" />, label: 'Filtro CRT', action: () => setCrtEnabled(!crtEnabled), active: crtEnabled },
                { icon: soundEnabled ? <FiVolume2 className="w-5 h-5" /> : <FiVolumeX className="w-5 h-5" />, label: 'Sonido', action: () => setSoundEnabled(!soundEnabled), active: soundEnabled },
              ].map((btn, i) => (
                <button
                  key={i}
                  onClick={btn.action}
                  title={btn.label}
                  className="w-11 h-11 rounded-[16px] flex items-center justify-center transition-all hover:scale-105"
                  style={{
                    background: btn.active ? `${selectedGame.accentColor}25` : 'rgba(255,255,255,0.03)',
                    color: btn.active ? selectedGame.accentColor : '#64748B',
                    boxShadow: btn.active ? `0 0 16px ${selectedGame.accentColor}40` : 'none',
                    border: btn.active ? `1px solid ${selectedGame.accentColor}50` : '1px solid transparent',
                  }}
                >
                  {btn.icon}
                </button>
              ))}
              <div className="flex-1" />
              <button
                onClick={() => setShowSettings(true)}
                title="Ajustes de la Consola"
                className="w-11 h-11 rounded-[16px] flex items-center justify-center transition-all hover:bg-white/10"
                style={{ background: 'rgba(255,255,255,0.03)', color: '#64748B' }}
              >
                <FiSettings className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/laboratorio')}
                title="Salir al Portafolio"
                className="w-11 h-11 rounded-[16px] flex items-center justify-center transition-all hover:bg-red-500/20 hover:text-red-400"
                style={{ background: 'rgba(255,255,255,0.03)', color: '#64748B' }}
              >
                <FiLogOut className="w-5 h-5" />
              </button>
            </div>

            {/* Main Stage: Hero Showcase + Cartridge Shelf — sized to always fit, never scrolls */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
              <div className="flex-1 flex flex-col min-h-0 justify-between p-3 sm:p-5 lg:p-7 gap-3 sm:gap-4">

                {/* ── Panoramic Hero Showcase Banner ───────────────────────── */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedGame.id}
                    initial={{ opacity: 0, y: 15, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -15, scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                    className="relative flex-1 min-h-0 rounded-[20px] sm:rounded-[28px] overflow-hidden shadow-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${selectedGame.accentColor}22 0%, #0A0E1A 100%)`,
                      border: `1px solid ${selectedGame.accentColor}40`,
                      boxShadow: `0 20px 50px -15px ${selectedGame.accentColor}33`,
                    }}
                  >
                    {/* Background Backdrop Glow */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: `radial-gradient(circle at 80% 50%, ${selectedGame.accentColor}30 0%, transparent 60%)`,
                      }}
                    />

                    {/* Main Showcase Layout (2-Column: Details Left + Big Capsule Right) */}
                    <div className="relative z-10 h-full overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6">

                      {/* Left: Info & Launch Buttons */}
                      <div className="space-y-2.5 sm:space-y-3 max-w-xl">
                        {/* Badges */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className="text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider text-white shadow-md"
                            style={{ background: selectedGame.accentColor }}
                          >
                            {selectedGame.badge}
                          </span>
                          <span className="text-xs text-slate-300 font-medium px-2.5 py-1 rounded-full bg-white/10">
                            {selectedGame.platform}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">
                            {selectedGame.genre}
                          </span>
                        </div>

                        {/* Title */}
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-white tracking-tight leading-[1.05]">
                          {selectedGame.title}
                        </h2>

                        {/* Stats Row — real saved high scores where they exist, honest labels elsewhere */}
                        <div className="flex items-center gap-5 text-xs text-slate-300">
                          <span className="flex items-center gap-1.5 text-amber-300 font-bold">
                            <FiAward className="w-4 h-4" />
                            {selectedGame.id === 'retro-snake'
                              ? `Récord en este navegador: ${snakeBest} pts`
                              : selectedGame.id === 'matrix-2048'
                              ? `Récord en este navegador: ${matrixBest}`
                              : selectedGame.trophies}
                          </span>
                          {selectedGame.playtime && (
                            <span className="flex items-center gap-1.5 text-blue-300 font-bold">
                              <FiClock className="w-4 h-4" /> {selectedGame.playtime}
                            </span>
                          )}
                        </div>

                        {/* Primary Launch Action Buttons */}
                        <div className="pt-1 flex flex-wrap items-center gap-3">
                          <button
                            onClick={() => launchGame(selectedGame)}
                            className="px-7 py-3 rounded-full font-black text-sm flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 shadow-xl cursor-pointer"
                            style={{
                              background: '#FFFFFF',
                              color: '#0F172A',
                              boxShadow: `0 0 30px ${selectedGame.accentColor}66`,
                            }}
                          >
                            <FiPlay className="w-4 h-4 fill-current text-slate-900" />
                            <span>JUGAR AHORA</span>
                          </button>

                          <button
                            onClick={() => setShowGameInfo(v => !v)}
                            className="px-5 py-3 rounded-full font-semibold text-xs text-white transition-colors hover:bg-white/15"
                            style={{ background: 'rgba(255,255,255,0.08)' }}
                          >
                            {showGameInfo ? 'Ocultar Detalles' : 'Detalles & Info'}
                          </button>
                        </div>

                        {/* Expandable info */}
                        <AnimatePresence>
                          {showGameInfo && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.22 }}
                              className="overflow-hidden pt-2"
                            >
                              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg">
                                {selectedGame.description}
                              </p>
                              <div className="flex flex-wrap gap-2 pt-3">
                                {selectedGame.tags.map(t => (
                                  <span
                                    key={t}
                                    className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                                    style={{ background: 'rgba(255,255,255,0.08)', color: '#CBD5E1' }}
                                  >
                                    {t}
                                  </span>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Right: Big Stylized Box Art Showcase Capsule */}
                      <div className="hidden md:flex flex-col items-center justify-center shrink-0">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9, rotate: -4 }}
                          animate={{ opacity: 1, scale: 1, rotate: 0 }}
                          whileHover={{ scale: 1.05, rotate: 1 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                          onClick={() => launchGame(selectedGame)}
                          className="w-36 lg:w-44 xl:w-52 h-36 lg:h-44 xl:h-52 rounded-[22px] overflow-hidden shadow-2xl cursor-pointer relative ring-2 ring-white/20"
                          style={{
                            boxShadow: `0 20px 40px -10px ${selectedGame.accentColor}88`,
                          }}
                        >
                          <img
                            src={selectedGame.coverArt}
                            alt={selectedGame.title}
                            decoding="async"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[10px] font-bold text-white">
                            <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md">Doble Clic</span>
                            <span className="flex items-center gap-1 text-emerald-400">
                              <FiPlay className="w-3 h-3 fill-current" /> Jugar
                            </span>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* ── Cartridge Shelf Row (horizontal carousel, never wraps) ───────── */}
                <div className="space-y-2 sm:space-y-2.5 shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xs sm:text-sm font-extrabold text-white tracking-wide uppercase">
                        Tu Biblioteca de Cartuchos
                      </span>
                      <span className="text-xs text-slate-400 px-2.5 py-0.5 rounded-full bg-white/[0.05]">
                        {selectedIndex + 1} de {CONSOLE_GAMES.length}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          selectGame(prev => (prev - 1 + CONSOLE_GAMES.length) % CONSOLE_GAMES.length);
                          if (soundEnabled) consoleAudio.playNavigate();
                        }}
                        className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
                        style={{ background: 'rgba(255,255,255,0.06)', color: '#CBD5E1' }}
                        aria-label="Juego Anterior"
                      >
                        <FiArrowLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          selectGame(prev => (prev + 1) % CONSOLE_GAMES.length);
                          if (soundEnabled) consoleAudio.playNavigate();
                        }}
                        className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
                        style={{ background: 'rgba(255,255,255,0.06)', color: '#CBD5E1' }}
                        aria-label="Siguiente Juego"
                      >
                        <FiArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Horizontal Cartridge Carousel — swipe/scroll sideways, page never scrolls vertically */}
                  <div className="relative">
                    <div
                      ref={shelfRef}
                      className="flex gap-3 sm:gap-4 overflow-x-auto snap-x snap-mandatory pb-1 pt-1 px-1 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                    >
                      {CONSOLE_GAMES.map((game, idx) => {
                        const isSel = idx === selectedIndex;
                        return (
                          <motion.div
                            key={game.id}
                            data-cartridge-idx={idx}
                            initial={false}
                            animate={{
                              scale: isSel ? 1.06 : 1,
                              y: isSel ? -4 : 0,
                            }}
                            whileHover={{ scale: isSel ? 1.08 : 1.04, y: -6 }}
                            whileTap={{ scale: 0.96 }}
                            transition={{ type: 'spring', stiffness: 420, damping: 26 }}
                            onClick={() => {
                              selectGame(idx);
                              if (soundEnabled) consoleAudio.playNavigate();
                            }}
                            onDoubleClick={() => launchGame(game)}
                            className="cursor-pointer shrink-0 snap-center w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-[18px] relative overflow-hidden group shadow-xl"
                            style={{
                              border: isSel ? `3px solid ${game.accentColor}` : '2px solid rgba(255,255,255,0.08)',
                              boxShadow: isSel
                                ? `0 0 0 1px ${game.accentColor}, 0 16px 32px -10px ${game.accentColor}99`
                                : '0 8px 24px rgba(0,0,0,0.5)',
                            }}
                          >
                            {/* Cartridge Cover Image */}
                            <img
                              src={game.coverArt}
                              alt={game.title}
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover transition-all duration-300"
                              style={{
                                filter: isSel ? 'none' : 'saturate(0.7) brightness(0.75)',
                              }}
                            />

                            {/* Top Cartridge Notch & Gold Contact Hint */}
                            <div className="absolute top-0 inset-x-0 h-1.5 bg-black/40 backdrop-blur-sm pointer-events-none" />

                            {/* Selection Glowing Indicator Pill */}
                            {isSel && (
                              <motion.span
                                layoutId="shelf-active-badge"
                                className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-full text-[8px] font-black text-white shadow-lg tracking-wider"
                                style={{ background: game.accentColor }}
                              >
                                EN FOCO
                              </motion.span>
                            )}

                            {/* Bottom Card Title Overlay on Selection */}
                            <div
                              className="absolute inset-x-0 bottom-0 p-2 pt-5 flex flex-col justify-end transition-opacity"
                              style={{
                                background: isSel
                                  ? 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)'
                                  : 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
                              }}
                            >
                              <p className="text-white text-[10px] sm:text-xs font-bold leading-tight line-clamp-1 drop-shadow-md">
                                {game.title}
                              </p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Edge fades hinting there's more to scroll sideways */}
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-[#050811] to-transparent" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-[#050811] to-transparent" />
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── BOTTOM CONTROLLER FOOTER BAR ─────────────────────────────────── */}
      <div
        className="relative z-30 px-4 sm:px-6 py-2 sm:py-2.5 flex flex-wrap items-center justify-between text-xs shrink-0"
        style={{
          background: 'rgba(5, 8, 17, 0.92)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        <div className="hidden sm:flex items-center gap-5 text-slate-400 font-medium">
          <span className="flex items-center gap-1.5">
            <kbd className="px-2 py-0.5 rounded bg-white/10 text-white font-mono text-[10px]">Enter / Doble Clic</kbd>
            <span>Jugar</span>
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="px-2 py-0.5 rounded bg-white/10 text-white font-mono text-[10px]">◀ ▶</kbd>
            <span>Moverse</span>
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="px-2 py-0.5 rounded bg-white/10 text-white font-mono text-[10px]">Esc</kbd>
            <span>Salir al Portafolio</span>
          </span>

          {/* Switch / Steam Deck Controller Button Hints */}
          <span className="hidden lg:flex items-center gap-3 ml-4 pl-4 border-l border-white/10">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-[9px] font-bold">A</span>
              <span>Iniciar</span>
            </span>
            <span className="flex items-center gap-1 text-rose-400">
              <span className="w-3.5 h-3.5 rounded-full bg-rose-500/20 border border-rose-400 flex items-center justify-center text-[9px] font-bold">B</span>
              <span>Volver</span>
            </span>
            <span className="flex items-center gap-1 text-sky-400">
              <span className="w-3.5 h-3.5 rounded-full bg-sky-500/20 border border-sky-400 flex items-center justify-center text-[9px] font-bold">X</span>
              <span>Info</span>
            </span>
          </span>
        </div>

        <div className="flex sm:hidden items-center gap-2 text-slate-400 text-xs">
          <FiGrid className="w-3.5 h-3.5" />
          <span>Toca una tarjeta · Doble toque para jugar</span>
        </div>

        <div className="text-slate-500 text-[11px] font-mono flex items-center gap-1.5">
          <span>Hecho en Quito, Ecuador</span>
          <span aria-hidden>🇪🇨</span>
        </div>
      </div>

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
                      {game.id === 'retro-snake'
                        ? `${snakeBest} pts`
                        : game.id === 'matrix-2048'
                        ? `${matrixBest}`
                        : game.trophies}
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
