import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  fetchSpotifyOEmbed,
  getSavedSpotifyUrl,
  saveSpotifyUrl,
  toSpotifyUri,
} from './musicService';
import { PixelCassette } from './PixelCassette';
import { loadSpotifyIframeApi, type SpotifyEmbedController } from '@infrastructure/embeds/spotifyIframeApi';
import { FiPlay, FiPause, FiMusic, FiExternalLink, FiEdit2, FiCheck, FiLoader } from 'react-icons/fi';

const CONNECTION_TIMEOUT_MS = 8000;

export const RetroPixelPlayer: React.FC = () => {
  const [spotifyUrl, setSpotifyUrl] = useState<string>(getSavedSpotifyUrl);
  const [isEditingUrl, setIsEditingUrl] = useState<boolean>(false);
  const [urlInput, setUrlInput] = useState<string>(spotifyUrl);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [controllerReady, setControllerReady] = useState<boolean>(false);
  const [connectionFailed, setConnectionFailed] = useState<boolean>(false);
  const [playlistTitle, setPlaylistTitle] = useState<string>('AnthonWorld');
  const [coverArtUrl, setCoverArtUrl] = useState<string | undefined>(undefined);
  const [tapeCounter, setTapeCounter] = useState<number>(42);

  const embedContainerRef = useRef<HTMLDivElement | null>(null);
  const controllerRef = useRef<SpotifyEmbedController | null>(null);

  // Connects to Spotify's real embed player entirely in the background — no visible
  // widget. Play/pause is driven by the controller, and the cassette above just
  // reflects its real state. The player itself lives off-screen (not display:none,
  // which can suspend it in some browsers), just visually out of the way.
  useEffect(() => {
    let cancelled = false;

    const timeout = setTimeout(() => {
      if (!cancelled && !controllerRef.current) setConnectionFailed(true);
    }, CONNECTION_TIMEOUT_MS);

    loadSpotifyIframeApi().then((IFrameAPI) => {
      if (cancelled || !embedContainerRef.current || controllerRef.current) return;

      IFrameAPI.createController(
        embedContainerRef.current,
        { uri: toSpotifyUri(spotifyUrl) },
        (controller) => {
          if (cancelled) return;
          clearTimeout(timeout);
          controllerRef.current = controller;
          setControllerReady(true);
          setConnectionFailed(false);
          controller.addListener('playback_update', (e) => {
            setIsPlaying(!e.data.isPaused);
            setIsBuffering(e.data.isBuffering);
          });
        }
      );
    });

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
    // Created once on mount; later URL changes go through controller.loadUri() in
    // handleSaveUrl instead of re-running this effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Real playlist/track name + cover art, from Spotify's public oEmbed endpoint.
  useEffect(() => {
    fetchSpotifyOEmbed(spotifyUrl).then((meta) => {
      if (meta) {
        setPlaylistTitle(meta.title);
        setCoverArtUrl(meta.thumbnailUrl);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- initial load only; edits refetch in handleSaveUrl.
  }, []);

  // Purely cosmetic tape counter while something is actually playing.
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setTapeCounter((prev) => (prev >= 999 ? 0 : prev + 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlay = () => {
    controllerRef.current?.togglePlay();
  };

  const handleSaveUrl = () => {
    const trimmed = urlInput.trim();
    if (trimmed) {
      saveSpotifyUrl(trimmed);
      setSpotifyUrl(trimmed);
      controllerRef.current?.loadUri(toSpotifyUri(trimmed));
      fetchSpotifyOEmbed(trimmed).then((meta) => {
        if (meta) {
          setPlaylistTitle(meta.title);
          setCoverArtUrl(meta.thumbnailUrl);
        }
      });
    }
    setIsEditingUrl(false);
  };

  const statusLabel = isBuffering ? 'CARGANDO…' : isPlaying ? 'REPRODUCIENDO' : 'PAUSADO';
  const canPlay = controllerReady && !connectionFailed;

  return (
    <aside
      aria-label="Reproductor Casete 8-Bit conectado a Spotify"
      className="fixed bottom-3 right-3 z-40 font-mono select-none"
    >
      {/* Spotify's iFrame API takes over this element with its own real, hidden
          player — that's what actually streams the full track. Kept off-screen
          (not display:none) rather than shown as a visible widget. */}
      <div className="absolute w-px h-px overflow-hidden -left-[9999px]">
        <div ref={embedContainerRef} />
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-[270px] sm:w-[290px] rounded-lg bg-[#0c1017] border-2 border-[#334155] p-2 shadow-2xl text-slate-100 flex flex-col gap-1.5"
        style={{
          boxShadow: '0 8px 24px rgba(0,0,0,0.85), 0 0 16px rgba(16,185,129,0.2)',
        }}
      >
        {/* ─── COMPACT 8-BIT CASSETTE — la portada real gira en los carretes ─ */}
        <div
          className="cursor-pointer"
          onClick={togglePlay}
          title={isPlaying ? 'Click para pausar' : 'Click para reproducir'}
        >
          <PixelCassette
            playlistName={playlistTitle}
            subtitle="Anthony Pilatasig • Spotify"
            sideLabel={statusLabel}
            isPlaying={isPlaying}
            tapeCounter={tapeCounter}
            coverArtUrl={coverArtUrl}
          />
        </div>

        {/* ─── QUICK CONTROLS BAR ──────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-1 pt-1 border-t border-[#1e293b] text-[9px]">
          {/* Main Play / Pause Button — controls the real (hidden) Spotify player */}
          <button
            onClick={togglePlay}
            disabled={!canPlay}
            className={`flex items-center gap-1 px-2 py-1 rounded-[2px] font-black text-[9px] cursor-pointer shadow-sm transition-all active:translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed ${
              isPlaying
                ? 'bg-amber-400 hover:bg-amber-300 text-black shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                : 'bg-[#10b981] hover:bg-[#34d399] text-black shadow-[0_0_8px_rgba(16,185,129,0.4)]'
            }`}
            title={isPlaying ? 'Pausar' : 'Reproducir canción completa'}
          >
            {!canPlay ? (
              <FiLoader className={`w-2.5 h-2.5 ${connectionFailed ? '' : 'animate-spin'}`} />
            ) : isPlaying ? (
              <FiPause className="w-2.5 h-2.5 fill-black" />
            ) : (
              <FiPlay className="w-2.5 h-2.5 fill-black" />
            )}
            <span>{connectionFailed ? 'SIN CONEXIÓN' : !controllerReady ? 'CARGANDO' : isPlaying ? 'PAUSAR' : 'REPRODUCIR'}</span>
          </button>

          {/* External link to Anthony's Spotify — always works even if the hidden
              player above couldn't connect. */}
          <a
            href={spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[9px] text-[#10b981] hover:underline flex items-center gap-0.5 font-bold cursor-pointer shrink-0"
            title="Abrir en Spotify"
          >
            <FiMusic className="w-2.5 h-2.5" />
            <span>Spotify</span>
            <FiExternalLink className="w-2 h-2" />
          </a>

          {/* Change song/playlist */}
          <button
            onClick={() => setIsEditingUrl(!isEditingUrl)}
            className="p-0.5 text-slate-400 hover:text-white cursor-pointer"
            title="Cambiar a otra canción, álbum o playlist"
          >
            <FiEdit2 className="w-2.5 h-2.5" />
          </button>
        </div>

        {connectionFailed && (
          <p className="text-[8px] text-amber-400 leading-snug border-t border-[#1e293b] pt-1.5">
            No se pudo conectar con Spotify desde aquí. Usa el enlace "Spotify" para escuchar directamente.
          </p>
        )}

        {isEditingUrl && (
          <div className="flex items-center gap-1 bg-[#090d16] border border-[#1e293b] rounded-[2px] p-1 text-[8px]">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Pega el link de una canción, álbum o playlist de Spotify..."
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
      </motion.div>
    </aside>
  );
};
