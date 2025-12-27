import React from 'react';
import { IconButton, Tooltip, useTheme } from '@mui/material';
import { DarkMode, LightMode } from '@mui/icons-material';
import { useColorMode } from '../theme/ThemeContext';

interface ThemeToggleProps {
  size?: 'small' | 'medium' | 'large';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ size = 'small' }) => {
  const { mode, toggleColorMode } = useColorMode();
  const theme = useTheme();

  return (
    <Tooltip title={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
      <IconButton
        onClick={toggleColorMode}
        size={size}
        sx={{
          color: 'text.primary',
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
        }}
        aria-label="toggle color mode"
      >
        {mode === 'light' ? (
          <DarkMode fontSize={size} />
        ) : (
          <LightMode fontSize={size} />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;
