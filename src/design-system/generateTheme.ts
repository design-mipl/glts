import chroma from 'chroma-js';
import { createTheme, alpha, type Theme } from '@mui/material/styles';
import {
  FOUNDATION_BREAKPOINT_VALUES,
} from './breakpoints';
import { getNavigationColor, type ThemeConfig } from './themeConfig';
import {
  generateScale,
  generateNeutralScale,
  tokens,
} from './tokens';

// ─── Custom breakpoints ───────────────────────────────────────────────────────

interface NavigationSurface {
  background: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  hover: string;
  activeBg: string;
  activeText: string;
}

declare module '@mui/material/styles' {
  interface Theme {
    foundation: {
      navigation: NavigationSurface;
    };
  }

  interface ThemeOptions {
    foundation?: {
      navigation?: Partial<NavigationSurface>;
    };
  }

  interface BreakpointOverrides {
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
    desktop: true;
    desktopMd: true;
    desktopLg: true;
    desktopXl: true;
    desktopUhd: true;
  }
}



function getContrastText(color: string): string {
  const lightContrast = chroma.contrast(color, '#FFFFFF');
  const darkContrast = chroma.contrast(color, '#111827');

  return lightContrast >= darkContrast ? '#FFFFFF' : '#111827';
}

function createMuiColor(mainColor: string) {
  const scale = generateScale(mainColor);

  return {
    light: scale[400],
    main: scale[500],
    dark: scale[700],
    contrastText: getContrastText(scale[500]),
  };
}

function createNavigationSurface(background: string, accent: string): NavigationSurface {
  const textPrimary = getContrastText(background);
  const prefersLightText = textPrimary === '#FFFFFF';
  const accentScale = generateScale(accent);

  return {
    background,
    textPrimary,
    textSecondary: alpha(textPrimary, prefersLightText ? 0.78 : 0.72),
    textMuted: alpha(textPrimary, prefersLightText ? 0.58 : 0.5),
    border: alpha(textPrimary, prefersLightText ? 0.12 : 0.08),
    hover: alpha(textPrimary, prefersLightText ? 0.08 : 0.05),
    activeBg: alpha(accentScale[500], prefersLightText ? 0.22 : 0.14),
    activeText: prefersLightText ? '#FFFFFF' : accentScale[700],
  };
}

// ─── Theme factory ────────────────────────────────────────────────────────────

export function generateTheme(config: ThemeConfig): Theme {
  const isLight = config.mode === 'light';
  const activePalette = isLight ? config.light : config.dark;
  const primary = createMuiColor(activePalette.primary);
  const secondary = createMuiColor(activePalette.secondary);
  const success = createMuiColor(activePalette.success);
  const warning = createMuiColor(activePalette.warning);
  const error = createMuiColor(activePalette.danger);
  const info = createMuiColor(activePalette.info);
  const neutral = generateNeutralScale(activePalette.brand);
  const navigation = createNavigationSurface(
    getNavigationColor(config.mode, config.navigationColor),
    activePalette.primary,
  );

  const background = {
    default: isLight ? '#F7F7F8' : '#0F1115',
    paper: isLight ? '#FFFFFF' : chroma(neutral[900]).brighten(0.2).hex(),
  };

  const text = {
    primary: activePalette.textPrimary,
    secondary: activePalette.textSecondary,
    disabled: isLight ? neutral[400] : neutral[700],
  };

  const divider = isLight ? alpha(text.primary, 0.08) : alpha('#ffffff', 0.12);

  const fontFamilyString =
    config.fontFamily === 'Helvetica Neue'
      ? 'Helvetica Neue, Helvetica, Arial, system-ui, sans-serif'
      : `'${config.fontFamily}', system-ui, sans-serif`;

  const shadowMicro = tokens.shadow.lg;

  return createTheme({
    breakpoints: {
      values: { ...FOUNDATION_BREAKPOINT_VALUES },
    },

    palette: {
      mode: config.mode,
      primary,
      secondary,
      error,
      success,
      warning,
      info,
      text: {
        primary: text.primary,
        secondary: text.secondary,
        disabled: text.disabled,
      },
      background,
      divider,
    },

    foundation: {
      navigation,
    },

    typography: {
      fontFamily: fontFamilyString,
      fontSize: 13,
      fontWeightRegular: tokens.fontWeight.normal,
      fontWeightMedium: tokens.fontWeight.medium,
      fontWeightBold: tokens.fontWeight.bold,
      h1: { fontSize: '28px', fontWeight: 600, lineHeight: 1.2, marginBottom: '16px' },
      h2: { fontSize: '20px', fontWeight: 600, lineHeight: 1.3, marginBottom: '12px' },
      h3: { fontSize: '15px', fontWeight: 600, lineHeight: 1.4, marginBottom: '8px' },
      h4: { fontSize: '13px', fontWeight: 600, lineHeight: 1.4, marginBottom: '6px' },
      h5: { fontSize: '12px', fontWeight: 600, lineHeight: 1.4 },
      h6: { fontSize: '11px', fontWeight: 600, lineHeight: 1.4 },
      body1: { fontSize: '13px', fontWeight: 400, lineHeight: 1.5 },
      body2: { fontSize: '12px', fontWeight: 400, lineHeight: 1.5 },
      caption: { fontSize: '11px', fontWeight: 400, lineHeight: 1.4 },
      subtitle1: { fontSize: '12px', fontWeight: 400, lineHeight: 1.4 },
      overline: {
        fontSize: '11px',
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      },
    },

    shape: { borderRadius: 4 },

    spacing: 4,

    shadows: [
      'none',
      tokens.shadow.xs,
      tokens.shadow.sm,
      tokens.shadow.md,
      tokens.shadow.lg,
      ...Array(20).fill(shadowMicro),
    ] as any,

    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            transition: 'background-color 200ms ease, color 200ms ease',
          },
        },
      },

      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: tokens.borderRadius.md,
            fontSize: '12px',
            padding: '5px 12px',
            minHeight: 32,
          },
          sizeSmall: {
            fontSize: '11px',
            padding: '4px 8px',
            minHeight: 28,
          },
          sizeMedium: {
            fontSize: '12px',
            padding: '5px 12px',
            minHeight: 32,
          },
          sizeLarge: {
            fontSize: '13px',
            padding: '7px 14px',
            minHeight: 36,
          },
        },
      },

      MuiTextField: {
        defaultProps: { variant: 'outlined', size: 'small' },
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: tokens.borderRadius.md,
              minHeight: '32px !important',
              height: '32px !important',
              fontSize: '12px',
            },
            '& .MuiInputBase-root': {
              minHeight: '32px !important',
              height: '32px !important',
            },
            '& .MuiOutlinedInput-input': {
              paddingTop: '6px',
              paddingBottom: '6px',
              fontSize: '12px',
              height: 'auto',
            },
          },
        },
      },

      MuiOutlinedInput: {
        styleOverrides: {
          notchedOutline: {
            borderColor: isLight ? alpha('#000000', 0.18) : alpha('#ffffff', 0.18),
          },
          root: {
            minHeight: '32px',
            height: '32px',
            fontSize: '12px',
            '&:hover:not(.Mui-focused):not(.Mui-disabled) .MuiOutlinedInput-notchedOutline': {
              borderColor: isLight ? alpha('#000000', 0.32) : alpha('#ffffff', 0.32),
            },
          },
          input: {
            paddingTop: '6px',
            paddingBottom: '6px',
            fontSize: '12px',
            height: 'auto',
          },
        },
      },

      MuiCard: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: tokens.borderRadius.lg,
            backgroundImage: 'none',
            border: `1px solid ${alpha(isLight ? '#000000' : '#ffffff', isLight ? 0.07 : 0.1)}`,
            boxShadow: isLight ? tokens.shadow.sm : 'none',
            [theme.breakpoints.up('desktop')]: {
              boxShadow: isLight ? tokens.shadow.xs : 'none',
            },
          }),
        },
      },

      MuiCardContent: {
        styleOverrides: {
          root: {
            padding: '12px',
            '&:last-child': { paddingBottom: '12px' },
          },
        },
      },

      MuiCheckbox: {
        styleOverrides: {
          root: ({ theme }) => ({
            padding: theme.spacing(0.75),
            [theme.breakpoints.up('desktop')]: {
              padding: theme.spacing(0.5),
              transform: 'scale(1)',
            },
            transform: 'scale(1.08)',
          }),
        },
      },

      MuiRadio: {
        styleOverrides: {
          root: ({ theme }) => ({
            padding: theme.spacing(0.75),
            [theme.breakpoints.up('desktop')]: {
              padding: theme.spacing(0.5),
              transform: 'scale(1)',
            },
            transform: 'scale(1.08)',
          }),
        },
      },

      MuiSwitch: {
        styleOverrides: {
          root: ({ theme }) => ({
            [theme.breakpoints.down('lg')]: {
              transform: 'scale(1.06)',
            },
          }),
        },
      },

      MuiChip: {
        styleOverrides: {
          root: { borderRadius: tokens.borderRadius.md },
        },
      },

      MuiTooltip: {
        styleOverrides: {
          tooltip: { borderRadius: tokens.borderRadius.sm },
        },
      },

      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: tokens.borderRadius.lg,
            backgroundImage: 'none',
          },
        },
      },

      MuiPopover: {
        styleOverrides: {
          paper: { borderRadius: tokens.borderRadius.lg },
        },
      },

      MuiMenu: {
        styleOverrides: {
          paper: { borderRadius: tokens.borderRadius.lg },
        },
      },

      MuiDrawer: {
        styleOverrides: {
          paper: { backgroundImage: 'none' },
        },
      },
    },
  });
}
