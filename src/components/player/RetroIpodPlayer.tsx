import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Track, IpodMenuMode } from './types';
import { loadCategoryPlaylist, fetchTracksFromApi, INSTANT_ANIME_TRACKS } from './musicService';

const FALLBACK_RADIO_TRACK: Track = INSTANT_ANIME_TRACKS[0];
import { IpodScreen } from './IpodScreen';
import { ClickWheel } from './ClickWheel';
import { MiniIpodDock } from './MiniIpodDock';
import { FiMusic, FiVolume2, FiVolumeX } from 'react-icons/fi';

export const RetroIpodPlayer: React.FC = () => {
  const [mode, setMode] = useState<IpodMenuMode>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('anime');
  const [tracks, setTracks] = useState<Track[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.8);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(30);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [showSpotifyModal, setShowSpotifyModal] = useState<boolean>(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initial load: Fetch Anime Openings dynamically from Music API
  useEffect(() => {
    let isMounted = true;
    (async () => {
      const initial = await loadCategoryPlaylist('anime');
      if (isMounted && initial.length > 0) {
        setTracks(initial);
        setCurrentTrack(initial[0]);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync Volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Handle Playback
  // Self-referenced below (fallback retries through the same function), so the
  // recursive call goes through a ref instead of closing over the `const` directly.
  const startPlaybackRef = useRef<(track: Track) => void>(() => {});

  const startPlayback = useCallback(async (track: Track) => {
    setCurrentTrack(track);
    if (!audioRef.current) return;

    try {
      if (audioRef.current.src !== track.audioUrl) {
        audioRef.current.src = track.audioUrl;
        audioRef.current.load();
      }
      await audioRef.current.play();
      setIsPlaying(true);
    } catch {
      // If direct stream stalls, try fallback radio
      if (track.id !== FALLBACK_RADIO_TRACK.id) {
        startPlaybackRef.current(FALLBACK_RADIO_TRACK);
      }
    }
  }, []);

  useEffect(() => {
    startPlaybackRef.current = startPlayback;
  }, [startPlayback]);

  const togglePlayPause = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (currentTrack) {
        startPlayback(currentTrack);
      } else if (tracks.length > 0) {
        startPlayback(tracks[0]);
      }
    }
  }, [isPlaying, currentTrack, tracks, startPlayback]);

  const handleNext = useCallback(() => {
    if (tracks.length === 0) return;
    const nextIdx = (selectedIndex + 1) % tracks.length;
    setSelectedIndex(nextIdx);
    startPlayback(tracks[nextIdx]);
  }, [tracks, selectedIndex, startPlayback]);

  const handlePrev = useCallback(() => {
    if (tracks.length === 0) return;
    const prevIdx = (selectedIndex - 1 + tracks.length) % tracks.length;
    setSelectedIndex(prevIdx);
    startPlayback(tracks[prevIdx]);
  }, [tracks, selectedIndex, startPlayback]);

  const handleMenuClick = useCallback(() => {
    if (mode === 'nowPlaying') {
      setMode('playlist');
    } else if (mode === 'playlist' || mode === 'search') {
      setMode('home');
    }
  }, [mode]);

  const handleSelectClick = useCallback(() => {
    if (mode === 'home') {
      setMode('nowPlaying');
    } else if (mode === 'playlist') {
      if (tracks[selectedIndex]) {
        startPlayback(tracks[selectedIndex]);
        setMode('nowPlaying');
      }
    }
  }, [mode, tracks, selectedIndex, startPlayback]);

  const handleCategorySelect = async (catId: string) => {
    setSelectedCategory(catId);
    setMode('playlist');
    const loaded = await loadCategoryPlaylist(catId);
    setTracks(loaded);
    setSelectedIndex(0);
    if (loaded.length > 0 && !isPlaying) {
      setCurrentTrack(loaded[0]);
    }
  };

  const handleSearchSubmit = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    const results = await fetchTracksFromApi(searchQuery, 'search', 14);
    setIsSearching(false);
    setTracks(results);
    setSelectedIndex(0);
  };

  return (
    <>
      {/* Native HTML5 Audio Engine for True Background Playback across entire site */}
      <audio
        ref={audioRef}
        preload="none"
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
            if (audioRef.current.duration && !isNaN(audioRef.current.duration)) {
              setDuration(audioRef.current.duration);
            }
          }
        }}
        onEnded={handleNext}
        onError={() => {
          setIsPlaying(false);
        }}
      />

      {/* Floating Retro iPod Component (Bottom Right) */}
      <aside aria-label="Reproductor iPod Retro" className="fixed bottom-4 right-4 z-40 font-sans select-none">
        <motion.div
          initial={{ y: 20, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="shadow-2xl overflow-hidden rounded-3xl"
        >
          {/* ─── EXPANDED FULL IPOD HANDHELD PLAYER ─────────────────────── */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="w-[320px] sm:w-[350px] p-4 bg-gradient-to-b from-[#facc15] via-[#eab308] to-[#ca8a04] border-4 border-[#b45309] rounded-3xl shadow-2xl flex flex-col items-center relative overflow-hidden"
                style={{
                  boxShadow: 'inset 0 4px 8px rgba(255,255,255,0.6), 0 20px 45px rgba(0,0,0,0.8)',
                }}
              >
                {/* Metallic Bezel Highlight */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-1 rounded-full bg-white/40 blur-[0.5px]" />

                {/* ─── IPOD COLOR LCD SCREEN ─────────────────────────────── */}
                <div className="w-full mb-2">
                  <IpodScreen
                    mode={mode}
                    currentTrack={currentTrack}
                    isPlaying={isPlaying}
                    tracks={tracks}
                    selectedCategory={selectedCategory}
                    selectedIndex={selectedIndex}
                    currentTime={currentTime}
                    duration={duration}
                    searchQuery={searchQuery}
                    isSearching={isSearching}
                    onSearchChange={setSearchQuery}
                    onSearchSubmit={handleSearchSubmit}
                    onSelectTrack={(tr, idx) => {
                      setSelectedIndex(idx);
                      startPlayback(tr);
                      setMode('nowPlaying');
                    }}
                    onSelectCategory={handleCategorySelect}
                    onOpenSpotify={() => setShowSpotifyModal(true)}
                  />
                </div>

                {/* ─── THE ICONIC IPOD CLICK WHEEL ───────────────────────── */}
                <ClickWheel
                  onMenu={handleMenuClick}
                  onPlayPause={togglePlayPause}
                  onNext={handleNext}
                  onPrev={handlePrev}
                  onSelect={handleSelectClick}
                  isPlaying={isPlaying}
                />

                {/* ─── BOTTOM UTILITY CONTROLS (Volume & Collapse) ───────── */}
                <div className="w-full pt-2 flex items-center justify-between gap-3 text-slate-900 border-t border-amber-600/30">
                  <div className="flex items-center gap-2 flex-1">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-1 text-slate-900 hover:text-black transition-colors cursor-pointer"
                      title={isMuted ? 'Desmutear' : 'Mutear'}
                    >
                      {isMuted || volume === 0 ? <FiVolumeX className="w-3.5 h-3.5" /> : <FiVolume2 className="w-3.5 h-3.5" />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.02"
                      value={isMuted ? 0 : volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-amber-700/40 rounded-lg appearance-none cursor-pointer accent-slate-900"
                    />
                  </div>

                  <button
                    onClick={() => setIsExpanded(false)}
                    className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/10 hover:bg-black/20 text-slate-900 cursor-pointer"
                  >
                    Cerrar iPod ▼
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ─── COMPACT MINI IPOD DOCK BAR (Always Visible) ─────────────── */}
          <MiniIpodDock
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            isExpanded={isExpanded}
            onTogglePlay={togglePlayPause}
            onNext={handleNext}
            onToggleExpand={() => setIsExpanded(!isExpanded)}
          />
        </motion.div>
      </aside>

      {/* ─── SPOTIFY PLAYLIST MODAL ────────────────────────────────────── */}
      <AnimatePresence>
        {showSpotifyModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-sans"
            onClick={() => setShowSpotifyModal(false)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="editorial-card p-5 sm:p-6 rounded-3xl w-full max-w-md space-y-4 shadow-2xl bg-[#0b121e] border-2 border-emerald-500/40 text-white"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                    <FiMusic className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">
                      Playlists de Anime &amp; Ecuador
                    </h3>
                    <p className="text-[10px] text-slate-400 font-sans">
                      Escucha listas completas directamente en Spotify
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSpotifyModal(false)}
                  className="text-xs text-slate-400 hover:text-white p-1 rounded cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Spotify Embed Player */}
              <div className="rounded-2xl overflow-hidden border border-emerald-500/20 shadow-inner">
                <iframe
                  title="Spotify Playlist"
                  src={
                    selectedCategory === 'anime'
                      ? 'https://open.spotify.com/embed/playlist/37i9dQZF1DX6XceWZz1N4M?utm_source=generator&theme=0'
                      : 'https://open.spotify.com/embed/playlist/37i9dQZF1DX8Uebhn94u3P?utm_source=generator&theme=0'
                  }
                  width="100%"
                  height="152"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="rounded-2xl"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setShowSpotifyModal(false)}
                  className="btn-secondary text-xs px-4 py-2 cursor-pointer"
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
