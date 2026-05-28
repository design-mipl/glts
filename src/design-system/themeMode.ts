export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'glts:theme-mode';
const LEGACY_STORAGE_KEY = 'foundation:theme';

export const DEFAULT_THEME_MODE: ThemeMode = 'light';

function normalizeMode(value: unknown): ThemeMode {
  return value === 'dark' ? 'dark' : 'light';
}

function readLegacyMode(): ThemeMode | null {
  try {
    const raw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed === 'object' && parsed !== null && 'mode' in parsed) {
      return normalizeMode((parsed as { mode: unknown }).mode);
    }
  } catch {
    // ignore corrupt legacy payload
  }

  return null;
}

export function loadThemeMode(): ThemeMode {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === 'light' || raw === 'dark') {
      return raw;
    }

    const legacyMode = readLegacyMode();
    if (legacyMode) {
      saveThemeMode(legacyMode);
      return legacyMode;
    }
  } catch {
    // ignore storage errors
  }

  return DEFAULT_THEME_MODE;
}

export function saveThemeMode(mode: ThemeMode): void {
  localStorage.setItem(STORAGE_KEY, mode);
}
