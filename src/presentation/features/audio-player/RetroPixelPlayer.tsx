import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ANTHONY_SPOTIFY_PLAYLIST_NAME,
  CASSETTE_STATIONS,
  formatSpotifyEmbedUrl,
  getSavedSpotifyUrl,
  saveSpotifyUrl,
} from './musicService';
import { PixelCassette } from './PixelCassette';
import {
  FiPlay,
  FiPause,
  FiMusic,
  FiExternalLink,
  FiVolume2,
  FiVolumeX,
  FiSkipBack,
  FiSkipForward,
  FiEdit2,
  FiCheck,
  FiChevronDown,
  FiChevronUp,
} from 'react-icons/fi';

export const RetroPixelPlayer: React.FC = () => {
  const [spotifyUrl, setSpotifyUrl] = useState<string>(getSavedSpotifyUrl);
  const [isEditingUrl, setIsEditingUrl] = useState<boolean>(false);
  const [urlInput, setUrlInput] = useState<string>(spotifyUrl);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentStationIndex, setCurrentStationIndex] = useState<number>(0);
  const [tapeCounter, setTapeCounter] = useState<number>(42);
  const [volume, setVolume] = useState<number>(0.6);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showEmbed, setShowEmbed] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentStation = CASSETTE_STATIONS[currentStationIndex];
  const embedUrl = formatSpotifyEmbedUrl(spotifyUrl);

  // Sync volume with audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Audio Play/Pause effect
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.src = currentStation.streamUrl;
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Audio playback error / Autoplay blocked:', err);
          setIsPlaying(false);
        });
      }
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentStationIndex, currentStation.streamUrl]);

  // Increment mechanical tape counter while playing
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setTapeCounter((prev) => (prev >= 999 ? 0 : prev + 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleNextStation = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const next = (currentStationIndex + 1) % CASSETTE_STATIONS.length;
    setCurrentStationIndex(next);
    if (!isPlaying) setIsPlaying(true);
  };

  const handlePrevStation = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const prev = (currentStationIndex - 1 + CASSETTE_STATIONS.length) % CASSETTE_STATIONS.length;
    setCurrentStationIndex(prev);
    if (!isPlaying) setIsPlaying(true);
  };

  const handleSaveUrl = () => {
    if (urlInput.trim()) {
      saveSpotifyUrl(urlInput.trim());
      setSpotifyUrl(urlInput.trim());
    }
    setIsEditingUrl(false);
  };

  return (
    <aside
      aria-label="Reproductor Casete 8-Bit"
      className="fixed bottom-3 right-3 z-40 font-mono select-none"
    >
      <audio
        ref={audioRef}
        preload="none"
        onEnded={() => handleNextStation()}
        onError={() => {
          console.warn('Stream unreachable, fallback to next station');
          setCurrentStationIndex((prev) => (prev + 1) % CASSETTE_STATIONS.length);
        }}
      />

      <motion.div
        initial={{ y: 20, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-[270px] sm:w-[290px] rounded-lg bg-[#0c1017] border-2 border-[#334155] p-2 shadow-2xl text-slate-100 flex flex-col gap-1.5"
        style={{
          boxShadow: '0 8px 24px rgba(0,0,0,0.85), 0 0 16px rgba(16,185,129,0.2)',
        }}
      >
        {/* ─── COMPACT 8-BIT CASSETTE (SOLO EL CASETE) ─────────────── */}
        <div
          className="cursor-pointer"
          onClick={togglePlay}
          title={isPlaying ? 'Click para pausar' : 'Click para reproducir música continua'}
        >
          <PixelCassette
            playlistName={ANTHONY_SPOTIFY_PLAYLIST_NAME}
            subtitle={`${currentStation.name} • ${currentStation.genre}`}
            sideLabel={currentStation.side}
            isPlaying={isPlaying}
            tapeCounter={tapeCounter}
          />
        </div>

        {/* ─── QUICK CONTROLS BAR ──────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-1 pt-1 border-t border-[#1e293b] text-[9px]">
          {/* Main Play / Pause Button */}
          <button
            onClick={togglePlay}
            className={`flex items-center gap-1 px-2 py-1 rounded-[2px] font-black text-[9px] cursor-pointer shadow-sm transition-all active:translate-y-[1px] ${
              isPlaying
                ? 'bg-amber-400 hover:bg-amber-300 text-black shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                : 'bg-[#10b981] hover:bg-[#34d399] text-black shadow-[0_0_8px_rgba(16,185,129,0.4)]'
            }`}
            title={isPlaying ? 'Pausar música' : 'Reproducir música completa continua'}
          >
            {isPlaying ? (
              <FiPause className="w-2.5 h-2.5 fill-black" />
            ) : (
              <FiPlay className="w-2.5 h-2.5 fill-black" />
            )}
            <span>{isPlaying ? 'PAUSAR' : 'REPRODUCIR'}</span>
          </button>

          {/* Lado / Estación Switcher */}
          <div className="flex items-center gap-0.5 bg-[#1e293b] px-1 py-0.5 rounded-[2px] border border-[#334155]">
            <button
              onClick={handlePrevStation}
              className="text-slate-400 hover:text-white p-0.5 cursor-pointer"
              title="Lado anterior"
            >
              <FiSkipBack className="w-2.5 h-2.5" />
            </button>
            <span className="text-[8px] font-bold text-emerald-400 tracking-tight">
              {currentStation.side}
            </span>
            <button
              onClick={handleNextStation}
              className="text-slate-400 hover:text-white p-0.5 cursor-pointer"
              title="Siguiente lado"
            >
              <FiSkipForward className="w-2.5 h-2.5" />
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-1 bg-[#1e293b]/60 px-1 py-0.5 rounded-[2px]">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="text-slate-300 hover:text-white cursor-pointer"
              title={isMuted ? 'Activar sonido' : 'Silenciar'}
            >
              {isMuted || volume === 0 ? (
                <FiVolumeX className="w-2.5 h-2.5 text-rose-400" />
              ) : (
                <FiVolume2 className="w-2.5 h-2.5 text-emerald-400" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                if (isMuted) setIsMuted(false);
              }}
              className="w-9 h-1 bg-slate-700 rounded-sm appearance-none cursor-pointer accent-[#10b981]"
              title={`Volumen: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
            />
          </div>

          {/* External link to Anthony's Spotify */}
          <a
            href={spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[9px] text-[#10b981] hover:underline flex items-center gap-0.5 font-bold cursor-pointer shrink-0"
            title="Abrir playlist AnthonWorld en Spotify"
          >
            <FiMusic className="w-2.5 h-2.5" />
            <span>Spotify</span>
            <FiExternalLink className="w-2 h-2" />
          </a>

          {/* Optional toggle for Spotify embed widget */}
          <button
            onClick={() => setShowEmbed(!showEmbed)}
            className="p-0.5 text-slate-400 hover:text-white cursor-pointer"
            title={showEmbed ? 'Ocultar widget Spotify' : 'Ver widget Spotify'}
          >
            {showEmbed ? <FiChevronDown className="w-2.5 h-2.5" /> : <FiChevronUp className="w-2.5 h-2.5" />}
          </button>
        </div>

        {/* ─── OPTIONAL SPOTIFY EMBED (SOLO SI SE ABRE EXPLÍCITAMENTE) ─ */}
        <AnimatePresence>
          {showEmbed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-[#1e293b] pt-1.5 space-y-1.5"
            >
              <div className="flex items-center justify-between text-[8px] text-slate-400">
                <span>Widget Oficial Spotify:</span>
                <button
                  onClick={() => setIsEditingUrl(!isEditingUrl)}
                  className="flex items-center gap-1 hover:text-white cursor-pointer"
                  title="Cambiar URL"
                >
                  <FiEdit2 className="w-2 h-2" />
                  <span>Editar URL</span>
                </button>
              </div>

              {isEditingUrl && (
                <div className="flex items-center gap-1 bg-[#090d16] border border-[#1e293b] rounded-[2px] p-1 text-[8px]">
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="Pega URL de Spotify..."
                    className="w-full bg-transparent text-white outline-none font-mono"
                  />
                  <button
                    onClick={handleSaveUrl}
                    className="px-1.5 py-0.5 bg-[#10b981] text-black font-black rounded-[1px] cursor-pointer shrink-0"
                  >
                    <FiCheck className="w-2 h-2" />
                  </button>
                </div>
              )}

              <div className="rounded-[4px] overflow-hidden border border-[#1e293b] bg-black shadow-inner">
                <iframe
                  credentialless=""
                  title="Reproductor Spotify AnthonWorld"
                  src={embedUrl}
                  width="100%"
                  height="152"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  referrerPolicy="strict-origin-when-cross-origin"
                  loading="lazy"
                  className="rounded-[4px]"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </aside>
  );
};
