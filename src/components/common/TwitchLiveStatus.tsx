import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SiTwitch } from 'react-icons/si';
import { FiTv, FiExternalLink, FiChevronDown, FiChevronUp, FiRadio } from 'react-icons/fi';

interface TwitchLiveStatusProps {
  channel?: string;
}

export const TwitchLiveStatus: React.FC<TwitchLiveStatusProps> = ({
  channel = 'anthonydavidpm'
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="editorial-card p-4 rounded-xl border border-[#9146FF]/30 bg-[var(--theme-surface)] relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-24 h-24 bg-[#9146FF]/5 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-[#9146FF]/10 text-[#9146FF] shrink-0 border border-[#9146FF]/20">
            <SiTwitch className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[var(--theme-ink)]">
                twitch.tv/{channel}
              </span>
              <span className="flex items-center gap-1 text-[9px] font-mono font-bold uppercase text-[#9146FF] bg-[#9146FF]/10 px-2 py-0.5 rounded-full border border-[#9146FF]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#9146FF] animate-ping" />
                Live Hub
              </span>
            </div>
            <p className="text-[11px] text-[var(--theme-ink-muted)] font-light mt-0.5">
              Streams de Game Dev en Java, programación de arquitectura .NET y gaming.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          <button
            onClick={() => setExpanded(!expanded)}
            className="px-3 py-1.5 rounded-lg border border-[var(--theme-border)] hover:border-[#9146FF]/40 text-[var(--theme-ink)] font-mono text-xs flex items-center gap-1.5 transition-colors"
          >
            <FiTv className="w-3.5 h-3.5 text-[#9146FF]" />
            <span>{expanded ? 'Ocultar Player' : 'Ver Stream'}</span>
            {expanded ? <FiChevronUp className="w-3 h-3" /> : <FiChevronDown className="w-3 h-3" />}
          </button>

          <a
            href={`https://twitch.tv/${channel}`}
            target="_blank"
            rel="noreferrer"
            className="btn-primary text-xs !bg-[#9146FF] hover:!bg-[#772ce8] !border-[#9146FF] flex items-center gap-1.5"
          >
            <span>Canal</span>
            <FiExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Embedded Player when expanded */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 pt-4 border-t border-[var(--theme-border)] overflow-hidden"
          >
            <div className="aspect-video w-full rounded-lg overflow-hidden bg-black border border-white/10 shadow-lg">
              <iframe
                src={`https://player.twitch.tv/?channel=${channel}&parent=${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}&autoplay=false`}
                height="100%"
                width="100%"
                allowFullScreen
                title="Anthony Pilatasig Twitch Live Stream"
              />
            </div>
            <p className="text-[10px] font-mono text-[var(--theme-ink-muted)] text-center mt-2">
              Transmisiones interactivas de código y creación de software en vivo.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
