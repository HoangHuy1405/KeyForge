import * as React from 'react';
import {
  Box,
  Stack,
  IconButton,
  TextField,
  SxProps,
  Theme,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

export type QuantityControlProps = {
  value: number;
  min?: number; // default: 0
  max?: number; // default: Infinity
  onIncrease: () => void;
  onDecrease: () => void;
  disabled?: boolean; // disables both buttons
  size?: 'small' | 'medium'; // button/input sizing
  sx?: SxProps<Theme>; // optional style override for the outer Box
};

export default function QuantityControl({
  value,
  min = 0,
  max = Number.POSITIVE_INFINITY,
  onIncrease,
  onDecrease,
  disabled = false,
  size = 'small',
  sx,
}: QuantityControlProps) {
  const btnDim = size === 'small' ? 32 : 36;
  const inputWidth = size === 'small' ? 48 : 56;

  const decDisabled = disabled || value <= min;
  const incDisabled = disabled || value >= max;

  return (
    <Box sx={{ flexShrink: 0, ...sx }}>
      <Stack direction="row" alignItems="center" spacing={0.5}>
        {/* Decrease */}
        <IconButton
          aria-label="Decrease quantity"
          size={size}
          onClick={onDecrease}
          disabled={decDisabled}
          color="inherit"
          sx={(theme) => ({
            width: btnDim,
            height: btnDim,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
            backgroundColor:
              theme.palette.mode === 'light'
                ? theme.palette.common.white
                : theme.palette.background.paper,
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
            '&.Mui-disabled': {
              opacity: 0.9,
            },
          })}
        >
          <RemoveIcon fontSize="inherit" />
        </IconButton>

        {/* Value (read-only field for consistent height/spacing) */}
        <TextField
          inputProps={{
            inputMode: 'numeric',
            readOnly: true,
            'aria-label': 'Quantity',
          }}
          value={value}
          size={size}
          disabled={disabled}
          sx={{
            width: inputWidth,
            '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button':
              {
                WebkitAppearance: 'none',
                margin: 0,
              },
            '& input[type=number]': {
              MozAppearance: 'textfield',
              textAlign: 'center',
              fontVariantNumeric: 'tabular-nums',
              fontWeight: 600,
            },
            '& .MuiOutlinedInput-root': {
              height: btnDim,
              p: 0,
            },
          }}
        />

        {/* Increase */}
        <IconButton
          aria-label="Increase quantity"
          size={size}
          onClick={onIncrease}
          disabled={incDisabled}
          color="inherit"
          sx={(theme) => ({
            width: btnDim,
            height: btnDim,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
            backgroundColor:
              theme.palette.mode === 'light'
                ? theme.palette.common.white
                : theme.palette.background.paper,
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
            '&.Mui-disabled': {
              opacity: 0.9,
            },
          })}
        >
          <AddIcon fontSize="inherit" />
        </IconButton>
      </Stack>
    </Box>
  );
}
