import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Stack,
  Button,
  Divider,
  useTheme,
} from '@mui/material';
import { useAppSelector } from '../../hooks/hooks';
import { getCart } from '../../redux/slice/cartSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

// Extracted components
import DeliveryAddressSection from './components/DeliveryAddressSection';
import OrderSummaryTable from './components/OrderSummaryTable';
import ShippingMethodSection, { SHIPPING_OPTIONS } from './components/ShippingMethodSection';
import PaymentMethodSection from './components/PaymentMethodSection';
import OrderTotalSection from './components/OrderTotalSection';

interface DeliveryAddress {
  fullname: string;
  phoneNumber: string;
  address: string;
}

export default function CheckoutPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const cartItems = useAppSelector(getCart);
  const user = useAppSelector((state) => state.account.user);
  
  // Get selected items only
  const selectedItems = cartItems.filter((item) => item.selected);
  
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  
  // Delivery Address State - initialized from Redux
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({
    fullname: user.fullname || '',
    phoneNumber: user.phoneNumber || '',
    address: user.address || '',
  });

  // ⭐ Fix: Sync delivery address when user data changes (e.g., after page refresh)
  useEffect(() => {
    // Only update if user data is now available and deliveryAddress is empty
    if (user.fullname || user.address || user.phoneNumber) {
      setDeliveryAddress((prev) => ({
        fullname: prev.fullname || user.fullname || '',
        phoneNumber: prev.phoneNumber || user.phoneNumber || '',
        address: prev.address || user.address || '',
      }));
    }
  }, [user.fullname, user.phoneNumber, user.address]);
  
  // Calculations
  const subtotal = selectedItems.reduce(
    (total, item) => total + item.unitPrice * item.quantity,
    0
  );
  const platformFee = subtotal * 0.001; // 0.1% fee
  const shippingCost = SHIPPING_OPTIONS.find(opt => opt.id === shippingMethod)?.price || 0;
  const total = subtotal + platformFee + shippingCost;

  // Empty cart state
  if (selectedItems.length === 0) {
    return (
      <Box sx={{ py: 10, textAlign: 'center' }}>
        <ShoppingBagIcon sx={{ fontSize: 100, color: 'text.disabled', mb: 3 }} />
        <Typography variant="h4" fontWeight={600} gutterBottom>
          No items selected for checkout
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Please select items from your cart to proceed with checkout.
        </Typography>
        <Button 
          variant="contained" 
          size="large"
          onClick={() => navigate('/cart')}
          startIcon={<ArrowBackIcon />}
        >
          Return to Cart
        </Button>
      </Box>
    );
  }

  const handlePlaceOrder = () => {
    if (!deliveryAddress.fullname || !deliveryAddress.phoneNumber || !deliveryAddress.address) {
      toast.error('Please provide a complete delivery address');
      return;
    }
    
    if (paymentMethod === 'vnpay') {
      toast.info('Redirecting to VNPay...');
    } else if (paymentMethod === 'card') {
      toast.info('Redirecting to payment gateway...');
    } else {
      toast.success('Order placed successfully! You will receive a confirmation shortly.');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', p: 6, width: '100%' }}>
      {/* Header */}
      <Box 
        sx={{ 
          borderBottom: `1px solid ${theme.palette.divider}`,
          mb: 4,
        }}
      >
        <Container maxWidth={false} sx={{ maxWidth: 1600, mx: 'auto', px: { xs: 2, md: 4 } }}>
          <Stack direction="row" alignItems="center" spacing={3}>
            <Button 
              startIcon={<ArrowBackIcon />} 
              onClick={() => navigate('/cart')}
              color="inherit"
              size="large"
            >
              Back to Cart
            </Button>
            <Divider orientation="vertical" flexItem />
            <Typography variant="h4" fontWeight={700} color="primary">
              Checkout
            </Typography>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth={false} sx={{ maxWidth: 1600, mx: 'auto', px: { xs: 2, md: 4 } }}>
        {/* Delivery Address Section */}
        <DeliveryAddressSection 
          address={deliveryAddress}
          onAddressChange={setDeliveryAddress}
        />

        {/* Order Summary Table */}
        <OrderSummaryTable items={selectedItems} />

        {/* Shipping & Payment - Side by Side */}
        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={4} sx={{ mb: 4 }}>
          <ShippingMethodSection 
            selected={shippingMethod}
            onSelect={setShippingMethod}
          />
          <PaymentMethodSection 
            selected={paymentMethod}
            onSelect={setPaymentMethod}
          />
        </Stack>

        {/* Total Section */}
        <OrderTotalSection 
          subtotal={subtotal}
          platformFee={platformFee}
          shippingCost={shippingCost}
          total={total}
          itemCount={selectedItems.length}
          onPlaceOrder={handlePlaceOrder}
        />
      </Container>
    </Box>
  );
}
