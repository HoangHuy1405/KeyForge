import { CartItem } from './CartItem';
import { toast } from 'react-toastify';
import { Grid, Stack, Typography, useTheme } from '@mui/material';
import StyledCheckbox from '../../components/StyledCheckbox';
import { CartSummary } from './CartSummary';
import { CartItemData, getCart } from '../../redux/slice/cartSlice';
import { useDispatch } from 'react-redux';
import { setAllSelected } from '../../redux/slice/cartSlice';
import { useAppSelector } from '../../hooks/hooks';

export default function Cart() {
  const cartItems = useAppSelector(getCart);
  const dispatch = useDispatch();

  const handleCheckout = () => {
    const selectedItems = cartItems.filter((item) => item.selected);
    if (selectedItems.length > 0) {
      toast.success('Proceeding to checkout...');
    }
  };

  const allSelected =
    cartItems.length > 0 && cartItems.every((item) => item.selected);

  return (
    <Grid
      container
      spacing={3}
      className="my-4 min-h-screen"
      sx={{
        width: '86%',
      }}
    >
      <Grid size={8}>
        {/* Header Row (one line) */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          sx={{
            borderRadius: 2,
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
            bgcolor: 'background.default',
            minWidth: 80,
            flexShrink: 0,
            mb: 3,
            px: 2,
            py: 1,
          }}
        >
          {/* Select All */}
          <StyledCheckbox
            checked={allSelected}
            onChange={(e: any) => dispatch(setAllSelected(e.target.checked))}
            bgColor="none"
          />

          {/* Product */}
          <Typography variant="subtitle2" sx={{ flex: 1, minWidth: 0 }}>
            Product
          </Typography>

          {/* Unit price */}
          <Typography
            variant="subtitle2"
            sx={{ minWidth: 80, textAlign: 'right' }}
          >
            Unit price
          </Typography>

          {/* Quantity (match CartItem control width) */}
          <Typography
            variant="subtitle2"
            sx={{ minWidth: 100, textAlign: 'center' }}
          >
            Quantity
          </Typography>

          {/* Total */}
          <Typography
            variant="subtitle2"
            sx={{ minWidth: 100, textAlign: 'center' }}
          >
            Total
          </Typography>

          {/* Actions */}
          <Typography
            variant="subtitle2"
            sx={{ minWidth: 60, textAlign: 'left' }}
          >
            Actions
          </Typography>
        </Stack>
        <div className="space-y-4">
          {cartItems.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>
      </Grid>
      <Grid size={4}>
        <CartSummary items={cartItems} onCheckout={handleCheckout} />
      </Grid>
    </Grid>
  );
}
