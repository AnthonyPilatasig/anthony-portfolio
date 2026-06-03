import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface SectionHeadingProps {
  children: ReactNode;
  highlight?: string;
  icon?: ReactNode;
}

export const SectionHeading = ({ children, highlight, icon }: SectionHeadingProps) => {
  return (
    <motion.h2 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="text-3xl md:text-4xl font-bold mb-12 flex items-center gap-3"
    >
      {icon && <span className="text-neon-purple">{icon}</span>}
      <span>{children}</span>
      {highlight && <span className="text-gradient"> {highlight}</span>}
    </motion.h2>
  );
};
