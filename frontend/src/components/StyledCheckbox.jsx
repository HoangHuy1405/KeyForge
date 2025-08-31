import { Checkbox } from '@mui/material';

function StyledCheckbox({ checked, onChange, bgColor = '#ffffff' }) {
  return (
    <Checkbox
      checked={checked}
      onChange={onChange}
      sx={{
        flexShrink: 0,
        color: '#9e9e9e', // grey for border & unchecked state
        '&.Mui-checked': {
          color: '#000000', // black when checked
        },
        '& .MuiSvgIcon-root': {
          backgroundColor: bgColor, // always white background
          borderRadius: '4px',
        },
      }}
    />
  );
}

export default StyledCheckbox;
