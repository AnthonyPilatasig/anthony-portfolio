import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface LiveClockProps {
  timeZone: string;
  utcLabel: string;
}

/** Ticking local-time readout — replaces a flat "UTC-5" label with something live. */
export const LiveClock: React.FC<LiveClockProps> = ({ timeZone, utcLabel }) => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const formatted = new Intl.DateTimeFormat('es-EC', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(now);

  return (
    <span className="flex items-center gap-1.5 tabular-nums">
      <motion.span
        className="w-1.5 h-1.5 rounded-full bg-emerald-500"
        animate={{ opacity: [1, 0.35, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <span>{formatted}</span>
      <span className="text-[var(--theme-ink-muted)]">· {utcLabel}</span>
    </span>
  );
};
