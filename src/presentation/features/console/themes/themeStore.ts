import { CONSOLE_THEMES, type ConsoleThemeId } from './types';

const KEY = 'apdeck-theme';

export const loadConsoleTheme = (): ConsoleThemeId => {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved && CONSOLE_THEMES.some((t) => t.id === saved)) return saved as ConsoleThemeId;
  } catch { /* storage unavailable */ }
  return 'apdeck';
};

export const saveConsoleTheme = (id: ConsoleThemeId) => {
  try {
    localStorage.setItem(KEY, id);
  } catch { /* storage unavailable */ }
};
