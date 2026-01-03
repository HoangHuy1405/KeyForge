import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Stack,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Chip,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import OrderTimeline from './components/OrderTimeline';
import {
  OrderDetailResponseDto,
  OrderStatus,
  PaymentStatus,
  getOrderDetail,
} from '../../services/OrderService';

// Status badge colors
const getStatusColor = (status: OrderStatus): 'warning' | 'info' | 'success' | 'error' | 'default' => {
  switch (status) {
    case OrderStatus.PENDING:
      return 'warning';
    case OrderStatus.CONFIRMED:
      return 'info';
    case OrderStatus.SHIPPED:
      return 'info';
    case OrderStatus.DELIVERED:
      return 'success';
    case OrderStatus.CANCELLED:
      return 'error';
    default:
      return 'default';
  }
};

const getStatusLabel = (status: OrderStatus): string => {
  switch (status) {
    case OrderStatus.PENDING:
      return 'Pending';
    case OrderStatus.CONFIRMED:
      return 'Processing';
    case OrderStatus.SHIPPED:
      return 'Shipping';
    case OrderStatus.DELIVERED:
      return 'Delivered';
    case OrderStatus.CANCELLED:
      return 'Cancelled';
    default:
      return status;
  }
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetailResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        setError(null);
        const response = await getOrderDetail(id);
        console.log(response)
        setOrder(response);
      } catch (err) {
        console.error('Failed to fetch order:', err);
        setError('Failed to load order details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  // Calculate subtotal
  const subtotal = order?.items.reduce((sum, item) => sum + (item.subtotal ?? 0), 0) ?? 0;

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !order) {
    return (
      <Box sx={{ maxWidth: 900, mx: 'auto' }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Order not found'}
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/user/orders')}
        >
          Back to Orders
        </Button>
      </Box>
    );
  }


  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/user/orders')}
          color="inherit"
        >
          Back
        </Button>
        <Typography variant="h5" fontWeight={700}>
          Order Details
        </Typography>
        <Chip
          label={getStatusLabel(order.orderStatus)}
          color={getStatusColor(order.orderStatus)}
          size="small"
        />
        {order.paymentStatus === PaymentStatus.PAID && (
          <Chip label="Paid" color="success" size="small" variant="outlined" />
        )}
      </Stack>

      {/* Order ID */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Order ID: {order.orderId}
      </Typography>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        {/* Left Column - Timeline & Shipping Info */}
        <Box sx={{ flex: 1 }}>
          {/* Timeline Section */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: (theme) => `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              mb: 3,
            }}
          >
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              Order Progress
            </Typography>
            <OrderTimeline order={order} />
          </Paper>

          {/* Shipping Info Section */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: (theme) => `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
              <LocalShippingIcon color="primary" />
              <Typography variant="h6" fontWeight={600}>
                Shipping Information
              </Typography>
            </Stack>

            <Stack spacing={1.5}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <PersonIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                <Typography variant="body1">{order.receiverName}</Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <PhoneIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                <Typography variant="body1">{order.receiverPhone}</Typography>
              </Stack>
              <Stack direction="row" alignItems="flex-start" spacing={1.5}>
                <LocationOnIcon sx={{ fontSize: 20, color: 'text.secondary', mt: 0.25 }} />
                <Typography variant="body1">{order.shippingAddress}</Typography>
              </Stack>
            </Stack>
          </Paper>
        </Box>

        {/* Right Column - Products & Total */}
        <Box sx={{ flex: 1 }}>
          {/* Products Section */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: (theme) => `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              mb: 3,
            }}
          >
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              Products
            </Typography>

            <Stack spacing={2} divider={<Divider />}>
              {order.items.map((item, index) => (
                <Stack
                  key={`${item.productId}-${index}`}
                  direction="row"
                  alignItems="center"
                  spacing={2}
                >
                  {/* Product Thumbnail */}
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: 1,
                      overflow: 'hidden',
                      border: (theme) => `1px solid ${theme.palette.divider}`,
                      flexShrink: 0,
                      bgcolor: 'grey.100',
                    }}
                  >
                    <Box
                      component="img"
                      src={item.thumbnailUrl || `https://placehold.co/64x64/e2e8f0/64748b?text=${encodeURIComponent(item.productName.charAt(0))}`}
                      alt={item.productName}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </Box>

                  {/* Product Info */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="body1"
                      fontWeight={500}
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.productName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ${(item.unitPrice ?? 0).toFixed(2)} × {item.quantity}
                    </Typography>
                  </Box>

                  {/* Subtotal */}
                  <Typography variant="body1" fontWeight={500} sx={{ flexShrink: 0 }}>
                    ${(item.subtotal ?? 0).toFixed(2)}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Paper>

          {/* Order Total Section */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: (theme) => `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              bgcolor: (theme) => theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50',
            }}
          >
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              Order Summary
            </Typography>

            <Stack spacing={1.5}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body1" color="text.secondary">
                  Subtotal ({order.items.length} items)
                </Typography>
                <Typography variant="body1">${subtotal.toFixed(2)}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body1" color="text.secondary">
                  Shipping Fee
                </Typography>
                <Typography variant="body1">
                  ${(order.shippingFee ?? 0).toFixed(2)}
                </Typography>
              </Stack>
              <Divider sx={{ my: 1 }} />
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" fontWeight={600}>
                  Total
                </Typography>
                <Typography variant="h5" fontWeight={700} color="primary.main">
                  ${(order.totalAmount ?? 0).toFixed(2)}
                </Typography>
              </Stack>
            </Stack>
          </Paper>
        </Box>
      </Stack>
    </Box>
  );
}
