import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Kanban, LayoutDashboard, User, Plus } from 'lucide-react';
import { useTaskStore } from '../../store/taskStore';

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const { openTaskModal } = useTaskStore();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 pt-2 bg-gradient-to-t from-[#05050a] via-[#05050a]/90 to-transparent pointer-events-none">
      <div className="max-w-md mx-auto relative glass-panel rounded-2xl p-2 border border-white/10 flex items-center justify-around pointer-events-auto backdrop-blur-2xl shadow-[0_0_30px_rgba(0,0,0,0.8)]">
        <Link
          to="/"
          className={`flex flex-col items-center gap-1 p-2 rounded-xl text-xs font-mono transition-colors ${
            location.pathname === '/' ? 'text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Kanban className="w-5 h-5" />
          <span>Board</span>
        </Link>

        {/* Center Floating Orbit Button */}
        <div className="relative -top-5">
          {/* Orbital glowing ring animation */}
          <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-violet-600 via-cyan-400 to-magenta-500 blur-md animate-orbit opacity-75" />
          <button
            onClick={() => openTaskModal('create')}
            className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-violet-600 to-cyan-400 flex items-center justify-center text-white shadow-2xl border-2 border-[#05050a] active:scale-90 transition-transform"
          >
            <Plus className="w-7 h-7" />
          </button>
        </div>

        <Link
          to="/dashboard"
          className={`flex flex-col items-center gap-1 p-2 rounded-xl text-xs font-mono transition-colors ${
            location.pathname === '/dashboard' ? 'text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Stats</span>
        </Link>

        <Link
          to="/profile"
          className={`flex flex-col items-center gap-1 p-2 rounded-xl text-xs font-mono transition-colors ${
            location.pathname === '/profile' ? 'text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <User className="w-5 h-5" />
          <span>Profile</span>
        </Link>
      </div>
    </div>
  );
};
