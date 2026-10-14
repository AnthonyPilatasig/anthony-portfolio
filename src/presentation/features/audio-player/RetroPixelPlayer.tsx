import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  fetchSpotifyOEmbed,
  getSavedSpotifyUrl,
  saveSpotifyUrl,
  toSpotifyUri,
} from './musicService';
import { PixelCassette } from './PixelCassette';
import { loadSpotifyIframeApi, type SpotifyEmbedController } from '@infrastructure/embeds/spotifyIframeApi';
import {
  FiPlay, FiPause, FiMusic, FiExternalLink, FiEdit2, FiCheck, FiLoader,
  FiRefreshCw, FiChevronDown, FiChevronUp, FiMinus,
} from 'react-icons/fi';

const CONNECTION_TIMEOUT_MS = 8000;
// Compact embed height Spotify supports without cropping its own controls.
const EMBED_HEIGHT = 152;

const isSmallScreen = () => typeof window !== 'undefined' && window.innerWidth < 640;

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
  // The real Spotify widget is shown on demand: browsers only let it start playback
  // reliably when the visitor clicks inside it, so "play" opens it instead of faking it.
  const [showEmbed, setShowEmbed] = useState<boolean>(false);
  // On phones the player starts as a small pill so it doesn't cover the page.
  const [minimized, setMinimized] = useState<boolean>(isSmallScreen);
  const [attempt, setAttempt] = useState<number>(0);

  const embedContainerRef = useRef<HTMLDivElement | null>(null);
  const controllerRef = useRef<SpotifyEmbedController | null>(null);

  // Mounts Spotify's real embed player through its iFrame API. It stays mounted while
  // collapsed (just visually tucked away) so music keeps playing; `attempt` re-runs
  // it when the visitor presses "Reintentar".
  useEffect(() => {
    let cancelled = false;
    const host = embedContainerRef.current;
    if (!host) return;

    // The iFrame API replaces the target node with its iframe, so give it a fresh one.
    host.replaceChildren();
    const target = document.createElement('div');
    host.appendChild(target);

    const timeout = setTimeout(() => {
      if (!cancelled && !controllerRef.current) setConnectionFailed(true);
    }, CONNECTION_TIMEOUT_MS);

    loadSpotifyIframeApi().then((IFrameAPI) => {
      if (cancelled) return;
      IFrameAPI.createController(
        target,
        { uri: toSpotifyUri(spotifyUrl), width: '100%', height: EMBED_HEIGHT },
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
      controllerRef.current = null;
    };
    // Only (re)created on mount and on retry; URL changes go through controller.loadUri()
    // in handleSaveUrl so the current track isn't interrupted by a remount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt]);

  // Real playlist/track name + cover art, from Spotify's public oEmbed endpoint.
  useEffect(() => {
    fetchSpotifyOEmbed(spotifyUrl).then((meta) => {
      if (meta) {
        setPlaylistTitle(meta.title);
        setCoverArtUrl(meta.thumbnailUrl);
      }
    });
  }, [spotifyUrl]);

  // Purely cosmetic tape counter while something is actually playing.
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setTapeCounter((prev) => (prev >= 999 ? 0 : prev + 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handlePlayClick = useCallback(() => {
    if (isPlaying) {
      controllerRef.current?.pause();
      return;
    }
    // Opening the widget first means a blocked programmatic play still leaves the
    // visitor one click away from Spotify's own play button.
    setShowEmbed(true);
    controllerRef.current?.togglePlay();
  }, [isPlaying]);

  const handleRetry = () => {
    setConnectionFailed(false);
    setControllerReady(false);
    setAttempt((n) => n + 1);
  };

  const handleSaveUrl = () => {
    const trimmed = urlInput.trim();
    if (trimmed) {
      saveSpotifyUrl(trimmed);
      setSpotifyUrl(trimmed);
      controllerRef.current?.loadUri(toSpotifyUri(trimmed));
      setShowEmbed(true);
    }
    setIsEditingUrl(false);
  };

  const statusLabel = isBuffering ? 'CARGANDO…' : isPlaying ? 'REPRODUCIENDO' : 'PAUSADO';
  const canPlay = controllerReady && !connectionFailed;

  return (
    <aside
      aria-label="Reproductor de música conectado a Spotify"
      className="fixed bottom-3 right-3 z-40 font-mono select-none"
    >
      {minimized && (
        <button
          onClick={() => setMinimized(false)}
          className="glass-pill flex items-center gap-2 px-3 py-2 text-xs font-bold text-[var(--theme-ink)]"
          aria-label="Abrir reproductor de música"
        >
          <FiMusic className={`w-4 h-4 text-[#10b981] ${isPlaying ? 'animate-pulse' : ''}`} />
          <span className="max-w-[140px] truncate">{isPlaying ? playlistTitle : 'Música'}</span>
        </button>
      )}

      <motion.div
        initial={{ y: 20, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className={`${minimized ? 'hidden' : 'flex'} w-[min(300px,calc(100vw-24px))] rounded-lg bg-[#0c1017] border-2 border-[#334155] p-2 shadow-2xl text-slate-100 flex-col gap-1.5`}
        style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.85), 0 0 16px rgba(16,185,129,0.2)' }}
      >
        <div className="flex items-center justify-end -mb-1">
          <button
            onClick={() => setMinimized(true)}
            className="p-1 text-slate-400 hover:text-white"
            aria-label="Minimizar reproductor"
            title="Minimizar"
          >
            <FiMinus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* The cassette itself is a play/pause button too. */}
        <button
          type="button"
          onClick={handlePlayClick}
          disabled={!canPlay}
          className="block w-full text-left cursor-pointer disabled:cursor-wait"
          aria-label={isPlaying ? 'Pausar música' : 'Reproducir música'}
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
        </button>

        {/* Spotify's own widget. Kept mounted at all times; collapsed means clipped to
            zero height rather than display:none, which some browsers suspend. */}
        <div
          className="overflow-hidden rounded-md transition-[height] duration-300"
          style={{ height: showEmbed && !connectionFailed ? EMBED_HEIGHT : 0 }}
          aria-hidden={!showEmbed}
        >
          <div ref={embedContainerRef} />
        </div>

        <div className="flex items-center justify-between gap-1 pt-1 border-t border-[#1e293b] text-[11px]">
          <button
            onClick={handlePlayClick}
            disabled={!canPlay}
            className={`flex items-center gap-1 px-2 py-1 rounded-[2px] font-black text-[11px] cursor-pointer transition-all active:translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed text-black ${
              isPlaying ? 'bg-amber-400 hover:bg-amber-300' : 'bg-[#10b981] hover:bg-[#34d399]'
            }`}
            title={isPlaying ? 'Pausar' : 'Reproducir'}
          >
            {!canPlay ? (
              <FiLoader className={`w-3 h-3 ${connectionFailed ? '' : 'animate-spin'}`} />
            ) : isPlaying ? (
              <FiPause className="w-3 h-3 fill-black" />
            ) : (
              <FiPlay className="w-3 h-3 fill-black" />
            )}
            <span>{connectionFailed ? 'SIN CONEXIÓN' : !controllerReady ? 'CARGANDO' : isPlaying ? 'PAUSAR' : 'REPRODUCIR'}</span>
          </button>

          {canPlay && (
            <button
              onClick={() => setShowEmbed((v) => !v)}
              className="flex items-center gap-0.5 text-slate-300 hover:text-white"
              title={showEmbed ? 'Ocultar reproductor de Spotify' : 'Mostrar reproductor de Spotify'}
            >
              {showEmbed ? <FiChevronDown className="w-3 h-3" /> : <FiChevronUp className="w-3 h-3" />}
              <span>{showEmbed ? 'Ocultar' : 'Ver'}</span>
            </button>
          )}

          <a
            href={spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#10b981] hover:underline flex items-center gap-0.5 font-bold shrink-0"
            title="Abrir en Spotify"
          >
            <FiMusic className="w-3 h-3" />
            <span>Spotify</span>
            <FiExternalLink className="w-2.5 h-2.5" />
          </a>

          <button
            onClick={() => setIsEditingUrl(!isEditingUrl)}
            className="p-0.5 text-slate-400 hover:text-white"
            title="Cambiar a otra canción, álbum o playlist"
            aria-label="Cambiar canción o playlist"
          >
            <FiEdit2 className="w-3 h-3" />
          </button>
        </div>

        {connectionFailed && (
          <div className="flex items-center justify-between gap-2 border-t border-[#1e293b] pt-1.5">
            <p className="text-[11px] text-amber-400 leading-snug">
              No se pudo conectar con Spotify. Puedes reintentar o abrirlo en Spotify.
            </p>
            <button
              onClick={handleRetry}
              className="flex items-center gap-1 px-2 py-1 rounded-[2px] bg-slate-700 hover:bg-slate-600 text-[11px] font-bold shrink-0"
            >
              <FiRefreshCw className="w-3 h-3" />
              Reintentar
            </button>
          </div>
        )}

        {isEditingUrl && (
          <div className="flex items-center gap-1 bg-[#090d16] border border-[#1e293b] rounded-[2px] p-1 text-[11px]">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Link de una canción, álbum o playlist"
              aria-label="Link de Spotify"
              className="w-full bg-transparent text-white outline-none font-mono"
            />
            <button
              onClick={handleSaveUrl}
              className="px-1.5 py-0.5 bg-[#10b981] text-black font-black rounded-[1px] shrink-0"
              aria-label="Guardar link"
            >
              <FiCheck className="w-3 h-3" />
            </button>
          </div>
        )}
      </motion.div>
    </aside>
  );
};
