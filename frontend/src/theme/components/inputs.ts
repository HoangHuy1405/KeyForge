import { Components, Theme, alpha } from '@mui/material/styles';
import { DesignTokens } from '../palette';

// ============================================================================
// Input Components: TextField, Select, Checkbox, Switch, Radio
// ============================================================================

export const getInputOverrides = (tokens: DesignTokens): Components<Theme> => ({
  MuiTextField: {
    defaultProps: {
      variant: 'outlined',
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: 10,
        backgroundColor: tokens.palette.input_background,
        transition: 'all 0.2s ease',
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: tokens.palette.primary.main,
        },
        '&.Mui-focused': {
          backgroundColor: tokens.palette.background.paper,
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: tokens.palette.primary.main,
          borderWidth: 2,
        },
      },
      notchedOutline: {
        borderColor: alpha(tokens.palette.text.primary, 0.15),
      },
      input: {
        padding: '14px 16px',
      },
    },
  },
  MuiInputLabel: {
    styleOverrides: {
      root: {
        color: tokens.palette.text.secondary,
        '&.Mui-focused': {
          color: tokens.palette.primary.main,
        },
      },
    },
  },
  MuiFilledInput: {
    styleOverrides: {
      root: {
        borderRadius: '10px 10px 0 0',
        backgroundColor: tokens.palette.input_background,
        '&:hover': {
          backgroundColor: alpha(tokens.palette.input_background, 0.8),
        },
        '&.Mui-focused': {
          backgroundColor: tokens.palette.input_background,
        },
      },
    },
  },
  MuiSelect: {
    styleOverrides: {
      select: {
        borderRadius: 10,
      },
    },
  },
  MuiCheckbox: {
    styleOverrides: {
      root: {
        color: tokens.palette.grey[400],
        '&.Mui-checked': {
          color: tokens.palette.primary.main,
        },
      },
    },
  },
  MuiSwitch: {
    styleOverrides: {
      root: {
        width: 42,
        height: 26,
        padding: 0,
      },
      switchBase: {
        padding: 1,
        '&.Mui-checked': {
          transform: 'translateX(16px)',
          color: '#fff',
          '& + .MuiSwitch-track': {
            backgroundColor: tokens.palette.primary.main,
            opacity: 1,
          },
        },
      },
      thumb: {
        width: 24,
        height: 24,
      },
      track: {
        borderRadius: 13,
        backgroundColor: tokens.palette.grey[300],
        opacity: 1,
      },
    },
  },
  MuiRadio: {
    styleOverrides: {
      root: {
        color: tokens.palette.grey[400],
        '&.Mui-checked': {
          color: tokens.palette.primary.main,
        },
      },
    },
  },
  MuiSlider: {
    styleOverrides: {
      root: {
        '& .MuiSlider-thumb': {
          '&:hover, &.Mui-focusVisible': {
            boxShadow: `0 0 0 8px ${alpha(tokens.palette.primary.main, 0.16)}`,
          },
        },
      },
      track: {
        height: 4,
      },
      rail: {
        height: 4,
        backgroundColor: tokens.palette.grey[300],
      },
    },
  },
  MuiAutocomplete: {
    styleOverrides: {
      paper: {
        borderRadius: 12,
        marginTop: 4,
        boxShadow: `0 8px 24px ${alpha(tokens.palette.text.primary, 0.15)}`,
      },
      option: {
        borderRadius: 8,
        margin: '2px 8px',
        '&:hover': {
          backgroundColor: alpha(tokens.palette.primary.main, 0.08),
        },
      },
    },
  },
});
