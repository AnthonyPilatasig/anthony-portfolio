import { type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
}

export const GlassCard = ({ children, className = '', ...props }: GlassCardProps) => {
  return (
    <motion.div 
      className={`glass-panel ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};
