import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface SectionHeadingProps {
  children: ReactNode;
  index?: string; // ej. '01', '02'
}

export const SectionHeading = ({ children, index }: SectionHeadingProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-8"
    >
      {index && (
        <span className="section-index">{index} /</span>
      )}
      <h2 className="text-2xl md:text-3xl font-sans font-semibold text-[var(--theme-ink)] tracking-tight">
        {children}
      </h2>
    </motion.div>
  );
};
