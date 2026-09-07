import React from 'react';
import { useSocketStore } from '../../store/socketStore';
import { Users, Eye, Edit3 } from 'lucide-react';
import { motion } from 'framer-motion';

export const PresenceHeader: React.FC = () => {
  const { isConnected, activeUsers } = useSocketStore();

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel border-white/10 text-xs font-mono">
        <span
          className={`w-2 h-2 rounded-full ${
            isConnected ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]' : 'bg-rose-500'
          }`}
        />
        <span className={isConnected ? 'text-emerald-300' : 'text-rose-400'}>
          {isConnected ? 'LIVE SYNC ACTIVE' : 'DISCONNECTED'}
        </span>
      </div>

      {activeUsers.length > 0 && (
        <div className="flex items-center -space-x-2 overflow-hidden">
          {activeUsers.slice(0, 5).map((user, idx) => (
            <motion.div
              key={idx}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="relative group"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center text-xs font-bold text-white border-2 border-[#05050a] shadow-lg">
                {(user.userName || user.userId).charAt(0).toUpperCase()}
              </div>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-black/90 text-white text-[10px] font-mono px-2 py-1 rounded whitespace-nowrap border border-violet-500/40 z-50">
                {user.userName || `Agent ${user.userId.substring(0, 6)}`}
              </div>
            </motion.div>
          ))}
          {activeUsers.length > 5 && (
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-mono text-slate-300 border-2 border-[#05050a]">
              +{activeUsers.length - 5}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const CardPresence: React.FC<{ taskId: string }> = ({ taskId }) => {
  const { activeUsers } = useSocketStore();
  const viewingUsers = activeUsers.filter((u) => u.taskId === taskId);

  if (viewingUsers.length === 0) return null;

  return (
    <div className="flex items-center gap-1 mt-2 pt-2 border-t border-white/10 text-[11px] font-mono text-cyan-300">
      <Eye className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
      <span>
        {viewingUsers.length} user{viewingUsers.length > 1 ? 's' : ''} viewing
      </span>
      {viewingUsers.some((u) => u.typing) && (
        <span className="flex items-center gap-1 text-violet-300 ml-2">
          <Edit3 className="w-3.5 h-3.5 animate-bounce" />
          typing...
        </span>
      )}
    </div>
  );
};
