// src/theme.js
import { createTheme, alpha } from '@mui/material/styles';

const BG_DEFAULT = '#eceef2'; // was primary.main
const BG_PAPER = '#ffffff'; // was secondary.main
const TEXT_MAIN = '#212121';
const TEXT_MUTED = '#5f5f5f';
const BRAND = '#3b82f6'; // use as primary accent (CTA)
const BRAND_2 = '#a855f7'; // optional gradient stop
const OUTLINE = '#75757536';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: BRAND, contrastText: '#fff' },
    secondary: { main: BRAND_2, contrastText: '#fff' },
    background: { default: BG_DEFAULT, paper: BG_PAPER },
    text: { primary: TEXT_MAIN, secondary: '#5f5f5f' },
    divider: alpha(TEXT_MAIN, 0.12),
    gradient: `linear-gradient(135deg, ${BRAND}, ${BRAND_2})`,

    // MUI uses these widely for hovers/disabled states
    action: {
      hover: alpha(BRAND, 0.06),
      selected: alpha(BRAND, 0.12),
      disabled: alpha(TEXT_MAIN, 0.26),
      disabledBackground: alpha(TEXT_MAIN, 0.08),
      focus: alpha(BRAND, 0.16),
    },

    // Your custom tokens (fine to keep)
    input_background: '#f3f3f5',
    outline: OUTLINE,

    // Optional: semantic surfaces to avoid hardcoding in components
    // (access via theme.palette.surfaceMuted, etc.)
    surfaceMuted: BG_PAPER, // custom key (TypeScript users can module-augment)
    surfaceRaised: '#ffffff',
  },

  typography: {
    fontFamily: 'Roboto, sans-serif',
    h1: { fontSize: '1.5rem', fontWeight: 'bold', color: TEXT_MAIN },
    h2: { fontSize: '1.25rem', fontWeight: 600, color: '#333333' },
    h3: { fontSize: '1.1rem', fontWeight: 600, color: '#424242' },
    body1: { fontSize: '1rem', color: '#555555', lineHeight: 1.6 },
    body2: { fontSize: '0.875rem', color: '#757575', lineHeight: 1.5 },
    caption: { fontSize: '0.75rem', color: '#9e9e9e' },
    button: { textTransform: 'none', fontWeight: 500 },
    subtitle1: { fontSize: '1rem', fontWeight: 500, color: '#616161' },
    subtitle2: { fontSize: '0.875rem', fontWeight: 500, color: '#757575' },
  },
  shape: { borderRadius: 4 }, // <- global default (px)
  components: {
    // Global baseline (helps ensure body bg is correct)
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: BG_DEFAULT, color: TEXT_MAIN },
      },
    },
    MuiAppBar: {
      defaultProps: { color: 'default', elevation: 0 },
      styleOverrides: {
        colorDefault: {
          backgroundColor: BG_PAPER,
          backgroundImage: 'none',
          color: TEXT_MAIN,
          border: 'none',
        },
        // Opt-in brand bar when you use color="primary"
        colorPrimary: {
          backgroundImage: `linear-gradient(135deg, ${BRAND}, ${BRAND_2})`,
          color: '#fff',
        },
      },
    },

    // Buttons use brand colors; you don’t paint backgrounds with primary.main
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 12 },
        containedPrimary: {
          backgroundImage: `linear-gradient(135deg, ${BRAND}, ${BRAND_2})`,
          '&:hover': {
            backgroundImage: `linear-gradient(135deg, ${BRAND}, ${alpha(BRAND_2, 0.85)})`,
          },
        },
        outlined: {
          borderColor: alpha(TEXT_MAIN, 0.18),
          '&:hover': {
            borderColor: BRAND,
            backgroundColor: alpha(BRAND, 0.04),
          },
        },
      },
    },

    // Paper surfaces follow background.paper
    MuiPaper: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: BG_PAPER,
          border: `1px solid ${alpha(TEXT_MAIN, 0.08)}`,
          borderRadius: theme.shape.borderRadius, // uses the global 12
        }),
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.input_background,
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.main,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.main,
            boxShadow: `0 0 0 3px ${theme.palette.action.focus}`,
          },
        }),
        input: {
          // optional: tweak padding or font here
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: { borderColor: alpha(TEXT_MAIN, 0.12) },
      },
    },
  },
});

export default theme;
