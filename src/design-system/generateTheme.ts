import { createTheme, alpha, type Theme } from '@mui/material/styles';
import type { ThemeConfig } from './themeConfig';
import { generateScale, generateNeutralScale, tokens } from './tokens';

// ─── Custom breakpoints ───────────────────────────────────────────────────────

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs:   true; // 0px     — mobile portrait
    sm:   true; // 600px   — mobile landscape
    md:   true; // 900px   — tablet
    lg:   true; // 1024px  — small laptop
    xl:   true; // 1280px  — large laptop
    xxl:  true; // 1440px  — desktop
    xxxl: true; // 1600px  — wide desktop
    uhd:  true; // 1920px  — ultra wide
  }
}

// ─── Theme factory ────────────────────────────────────────────────────────────

export function generateTheme(config: ThemeConfig): Theme {
  const primary = generateScale(config.brandColor);
  const neutral = generateNeutralScale(config.brandColor);

  const isLight = config.mode === 'light';

  const background = {
    default: isLight ? '#F7F7F8'  : '#0F0F0F',
    paper:   isLight ? '#FFFFFF'  : neutral[900],
  };

  const text = {
    primary:   isLight ? neutral[900] : neutral[50],
    secondary: isLight ? neutral[600] : neutral[400],
    disabled:  isLight ? neutral[400] : neutral[700],
  };

  const divider = isLight ? alpha('#000000', 0.06) : alpha('#ffffff', 0.08);

  const fontFamilyString =
    config.fontFamily === 'Helvetica Neue'
      ? 'Helvetica Neue, Helvetica, Arial, system-ui, sans-serif'
      : `'${config.fontFamily}', system-ui, sans-serif`;

  return createTheme({
    breakpoints: {
      values: {
        xs:   0,
        sm:   600,
        md:   900,
        lg:   1024,
        xl:   1280,
        xxl:  1440,
        xxxl: 1600,
        uhd:  1920,
      },
    },

    palette: {
      mode: config.mode,
      primary: {
        light:       primary[400],
        main:        primary[500],
        dark:        primary[700],
        contrastText: '#FFFFFF',
      },
      error:   { main: tokens.color.error[500] },
      success: { main: tokens.color.success[500] },
      warning: { main: tokens.color.warning[500] },
      info:    { main: tokens.color.info[500] },
      text: {
        primary:   text.primary,
        secondary: text.secondary,
        disabled:  text.disabled,
      },
      background,
      divider,
    },

    typography: {
      fontFamily: fontFamilyString,
      fontSize: 14,
      fontWeightRegular: tokens.fontWeight.normal,
      fontWeightMedium:  tokens.fontWeight.medium,
      fontWeightBold:    tokens.fontWeight.bold,
      h1: { fontSize: tokens.fontSize['4xl'], fontWeight: 700, lineHeight: 1.25 },
      h2: { fontSize: tokens.fontSize['3xl'], fontWeight: 700, lineHeight: 1.25 },
      h3: { fontSize: tokens.fontSize['2xl'], fontWeight: 600, lineHeight: 1.3  },
      h4: { fontSize: tokens.fontSize.xl,     fontWeight: 600, lineHeight: 1.4  },
      h5: { fontSize: tokens.fontSize.lg,     fontWeight: 600, lineHeight: 1.4  },
      h6: { fontSize: tokens.fontSize.base,   fontWeight: 600, lineHeight: 1.5  },
      body1:   { fontSize: tokens.fontSize.base, lineHeight: 1.5 },
      body2:   { fontSize: tokens.fontSize.sm,   lineHeight: 1.5 },
      caption: { fontSize: tokens.fontSize.xs,   lineHeight: 1.5 },
      overline: {
        fontSize:      tokens.fontSize.xs,
        fontWeight:    600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      },
    },

    shape: { borderRadius: 8 },

    spacing: 4,

    // MUI requires exactly 25 shadow values (indices 0–24)
    shadows: [
      'none',
      tokens.shadow.sm,
      tokens.shadow.md,
      tokens.shadow.lg,
      tokens.shadow.xl,
      ...Array(20).fill(tokens.shadow.xl),
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
          },
          sizeSmall:  { fontSize: tokens.fontSize.sm,   padding: '6px 12px'   },
          sizeMedium: { fontSize: tokens.fontSize.base, padding: '10px 20px'  },
          sizeLarge:  { fontSize: tokens.fontSize.lg,   padding: '14px 28px'  },
        },
      },

      MuiTextField: {
        defaultProps: { variant: 'outlined', size: 'small' },
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: tokens.borderRadius.md,
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
            '&:hover:not(.Mui-focused):not(.Mui-disabled) .MuiOutlinedInput-notchedOutline': {
              borderColor: isLight ? alpha('#000000', 0.32) : alpha('#ffffff', 0.32),
            },
          },
        },
      },

      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: tokens.borderRadius.lg,
            backgroundImage: 'none',
            border: `1px solid ${alpha(isLight ? '#000000' : '#ffffff', isLight ? 0.07 : 0.08)}`,
            boxShadow: isLight ? '0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04)' : 'none',
          },
        },
      },

      MuiChip: {
        styleOverrides: {
          root: { borderRadius: tokens.borderRadius.full },
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
            borderRadius: tokens.borderRadius.xl,
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
