import React from 'react';
import { motion } from 'framer-motion';

interface PixelCassetteProps {
  playlistName: string;
  isPlaying: boolean;
  tapeCounter: number;
}

// 8-Bit Pixel Spool with authentic stepped 8-bit rotation
const PixelSpool8Bit: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => (
  <div className="relative w-7 h-7 bg-[#f8fafc] border-2 border-[#0f172a] rounded-sm flex items-center justify-center shadow-xs shrink-0">
    <motion.div
      className="w-full h-full relative flex items-center justify-center"
      animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
      transition={
        isPlaying
          ? {
              duration: 2.2,
              repeat: Infinity,
              ease: 'linear',
            }
          : { duration: 0.1 }
      }
      style={{
        animationTimingFunction: 'steps(8)',
      }}
    >
      {/* 4 authentic 8-bit teeth notches */}
      <div className="absolute w-1 h-full bg-[#0f172a]" />
      <div className="absolute h-1 w-full bg-[#0f172a]" />
      <div className="w-2.5 h-2.5 bg-[#0f172a] rounded-[1px] relative z-10" />
    </motion.div>
  </div>
);

export const PixelCassette: React.FC<PixelCassetteProps> = ({
  playlistName,
  isPlaying,
  tapeCounter,
}) => {
  return (
    <div
      className="relative w-full rounded-md bg-[#1e232e] p-2 select-none border-2 border-[#090d14]"
      style={{
        boxShadow:
          '0 4px 0 #090d14, 0 -2px 0 #334155, 2px 0 0 #334155, -2px 0 0 #334155, inset 0 2px 0 rgba(255,255,255,0.1)',
        imageRendering: 'pixelated',
      }}
    >
      {/* 8-Bit Corner Screws */}
      <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-[#475569] text-[6px] font-mono leading-none text-black flex items-center justify-center">+</div>
      <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#475569] text-[6px] font-mono leading-none text-black flex items-center justify-center">+</div>
      <div className="absolute bottom-1 left-1 w-1.5 h-1.5 bg-[#475569] text-[6px] font-mono leading-none text-black flex items-center justify-center">+</div>
      <div className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-[#475569] text-[6px] font-mono leading-none text-black flex items-center justify-center">+</div>

      {/* ─── 8-BIT STICKER LABEL ───────────────────────────────────── */}
      <div className="rounded-[3px] bg-[#f8fafc] text-slate-900 px-2 py-1.5 border border-[#0f172a] shadow-xs">
        {/* Retro 8-Bit Rainbow Stripe */}
        <div className="h-1.5 w-full flex mb-1 border-b border-[#0f172a]">
          <div className="flex-1 bg-[#ef4444]" />
          <div className="flex-1 bg-[#f97316]" />
          <div className="flex-1 bg-[#eab308]" />
          <div className="flex-1 bg-[#10b981]" />
          <div className="flex-1 bg-[#06b6d4]" />
          <div className="flex-1 bg-[#6366f1]" />
        </div>

        {/* Label Header: Spotify & Quality */}
        <div className="flex items-center justify-between text-[8px] font-mono font-black border-b border-slate-300 pb-0.5 mb-1">
          <div className="flex items-center gap-1">
            <span className="px-1 py-[1px] bg-[#10b981] text-black font-black rounded-[1px]">
              SPOTIFY
            </span>
            <span className="text-slate-600">C-60 • HQ</span>
          </div>
          <span className="text-emerald-700 font-bold">
            LIKED SONGS ♫
          </span>
        </div>

        {/* Playlist Name: AnthonWorld */}
        <div className="bg-[#e2e8f0] px-1.5 py-0.5 rounded-[2px] border border-[#94a3b8] mb-1">
          <p className="font-mono font-black text-[10px] text-slate-900 truncate uppercase leading-tight">
            {playlistName || 'AnthonWorld'}
          </p>
          <p className="font-mono text-[8px] text-slate-600 truncate">
            Anthony Pilatasig • Spotify Library
          </p>
        </div>

        {/* ─── TAPE WINDOW WITH 8-BIT ROTATING GEARS ─────────────────── */}
        <div className="h-9 bg-[#090d16] border-2 border-[#1e293b] rounded-[2px] flex items-center justify-between px-2 relative overflow-hidden">
          {/* Left Spool */}
          <PixelSpool8Bit isPlaying={isPlaying} />

          {/* Center: Tape Ribbon & 8-Bit Equalizer */}
          <div className="flex-1 flex flex-col items-center justify-center px-1.5">
            {/* Magnetic Tape Ribbon */}
            <div className="w-full h-1.5 bg-[#451a03] border-t border-b border-[#78350f] rounded-[1px] mb-1 flex items-center justify-center">
              <span className="text-[6px] font-mono font-black text-amber-300">
                [{tapeCounter.toString().padStart(3, '0')}]
              </span>
            </div>

            {/* 8-Bit Equalizer Blocks */}
            <div className="flex items-end gap-[1.5px] h-2.5">
              {[2, 4, 3, 5, 2, 4].map((h, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-[#10b981] rounded-[0.5px]"
                  animate={
                    isPlaying
                      ? {
                          height: [`${h * 2}px`, '9px', '2px'],
                        }
                      : { height: '2px' }
                  }
                  transition={
                    isPlaying
                      ? {
                          duration: 0.35 + (i % 3) * 0.1,
                          repeat: Infinity,
                          repeatType: 'reverse',
                          ease: 'easeInOut',
                          delay: i * 0.04,
                        }
                      : { duration: 0.2 }
                  }
                />
              ))}
            </div>
          </div>

          {/* Right Spool */}
          <PixelSpool8Bit isPlaying={isPlaying} />
        </div>
      </div>

      {/* Lower Cassette Holes */}
      <div className="mt-1 flex items-center justify-center gap-3">
        <div className="w-1.5 h-1.5 bg-[#090d14] rounded-full" />
        <div className="w-3 h-1 bg-[#090d14] rounded-sm" />
        <div className="w-1.5 h-1.5 bg-[#090d14] rounded-full" />
      </div>
    </div>
  );
};
