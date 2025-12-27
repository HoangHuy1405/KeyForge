// src/components/ThemedButton.tsx
import React, { ReactNode } from 'react';
import Button, { ButtonProps } from '@mui/material/Button';
import ArrowBack from '@mui/icons-material/ArrowBack';

interface ThemedButtonProps extends Omit<ButtonProps, 'startIcon'> {
  children: ReactNode;
  startIcon?: ReactNode;
}

const ThemedButton: React.FC<ThemedButtonProps> = ({
  children,
  startIcon = <ArrowBack />,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  onClick,
  ...rest
}) => {
  return (
    <Button
      startIcon={startIcon}
      variant={variant}
      color={color}
      size={size}
      onClick={onClick}
      {...rest}
    >
      {children}
    </Button>
  );
};

export default ThemedButton;
