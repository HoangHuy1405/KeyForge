// src/components/ThemedButton.jsx
import Button from '@mui/material/Button';
import ArrowBack from '@mui/icons-material/ArrowBack';

export default function ThemedButton({
  children,
  startIcon = <ArrowBack />,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  onClick,
  ...rest
}) {
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
}
