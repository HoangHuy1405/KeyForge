import * as React from 'react';
import Button, { ButtonProps } from '@mui/material/Button';

type StyledButtonProps = Omit<ButtonProps, 'color'> & {
  color?: Extract<ButtonProps['color'], 'primary' | 'secondary'>; // default 'primary'
};

const PRIMARY_GRADIENT = 'linear-gradient(to bottom right, #3b82f6, #a855f7)';
const PRIMARY_GRADIENT_HOVER =
  'linear-gradient(to bottom right, #2563eb, #9333ea)';

export const StyledButton: React.FC<StyledButtonProps> = ({
  color = 'primary',
  variant = 'contained',
  fullWidth = true,
  sx,
  children,
  ...props
}) => {
  const isSecondary = color === 'secondary';
  const effectiveVariant = isSecondary ? 'outlined' : variant;

  const generatedSx = (theme: any) => ({
    borderRadius: 2,
    fontWeight: 700,
    textTransform: 'none',

    // Primary contained -> keep your gradient
    ...(effectiveVariant === 'contained' &&
      color === 'primary' && {
        background: PRIMARY_GRADIENT,
        color: '#eceef2',
        '&:hover': { background: PRIMARY_GRADIENT_HOVER },
        '&:disabled': {
          background: theme.palette.action.disabledBackground,
          color: theme.palette.action.disabled,
        },
      }),

    // Secondary outlined -> darker outline, black text, gray hover bg
    ...(isSecondary && {
      color: theme.palette.common.black,
      borderColor: theme.palette.grey[500],
      borderWidth: 2,
      '&:hover': {
        backgroundColor: theme.palette.grey[400],
        borderColor: theme.palette.grey[500],
      },
      '&:disabled': {
        borderColor: theme.palette.action.disabledBackground,
        color: theme.palette.text.disabled,
      },
    }),
  });

  return (
    <Button
      color={color}
      variant={effectiveVariant}
      fullWidth={fullWidth}
      sx={[generatedSx]}
      {...props}
    >
      {children}
    </Button>
  );
};
