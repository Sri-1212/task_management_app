import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../../store/themeStore';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Theme Mode"
      className="relative p-2.5 rounded-xl glass-panel text-violet-300 hover:text-cyan-300 hover:border-cyan-400/40 transition-all duration-300 overflow-hidden focus:outline-none"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="dark"
            initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
            transition={{ duration: 0.25 }}
            className="flex items-center gap-1.5 text-cyan-300"
          >
            <Moon className="w-5 h-5 drop-shadow-[0_0_8px_rgba(34,211,238,0.7)]" />
          </motion.div>
        ) : (
          <motion.div
            key="light"
            initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
            transition={{ duration: 0.25 }}
            className="flex items-center gap-1.5 text-amber-500"
          >
            <Sun className="w-5 h-5 drop-shadow-[0_0_8px_rgba(245,158,11,0.7)]" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
};
