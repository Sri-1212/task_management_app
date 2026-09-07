import React from 'react';
import { TaskPriority } from '../../types';
import { cn } from '../../lib/utils';

interface PriorityBadgeProps {
  priority: TaskPriority;
  className?: string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, className = '' }) => {
  const configs = {
    high: {
      label: 'High Priority',
      styles: 'bg-rose-500/15 text-rose-400 border-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.3)]',
      dot: 'bg-rose-500 animate-pulse shadow-[0_0_8px_#f43f5e]',
    },
    medium: {
      label: 'Medium',
      styles: 'bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.3)]',
      dot: 'bg-amber-400 animate-pulse shadow-[0_0_8px_#f59e0b]',
    },
    low: {
      label: 'Low',
      styles: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.3)]',
      dot: 'bg-emerald-400 shadow-[0_0_6px_#10b981]',
    },
  };

  const config = configs[priority] || configs.medium;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border backdrop-blur-md',
        config.styles,
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', config.dot)} />
      {config.label}
    </span>
  );
};
