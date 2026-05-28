import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import type { Theme } from '@mui/material/styles';

import { loadThemeMode, saveThemeMode, type ThemeMode } from './themeMode';
import { generateTheme } from './generateTheme';

export interface ThemeContextValue {
  mode: ThemeMode;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  muiTheme: Theme;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function FoundationThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(() => loadThemeMode());

  const muiTheme = useMemo(() => generateTheme(mode), [mode]);

  useEffect(() => {
    saveThemeMode(mode);
  }, [mode]);

  const setMode = (nextMode: ThemeMode) => {
    setModeState(nextMode);
  };

  const toggleMode = () => {
    setModeState(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const value: ThemeContextValue = {
    mode,
    isDark: mode === 'dark',
    setMode,
    toggleMode,
    muiTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useFoundationTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useFoundationTheme must be used inside FoundationThemeProvider');
  }
  return context;
}
