import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  FiPlay, FiPause, FiVolume2, FiVolumeX, FiMusic, FiChevronUp, FiChevronDown,
  FiDisc, FiExternalLink, FiSkipForward, FiSkipBack
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

// Live 24/7 Radio Streams (verified reachable + no CORS blocking on <audio>)
export interface RadioStation {
  id: string;
  name: string;
  category: 'anime' | 'lofi' | 'gaming' | 'normal';
  description: string;
  streamUrl: string;
  tag: string;
  source: string;
}

const CATEGORY_LABELS: Record<RadioStation['category'] | 'all', string> = {
  all: 'Todas',
  anime: 'Anime',
  lofi: 'Lo-Fi',
  gaming: 'Gaming / VGM',
  normal: 'Normal',
};

const LIVE_STATIONS: RadioStation[] = [
  {
    id: 'japan-hits',
    name: 'Japan Hits & Anime Hits 24/7',
    category: 'anime',
    description: 'Top anime openings, J-Pop actual y clásicos de Japón',
    streamUrl: 'https://kathy.torontocast.com:3560/stream',
    tag: 'J-POP / ANIME',
    source: 'Éxitos de Anime en Vivo',
  },
  {
    id: 'listen-moe',
    name: 'LISTEN.moe Anime Stream',
    category: 'anime',
    description: 'Emisión oficial de música de anime y doujin en alta calidad',
    streamUrl: 'https://listen.moe/stream',
    tag: 'ANIME OFFICIAL',
    source: 'Música Anime 24/7',
  },
  {
    id: 'gensokyo-radio',
    name: 'Gensokyo Anime & Gaming Radio',
    category: 'gaming',
    description: 'Bandas sonoras de videojuegos anime, Touhou y arreglos orquestales',
    streamUrl: 'https://stream.gensokyoradio.net/1/',
    tag: 'ANIME / VGM',
    source: 'Videojuegos & Anime OSTs',
  },
  {
    id: 'nightwave-plaza',
    name: 'Nightwave Plaza (Anime Vibe)',
    category: 'lofi',
    description: 'Anime aesthetic, vaporwave nostálgico y ambientación japonesa',
    streamUrl: 'https://radio.plaza.one/mp3',
    tag: 'ANIME VIBE',
    source: 'Anime Aesthetic',
  },
  {
    id: 'soma-groovesalad',
    name: 'Groove Salad · Ambient Chill',
    category: 'normal',
    description: 'Downtempo y ambient relajante, sin temática anime — sonido neutro para trabajar',
    streamUrl: 'https://ice1.somafm.com/groovesalad-128-mp3',
    tag: 'CHILL / AMBIENT',
    source: 'SomaFM · Groove Salad',
  },
  {
    id: 'soma-poptron',
    name: 'Poptron · Indie Pop',
    category: 'normal',
    description: 'Synth pop e indie underground, sonido mainstream sin temática anime',
    streamUrl: 'https://ice2.somafm.com/poptron-128-mp3',
    tag: 'POP / INDIE',
    source: 'SomaFM · Poptron',
  },
];

export const GlobalAudioPlayer: React.FC = () => {
  const [category, setCategory] = useState<RadioStation['category'] | 'all'>('all');
  const [stationIndex, setStationIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.75);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSpotifyModal, setShowSpotifyModal] = useState(false);
  const [status, setStatus] = useState<'idle' | 'buffering' | 'playing' | 'error'>('idle');

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const visibleStations = useMemo(
    () => (category === 'all' ? LIVE_STATIONS : LIVE_STATIONS.filter((s) => s.category === category)),
    [category]
  );

  const currentStation = LIVE_STATIONS[stationIndex];

  // Sync Volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const startPlayback = async (url: string) => {
    if (!audioRef.current) return;
    try {
      setStatus('buffering');
      if (audioRef.current.src !== url) {
        audioRef.current.src = url;
      }
      await audioRef.current.play();
      setIsPlaying(true);
      setStatus('playing');
    } catch {
      setStatus('error');
      setIsPlaying(false);
    }
  };

  const stopPlayback = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
    setStatus('idle');
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopPlayback();
    } else {
      startPlayback(currentStation.streamUrl);
    }
  };

  const selectStation = (idx: number) => {
    setStationIndex(idx);
    const station = LIVE_STATIONS[idx];
    if (isPlaying || status === 'buffering') {
      startPlayback(station.streamUrl);
    }
  };

  const selectCategory = (cat: RadioStation['category'] | 'all') => {
    setCategory(cat);
    const list = cat === 'all' ? LIVE_STATIONS : LIVE_STATIONS.filter((s) => s.category === cat);
    if (list.length === 0) return;
    if (!list.some((s) => s.id === currentStation.id)) {
      selectStation(LIVE_STATIONS.findIndex((s) => s.id === list[0].id));
    }
  };

  const stepStation = (dir: 1 | -1) => {
    if (visibleStations.length === 0) return;
    const posInVisible = visibleStations.findIndex((s) => s.id === currentStation.id);
    const nextPos = (posInVisible + dir + visibleStations.length) % visibleStations.length;
    const nextStation = visibleStations[nextPos];
    selectStation(LIVE_STATIONS.findIndex((s) => s.id === nextStation.id));
  };

  return (
    <>
      {/* Native HTML5 Audio Element — no crossOrigin: these Icecast/Shoutcast streams
          don't send Access-Control-Allow-Origin, so setting crossOrigin makes play() reject. */}
      <audio
        ref={audioRef}
        preload="none"
        onWaiting={() => setStatus('buffering')}
        onPlaying={() => {
          setStatus('playing');
          setIsPlaying(true);
        }}
        onPause={() => {
          if (status !== 'buffering') setStatus('idle');
          setIsPlaying(false);
        }}
        onError={() => {
          setStatus('error');
          setIsPlaying(false);
        }}
      />

      {/* Floating Capsule Player */}
      <aside aria-label="Reproductor de radio en vivo" className="fixed bottom-5 right-5 z-40 font-mono">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="editorial-card rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl border border-[var(--theme-border-strong)] bg-[var(--theme-surface)]/95"
        >
          {/* Expanded Menu: Station List */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="w-88 p-4 border-b border-[var(--theme-border)] space-y-3.5"
              >
                {/* Header & Category Filter */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 p-1 rounded-lg bg-[var(--theme-bg)] border border-[var(--theme-border)] text-[9px] overflow-x-auto max-w-[210px]">
                    {(Object.keys(CATEGORY_LABELS) as (RadioStation['category'] | 'all')[]).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => selectCategory(cat)}
                        className={`px-2 py-1 rounded-md transition-all whitespace-nowrap ${
                          category === cat
                            ? 'bg-[var(--theme-accent)] text-white font-bold'
                            : 'text-[var(--theme-ink-muted)] hover:text-[var(--theme-ink)]'
                        }`}
                      >
                        {CATEGORY_LABELS[cat]}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setShowSpotifyModal(true)}
                    className="text-[10px] text-[var(--theme-accent)] hover:underline flex items-center gap-1 shrink-0"
                  >
                    <span>Spotify</span>
                    <FiExternalLink className="w-2.5 h-2.5" />
                  </button>
                </div>

                <p className="text-[9px] text-[var(--theme-ink-muted)] leading-relaxed">
                  Por defecto suena anime/gaming — cambia a <strong className="text-[var(--theme-ink)]">"Normal"</strong> si prefieres algo sin esa temática.
                </p>

                {/* Station List */}
                <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                  {visibleStations.map((s) => {
                    const idx = LIVE_STATIONS.findIndex((st) => st.id === s.id);
                    const isActive = s.id === currentStation.id;
                    return (
                      <button
                        key={s.id}
                        onClick={() => selectStation(idx)}
                        className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center justify-between ${
                          isActive
                            ? 'bg-[var(--theme-accent)] text-white font-medium shadow-md'
                            : 'hover:bg-[var(--theme-border)]/60 text-[var(--theme-ink)]'
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <p className="font-semibold truncate text-[11px] flex items-center gap-1.5">
                            {isActive && isPlaying && (
                              <span className="w-2 h-2 rounded-full bg-white animate-pulse shrink-0" />
                            )}
                            <span>{s.name}</span>
                          </p>
                          <p className={`text-[9px] truncate mt-0.5 ${isActive ? 'text-blue-100' : 'text-[var(--theme-ink-muted)]'}`}>
                            {s.description}
                          </p>
                        </div>
                        <span className={`text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0 ${
                          isActive ? 'bg-white/20 text-white' : 'badge'
                        }`}>
                          {s.tag}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Volume Slider & Controls */}
                <div className="pt-2.5 border-t border-[var(--theme-border)] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-1">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="text-[var(--theme-ink-muted)] hover:text-[var(--theme-ink)] transition-colors p-1"
                    >
                      {isMuted || volume === 0 ? <FiVolumeX className="w-3.5 h-3.5" /> : <FiVolume2 className="w-3.5 h-3.5" />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={isMuted ? 0 : volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="w-full h-1 bg-[var(--theme-border)] rounded-lg appearance-none cursor-pointer accent-[var(--theme-accent)]"
                      aria-label="Volumen"
                    />
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => stepStation(-1)}
                      className="p-1 rounded hover:bg-[var(--theme-border)] text-[var(--theme-ink-muted)]"
                      title="Anterior"
                    >
                      <FiSkipBack className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => stepStation(1)}
                      className="p-1 rounded hover:bg-[var(--theme-border)] text-[var(--theme-ink-muted)]"
                      title="Siguiente"
                    >
                      <FiSkipForward className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Compact Player Bar (Always Visible) */}
          <div className="flex items-center gap-3 p-2.5 px-3.5 min-w-[300px]">
            {/* Play/Pause Button */}
            <button
              onClick={togglePlay}
              className="w-9 h-9 rounded-xl bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] text-white flex items-center justify-center shrink-0 transition-transform active:scale-95 shadow-md shadow-blue-500/20"
              aria-label={isPlaying ? 'Pausar música' : 'Reproducir música'}
            >
              {status === 'buffering' ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <FiPause className="w-4 h-4" />
              ) : (
                <FiPlay className="w-4 h-4 translate-x-0.5" />
              )}
            </button>

            {/* Current Track Info & Waves */}
            <div
              className="flex-1 min-w-0 cursor-pointer select-none"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-[var(--theme-ink)] truncate block">
                  {currentStation.name}
                </span>
                {isPlaying && (
                  <div className="flex items-end gap-[2px] h-3 shrink-0">
                    <span className="w-[2px] bg-[var(--theme-accent)] rounded-full animate-[pulse_0.5s_ease-in-out_infinite] h-2" />
                    <span className="w-[2px] bg-[var(--theme-accent)] rounded-full animate-[pulse_0.8s_ease-in-out_infinite] h-3" />
                    <span className="w-[2px] bg-[var(--theme-accent)] rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-1.5" />
                  </div>
                )}
              </div>
              <p className="text-[9px] text-[var(--theme-ink-muted)] truncate flex items-center gap-1">
                <FiDisc className={`w-2.5 h-2.5 ${isPlaying ? 'animate-spin text-[var(--theme-accent)]' : ''}`} />
                <span>
                  {status === 'error' ? 'No se pudo conectar — prueba otra emisora' : currentStation.source}
                </span>
              </p>
            </div>

            {/* Expand / Collapse Button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 text-[var(--theme-ink-muted)] hover:text-[var(--theme-ink)] hover:bg-[var(--theme-border)] rounded-lg transition-colors"
              aria-label="Expandir reproductor"
            >
              {isExpanded ? <FiChevronDown className="w-4 h-4" /> : <FiChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </motion.div>
      </aside>

      {/* Spotify Modal Embed */}
      <AnimatePresence>
        {showSpotifyModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm font-mono"
            onClick={() => setShowSpotifyModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="editorial-card p-6 rounded-2xl w-full max-w-md space-y-4 shadow-2xl bg-[var(--theme-surface)]"
            >
              <div className="flex items-center justify-between border-b border-[var(--theme-border)] pb-3">
                <div className="flex items-center gap-2">
                  <FiMusic className="w-5 h-5 text-[var(--theme-accent)]" />
                  <h3 className="text-sm font-bold text-[var(--theme-ink)] uppercase tracking-wider">
                    Anime & Gaming Soundtracks
                  </h3>
                </div>
                <button
                  onClick={() => setShowSpotifyModal(false)}
                  className="text-xs text-[var(--theme-ink-muted)] hover:text-[var(--theme-ink)] p-1 rounded"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-[var(--theme-ink-muted)] font-light">
                Playlist oficial con los openings más populares de anime (Demon Slayer, Jujutsu Kaisen, Your Name, NieR y Persona 5).
              </p>

              {/* Spotify Embed Player */}
              <div className="rounded-xl overflow-hidden border border-[var(--theme-border)]">
                <iframe
                  title="Spotify Anime & Gaming Playlist"
                  src="https://open.spotify.com/embed/playlist/37i9dQZF1DX6XceWZz1N4M?utm_source=generator&theme=0"
                  width="100%"
                  height="152"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="rounded-xl"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setShowSpotifyModal(false)}
                  className="btn-secondary text-xs"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
