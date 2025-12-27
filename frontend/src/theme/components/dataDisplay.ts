import { Components, Theme, alpha } from '@mui/material/styles';
import { DesignTokens } from '../palette';

// ============================================================================
// Data Display Components: Table, List, Chip, Avatar, Badge, Typography
// ============================================================================

export const getDataDisplayOverrides = (tokens: DesignTokens): Components<Theme> => ({
  MuiTableContainer: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        border: `1px solid ${alpha(tokens.palette.text.primary, 0.08)}`,
      },
    },
  },
  MuiTableHead: {
    styleOverrides: {
      root: {
        backgroundColor: alpha(tokens.palette.text.primary, 0.04),
        '& .MuiTableCell-head': {
          fontWeight: 600,
          color: tokens.palette.text.secondary,
          borderBottom: `1px solid ${alpha(tokens.palette.text.primary, 0.1)}`,
        },
      },
    },
  },
  MuiTableRow: {
    styleOverrides: {
      root: {
        transition: 'background-color 0.15s ease',
        '&:hover': {
          backgroundColor: alpha(tokens.palette.primary.main, 0.04),
        },
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: {
        borderBottom: `1px solid ${alpha(tokens.palette.text.primary, 0.06)}`,
        padding: '14px 16px',
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        fontWeight: 500,
      },
      filled: {
        '&.MuiChip-colorDefault': {
          backgroundColor: alpha(tokens.palette.text.primary, 0.08),
        },
      },
      outlined: {
        borderColor: alpha(tokens.palette.text.primary, 0.23),
      },
    },
    variants: [
      {
        props: { variant: 'soft' as any },
        style: {
          backgroundColor: alpha(tokens.palette.primary.main, 0.12),
          color: tokens.palette.primary.main,
        },
      },
      {
        props: { variant: 'soft' as any, color: 'success' },
        style: {
          backgroundColor: alpha(tokens.palette.success.main, 0.12),
          color: tokens.palette.success.main,
        },
      },
      {
        props: { variant: 'soft' as any, color: 'error' },
        style: {
          backgroundColor: alpha(tokens.palette.error.main, 0.12),
          color: tokens.palette.error.main,
        },
      },
      {
        props: { variant: 'soft' as any, color: 'warning' },
        style: {
          backgroundColor: alpha(tokens.palette.warning.main, 0.12),
          color: tokens.palette.warning.main,
        },
      },
      {
        props: { variant: 'soft' as any, color: 'info' },
        style: {
          backgroundColor: alpha(tokens.palette.info.main, 0.12),
          color: tokens.palette.info.main,
        },
      },
    ],
  },
  MuiAvatar: {
    styleOverrides: {
      root: {
        border: `2px solid ${tokens.palette.background.paper}`,
      },
      colorDefault: {
        backgroundColor: alpha(tokens.palette.primary.main, 0.12),
        color: tokens.palette.primary.main,
      },
    },
  },
  MuiAvatarGroup: {
    styleOverrides: {
      root: {
        '& .MuiAvatar-root': {
          borderColor: tokens.palette.background.paper,
        },
      },
    },
  },
  MuiBadge: {
    styleOverrides: {
      standard: {
        fontWeight: 600,
      },
      colorPrimary: {
        background: tokens.palette.gradient,
      },
    },
  },
  MuiTypography: {
    styleOverrides: {
      gutterBottom: {
        marginBottom: '0.5em',
      },
    },
  },
  MuiDivider: {
    styleOverrides: {
      root: {
        borderColor: alpha(tokens.palette.text.primary, 0.1),
      },
    },
  },
  MuiList: {
    styleOverrides: {
      root: {
        padding: '8px',
      },
    },
  },
  MuiListItem: {
    styleOverrides: {
      root: {
        borderRadius: 8,
      },
    },
  },
  MuiListItemButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        '&:hover': {
          backgroundColor: alpha(tokens.palette.primary.main, 0.08),
        },
        '&.Mui-selected': {
          backgroundColor: alpha(tokens.palette.primary.main, 0.12),
          '&:hover': {
            backgroundColor: alpha(tokens.palette.primary.main, 0.16),
          },
        },
      },
    },
  },
  MuiListItemIcon: {
    styleOverrides: {
      root: {
        minWidth: 40,
        color: tokens.palette.text.secondary,
      },
    },
  },
});
