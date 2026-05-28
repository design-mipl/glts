import chroma from 'chroma-js';
import { createTheme, alpha, type Theme } from '@mui/material/styles';
import {
  FOUNDATION_BREAKPOINT_VALUES,
} from './breakpoints';
import type { ThemeMode } from './themeMode';
import {
  getPublicBrandColors,
  publicFonts,
  type PublicBrandColors,
} from '@/shared/theme/publicBrand';
import {
  generateScale,
  tokens,
} from './tokens';
import { BUTTON, FORM_CONTROL } from './formControl';

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

function createFilledPaletteColor(mainColor: string, onFilled: string) {
  const scale = generateScale(mainColor);

  return {
    light: scale[400],
    main: scale[500],
    dark: scale[700],
    contrastText: onFilled,
  };
}

const containedFilledButtonSx = (onFilled: string) => ({
  color: onFilled,
  '&:hover': { color: onFilled },
});

function createNavigationSurface(
  background: string,
  accent: string,
  brand: PublicBrandColors,
): NavigationSurface {
  const accentScale = generateScale(accent);

  return {
    background,
    // Match customer portal navigation emphasis (navy-forward hover/active text).
    textPrimary: brand.navy,
    textSecondary: brand.textSecondary,
    textMuted: brand.textMuted,
    border: brand.border,
    hover: brand.greenMuted,
    activeBg: accentScale[500],
    activeText: brand.onBrandFilled,
  };
}

function getNavigationBackground(mode: ThemeMode): string {
  const colors = getPublicBrandColors(mode);
  return mode === 'light' ? colors.white : colors.surfaceAlt;
}

export function generateTheme(mode: ThemeMode): Theme {
  const isLight = mode === 'light';
  const brand = getPublicBrandColors(mode);

  const onFilled = brand.onBrandFilled;
  const primary = createFilledPaletteColor(brand.greenBright, onFilled);
  const secondary = createMuiColor(brand.navy);
  const success = createFilledPaletteColor(brand.greenBright, onFilled);
  const warning = createFilledPaletteColor(tokens.color.warning[500], onFilled);
  const error = createFilledPaletteColor(tokens.color.error[500], onFilled);
  const info = createFilledPaletteColor(tokens.color.info[500], onFilled);
  const filledButtonLabelSx = containedFilledButtonSx(onFilled);

  const navigation = createNavigationSurface(
    getNavigationBackground(mode),
    brand.greenBright,
    brand,
  );

  const background = {
    default: brand.surface,
    paper: brand.white,
  };

  const text = {
    primary: brand.text,
    secondary: brand.textSecondary,
    disabled: brand.textMuted,
  };

  const divider = brand.border;
  const fontFamilyString = publicFonts.body;

  const shadowMicro = tokens.shadow.lg;
  const shadows = [
    'none',
    tokens.shadow.xs,
    tokens.shadow.sm,
    tokens.shadow.md,
    tokens.shadow.lg,
    ...Array(20).fill(shadowMicro),
  ] as Theme['shadows'];

  return createTheme({
    breakpoints: {
      values: { ...FOUNDATION_BREAKPOINT_VALUES },
    },

    palette: {
      mode,
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

    shadows,

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
            fontWeight: BUTTON.fontWeight,
            borderRadius: BUTTON.borderRadius,
            fontSize: BUTTON.fontSize,
            padding: '7px 16px',
            minHeight: BUTTON.minHeightSm,
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
            fontSize: BUTTON.fontSize,
            padding: '8px 20px',
            minHeight: BUTTON.minHeightMd,
            borderRadius: BUTTON.borderRadius,
          },
          containedPrimary: filledButtonLabelSx,
          containedSuccess: filledButtonLabelSx,
          containedInfo: filledButtonLabelSx,
          containedError: filledButtonLabelSx,
          containedWarning: filledButtonLabelSx,
        },
      },

      MuiFormLabel: {
        styleOverrides: {
          root: {
            fontSize: FORM_CONTROL.labelFontSize,
            fontWeight: FORM_CONTROL.labelFontWeight,
            color: text.primary,
            '&.Mui-focused': {
              color: primary.main,
            },
          },
        },
      },

      MuiFormHelperText: {
        styleOverrides: {
          root: {
            fontSize: FORM_CONTROL.helperFontSize,
            marginTop: '4px',
            marginLeft: 0,
            marginRight: 0,
          },
        },
      },

      MuiTextField: {
        defaultProps: { variant: 'outlined', size: 'small' },
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: FORM_CONTROL.borderRadius,
              minHeight: `${FORM_CONTROL.heightMd} !important`,
              height: `${FORM_CONTROL.heightMd} !important`,
              fontSize: FORM_CONTROL.fontSize,
            },
            '& .MuiOutlinedInput-root.MuiInputBase-sizeSmall': {
              minHeight: `${FORM_CONTROL.heightSm} !important`,
              height: `${FORM_CONTROL.heightSm} !important`,
            },
            '& .MuiOutlinedInput-input': {
              padding: `0 ${FORM_CONTROL.paddingX}`,
              fontSize: FORM_CONTROL.fontSize,
              height: 'auto',
            },
          },
        },
      },

      MuiOutlinedInput: {
        styleOverrides: {
          notchedOutline: {
            borderColor: alpha(brand.text, 0.18),
          },
          root: {
            minHeight: FORM_CONTROL.heightMd,
            height: FORM_CONTROL.heightMd,
            fontSize: FORM_CONTROL.fontSize,
            borderRadius: FORM_CONTROL.borderRadius,
            '&.MuiInputBase-sizeSmall': {
              minHeight: FORM_CONTROL.heightSm,
              height: FORM_CONTROL.heightSm,
            },
            '&:hover:not(.Mui-focused):not(.Mui-disabled) .MuiOutlinedInput-notchedOutline': {
              borderColor: alpha(brand.text, 0.32),
            },
          },
          input: {
            padding: `0 ${FORM_CONTROL.paddingX}`,
            fontSize: FORM_CONTROL.fontSize,
            height: 'auto',
          },
        },
      },

      MuiSelect: {
        styleOverrides: {
          select: {
            fontSize: FORM_CONTROL.fontSize,
            minHeight: 'auto !important',
            padding: `0 ${FORM_CONTROL.paddingX} !important`,
          },
          outlined: {
            borderRadius: FORM_CONTROL.borderRadius,
          },
        },
      },

      MuiCard: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: tokens.borderRadius.lg,
            backgroundImage: 'none',
            border: `1px solid ${isLight ? alpha(brand.text, 0.07) : brand.border}`,
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

      MuiTabs: {
        styleOverrides: {
          indicator: {
            backgroundColor: secondary.main,
          },
        },
      },

      MuiTab: {
        styleOverrides: {
          root: {
            color: text.secondary,
            '&.Mui-selected': {
              color: secondary.main,
              fontWeight: 600,
            },
          },
        },
      },
    },
  });
}
