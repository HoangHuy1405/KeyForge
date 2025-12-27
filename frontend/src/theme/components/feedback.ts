import { Components, Theme, alpha, PaletteMode } from '@mui/material/styles';
import { DesignTokens } from '../palette';

// ============================================================================
// Feedback Components: Dialog, Snackbar, Alert, Tooltip, Progress
// ============================================================================

export const getFeedbackOverrides = (
  tokens: DesignTokens,
  mode: PaletteMode
): Components<Theme> => ({
  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: 16,
        boxShadow: `0 24px 48px ${alpha(tokens.palette.text.primary, 0.2)}`,
      },
    },
  },
  MuiDialogTitle: {
    styleOverrides: {
      root: {
        fontSize: '1.25rem',
        fontWeight: 600,
        padding: '20px 24px 8px',
      },
    },
  },
  MuiDialogContent: {
    styleOverrides: {
      root: {
        padding: '16px 24px',
      },
    },
  },
  MuiDialogActions: {
    styleOverrides: {
      root: {
        padding: '16px 24px 20px',
      },
    },
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        backgroundColor:
          mode === 'light' ? tokens.palette.grey[800] : tokens.palette.grey[200],
        color: mode === 'light' ? '#ffffff' : '#000000',
        fontSize: '0.75rem',
        fontWeight: 500,
        borderRadius: 6,
        padding: '6px 12px',
      },
      arrow: {
        color:
          mode === 'light' ? tokens.palette.grey[800] : tokens.palette.grey[200],
      },
    },
  },
  MuiSnackbar: {
    styleOverrides: {
      root: {
        '& .MuiSnackbarContent-root': {
          borderRadius: 10,
          boxShadow: `0 8px 24px ${alpha(tokens.palette.text.primary, 0.15)}`,
        },
      },
    },
  },
  MuiAlert: {
    styleOverrides: {
      root: {
        borderRadius: 10,
      },
      standardSuccess: {
        backgroundColor: alpha(tokens.palette.success.main, 0.12),
        color: tokens.palette.success.main,
      },
      standardError: {
        backgroundColor: alpha(tokens.palette.error.main, 0.12),
        color: tokens.palette.error.main,
      },
      standardWarning: {
        backgroundColor: alpha(tokens.palette.warning.main, 0.12),
        color: tokens.palette.warning.main,
      },
      standardInfo: {
        backgroundColor: alpha(tokens.palette.info.main, 0.12),
        color: tokens.palette.info.main,
      },
      filledSuccess: {
        backgroundColor: tokens.palette.success.main,
      },
      filledError: {
        backgroundColor: tokens.palette.error.main,
      },
      filledWarning: {
        backgroundColor: tokens.palette.warning.main,
      },
      filledInfo: {
        backgroundColor: tokens.palette.info.main,
      },
    },
  },
  MuiLinearProgress: {
    styleOverrides: {
      root: {
        borderRadius: 4,
        height: 6,
      },
      bar: {
        borderRadius: 4,
      },
    },
  },
  MuiCircularProgress: {
    styleOverrides: {
      root: {
        // Default styles
      },
    },
  },
  MuiSkeleton: {
    styleOverrides: {
      root: {
        backgroundColor: alpha(tokens.palette.text.primary, 0.08),
      },
      rounded: {
        borderRadius: 10,
      },
    },
  },
  MuiBackdrop: {
    styleOverrides: {
      root: {
        backgroundColor: alpha(tokens.palette.background.contrast, 0.5),
      },
    },
  },
});
