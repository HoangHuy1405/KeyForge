import {
  Paper,
  Typography,
  Stack,
  Divider,
  Button,
  useTheme,
} from '@mui/material';

interface OrderTotalSectionProps {
  subtotal: number;
  platformFee: number;
  shippingCost: number;
  total: number;
  itemCount: number;
  onPlaceOrder: () => void;
}

export default function OrderTotalSection({ 
  subtotal, 
  platformFee, 
  shippingCost, 
  total,
  itemCount,
  onPlaceOrder,
}: OrderTotalSectionProps) {
  const theme = useTheme();

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 4, 
        borderRadius: 2, 
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Stack 
        direction={{ xs: 'column', md: 'row' }} 
        justifyContent="space-between" 
        alignItems={{ xs: 'stretch', md: 'center' }}
        spacing={4}
      >
        {/* Breakdown */}
        <Stack spacing={1.5} sx={{ minWidth: 350 }}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body1" color="text.secondary">
              Subtotal ({itemCount} items)
            </Typography>
            <Typography variant="body1" fontWeight={500}>${subtotal.toFixed(2)}</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body1" color="text.secondary">Platform Fee (0.1%)</Typography>
            <Typography variant="body1" fontWeight={500}>${platformFee.toFixed(2)}</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body1" color="text.secondary">Shipping</Typography>
            <Typography variant="body1" fontWeight={500}>${shippingCost.toFixed(2)}</Typography>
          </Stack>
          <Divider sx={{ my: 1.5 }} />
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" fontWeight={700}>Order Total</Typography>
            <Typography variant="h4" fontWeight={700} color="primary">
              ${total.toFixed(2)}
            </Typography>
          </Stack>
        </Stack>

        {/* Place Order Button */}
        <Button
          variant="contained"
          size="large"
          onClick={onPlaceOrder}
          sx={{ 
            py: 2.5, 
            px: 8,
            fontWeight: 700,
            fontSize: '1.1rem',
            minWidth: 250,
            boxShadow: theme.shadows[6],
            '&:hover': {
              boxShadow: theme.shadows[10],
            },
          }}
        >
          Place Order
        </Button>
      </Stack>
    </Paper>
  );
}
