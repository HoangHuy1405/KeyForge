import { useEffect, useState } from 'react';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Stack,
  Button,
  Select,
  MenuItem,
  FormControl,
  Pagination,
  Avatar,
} from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import {
  getSellerOrders,
  updateOrderStatus,
  OrderListItemDto,
  OrderStatus,
  ResultPaginationDTO,
} from '../../../services/OrderService';

const PAGE_SIZE = 10;

const statusColors: Record<OrderStatus, 'default' | 'primary' | 'warning' | 'success' | 'error'> = {
  [OrderStatus.PENDING]: 'warning',
  [OrderStatus.CONFIRMED]: 'primary',
  [OrderStatus.SHIPPED]: 'info' as any,
  [OrderStatus.DELIVERED]: 'success',
  [OrderStatus.CANCELLED]: 'error',
};

const SellerOrderManagerPage = () => {
  const [orders, setOrders] = useState<OrderListItemDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const fetchOrders = async (page: number) => {
    try {
      setLoading(true);
      const response: ResultPaginationDTO = await getSellerOrders(page, PAGE_SIZE);
      setOrders(response.result);
      setTotalPages(response.meta.pages);
      setCurrentPage(response.meta.page);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch seller orders:', err);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(0);
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      setUpdatingOrderId(orderId);
      await updateOrderStatus(orderId, newStatus);
      // Refresh orders
      await fetchOrders(currentPage);
    } catch (err) {
      console.error('Failed to update order status:', err);
      alert('Failed to update order status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    fetchOrders(page - 1); // MUI Pagination is 1-indexed
  };

  if (loading && orders.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <LocalShippingIcon sx={{ fontSize: 32, color: 'primary.main' }} />
        <Typography variant="h4" fontWeight="bold">
          Order Management
        </Typography>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Orders Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell>Order ID</TableCell>
                <TableCell>Products</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Payment</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">No orders found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.orderId} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        #{order.orderId.slice(0, 8)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        {order.items.slice(0, 3).map((item, idx) => (
                          <Avatar
                            key={idx}
                            src={item.thumbnailUrl || undefined}
                            alt={item.productName}
                            sx={{ width: 32, height: 32 }}
                          />
                        ))}
                        {order.items.length > 3 && (
                          <Typography variant="caption" color="text.secondary">
                            +{order.items.length - 3}
                          </Typography>
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        ${order.totalAmount.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.orderStatus}
                        color={statusColors[order.orderStatus]}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.paymentStatus}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <Select
                          value={order.orderStatus}
                          onChange={(e) =>
                            handleStatusChange(order.orderId, e.target.value as OrderStatus)
                          }
                          disabled={
                            updatingOrderId === order.orderId ||
                            order.orderStatus === OrderStatus.CANCELLED ||
                            order.orderStatus === OrderStatus.DELIVERED
                          }
                        >
                          <MenuItem value={OrderStatus.PENDING}>Pending</MenuItem>
                          <MenuItem value={OrderStatus.CONFIRMED}>Confirmed</MenuItem>
                          <MenuItem value={OrderStatus.SHIPPED}>Shipped</MenuItem>
                          <MenuItem value={OrderStatus.DELIVERED}>Delivered</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <Pagination
              count={totalPages}
              page={currentPage + 1}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        )}
      </Card>
    </Box>
  );
};

export default SellerOrderManagerPage;
