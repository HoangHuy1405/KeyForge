import { alpha, PaletteMode } from '@mui/material/styles';

// ============================================================================
// Color Palette Definitions
// ============================================================================

export const lightPalette = {
  background: {
    default: '#f5f7fa',
    paper: '#ffffff',
    contrast: '#0a082f',
  },
  text: {
    primary: '#1a1a2e',
    secondary: '#64748b',
  },
  primary: {
    main: '#3b82f6',
    light: '#60a5fa',
    dark: '#2563eb',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#a855f7',
    light: '#c084fc',
    dark: '#9333ea',
    contrastText: '#ffffff',
  },
  success: {
    main: '#22c55e',
    light: '#4ade80',
    dark: '#16a34a',
    contrastText: '#ffffff',
  },
  warning: {
    main: '#f59e0b',
    light: '#fbbf24',
    dark: '#d97706',
    contrastText: '#000000',
  },
  error: {
    main: '#ef4444',
    light: '#f87171',
    dark: '#dc2626',
    contrastText: '#ffffff',
  },
  info: {
    main: '#06b6d4',
    light: '#22d3ee',
    dark: '#0891b2',
    contrastText: '#ffffff',
  },
  grey: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
};

export const darkPalette = {
  // Elegant dark background with subtle warmth (inspired by Notion/Linear)
  background: {
    default: '#141416',      // Rich charcoal, not pure black
    paper: '#1c1c1f',        // Slightly elevated surface
    contrast: '#ffffff',
  },
  text: {
    primary: '#ececee',      // Soft white, easier on eyes
    secondary: '#a0a0a6',    // Muted gray with slight warmth
  },
  // Vibrant primary blue that pops on dark
  primary: {
    main: '#6366f1',         // Indigo - modern and vibrant
    light: '#818cf8',
    dark: '#4f46e5',
    contrastText: '#ffffff',
  },
  // Purple secondary that complements the primary
  secondary: {
    main: '#a78bfa',         // Violet - softer purple
    light: '#c4b5fd',
    dark: '#8b5cf6',
    contrastText: '#ffffff',
  },
  // Semantic colors adjusted for dark mode visibility
  success: {
    main: '#34d399',         // Emerald green
    light: '#6ee7b7',
    dark: '#10b981',
    contrastText: '#000000',
  },
  warning: {
    main: '#fbbf24',         // Amber
    light: '#fcd34d',
    dark: '#f59e0b',
    contrastText: '#000000',
  },
  error: {
    main: '#fb7185',         // Rose - softer than pure red
    light: '#fda4af',
    dark: '#f43f5e',
    contrastText: '#000000',
  },
  info: {
    main: '#38bdf8',         // Sky blue
    light: '#7dd3fc',
    dark: '#0ea5e9',
    contrastText: '#000000',
  },
  // Carefully crafted gray scale with subtle warmth
  grey: {
    50: '#18181b',           // Darkest
    100: '#27272a',
    200: '#3f3f46',
    300: '#52525b',
    400: '#71717a',
    500: '#a1a1aa',
    600: '#d4d4d8',
    700: '#e4e4e7',
    800: '#f4f4f5',
    900: '#fafafa',          // Lightest
  },
};

// ============================================================================
// Design Tokens Factory
// ============================================================================

export const getDesignTokens = (mode: PaletteMode) => {
  const palette = mode === 'light' ? lightPalette : darkPalette;

  return {
    palette: {
      mode,
      ...palette,
      divider: alpha(palette.text.primary, mode === 'light' ? 0.12 : 0.08),
      gradient: `linear-gradient(135deg, ${palette.primary.main}, ${palette.secondary.main})`,
      action: {
        hover: alpha(palette.primary.main, mode === 'light' ? 0.08 : 0.12),
        selected: alpha(palette.primary.main, mode === 'light' ? 0.16 : 0.2),
        disabled: alpha(palette.text.primary, 0.38),
        disabledBackground: alpha(palette.text.primary, 0.12),
        focus: alpha(palette.primary.main, 0.16),
      },
      // Custom tokens
      input_background: mode === 'light' ? '#f8fafc' : '#27272a',
      outline: alpha(palette.text.primary, mode === 'light' ? 0.23 : 0.15),
      surfaceMuted: palette.background.paper,
      surfaceRaised: mode === 'light' ? '#ffffff' : '#27272a',
      footer: mode === 'light' ? '#1e293b' : '#0c0c0d',
    },
  };
};

export type DesignTokens = ReturnType<typeof getDesignTokens>;
