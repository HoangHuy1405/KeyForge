// src/components/LoadingButton.jsx
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

export default function LoadingButton({
  loading,
  startIcon,
  children,
  disabled,
  ...props
}) {
  return (
    <Button
      disabled={loading || disabled}
      startIcon={!loading && startIcon}
      {...props}
    >
      {loading && <CircularProgress size={18} sx={{ mr: 1 }} />}
      {children}
    </Button>
  );
}
