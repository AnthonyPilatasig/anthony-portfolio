import React, { useEffect, useRef, useState } from 'react';
import { FiPlay, FiPause, FiSkipBack, FiSkipForward, FiMusic, FiLoader } from 'react-icons/fi';

interface Track {
  title: string;
  artist: string;
  src: string;
  artwork?: string;
}

interface ITunesResult {
  trackName?: string;
  artistName?: string;
  previewUrl?: string;
  artworkUrl60?: string;
}

interface AudioVisualizerProps {
  /** Search terms sent to the public iTunes Search API — no API key or uploaded files needed. */
  searchTerms: string[];
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ searchTerms }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | undefined>(undefined);

  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackErrored, setPlaybackErrored] = useState(false);

  const track = tracks[trackIndex];

  // Fetch one preview track per search term from the public, key-free iTunes Search API.
  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const results = await Promise.all(
          searchTerms.map(async (term) => {
            const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&media=music&limit=1`;
            const res = await fetch(url, { signal: controller.signal });
            if (!res.ok) return null;
            const data = await res.json();
            const item: ITunesResult | undefined = data?.results?.[0];
            if (!item?.previewUrl) return null;
            return {
              title: item.trackName ?? term,
              artist: item.artistName ?? 'Unknown Artist',
              src: item.previewUrl,
              artwork: item.artworkUrl60,
            } as Track;
          })
        );

        const found = results.filter((r): r is Track => r !== null);
        if (found.length === 0) {
          setLoadFailed(true);
        } else {
          setTracks(found);
        }
      } catch {
        if (!controller.signal.aborted) setLoadFailed(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const drawIdle = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(234, 179, 8, 0.25)';
    const bars = 32;
    const barWidth = canvas.width / bars;
    for (let i = 0; i < bars; i++) {
      ctx.fillRect(i * barWidth, canvas.height - 3, barWidth - 2, 3);
    }
  };

  const drawActive = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !analyser) return;

    const data = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(data);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const barWidth = canvas.width / data.length;
    data.forEach((value, i) => {
      const barHeight = Math.max(3, (value / 255) * canvas.height);
      ctx.fillStyle = `rgba(234, 179, 8, ${0.45 + (value / 255) * 0.55})`;
      ctx.fillRect(i * barWidth, canvas.height - barHeight, barWidth - 2, barHeight);
    });

    rafRef.current = requestAnimationFrame(drawActive);
  };

  useEffect(() => {
    drawIdle();
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      audioCtxRef.current?.close().catch(() => {});
    };
  }, []);

  const ensureAudioGraph = () => {
    if (!audioRef.current || audioCtxRef.current) return;
    // The iTunes preview CDN sends Access-Control-Allow-Origin: * so this works cross-origin.
    const AudioContextCtor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioContextCtor();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 64;
    const source = ctx.createMediaElementSource(audioRef.current);
    source.connect(analyser);
    analyser.connect(ctx.destination);
    audioCtxRef.current = ctx;
    analyserRef.current = analyser;
  };

  const togglePlay = async () => {
    if (!audioRef.current || playbackErrored) return;
    try {
      ensureAudioGraph();
      if (audioCtxRef.current?.state === 'suspended') await audioCtxRef.current.resume();

      if (isPlaying) {
        audioRef.current.pause();
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        setIsPlaying(false);
        drawIdle();
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
        drawActive();
      }
    } catch {
      setPlaybackErrored(true);
      setIsPlaying(false);
    }
  };

  const changeTrack = (delta: number) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setIsPlaying(false);
    setPlaybackErrored(false);
    setTrackIndex((prev) => (prev + delta + tracks.length) % tracks.length);
    drawIdle();
  };

  return (
    <div className="luxury-card p-5 rounded-2xl flex flex-col gap-4">
      <div className="flex items-center gap-2.5 text-yellow-700 dark:text-yellow-300 border-b border-slate-300 dark:border-slate-800 pb-3">
        <FiMusic className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
        <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-200">
          Fuera del código
        </h3>
        <span className="ml-auto text-[9px] font-mono text-slate-500 normal-case tracking-normal">iTunes Search API</span>
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-2 py-6 text-slate-500">
          <FiLoader className="w-4 h-4 animate-spin" />
          <span className="text-xs font-mono">Cargando pistas…</span>
        </div>
      )}

      {!loading && loadFailed && (
        <p className="text-[11px] font-mono text-slate-500 text-center py-6">
          No se pudo conectar con la API pública de iTunes en este momento.
        </p>
      )}

      {!loading && !loadFailed && track && (
        <>
          <audio
            ref={audioRef}
            src={track.src}
            onEnded={() => changeTrack(1)}
            onError={() => setPlaybackErrored(true)}
            crossOrigin="anonymous"
          />

          <canvas ref={canvasRef} width={400} height={64} className="w-full h-16" />

          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => changeTrack(-1)}
              className="p-2 rounded-full border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-yellow-500 transition-colors"
              aria-label="Pista anterior"
            >
              <FiSkipBack className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={togglePlay}
              disabled={playbackErrored}
              className="p-3 rounded-full bg-yellow-500 hover:bg-yellow-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 transition-colors"
              aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
            >
              {isPlaying ? <FiPause className="w-4 h-4" /> : <FiPlay className="w-4 h-4" />}
            </button>

            <button
              onClick={() => changeTrack(1)}
              className="p-2 rounded-full border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-yellow-500 transition-colors"
              aria-label="Siguiente pista"
            >
              <FiSkipForward className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-center">
            {track.artwork && (
              <img src={track.artwork} alt="" className="w-6 h-6 rounded" />
            )}
            {playbackErrored ? (
              <p className="text-[11px] font-mono text-slate-500">Vista previa no disponible para esta pista.</p>
            ) : (
              <p className="text-xs font-mono text-slate-700 dark:text-slate-300">
                {track.title}<span className="text-slate-500"> — {track.artist}</span>
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};
