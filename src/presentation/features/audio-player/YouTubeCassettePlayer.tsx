import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlay, FiPause, FiSkipBack, FiSkipForward, FiMusic, FiExternalLink, FiLoader, FiMinus } from 'react-icons/fi';
import type { MusicPlaylist } from '@domain/entities/music-playlist.entity';
import { loadYouTubeIframeApi, YT_STATE, type YouTubePlayer } from '@infrastructure/embeds/youtubeIframeApi';
import { PixelCassette } from './PixelCassette';

// Audio-only by design: the cassette is the visible player and the YouTube video is kept
// off-screen. It stays 200×200 px because YouTube may refuse to play in smaller players.
// Note: YouTube's API terms ask for a visible player — an accepted trade-off here.
const VIDEO_WIDTH = 200;
const VIDEO_HEIGHT = 200;
// After this many unplayable videos in a row (removed, region-blocked, embedding
// disabled) stop skipping instead of looping through the whole list.
const MAX_CONSECUTIVE_ERRORS = 5;

const isSmallScreen = () => typeof window !== 'undefined' && window.innerWidth < 640;

export const YouTubeCassettePlayer: React.FC<{ playlist: MusicPlaylist }> = ({ playlist }) => {
  const { tracks } = playlist;
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [ready, setReady] = useState(false);
  const [minimized, setMinimized] = useState(isSmallScreen);
  const [tapeCounter, setTapeCounter] = useState(0);
  const [unavailable, setUnavailable] = useState(false);

  const hostRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  // Once the visitor has pressed play, track changes start the next video right away.
  const startedRef = useRef(false);
  const errorsRef = useRef(0);

  const track = tracks[index];

  const goTo = useCallback((next: number) => {
    setIndex(((next % tracks.length) + tracks.length) % tracks.length);
  }, [tracks.length]);

  // Create the player once.
  useEffect(() => {
    let cancelled = false;
    const host = hostRef.current;
    if (!host) return;
    const target = document.createElement('div');
    host.replaceChildren(target);

    loadYouTubeIframeApi().then((YT) => {
      if (cancelled) return;
      playerRef.current = new YT.Player(target, {
        videoId: tracks[0].youtubeId,
        width: VIDEO_WIDTH,
        height: VIDEO_HEIGHT,
        host: 'https://www.youtube-nocookie.com',
        playerVars: { playsinline: 1, rel: 0, controls: 1 },
        events: {
          onReady: () => { if (!cancelled) setReady(true); },
          onStateChange: ({ data }) => {
            if (data === YT_STATE.PLAYING) {
              errorsRef.current = 0;
              startedRef.current = true;
            }
            setIsPlaying(data === YT_STATE.PLAYING);
            setIsBuffering(data === YT_STATE.BUFFERING);
            if (data === YT_STATE.ENDED) setIndex((i) => (i + 1) % tracks.length);
          },
          onError: () => {
            errorsRef.current += 1;
            if (errorsRef.current >= MAX_CONSECUTIVE_ERRORS) {
              setUnavailable(true);
              return;
            }
            setIndex((i) => (i + 1) % tracks.length);
          },
        },
      });
    });

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
    // The player is created once; track changes go through loadVideoById below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Switch video when the track changes (autoplay only after the visitor pressed play).
  useEffect(() => {
    const player = playerRef.current;
    if (!player || !ready) return;
    setTapeCounter(0);
    if (startedRef.current) player.loadVideoById(track.youtubeId);
    else player.cueVideoById(track.youtubeId);
  }, [track.youtubeId, ready]);

  // Cosmetic tape counter while music plays.
  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => setTapeCounter((c) => (c >= 999 ? 0 : c + 1)), 1000);
    return () => clearInterval(id);
  }, [isPlaying]);

  const togglePlay = () => {
    const player = playerRef.current;
    if (!player) return;
    if (isPlaying) player.pauseVideo();
    else {
      startedRef.current = true;
      player.playVideo();
    }
  };

  const statusLabel = isBuffering ? 'CARGANDO…' : isPlaying ? 'REPRODUCIENDO' : 'PAUSADO';

  return (
    <aside aria-label="Reproductor de música" className="fixed bottom-3 right-3 z-40 font-mono select-none">
      {/* Off-screen YouTube player (audio only). Outside the panel so minimizing — which
          hides the panel — never interrupts the music. */}
      <div
        aria-hidden="true"
        className="fixed -left-[10000px] top-0 overflow-hidden pointer-events-none"
        style={{ width: VIDEO_WIDTH, height: VIDEO_HEIGHT }}
      >
        <div ref={hostRef} />
      </div>

      {minimized && (
        <button
          onClick={() => setMinimized(false)}
          className="glass-pill flex items-center gap-2 px-3 py-2 text-xs font-bold text-[var(--theme-ink)]"
          aria-label="Abrir reproductor de música"
        >
          <FiMusic className={`w-4 h-4 text-[#10b981] ${isPlaying ? 'animate-pulse' : ''}`} />
          <span className="max-w-[140px] truncate">{isPlaying ? track.title : 'Música'}</span>
        </button>
      )}

      <motion.div
        initial={{ y: 20, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className={`${minimized ? 'hidden' : 'flex'} w-[min(300px,calc(100vw-24px))] max-h-[calc(100dvh-24px)] overflow-y-auto rounded-lg bg-[#0c1017] border-2 border-[#334155] p-2 text-slate-100 flex-col gap-1.5`}
        style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.85), 0 0 16px rgba(16,185,129,0.2)' }}
      >
        <div className="flex items-center justify-between -mb-1 text-[11px] text-slate-400">
          <span>{index + 1} / {tracks.length}</span>
          <button onClick={() => setMinimized(true)} className="p-1 hover:text-white" aria-label="Minimizar reproductor" title="Minimizar (la música sigue sonando)">
            <FiMinus className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          type="button"
          onClick={togglePlay}
          disabled={!ready}
          className="block w-full text-left cursor-pointer disabled:cursor-wait"
          aria-label={isPlaying ? 'Pausar música' : 'Reproducir música'}
        >
          <PixelCassette
            playlistName={track.title}
            subtitle={track.artist}
            sideLabel={statusLabel}
            isPlaying={isPlaying}
            tapeCounter={tapeCounter}
            coverArtUrl={track.cover ?? undefined}
            sourceBadge="YOUTUBE"
            labelNote={playlist.playlist.name.toUpperCase()}
          />
        </button>

        {unavailable && (
          <p className="text-[11px] text-amber-400 leading-snug">
            No se pudieron cargar varios videos seguidos. Prueba más tarde o escucha la playlist en Spotify.
          </p>
        )}

        <div className="flex items-center justify-between gap-1 pt-1 border-t border-[#1e293b] text-[11px]">
          <div className="flex items-center gap-1">
            <button onClick={() => goTo(index - 1)} disabled={!ready} className="p-1.5 rounded hover:bg-slate-700 disabled:opacity-40" aria-label="Canción anterior">
              <FiSkipBack className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={togglePlay}
              disabled={!ready}
              className={`flex items-center gap-1 px-2 py-1 rounded-[2px] font-black text-black disabled:opacity-50 ${isPlaying ? 'bg-amber-400 hover:bg-amber-300' : 'bg-[#10b981] hover:bg-[#34d399]'}`}
            >
              {!ready ? <FiLoader className="w-3 h-3 animate-spin" /> : isPlaying ? <FiPause className="w-3 h-3 fill-black" /> : <FiPlay className="w-3 h-3 fill-black" />}
              <span>{!ready ? 'CARGANDO' : isPlaying ? 'PAUSAR' : 'REPRODUCIR'}</span>
            </button>
            <button onClick={() => goTo(index + 1)} disabled={!ready} className="p-1.5 rounded hover:bg-slate-700 disabled:opacity-40" aria-label="Canción siguiente">
              <FiSkipForward className="w-3.5 h-3.5" />
            </button>
          </div>
          <a
            href={playlist.playlist.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#10b981] hover:underline flex items-center gap-0.5 font-bold shrink-0"
            title="Abrir la playlist en Spotify"
          >
            <FiMusic className="w-3 h-3" />
            <span>Spotify</span>
            <FiExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </motion.div>
    </aside>
  );
};
