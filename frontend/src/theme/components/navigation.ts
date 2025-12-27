import { Components, Theme, alpha } from '@mui/material/styles';
import { DesignTokens } from '../palette';

// ============================================================================
// Navigation Components: Tabs, Menu, Link, Drawer, Breadcrumbs, Pagination
// ============================================================================

export const getNavigationOverrides = (tokens: DesignTokens): Components<Theme> => ({
  MuiTabs: {
    styleOverrides: {
      indicator: {
        height: 3,
        borderRadius: '3px 3px 0 0',
      },
    },
  },
  MuiTab: {
    styleOverrides: {
      root: {
        fontWeight: 500,
        textTransform: 'none',
        minWidth: 'auto',
        padding: '12px 20px',
        '&.Mui-selected': {
          color: tokens.palette.primary.main,
        },
      },
    },
  },
  MuiMenu: {
    styleOverrides: {
      paper: {
        marginTop: 8,
        borderRadius: 12,
        boxShadow: `0 8px 24px ${alpha(tokens.palette.text.primary, 0.15)}`,
      },
    },
  },
  MuiMenuItem: {
    styleOverrides: {
      root: {
        padding: '10px 16px',
        borderRadius: 8,
        margin: '2px 8px',
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
  MuiLink: {
    defaultProps: {
      underline: 'hover',
    },
    styleOverrides: {
      root: {
        color: tokens.palette.primary.main,
        fontWeight: 500,
        transition: 'color 0.2s ease',
        '&:hover': {
          color: tokens.palette.primary.dark,
        },
      },
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: {
        borderRight: `1px solid ${alpha(tokens.palette.text.primary, 0.08)}`,
        backgroundImage: 'none',
      },
    },
  },
  MuiBreadcrumbs: {
    styleOverrides: {
      separator: {
        color: tokens.palette.text.secondary,
      },
      li: {
        '& .MuiTypography-root': {
          fontSize: '0.875rem',
        },
        '& .MuiLink-root': {
          color: tokens.palette.text.secondary,
          '&:hover': {
            color: tokens.palette.primary.main,
          },
        },
      },
    },
  },
  MuiPagination: {
    styleOverrides: {
      root: {
        '& .MuiPaginationItem-root': {
          borderRadius: 8,
        },
      },
    },
  },
  MuiPaginationItem: {
    styleOverrides: {
      root: {
        '&.Mui-selected': {
          backgroundColor: tokens.palette.primary.main,
          color: tokens.palette.primary.contrastText,
          '&:hover': {
            backgroundColor: tokens.palette.primary.dark,
          },
        },
      },
    },
  },
  MuiBottomNavigation: {
    styleOverrides: {
      root: {
        backgroundColor: tokens.palette.background.paper,
        borderTop: `1px solid ${alpha(tokens.palette.text.primary, 0.08)}`,
      },
    },
  },
  MuiBottomNavigationAction: {
    styleOverrides: {
      root: {
        color: tokens.palette.text.secondary,
        '&.Mui-selected': {
          color: tokens.palette.primary.main,
        },
      },
    },
  },
  MuiStepLabel: {
    styleOverrides: {
      label: {
        '&.Mui-active': {
          fontWeight: 600,
        },
      },
    },
  },
  MuiStepIcon: {
    styleOverrides: {
      root: {
        '&.Mui-active': {
          color: tokens.palette.primary.main,
        },
        '&.Mui-completed': {
          color: tokens.palette.success.main,
        },
      },
    },
  },
});
