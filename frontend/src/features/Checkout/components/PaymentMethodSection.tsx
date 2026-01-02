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
import PaymentIcon from '@mui/icons-material/Payment';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { ReactNode } from 'react';

export interface PaymentOption {
  id: string;
  label: string;
  description: string;
  icon: ReactNode;
  color: string;
}

export const PAYMENT_OPTIONS: PaymentOption[] = [
  { 
    id: 'vnpay', 
    label: 'VNPay Wallet', 
    description: 'Pay securely via VNPay',
    icon: <AccountBalanceWalletIcon />,
    color: '#1976d2'
  },
  { 
    id: 'card', 
    label: 'Credit / Debit Card', 
    description: 'Visa, Mastercard, JCB',
    icon: <CreditCardIcon />,
    color: '#9c27b0'
  },
  { 
    id: 'cod', 
    label: 'Cash on Delivery', 
    description: 'Pay when you receive',
    icon: <LocalAtmIcon />,
    color: '#2e7d32'
  },
];

interface PaymentMethodSectionProps {
  selected: string;
  onSelect: (id: string) => void;
}

export default function PaymentMethodSection({ 
  selected, 
  onSelect 
}: PaymentMethodSectionProps) {
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
        <PaymentIcon color="primary" sx={{ fontSize: 28 }} />
        <Typography variant="h5" fontWeight={700}>
          Payment Method
        </Typography>
      </Stack>
      <RadioGroup
        value={selected}
        onChange={(e) => onSelect(e.target.value)}
      >
        <Stack spacing={2}>
          {PAYMENT_OPTIONS.map((option) => (
            <Paper
              key={option.id}
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 2,
                border: selected === option.id 
                  ? `2px solid ${option.color}` 
                  : `1px solid ${theme.palette.divider}`,
                bgcolor: selected === option.id 
                  ? alpha(option.color, 0.04)
                  : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: option.color,
                  bgcolor: alpha(option.color, 0.02),
                },
              }}
              onClick={() => onSelect(option.id)}
            >
              <FormControlLabel
                value={option.id}
                control={<Radio />}
                label={
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ ml: 1.5, width: '100%' }}>
                    <Box sx={{ color: option.color, display: 'flex' }}>
                      {option.icon}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1" fontWeight={600}>{option.label}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {option.description}
                      </Typography>
                    </Box>
                    {selected === option.id && (
                      <CheckCircleIcon sx={{ color: option.color, fontSize: 24 }} />
                    )}
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
