import React, { ReactNode } from 'react';
import { Badge, styled, BadgeProps, useTheme } from '@mui/material';

interface StyledBadgeProps extends Omit<BadgeProps, 'sx'> {
  top?: number;
  right?: number;
  children: ReactNode;
}

const StyledBadgeRoot = styled(Badge)<{ ownerState: { top: number; right: number } }>(
  ({ theme, ownerState }) => {
    const gradient = theme.palette.gradient;

    return {
      '& .MuiBadge-badge': {
        color: theme.palette.primary.contrastText,
        right: ownerState.right,
        top: ownerState.top,
        border: `2px solid ${theme.palette.background.paper}`,
        padding: '8px 6px',
        background: gradient,
      },
    };
  }
);

const StyledBadge: React.FC<StyledBadgeProps> = ({ 
  top = 28, 
  right = -1, 
  children, 
  ...props 
}) => {
  return (
    <StyledBadgeRoot ownerState={{ top, right }} {...props}>
      {children}
    </StyledBadgeRoot>
  );
};

export default StyledBadge;
