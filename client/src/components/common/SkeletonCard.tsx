import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="glass-panel rounded-2xl p-5 border border-white/10 relative overflow-hidden space-y-4 animate-pulse">
      {/* Shimmer gradient overlay */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
      
      <div className="flex items-center justify-between">
        <div className="h-5 bg-violet-500/20 rounded-full w-24" />
        <div className="h-4 bg-slate-700/40 rounded-full w-16" />
      </div>

      <div className="space-y-2">
        <div className="h-6 bg-slate-700/50 rounded-lg w-3/4" />
        <div className="h-4 bg-slate-800/40 rounded-lg w-full" />
        <div className="h-4 bg-slate-800/40 rounded-lg w-5/6" />
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <div className="flex gap-1.5">
          <div className="h-5 w-12 bg-cyan-500/10 rounded-md" />
          <div className="h-5 w-14 bg-violet-500/10 rounded-md" />
        </div>
        <div className="h-6 w-6 bg-slate-700/50 rounded-full" />
      </div>
    </div>
  );
};
