import { Box, Paper, Typography, Stack, Button, Chip, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { OrderListItemDto, OrderStatus, PaymentStatus } from '../../../services/OrderService';
import StorefrontIcon from '@mui/icons-material/Storefront';

interface OrderCardProps {
  order: OrderListItemDto;
}

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

// Human-readable status labels
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

export default function OrderCard({ order }: OrderCardProps) {
  const navigate = useNavigate();
  
  // Show first 2 items max
  const displayItems = order.items.slice(0, 2);
  const remainingCount = order.items.length - 2;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Paper
      elevation={0}
      sx={{
        border: (theme) => `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'box-shadow 0.2s ease-in-out',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      {/* Card Header */}
      <Box
        sx={{
          px: 2.5,
          py: 1.5,
          bgcolor: (theme) => theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50',
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <StorefrontIcon sx={{ fontSize: 20, color: 'primary.main' }} />
            <Typography variant="subtitle2" fontWeight={600}>
              KeyForge
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="caption" color="text.secondary">
              {formatDate(order.createdAt)}
            </Typography>
            <Chip
              label={getStatusLabel(order.orderStatus)}
              color={getStatusColor(order.orderStatus)}
              size="small"
              sx={{ fontWeight: 500 }}
            />
            {order.paymentStatus === PaymentStatus.PAID && (
              <Chip
                label="Paid"
                color="success"
                size="small"
                variant="outlined"
                sx={{ fontWeight: 500 }}
              />
            )}
          </Stack>
        </Stack>
      </Box>

      {/* Card Body - Product Items */}
      <Box sx={{ px: 2.5, py: 2 }}>
        <Stack spacing={2}>
          {displayItems.map((item, index) => (
            <Stack
              key={`${order.orderId}-${item.productId}-${index}`}
              direction="row"
              alignItems="center"
              spacing={2}
            >
              {/* Product Thumbnail */}
              <Box
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: 1,
                  overflow: 'hidden',
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  flexShrink: 0,
                  bgcolor: 'grey.100',
                }}
              >
                <Box
                  component="img"
                  src={item.thumbnailUrl || `https://placehold.co/72x72/e2e8f0/64748b?text=${encodeURIComponent(item.productName.charAt(0))}`}
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
                  Variation: Default
                </Typography>
              </Box>

              {/* Quantity & Price */}
              <Stack alignItems="flex-end" sx={{ flexShrink: 0 }}>
                <Typography variant="body2" color="text.secondary">
                  x{item.quantity}
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  ${(item.unitPrice ?? 0).toFixed(2)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Sub: ${(item.subtotal ?? 0).toFixed(2)}
                </Typography>
              </Stack>
            </Stack>
          ))}

          {remainingCount > 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ pl: 1 }}>
              +{remainingCount} more item{remainingCount > 1 ? 's' : ''}
            </Typography>
          )}
        </Stack>
      </Box>

      <Divider />

      {/* Card Footer */}
      <Box sx={{ px: 2.5, py: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          {/* Order Total */}
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="body2" color="text.secondary">
              Order Total:
            </Typography>
            <Typography variant="h6" fontWeight={700} color="primary.main">
              ${(order.totalAmount ?? 0).toFixed(2)}
            </Typography>
          </Stack>

          {/* Action Buttons */}
          <Stack direction="row" spacing={1.5}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate('/cart')}
              sx={{ minWidth: 100 }}
            >
              Buy Again
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={() => navigate(`/user/orders/${order.orderId}`)}
              sx={{ minWidth: 100 }}
            >
              View Details
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
}
