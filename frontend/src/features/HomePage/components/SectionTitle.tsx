import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
}

/**
 * Reusable section title component with optional subtitle
 * Features gradient underline using theme colors
 */
const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  align = 'center',
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        textAlign: align,
        mb: 4,
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          color: 'text.primary',
          mb: 1,
          position: 'relative',
          display: 'inline-block',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -8,
            left: align === 'center' ? '50%' : align === 'right' ? 'auto' : 0,
            right: align === 'right' ? 0 : 'auto',
            transform: align === 'center' ? 'translateX(-50%)' : 'none',
            width: 60,
            height: 3,
            borderRadius: 2,
            background: theme.palette.primary.main,
          },
        }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            mt: 2,
            maxWidth: 600,
            mx: align === 'center' ? 'auto' : 0,
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};

export default SectionTitle;
