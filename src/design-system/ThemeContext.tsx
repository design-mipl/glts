import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
  type SetStateAction,
} from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import type { Theme } from '@mui/material/styles';

import {
  createNavigationColor,
  resetAdvancedColors as getResetAdvancedColors,
  resetNavigationColor as getResetNavigationColor,
  type TemplateOption,
  type ThemeMode,
  withBrandColor,
  type ColorPalette,
  type ThemeConfig,
  loadThemeConfig,
  saveThemeConfig,
} from './themeConfig';
import { generateTheme } from './generateTheme';

// ─── Context type ─────────────────────────────────────────────────────────────

export interface ThemeContextValue {
  config: ThemeConfig;
  setConfig: (config: SetStateAction<ThemeConfig>) => void;
  setBrandColor: (hex: string) => void;
  setFontFamily: (font: string) => void;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  setNavigationColor: (hex?: string) => void;
  resetNavigationColor: () => void;
  setPrimaryColor: (mode: ThemeMode, hex: string) => void;
  setSecondaryColor: (mode: ThemeMode, hex: string) => void;
  setTextPrimaryColor: (mode: ThemeMode, hex: string) => void;
  setTextSecondaryColor: (mode: ThemeMode, hex: string) => void;
  setSuccessColor: (mode: ThemeMode, hex: string) => void;
  setWarningColor: (mode: ThemeMode, hex: string) => void;
  setDangerColor: (mode: ThemeMode, hex: string) => void;
  setInfoColor: (mode: ThemeMode, hex: string) => void;
  resetAdvancedColors: () => void;
  setSelectedTemplate: (template: TemplateOption) => void;
  isDark: boolean;
  muiTheme: Theme;
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

  function updatePaletteColor(mode: ThemeMode, key: keyof ColorPalette, hex: string): void {
    setConfig((prev) => ({
      ...prev,
      [mode]: {
        ...prev[mode],
        [key]: hex,
      },
    }));
  }

  const setBrandColor = (hex: string) =>
    setConfig((prev) => withBrandColor(prev, hex));
  const setFontFamily = (font: string) =>
    setConfig((prev) => ({ ...prev, fontFamily: font }));
  const setMode = (mode: ThemeMode) =>
    setConfig((prev) => ({ ...prev, mode }));
  const toggleMode = () =>
    setConfig((prev) => ({
      ...prev,
      mode: prev.mode === 'light' ? 'dark' : 'light',
    }));
  const setNavigationColor = (hex?: string) =>
    setConfig((prev) => ({
      ...prev,
      navigationColor: createNavigationColor(hex),
    }));
  const resetNavigationColor = () =>
    setConfig((prev) => getResetNavigationColor(prev));
  const setPrimaryColor = (mode: ThemeMode, hex: string) =>
    updatePaletteColor(mode, 'primary', hex);
  const setSecondaryColor = (mode: ThemeMode, hex: string) =>
    updatePaletteColor(mode, 'secondary', hex);
  const setTextPrimaryColor = (mode: ThemeMode, hex: string) =>
    updatePaletteColor(mode, 'textPrimary', hex);
  const setTextSecondaryColor = (mode: ThemeMode, hex: string) =>
    updatePaletteColor(mode, 'textSecondary', hex);
  const setSuccessColor = (mode: ThemeMode, hex: string) =>
    updatePaletteColor(mode, 'success', hex);
  const setWarningColor = (mode: ThemeMode, hex: string) =>
    updatePaletteColor(mode, 'warning', hex);
  const setDangerColor = (mode: ThemeMode, hex: string) =>
    updatePaletteColor(mode, 'danger', hex);
  const setInfoColor = (mode: ThemeMode, hex: string) =>
    updatePaletteColor(mode, 'info', hex);
  const resetAdvancedColors = () =>
    setConfig((prev) => getResetAdvancedColors(prev));
  const setSelectedTemplate = (template: TemplateOption) =>
    setConfig((prev) => ({ ...prev, selectedTemplate: template }));

  const value: ThemeContextValue = {
    config,
    setConfig,
    setBrandColor,
    setFontFamily,
    setMode,
    toggleMode,
    setNavigationColor,
    resetNavigationColor,
    setPrimaryColor,
    setSecondaryColor,
    setTextPrimaryColor,
    setTextSecondaryColor,
    setSuccessColor,
    setWarningColor,
    setDangerColor,
    setInfoColor,
    resetAdvancedColors,
    setSelectedTemplate,
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
