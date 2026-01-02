import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Divider,
  Stack,
  Box,
  Button,
} from '@mui/material';
import { CartItemData } from '../../redux/slice/cartSlice';

interface CartSummaryProps {
  items: CartItemData[];
  onCheckout: () => void;
}

export function CartSummary({ items, onCheckout }: CartSummaryProps) {
  const selectedItems = items.filter((item) => item.selected);
  const subtotal = selectedItems.reduce(
    (total, item) => total + item.unitPrice * item.quantity,
    0,
  );
  const tax = subtotal * 0.1; // 10% tax
  const shipping = selectedItems.length > 0 ? 9.99 : 0;
  const total = subtotal + tax + shipping;

  return (
    <Card
      sx={{
        width: '100%',
        maxWidth: 400,
        borderRadius: 2,
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
      }}
    >
      <CardHeader
        title={
          <Typography variant="h6" fontWeight="bold">
            Order Summary
          </Typography>
        }
      />
      <CardContent>
        {/* Selected Items */}
        <Box mb={2}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Selected Items ({selectedItems.length})
          </Typography>
          <Stack spacing={0.5}>
            {selectedItems.map((item) => (
              <Stack
                key={item.id}
                direction="row"
                justifyContent="space-between"
              >
                <Typography
                  variant="body2"
                  noWrap
                  sx={{ maxWidth: 200 }}
                  title={item.name}
                >
                  {item.name} × {item.quantity}
                </Typography>
                <Typography variant="body2">
                  ${(item.unitPrice * item.quantity).toFixed(2)}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Subtotal, Tax, Shipping */}
        <Stack spacing={0.5} mb={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2">Subtotal</Typography>
            <Typography variant="body2">${subtotal.toFixed(2)}</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2">Tax</Typography>
            <Typography variant="body2">${tax.toFixed(2)}</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2">Shipping</Typography>
            <Typography variant="body2">
              {selectedItems.length > 0 ? `$${shipping.toFixed(2)}` : 'Free'}
            </Typography>
          </Stack>
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* Total */}
        <Stack direction="row" justifyContent="space-between" mb={2}>
          <Typography variant="subtitle1" fontWeight="bold">
            Total
          </Typography>
          <Typography variant="subtitle1" fontWeight="bold">
            ${total.toFixed(2)}
          </Typography>
        </Stack>

        {/* Checkout Button */}
        <Button 
          variant="contained"
          size="large"
          onClick={onCheckout}
          sx={{
            width: '100%',
            mt: 2,
          }}
        >
          Proceed to checkout
        </Button>
      </CardContent>
    </Card>
  );
}
