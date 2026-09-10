import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ANTHONY_SPOTIFY_PLAYLIST_NAME,
  formatSpotifyEmbedUrl,
  getSavedSpotifyUrl,
  saveSpotifyUrl,
} from './musicService';
import { PixelCassette } from './PixelCassette';
import {
  FiPlay,
  FiMusic,
  FiExternalLink,
  FiEdit2,
  FiCheck,
  FiChevronUp,
  FiChevronDown,
} from 'react-icons/fi';

export const RetroPixelPlayer: React.FC = () => {
  const [spotifyUrl, setSpotifyUrl] = useState<string>(getSavedSpotifyUrl);
  const [isEditingUrl, setIsEditingUrl] = useState<boolean>(false);
  const [urlInput, setUrlInput] = useState<string>(spotifyUrl);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [tapeCounter, setTapeCounter] = useState<number>(42);

  const embedUrl = formatSpotifyEmbedUrl(spotifyUrl);

  // Increment mechanical tape counter while playing
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setTapeCounter((prev) => (prev >= 999 ? 0 : prev + 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleSaveUrl = () => {
    if (urlInput.trim()) {
      saveSpotifyUrl(urlInput.trim());
      setSpotifyUrl(urlInput.trim());
    }
    setIsEditingUrl(false);
  };

  return (
    <aside
      aria-label="Reproductor Casete 8-Bit Spotify"
      className="fixed bottom-3 right-3 z-40 font-mono select-none"
    >
      <motion.div
        initial={{ y: 20, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-[260px] sm:w-[280px] rounded-lg bg-[#0c1017] border-2 border-[#334155] p-2 shadow-2xl text-slate-100 flex flex-col gap-1.5"
        style={{
          boxShadow: '0 8px 24px rgba(0,0,0,0.85), 0 0 16px rgba(16,185,129,0.2)',
        }}
      >
        {/* ─── COMPACT 8-BIT CASSETTE (PEQUEÑO Y PIXELADO) ─────────────── */}
        <div
          className="cursor-pointer"
          onClick={() => {
            setIsExpanded(!isExpanded);
            setIsPlaying(true);
          }}
          title="Click para abrir el reproductor Spotify"
        >
          <PixelCassette
            playlistName={ANTHONY_SPOTIFY_PLAYLIST_NAME}
            isPlaying={isPlaying}
            tapeCounter={tapeCounter}
          />
        </div>

        {/* ─── QUICK CONTROLS BAR ──────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-1 pt-1 border-t border-[#1e293b] text-[9px]">
          <button
            onClick={() => {
              setIsExpanded(!isExpanded);
              setIsPlaying(!isPlaying);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-[#10b981] hover:bg-[#34d399] active:translate-y-[1px] text-black font-black text-[9px] cursor-pointer shadow-sm transition-transform"
            title="Abrir o reproducir lista de Spotify"
          >
            <FiPlay className="w-3 h-3 fill-black" />
            <span>{isExpanded ? 'OCULTAR' : 'REPRODUCIR'}</span>
          </button>

          <a
            href={spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[9px] text-[#10b981] hover:underline flex items-center gap-1 font-bold cursor-pointer"
            title="Abrir en Spotify Web o App"
          >
            <FiMusic className="w-2.5 h-2.5" />
            <span>Spotify</span>
            <FiExternalLink className="w-2 h-2" />
          </a>

          <button
            onClick={() => setIsEditingUrl(!isEditingUrl)}
            className="p-1 rounded-[2px] bg-[#1e293b] hover:bg-[#334155] text-slate-300 hover:text-white cursor-pointer"
            title="Cambiar URL de Playlist"
          >
            <FiEdit2 className="w-2.5 h-2.5" />
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-[2px] bg-[#1e293b] hover:bg-[#334155] text-slate-300 hover:text-white cursor-pointer"
            aria-label={isExpanded ? 'Colapsar casete' : 'Expandir casete'}
          >
            {isExpanded ? <FiChevronDown className="w-3 h-3" /> : <FiChevronUp className="w-3 h-3" />}
          </button>
        </div>

        {/* ─── URL EDIT FIELD (OPTIONAL FOR CUSTOM PLAYLISTS) ──────────── */}
        <AnimatePresence>
          {isEditingUrl && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex items-center gap-1 bg-[#090d16] border border-[#1e293b] rounded-[2px] p-1 text-[8px]"
            >
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
                <FiCheck className="w-2.5 h-2.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── EMBEDDED SPOTIFY PLAYER (ANTHONY'S REAL PLAYLIST) ───────── */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-[#1e293b] pt-1.5"
            >
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
