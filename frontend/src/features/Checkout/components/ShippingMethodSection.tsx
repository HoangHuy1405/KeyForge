import {
  Box,
  Paper,
  Typography,
  Stack,
  Radio,
  RadioGroup,
  FormControlLabel,
  useTheme,
  alpha,
} from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

export interface ShippingOption {
  id: string;
  label: string;
  price: number;
  eta: string;
  icon: string;
}

export const SHIPPING_OPTIONS: ShippingOption[] = [
  { id: 'economy', label: 'Economy Shipping', price: 5, eta: '5-7 business days', icon: '🚛' },
  { id: 'standard', label: 'Standard Shipping', price: 10, eta: '3-5 business days', icon: '📦' },
  { id: 'express', label: 'Express Shipping', price: 20, eta: '1-2 business days', icon: '⚡' },
];

interface ShippingMethodSectionProps {
  selected: string;
  onSelect: (id: string) => void;
}

export default function ShippingMethodSection({ 
  selected, 
  onSelect 
}: ShippingMethodSectionProps) {
  const theme = useTheme();

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 4, 
        borderRadius: 2, 
        border: `1px solid ${theme.palette.divider}`,
        flex: 1,
        minWidth: 0,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <LocalShippingIcon color="primary" sx={{ fontSize: 28 }} />
        <Typography variant="h5" fontWeight={700}>
          Shipping Method
        </Typography>
      </Stack>
      <RadioGroup
        value={selected}
        onChange={(e) => onSelect(e.target.value)}
      >
        <Stack spacing={2}>
          {SHIPPING_OPTIONS.map((option) => (
            <Paper
              key={option.id}
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 2,
                border: selected === option.id 
                  ? `2px solid ${theme.palette.primary.main}` 
                  : `1px solid ${theme.palette.divider}`,
                bgcolor: selected === option.id 
                  ? alpha(theme.palette.primary.main, 0.04)
                  : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  bgcolor: alpha(theme.palette.primary.main, 0.02),
                },
              }}
              onClick={() => onSelect(option.id)}
            >
              <FormControlLabel
                value={option.id}
                control={<Radio />}
                label={
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%', ml: 1.5 }}>
                    <Box>
                      <Typography variant="body1" fontWeight={600}>
                        {option.icon} {option.label}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Estimated delivery: {option.eta}
                      </Typography>
                    </Box>
                    <Typography variant="h6" fontWeight={700} color="primary.main">
                      ${option.price}
                    </Typography>
                  </Stack>
                }
                sx={{ m: 0, width: '100%' }}
              />
            </Paper>
          ))}
        </Stack>
      </RadioGroup>
    </Paper>
  );
}
