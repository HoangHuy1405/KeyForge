import { Components, Theme, alpha } from '@mui/material/styles';
import { DesignTokens } from '../palette';

// ============================================================================
// Button Components: Button, IconButton, FAB, ButtonGroup
// ============================================================================

export const getButtonOverrides = (tokens: DesignTokens): Components<Theme> => ({
  MuiButton: {
    defaultProps: {
      disableElevation: true,
    },
    styleOverrides: {
      root: {
        borderRadius: 10,
        padding: '8px 20px',
        fontWeight: 500,
        transition: 'all 0.2s ease',
      },
      // Size variants
      sizeSmall: {
        padding: '6px 14px',
        fontSize: '0.8125rem',
      },
      sizeLarge: {
        padding: '12px 28px',
        fontSize: '1rem',
      },
      // Contained variants
      containedPrimary: {
        background: tokens.palette.gradient,
        boxShadow: `0 4px 12px ${alpha(tokens.palette.primary.main, 0.35)}`,
        '&:hover': {
          background: `linear-gradient(135deg, ${tokens.palette.primary.dark}, ${tokens.palette.secondary.dark})`,
          boxShadow: `0 6px 20px ${alpha(tokens.palette.primary.main, 0.45)}`,
          transform: 'translateY(-1px)',
        },
        '&:active': {
          transform: 'translateY(0)',
        },
      },
      containedSecondary: {
        backgroundColor: tokens.palette.secondary.main,
        '&:hover': {
          backgroundColor: tokens.palette.secondary.dark,
        },
      },
      containedSuccess: {
        backgroundColor: tokens.palette.success.main,
        '&:hover': {
          backgroundColor: tokens.palette.success.dark,
        },
      },
      containedError: {
        backgroundColor: tokens.palette.error.main,
        '&:hover': {
          backgroundColor: tokens.palette.error.dark,
        },
      },
      // Outlined variants
      outlined: {
        borderWidth: 1.5,
        '&:hover': {
          borderWidth: 1.5,
        },
      },
      outlinedPrimary: {
        borderColor: tokens.palette.primary.main,
        color: tokens.palette.primary.main,
        '&:hover': {
          backgroundColor: alpha(tokens.palette.primary.main, 0.08),
          borderColor: tokens.palette.primary.dark,
        },
      },
      outlinedSecondary: {
        borderColor: tokens.palette.secondary.main,
        color: tokens.palette.secondary.main,
        '&:hover': {
          backgroundColor: alpha(tokens.palette.secondary.main, 0.08),
          borderColor: tokens.palette.secondary.dark,
        },
      },
      // Text variants
      text: {
        '&:hover': {
          backgroundColor: alpha(tokens.palette.primary.main, 0.08),
        },
      },
      textPrimary: {
        color: tokens.palette.primary.main,
      },
      textSecondary: {
        color: tokens.palette.secondary.main,
      },
    },
    // Custom variants
    variants: [
      // Soft variant - subtle background with matching text
      {
        props: { variant: 'soft' as any },
        style: {
          backgroundColor: alpha(tokens.palette.primary.main, 0.12),
          color: tokens.palette.primary.main,
          '&:hover': {
            backgroundColor: alpha(tokens.palette.primary.main, 0.2),
          },
        },
      },
      {
        props: { variant: 'soft' as any, color: 'secondary' },
        style: {
          backgroundColor: alpha(tokens.palette.secondary.main, 0.12),
          color: tokens.palette.secondary.main,
          '&:hover': {
            backgroundColor: alpha(tokens.palette.secondary.main, 0.2),
          },
        },
      },
      {
        props: { variant: 'soft' as any, color: 'success' },
        style: {
          backgroundColor: alpha(tokens.palette.success.main, 0.12),
          color: tokens.palette.success.main,
          '&:hover': {
            backgroundColor: alpha(tokens.palette.success.main, 0.2),
          },
        },
      },
      {
        props: { variant: 'soft' as any, color: 'error' },
        style: {
          backgroundColor: alpha(tokens.palette.error.main, 0.12),
          color: tokens.palette.error.main,
          '&:hover': {
            backgroundColor: alpha(tokens.palette.error.main, 0.2),
          },
        },
      },
    ],
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        borderRadius: 10,
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: alpha(tokens.palette.primary.main, 0.08),
        },
      },
      colorPrimary: {
        '&:hover': {
          backgroundColor: alpha(tokens.palette.primary.main, 0.16),
        },
      },
    },
  },
  MuiFab: {
    styleOverrides: {
      root: {
        boxShadow: `0 4px 12px ${alpha(tokens.palette.primary.main, 0.25)}`,
      },
      primary: {
        background: tokens.palette.gradient,
        '&:hover': {
          background: `linear-gradient(135deg, ${tokens.palette.primary.dark}, ${tokens.palette.secondary.dark})`,
        },
      },
    },
  },
  MuiButtonGroup: {
    styleOverrides: {
      root: {
        borderRadius: 10,
      },
      grouped: {
        '&:not(:last-of-type)': {
          borderColor: alpha(tokens.palette.text.primary, 0.12),
        },
      },
    },
  },
});
