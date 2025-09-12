// Logo.tsx
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

type Props = { size?: number };

export default function Logo({ size = 40 }: Props) {
  const theme = useTheme();

  // Pull colors from theme
  const brand = theme.palette.primary?.main ?? '#3b82f6';
  const brand2 = theme.palette.secondary?.main ?? brand;

  // Prefer a dedicated gradient token if you defined it in the theme:
  // palette.gradient: `linear-gradient(135deg, ${BRAND}, ${BRAND_2})`
  const gradientFromTheme = (theme.palette as any).gradient as
    | string
    | undefined;

  const gradient =
    gradientFromTheme && gradientFromTheme.includes('linear-gradient')
      ? gradientFromTheme
      : `linear-gradient(135deg, ${brand}, ${brand2})`;

  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: 2, // = 16px by default
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // Ensure gradient shows even if other styles exist
        backgroundColor: brand, // solid fallback
        backgroundImage: gradient, // actual gradient
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%',
      }}
    >
      <Typography
        component="span"
        sx={{
          fontWeight: 700,
          fontSize: size * 0.4,
          color: theme.palette.primary.contrastText ?? '#fff',
          lineHeight: 1,
        }}
      >
        B
      </Typography>
    </Box>
  );
}
