import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Stack,
  Tabs,
  Tab,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import OrderCard from './components/OrderCard';
import {
  OrderListItemDto,
  OrderStatus,
  getMyOrders,
} from '../../services/OrderService';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import RefreshIcon from '@mui/icons-material/Refresh';

// Tab definitions
const ORDER_TABS = [
  { label: 'All', value: undefined },
  { label: 'Pending', value: OrderStatus.PENDING },
  { label: 'To Ship', value: OrderStatus.CONFIRMED },
  { label: 'Shipping', value: OrderStatus.SHIPPED },
  { label: 'Delivered', value: OrderStatus.DELIVERED },
  { label: 'Cancelled', value: OrderStatus.CANCELLED },
] as const;

const PAGE_SIZE = 5;

export default function MyOrdersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState<OrderListItemDto[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get active tab from URL or default to 'All'
  const statusParam = searchParams.get('status');
  const activeTab = ORDER_TABS.findIndex(
    (tab) => tab.value === (statusParam || undefined)
  );
  const currentTabIndex = activeTab >= 0 ? activeTab : 0;
  const currentStatus = ORDER_TABS[currentTabIndex].value;

  // Fetch orders
  const fetchOrders = useCallback(async (page: number, status?: OrderStatus, append = false) => {
    try {
      if (page === 0) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      setError(null);

      const response = await getMyOrders(page, PAGE_SIZE, status);
      const { result, meta } = response;

      if (append) {
        setOrders((prev) => [...prev, ...result]);
      } else {
        setOrders(result);
      }

      // Check if we have more pages
      // meta.page is 0-indexed, meta.pages is total count
      setHasMore(meta.page < meta.pages - 1);
      setCurrentPage(meta.page);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError('Failed to load orders. Please try again.');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  // Load initial data or when tab changes
  useEffect(() => {
    setOrders([]);
    setCurrentPage(0);
    setHasMore(true);
    fetchOrders(0, currentStatus);
  }, [currentStatus, fetchOrders]);

  // Handle tab change
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    const newStatus = ORDER_TABS[newValue].value;
    if (newStatus) {
      setSearchParams({ status: newStatus });
    } else {
      setSearchParams({});
    }
  };

  // Handle load more
  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      fetchOrders(currentPage + 1, currentStatus, true);
    }
  };

  // Handle retry
  const handleRetry = () => {
    fetchOrders(0, currentStatus);
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', pb: 8 }}>
      {/* Page Header */}
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <LocalMallIcon sx={{ fontSize: 32, color: 'primary.main' }} />
        <Typography variant="h4" fontWeight={700}>
          My Orders
        </Typography>
      </Stack>

      {/* Filter Tabs */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          mb: 3,
          bgcolor: 'background.paper',
          borderRadius: 1,
        }}
      >
        <Tabs
          value={currentTabIndex}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              minWidth: 100,
            },
          }}
        >
          {ORDER_TABS.map((tab) => (
            <Tab key={tab.label} label={tab.label} />
          ))}
        </Tabs>
      </Box>

      {/* Error State */}
      {error && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={handleRetry} startIcon={<RefreshIcon />}>
              Retry
            </Button>
          }
          sx={{ mb: 3 }}
        >
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Empty State */}
      {!isLoading && !error && orders.length === 0 && (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            px: 3,
            bgcolor: 'background.paper',
            borderRadius: 2,
            border: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        >
          <LocalMallIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No orders found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {currentStatus
              ? `You don't have any ${ORDER_TABS[currentTabIndex].label.toLowerCase()} orders.`
              : "You haven't placed any orders yet."}
          </Typography>
        </Box>
      )}

      {/* Orders List */}
      {!isLoading && orders.length > 0 && (
        <Stack spacing={2.5}>
          {orders.map((order) => (
            <OrderCard key={order.orderId} order={order} />
          ))}
        </Stack>
      )}

      {/* Load More Button */}
      {!isLoading && hasMore && orders.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="outlined"
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            sx={{ minWidth: 200 }}
          >
            {isLoadingMore ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Loading...
              </>
            ) : (
              'Load More'
            )}
          </Button>
        </Box>
      )}

      {/* End of List */}
      {!isLoading && !hasMore && orders.length > 0 && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: 'center', mt: 4, py: 2 }}
        >
          — You've reached the end —
        </Typography>
      )}
    </Box>
  );
}
