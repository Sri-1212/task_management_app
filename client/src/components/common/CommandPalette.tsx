import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, LayoutDashboard, Kanban, Moon, Sun, X, Command, Sparkles } from 'lucide-react';
import { useTaskStore } from '../../store/taskStore';
import { useThemeStore } from '../../store/themeStore';
import { useNavigate } from 'react-router-dom';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const { tasks, openTaskModal, setFilters } = useTaskStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Trigger open via keybinding handled at window level or prop
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredTasks = query
    ? tasks.filter((t) => t.title.toLowerCase().includes(query.toLowerCase()))
    : [];

  const handleSelectTask = (task: any) => {
    openTaskModal(task);
    onClose();
  };

  const handleCreateTask = () => {
    openTaskModal('create');
    onClose();
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="glass-panel w-full max-w-xl rounded-2xl border border-violet-500/30 overflow-hidden shadow-[0_0_50px_rgba(139,92,246,0.3)] bg-space-900/90 backdrop-blur-2xl"
        >
          {/* Sci-fi Terminal Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 bg-white/5">
            <Command className="w-5 h-5 text-cyan-400 animate-pulse" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a command or search tasks (Press ESC to exit)..."
              className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none font-mono"
              autoFocus
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Body List */}
          <div className="p-3 max-h-80 overflow-y-auto space-y-2">
            {/* Quick Actions */}
            {!query && (
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-violet-400 uppercase tracking-widest px-3 py-1 font-mono">
                  Quick System Commands
                </div>
                <button
                  onClick={handleCreateTask}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-violet-500/20 text-slate-200 hover:text-white transition-colors text-sm group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-violet-500/20 text-violet-300 group-hover:bg-violet-500 group-hover:text-white transition-colors">
                      <Plus className="w-4 h-4" />
                    </div>
                    <span>Create New Task</span>
                  </div>
                  <span className="text-xs font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded">Cmd + N</span>
                </button>

                <button
                  onClick={() => handleNavigate('/dashboard')}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-cyan-500/20 text-slate-200 hover:text-white transition-colors text-sm group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                      <LayoutDashboard className="w-4 h-4" />
                    </div>
                    <span>Open Dashboard Analytics</span>
                  </div>
                </button>

                <button
                  onClick={() => handleNavigate('/')}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-magenta-500/20 text-slate-200 hover:text-white transition-colors text-sm group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-magenta-500/20 text-magenta-300 group-hover:bg-magenta-500 group-hover:text-white transition-colors">
                      <Kanban className="w-4 h-4" />
                    </div>
                    <span>Kanban Command Board</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    toggleTheme();
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-amber-500/20 text-slate-200 hover:text-white transition-colors text-sm group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                      {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </div>
                    <span>Toggle Theme ({theme === 'dark' ? 'Daylight Mode' : 'Zero-G Dark'})</span>
                  </div>
                </button>
              </div>
            )}

            {/* Task Search Results */}
            {query && (
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest px-3 py-1 font-mono flex items-center justify-between">
                  <span>Task Search Matches ({filteredTasks.length})</span>
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                </div>
                {filteredTasks.length === 0 ? (
                  <div className="text-center py-6 text-slate-400 text-sm">
                    No tasks found matching "<span className="text-cyan-300">{query}</span>"
                  </div>
                ) : (
                  filteredTasks.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleSelectTask(t)}
                      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-violet-500/20 text-left border border-white/5 hover:border-violet-500/30 transition-all"
                    >
                      <div>
                        <div className="text-sm font-medium text-white">{t.title}</div>
                        <div className="text-xs text-slate-400 line-clamp-1">{t.description || 'No description'}</div>
                      </div>
                      <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                        {t.status}
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div className="px-4 py-2 border-t border-white/10 bg-white/5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>TASKVERSE COMMAND INTERFACE V1.0</span>
            <span>PRESS ESC TO CLOSE</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
