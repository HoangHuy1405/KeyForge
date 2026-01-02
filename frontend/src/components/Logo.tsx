import React from 'react';
import { Box, useTheme } from '@mui/material';
import { Keyboard } from 'lucide-react';

interface LogoProps {
  size?: number;
  showIcon?: boolean;
}

/**
 * KeyForge Logo Component
 * A clean, professional logo using the Keyboard icon
 */
const Logo: React.FC<LogoProps> = ({ size = 32, showIcon = true }) => {
  const theme = useTheme();

  if (!showIcon) {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: 1.5,
        bgcolor: theme.palette.primary.main,
        color: '#fff',
      }}
    >
      <Keyboard size={size * 0.6} strokeWidth={2.5} />
    </Box>
  );
};

export default Logo;
