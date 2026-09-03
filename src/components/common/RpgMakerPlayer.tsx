import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import JSZip from 'jszip';
import { Nostalgist } from 'nostalgist';
import {
  FiVolume2, FiVolumeX, FiMaximize2, FiMinimize2,
  FiArrowLeft, FiUpload, FiTv, FiSmartphone
} from 'react-icons/fi';
import { Cpu, AlertCircle, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface RpgMakerPlayerProps {
  initialFile?: File | null;
  onBack: () => void;
}

export const RpgMakerPlayer: React.FC<RpgMakerPlayerProps> = ({ initialFile = null, onBack }) => {
  const [phase, setPhase] = useState<'idle' | 'extracting' | 'booting' | 'running' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState('');
  const [gameTitle, setGameTitle] = useState('Motor RPG Maker');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [crtEnabled, setCrtEnabled] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showTouchControls, setShowTouchControls] = useState(false);
  const [logLines, setLogLines] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nostalgistInstanceRef = useRef<Nostalgist | null>(null);

  const addLog = useCallback((msg: string) => {
    setLogLines(prev => [...prev.slice(-19), msg]);
  }, []);

  // Detect mobile or touch screen automatically
  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth < 1024;
    setShowTouchControls(isTouch);
  }, []);

  // Virtual Key Dispatcher for Touch Controls
  const sendKey = useCallback((key: string, code: string, type: 'keydown' | 'keyup') => {
    const ev = new KeyboardEvent(type, {
      key,
      code,
      bubbles: true,
      cancelable: true,
    });
    window.dispatchEvent(ev);
    if (canvasRef.current) {
      canvasRef.current.dispatchEvent(ev);
    }
  }, []);

  // ─── Boot Game using Nostalgist + mkxp-z Reference CRuby Core ─────────────
  const bootGame = useCallback(async (targetFile: File) => {
    if (nostalgistInstanceRef.current) {
      try {
        nostalgistInstanceRef.current.exit();
      } catch (_) {}
      nostalgistInstanceRef.current = null;
    }

    setPhase('extracting');
    setProgress(10);
    setProgressLabel('Inspeccionando estructura de archivos...');
    setLogLines([]);
    setErrorMsg('');
    addLog(`📦 Archivo recibido: ${targetFile.name} (${(targetFile.size / 1048576).toFixed(1)} MB)`);

    try {
      // 1. Inspect Game.ini & detect any subfolder nesting
      const zip = new JSZip();
      const zipData = await zip.loadAsync(targetFile);
      const fileKeys = Object.keys(zipData.files);

      let parsedTitle = targetFile.name.replace(/\.zip$/i, '').replace(/_/g, ' ');
      let subfolder = '';

      const iniKey = fileKeys.find(k => k.toLowerCase().endsWith('game.ini'));
      const scriptsKey = fileKeys.find(k => k.toLowerCase().endsWith('scripts.rxdata'));

      if (iniKey) {
        const iniText = await zipData.files[iniKey].async('text');
        const m = iniText.match(/title\s*=\s*(.+)/i);
        if (m?.[1]) parsedTitle = m[1].trim();
        if (iniKey.includes('/')) {
          subfolder = iniKey.substring(0, iniKey.lastIndexOf('/'));
        }
      } else if (scriptsKey && scriptsKey.includes('/')) {
        const parts = scriptsKey.split('/');
        if (parts.length > 2) {
          subfolder = parts.slice(0, -2).join('/');
        }
      }

      setGameTitle(parsedTitle);
      setProgress(25);
      addLog(`✓ Título detectado: "${parsedTitle}"`);

      // 2. Prepare files: only repack if nested in a subfolder, to prevent Out-Of-Memory (unwind) on large 500MB+ games
      let romPayload: File | Blob = targetFile;

      if (subfolder) {
        addLog(`🔄 Desanidando "${subfolder}" hacia la raíz...`);
        setProgress(40);
        setProgressLabel(`Alineando ${subfolder} a la raíz del paquete en memoria...`);

        const flatZip = new JSZip();
        const prefix = subfolder + '/';
        const candidateKeys = fileKeys.filter(key => key.startsWith(prefix) && !zipData.files[key].dir);
        const batchSize = 30;

        for (let i = 0; i < candidateKeys.length; i += batchSize) {
          const batch = candidateKeys.slice(i, i + batchSize);
          await Promise.all(batch.map(async (key) => {
            const strippedKey = key.slice(prefix.length);

            if (strippedKey.endsWith('.rb')) {
              let scriptText = await zipData.files[key].async('text');
              if (scriptText.includes('File.exists?') || scriptText.includes('Dir.exists?')) {
                scriptText = scriptText
                  .replace(/File\.exists\?/g, 'File.exist?')
                  .replace(/Dir\.exists\?/g, 'Dir.exist?');
              }
              flatZip.file(strippedKey, scriptText);
            } else {
              const data = await zipData.files[key].async('uint8array');
              flatZip.file(strippedKey, data);
            }

            if (strippedKey.toLowerCase() === 'data/scripts.rxdata' && strippedKey !== 'Data/Scripts.rxdata') {
              const data = await zipData.files[key].async('uint8array');
              flatZip.file('Data/Scripts.rxdata', data);
            }
          }));
          setProgress(40 + Math.round((i / candidateKeys.length) * 25));
        }

        // Inject 0000_ruby3_shim.rb for Ruby 3.2+ compatibility
        const ruby3Polyfill = `# Ruby 3.2+ Compatibility Polyfill for Pokemon Essentials / mkxp-z
class File
  class << self
    def exists?(path); exist?(path); end unless method_defined?(:exists?)
  end
end
class Dir
  class << self
    def exists?(path); exist?(path); end unless method_defined?(:exists?)
  end
end
Object.const_set(:Fixnum, Integer) unless defined?(Fixnum)
Object.const_set(:Bignum, Integer) unless defined?(Bignum)
`;
        flatZip.file('Data/export/0000_ruby3_shim.rb', ruby3Polyfill);
        flatZip.file('Data/0000_ruby3_shim.rb', ruby3Polyfill);

        setProgress(68);
        setProgressLabel('Generando contenedor de juego game.mkxpz en RAM...');
        addLog(`✓ ${candidateKeys.length} archivos preparados con compresión STORE instantánea`);

        romPayload = await flatZip.generateAsync({
          type: 'blob',
          compression: 'STORE',
        });
      } else {
        addLog(`⚡ Raíz de juego óptima detectada (${(targetFile.size / 1048576).toFixed(1)} MB). Cargando directamente sin duplicar memoria RAM...`);
        setProgress(68);
      }

      // 3. Fast CacheStorage fetch: cache 64MB WASM core & RTP locally in browser
      setPhase('booting');
      setProgress(78);
      setProgressLabel('Cargando núcleo mkxp-z (WASM 42MB) y RTP Standard (21MB) desde caché local...');
      addLog('⚡ Obteniendo binarios WebAssembly acelerados por caché...');

      const base = import.meta.env.BASE_URL ?? '/';
      const CACHE_NAME = 'mkxp-engine-cache-v2';
      const fetchWithCache = async (url: string): Promise<Blob> => {
        try {
          if ('caches' in window) {
            // Invalidate older cache versions if present
            const cacheKeys = await caches.keys();
            for (const key of cacheKeys) {
              if (key.startsWith('mkxp-engine-cache-') && key !== CACHE_NAME) {
                await caches.delete(key);
              }
            }
            const cache = await caches.open(CACHE_NAME);
            const cached = await cache.match(url);
            if (cached) {
              return await cached.blob();
            }
            const res = await fetch(url);
            if (res.ok) {
              await cache.put(url, res.clone());
              return await res.blob();
            }
          }
        } catch (_) {}
        return await fetch(url).then(r => r.blob());
      };

      const [coreJsBlob, coreWasmBlob, rtpBlob] = await Promise.all([
        fetchWithCache(base + 'mkxp/mkxp-z_libretro.js'),
        fetchWithCache(base + 'mkxp/mkxp-z_libretro.wasm'),
        fetchWithCache(base + 'mkxp/Standard.mkxpz'),
      ]);

      setProgress(90);
      setProgressLabel('Iniciando WebGL 60FPS, SDL2 y sintetizador de audio fluido...');
      addLog('🚀 Ejecutando juego con Nostalgist WebAssembly (Máximo Rendimiento)...');

      // 4. Launch with Nostalgist configured for maximum FPS and lowest latency
      const instance = await Nostalgist.launch({
        element: canvasRef.current!,
        core: {
          name: 'mkxp-z',
          js: coreJsBlob,
          wasm: coreWasmBlob,
        },
        rom: {
          fileName: 'game.mkxpz',
          fileContent: romPayload,
        },
        bios: {
          fileName: 'RTP.mkxpz',
          fileContent: rtpBlob,
        },
        retroarchConfig: {
          system_directory: '/home/web_user/retroarch/userdata/system',
          savefile_directory: '/home/web_user/retroarch/userdata/saves',
          savestate_directory: '/home/web_user/retroarch/userdata/states',
          log_verbosity: false,
          libretro_log_level: 1,
          frontend_log_level: 1,
          video_vsync: true,
          video_threaded: true,
          video_smooth: false,
          video_max_swapchain_images: 2,
          audio_latency: 48,
          fastforward_ratio: 1.0,
          input_player1_a: 'c',
          input_player1_b: 'x',
          input_player1_x: 'z',
          input_player1_y: 'shift',
          input_player1_start: 'enter',
        },
        retroarchCoreConfig: {
          'mkxp-z_syntaxTransform': 'true',
          'mkxp-z_subImageFix': 'true',
          'mkxp-z_rgssVersion': '1',
          'mkxp-z_debug': 'disabled',
          'mkxp-z_enableBlitting': 'enabled',
          'mkxp-z_threadedAudio': 'enabled',
          'mkxp-z_SESourceCount': '16',
          'mkxp-z_loadFontsIntoMemory': 'enabled',
          'mkxp-z_frameSkip': 'auto',
          'mkxp-z_saveStateSize': '256',
        },
        beforeLaunch: async (nostalgist) => {
          const fs = nostalgist.getEmscriptenFS();
          for (const dir of [
            '/home/web_user/retroarch/userdata/saves',
            '/home/web_user/retroarch/userdata/states',
            '/home/web_user/retroarch/userdata/system/mkxp-z/RTP',
          ]) {
            const parts = dir.split('/').filter(Boolean);
            let cur = '';
            for (const p of parts) {
              cur += '/' + p;
              try { fs.mkdir(cur); } catch (_) {}
            }
          }
          try {
            fs.rename(
              '/home/web_user/retroarch/userdata/system/RTP.mkxpz',
              '/home/web_user/retroarch/userdata/system/mkxp-z/RTP/Standard.mkxpz'
            );
          } catch (_) {}
        },
      });

      nostalgistInstanceRef.current = instance;
      setPhase('running');
      setProgress(100);
      setProgressLabel('¡Juego en ejecución!');
      addLog('🎮 Motor mkxp-z activo — Ejecución directa de Pokémon Essentials');

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      addLog('❌ Error al ejecutar: ' + msg);
      setErrorMsg(msg);
      setPhase('error');
    }
  }, [addLog]);

  useEffect(() => {
    if (initialFile) {
      bootGame(initialFile);
    }
    return () => {
      if (nostalgistInstanceRef.current) {
        try {
          nostalgistInstanceRef.current.exit();
        } catch (_) {}
        nostalgistInstanceRef.current = null;
      }
    };
  }, [initialFile, bootGame]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const isActive = phase === 'extracting' || phase === 'booting';

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col bg-[#050811] select-none overflow-hidden text-white font-sans"
    >
      {/* ─── TOP BAR (CLEAN, SINGLE HEADER, RESPONSIVE) ──────────────────── */}
      <div
        className="relative z-30 flex items-center justify-between px-2.5 sm:px-6 py-1.5 sm:py-2.5 shrink-0"
        style={{ background: 'rgba(5, 8, 17, 0.98)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
      >
        <button
          onClick={() => {
            if (nostalgistInstanceRef.current) {
              try {
                nostalgistInstanceRef.current.exit();
              } catch (_) {}
              nostalgistInstanceRef.current = null;
            }
            onBack();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-xs text-white bg-white/10 hover:bg-white/15 active:scale-95 transition-all cursor-pointer"
        >
          <FiArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Menú Principal</span>
        </button>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-bold truncate max-w-[45vw]">
          <Cpu className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{gameTitle}</span>
          {phase === 'running' && <span className="ml-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg active:scale-95 transition-all cursor-pointer"
            title="Cargar Paquete ZIP"
          >
            <FiUpload className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Cargar Paquete ZIP</span>
          </button>

          <button
            onClick={() => setShowTouchControls(!showTouchControls)}
            className={`p-2 rounded-full transition-colors cursor-pointer ${showTouchControls ? 'bg-rose-500/20 text-rose-400' : 'bg-white/5 text-slate-400'}`}
            title="Controles Táctiles (Móvil)"
          >
            <FiSmartphone className="w-4 h-4" />
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            title="Sonido"
          >
            {soundEnabled ? <FiVolume2 className="w-4 h-4 text-emerald-400" /> : <FiVolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          <button
            onClick={() => setCrtEnabled(!crtEnabled)}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            title="Filtro CRT"
          >
            <FiTv className={`w-4 h-4 ${crtEnabled ? 'text-indigo-400' : 'text-slate-500'}`} />
          </button>

          <button onClick={toggleFullscreen} className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors cursor-pointer" title="Pantalla Completa">
            {isFullscreen ? <FiMinimize2 className="w-4 h-4" /> : <FiMaximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ─── GAME CANVAS AREA ─────────────────────────────────────────────── */}
      <div className="relative flex-1 min-h-0 bg-black flex items-center justify-center overflow-hidden p-1 sm:p-4">
        {/* CRT overlay */}
        {crtEnabled && (
          <div
            className="pointer-events-none absolute inset-0 z-20 opacity-25"
            style={{ backgroundImage: 'linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.5) 50%)', backgroundSize: '100% 4px' }}
          />
        )}

        {/* Real Hardware Canvas managed by Nostalgist */}
        <canvas
          ref={canvasRef}
          id="canvas"
          width={640}
          height={480}
          tabIndex={-1}
          onContextMenu={e => e.preventDefault()}
          className="w-full max-w-5xl h-full max-h-[calc(100vh-60px)] object-contain rounded-xl border border-white/10 shadow-2xl"
          style={{ background: '#000', display: 'block' }}
        />

        {/* ─── MOBILE VIRTUAL CONTROLLER OVERLAY ──────────────────────────── */}
        {showTouchControls && phase === 'running' && (
          <div className="pointer-events-none absolute inset-0 z-30 flex flex-col justify-between p-3 sm:p-6">
            <div /> {/* Spacer */}

            <div className="flex justify-between items-end w-full">
              {/* Virtual D-Pad (Left) */}
              <div className="pointer-events-auto relative w-32 h-32 select-none">
                {/* UP */}
                <button
                  onPointerDown={() => sendKey('ArrowUp', 'ArrowUp', 'keydown')}
                  onPointerUp={() => sendKey('ArrowUp', 'ArrowUp', 'keyup')}
                  onPointerLeave={() => sendKey('ArrowUp', 'ArrowUp', 'keyup')}
                  className="absolute top-0 left-11 w-10 h-10 rounded-xl bg-white/20 active:bg-rose-500/80 backdrop-blur-md flex items-center justify-center text-white shadow-lg border border-white/20"
                >
                  <ChevronUp className="w-6 h-6" />
                </button>
                {/* DOWN */}
                <button
                  onPointerDown={() => sendKey('ArrowDown', 'ArrowDown', 'keydown')}
                  onPointerUp={() => sendKey('ArrowDown', 'ArrowDown', 'keyup')}
                  onPointerLeave={() => sendKey('ArrowDown', 'ArrowDown', 'keyup')}
                  className="absolute bottom-0 left-11 w-10 h-10 rounded-xl bg-white/20 active:bg-rose-500/80 backdrop-blur-md flex items-center justify-center text-white shadow-lg border border-white/20"
                >
                  <ChevronDown className="w-6 h-6" />
                </button>
                {/* LEFT */}
                <button
                  onPointerDown={() => sendKey('ArrowLeft', 'ArrowLeft', 'keydown')}
                  onPointerUp={() => sendKey('ArrowLeft', 'ArrowLeft', 'keyup')}
                  onPointerLeave={() => sendKey('ArrowLeft', 'ArrowLeft', 'keyup')}
                  className="absolute top-11 left-0 w-10 h-10 rounded-xl bg-white/20 active:bg-rose-500/80 backdrop-blur-md flex items-center justify-center text-white shadow-lg border border-white/20"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                {/* RIGHT */}
                <button
                  onPointerDown={() => sendKey('ArrowRight', 'ArrowRight', 'keydown')}
                  onPointerUp={() => sendKey('ArrowRight', 'ArrowRight', 'keyup')}
                  onPointerLeave={() => sendKey('ArrowRight', 'ArrowRight', 'keyup')}
                  className="absolute top-11 right-0 w-10 h-10 rounded-xl bg-white/20 active:bg-rose-500/80 backdrop-blur-md flex items-center justify-center text-white shadow-lg border border-white/20"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                <div className="absolute top-11 left-11 w-10 h-10 rounded-lg bg-white/10 border border-white/10" />
              </div>

              {/* Virtual Action Buttons (Right) */}
              <div className="pointer-events-auto flex items-end gap-3 select-none">
                {/* B Button (Cancel / Menu / X) */}
                <button
                  onPointerDown={() => {
                    sendKey('x', 'KeyX', 'keydown');
                    sendKey('Escape', 'Escape', 'keydown');
                  }}
                  onPointerUp={() => {
                    sendKey('x', 'KeyX', 'keyup');
                    sendKey('Escape', 'Escape', 'keyup');
                  }}
                  onPointerLeave={() => {
                    sendKey('x', 'KeyX', 'keyup');
                    sendKey('Escape', 'Escape', 'keyup');
                  }}
                  className="w-14 h-14 rounded-full bg-white/20 active:bg-amber-500/80 backdrop-blur-md flex flex-col items-center justify-center text-white font-black shadow-xl border border-white/20 active:scale-95 transition-transform"
                >
                  <span className="text-base">X</span>
                  <span className="text-[9px] text-white/70">Atrás</span>
                </button>

                {/* A / Confirm Button (C / Enter / Z) */}
                <button
                  onPointerDown={() => {
                    sendKey('c', 'KeyC', 'keydown');
                    sendKey('Enter', 'Enter', 'keydown');
                  }}
                  onPointerUp={() => {
                    sendKey('c', 'KeyC', 'keyup');
                    sendKey('Enter', 'Enter', 'keyup');
                  }}
                  onPointerLeave={() => {
                    sendKey('c', 'KeyC', 'keyup');
                    sendKey('Enter', 'Enter', 'keyup');
                  }}
                  className="w-16 h-16 rounded-full bg-rose-600/80 active:bg-rose-500 backdrop-blur-md flex flex-col items-center justify-center text-white font-black shadow-xl border border-rose-400/40 active:scale-95 transition-transform mb-2"
                >
                  <span className="text-lg">C</span>
                  <span className="text-[9px] text-white/80">Acción</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── IDLE: Waiting for user to pick ZIP ──────────────────────────── */}
        {phase === 'idle' && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#050811]/95 p-4">
            <div className="max-w-lg w-full bg-[#0F172A]/90 backdrop-blur-2xl border border-rose-500/30 rounded-3xl p-8 text-center flex flex-col items-center gap-5 shadow-2xl">
              <div className="w-20 h-20 rounded-3xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-xl shadow-rose-500/20">
                <Cpu className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white tracking-tight">Motor Universal mkxp-z (RGSS1/2/3)</h3>
                <p className="text-sm text-slate-400 mt-2 max-w-xs mx-auto leading-relaxed">
                  Ejecuta directamente cualquier juego de <strong className="text-white">RPG Maker XP</strong> o <strong className="text-white">Pokémon Essentials</strong> en WebAssembly con el motor Ruby completo.
                </p>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-8 py-3.5 rounded-full font-black text-sm bg-rose-600 hover:bg-rose-500 text-white shadow-xl shadow-rose-600/30 transition-transform active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <FiUpload className="w-4 h-4" /> Cargar Paquete ZIP
              </button>
            </div>
          </div>
        )}

        {/* ─── BOOTING: Progress ────────────────────────────────────────── */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 z-40 flex flex-col items-center justify-center p-6 bg-slate-950/95 backdrop-blur-xl text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4">
                <Cpu className="w-8 h-8 animate-pulse" />
              </div>
              <h2 className="text-xl font-bold text-white">Iniciando Motor mkxp-z</h2>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">{progressLabel}</p>

              <div className="w-full max-w-sm mt-5 space-y-2">
                <div className="flex justify-between text-xs font-mono text-slate-300">
                  <span>Cargando Núcleo</span>
                  <span className="text-rose-400 font-bold">{progress}%</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full"
                    animate={{ width: `${progress}%` }}
                    transition={{ type: 'tween', ease: 'easeOut' }}
                  />
                </div>
              </div>

              {/* Log output */}
              <div className="mt-4 w-full max-w-sm max-h-28 overflow-y-auto bg-black/40 rounded-xl p-3 text-left font-mono text-[10px] text-slate-400 space-y-0.5">
                {logLines.map((l, i) => <div key={i}>{l}</div>)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Error state ──────────────────────────────────────────────── */}
        {phase === 'error' && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/90 p-4">
            <div className="max-w-md w-full bg-red-950/80 border border-red-500/40 rounded-2xl p-6 text-center flex flex-col items-center gap-4">
              <AlertCircle className="w-10 h-10 text-red-400" />
              <div>
                <h3 className="text-lg font-bold text-white">Error al iniciar el motor</h3>
                <p className="text-xs text-red-300 mt-1 font-mono">{errorMsg}</p>
              </div>
              <div className="w-full max-h-32 overflow-y-auto bg-black/40 rounded-lg p-2 font-mono text-[9px] text-slate-400 text-left space-y-0.5">
                {logLines.map((l, i) => <div key={i}>{l}</div>)}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-2.5 rounded-full font-bold text-xs bg-rose-600 hover:bg-rose-500 text-white cursor-pointer"
              >
                Intentar con otro archivo ZIP
              </button>
            </div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".zip,.mkxpz"
        className="hidden"
        onChange={e => {
          const f = e.target.files?.[0];
          if (f) bootGame(f);
          e.target.value = '';
        }}
      />
    </div>
  );
};
