import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  onClick,
  disabled,
  ...props
}) => {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRipples((prev) => [...prev, { id: Date.now(), x, y }]);
    if (onClick) onClick(e);
  };

  const baseStyles =
    'relative inline-flex items-center justify-center font-heading font-medium overflow-hidden transition-all duration-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 active:scale-95 disabled:opacity-50 disabled:pointer-events-none';

  const variants = {
    primary:
      'bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.5)] hover:shadow-[0_0_30px_rgba(34,211,238,0.7)] border border-violet-400/30',
    secondary:
      'bg-slate-900/80 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 hover:bg-slate-800/80 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]',
    danger:
      'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)] hover:shadow-[0_0_25px_rgba(244,63,94,0.6)]',
    ghost:
      'bg-transparent text-slate-300 hover:text-white hover:bg-white/10 border border-transparent',
    outline:
      'bg-transparent text-violet-300 border border-violet-500/40 hover:bg-violet-500/10 hover:border-violet-400 shadow-[0_0_10px_rgba(139,92,246,0.2)]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...(props as any)}
    >
      {/* Ripple elements */}
      {ripples.map((r) => (
        <span
          key={r.id}
          style={{ left: r.x, top: r.y }}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/20 rounded-full animate-ping pointer-events-none"
          onAnimationEnd={() =>
            setRipples((prev) => prev.filter((item) => item.id !== r.id))
          }
        />
      ))}

      {isLoading ? (
        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin mr-2" />
      ) : (
        icon && <span className="text-current">{icon}</span>
      )}
      <span>{children}</span>
    </motion.button>
  );
};
