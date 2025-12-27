// src/components/LoadingButton.tsx
import React, { ReactNode } from 'react';
import Button, { ButtonProps } from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
  children: ReactNode;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading = false,
  startIcon,
  children,
  disabled,
  ...props
}) => {
  return (
    <Button
      disabled={loading || disabled}
      startIcon={!loading ? startIcon : undefined}
      {...props}
    >
      {loading && <CircularProgress size={18} sx={{ mr: 1 }} color="inherit" />}
      {children}
    </Button>
  );
};

export default LoadingButton;
