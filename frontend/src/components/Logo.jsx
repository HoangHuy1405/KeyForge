import { useTheme } from '@mui/material';

function Logo({ size = 40 }) {
  const fontSize = size * 0.4; // scale text relative to box size
  const theme = useTheme();

  return (
    <div
      className="flex items-center justify-center rounded-xl bg-gradient-to-br"
      style={{
        width: size,
        height: size,
        fontSize: fontSize,
        background: theme.palette.primary.themeColor,
      }}
    >
      <span className="font-bold text-white">B</span>
    </div>
  );
}

export default Logo;
