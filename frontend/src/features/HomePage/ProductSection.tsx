import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Stack,
  alpha,
  useTheme,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { getProducts } from '../../services/ProductService';
import { ProductView } from '../Product/ProductListingPage/ProductCard';
import { mapProductListToViews } from '../Product/productMappers';
import ProductGrid from '../Product/ProductListingPage/ProductGrid';
import { parseSortParam } from '../Product/ProductListingPage/productsLoader';

interface ProductSectionProps {
  title?: string;
}

const ProductSection: React.FC<ProductSectionProps> = ({
  title = 'Our Products',
}) => {
  const theme = useTheme();

  const {
    data: products,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery<ProductView[], Error>({
    queryKey: ['homepage-products'],
    queryFn: async () => {
      const sort = parseSortParam('createdAt');
      const data = await getProducts({
        sort: sort ? [sort] : undefined,
      });
      return mapProductListToViews(data);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Only retry once on failure
  });

  // Loading state
  if (isLoading) {
    return (
      <Box sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight="bold">
            {title}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 8,
          }}
        >
          <CircularProgress size={48} />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Loading products...
          </Typography>
        </Box>
      </Box>
    );
  }

  // Error state - inline, not full page
  if (isError) {
    return (
      <Box sx={{ py: 8, px: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight="bold">
            {title}
          </Typography>
        </Box>
        <Box
          sx={{
            maxWidth: 500,
            mx: 'auto',
            p: 4,
            borderRadius: 3,
            backgroundColor: alpha(theme.palette.error.main, 0.08),
            border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
            textAlign: 'center',
          }}
        >
          <ErrorOutlineIcon
            sx={{
              fontSize: 48,
              color: 'error.main',
              mb: 2,
            }}
          />
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Unable to load products
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {error?.message || 'Please check your connection and try again.'}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={isFetching ? <CircularProgress size={18} color="inherit" /> : <RefreshIcon />}
            onClick={() => refetch()}
            disabled={isFetching}
          >
            {isFetching ? 'Retrying...' : 'Try Again'}
          </Button>
        </Box>
      </Box>
    );
  }

  // Empty state
  if (!products || products.length === 0) {
    return (
      <Box sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight="bold">
            {title}
          </Typography>
        </Box>
        <Box
          sx={{
            textAlign: 'center',
            py: 6,
          }}
        >
          <Typography variant="body1" color="text.secondary">
            No products available at the moment.
          </Typography>
        </Box>
      </Box>
    );
  }

  // Success state
  return (
    <Box sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          {title}
        </Typography>
      </Box>
      <ProductGrid products={products} columns={5} spacing={2} mt={2} />
    </Box>
  );
};

export default ProductSection;
