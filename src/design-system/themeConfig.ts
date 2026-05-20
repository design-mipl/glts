import chroma from 'chroma-js';

import { BRAND_COLOR, generateNeutralScale, generateScale, tokens } from './tokens';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ThemeMode = 'light' | 'dark';
export type TemplateOption = 'template-1' | 'template-2' | 'template-3';

export interface ColorPalette {
  brand: string;
  primary: string;
  secondary: string;
  textPrimary: string;
  textSecondary: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
}

export interface NavigationColor {
  base?: string;
  light: string;
  dark: string;
}

export interface ThemeConfig {
  brandColor: string;
  fontFamily: string;
  mode: ThemeMode;
  light: ColorPalette;
  dark: ColorPalette;
  navigationColor?: NavigationColor;
  selectedTemplate: TemplateOption;
}

// ─── Font options ─────────────────────────────────────────────────────────────
// Helvetica Neue is a system font — no Google Fonts link required.
// All others are loaded via Google Fonts in index.html.

export const FONT_OPTIONS: { label: string; value: string }[] = [
  { label: 'Inter',             value: 'Inter' },
  { label: 'Plus Jakarta Sans', value: 'Plus Jakarta Sans' },
  { label: 'DM Sans',           value: 'DM Sans' },
  { label: 'Geist',             value: 'Geist' },
  { label: 'Manrope',           value: 'Manrope' },
  { label: 'Poppins',           value: 'Poppins' },
  { label: 'Helvetica',         value: 'Helvetica Neue' },
];

// ─── Color presets ────────────────────────────────────────────────────────────

export const COLOR_PRESETS: { label: string; value: string }[] = [
  { label: 'Indigo', value: '#6366F1' },
  { label: 'Violet', value: '#7C3AED' },
  { label: 'Blue',   value: '#2563EB' },
  { label: 'Teal',   value: '#0D9488' },
  { label: 'Green',  value: '#059669' },
  { label: 'Orange', value: '#EA580C' },
  { label: 'Rose',   value: '#E11D48' },
  { label: 'Slate',  value: '#475569' },
];

export const TEMPLATE_OPTIONS: { label: string; value: TemplateOption; description: string }[] = [
  {
    label: 'Template 1',
    value: 'template-1',
    description: 'Balanced sidebar and content layout for general-purpose dashboards.',
  },
  {
    label: 'Template 2',
    value: 'template-2',
    description: 'Emphasizes content density with a more compact workspace feel.',
  },
  {
    label: 'Template 3',
    value: 'template-3',
    description: 'Highlights visual sections with a more editorial page rhythm.',
  },
];

// ─── Validation + helpers ─────────────────────────────────────────────────────

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function normalizeHexColor(value: unknown, fallback?: string): string | undefined {
  if (typeof value !== 'string' || !chroma.valid(value)) {
    return fallback;
  }

  return chroma(value).hex();
}

function shiftHue(baseColor: string, degrees: number): string {
  const color = chroma(baseColor);
  const currentHue = color.get('hsl.h');
  const safeHue = Number.isNaN(currentHue) ? 220 : currentHue;

  return color.set('hsl.h', (safeHue + degrees + 360) % 360).hex();
}

function deriveSecondaryColor(baseColor: string, mode: ThemeMode): string {
  return mode === 'light'
    ? chroma(shiftHue(baseColor, 26)).brighten(0.25).saturate(0.15).hex()
    : chroma(shiftHue(baseColor, 18)).brighten(0.45).saturate(0.2).hex();
}

function preserveCustomColor(current: string, previousDefault: string, nextDefault: string): string {
  return current.toLowerCase() === previousDefault.toLowerCase() ? nextDefault : current;
}

export function generateLightShade(hexColor: string): string {
  return chroma(hexColor).mix('#FFFFFF', 0.84, 'lab').brighten(0.25).hex();
}

export function generateDarkShade(hexColor: string): string {
  return chroma(hexColor).mix('#111827', 0.68, 'lab').darken(0.2).hex();
}

export function getNavigationColor(
  mode: ThemeMode,
  navigationColor?: string | NavigationColor | null,
): string {
  if (!navigationColor) {
    return mode === 'light' ? '#FFFFFF' : '#1F2430';
  }

  if (typeof navigationColor === 'string') {
    return mode === 'light'
      ? generateLightShade(navigationColor)
      : generateDarkShade(navigationColor);
  }

  return mode === 'light' ? navigationColor.light : navigationColor.dark;
}

export function createNavigationColor(baseColor?: string): NavigationColor {
  const base = normalizeHexColor(baseColor);

  return {
    base,
    light: base ? generateLightShade(base) : getNavigationColor('light'),
    dark: base ? generateDarkShade(base) : getNavigationColor('dark'),
  };
}

export function createDefaultColorPalette(baseBrand: string, mode: ThemeMode): ColorPalette {
  const brand = normalizeHexColor(baseBrand, BRAND_COLOR) ?? BRAND_COLOR;
  const brandScale = generateScale(brand);
  const neutralScale = generateNeutralScale(brand);

  return {
    brand,
    primary: brandScale[500],
    secondary: deriveSecondaryColor(brand, mode),
    textPrimary: mode === 'light' ? neutralScale[900] : neutralScale[50],
    textSecondary: mode === 'light' ? neutralScale[600] : neutralScale[400],
    success: tokens.color.success[500],
    warning: tokens.color.warning[500],
    danger: tokens.color.error[500],
    info: tokens.color.info[500],
  };
}

export function createThemeConfig(overrides?: Partial<ThemeConfig>): ThemeConfig {
  const brandColor = normalizeHexColor(overrides?.brandColor, BRAND_COLOR) ?? BRAND_COLOR;
  const navigationColor = overrides?.navigationColor?.base;

  return {
    brandColor,
    fontFamily: overrides?.fontFamily ?? 'Inter',
    mode: overrides?.mode ?? 'light',
    light: createDefaultColorPalette(brandColor, 'light'),
    dark: createDefaultColorPalette(brandColor, 'dark'),
    navigationColor: createNavigationColor(navigationColor),
    selectedTemplate: overrides?.selectedTemplate ?? 'template-1',
  };
}

function normalizeColorPalette(
  mode: ThemeMode,
  value: unknown,
  brandColor: string,
): ColorPalette {
  const defaults = createDefaultColorPalette(brandColor, mode);

  if (!isRecord(value)) {
    return defaults;
  }

  return {
    brand: normalizeHexColor(value.brand, defaults.brand) ?? defaults.brand,
    primary: normalizeHexColor(value.primary, defaults.primary) ?? defaults.primary,
    secondary: normalizeHexColor(value.secondary, defaults.secondary) ?? defaults.secondary,
    textPrimary: normalizeHexColor(value.textPrimary, defaults.textPrimary) ?? defaults.textPrimary,
    textSecondary: normalizeHexColor(value.textSecondary, defaults.textSecondary) ?? defaults.textSecondary,
    success: normalizeHexColor(value.success, defaults.success) ?? defaults.success,
    warning: normalizeHexColor(value.warning, defaults.warning) ?? defaults.warning,
    danger: normalizeHexColor(value.danger, defaults.danger) ?? defaults.danger,
    info: normalizeHexColor(value.info, defaults.info) ?? defaults.info,
  };
}

function normalizeNavigationColor(value: unknown): NavigationColor {
  if (typeof value === 'string') {
    return createNavigationColor(value);
  }

  if (!isRecord(value)) {
    return createNavigationColor();
  }

  const base = normalizeHexColor(value.base);
  const fallback = createNavigationColor(base);

  return {
    base,
    light: normalizeHexColor(value.light, fallback.light) ?? fallback.light,
    dark: normalizeHexColor(value.dark, fallback.dark) ?? fallback.dark,
  };
}

export function normalizeThemeConfig(value: unknown): ThemeConfig {
  if (!isRecord(value)) {
    return createThemeConfig();
  }

  const brandColor = normalizeHexColor(value.brandColor, BRAND_COLOR) ?? BRAND_COLOR;
  const mode: ThemeMode = value.mode === 'dark' ? 'dark' : 'light';
  const selectedTemplate: TemplateOption =
    value.selectedTemplate === 'template-2' || value.selectedTemplate === 'template-3'
      ? value.selectedTemplate
      : 'template-1';

  return {
    brandColor,
    fontFamily: typeof value.fontFamily === 'string' ? value.fontFamily : 'Inter',
    mode,
    light: normalizeColorPalette('light', value.light, brandColor),
    dark: normalizeColorPalette('dark', value.dark, brandColor),
    navigationColor: normalizeNavigationColor(value.navigationColor),
    selectedTemplate,
  };
}

export function withBrandColor(config: ThemeConfig, nextBrandColor: string): ThemeConfig {
  const brandColor = normalizeHexColor(nextBrandColor, config.brandColor) ?? config.brandColor;
  const previousLightDefaults = createDefaultColorPalette(config.brandColor, 'light');
  const previousDarkDefaults = createDefaultColorPalette(config.brandColor, 'dark');
  const nextLightDefaults = createDefaultColorPalette(brandColor, 'light');
  const nextDarkDefaults = createDefaultColorPalette(brandColor, 'dark');

  return {
    ...config,
    brandColor,
    light: {
      brand: brandColor,
      primary: preserveCustomColor(config.light.primary, previousLightDefaults.primary, nextLightDefaults.primary),
      secondary: preserveCustomColor(config.light.secondary, previousLightDefaults.secondary, nextLightDefaults.secondary),
      textPrimary: preserveCustomColor(config.light.textPrimary, previousLightDefaults.textPrimary, nextLightDefaults.textPrimary),
      textSecondary: preserveCustomColor(config.light.textSecondary, previousLightDefaults.textSecondary, nextLightDefaults.textSecondary),
      success: preserveCustomColor(config.light.success, previousLightDefaults.success, nextLightDefaults.success),
      warning: preserveCustomColor(config.light.warning, previousLightDefaults.warning, nextLightDefaults.warning),
      danger: preserveCustomColor(config.light.danger, previousLightDefaults.danger, nextLightDefaults.danger),
      info: preserveCustomColor(config.light.info, previousLightDefaults.info, nextLightDefaults.info),
    },
    dark: {
      brand: brandColor,
      primary: preserveCustomColor(config.dark.primary, previousDarkDefaults.primary, nextDarkDefaults.primary),
      secondary: preserveCustomColor(config.dark.secondary, previousDarkDefaults.secondary, nextDarkDefaults.secondary),
      textPrimary: preserveCustomColor(config.dark.textPrimary, previousDarkDefaults.textPrimary, nextDarkDefaults.textPrimary),
      textSecondary: preserveCustomColor(config.dark.textSecondary, previousDarkDefaults.textSecondary, nextDarkDefaults.textSecondary),
      success: preserveCustomColor(config.dark.success, previousDarkDefaults.success, nextDarkDefaults.success),
      warning: preserveCustomColor(config.dark.warning, previousDarkDefaults.warning, nextDarkDefaults.warning),
      danger: preserveCustomColor(config.dark.danger, previousDarkDefaults.danger, nextDarkDefaults.danger),
      info: preserveCustomColor(config.dark.info, previousDarkDefaults.info, nextDarkDefaults.info),
    },
  };
}

export function resetAdvancedColors(config: ThemeConfig): ThemeConfig {
  return {
    ...config,
    light: createDefaultColorPalette(config.brandColor, 'light'),
    dark: createDefaultColorPalette(config.brandColor, 'dark'),
  };
}

export function resetNavigationColor(config: ThemeConfig): ThemeConfig {
  return {
    ...config,
    navigationColor: createNavigationColor(),
  };
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

export const DEFAULT_THEME_CONFIG: ThemeConfig = createThemeConfig();

// ─── Persistence ─────────────────────────────────────────────────────────────

const STORAGE_KEY = 'foundation:theme';

export function saveThemeConfig(config: ThemeConfig): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export function loadThemeConfig(): ThemeConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_THEME_CONFIG;

    const parsed: unknown = JSON.parse(raw);
    return normalizeThemeConfig(parsed);
  } catch {
    return DEFAULT_THEME_CONFIG;
  }
}
