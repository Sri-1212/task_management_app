import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glow?: 'violet' | 'cyan' | 'magenta' | 'none';
  tilt?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  glow = 'violet',
  tilt = true,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tilt || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -7; // Max tilt 7 deg
    const rY = ((x - centerX) / centerX) * 7;

    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const glowStyles = {
    violet: 'hover:shadow-[0_0_30px_rgba(139,92,246,0.35)]',
    cyan: 'hover:shadow-[0_0_30px_rgba(34,211,238,0.35)]',
    magenta: 'hover:shadow-[0_0_30px_rgba(240,171,252,0.35)]',
    none: '',
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX, rotateY }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{ transformStyle: 'preserve-3d' }}
      className={cn(
        'glass-card rounded-2xl p-5 relative overflow-hidden backdrop-blur-xl border border-white/10',
        glowStyles[glow],
        className
      )}
      {...(props as any)}
    >
      {/* Soft gradient glare effect on hover */}
      <div className="pointer-events-none absolute -inset-full bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 transform rotate-12" />
      {children}
    </motion.div>
  );
};
