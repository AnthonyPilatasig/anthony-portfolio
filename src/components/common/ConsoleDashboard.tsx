import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPlay, FiMaximize2, FiMinimize2, FiTv, FiVolume2, FiVolumeX,
  FiArrowLeft, FiArrowRight, FiGrid, FiSettings,
  FiAward, FiClock, FiUpload, FiX, FiChevronLeft
} from 'react-icons/fi';
import { Gamepad2 } from 'lucide-react';
import JSZip from 'jszip';
import { GameBoyShell } from './GameBoyShell';
import { GameBoyBattle } from './GameBoyBattle';
import { SnakeGame } from './SnakeGame';
import { Game2048 } from './Game2048';

// ─── Audio Synthesizer (PS5 / Switch soft ticks and chimes) ─────────────────
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
      osc.frequency.setValueAtTime(587.33, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.04);
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, now);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch {}
  }

  playLaunch() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);
        gain.gain.setValueAtTime(0.08, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.32);
      });
    } catch {}
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
    } catch {}
  }
}

const consoleAudio = new ModernConsoleAudio();

// ─── Types ───────────────────────────────────────────────────────────────────
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
  type: 'zip-loader' | 'cartridge' | 'cyber-battle' | 'snake' | '2048';
  src?: string;
  coverArt?: string;
  tags: string[];
}

// ─── Game Catalogue (sin RPG Maker) ─────────────────────────────────────────
const CONSOLE_GAMES: ConsoleGame[] = [
  // Slot especial: cargador de ZIP (siempre el primero)
  {
    id: 'zip-loader',
    title: 'Cargar desde ZIP',
    badge: 'TU JUEGO',
    platform: 'Cualquier plataforma web',
    genre: 'Importa tu juego',
    playtime: '—',
    trophies: '—',
    bgGradient: 'from-slate-900 via-slate-800 to-[#070b14]',
    accentColor: '#6366F1',
    description: 'Sube un archivo .zip con tu juego web (debe contener index.html en la raíz). Se extrae en memoria y se lanza directamente en el navegador — nada se sube a ningún servidor.',
    type: 'zip-loader',
    tags: ['HTML5', 'RetroArch ROM', 'Cualquier motor', '100% local'],
  },
  // RetroArch real (libretro WebAssembly) — el usuario sube su propia ROM en ZIP
  {
    id: 'cartridge-slot',
    title: 'Ranura RetroArch',
    badge: 'RETROARCH REAL',
    platform: 'libretro · WebAssembly',
    genre: 'Trae tu propio cartucho',
    playtime: '—',
    trophies: 'GBA · GBC · NES',
    bgGradient: 'from-rose-950 via-slate-900 to-[#070b14]',
    accentColor: '#F43F5E',
    description: 'Sube tu propio archivo (un cartucho que hayas volcado tú mismo) y juégalo con RetroArch real compilado a WebAssembly, autoalojado aquí — mGBA, Gambatte o FCEUmm. Nada se sube a un servidor: todo corre en tu navegador.',
    type: 'cartridge',
    src: './games/cartridge/index.html',
    tags: ['RetroArch / libretro', 'mGBA · Gambatte · FCEUmm', 'Sube tu archivo', '100% local'],
  },
  {
    id: 'cyber-encounter',
    title: 'Cyber-Encounter',
    badge: 'TACTICAL J-RPG',
    platform: 'TypeScript State Engine',
    genre: 'Turn-Based Battle',
    playtime: '6h 15m',
    trophies: '8/8 Trofeos',
    bgGradient: 'from-cyan-950 via-slate-900 to-[#070b14]',
    accentColor: '#06B6D4',
    description: 'Sistema de combate por turnos estilo Final Fantasy/Pokémon contra el monolito de deuda técnica con mecánicas de refactorización y escudos de arquitectura.',
    type: 'cyber-battle',
    tags: ['Battle Arena', 'Debuffs', 'Critical Strikes', 'Pixel Shell'],
  },
  {
    id: 'retro-snake',
    title: 'Retro Snake 8-Bit DX',
    badge: 'CLASSIC ARCADE',
    platform: '8-Bit Matrix Engine',
    genre: 'Arcade Classic',
    playtime: '12h 05m',
    trophies: '5/5 Trofeos',
    bgGradient: 'from-emerald-950 via-teal-950 to-[#070b14]',
    accentColor: '#10B981',
    description: 'Recreación retro de la clásica serpiente con física de rejilla matemática y selector de dificultad.',
    type: 'snake',
    tags: ['High Score', 'Física Retro', '8-Bit Synth', 'D-Pad'],
  },
  {
    id: 'matrix-2048',
    title: '2048 Logic Matrix',
    badge: 'PUZZLE LOGIC',
    platform: 'Binary Array Grid',
    genre: 'Math Puzzle',
    playtime: '9h 30m',
    trophies: '10/10 Trofeos',
    bgGradient: 'from-amber-950 via-orange-950 to-[#070b14]',
    accentColor: '#F59E0B',
    description: 'Desliza y fusiona potencias de dos hasta alcanzar el bloque 2048 en una matriz algorítmica optimizada.',
    type: '2048',
    tags: ['Touch Gestures', 'Matriz 4x4', 'Algoritmo', 'Minimalista'],
  },
];

// ─── ZIP Loader helpers ──────────────────────────────────────────────────────
interface ZipGameEntry {
  name: string;
  url: string;
}

async function extractZipToBlobs(file: File): Promise<ZipGameEntry[]> {
  const zip = new JSZip();
  const loaded = await zip.loadAsync(file);
  const entries: ZipGameEntry[] = [];

  const promises = Object.keys(loaded.files).map(async (path) => {
    const entry = loaded.files[path];
    if (entry.dir) return;
    const blob = await entry.async('blob');
    const mimeType = guessMime(path);
    const blobWithType = new Blob([blob], { type: mimeType });
    entries.push({ name: path, url: URL.createObjectURL(blobWithType) });
  });

  await Promise.all(promises);
  return entries;
}

function guessMime(path: string): string {
  const ext = path.split('.').pop()?.toLowerCase() ?? '';
  const map: Record<string, string> = {
    html: 'text/html',
    js: 'application/javascript',
    mjs: 'application/javascript',
    css: 'text/css',
    json: 'application/json',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    svg: 'image/svg+xml',
    webp: 'image/webp',
    ogg: 'audio/ogg',
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    wasm: 'application/wasm',
    data: 'application/octet-stream',
  };
  return map[ext] ?? 'application/octet-stream';
}

// ─── Props ───────────────────────────────────────────────────────────────────
interface ConsoleDashboardProps {
  /** Cuando es true, el contenedor usa fixed inset-0 (pantalla completa real) */
  embeddedFullscreen?: boolean;
}

// ─── Component ───────────────────────────────────────────────────────────────
export const ConsoleDashboard: React.FC<ConsoleDashboardProps> = ({ embeddedFullscreen = false }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeRunningGame, setActiveRunningGame] = useState<ConsoleGame | null>(null);
  const [currentTime, setCurrentTime] = useState('');
  const [crtEnabled, setCrtEnabled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controllerConnected, setControllerConnected] = useState(false);
  const [showTrophies, setShowTrophies] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const [showGameInfo, setShowGameInfo] = useState(false);

  // ZIP loader state
  const [zipLoading, setZipLoading] = useState(false);
  const [zipError, setZipError] = useState<string | null>(null);
  const [zipBlobEntries, setZipBlobEntries] = useState<ZipGameEntry[]>([]);
  const [zipIframeSrc, setZipIframeSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const blobsRef = useRef<string[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);

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

  // Gamepad detection
  useEffect(() => {
    const handleConnect = () => setControllerConnected(true);
    const handleDisconnect = () => setControllerConnected(false);
    window.addEventListener('gamepadconnected', handleConnect);
    window.addEventListener('gamepaddisconnected', handleDisconnect);
    if (typeof navigator.getGamepads === 'function') {
      const pads = navigator.getGamepads();
      if (pads && Array.from(pads).some(p => p !== null)) setControllerConnected(true);
    }
    return () => {
      window.removeEventListener('gamepadconnected', handleConnect);
      window.removeEventListener('gamepaddisconnected', handleDisconnect);
    };
  }, []);

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
        setSelectedIndex(prev => { const next = (prev + 1) % CONSOLE_GAMES.length; if (soundEnabled) consoleAudio.playNavigate(); return next; });
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        setSelectedIndex(prev => { const next = (prev - 1 + CONSOLE_GAMES.length) % CONSOLE_GAMES.length; if (soundEnabled) consoleAudio.playNavigate(); return next; });
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const selected = CONSOLE_GAMES[selectedIndex];
        if (soundEnabled) consoleAudio.playLaunch();
        setActiveRunningGame(selected);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, activeRunningGame, soundEnabled]);

  // Portrait detection (mobile rotate hint)
  useEffect(() => {
    const mq = window.matchMedia('(orientation: portrait) and (max-width: 900px)');
    const update = () => setIsPortrait(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Fullscreen change listener (sync state when user presses F11 or Esc)
  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // Reset info panel when game changes
  useEffect(() => { setShowGameInfo(false); }, [selectedIndex]);

  // Cleanup blob URLs when zip changes
  useEffect(() => {
    return () => {
      blobsRef.current.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  const selectedGame = CONSOLE_GAMES[selectedIndex];

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
          orientation?.lock?.('landscape').catch(() => {});
        })
        .catch(() => {});
    }
  }, [soundEnabled]);

  const closeGame = useCallback(() => {
    if (soundEnabled) consoleAudio.playBack();
    setActiveRunningGame(null);
    setZipIframeSrc(null);
    setZipError(null);
    const orientation = screen.orientation as ScreenOrientation & { unlock?: () => void };
    orientation?.unlock?.();
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    setIsFullscreen(false);
  }, [soundEnabled]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // ─── ZIP handling ────────────────────────────────────────────────────────
  const handleZipFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.zip')) {
      setZipError('El archivo debe ser un .zip');
      return;
    }
    setZipLoading(true);
    setZipError(null);
    setZipBlobEntries([]);
    setZipIframeSrc(null);

    try {
      // Revoke old blobs
      blobsRef.current.forEach(url => URL.revokeObjectURL(url));
      blobsRef.current = [];

      const entries = await extractZipToBlobs(file);
      blobsRef.current = entries.map(e => e.url);
      setZipBlobEntries(entries);

      // Find the root index.html
      const rootIndex =
        entries.find(e => e.name.toLowerCase() === 'index.html') ||
        entries.find(e => e.name.toLowerCase().endsWith('/index.html') && e.name.split('/').length === 2);

      if (!rootIndex) {
        setZipError('No se encontró index.html en la raíz del ZIP.');
        setZipLoading(false);
        return;
      }

      setZipIframeSrc(rootIndex.url);
      // Launch the zip-loader game card as active
      setActiveRunningGame(CONSOLE_GAMES.find(g => g.id === 'zip-loader') ?? CONSOLE_GAMES[0]);
    } catch (err) {
      setZipError(`Error al extraer el ZIP: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setZipLoading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleZipFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleZipFile(file);
  };

  // Container root classes
  const rootClasses = embeddedFullscreen
    ? 'fixed inset-0 w-screen h-screen z-[9999] bg-[#050811] flex flex-col overflow-hidden'
    : `relative w-full bg-[#050811] flex flex-col overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 rounded-none w-screen h-screen' : 'min-h-[90vh] rounded-[28px] shadow-2xl'}`;

  return (
    <div ref={containerRef} className={rootClasses} style={{ fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif" }}>

      {/* ─── Gradient ambient background ───────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <div
          className="absolute inset-0 transition-all duration-700"
          style={{
            background: `radial-gradient(ellipse 80% 60% at 50% -10%, ${selectedGame.accentColor}22 0%, transparent 70%)`,
          }}
        />
        <div className="absolute inset-0 bg-[#050811]/70" />
        {/* Fine noise texture overlay for depth */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* ─── TOP SYSTEM BAR ───────────────────────────────────────────────── */}
      <div
        className="relative z-30 flex items-center justify-between px-4 sm:px-6 py-3"
        style={{
          background: 'rgba(5,8,17,0.85)',
          backdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        {/* Left: User Profile */}
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-[13px] text-white shadow-lg"
            style={{
              background: `linear-gradient(135deg, #3B82F6, #1D4ED8)`,
              boxShadow: '0 0 16px rgba(59,130,246,0.4)',
            }}
          >
            AP
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white text-sm">Anthony</span>
              <span
                className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(59,130,246,0.15)', color: '#93C5FD' }}
              >
                Nivel 99 · Architect
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] mt-0.5">
              <span className="text-amber-400 flex items-center gap-1">
                <FiAward className="w-3 h-3" /> 65
              </span>
              <span className="w-1 h-1 rounded-full bg-emerald-400" />
              <span className="text-slate-400">En línea</span>
            </div>
          </div>
        </div>

        {/* Center: Console Brand */}
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-4 h-4" style={{ color: selectedGame.accentColor }} />
          <span className="font-bold text-sm text-white tracking-tight">AP-Deck</span>
        </div>

        {/* Right: Status + Time */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div
            className="hidden sm:flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(255,255,255,0.05)', color: '#94A3B8' }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: controllerConnected ? '#34D399' : '#60A5FA',
                boxShadow: controllerConnected ? '0 0 6px #34D399' : 'none',
                animation: controllerConnected ? 'pulse 2s infinite' : 'none',
              }}
            />
            <span>{controllerConnected ? 'Mando conectado' : 'Teclado / mando'}</span>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-full transition-colors"
            style={{ background: soundEnabled ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.05)', color: soundEnabled ? '#818CF8' : '#475569' }}
            title="Sonido de la consola"
          >
            {soundEnabled ? <FiVolume2 className="w-4 h-4" /> : <FiVolumeX className="w-4 h-4" />}
          </button>

          <span
            className="font-semibold text-white text-sm px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          >
            {currentTime}
          </span>
        </div>
      </div>

      {/* ─── MAIN STAGE ──────────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-1 min-h-0 overflow-hidden">

        {/* CRT Scanlines overlay */}
        {crtEnabled && (
          <div
            className="pointer-events-none absolute inset-0 z-20 opacity-20"
            style={{
              backgroundImage: 'linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.5) 50%)',
              backgroundSize: '100% 4px',
            }}
          />
        )}

        {/* Portrait rotate hint (mobile) */}
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
            <p className="text-slate-400 text-sm max-w-xs">Esta experiencia se juega mejor en horizontal.</p>
          </div>
        )}

        {/* ── STATE A: ACTIVE GAME ─────────────────────────────────────────── */}
        {activeRunningGame ? (
          <div className="flex-1 flex flex-col min-h-0">
            {/* In-game top bar */}
            <div
              className="flex items-center justify-between px-4 sm:px-6 py-2.5"
              style={{ background: 'rgba(5,8,17,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
            >
              <button
                onClick={closeGame}
                className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm text-white transition-all active:scale-95"
                style={{ background: 'rgba(255,255,255,0.08)' }}
              >
                <FiChevronLeft className="w-4 h-4" />
                <span>Menú</span>
              </button>

              <div className="flex items-center gap-2 text-white font-semibold text-sm truncate max-w-[40vw]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="truncate">{activeRunningGame.title}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCrtEnabled(!crtEnabled)}
                  className="p-2 rounded-full transition-colors"
                  style={{ background: crtEnabled ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.05)', color: crtEnabled ? '#818CF8' : '#475569' }}
                  title="Filtro CRT"
                >
                  <FiTv className="w-4 h-4" />
                </button>
                <button
                  onClick={toggleFullscreen}
                  className="p-2 rounded-full transition-colors"
                  style={{ background: 'rgba(255,255,255,0.05)', color: '#94A3B8' }}
                  title="Pantalla Completa"
                >
                  {isFullscreen ? <FiMinimize2 className="w-4 h-4" /> : <FiMaximize2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Game frame */}
            <div className="flex-1 min-h-0 flex items-stretch">

              {/* ZIP game loaded from blob URL */}
              {activeRunningGame.type === 'zip-loader' && zipIframeSrc && (
                <iframe
                  src={zipIframeSrc}
                  title="Juego cargado desde ZIP"
                  className="w-full h-full border-0 bg-black"
                  allow="autoplay; fullscreen; gamepad"
                  sandbox="allow-scripts allow-same-origin allow-modals allow-pointer-lock allow-forms"
                />
              )}

              {/* ZIP loader UI (no file yet) */}
              {activeRunningGame.type === 'zip-loader' && !zipIframeSrc && (
                <div className="flex-1 flex items-center justify-center p-6">
                  <div className="text-slate-400 text-center">
                    <FiUpload className="w-10 h-10 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Sube un ZIP para comenzar</p>
                    <button onClick={() => setActiveRunningGame(null)} className="mt-4 px-4 py-2 rounded-full bg-white/8 text-white text-sm hover:bg-white/12 transition-colors">Volver</button>
                  </div>
                </div>
              )}

              {/* RetroArch cartridge iframe */}
              {activeRunningGame.type === 'cartridge' && (
                <iframe
                  src={activeRunningGame.src}
                  title={activeRunningGame.title}
                  className="w-full h-full border-0 bg-black"
                  allow="autoplay; fullscreen; gamepad"
                />
              )}

              {/* TypeScript mini-games */}
              {activeRunningGame.type === 'cyber-battle' && (
                <div className="flex-1 flex items-center justify-center p-4">
                  <GameBoyShell title="Cyber-Encounter: Clean Arch Battle">
                    <GameBoyBattle onComplete={() => {}} />
                  </GameBoyShell>
                </div>
              )}

              {activeRunningGame.type === 'snake' && (
                <div className="flex-1 flex items-center justify-center p-4">
                  <GameBoyShell title="Retro Snake 8-Bit DX">
                    <SnakeGame onBack={closeGame} />
                  </GameBoyShell>
                </div>
              )}

              {activeRunningGame.type === '2048' && (
                <div className="flex-1 flex items-center justify-center p-4">
                  <GameBoyShell title="2048 Binary Matrix">
                    <Game2048 onBack={closeGame} />
                  </GameBoyShell>
                </div>
              )}
            </div>
          </div>

        ) : (
          /* ── STATE B: DASHBOARD (Switch/PS5 home) ─────────────────────── */
          <div className="flex flex-1 min-h-0">

            {/* Left Ozone-style icon rail */}
            <div
              className="hidden sm:flex flex-col items-center gap-3 py-6 px-3"
              style={{ background: 'rgba(255,255,255,0.01)', borderRight: '1px solid rgba(255,255,255,0.04)' }}
            >
              {[
                { icon: <FiGrid className="w-5 h-5" />, label: 'Biblioteca', action: () => setSelectedIndex(0), active: true },
                { icon: <FiAward className="w-5 h-5" />, label: 'Trofeos', action: () => setShowTrophies(true), active: false },
                { icon: <FiTv className="w-5 h-5" />, label: 'Filtro CRT', action: () => setCrtEnabled(!crtEnabled), active: crtEnabled },
                { icon: soundEnabled ? <FiVolume2 className="w-5 h-5" /> : <FiVolumeX className="w-5 h-5" />, label: 'Sonido', action: () => setSoundEnabled(!soundEnabled), active: soundEnabled },
              ].map((btn, i) => (
                <button
                  key={i}
                  onClick={btn.action}
                  title={btn.label}
                  className="w-11 h-11 rounded-[14px] flex items-center justify-center transition-all"
                  style={{
                    background: btn.active ? `${selectedGame.accentColor}22` : 'rgba(255,255,255,0.03)',
                    color: btn.active ? selectedGame.accentColor : '#475569',
                    boxShadow: btn.active ? `0 0 12px ${selectedGame.accentColor}33` : 'none',
                  }}
                >
                  {btn.icon}
                </button>
              ))}
              <div className="flex-1" />
              <button
                onClick={() => setShowSettings(true)}
                title="Ajustes"
                className="w-11 h-11 rounded-[14px] flex items-center justify-center transition-all"
                style={{ background: 'rgba(255,255,255,0.03)', color: '#475569' }}
              >
                <FiSettings className="w-5 h-5" />
              </button>
            </div>

            {/* Main content area */}
            <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">

              {/* ── Hero Card ─────────────────────────────────────────────── */}
              <div className="flex-1 flex flex-col justify-between p-4 sm:p-6 lg:p-8 gap-4 sm:gap-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedGame.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                    className="relative rounded-[20px] sm:rounded-[24px] overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${selectedGame.accentColor}18 0%, rgba(5,8,17,0.95) 100%)`,
                      border: `1px solid ${selectedGame.accentColor}30`,
                      minHeight: 220,
                    }}
                  >
                    {/* Cover art blurred background */}
                    {selectedGame.coverArt && (
                      <>
                        <div
                          className="absolute inset-0 bg-cover bg-center opacity-30"
                          style={{ backgroundImage: `url(${selectedGame.coverArt})`, filter: 'blur(16px) saturate(120%)' }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
                      </>
                    )}

                    {/* Hero gradient wash */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(135deg, ${selectedGame.accentColor}25 0%, transparent 60%)`,
                      }}
                    />

                    {/* Gamepad watermark */}
                    <div className="hidden sm:block absolute -right-6 -bottom-6 opacity-[0.06] pointer-events-none">
                      <Gamepad2 className="w-64 h-64 text-white" />
                    </div>

                    {/* Hero content */}
                    <div className="relative z-10 p-6 sm:p-8 lg:p-10 flex flex-col gap-4 max-w-2xl">
                      {/* Badge row */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider"
                          style={{ background: `${selectedGame.accentColor}CC`, color: '#fff' }}
                        >
                          {selectedGame.badge}
                        </span>
                        <span className="text-[12px] text-slate-400 font-medium">{selectedGame.platform}</span>
                      </div>

                      {/* Title */}
                      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.05] tracking-tight">
                        {selectedGame.title}
                      </h2>

                      {/* Stats */}
                      {selectedGame.trophies !== '—' && (
                        <div className="flex items-center gap-5 text-[13px]">
                          <span className="flex items-center gap-1.5 text-amber-300 font-medium">
                            <FiAward className="w-4 h-4" /> {selectedGame.trophies}
                          </span>
                          <span className="flex items-center gap-1.5 text-blue-300 font-medium">
                            <FiClock className="w-4 h-4" /> {selectedGame.playtime}
                          </span>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex flex-wrap items-center gap-3 pt-1">
                        {selectedGame.type === 'zip-loader' ? (
                          // ZIP slot: show file picker button
                          <div
                            className="relative"
                            onDrop={handleDrop}
                            onDragOver={e => e.preventDefault()}
                          >
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept=".zip"
                              className="hidden"
                              onChange={handleFileInputChange}
                            />
                            <button
                              onClick={() => fileInputRef.current?.click()}
                              disabled={zipLoading}
                              className="px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2.5 transition-transform active:scale-95 shadow-xl"
                              style={{ background: '#fff', color: '#0F172A' }}
                            >
                              <FiUpload className="w-4 h-4" />
                              <span>{zipLoading ? 'Extrayendo...' : 'Subir .zip'}</span>
                            </button>
                            {zipError && (
                              <p className="mt-2 text-xs text-red-400 flex items-center gap-1">
                                <FiX className="w-3 h-3" /> {zipError}
                              </p>
                            )}
                            {zipBlobEntries.length > 0 && !zipError && (
                              <button
                                onClick={() => launchGame(selectedGame)}
                                className="mt-2 px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2.5 transition-transform active:scale-95"
                                style={{ background: selectedGame.accentColor, color: '#fff' }}
                              >
                                <FiPlay className="w-4 h-4 fill-current" /> Jugar ahora
                              </button>
                            )}
                          </div>
                        ) : (
                          <button
                            onClick={() => launchGame(selectedGame)}
                            className="px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2.5 transition-transform active:scale-95 shadow-xl"
                            style={{ background: '#fff', color: '#0F172A' }}
                          >
                            <FiPlay className="w-4 h-4 fill-current" />
                            <span>Jugar ahora</span>
                          </button>
                        )}

                        <button
                          onClick={() => setShowGameInfo(v => !v)}
                          className="px-5 py-3 rounded-full font-semibold text-sm text-white transition-colors"
                          style={{ background: 'rgba(255,255,255,0.1)' }}
                        >
                          {showGameInfo ? 'Ocultar info' : 'Info'}
                        </button>
                      </div>

                      {/* Expandable description */}
                      <AnimatePresence>
                        {showGameInfo && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.22 }}
                            className="overflow-hidden"
                          >
                            <p className="text-sm text-slate-300 leading-relaxed max-w-lg">
                              {selectedGame.description}
                            </p>
                            <div className="flex flex-wrap gap-2 pt-3">
                              {selectedGame.tags.map(t => (
                                <span
                                  key={t}
                                  className="text-[11px] font-medium px-2.5 py-1 rounded-full"
                                  style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.75)' }}
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* ── Cartridge Shelf ─────────────────────────────────────── */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                      Tu biblioteca
                      <span className="text-slate-500 font-normal text-xs">{selectedIndex + 1}/{CONSOLE_GAMES.length}</span>
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => { setSelectedIndex(prev => (prev - 1 + CONSOLE_GAMES.length) % CONSOLE_GAMES.length); if (soundEnabled) consoleAudio.playNavigate(); }}
                        className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                        style={{ background: 'rgba(255,255,255,0.06)', color: '#94A3B8' }}
                        aria-label="Anterior"
                      >
                        <FiArrowLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => { setSelectedIndex(prev => (prev + 1) % CONSOLE_GAMES.length); if (soundEnabled) consoleAudio.playNavigate(); }}
                        className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                        style={{ background: 'rgba(255,255,255,0.06)', color: '#94A3B8' }}
                        aria-label="Siguiente"
                      >
                        <FiArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Tiles — Switch-style icon grid */}
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 pb-1">
                    {CONSOLE_GAMES.map((game, idx) => {
                      const isSel = idx === selectedIndex;
                      return (
                        <motion.div
                          key={game.id}
                          layout
                          initial={false}
                          animate={{ scale: isSel ? 1.05 : 1, y: isSel ? -4 : 0 }}
                          whileHover={{ scale: isSel ? 1.07 : 1.03, y: -5 }}
                          whileTap={{ scale: 0.96 }}
                          transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                          onClick={() => { setSelectedIndex(idx); if (soundEnabled) consoleAudio.playNavigate(); }}
                          onDoubleClick={() => launchGame(game)}
                          className="cursor-pointer rounded-[18px] relative overflow-hidden aspect-square"
                          style={{
                            boxShadow: isSel
                              ? `0 0 0 2.5px ${game.accentColor}, 0 16px 32px -8px ${game.accentColor}66`
                              : '0 4px 16px rgba(0,0,0,0.4)',
                          }}
                        >
                          {/* Tile background */}
                          {game.coverArt ? (
                            <div
                              className="absolute inset-0 bg-cover bg-center transition-all duration-300"
                              style={{
                                backgroundImage: `url(${game.coverArt})`,
                                filter: isSel ? 'none' : 'saturate(0.5) brightness(0.6)',
                              }}
                            />
                          ) : (
                            <div
                              className="absolute inset-0"
                              style={{
                                background: `linear-gradient(135deg, ${game.accentColor}33 0%, #0A0D1A 100%)`,
                              }}
                            >
                              {/* Game icon hint */}
                              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                                <Gamepad2 className="w-10 h-10 text-white" />
                              </div>
                            </div>
                          )}

                          {/* ZIP upload icon for zip-loader tile */}
                          {game.type === 'zip-loader' && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div
                                className="w-10 h-10 rounded-full flex items-center justify-center"
                                style={{ background: `${game.accentColor}44`, border: `1px solid ${game.accentColor}66` }}
                              >
                                <FiUpload className="w-5 h-5 text-white" />
                              </div>
                            </div>
                          )}

                          {/* Accent dot (selected) */}
                          {isSel && (
                            <motion.span
                              layoutId="shelf-active-dot"
                              className="absolute top-2 right-2 w-2 h-2 rounded-full"
                              style={{ background: game.accentColor, boxShadow: `0 0 8px ${game.accentColor}` }}
                            />
                          )}

                          {/* Title label (selected only) */}
                          <AnimatePresence>
                            {isSel && (
                              <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 5 }}
                                className="absolute inset-x-0 bottom-0 p-2.5 pt-6"
                                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)' }}
                              >
                                <p className="text-white text-[10px] font-semibold leading-snug line-clamp-2 drop-shadow">
                                  {game.title}
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── BOTTOM FOOTER BAR ────────────────────────────────────────────── */}
      <div
        className="relative z-30 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between text-[11px]"
        style={{
          background: 'rgba(5,8,17,0.9)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div className="hidden sm:flex items-center gap-4 text-slate-500">
          {[
            { key: 'Enter', label: 'Iniciar' },
            { key: '◀ ▶', label: 'Moverse' },
            { key: 'Esc', label: 'Volver' },
          ].map(({ key, label }) => (
            <span key={key} className="flex items-center gap-1.5">
              <kbd
                className="px-2 py-0.5 rounded-md font-mono text-[10px]"
                style={{ background: 'rgba(255,255,255,0.08)', color: '#CBD5E1' }}
              >
                {key}
              </kbd>
              <span>{label}</span>
            </span>
          ))}
          {/* PS5-style colored button hints */}
          <span className="hidden lg:flex items-center gap-1.5 ml-2">
            {[
              { color: '#3B82F6', label: 'Info' },
              { color: '#22C55E', label: 'Jugar' },
              { color: '#EF4444', label: 'Volver' },
            ].map(({ color, label }) => (
              <span key={label} className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}88` }} />
                <span className="text-slate-600">{label}</span>
              </span>
            ))}
          </span>
        </div>

        {/* Mobile: touch hint */}
        <div className="flex sm:hidden items-center gap-1.5 text-slate-500">
          <FiGrid className="w-3 h-3" />
          <span>Toca · doble toque para jugar</span>
        </div>

        <div className="text-slate-600 text-[10px]">
          Anthony Pilatasig · Virtual Gaming Lab
        </div>
      </div>

      {/* ─── Trophies Overlay ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {showTrophies && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 flex items-center justify-center p-6"
            style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)' }}
            onClick={() => setShowTrophies(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', stiffness: 340, damping: 28 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md rounded-[24px] p-6 space-y-4 shadow-2xl"
              style={{ background: '#0D1117', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.15)' }}>
                  <FiAward className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Trofeos</h3>
                  <p className="text-xs text-slate-400">Progreso por título</p>
                </div>
              </div>
              <div className="space-y-2">
                {CONSOLE_GAMES.filter(g => g.trophies !== '—').map(game => (
                  <div
                    key={game.id}
                    className="flex items-center justify-between px-4 py-3 rounded-2xl"
                    style={{ background: 'rgba(255,255,255,0.03)' }}
                  >
                    <span className="text-sm text-slate-200 truncate pr-3">{game.title}</span>
                    <span className="text-xs font-semibold shrink-0" style={{ color: game.accentColor }}>{game.trophies}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowTrophies(false)}
                className="w-full py-2.5 rounded-full text-white text-sm font-semibold transition-colors"
                style={{ background: 'rgba(255,255,255,0.08)' }}
              >
                Cerrar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Settings Overlay ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 flex items-end justify-center"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 360, damping: 34 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-xl rounded-t-[28px] p-6 pb-8 space-y-4 shadow-2xl"
              style={{ background: '#0D1117', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div className="w-10 h-1 rounded-full mx-auto mb-2" style={{ background: 'rgba(255,255,255,0.15)' }} />
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <FiSettings className="w-5 h-5 text-slate-300" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Ajustes</h3>
                  <p className="text-xs text-slate-400">Acerca de AP-Deck</p>
                </div>
              </div>

              <div className="space-y-2">
                {[
                  { label: 'Filtro CRT', icon: <FiTv className="w-4 h-4" />, val: crtEnabled, set: setCrtEnabled },
                  { label: 'Sonido de la consola', icon: soundEnabled ? <FiVolume2 className="w-4 h-4" /> : <FiVolumeX className="w-4 h-4" />, val: soundEnabled, set: setSoundEnabled },
                ].map(row => (
                  <button
                    key={row.label}
                    onClick={() => row.set(!row.val)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-colors"
                    style={{ background: 'rgba(255,255,255,0.03)' }}
                  >
                    <span className="flex items-center gap-2 text-sm text-slate-200">{row.icon} {row.label}</span>
                    <span
                      className="text-xs font-semibold"
                      style={{ color: row.val ? selectedGame.accentColor : '#475569' }}
                    >
                      {row.val ? 'Activado' : 'Desactivado'}
                    </span>
                  </button>
                ))}
              </div>

              <p className="text-xs text-slate-400 leading-relaxed px-1">
                AP-Deck es un dashboard de consola construido con React, TypeScript y Framer Motion.
                La Ranura RetroArch corre{' '}
                <strong className="text-slate-300">libretro compilado a WebAssembly</strong>,
                autoalojado en este repositorio — sin depender de ningún servicio externo.
                Los JUEGOs en ZIP se extraen con JSZip directamente en tu navegador.
              </p>

              <button
                onClick={() => setShowSettings(false)}
                className="w-full py-2.5 rounded-full text-white text-sm font-semibold transition-colors"
                style={{ background: 'rgba(255,255,255,0.08)' }}
              >
                Cerrar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
