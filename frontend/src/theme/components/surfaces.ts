import { Components, Theme, alpha } from '@mui/material/styles';
import { DesignTokens } from '../palette';

// ============================================================================
// Surface Components: Card, Paper, AppBar, Accordion
// ============================================================================

export const getSurfaceOverrides = (tokens: DesignTokens): Components<Theme> => ({
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        backgroundColor: tokens.palette.background.default,
        color: tokens.palette.text.primary,
        transition: 'background-color 0.2s ease, color 0.2s ease',
      },
      '::selection': {
        backgroundColor: alpha(tokens.palette.primary.main, 0.2),
      },
    },
  },
  MuiPaper: {
    defaultProps: {
      elevation: 0,
    },
    styleOverrides: {
      root: {
        backgroundColor: tokens.palette.background.paper,
        backgroundImage: 'none',
        border: `1px solid ${alpha(tokens.palette.text.primary, 0.08)}`,
      },
      elevation1: {
        boxShadow: `0 1px 3px ${alpha(tokens.palette.text.primary, 0.08)}`,
      },
      elevation2: {
        boxShadow: `0 4px 12px ${alpha(tokens.palette.text.primary, 0.1)}`,
      },
      elevation3: {
        boxShadow: `0 8px 24px ${alpha(tokens.palette.text.primary, 0.12)}`,
      },
    },
  },
  MuiCard: {
    defaultProps: {
      elevation: 0,
    },
    styleOverrides: {
      root: {
        borderRadius: 16,
        border: `1px solid ${alpha(tokens.palette.text.primary, 0.08)}`,
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: `0 8px 24px ${alpha(tokens.palette.text.primary, 0.1)}`,
        },
      },
    },
  },
  MuiCardHeader: {
    styleOverrides: {
      root: {
        padding: '20px 24px 12px',
      },
      title: {
        fontWeight: 600,
      },
    },
  },
  MuiCardContent: {
    styleOverrides: {
      root: {
        padding: '12px 24px 20px',
        '&:last-child': {
          paddingBottom: 20,
        },
      },
    },
  },
  MuiCardActions: {
    styleOverrides: {
      root: {
        padding: '12px 24px 16px',
      },
    },
  },
  MuiAppBar: {
    defaultProps: {
      color: 'default',
      elevation: 0,
    },
    styleOverrides: {
      root: {
        backgroundImage: 'none',
      },
      colorDefault: {
        backgroundColor: alpha(tokens.palette.background.paper, 0.85),
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        color: tokens.palette.text.primary,
        borderBottom: `1px solid ${alpha(tokens.palette.text.primary, 0.08)}`,
      },
      colorPrimary: {
        backgroundImage: tokens.palette.gradient,
        color: '#ffffff',
      },
    },
  },
  MuiAccordion: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        border: `1px solid ${alpha(tokens.palette.text.primary, 0.08)}`,
        '&:before': {
          display: 'none',
        },
        '&.Mui-expanded': {
          margin: '8px 0',
        },
      },
    },
  },
  MuiAccordionSummary: {
    styleOverrides: {
      root: {
        padding: '0 20px',
        minHeight: 56,
        '&.Mui-expanded': {
          minHeight: 56,
        },
      },
      content: {
        '&.Mui-expanded': {
          margin: '12px 0',
        },
      },
    },
  },
  MuiAccordionDetails: {
    styleOverrides: {
      root: {
        padding: '0 20px 20px',
      },
    },
  },
  MuiToolbar: {
    styleOverrides: {
      root: {
        minHeight: 64,
      },
    },
  },
});
