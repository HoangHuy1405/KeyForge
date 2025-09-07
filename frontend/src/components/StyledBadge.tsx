import { Badge, styled } from '@mui/material';

const StyledBadge = styled(Badge)(({ theme, right = -1, top = 28 }) => ({
  '& .MuiBadge-badge': {
    color: theme.palette.primary.main,
    right,
    top,
    border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
    padding: '8px 6px',
    background: theme.palette.primary.themeColor,
  },
}));

export default StyledBadge;
