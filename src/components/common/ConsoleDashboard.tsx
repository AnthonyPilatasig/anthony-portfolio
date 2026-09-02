import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FiPlay, FiMaximize2, FiMinimize2, FiTv, FiVolume2, FiVolumeX,
  FiArrowLeft, FiArrowRight, FiGrid, FiSettings,
  FiAward, FiClock, FiUpload, FiX, FiChevronLeft, FiLogOut
} from 'react-icons/fi';
import { Gamepad2 } from 'lucide-react';
import JSZip from 'jszip';
import { GAME_COVERS } from '../../assets/gameCovers';
import { GameBoyBattle } from './GameBoyBattle';
import { SnakeGame } from './SnakeGame';
import { Game2048 } from './Game2048';

// ─── Modern Console Audio Synthesizer (Nintendo Switch / SteamOS soft clicks) ──
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
    } catch {}
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
  type: 'zip-loader' | 'cartridge' | 'cyber-battle' | 'snake' | '2048';
  src?: string;
  coverArt: string;
  tags: string[];
}

const CONSOLE_GAMES: ConsoleGame[] = [
  {
    id: 'zip-loader',
    title: 'Cargar desde ZIP',
    badge: 'TU JUEGO WEB',
    platform: 'Cualquier Motor HTML5',
    genre: 'Importador Instantáneo',
    playtime: 'Ilimitado',
    trophies: 'Modo Libre',
    bgGradient: 'from-indigo-950 via-purple-950 to-[#050811]',
    accentColor: '#6366F1',
    description: 'Sube o arrastra cualquier juego web comprimido en formato .zip (con index.html en la raíz). Se extrae en la memoria RAM del navegador y se lanza con rendimiento 100% nativo sin subir nada a servidores.',
    type: 'zip-loader',
    coverArt: GAME_COVERS.zipLoader,
    tags: ['HTML5', 'RPG Maker MV/MZ', 'Godot Web', '100% Local'],
  },
  {
    id: 'cartridge-slot',
    title: 'Ranura de Emulación Virtual',
    badge: 'OPEN SOURCE WASM',
    platform: 'libretro · WebAssembly',
    genre: 'Arquitectura 16-Bit / 32-Bit',
    playtime: 'Guardado Local',
    trophies: 'Cores Libres',
    bgGradient: 'from-rose-950 via-red-950 to-[#050811]',
    accentColor: '#F43F5E',
    description: 'Entorno de emulación virtual autoalojado en WebAssembly (núcleos libretro de código abierto). Diseñado para ejecutar respaldos, pruebas técnicas y desarrollos homebrew locales en tu navegador.',
    type: 'cartridge',
    coverArt: GAME_COVERS.retroArch,
    src: './games/cartridge/index.html',
    tags: ['libretro WASM', 'Cores Libres', '100% Local', 'Dumps Personales'],
  },
  {
    id: 'cyber-encounter',
    title: 'Cyber-Encounter',
    badge: 'TACTICAL J-RPG',
    platform: 'TypeScript State Engine',
    genre: 'Turn-Based Battle',
    playtime: '6h 15m',
    trophies: '8/8 Trofeos',
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
    playtime: '12h 05m',
    trophies: '5/5 Trofeos',
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
    playtime: '9h 30m',
    trophies: '10/10 Trofeos',
    bgGradient: 'from-amber-950 via-orange-950 to-[#050811]',
    accentColor: '#F59E0B',
    description: 'Desliza y fusiona potencias de dos hasta alcanzar el bloque 2048 en una matriz algorítmica optimizada.',
    type: '2048',
    coverArt: GAME_COVERS.matrix2048,
    tags: ['Touch Gestures', 'Matriz 4x4', 'Algoritmo', 'Minimalista'],
  },
];

// ─── ZIP Extraction Helper ───────────────────────────────────────────────────
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

  // Gamepad Detection
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
        setSelectedIndex(prev => {
          const next = (prev + 1) % CONSOLE_GAMES.length;
          if (soundEnabled) consoleAudio.playNavigate();
          return next;
        });
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        setSelectedIndex(prev => {
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
  }, [selectedIndex, activeRunningGame, soundEnabled, navigate]);

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

  useEffect(() => {
    setShowGameInfo(false);
  }, [selectedIndex]);

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

  // ZIP Handler
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
      blobsRef.current.forEach(url => URL.revokeObjectURL(url));
      blobsRef.current = [];

      const entries = await extractZipToBlobs(file);
      blobsRef.current = entries.map(e => e.url);
      setZipBlobEntries(entries);

      const rootIndex =
        entries.find(e => e.name.toLowerCase() === 'index.html') ||
        entries.find(e => e.name.toLowerCase().endsWith('/index.html') && e.name.split('/').length === 2);

      if (!rootIndex) {
        setZipError('No se encontró index.html en la raíz del ZIP.');
        setZipLoading(false);
        return;
      }

      setZipIframeSrc(rootIndex.url);
      setActiveRunningGame(CONSOLE_GAMES.find(g => g.id === 'zip-loader') ?? CONSOLE_GAMES[0]);
    } catch (err) {
      setZipError(`Error al extraer el ZIP: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setZipLoading(false);
    }
  };

  const rootClasses = embeddedFullscreen
    ? 'fixed inset-0 w-screen h-screen z-[9999] bg-[#050811] flex flex-col overflow-hidden select-none'
    : `relative w-full bg-[#050811] flex flex-col overflow-hidden select-none ${isFullscreen ? 'fixed inset-0 z-50 rounded-none w-screen h-screen' : 'min-h-[90vh] rounded-[28px] shadow-2xl'}`;

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

      {/* ─── TOP NINTENDO SWITCH / STEAM DECK STATUS BAR ────────────────────── */}
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
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white shadow-lg ring-2 ring-blue-500/40"
            style={{
              background: `linear-gradient(135deg, #3B82F6, #1D4ED8)`,
            }}
          >
            AP
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white text-sm">Anthony</span>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
                style={{ background: 'rgba(59,130,246,0.18)', color: '#93C5FD' }}
              >
                Nivel 99
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="text-amber-400 flex items-center gap-1 font-semibold">
                <FiAward className="w-3 h-3" /> 65 Trofeos
              </span>
              <span className="w-1 h-1 rounded-full bg-emerald-400" />
              <span className="text-emerald-400 font-medium">En línea</span>
            </div>
          </div>
        </div>

        {/* Center: System Console Brand */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06]">
          <Gamepad2 className="w-4 h-4 text-[var(--theme-accent, #38BDF8)]" />
          <span className="font-bold text-sm text-white tracking-wider">AP-DECK OS</span>
          <span className="text-[10px] text-slate-400 font-mono">v2.5</span>
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
              background: soundEnabled ? 'rgba(99,102,241,0.18)' : 'rgba(255,255,255,0.05)',
              color: soundEnabled ? '#818CF8' : '#475569'
            }}
            title="Efectos de sonido de la consola"
          >
            {soundEnabled ? <FiVolume2 className="w-4 h-4" /> : <FiVolumeX className="w-4 h-4" />}
          </button>

          <span
            className="font-bold text-white text-xs px-3 py-1.5 rounded-full tracking-wider"
            style={{ background: 'rgba(255,255,255,0.06)' }}
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
            {/* In-game Quick Menu Bar */}
            <div
              className="flex items-center justify-between px-4 sm:px-6 py-2.5"
              style={{ background: 'rgba(5,8,17,0.95)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
            >
              <button
                onClick={closeGame}
                className="flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs text-white transition-all hover:bg-white/15 active:scale-95"
                style={{ background: 'rgba(255,255,255,0.08)' }}
              >
                <FiChevronLeft className="w-4 h-4" />
                <span>Menú Principal</span>
              </button>

              <div className="flex items-center gap-2.5 text-white font-bold text-sm truncate max-w-[50vw]">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="truncate">{activeRunningGame.title}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCrtEnabled(!crtEnabled)}
                  className="p-2 rounded-full transition-colors"
                  style={{ background: crtEnabled ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.05)', color: crtEnabled ? '#818CF8' : '#94A3B8' }}
                  title="Filtro CRT Scanlines"
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

            {/* Game Screen Frame */}
            <div className="flex-1 min-h-0 flex items-stretch bg-black">
              {activeRunningGame.type === 'zip-loader' && zipIframeSrc && (
                <iframe
                  src={zipIframeSrc}
                  title="Juego cargado desde ZIP"
                  className="w-full h-full border-0 bg-black"
                  allow="autoplay; fullscreen; gamepad"
                  sandbox="allow-scripts allow-same-origin allow-modals allow-pointer-lock allow-forms"
                />
              )}

              {activeRunningGame.type === 'zip-loader' && !zipIframeSrc && (
                <div className="flex-1 flex items-center justify-center p-6 bg-[#050811]">
                  <div className="text-slate-400 text-center max-w-sm">
                    <FiUpload className="w-12 h-12 mx-auto mb-3 text-indigo-400 animate-bounce" />
                    <h3 className="text-lg font-bold text-white">Cargar juego ZIP</h3>
                    <p className="text-xs text-slate-400 mt-1 mb-4">Sube un archivo .zip que contenga index.html en la raíz.</p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-6 py-2.5 rounded-full font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg transition-transform active:scale-95"
                    >
                      Seleccionar Archivo .ZIP
                    </button>
                  </div>
                </div>
              )}

              {activeRunningGame.type === 'cartridge' && (
                <iframe
                  src={activeRunningGame.src}
                  title={activeRunningGame.title}
                  className="w-full h-full border-0 bg-black"
                  allow="autoplay; fullscreen; gamepad"
                />
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
          /* ── STATE B: NINTENDO SWITCH / STEAM DECK HOME DASHBOARD ──────────── */
          <div className="flex flex-1 min-h-0">

            {/* Ozone Left Sidebar Navigation Rail */}
            <div
              className="hidden sm:flex flex-col items-center gap-3.5 py-6 px-3"
              style={{ background: 'rgba(255,255,255,0.015)', borderRight: '1px solid rgba(255,255,255,0.05)' }}
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

            {/* Main Stage: Hero Showcase + Cartridge Shelf */}
            <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
              <div className="flex-1 flex flex-col justify-between p-4 sm:p-6 lg:p-8 gap-4 sm:gap-6">

                {/* ── Panoramic Hero Showcase Banner ───────────────────────── */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedGame.id}
                    initial={{ opacity: 0, y: 15, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -15, scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                    className="relative rounded-[24px] sm:rounded-[28px] overflow-hidden shadow-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${selectedGame.accentColor}22 0%, #0A0E1A 100%)`,
                      border: `1px solid ${selectedGame.accentColor}40`,
                      boxShadow: `0 20px 50px -15px ${selectedGame.accentColor}33`,
                      minHeight: 240,
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
                    <div className="relative z-10 p-6 sm:p-8 lg:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

                      {/* Left: Info & Launch Buttons */}
                      <div className="space-y-4 max-w-xl">
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
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.05]">
                          {selectedGame.title}
                        </h2>

                        {/* Stats Row */}
                        <div className="flex items-center gap-5 text-xs text-slate-300 pt-1">
                          <span className="flex items-center gap-1.5 text-amber-300 font-bold">
                            <FiAward className="w-4 h-4" /> {selectedGame.trophies}
                          </span>
                          <span className="flex items-center gap-1.5 text-blue-300 font-bold">
                            <FiClock className="w-4 h-4" /> {selectedGame.playtime}
                          </span>
                        </div>

                        {/* Primary Launch Action Buttons */}
                        <div className="pt-2 flex flex-wrap items-center gap-3">
                          {selectedGame.type === 'zip-loader' ? (
                            <div className="flex items-center gap-3">
                              <input
                                ref={fileInputRef}
                                type="file"
                                accept=".zip"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleZipFile(file);
                                }}
                              />
                              <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={zipLoading}
                                className="px-7 py-3.5 rounded-full font-black text-sm flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 shadow-xl cursor-pointer"
                                style={{
                                  background: '#FFFFFF',
                                  color: '#0F172A',
                                  boxShadow: '0 0 25px rgba(255,255,255,0.3)',
                                }}
                              >
                                <FiUpload className="w-4 h-4 text-indigo-600" />
                                <span>{zipLoading ? 'Extrayendo ZIP...' : 'Subir Archivo .ZIP'}</span>
                              </button>

                              {zipBlobEntries.length > 0 && !zipError && (
                                <button
                                  onClick={() => launchGame(selectedGame)}
                                  className="px-7 py-3.5 rounded-full font-black text-sm flex items-center gap-2 text-white shadow-xl transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                                  style={{ background: selectedGame.accentColor }}
                                >
                                  <FiPlay className="w-4 h-4 fill-current" /> Jugar
                                </button>
                              )}
                            </div>
                          ) : (
                            <button
                              onClick={() => launchGame(selectedGame)}
                              className="px-8 py-3.5 rounded-full font-black text-sm flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 shadow-xl cursor-pointer"
                              style={{
                                background: '#FFFFFF',
                                color: '#0F172A',
                                boxShadow: `0 0 30px ${selectedGame.accentColor}66`,
                              }}
                            >
                              <FiPlay className="w-4 h-4 fill-current text-slate-900" />
                              <span>JUGAR AHORA</span>
                            </button>
                          )}

                          <button
                            onClick={() => setShowGameInfo(v => !v)}
                            className="px-5 py-3.5 rounded-full font-semibold text-xs text-white transition-colors hover:bg-white/15"
                            style={{ background: 'rgba(255,255,255,0.08)' }}
                          >
                            {showGameInfo ? 'Ocultar Detalles' : 'Detalles & Info'}
                          </button>
                        </div>

                        {/* Error info if zip fails */}
                        {selectedGame.type === 'zip-loader' && zipError && (
                          <p className="text-xs text-red-400 flex items-center gap-1.5 pt-1">
                            <FiX className="w-3.5 h-3.5" /> {zipError}
                          </p>
                        )}

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
                          whileHover={{ scale: 1.05, rotate: 1 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                          onClick={() => launchGame(selectedGame)}
                          className="w-48 lg:w-56 h-48 lg:h-56 rounded-[22px] overflow-hidden shadow-2xl cursor-pointer relative ring-2 ring-white/20"
                          style={{
                            boxShadow: `0 20px 40px -10px ${selectedGame.accentColor}88`,
                          }}
                        >
                          <img
                            src={selectedGame.coverArt}
                            alt={selectedGame.title}
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

                {/* ── Cartridge Shelf Row (Nintendo Switch & Steam Deck Style) ─ */}
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-extrabold text-white tracking-wide uppercase">
                        Tu Biblioteca de Cartuchos
                      </span>
                      <span className="text-xs text-slate-400 px-2.5 py-0.5 rounded-full bg-white/[0.05]">
                        {selectedIndex + 1} de {CONSOLE_GAMES.length}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedIndex(prev => (prev - 1 + CONSOLE_GAMES.length) % CONSOLE_GAMES.length);
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
                          setSelectedIndex(prev => (prev + 1) % CONSOLE_GAMES.length);
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

                  {/* 3D Physical Cartridges Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 pb-2">
                    {CONSOLE_GAMES.map((game, idx) => {
                      const isSel = idx === selectedIndex;
                      return (
                        <motion.div
                          key={game.id}
                          layout
                          initial={false}
                          animate={{
                            scale: isSel ? 1.06 : 1,
                            y: isSel ? -6 : 0,
                          }}
                          whileHover={{ scale: isSel ? 1.08 : 1.04, y: -8 }}
                          whileTap={{ scale: 0.96 }}
                          transition={{ type: 'spring', stiffness: 420, damping: 26 }}
                          onClick={() => {
                            setSelectedIndex(idx);
                            if (soundEnabled) consoleAudio.playNavigate();
                          }}
                          onDoubleClick={() => launchGame(game)}
                          className="cursor-pointer rounded-[20px] relative overflow-hidden aspect-square group shadow-xl"
                          style={{
                            border: isSel ? `3px solid ${game.accentColor}` : '2px solid rgba(255,255,255,0.08)',
                            boxShadow: isSel
                              ? `0 0 0 1px ${game.accentColor}, 0 20px 40px -10px ${game.accentColor}99`
                              : '0 8px 24px rgba(0,0,0,0.5)',
                          }}
                        >
                          {/* Cartridge Cover Image */}
                          <img
                            src={game.coverArt}
                            alt={game.title}
                            className="w-full h-full object-cover transition-all duration-300"
                            style={{
                              filter: isSel ? 'none' : 'saturate(0.7) brightness(0.75)',
                            }}
                          />

                          {/* Top Cartridge Notch & Gold Contact Hint */}
                          <div className="absolute top-0 inset-x-0 h-2 bg-black/40 backdrop-blur-sm pointer-events-none" />

                          {/* Selection Glowing Indicator Pill */}
                          {isSel && (
                            <motion.span
                              layoutId="shelf-active-badge"
                              className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[9px] font-black text-white shadow-lg tracking-wider"
                              style={{ background: game.accentColor }}
                            >
                              EN FOCO
                            </motion.span>
                          )}

                          {/* Bottom Card Title Overlay on Selection */}
                          <div
                            className="absolute inset-x-0 bottom-0 p-3 pt-6 flex flex-col justify-end transition-opacity"
                            style={{
                              background: isSel
                                ? 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)'
                                : 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
                            }}
                          >
                            <p className="text-white text-xs font-bold leading-tight line-clamp-1 drop-shadow-md">
                              {game.title}
                            </p>
                            <span className="text-[10px] text-slate-300 font-medium line-clamp-1">
                              {game.badge}
                            </span>
                          </div>
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

      {/* ─── BOTTOM CONTROLLER FOOTER BAR ─────────────────────────────────── */}
      <div
        className="relative z-30 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between text-xs"
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

        <div className="text-slate-500 text-[11px] font-mono">
          Anthony Pilatasig · AP-Deck Virtual Gaming Lab
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
                  <h3 className="text-white font-bold text-lg">Trofeos & Logros</h3>
                  <p className="text-xs text-slate-400">Progreso desbloqueado en AP-Deck</p>
                </div>
              </div>
              <div className="space-y-2.5 pt-2">
                {CONSOLE_GAMES.map(game => (
                  <div
                    key={game.id}
                    className="flex items-center justify-between px-4 py-3 rounded-2xl bg-white/[0.04]"
                  >
                    <div className="flex items-center gap-2.5">
                      <img src={game.coverArt} alt="" className="w-7 h-7 rounded-lg object-cover" />
                      <span className="text-xs font-semibold text-slate-200 truncate">{game.title}</span>
                    </div>
                    <span className="text-xs font-bold shrink-0" style={{ color: game.accentColor }}>
                      {game.trophies}
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
                    <FiTv className="w-4 h-4 text-indigo-400" /> Filtro CRT Scanlines
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
                AP-Deck es una consola virtual inspirada en la arquitectura y estética de <strong className="text-white">Nintendo Switch</strong> y <strong className="text-white">SteamOS</strong>. Soporta emulación RetroArch WebAssembly, carga de paquetes ZIP en memoria RAM local y mini-juegos en TypeScript.
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
    </div>
  );
};
