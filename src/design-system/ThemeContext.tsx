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

import {
  type ThemeConfig,
  loadThemeConfig,
  saveThemeConfig,
} from './themeConfig';
import { generateTheme } from './generateTheme';

// ─── Context type ─────────────────────────────────────────────────────────────

export interface ThemeContextValue {
  config:         ThemeConfig;
  setConfig:      (config: ThemeConfig) => void;
  setBrandColor:  (hex: string) => void;
  setFontFamily:  (font: string) => void;
  setMode:        (mode: 'light' | 'dark') => void;
  toggleMode:     () => void;
  isDark:         boolean;
  muiTheme:       Theme;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// ─── Google Fonts loader ──────────────────────────────────────────────────────

function loadGoogleFont(fontFamily: string): void {
  if (fontFamily === 'Helvetica Neue') return; // system font — no link needed

  const encoded = fontFamily.replace(/ /g, '+');
  const href = `https://fonts.googleapis.com/css2?family=${encoded}:wght@400;500;600;700&display=swap`;

  // Avoid duplicate <link> tags on re-renders / hot reloads
  const alreadyLoaded = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
    .some((el) => (el as HTMLLinkElement).href === href);

  if (!alreadyLoaded) {
    const link = document.createElement('link');
    link.rel  = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function FoundationThemeProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<ThemeConfig>(() => loadThemeConfig());

  const muiTheme = useMemo(() => generateTheme(config), [config]);

  // Persist to localStorage + ensure the active font is loaded on every change
  useEffect(() => {
    saveThemeConfig(config);
    loadGoogleFont(config.fontFamily);
  }, [config]);

  // Convenience setters — each merges a single field into current config
  const setBrandColor = (hex: string)              => setConfig({ ...config, brandColor: hex });
  const setFontFamily = (font: string)             => setConfig({ ...config, fontFamily: font });
  const setMode       = (mode: 'light' | 'dark')   => setConfig({ ...config, mode });
  const toggleMode    = ()                          => setConfig({ ...config, mode: config.mode === 'light' ? 'dark' : 'light' });

  const value: ThemeContextValue = {
    config,
    setConfig,
    setBrandColor,
    setFontFamily,
    setMode,
    toggleMode,
    isDark: config.mode === 'dark',
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

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useFoundationTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useFoundationTheme must be used inside FoundationThemeProvider');
  }
  return context;
}
