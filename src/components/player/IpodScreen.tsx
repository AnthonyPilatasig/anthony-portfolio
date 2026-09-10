import React from 'react';
import { motion } from 'framer-motion';
import type { Track, IpodMenuMode } from './types';
import { PLAYLIST_CATEGORIES } from './musicService';
import { FiMusic, FiHeadphones, FiSearch, FiRadio, FiExternalLink } from 'react-icons/fi';

interface IpodScreenProps {
  mode: IpodMenuMode;
  currentTrack: Track | null;
  isPlaying: boolean;
  tracks: Track[];
  selectedCategory: string;
  selectedIndex: number;
  currentTime: number;
  duration: number;
  searchQuery: string;
  isSearching: boolean;
  onSearchChange: (q: string) => void;
  onSearchSubmit: () => void;
  onSelectTrack: (track: Track, index: number) => void;
  onSelectCategory: (catId: string) => void;
  onOpenSpotify: () => void;
}

export const IpodScreen: React.FC<IpodScreenProps> = ({
  mode,
  currentTrack,
  isPlaying,
  tracks,
  selectedCategory,
  selectedIndex,
  currentTime,
  duration,
  searchQuery,
  isSearching,
  onSearchChange,
  onSearchSubmit,
  onSelectTrack,
  onSelectCategory,
  onOpenSpotify,
}) => {
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <div
      className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#060c18] border-2 border-slate-700/80 font-sans shadow-inner flex flex-col select-none"
      style={{
        boxShadow: 'inset 0 0 16px rgba(0,0,0,0.9), 0 2px 8px rgba(0,0,0,0.5)',
      }}
    >
      {/* ─── IPOD TOP STATUS BAR ─────────────────────────────────────── */}
      <div className="h-6 px-2.5 bg-gradient-to-b from-[#1c2738] to-[#0f1724] border-b border-cyan-500/20 flex items-center justify-between text-[10px] text-slate-200 font-mono shrink-0">
        <span className="font-bold text-cyan-300 truncate max-w-[120px]">
          {mode === 'home'
            ? 'Home'
            : mode === 'nowPlaying'
            ? 'Now Playing'
            : mode === 'search'
            ? 'Search'
            : selectedCategory === 'anime'
            ? 'Anime Hits'
            : selectedCategory === 'ecuador'
            ? 'Música Ecuador'
            : 'Playlist'}
        </span>

        <div className="flex items-center gap-2">
          {/* Play/Pause state */}
          <span className="text-[9px] text-cyan-400 font-bold">
            {isPlaying ? '▶' : '❚❚'}
          </span>

          {/* Headphones Icon */}
          <FiHeadphones className="w-3 h-3 text-slate-300" />

          {/* Battery Icon with green fill */}
          <div className="flex items-center gap-0.5">
            <div className="w-4 h-2 rounded-[1px] border border-slate-300 p-[0.5px] flex items-center">
              <div className="w-full h-full bg-emerald-400 rounded-[0.5px]" />
            </div>
            <div className="w-0.5 h-1 bg-slate-400 rounded-r-[0.5px]" />
          </div>
        </div>
      </div>

      {/* ─── SCREEN CONTENT AREA ─────────────────────────────────────── */}
      <div className="flex-1 min-h-0 relative overflow-hidden bg-gradient-to-br from-[#0a1120] via-[#050b14] to-[#02050a] text-slate-100 p-2.5 flex flex-col">
        {/* 1. HOME MENU (Exact structure as user's photo!) */}
        {mode === 'home' && (
          <div className="flex-1 flex gap-2 min-h-0">
            {/* Left Menu List */}
            <div className="w-1/2 flex flex-col justify-center space-y-1 text-xs">
              <div className="px-2 py-1 rounded bg-cyan-500 text-black font-extrabold flex items-center justify-between shadow-sm cursor-pointer">
                <span className="truncate">Now Playing</span>
                <span className="text-[10px]">›</span>
              </div>

              {PLAYLIST_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className="w-full text-left px-2 py-1 rounded text-[11px] text-slate-300 hover:text-cyan-300 hover:bg-white/5 flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span className="truncate flex items-center gap-1.5">
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </span>
                  <span className="text-[9px] text-slate-500">›</span>
                </button>
              ))}

              <button
                onClick={onOpenSpotify}
                className="w-full text-left px-2 py-1 rounded text-[11px] text-emerald-400 hover:bg-emerald-500/10 flex items-center justify-between transition-colors cursor-pointer"
              >
                <span className="truncate flex items-center gap-1.5">
                  <FiMusic className="w-2.5 h-2.5" />
                  <span>Spotify Link</span>
                </span>
                <FiExternalLink className="w-2.5 h-2.5" />
              </button>
            </div>

            {/* Right Illustration: Glowing Rotating CD / Vinyl Disk (From User Photo!) */}
            <div className="w-1/2 flex flex-col items-center justify-center relative">
              <div className="relative w-24 h-24 flex items-center justify-center">
                {/* Glow ring */}
                <div className="absolute inset-0 rounded-full bg-cyan-500/15 blur-md" />

                {/* Rotating Vinyl CD */}
                <motion.div
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#334155] border-2 border-slate-600 shadow-xl flex items-center justify-center relative"
                  animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                  transition={isPlaying ? { duration: 3.5, repeat: Infinity, ease: 'linear' } : { duration: 0.2 }}
                >
                  {/* CD Vinyl Grooves */}
                  <div className="absolute inset-2 rounded-full border border-white/10 pointer-events-none" />
                  <div className="absolute inset-4 rounded-full border border-white/10 pointer-events-none" />
                  <div className="absolute inset-6 rounded-full border border-white/10 pointer-events-none" />

                  {/* Center Label Badge */}
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 border border-white/40 flex items-center justify-center shadow-md">
                    <FiMusic className="w-3.5 h-3.5 text-black" />
                  </div>
                </motion.div>
              </div>

              <span className="text-[9px] font-mono text-cyan-300 font-bold mt-1 text-center truncate w-full px-1">
                {currentTrack ? currentTrack.title : 'Ready to Play'}
              </span>
            </div>
          </div>
        )}

        {/* 2. PLAYLIST MENU */}
        {mode === 'playlist' && (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 border-b border-white/10 pb-1 mb-1 shrink-0">
              <span className="uppercase font-bold text-cyan-400">
                {selectedCategory === 'anime' ? '🎌 Anime Openings' : '🇪🇨 Joyas del Ecuador'}
              </span>
              <span>{tracks.length} Pistas</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-0.5 pr-1 scrollbar-thin">
              {tracks.map((tr, idx) => {
                const isSelected = selectedIndex === idx;
                const isCurrent = currentTrack?.id === tr.id;

                return (
                  <button
                    key={tr.id}
                    onClick={() => onSelectTrack(tr, idx)}
                    className={`w-full text-left px-2 py-1 rounded text-[11px] flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500 text-black font-extrabold shadow-sm'
                        : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <p className="truncate font-semibold leading-tight">
                        {isCurrent && isPlaying && <span className="mr-1 text-emerald-400 animate-pulse">▶</span>}
                        {tr.title}
                      </p>
                      <p className={`text-[9px] truncate ${isSelected ? 'text-slate-900' : 'text-slate-400'}`}>
                        {tr.artist}
                      </p>
                    </div>
                    <span className={`text-[9px] font-mono shrink-0 ${isSelected ? 'text-slate-950 font-bold' : 'text-slate-400'}`}>
                      {tr.durationSeconds ? formatTime(tr.durationSeconds) : 'LIVE'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. NOW PLAYING SCREEN */}
        {mode === 'nowPlaying' && currentTrack && (
          <div className="flex-1 flex flex-col justify-between min-h-0">
            {/* Top: Album Art + Track Info */}
            <div className="flex items-center gap-3">
              {/* Artwork or Spinning CD Disk */}
              <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-600 bg-black/60 shadow-md shrink-0 flex items-center justify-center relative">
                {currentTrack.artworkUrl ? (
                  <img
                    src={currentTrack.artworkUrl}
                    alt={currentTrack.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <motion.div
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg"
                    animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                    transition={isPlaying ? { duration: 3, repeat: Infinity, ease: 'linear' } : { duration: 0.2 }}
                  >
                    <FiMusic className="w-5 h-5 text-black" />
                  </motion.div>
                )}
              </div>

              {/* Title & Artist */}
              <div className="min-w-0 flex-1">
                <p className="font-extrabold text-sm text-white truncate">
                  {currentTrack.title}
                </p>
                <p className="text-xs text-cyan-300 font-semibold truncate mt-0.5">
                  {currentTrack.artist}
                </p>
                <p className="text-[9px] text-slate-400 truncate mt-0.5 font-mono">
                  {currentTrack.album || 'iPod Audio'}
                </p>
              </div>
            </div>

            {/* Middle: Progress Bar */}
            <div className="space-y-1 my-1">
              <div className="w-full h-2 rounded-full bg-slate-800 border border-slate-700 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex justify-between text-[9px] font-mono text-slate-400">
                <span>{formatTime(currentTime)}</span>
                <span className="text-cyan-400 font-bold">
                  {duration > 0 ? `-${formatTime(Math.max(0, duration - currentTime))}` : 'LIVE STREAM'}
                </span>
              </div>
            </div>

            {/* Bottom: 8-Bit Visualizer Strip */}
            <div className="h-5 px-2 bg-black/40 rounded border border-cyan-500/20 flex items-end justify-between gap-1 overflow-hidden">
              {Array.from({ length: 18 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="flex-1 rounded-t-[1px] bg-cyan-400"
                  animate={
                    isPlaying
                      ? {
                          height: [`${((i % 5) + 1) * 3}px`, '16px', '3px'],
                        }
                      : { height: '2px' }
                  }
                  transition={
                    isPlaying
                      ? {
                          duration: 0.35 + (i % 4) * 0.08,
                          repeat: Infinity,
                          repeatType: 'reverse',
                          ease: 'easeInOut',
                          delay: i * 0.03,
                        }
                      : { duration: 0.2 }
                  }
                />
              ))}
            </div>
          </div>
        )}

        {/* 4. SEARCH SCREEN */}
        {mode === 'search' && (
          <div className="flex-1 flex flex-col min-h-0 space-y-2">
            <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-black/60 border border-cyan-500/40">
              <FiSearch className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onSearchSubmit()}
                placeholder="Buscar Anime, Ecuador, Rock..."
                className="w-full bg-transparent text-xs text-white placeholder:text-slate-500 outline-none"
              />
              <button
                onClick={onSearchSubmit}
                className="px-2 py-0.5 rounded bg-cyan-500 hover:bg-cyan-400 text-black text-[10px] font-bold shrink-0 cursor-pointer"
              >
                Buscar
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-0.5 pr-1 scrollbar-thin">
              {isSearching ? (
                <div className="flex items-center justify-center h-full text-xs text-cyan-300 font-mono">
                  Consultando Music API...
                </div>
              ) : tracks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-xs text-slate-400 p-2">
                  <FiRadio className="w-5 h-5 text-slate-500 mb-1" />
                  <span>Escribe una búsqueda y pulsa Buscar para reproducir cualquier canción</span>
                </div>
              ) : (
                tracks.map((tr, idx) => (
                  <button
                    key={tr.id}
                    onClick={() => onSelectTrack(tr, idx)}
                    className="w-full text-left px-2 py-1 rounded text-[11px] text-slate-300 hover:bg-cyan-500 hover:text-black flex items-center justify-between transition-colors cursor-pointer group"
                  >
                    <div className="truncate pr-2">
                      <p className="font-bold truncate">{tr.title}</p>
                      <p className="text-[9px] text-slate-400 group-hover:text-slate-900 truncate">{tr.artist}</p>
                    </div>
                    <span className="text-[9px] font-mono text-slate-400 group-hover:text-slate-950 font-bold shrink-0">
                      {tr.durationSeconds ? formatTime(tr.durationSeconds) : 'LIVE'}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
