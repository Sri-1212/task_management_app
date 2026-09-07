import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Zap, Command, Plus, LayoutDashboard, Kanban, LogOut, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useTaskStore } from '../../store/taskStore';
import { ThemeToggle } from '../common/ThemeToggle';
import { PresenceHeader } from '../presence/PresenceIndicator';
import { Button } from '../common/Button';

interface NavbarProps {
  onOpenCommandPalette: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCommandPalette }) => {
  const { user, logout } = useAuthStore();
  const { openTaskModal } = useTaskStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-space-900/75 border-b border-white/10 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-500 to-cyan-400 p-0.5 shadow-[0_0_20px_rgba(139,92,246,0.6)] group-hover:shadow-[0_0_30px_rgba(34,211,238,0.8)] transition-all">
            <div className="w-full h-full bg-[#05050a] rounded-[10px] flex items-center justify-center">
              <Zap className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform" />
            </div>
          </div>
          <div>
            <span className="font-heading text-xl font-bold bg-gradient-to-r from-white via-cyan-200 to-violet-300 bg-clip-text text-transparent tracking-tight">
              TASK<span className="text-violet-400">VERSE</span>
            </span>
            <span className="hidden sm:block text-[10px] font-mono text-cyan-400/80 uppercase tracking-widest -mt-1">
              Zero-G Command
            </span>
          </div>
        </Link>

        {/* Live Presence Header */}
        <div className="hidden md:flex items-center">
          <PresenceHeader />
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 glass-panel p-1 rounded-xl border-white/10">
            <Link
              to="/"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-heading transition-all ${
                location.pathname === '/'
                  ? 'bg-violet-600/30 text-cyan-300 border border-violet-500/40 shadow-[0_0_12px_rgba(139,92,246,0.3)]'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Kanban className="w-4 h-4" />
              <span>Kanban</span>
            </Link>
            <Link
              to="/dashboard"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-heading transition-all ${
                location.pathname === '/dashboard'
                  ? 'bg-violet-600/30 text-cyan-300 border border-violet-500/40 shadow-[0_0_12px_rgba(139,92,246,0.3)]'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Analytics</span>
            </Link>
          </nav>

          {/* Quick Task Creation */}
          <Button
            size="sm"
            onClick={() => openTaskModal('create')}
            icon={<Plus className="w-4 h-4" />}
            className="hidden sm:inline-flex"
          >
            New Task
          </Button>

          {/* Command Palette Trigger */}
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass-panel text-slate-300 hover:text-white hover:border-cyan-400/40 text-xs font-mono transition-all"
            title="Open Sci-Fi Command Palette (Cmd + K)"
          >
            <Command className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Cmd + K</span>
          </button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Profile / Logout */}
          {user && (
            <div className="flex items-center gap-2 pl-2 border-l border-white/10">
              <Link to="/profile" className="flex items-center gap-2 group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-500 to-magenta-500 p-0.5 shadow-md">
                  <div className="w-full h-full bg-[#05050a] rounded-[9px] flex items-center justify-center overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon className="w-4 h-4 text-violet-300" />
                    )}
                  </div>
                </div>
                <span className="hidden xl:inline text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
                  {user.name}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl glass-panel text-slate-400 hover:text-rose-400 hover:border-rose-500/40 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
