import { create } from 'zustand';

interface ThemeState {
  theme: 'dark' | 'daylight';
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: (localStorage.getItem('taskverse_theme') as 'dark' | 'daylight') || 'dark',
  toggleTheme: () =>
    set((state) => {
      const nextTheme = state.theme === 'dark' ? 'daylight' : 'dark';
      localStorage.setItem('taskverse_theme', nextTheme);
      if (nextTheme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('daylight');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('daylight');
      }
      return { theme: nextTheme };
    }),
}));
