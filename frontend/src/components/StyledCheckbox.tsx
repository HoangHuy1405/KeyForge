import React, { ChangeEvent } from 'react';
import { Checkbox, useTheme } from '@mui/material';

interface StyledCheckboxProps {
  checked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  bgColor?: string;
}

const StyledCheckbox: React.FC<StyledCheckboxProps> = ({ 
  checked, 
  onChange, 
  bgColor = 'transparent' 
}) => {
  const theme = useTheme();

  return (
    <Checkbox
      checked={checked}
      onChange={onChange}
      sx={{
        flexShrink: 0,
        color: theme.palette.grey[500],
        '&.Mui-checked': {
          color: theme.palette.text.primary,
        },
        '& .MuiSvgIcon-root': {
          backgroundColor: bgColor === 'none' ? 'transparent' : bgColor,
          borderRadius: '4px',
        },
      }}
    />
  );
};

export default StyledCheckbox;
