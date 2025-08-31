import * as React from 'react';
import Button, { ButtonProps } from '@mui/material/Button';

export const StyledButton: React.FC<ButtonProps> = ({
  onClick,
  children,
  sx,
  ...props
}) => {
  return (
    <Button
      variant="contained"
      fullWidth
      onClick={onClick}
      sx={{
        borderRadius: 10,
        fontWeight: 700,
        background: 'linear-gradient(to bottom right, #3b82f6, #a855f7)',
        color: '#eceef2',
        textTransform: 'none',
        '&:hover': {
          background: 'linear-gradient(to bottom right, #2563eb, #9333ea)',
        },
        ...(sx || {}), // ✅ make sx optional
      }}
      {...props}
    >
      {children}
    </Button>
  );
};
