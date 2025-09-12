import { Badge, styled } from '@mui/material';

const StyledBadge = styled(Badge)(({ theme, right = -1, top = 28 }) => {
  const gradient =
    theme.palette.gradient || // preferred token if defined in theme
    theme.palette?.primary?.themeColor || // legacy custom key (if you kept it)
    `linear-gradient(135deg, ${theme.palette.primary.main}, ${
      theme.palette.secondary?.main || theme.palette.primary.main
    })`; // fallback: BRAND → BRAND_2

  return {
    '& .MuiBadge-badge': {
      color: theme.palette.primary.contrastText, // keep number color as-is
      right,
      top,
      border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
      padding: '8px 6px',
      background: gradient, // brand gradient
    },
  };
});

export default StyledBadge;
